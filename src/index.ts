// import express from 'express';
// import dbConfig from './config/db';
// import dotenv from "dotenv";
// import router from "./routes";

// const app = express();

// // Middlewares
// dotenv.config();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const PORT = process.env.PORT;
// const URI = process.env.MONGODB_URI;

// // dbConfig.connect(URI);
// if (!URI) {
//   console.error("MONGODB_URI is not defined in environment variables");
//   process.exit(1);
// } else {
//   dbConfig.connect(URI);
// }
// router(app);

// app.listen(PORT, () => {
//   console.log(`Server is running on PORT: ${PORT}`);
// });
import express from 'express';
import dotenv from "dotenv";
import dbConfig from './config/db';
import Router from './routes'; // Adjust the path as necessary

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
const URI = process.env.MONGODB_URI;

if (URI) {
  dbConfig.connect(URI);
} else {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const router = new Router(app);
router.initializeRoutes();

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
