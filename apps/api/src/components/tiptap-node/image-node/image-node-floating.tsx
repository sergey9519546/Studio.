import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@app/hooks/use-tiptap-editor"

// --- Lib ---
import { isNodeTypeSelected } from "@app/lib/tiptap-utils"

// --- Tiptap UI ---
import { DeleteNodeButton } from "@app/components/tiptap-ui/delete-node-button"
import { ImageDownloadButton } from "@app/components/tiptap-ui/image-download-button"
import { ImageAlignButton } from "@app/components/tiptap-ui/image-align-button"

// --- UI Primitive ---
import { Separator } from "@app/components/tiptap-ui-primitive/separator"
import { ImageCaptionButton } from "@app/components/tiptap-ui/image-caption-button"
import { ImageUploadButton } from "@app/components/tiptap-ui/image-upload-button"
import { RefreshCcwIcon } from "@app/components/tiptap-icons/refresh-ccw-icon"

export function ImageNodeFloating({
  editor: providedEditor,
}: {
  editor?: Editor | null
}) {
  const { editor } = useTiptapEditor(providedEditor)
  const visible = isNodeTypeSelected(editor, ["image"])

  if (!editor || !visible) {
    return null
  }

  return (
    <>
      <ImageAlignButton align="left" />
      <ImageAlignButton align="center" />
      <ImageAlignButton align="right" />
      <Separator />
      <ImageCaptionButton />
      <Separator />
      <ImageDownloadButton />
      <ImageUploadButton icon={RefreshCcwIcon} tooltip="Replace" />
      <Separator />
      <DeleteNodeButton />
    </>
  )
}
