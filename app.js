const express = require('express')
const mongoose = require('mongoose')
const userSchema = require('./models/userModel')
const jobSchema = require('./models/jobModel')

const app = express()


mongoose.connect("mongodb+srv://addd:adityasinha@cluster0.p5r28rw.mongodb.net/Transaction?retryWrites=true&w=majority")
const connection = mongoose.connection





async function createJob(job ,user){ // This function will create job and according to that we will update user profile. If there will be error
                                //in reading , writing operation either in job or user , data will not be added in either collection with the help of transaction
    const newUser = new userSchema(user);
    const info = await newUser.save()
    console.log("User added to database");
    console.log(info);

    
    const { userEmail, title, location, salary } = job

    const findUser = await userSchema.findOne({email:userEmail})

    console.log("FInd",findUser)

    const session = await connection.startSession() 

    
    try{

        await session.startTransaction() // Transaction is started is here


        const newJob = await jobSchema.create(  // New Job added
            [
            {
        title,
        location,
        salary,
        poster: findUser._id,
        },
        ],
    { session }
    );


    console.log(newJob[0])
    const jobId = newJob[0].id

    const updateUser = await userSchema.updateOne({email:userEmail},{jobs:[jobId]},{session}) // This job is added to user schema
    console.log("User addedd successfully")
    console.log(updateUser)

  

    await session.commitTransaction()
    const fin = await userSchema.findOne({email:userEmail})
    console.log(fin)

    console.log("Successfully carried out DB transaction");  

    }catch(err){
        console.error(err);
console.log("Failed to complete database operations");
await session.abortTransaction();  // If any error will occur, data will not be added in both the collection

    }
    finally{
        await session.endSession()
    }


}


const mockUser = {
name: "Aditya Sinha",
email: "adityasinha700@gmail.com",
    };

    const mockJob = {
    title: "Software Developer",
    location: "Indore,India",
    salary: "50000",
    userEmail: "adityasinha700@gmail.com", // email of the created user
        }


    createJob(mockJob,mockUser)




app.listen(7777,()=>{
    console.log("Running on 7777")

})
