import express from 'express';
import logger from 'morgan';
import './database'
import { routes } from './routes'
const app = express();

app.use(
    logger('dev'),
    express.json(),
    express.urlencoded({ extended: false }),
    routes
);


app.listen(3333, () => {
    console.log('Server is running on port http://localhost:3333')
});
