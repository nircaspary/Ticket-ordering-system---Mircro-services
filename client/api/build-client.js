import axios from "axios";

export const buildClient = ({ req: { headers } }) => {
  let baseURL = typeof window === "undefined" ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local" : "";
  return axios.create({ baseURL, headers });
};
