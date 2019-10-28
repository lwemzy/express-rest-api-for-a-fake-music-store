const dotenv = require('dotenv');
dotenv.config({
  path: './config.env'
});
const app = require('./app');

const port = process.env.PORT || 3001;

// handling uncaught exception
// should be at the top before any other code
process.on('uncaughtException', err => {
  console.log('UNCAUGHT_EXCEPTION! 💥 Shutting Down');
  console.log(err.name, err.message);
  process.exit(1);
});

app.listen(port, () => {
  console.log(`Application runing on port ${port}`);
});

// handling unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED_REJECTION! 💣 Shutting Down');
  console.log(err.name, err.message);
  //   gracefull shutting down of server
  server.close(() => {
    process.exit(1);
  });
});
