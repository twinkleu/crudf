import express from 'express';
import dbConfig from './config/db';
import dotenv from "dotenv";
import router from "./routes"

const app = express();

//Middlewares
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT
const URI = process.env.MONGODB_URI


dbConfig(URI)
router(app)

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});




//https://github.com/ahmadjoya/typescript-express-mongoose-starter/blob/main/src/server.ts
//https://github.com/nmanikiran/rest-api-node-typescript