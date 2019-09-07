const express = require('express');

const app = express();
const artistRouter = require('./routes/artistRoute');
const albumRouter = require('./routes/albumRoute');
const userRouter = require('./routes/userRoute');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({
  path: './config.env'
});

const port = process.env.PORT || 3001;

app.use(morgan(process.env.MODE_ENV));
app.use(express.json());

app.use('/musicApi/v1/artist', artistRouter);
app.use('/musicApi/v1/album', albumRouter);
app.use('/musicApi/v1/user', userRouter);

app.listen(port, () => {
  console.log(`Application runing on port ${port}`);
});
