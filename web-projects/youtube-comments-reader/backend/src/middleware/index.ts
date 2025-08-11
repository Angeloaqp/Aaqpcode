import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Middleware de rate limiting
 */
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos por padrão
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // 100 requests por IP por janela
  message: {
    error: 'Muitas requisições. Tente novamente em alguns minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      error: 'Muitas requisições. Tente novamente em alguns minutos.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000)
    });
  }
});

/**
 * Middleware de tratamento de erros globais
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Erro não tratado:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Não expor detalhes do erro em produção
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
    ...(isDevelopment && { details: error.message, stack: error.stack })
  });
};

/**
 * Middleware para rotas não encontradas
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Rota não encontrada',
    code: 'NOT_FOUND',
    path: req.path,
    method: req.method
  });
};

/**
 * Middleware de log de requisições (desenvolvimento)
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  if (process.env.NODE_ENV === 'development') {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
  }
  
  next();
};

/**
 * Middleware de validação de Content-Type para POST/PUT
 */
export const validateContentType = (req: Request, res: Response, next: NextFunction): void => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json')) {
      res.status(400).json({
        error: 'Content-Type deve ser application/json',
        code: 'INVALID_CONTENT_TYPE'
      });
      return;
    }
  }
  
  next();
};

/**
 * Middleware de headers de segurança customizados
 */
export const securityHeaders = (_req: Request, res: Response, next: NextFunction): void => {
  // Adicionar headers personalizados
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-Powered-By', 'YouTube Comments Reader');
  
  next();
};