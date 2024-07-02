import { Router } from "express";
const router = Router({ caseSensitive: true, strict: false });
import checkAuth from "../../middlewares/chechAuth";
import controller from "./userController";

router.post(
  `/register`,
  controller.register
);

   router.post(
    `/login`,
    controller.login
  );

  router.get(
    `/detail/:userId`,
    checkAuth.User,
    controller.detail
  );

  router.put(
    `/update/:userId`,
    checkAuth.User,
    controller.update
  );

  router.delete(
    `/delete/:userId`,
    checkAuth.User,
    controller.deleteAccount
  );

  router.delete(
    `/logout`,
    checkAuth.User,
    controller.logout
  );


export default router;
