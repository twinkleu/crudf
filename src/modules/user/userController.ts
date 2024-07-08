import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../../models/user";
import Helper from "../../helpers/helper";
import Mail from "../../helpers/mail"
import message from "./userConstant"


interface CustomRequest extends Request {
  id?: string;
  token?: string; 
  // body: {
  //   email?: string;
  //   password?: string; 
  //   is_delete?: boolean; 
  //   verify_token?: string; 
  // };
  // params: {
  //   userId?: string; 
  // }
}


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


  public async deleteAccount(req:CustomRequest, res: Response, next: NextFunction) {

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

  public async logout(req:CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.token) {
        return res.status(400).json({ status: false, msg: "Token is required" });
      }
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

public async forgotPassword(req:any,res:Response,next:NextFunction){
  try {
    User.findOneAndUpdate(
      {
        "email.value": await Helper.toLowerCase(req.body.email),
      },
      {
        verifyToken: await Helper.randomToken(),
      },
      {
        new: true,
      }
    )
      .then(async (data: any) => {
        if (!data) {
          throw {
            message:"Data Not Found"
          };
        } else {
          const payload= {
            to: data?.email.value,
            userData:data,
            title:message.resetPassword,
            data: `${process.env.RESET_PWD}?token=${data.verifyToken}`,
              };
         await Mail.sendMail(payload)
         res.status(200).json({ success: true, message: "A mail with reset link sent successfully" });
        }
      })
      .catch((err) => {
        res.status(500).json({ status: false, msg: "Something went wrong", err });
      });
  } catch (err) {
    res.status(500).json({ status: false, msg: "Something went wrong", err });
  }
}


public async resetPassword(req:any,res:Response,next:NextFunction){
    try {
      User.findOne({
        verifyToken: req.body.verify_token
      })
        .then(async (data: any) => {
          //console.log("data",data)
          if (!data) {
            throw {
              msg:"Invalid Token"
            };
          } else if ((await Helper.minutes(data.updatedAt)) >= 10) {
            throw {
             msg:"Token Expired"
            };
          } else if (
            (await Helper.checkPassword(req.body.password, data.password)) === true
          ) {
            throw {
              msg:"New Password should be different from your old password"
            };
          } else {
            User.findOneAndUpdate(
              {
                verifyToken: req.body.verify_token
              },
              {
                password: await Helper.hashPassword(req.body.password),
                verifyToken: null,
              },
              {
                new: true,
              }
            )
              .then((data) => {
                if (!data) {
                  throw {
                    msg:"Data not found"
                  };
                } else {
                  res.status(200).json({ status: true, msg: "password changed Successfully" });
                }
              })
              .catch((err) => {
                res.status(500).json({ status: false, msg: "Something went wrong", err });
              });
          }
        })
        .catch((err) => {
          res.status(500).json({ status: false, msg: "Something went wrong", err });
        });
    } catch (err) {
      res.status(500).json({ status: false, msg: "Something went wrong", err });
    }
  }
}

export default new UserController();
