import mongoose from "mongoose";

const connectToDB = async () => {
    mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to DB`);
};

export default connectToDB;
