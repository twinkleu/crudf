import { Router } from "express";
const router = Router({ caseSensitive: true, strict: false });
import checkAuth from "../../middlewares/chechAuth";
import UserController from "./userController";

router.post(`/register`, UserController.register);

router.post(`/login`, UserController.login);

router.get(`/detail/:userId`, checkAuth.User, UserController.detail);

router.put(`/update/:userId`, checkAuth.User, UserController.update);

router.delete(`/delete/:userId`, checkAuth.User, UserController.deleteAccount);

router.delete(`/logout`, checkAuth.User, UserController.logout);

router.post('/forgot-pwd', UserController.forgotPassword)

router.put('/reset-pwd', UserController.resetPassword)

export default router;
