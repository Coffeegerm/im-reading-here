import { Request, Response } from "express";
import googleBooksService from "../services/googleBooksService";

export const SearchController = {
  search: async (req: Request, res: Response) => {
    try {
      const { query } = req.query;

      // nothing to search on?
      if (!query) {
        return res.status(400).json({
          error: "Please provide a search query",
        });
      }

      // fetch books from google books api
      const response = await googleBooksService.get(`/volumes?q=${query}`);
      const data = response.data;
      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  },

  searchById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: "Please provide a book id",
        });
      }

      const response = await googleBooksService.get(`/volumes/${id}`);
      const data = response.data;
      return res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
};
