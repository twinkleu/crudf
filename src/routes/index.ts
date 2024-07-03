// import userRoute from "../modules/user/userRoute";


// export default (app: any) => {
//   //USER
//   app.use(`/api/user`, userRoute);
// };
import userRoute from "../modules/user/userRoute";

class Router {
  private app: any;

  constructor(app: any) {
    this.app = app;
  }

  public initializeRoutes() {
    //USER
    this.app.use(`/api/user`, userRoute);
  }
}

export default Router;
