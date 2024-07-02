import userRoute from "../modules/user/userRoute";


export default (app: any) => {
  //USER
  app.use(`/api/user`, userRoute);
};
