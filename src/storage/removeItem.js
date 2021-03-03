import localforage from "localforage";

export async function removeItem(name) {
  return await localforage.removeItem(name);
}
