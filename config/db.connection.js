const mongoose = require('mongoose');

require('dotenv').config();

const connectionStr = process.env.MONGODB_URI;

mongoose.connect(process.env.MONGODB_URI || connectionStr);


mongoose.connection.on('connected', () => {
    console.log(`[${new Date().toLocaleTimeString()}] - MongoDB connected ... 🙌 🙌 🙌`);
});

mongoose.connection.on('error', (error) => {
    console.log('MongoDB connection error 😥', error);
});

mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected  ⚡️ 🔌 ⚡️'));