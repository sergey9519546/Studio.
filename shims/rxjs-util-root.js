// Shim for legacy RxJS root utility used by older Atlaskit bundles
const root =
  (typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
        ? global
        : typeof self !== "undefined"
          ? self
          : {});

export { root };
export default root;
