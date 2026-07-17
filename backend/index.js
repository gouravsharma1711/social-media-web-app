require('dotenv').config();
const app = require('./src/app.js');
const connectToDb = require('./src/database/connectToDb.js');



const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server Run on Port ${port}`);
    connectToDb();
})