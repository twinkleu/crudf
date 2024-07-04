import express, { Application } from 'express';
import dotenv from 'dotenv';
import dbConfig from './config/db';
import Router from './routes';
import cors from 'cors';

dotenv.config();

class Server {
  public app: Application;
  private port: string | number;
  private dbUri: string | undefined;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4001;
    this.dbUri = process.env.MONGODB_URI;

    this.connectDB();
    this.middlewares();
    this.routes();
  }

  private async connectDB() {
    if (this.dbUri) {
      await dbConfig.connect(this.dbUri);
    } else {
      console.error('MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  private routes() {
    const router = new Router(this.app);
    router.initializeRoutes();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on PORT: ${this.port}`);
    });
  }
}

export default Server;
