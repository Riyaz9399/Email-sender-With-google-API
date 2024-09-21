import express from "express";
import bodyParser from 'body-parser';
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import  sendEmail  from './sendEmail.js';
dotenv.config();
const app = express();
const PORT = 8080;
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/'));
});

app.post('/sendEmail', sendEmail)
      
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
