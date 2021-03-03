import makeRequest from "../makeRequest";

export const index = name => {
  return makeRequest({ url: "/price", params: { fsym: name, tsyms: "USD" } });
};
