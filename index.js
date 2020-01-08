import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes';
// express app
const app = express();

app.use(cors());

// body parse configuration
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(router);

// Error handling to catch 404
app.all('*', (_req, res) => {
  res.status(404).json({
    error: 'address Not found'
  });
});

//Starting server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on ${server.address().port}`);
});

export default app;
