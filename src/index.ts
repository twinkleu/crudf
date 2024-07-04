// import express from 'express';
// import dotenv from "dotenv";
// import dbConfig from './config/db';
// import Router from './routes';
// //import "./types/express"

// dotenv.config();

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const PORT = process.env.PORT;
// const URI = process.env.MONGODB_URI;

// if (URI) {
//   dbConfig.connect(URI);
// } else {
//   console.error('MONGODB_URI is not defined in environment variables');
//   process.exit(1);
// }

// const router = new Router(app);
// router.initializeRoutes();

// app.listen(PORT, () => {
//   console.log(`Server is running on PORT: ${PORT}`);
// });
////////////////////////****************************** */
//https://www.google.com/search?q=server-1anb&sourceid=chrome&ie=UTF-8
// interface authRequest extends Request {
//   user: IUser;
// }
/////////////////////////////////////////
// import { Request, Response, Router } from 'express';

// const router = Router();

// interface HandlerRequest extends Request {
//     query: {
//         foo: string
//     }
// }

// function getHandler(request: HandlerRequest, response: Response) {
//   const {query: {foo}} = request;

//   if (foo) {
//     // Do something
//   } else {
//     // Otherwise...
//   }       
// }

// router.route('/')
//   .get(getHandler)

/******************************8 */
import Server from './server';

const server = new Server();
server.listen();
