require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

const app = express();

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-learnit.jiiuvyl.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        console.log(`Starting to connect MongoDB ${URI}`);
        await mongoose.connect(URI,{ useNewUrlParser:true, useUnifiedTopology: true});
        console.log('Mongo DB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
connectDB();

// app.get('/', (req, res) => {
//     res.send("Hello World!");
// });
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});