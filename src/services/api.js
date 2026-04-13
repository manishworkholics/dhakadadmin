import axios from "axios";

const api = axios.create({
  baseURL: "http://143.110.244.163:5000" || "",
});

export default api;

