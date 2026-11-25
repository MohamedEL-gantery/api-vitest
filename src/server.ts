import mongoose from "mongoose";
import { app } from "./app.js";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Copy .env.example to .env first.");
  process.exit(1);
}

const port = Number(process.env.PORT ?? 3000);

await mongoose.connect(uri);
app.listen(port, () => {
  console.log(`Orders API listening on http://localhost:${port}`);
});
