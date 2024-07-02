import mongoose from "mongoose";


const dbConfig = async (LOCAL_URL: any) => {
    console.log("hi");
  const options: object = {};
  const URI: string = LOCAL_URL;
  await mongoose
    .connect(URI, options)
    .then(() =>
      console.log(
       "MongoDB Connected"
      )
    )
    .catch((err: any) => {
      console.log(err);
    });
};

export default dbConfig;