import { Router } from 'express';
import CommentsController from '../controllers/commentsController';

const router = Router();
const commentsController = new CommentsController();

// Health check
router.get('/health', commentsController.healthCheck);

// Rotas de comentários
router.get('/comments', commentsController.getComments);
router.post('/comments/filter', commentsController.filterComments);

// Rotas de vídeo
router.get('/video/:videoId', commentsController.getVideoInfo);

export default router;