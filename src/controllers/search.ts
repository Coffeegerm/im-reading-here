import { Request, Response } from "express";
import googleBooksService from "../services/googleBooksService";

export const SearchController = {
  search: async (req: Request, res: Response) => {
    try {
      const { query } = req.query;

      // nothing to search on?
      if (!query) {
        return res.status(400).json({
          message: "Please provide a search query",
        });
      }

      // fetch books from google books api
      const response = await googleBooksService.get(`/volumes?q=${query}`);
      const data = response.data;
      res.json(data);
    } catch (error) {
      console.error(error);
    }
  },
};
