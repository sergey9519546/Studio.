// Shim for legacy AjaxObservable import paths used by Atlaskit media packages
export const AjaxObservable = {
  create: () => {
    throw new Error("AjaxObservable shim invoked. Replace with rxjs/ajax in production.");
  },
};

export default AjaxObservable;
