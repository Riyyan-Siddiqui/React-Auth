import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from '../config/env.js';

if(!DB_URI) {
    console.log(DB_URI);
    throw new Error ("Please define the Mongoose URI env varible in .env.<development || production>.local");
}

// Connect to database 
const connectToDatabase = async() => {
    try{
        await mongoose.connect(DB_URI!);

        console.log(`Connected to database in ${NODE_ENV} mode`);

    } catch (err: any) {
        console.error("Error connecting to database: ", err);
        process.exit(1);
    }
}

export default connectToDatabase;