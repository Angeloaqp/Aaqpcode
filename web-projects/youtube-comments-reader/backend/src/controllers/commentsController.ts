import { Request, Response } from 'express';
import YouTubeService from '../services/youtubeService';
import { FilterOptions } from '../types';
import { isValidYouTubeUrl } from '../utils/helpers';

class CommentsController {
  private youtubeService: YouTubeService;

  constructor() {
    this.youtubeService = new YouTubeService();
  }

  /**
   * Busca comentários de um vídeo do YouTube
   * GET /api/comments
   */
  getComments = async (req: Request, res: Response): Promise<void> => {
    try {
      const { url, maxResults = 100 } = req.query;

      // Validação da URL
      if (!url || typeof url !== 'string') {
        res.status(400).json({
          error: 'URL do vídeo é obrigatória',
          code: 'MISSING_URL'
        });
        return;
      }

      if (!isValidYouTubeUrl(url)) {
        res.status(400).json({
          error: 'URL do YouTube inválida',
          code: 'INVALID_URL'
        });
        return;
      }

      // Validação do maxResults
      const maxResultsNum = parseInt(maxResults as string);
      if (isNaN(maxResultsNum) || maxResultsNum < 1 || maxResultsNum > 200) {
        res.status(400).json({
          error: 'maxResults deve ser um número entre 1 e 200',
          code: 'INVALID_MAX_RESULTS'
        });
        return;
      }

      // Buscar comentários
      const data = await this.youtubeService.getCompleteCommentsData(url, maxResultsNum);

      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);

      if (error instanceof Error) {
        // Erro específico da API do YouTube
        if (error.message.includes('API do YouTube')) {
          res.status(503).json({
            error: error.message,
            code: 'YOUTUBE_API_ERROR'
          });
          return;
        }

        // Erro de vídeo não encontrado
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            error: error.message,
            code: 'VIDEO_NOT_FOUND'
          });
          return;
        }

        // Erro de URL inválida
        if (error.message.includes('inválida')) {
          res.status(400).json({
            error: error.message,
            code: 'INVALID_URL'
          });
          return;
        }
      }

      // Erro interno do servidor
      res.status(500).json({
        error: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  };

  /**
   * Busca informações de um vídeo específico
   * GET /api/video/:videoId
   */
  getVideoInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { videoId } = req.params;

      if (!videoId) {
        res.status(400).json({
          error: 'ID do vídeo é obrigatório',
          code: 'MISSING_VIDEO_ID'
        });
        return;
      }

      const videoInfo = await this.youtubeService.getVideoInfo(videoId);

      res.json({
        success: true,
        data: videoInfo
      });
    } catch (error) {
      console.error('Erro ao buscar informações do vídeo:', error);

      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({
            error: error.message,
            code: 'VIDEO_NOT_FOUND'
          });
          return;
        }

        if (error.message.includes('API do YouTube')) {
          res.status(503).json({
            error: error.message,
            code: 'YOUTUBE_API_ERROR'
          });
          return;
        }
      }

      res.status(500).json({
        error: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  };

  /**
   * Aplica filtros aos comentários
   * POST /api/comments/filter
   */
  filterComments = async (req: Request, res: Response): Promise<void> => {
    try {
      const { comments, filters } = req.body as {
        comments: any[];
        filters: FilterOptions;
      };

      if (!comments || !Array.isArray(comments)) {
        res.status(400).json({
          error: 'Lista de comentários é obrigatória',
          code: 'MISSING_COMMENTS'
        });
        return;
      }

      let filteredComments = [...comments];

      // Aplicar filtros
      if (filters.sentiment) {
        filteredComments = filteredComments.filter(
          comment => comment.sentiment === filters.sentiment
        );
      }

      if (filters.minLikes !== undefined) {
        filteredComments = filteredComments.filter(
          comment => comment.likeCount >= filters.minLikes!
        );
      }

      if (filters.maxLikes !== undefined) {
        filteredComments = filteredComments.filter(
          comment => comment.likeCount <= filters.maxLikes!
        );
      }

      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filteredComments = filteredComments.filter(
          comment => 
            comment.text.toLowerCase().includes(searchLower) ||
            comment.author.toLowerCase().includes(searchLower)
        );
      }

      if (filters.author) {
        const authorLower = filters.author.toLowerCase();
        filteredComments = filteredComments.filter(
          comment => comment.author.toLowerCase().includes(authorLower)
        );
      }

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filteredComments = filteredComments.filter(
          comment => new Date(comment.publishedAt) >= fromDate
        );
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        filteredComments = filteredComments.filter(
          comment => new Date(comment.publishedAt) <= toDate
        );
      }

      // Aplicar ordenação
      if (filters.sortBy) {
        filteredComments.sort((a, b) => {
          let aValue, bValue;

          switch (filters.sortBy) {
            case 'date':
              aValue = new Date(a.publishedAt).getTime();
              bValue = new Date(b.publishedAt).getTime();
              break;
            case 'likes':
              aValue = a.likeCount;
              bValue = b.likeCount;
              break;
            case 'replies':
              aValue = a.replyCount;
              bValue = b.replyCount;
              break;
            default:
              aValue = 0;
              bValue = 0;
          }

          if (filters.sortOrder === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        });
      }

      res.json({
        success: true,
        data: {
          comments: filteredComments,
          totalFiltered: filteredComments.length,
          totalOriginal: comments.length
        }
      });
    } catch (error) {
      console.error('Erro ao filtrar comentários:', error);

      res.status(500).json({
        error: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  };

  /**
   * Endpoint de health check
   * GET /api/health
   */
  healthCheck = async (req: Request, res: Response): Promise<void> => {
    res.json({
      success: true,
      message: 'YouTube Comments Reader API está funcionando',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  };
}

export default CommentsController;