import mongoose from "mongoose";

const connectToMongoDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to MongoDb")
    }
    catch(error){
        console.log(error);
    }
}

export default connectToMongoDb;