import { hashSync, compareSync } from "bcrypt";
import User from "../models/user";
import { sign } from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import Token from "../models/token";


const hashPassword = async (password: string) => {
  const saltRounds = 15;
  return hashSync(password, saltRounds);
};

const checkPassword = async (password: string, hash: string) => {
  return compareSync(password, hash);
};

const toLowerCase = async (text: string) => {
    return text.toLowerCase();
  };

const createToken = async (payload: Object) => {
    try {
      const token = sign(payload, `${process.env.JWT_SECRET}`);
      await Token.create({
        tokenable_type: "jwt",
        tokenable_id: token,
        name: "bearer"
      }).catch((err:any) => {
        console.log(err);
      });
      return token;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteToken = async (token: String) => {
    try {
      Token.deleteMany({ tokenable_id: token }).then((data) => {
        if (!data) {
          throw {
            msg:"data not found"
          }
        } else {
          return true;
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  
export {
  hashPassword,
  checkPassword,
  toLowerCase,
  createToken,
  deleteToken
};
