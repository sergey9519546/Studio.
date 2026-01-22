import "@tldraw/tldraw/tldraw.css";

import {
  AssetRecordType,
  createShapeId,
  createTLStore,
  defaultShapeUtils,
  Editor,
  getSnapshot,
  loadSnapshot,
  TLShape,
  Tldraw,
} from "@tldraw/tldraw";
import throttle from "lodash.throttle";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DiscoveryOverlay } from "../components/whiteboard/DiscoveryOverlay";
import {
  DiscoveryImage,
  discoveryImages,
} from "../components/whiteboard/discoveryData";
import { WhiteboardToolbar } from "../components/whiteboard/WhiteboardToolbar";

const STORAGE_KEY = "studio-whiteboard-store";
const MAGNET_THRESHOLD = 18;
const DECK_OFFSET = 10;
const DECK_FAN_DISTANCE = 40;

type DeckState = {
  id: string;
  shapeIds: string[];
  expanded: boolean;
};

const getDeckId = () =>
  globalThis.crypto?.randomUUID?.() ?? `deck-${Date.now()}-${Math.random()}`;

const isImageShape = (shape: TLShape): shape is TLShape =>
  shape.type === "image";

export default function Whiteboard() {
  const store = useMemo(
    () =>
      createTLStore({
        shapeUtils: defaultShapeUtils,
      }),
    []
  );
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeTool, setActiveTool] = useState("select");
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [decks, setDecks] = useState<Record<string, DeckState>>({});
  const deckRef = useRef(decks);

  useEffect(() => {
    deckRef.current = decks;
  }, [decks]);

  useEffect(() => {
    const snapshot = localStorage.getItem(STORAGE_KEY);
    if (snapshot) {
      loadSnapshot(store, JSON.parse(snapshot));
    }

    const save = throttle(() => {
      const nextSnapshot = getSnapshot(store);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSnapshot));
    }, 1000);

    const cleanup = store.listen(() => save());

    return () => {
      cleanup();
      save.cancel();
    };
  }, [store]);

  const applyMagnetism = useCallback(() => {
    if (!editor) return;
    const selectedShapes = editor.getSelectedShapes();
    if (selectedShapes.length === 0) return;

    const otherShapes = editor
      .getCurrentPageShapes()
      .filter((shape) => !editor.getSelectedShapeIds().includes(shape.id));

    selectedShapes.forEach((shape) => {
      const bounds = editor.getShapePageBounds(shape);
      if (!bounds) return;

      let nextX = bounds.x;
      let nextY = bounds.y;

      otherShapes.forEach((other) => {
        const otherBounds = editor.getShapePageBounds(other);
        if (!otherBounds) return;

        const centerX = bounds.x + bounds.w / 2;
        const centerY = bounds.y + bounds.h / 2;
        const otherCenterX = otherBounds.x + otherBounds.w / 2;
        const otherCenterY = otherBounds.y + otherBounds.h / 2;

        if (Math.abs(centerX - otherCenterX) < MAGNET_THRESHOLD) {
          nextX = otherCenterX - bounds.w / 2;
        }

        if (Math.abs(centerY - otherCenterY) < MAGNET_THRESHOLD) {
          nextY = otherCenterY - bounds.h / 2;
        }

        if (Math.abs(bounds.x - otherBounds.x) < MAGNET_THRESHOLD) {
          nextX = otherBounds.x;
        }

        if (Math.abs(bounds.y - otherBounds.y) < MAGNET_THRESHOLD) {
          nextY = otherBounds.y;
        }
      });

      if (nextX !== bounds.x || nextY !== bounds.y) {
        editor.updateShapes([
          {
            id: shape.id,
            type: shape.type,
            x: nextX,
            y: nextY,
          },
        ]);
      }
    });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handlePointerUp = () => {
      applyMagnetism();
    };

    window.addEventListener("pointerup", handlePointerUp);

    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [applyMagnetism, editor]);

  const setTool = useCallback(
    (tool: string) => {
      if (!editor) return;
      editor.setCurrentTool(tool);
      setActiveTool(tool);
      if (tool === "note") {
        editor.setStyleForNextShapes({ color: "yellow" });
      }
    },
    [editor]
  );

  const setShapeTool = useCallback(
    (shape: "rectangle" | "ellipse") => {
      if (!editor) return;
      editor.setCurrentTool("geo");
      editor.setStyleForNextShapes({ geo: shape });
      setActiveTool(shape);
    },
    [editor]
  );

  const getViewportCenter = useCallback(() => {
    if (!editor) return { x: 0, y: 0 };
    const bounds = editor.getViewportPageBounds();
    if (!bounds) return { x: 0, y: 0 };
    return {
      x: bounds.x + bounds.w / 2,
      y: bounds.y + bounds.h / 2,
    };
  }, [editor]);

  const assignDeck = useCallback(
    (newShapeId: string, overlappingShapeId?: string) => {
      const currentDecks = deckRef.current;
      const targetDeckId = overlappingShapeId
        ? (editor
            ?.getShape(overlappingShapeId)
            ?.meta?.deckId as string | undefined) || getDeckId()
        : getDeckId();

      const nextDeck: DeckState = currentDecks[targetDeckId] || {
        id: targetDeckId,
        shapeIds: [],
        expanded: false,
      };

      const shapeIds = Array.from(
        new Set([newShapeId, ...(overlappingShapeId ? [overlappingShapeId] : []), ...nextDeck.shapeIds])
      );

      setDecks((prev) => ({
        ...prev,
        [targetDeckId]: { ...nextDeck, shapeIds },
      }));

      editor?.updateShapes(
        shapeIds.map((id) => ({
          id,
          type: "image",
          meta: {
            deckId: targetDeckId,
          },
        }))
      );
    },
    [editor]
  );

  const handleSendToCanvas = useCallback(
    (image: DiscoveryImage) => {
      if (!editor) return;

      const assetId = AssetRecordType.createId();
      editor.createAssets([
        {
          id: assetId,
          type: "image",
          typeName: "asset",
          props: {
            w: image.width,
            h: image.height,
            mimeType: "image/jpeg",
            src: image.src,
            name: image.title,
            isAnimated: false,
          },
        },
      ]);

      const { x, y } = getViewportCenter();
      const shapeId = createShapeId();
      const shapeWidth = 420;
      const shapeHeight = (image.height / image.width) * shapeWidth;

      editor.createShapes([
        {
          id: shapeId,
          type: "image",
          x: x - shapeWidth / 2,
          y: y - shapeHeight / 2,
          props: {
            assetId,
            w: shapeWidth,
            h: shapeHeight,
          },
          meta: {},
        },
      ]);

      const nearbyImage = editor
        .getCurrentPageShapes()
        .filter(isImageShape)
        .find((shape) => {
          if (shape.id === shapeId) return false;
          const bounds = editor.getShapePageBounds(shape);
          if (!bounds) return false;
          const distance = Math.hypot(
            bounds.x - (x - shapeWidth / 2),
            bounds.y - (y - shapeHeight / 2)
          );
          return distance < 120;
        });

      if (nearbyImage) {
        assignDeck(shapeId, nearbyImage.id);
      }
    },
    [assignDeck, editor, getViewportCenter]
  );

  const canToggleDeck = useMemo(() => {
    if (!editor) return false;
    const selected = editor.getSelectedShapes();
    if (selected.length === 0) return false;
    const deckId = selected[0].meta?.deckId as string | undefined;
    return Boolean(deckId && decks[deckId]);
  }, [decks, editor]);

  const toggleDeck = useCallback(() => {
    if (!editor) return;
    const selected = editor.getSelectedShapes();
    if (selected.length === 0) return;
    const deckId = selected[0].meta?.deckId as string | undefined;
    if (!deckId) return;

    const deck = deckRef.current[deckId];
    if (!deck) return;

    const expanded = !deck.expanded;
    const baseShape = editor.getShape(deck.shapeIds[0]);
    const baseBounds = baseShape ? editor.getShapePageBounds(baseShape) : null;
    if (!baseBounds) return;

    const updates = deck.shapeIds.map((id, index) => {
      const offset = expanded ? DECK_FAN_DISTANCE * index : DECK_OFFSET * index;
      return {
        id,
        type: "image",
        x: baseBounds.x + offset,
        y: baseBounds.y + offset,
      };
    });

    editor.updateShapes(updates);
    setDecks((prev) => ({
      ...prev,
      [deckId]: { ...deck, expanded },
    }));
  }, [editor]);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
            Infinity Table
          </p>
          <h1 className="text-3xl font-semibold text-ink-primary">Whiteboard</h1>
          <p className="text-sm text-ink-secondary">
            A disappearing interface for discovery, immersion, and transformation.
          </p>
        </div>
        <div className="rounded-full border border-border-subtle bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-ink-muted shadow-sm">
          Magnetic Intelligence · Smart Stacks · Aura
        </div>
      </div>

      <div className="relative min-h-[70vh] flex-1 overflow-hidden rounded-[32px] border border-border-subtle bg-white/80 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <Tldraw
          className="absolute inset-0"
          store={store}
          hideUi
          onMount={(nextEditor) => setEditor(nextEditor)}
        />

        <WhiteboardToolbar
          activeTool={activeTool}
          onToolChange={setTool}
          onShapeChange={setShapeTool}
          discoveryOpen={discoveryOpen}
          onToggleDiscovery={() => setDiscoveryOpen((prev) => !prev)}
          onToggleDeck={toggleDeck}
          canToggleDeck={canToggleDeck}
        />

        <DiscoveryOverlay
          open={discoveryOpen}
          images={discoveryImages}
          onClose={() => setDiscoveryOpen(false)}
          onSendToCanvas={handleSendToCanvas}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Discovery → Immersion",
            description:
              "Let the Aura curate your visual stream, then dive into focus mode with a single gesture.",
          },
          {
            title: "Creation → Transformation",
            description:
              "Sketch, type, and stack ideas as magnetic objects that align themselves into harmony.",
          },
          {
            title: "Refinement → Collection",
            description:
              "Shape the final composition with smart decks, then preserve the state automatically.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-border-subtle bg-white/70 p-5 text-sm text-ink-secondary shadow-sm"
          >
            <h3 className="text-base font-semibold text-ink-primary">{item.title}</h3>
            <p className="mt-2 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
