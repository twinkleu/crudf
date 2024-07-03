import { hashSync, compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import Token from "../models/token";

class Helper {
  public async hashPassword(password: string): Promise<string> {
    const saltRounds = 15;
    return hashSync(password, saltRounds);
  }

  public async checkPassword(password: string, hash: string): Promise<boolean> {
    return compareSync(password, hash);
  }

  public async toLowerCase(text: string): Promise<string> {
    return text.toLowerCase();
  }

  public async createToken(payload: Object): Promise<string | undefined> {
    try {
      const token = sign(payload, `${process.env.JWT_SECRET}`);
      await Token.create({
        tokenable_type: "jwt",
        tokenable_id: token,
        name: "bearer",
      }).catch((err: any) => {
        console.log(err);
      });
      return token;
    } catch (err) {
      console.log(err);
    }
  }

  public async deleteToken(token: string): Promise<void> {
    try {
      await Token.deleteMany({ tokenable_id: token });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Helper();
