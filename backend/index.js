import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './Routes/index.js'

dotenv.config();
const app=express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}));


app.get('/', (req, res) => {
  res.send(' Backend Running Smoothly');
});
app.use("/api",routes)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})


