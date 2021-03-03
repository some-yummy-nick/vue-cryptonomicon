import localforage from "localforage";

export async function getItem(name) {
  return await localforage.getItem(name);
}
