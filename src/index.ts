import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import loggerMiddleware from "./middleware/logger";
import { SearchController } from "./controllers/search";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [`http://localhost:${port}`, "http://127.0.0.1:5173"],
  })
);

// set up logger for requests
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send("I'm reading here!");
});

app.use("/api/search/books", SearchController.search);

app.use('/api/search/books/:id', SearchController.searchById)

app.listen(port, () => {
  console.log(`We have lift off at http://localhost:${port}`);
});
