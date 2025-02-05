import express, { json, urlencoded } from "express";
import { errorHandler, notFoundErrorHandler } from "@/middleware/error.js";
import initRoutes from "./router/index.js";

const PORT = process.env["PORT"] || "3000";
const app = express();

// middleware
app.use(json());
app.use(urlencoded({ extended: false }));

// routes
initRoutes(app);

// generic error handling
app.use(notFoundErrorHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
