import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { DiscoveryImage } from "./discoveryData";

interface DiscoveryOverlayProps {
  open: boolean;
  images: DiscoveryImage[];
  onClose: () => void;
  onSendToCanvas: (image: DiscoveryImage) => void;
}

const gridVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
      staggerChildren: 0.04,
    },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function DiscoveryOverlay({
  open,
  images,
  onClose,
  onSendToCanvas,
}: DiscoveryOverlayProps) {
  const [focusId, setFocusId] = useState<string | null>(null);

  const focusImage = useMemo(
    () => images.find((image) => image.id === focusId) || null,
    [focusId, images]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-30 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-white/75 backdrop-blur-2xl" />
          <div className="relative z-10 flex items-center justify-between px-8 py-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-ink-muted">
                <Sparkles className="h-4 w-4" />
                Aura Discovery
              </div>
              <h2 className="text-2xl font-semibold text-ink-primary">Living Grid</h2>
              <p className="text-sm text-ink-secondary">
                A fluid stream of references that rearranges itself around your intent.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFocusId(null);
                onClose();
              }}
              className="flex items-center gap-2 rounded-full border border-border-subtle bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-ink-primary shadow-sm transition hover:bg-white"
            >
              Close
              <X className="h-4 w-4" />
            </button>
          </div>

          <motion.div
            className="relative z-10 px-8 pb-10"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
              {images.map((image) => (
                <motion.button
                  key={image.id}
                  type="button"
                  layout
                  variants={itemVariants}
                  onClick={() => setFocusId(image.id)}
                  className="group relative mb-6 w-full overflow-hidden rounded-3xl bg-white/80 shadow-lg transition hover:-translate-y-1"
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="h-auto w-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
                    <div className="p-4 text-left text-white">
                      <p className="text-sm font-semibold">{image.title}</p>
                      <p className="text-xs opacity-80">{image.palette}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {focusImage && (
              <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  layout
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  className="relative w-[min(90vw,880px)] overflow-hidden rounded-[32px] bg-white shadow-2xl"
                >
                  <img
                    src={focusImage.src}
                    alt={focusImage.title}
                    className="h-auto w-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent">
                    <div className="p-8 text-white">
                      <div className="text-xs uppercase tracking-[0.3em] text-white/70">
                        Focus Mode
                      </div>
                      <h3 className="text-2xl font-semibold">{focusImage.title}</h3>
                      <p className="mt-1 text-sm text-white/80">{focusImage.mood}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/60">
                        {focusImage.palette}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            onSendToCanvas(focusImage);
                            setFocusId(null);
                          }}
                          className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/90"
                        >
                          Send to Canvas
                        </button>
                        <button
                          type="button"
                          onClick={() => setFocusId(null)}
                          className="rounded-full border border-white/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/10"
                        >
                          Close Focus
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
