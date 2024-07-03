import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../../models/user";
import Helper from "../../helpers/helper";

class UserController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required" });
      }
      const loweredEmail = await Helper.toLowerCase(email);
      const user = await User.findOne({ "email.value": loweredEmail });
      if (user) {
        return res.status(500).json({ success: false, message: "User is already registered" });
      } else {
        const hashedPassword = await Helper.hashPassword(password);
        const newUser = await User.create({
          "email.value": loweredEmail,
          password: hashedPassword,
        });
        if (!newUser) {
          throw { msg: "Data Not Found" };
        }
        return res.status(200).json({ success: true, msg: "User registered successfully" });
      }
    } catch (err) {
      console.log("err", err);
      return res.status(500).json({ success: false, msg: "Unable to register the user", err });
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loweredEmail = await Helper.toLowerCase(req.body.email);
      const user = await User.findOne({ "email.value": loweredEmail });
      if (!user) {
        throw { msg: "User is not registered" };
      } else if (!(await Helper.checkPassword(req.body.password, user.password))) {
        throw { msg: "Password is incorrect" };
      } else {
        const payload = { id: user._id };
        const token = await Helper.createToken(payload);
        res.status(200).json({
          status: true,
          userStatus: user.status,
          message: "User Logged In Successfully",
          token,
          data: user,
        });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Unable to login", err });
    }
  }

  public async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findOne({
        _id: new mongoose.Types.ObjectId(req.params.userId),
        isDeleted: false,
      });
      if (!user) {
        throw { msg: "Data not found" };
      } else {
        res.status(200).json({
          success: true,
          message: "Details retrieved successfully",
          data: user,
        });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to get the details", err });
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await User.exists({ _id: req.params.userId, isDeleted: false });
      if (!userData) {
        throw { message: "Data Not Found" };
      } else {
        const loweredEmail = await Helper.toLowerCase(req.body.email);
        const existingEmail = await User.findOne({
          "email.value": loweredEmail,
          _id: { $nin: [new mongoose.Types.ObjectId(req.params.userId)] },
        });
        if (existingEmail) {
          throw { message: "Email is already taken" };
        }
        const updatedUser = await User.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(req.params.userId),
            isDeleted: false,
          },
          {
            email: {
              value: loweredEmail,
              is_verified: false,
            },
          },
          { new: true }
        );
        if (!updatedUser) {
          throw { msg: "Data Not Found" };
        } else {
          res.status(200).json({ success: true, message: "Details Updated Successfully" });
        }
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Error while updating the details", err });
    }
  }

  public async deleteAccount(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.body.is_delete) {
        throw { msg: "Invalid Type" };
      } else {
        const updated = await User.updateOne(
          {
            _id: req.params.userId,
            isDeleted: false,
            status: true,
          },
          {
            isDeleted: req.body.is_delete,
            deletedBy: req.id,
          }
        );
        if (!updated) {
          throw { msg: "Data Not Found" };
        } else {
          res.status(200).json({ status: true, msg: "Account Deleted Successfully" });
        }
      }
    } catch (err) {
      res.status(500).json({ status: false, msg: "Something went wrong", err });
    }
  }

  public async logout(req: any, res: Response, next: NextFunction) {
    try {
      const user = await User.findOne({
        _id: new mongoose.Types.ObjectId(req.id),
        status: true,
        isDeleted: false,
      });
      if (!user) {
        throw { msg: "Data not found" };
      } else {
        await Helper.deleteToken(req.token);
        res.status(200).json({ status: true, msg: "Logout Successfully" });
      }
    } catch (err) {
      res.status(500).json({ status: false, msg: "Something went wrong", err });
    }
  }
}

export default new UserController();
