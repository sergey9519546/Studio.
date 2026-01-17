// Shim for legacy RxJS import paths used by Atlaskit media packages
export const tryCatch = (fn) => {
  return (...args) => {
    try {
      return fn(...args);
    } catch (e) {
      return { error: e };
    }
  };
};

export default tryCatch;
