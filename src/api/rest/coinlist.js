import makeRequest from "../makeRequest";

export const index = () => {
  return makeRequest({ url: "/all/coinlist", params: { summary: true } });
};
