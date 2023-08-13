import axios from "axios";
import { GOOGLE_BOOKS_ROUTE } from "../constants/googleBooks";

const googleBooksService = axios.create({
  baseURL: GOOGLE_BOOKS_ROUTE,
  params: {
    key: process.env.GOOGLE_BOOKS_API_KEY,
  },
});

export default googleBooksService;
