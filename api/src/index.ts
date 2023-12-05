import express, { Express } from 'express';
import { serviceRouter } from '../router/serviceRouter';

const app: Express = express();
const cors = require('cors');
const port = process.env.PORT;

app.use(cors());

app.use('/', serviceRouter);
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
