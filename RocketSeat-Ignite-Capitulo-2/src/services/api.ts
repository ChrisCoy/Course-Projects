import axios from "axios";

export const api = axios.create({
  baseURL: "http://epic-mcnulty-3a575d.netlify.app/api",
});
