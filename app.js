const express = require('express');

const app = express();
const artistRouter = require('./routes/artistRoute');
const albumRouter = require('./routes/albumRoute');

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/musicApi/v1/artist', artistRouter);
app.use('/musicApi/v1/album', albumRouter);

app.listen(port, () => {
  console.log(`Application runing on port ${port}`);
});
