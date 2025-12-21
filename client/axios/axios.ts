import axios from "axios";
import { useRouter } from "next/navigation";

export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  timeout: 1000,
  withCredentials: true,
});

