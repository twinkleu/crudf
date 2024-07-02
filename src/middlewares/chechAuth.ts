import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import mongoose from "mongoose";
import Token from "../models/token";
import User from "../models/user";

const checkAuth = {
    User: async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        throw {
          msg:"Access Token is required"
        };
      } else {
        const bearer = req.headers.authorization.split(" ");
        const bearerToken = bearer[1];

        Token.findOne({ tokenable_id: bearerToken })
          .then((data: any) => {
            if (!data) {
              throw {
               msg:"Invalid Access Token"
              };
            } else {
             verify(
                data.tokenable_id,
                `${process.env.JWT_SECRET}`,
                (err:any, jwt_payload: any) => {
                  if (err) {
                    throw {
                      msg:"User is unauthorized"
                    };
                  } else {
                    User.findOne({
                      _id: new mongoose.Types.ObjectId(jwt_payload.id),
                      status: true,
                      isDeleted: false,
                    })
                      .then((user) => {
                        if (!user) {
                          throw {
                           msg:"Invalid Access Token"
                          };
                        } else {
                          req.token = bearerToken;
                          req.id = user._id;
                          req.status = user.status;
                          next();
                        }
                      })
                      .catch((err) => {
                        res.status(err.statusCode).json({status:false,msg:"Unauthorized",err:err});
                      });
                  }
                }
              );
            }
          })
          .catch((err:any) => {
            res.status(500).json({status:false,msg:"Unauthorized User",err:err});
          });
      }
    } catch (err: any) {
        res.status(500).json({status:false,msg:"Unauthorized User",err:err});
    }
  },
};

export default checkAuth;
