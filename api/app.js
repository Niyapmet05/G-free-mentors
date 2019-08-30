import express from 'express';
import bodyParser from 'body-parser';
import usersRouter from './routes/userRouter';

// Instantiate express
const app = express();
// initialize url version
app.use(express.json());
const vers = '/api/v1';
// Configure app to user bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(`${vers}`, usersRouter);

// ERRROR HANDLING
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
//defining port
const PORT = 1000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});