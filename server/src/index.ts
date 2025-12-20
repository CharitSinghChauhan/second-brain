import dotenv from "dotenv";
import { connectToDB } from "./db/dbConfig.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});


const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connectToDB();
    app.listen(PORT, () => console.log(`server running ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to database or server:", error);
    process.exit(1);
  }
})();
