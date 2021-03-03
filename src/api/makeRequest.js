import axios from "axios";

const baseUrl = "https://min-api.cryptocompare.com/data";

export default ({
  url = "/",
  method = "get",
  params = {},
  data = {},
  headers = {}
}) => {
  return axios({
    url: baseUrl + url,
    method,
    params: {
      ...params,
      api_key:
        "8fc0535a2a732c73558d12e61c3904f524af0438d486150759e42c559aa9ee4c"
    },
    data,
    headers
  }).catch(error => {
    throw error;
  });
};
