import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import formRoutes from './routes/formRoutes';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', formRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
