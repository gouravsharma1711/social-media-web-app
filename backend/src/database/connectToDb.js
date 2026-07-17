const mongoose= require('mongoose');


const connectToDb=async()=>{
    try {
        const response = await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DB_NAME}`);
        console.log(`Connected to Database. Host: ${response.connection._connectionString}`);
        console.log('connect to db Successfullt 🎉🎉');
    } catch (error) {
        console.log(`Db is not connected Successfully Due to : ${error.message}`);
        
    }
}

module.exports = connectToDb;