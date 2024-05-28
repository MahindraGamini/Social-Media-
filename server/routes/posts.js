import express from 'express';
import {getFeedPosts,getUserPosts,likePosts} from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';
const router= express.Router();


router.get('/',verifyToken,getFeedPosts);

router.get('/:userId/posts',verifyToken,getUserPosts);

router.patch('/:id/like',verifyToken,likePosts);

export default router;
