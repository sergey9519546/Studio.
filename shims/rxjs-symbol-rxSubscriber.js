// Shim for legacy RxJS symbol import
export const rxSubscriber =
  (typeof Symbol === "function" && Symbol("rxSubscriber")) || "@@rxSubscriber";
export default rxSubscriber;
