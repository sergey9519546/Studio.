import {
  fetchCollabToken,
  getUrlParam,
  TIPTAP_COLLAB_APP_ID,
  TIPTAP_COLLAB_DOC_PREFIX,
} from "@app/lib/tiptap-collab-utils"
import { TiptapCollabProvider } from "@tiptap-pro/provider"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { Doc as YDoc } from "yjs"

export type CollabContextValue = {
  provider: TiptapCollabProvider | null
  ydoc: YDoc
  hasCollab: boolean
}

export const CollabContext = createContext<CollabContextValue>({
  hasCollab: false,
  provider: null,
  ydoc: new YDoc(),
})

export const CollabConsumer = CollabContext.Consumer
export const useCollab = (): CollabContextValue => {
  const context = useContext(CollabContext)
  if (!context) {
    throw new Error("useCollab must be used within an CollabProvider")
  }
  return context
}

export const useCollaboration = (room: string) => {
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
  const [collabToken, setCollabToken] = useState<string | null>(null)
  const [hasCollab, setHasCollab] = useState<boolean>(true)
  const ydoc = useMemo(() => new YDoc(), [])

  useEffect(() => {
    const noCollabParam = getUrlParam("noCollab")

    // Use requestAnimationFrame to defer the state update to avoid synchronous setState in effect
    const frameId = requestAnimationFrame(() => {
      setHasCollab(parseInt(noCollabParam || "0") !== 1)
    })
    return () => cancelAnimationFrame(frameId)
  }, [])

  useEffect(() => {
    if (!hasCollab) return

    const getToken = async () => {
      const token = await fetchCollabToken()

      // Use requestAnimationFrame to defer the state update to avoid synchronous setState in effect
      const frameId = requestAnimationFrame(() => {
        setCollabToken(token)
      })
      return () => cancelAnimationFrame(frameId)
    }

    getToken()
  }, [hasCollab])

  useEffect(() => {
    if (!hasCollab || !collabToken) return

    const docPrefix = TIPTAP_COLLAB_DOC_PREFIX
    const documentName = room ? `${docPrefix}${room}` : docPrefix
    const appId = TIPTAP_COLLAB_APP_ID

    const newProvider = new TiptapCollabProvider({
      name: documentName,
      appId,
      token: collabToken,
      document: ydoc,
    })

    // Use requestAnimationFrame to defer the state update to avoid synchronous setState in effect
    const frameId = requestAnimationFrame(() => {
      setProvider(newProvider)
    })
    return () => {
      cancelAnimationFrame(frameId)
      // @ts-ignore - TiptapCollabProvider has a destroy method but TypeScript doesn't know about it
      newProvider.destroy?.()
    }
  }, [collabToken, ydoc, room, hasCollab])

  return { provider, ydoc, hasCollab }
}

export function CollabProvider({
  children,
  room,
}: Readonly<{
  children: React.ReactNode
  room: string
}>) {
  const { hasCollab, provider, ydoc } = useCollaboration(room)

  const value = useMemo<CollabContextValue>(
    () => ({
      hasCollab,
      provider,
      ydoc,
    }),
    [hasCollab, provider, ydoc]
  )

  return (
    <CollabContext.Provider value={value}>{children}</CollabContext.Provider>
  )
}
