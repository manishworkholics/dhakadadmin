import axios from "axios";

const api = axios.create({
  baseURL: "https://dhakadmatrimony.com" || "",
});

export default api;

