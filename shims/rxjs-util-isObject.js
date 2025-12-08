// Shim for legacy RxJS import paths used by Atlaskit media packages
export const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
export default isObject;
