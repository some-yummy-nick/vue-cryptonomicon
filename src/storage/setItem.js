import localforage from "localforage";

export const setItem = (name, value) => {
  localforage.setItem(name, value).catch(error => console.error(error));
};
