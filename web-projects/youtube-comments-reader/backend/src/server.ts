import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import routes from './routes';
import { 
  rateLimiter, 
  errorHandler, 
  notFoundHandler, 
  requestLogger, 
  validateContentType,
  securityHeaders 
} from './middleware';

// Carregar variáveis de ambiente
dotenv.config();

// Verificar variáveis obrigatórias
if (!process.env.YOUTUBE_API_KEY) {
  console.error('❌ YOUTUBE_API_KEY não encontrada nas variáveis de ambiente');
  console.error('📝 Copie o arquivo .env.example para .env e adicione sua API key');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware de segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware geral
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
  app.use(requestLogger);
}

// Headers customizados
app.use(securityHeaders);

// Validação de Content-Type
app.use(validateContentType);

// Rate limiting
app.use('/api', rateLimiter);

// Rota de root
app.get('/', (_req, res) => {
  res.json({
    message: '🎥 YouTube Comments Reader API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      comments: '/api/comments?url={youtube_url}&maxResults={number}',
      videoInfo: '/api/video/{videoId}',
      filter: '/api/comments/filter'
    },
    documentation: 'https://github.com/Angeloaqp/Aaqpcode/tree/main/web-projects/youtube-comments-reader',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', routes);

// Middleware de tratamento de erros
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log('🚀 YouTube Comments Reader API');
  console.log(`📡 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${NODE_ENV}`);
  console.log(`📝 API URL: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log('✅ Pronto para receber requisições!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, iniciando graceful shutdown...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT, iniciando graceful shutdown...');
  server.close(() => {
    console.log('✅ Servidor encerrado com sucesso');
    process.exit(0);
  });
});

// Tratamento de exceções não capturadas
process.on('uncaughtException', (error) => {
  console.error('❌ Exceção não capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
  console.error('Promise:', promise);
  process.exit(1);
});

export default app;