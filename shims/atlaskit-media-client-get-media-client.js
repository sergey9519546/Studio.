export * from "@atlaskit/media-client/dist/esm/index.js";

import { MediaClient } from "@atlaskit/media-client/dist/esm/client/media-client.js";

export const getMediaClient = (
  mediaClientConfig,
  store,
  mediaApi
) => new MediaClient(mediaClientConfig, store, mediaApi);

export default getMediaClient;
export const isMimeTypeSupportedByBrowser = () => true;
export const getMediaTypeFromMimeType = (mimeType) => {
  if (!mimeType) {
    return "file";
  }

  const type = mimeType.toLowerCase();
  if (type.startsWith("image/")) {
    return "image";
  }
  if (type.startsWith("video/")) {
    return "video";
  }
  return "file";
};
export const isImageMimeTypeSupportedByBrowser = (mimeType) =>
  getMediaTypeFromMimeType(mimeType) === "image";
