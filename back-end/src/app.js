import express from 'express';
import router from './router/router.js';
import cors from "cors";
import ConnectionDB from './config/connectionDB.js';

const app = express();
const port = 5000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.use('/', router);

ConnectionDB.connect().then(() => {
  console.log('Connected to the database');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error.message);
});
