import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../../models/user";
import {
  checkPassword,
  createToken,
  deleteToken,
  hashPassword,
  toLowerCase,
} from "../../helpers/helper";

const register = async (req: Request, res: Response, next: NextFunction) => {
try{
     const {email,password} = req.body;
     if (!email || ! password){
        return res.status(400).json({success:false, message:"Email and Password is required"})
     }
     const user = await User.findOne({
        "email.value":await toLowerCase(req.body.email)
     })
     if(user){
        return res.status(500).json({success:false, message:"User is already registered"})
     } else{
      await User.create({
        "email.value":await toLowerCase(req.body.email),
         password:await hashPassword(req.body.password)
      })
      .then((data)=>{
        if(!data){
          throw{
            msg:"Data Not Found"
          }
        }else{
          return res.status(200).json({success:true,msg:"User registered successfully"})
        }
      })
      .catch((err)=>{
        console.log("err2",err)
         throw{
            msg:"Failed to register",
            err:err
           }
      })
     }
 } catch(err){
    console.log("err",err)
      return res.status(500).json({success:false,msg:"Unable to register the user",err:err})
   }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      User.findOne({ "email.value": await toLowerCase(req.body.email) })
        .then(async (data: any) => {
          if (!data) {
            throw {
            msg:"User is not registered"
            };
          } else if (
            (await checkPassword(req.body.password, data.password)) !== true
          ) {
            throw {
            msg:"Password is incorrect"
            };
          } 
          else {
            const payload = {
              id: data._id,
            };
            res.status(200).json({
              status: true,
              userStatus: data.status,
              message:"User Logged In Successfully",
              token:await createToken(payload),
              data:data,
            });
          }
        })
        .catch((err:any) => {
          res.status(500).json({success:false, message:"Failed to login",err:err});
        });
    } catch (err) {
      res.status(500).json({
        success:false, message:"Unable to login",err:err});
    }
  };

const detail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.params.userId),
      isDeleted: false,
    })
      .then(async (data: any) => {
        if (!data) {
          throw {
           msg:"Data not found"
          };
        } else {
          res.status(200).json({
            success:true,
            message:"Details got successfully",
            data:data,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          success:false,
          message:"Failed to get the details", 
          err:err
        });
      });
  } catch (err) {
    res.status(500).json({
      success:false,
      message:"Failed to get the details", 
      err:err
    });
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    User.exists({ _id: req.params.userId, isDeleted: false })
      .then(async (userData) => {
        if (!userData) {
          throw {
           message:"Data Not Found"
          };
        } else {
          const existingEmail = await User.findOne({
            "email.value": await toLowerCase(req.body.email),
            _id: { $nin: [new mongoose.Types.ObjectId(req.params.userId)] },
          });
          if (existingEmail) {
            throw {
             message:"Email is already taken"
            };
          }
            await User.findOneAndUpdate(
              {
                _id: new mongoose.Types.ObjectId(req.params.userId),
                isDeleted: false
              },
              {
                email: {
                  value: await toLowerCase(req.body.email),
                  is_verified: false,
                }
              },
              { new: true }
            )
              .then((data) => {
                if (!data) {
                  throw {
                    msg:"Data Not Found"
                  };
                } else {
                  res.status(200).json({
                   success:true,
                   message:"Details Updated Successfully"
                  });
                }
              })
              .catch((err) => {
                res.status(500).json({
                 success:true,
                 message:"Error while updatig the details",
                 err:err           
                });
              });
           }
      })
      .catch((err) => {
        res.status(500).json({
          success:true,
          message:"Error while updatig the details",
          err:err           
         });
      });
  } catch (err) {
    res.status(500).json({
      success:true,
      message:"Error while updatig the details",
      err:err           
     });
  }
};


const deleteAccount = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.is_delete) {
      throw {
         msg:"Invalid Type"
      };
    } else {
      User.updateOne(
        {
          _id:req.params.userId,
          isDeleted: false,
          status: true,
        },
        {
              isDeleted: req.body.is_delete,
              deletedBy: req.id,
        }
      )
        .then((data) => {
          if (!data) {
            throw {
            msg:"Data Not Found"
            };
          } else {
            res.status(200).json({
             status:true,
             msg:"Account Deleted Successfully"
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
           status:false,
           msg:"Something went wrong"
          });
        });
    }
  } catch (err) {
    res.status(500).json({
      status:false,
      msg:"Something wnet wrong",
      err:err
    });
  }
};

const logout = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      status: true,
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
           msg:"Data not found"
          };
        } else {
          await deleteToken(req.token);
          res.status(200).json({
            status:true,
            msg:"Logout Successfully"
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
         status:false,
         msg:"Something went wrong"
        });
      });
  } catch (err) {
    res.status(500).json({
      status:false,
      msg:"Something went wrong"
     });
  }
};

export default {
  register,
  login,
  detail,
  update,
  deleteAccount,
  logout
};
