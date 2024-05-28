import express from 'express';
import mongoose from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import { register } from './controllers/auth.js';
import authRoutes from "./routes/auth.js";
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js';
import { verifyToken } from './middleware/auth.js';
// Configurations and middleware
import {createPost} from './controllers/posts.js';
import User from './models/User.js'
import Post from './models/Posts.js';

import { users,posts } from './data/index.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Routes
app.post("/auth/reg", upload.single("picture"), register);
app.post('/posts',verifyToken,upload.single("picture"),createPost);
app.use('/auth',authRoutes)
app.use('/users',userRoutes);
app.use('/posts',postRoutes);
// Connecting to the DB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));

   // User.insertMany(users);
    //Post.insertMany(posts);
}).catch((err) => {
    console.error('Error connecting to the database:', err);
});
