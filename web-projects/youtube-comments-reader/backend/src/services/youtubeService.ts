import axios from 'axios';
import { 
  YouTubeVideoInfo, 
  YouTubeComment, 
  CommentsResponse,
  YouTubeAPIVideoResponse,
  YouTubeAPICommentsResponse 
} from '../types';
import { analyzeSentiment, extractVideoId } from '../utils/helpers';

class YouTubeService {
  private apiKey: string;
  private baseURL = 'https://www.googleapis.com/youtube/v3';
  private isDemoMode: boolean;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
    this.isDemoMode = !this.apiKey || this.apiKey === 'demo_key_configure_sua_api_key_real';
    
    if (this.isDemoMode) {
      console.log('⚠️  Executando em MODO DEMO - Configure uma YouTube API Key real para funcionalidade completa');
    }
  }

  /**
   * Dados de demonstração quando não há API key
   */
  private getDemoData(videoId: string): CommentsResponse {
    return {
      videoInfo: {
        id: videoId,
        title: "Vídeo de Demonstração - Configure sua YouTube API Key",
        description: "Este é um exemplo de resposta quando o app roda em modo demo.",
        channelTitle: "Canal de Demonstração",
        channelId: "demo_channel_id",
        publishedAt: new Date().toISOString(),
        viewCount: "1000000",
        likeCount: "50000",
        commentCount: "2500",
        duration: "PT3M45S",
        thumbnails: {
          default: { url: "https://via.placeholder.com/120x90", width: 120, height: 90 },
          medium: { url: "https://via.placeholder.com/320x180", width: 320, height: 180 },
          high: { url: "https://via.placeholder.com/480x360", width: 480, height: 360 }
        }
      },
      comments: [
        {
          id: "demo_comment_1",
          text: "Ótimo vídeo! Muito bem explicado 👍",
          author: "UsuarioDemo1",
          authorChannelId: "demo_channel_1",
          authorProfileImageUrl: "https://via.placeholder.com/50x50",
          likeCount: 15,
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          isReply: false,
          replyCount: 2,
          sentiment: "positive",
          replies: [
            {
              id: "demo_reply_1",
              text: "Concordo totalmente!",
              author: "UsuarioDemo2",
              authorChannelId: "demo_channel_2",
              authorProfileImageUrl: "https://via.placeholder.com/50x50",
              likeCount: 3,
              publishedAt: new Date(Date.now() - 82800000).toISOString(),
              updatedAt: new Date(Date.now() - 82800000).toISOString(),
              parentId: "demo_comment_1",
              isReply: true,
              replyCount: 0,
              sentiment: "positive"
            }
          ]
        },
        {
          id: "demo_comment_2",
          text: "Não gostei muito dessa parte, poderia ser melhor explicado",
          author: "CriticoDemo",
          authorChannelId: "demo_channel_3",
          authorProfileImageUrl: "https://via.placeholder.com/50x50",
          likeCount: 2,
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          isReply: false,
          replyCount: 0,
          sentiment: "negative",
          replies: []
        },
        {
          id: "demo_comment_3",
          text: "Informativo, obrigado por compartilhar",
          author: "EstudanteDemo",
          authorChannelId: "demo_channel_4",
          authorProfileImageUrl: "https://via.placeholder.com/50x50",
          likeCount: 8,
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          updatedAt: new Date(Date.now() - 259200000).toISOString(),
          isReply: false,
          replyCount: 1,
          sentiment: "neutral",
          replies: []
        }
      ],
      totalResults: 3,
      statistics: {
        totalComments: 4, // Incluindo replies
        averageLikes: 7,
        sentimentDistribution: {
          positive: 2,
          negative: 1,
          neutral: 1
        },
        topAuthors: [
          { author: "UsuarioDemo1", commentCount: 1, totalLikes: 15 },
          { author: "EstudanteDemo", commentCount: 1, totalLikes: 8 },
          { author: "UsuarioDemo2", commentCount: 1, totalLikes: 3 }
        ]
      }
    };
  }

  /**
   * Extrai informações do vídeo pelo ID
   */
  async getVideoInfo(videoId: string): Promise<YouTubeVideoInfo> {
    if (this.isDemoMode) {
      return this.getDemoData(videoId).videoInfo;
    }

    try {
      const response = await axios.get<YouTubeAPIVideoResponse>(`${this.baseURL}/videos`, {
        params: {
          key: this.apiKey,
          id: videoId,
          part: 'snippet,statistics,contentDetails'
        }
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Vídeo não encontrado');
      }

      const video = response.data.items[0];
      
      return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        channelTitle: video.snippet.channelTitle,
        channelId: video.snippet.channelId,
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        commentCount: video.statistics.commentCount,
        duration: video.contentDetails.duration,
        thumbnails: {
          default: video.snippet.thumbnails.default,
          medium: video.snippet.thumbnails.medium,
          high: video.snippet.thumbnails.high
        }
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Erro na API do YouTube: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Busca comentários de um vídeo
   */
  async getVideoComments(
    videoId: string, 
    maxResults: number = 100,
    pageToken?: string
  ): Promise<{ comments: YouTubeComment[]; nextPageToken?: string; totalResults: number }> {
    if (this.isDemoMode) {
      const demoData = this.getDemoData(videoId);
      return {
        comments: demoData.comments,
        totalResults: demoData.totalResults
      };
    }

    try {
      const response = await axios.get<YouTubeAPICommentsResponse>(`${this.baseURL}/commentThreads`, {
        params: {
          key: this.apiKey,
          videoId: videoId,
          part: 'snippet,replies',
          maxResults: Math.min(maxResults, 100), // YouTube limita a 100 por requisição
          order: 'relevance',
          textFormat: 'plainText',
          pageToken
        }
      });

      const comments: YouTubeComment[] = [];

      for (const item of response.data.items) {
        const topComment = item.snippet.topLevelComment.snippet;
        
        // Comentário principal
        const comment: YouTubeComment = {
          id: item.id,
          text: topComment.textDisplay,
          author: topComment.authorDisplayName,
          authorChannelId: topComment.authorChannelId?.value || '',
          authorProfileImageUrl: topComment.authorProfileImageUrl,
          likeCount: topComment.likeCount,
          publishedAt: topComment.publishedAt,
          updatedAt: topComment.updatedAt,
          isReply: false,
          replyCount: item.snippet.totalReplyCount,
          sentiment: analyzeSentiment(topComment.textDisplay),
          replies: []
        };

        // Adicionar respostas se existirem
        if (item.snippet.replies) {
          for (const replyItem of item.snippet.replies.comments) {
            const reply = replyItem.snippet;
            comment.replies!.push({
              id: `${item.id}_${reply.parentId}`,
              text: reply.textDisplay,
              author: reply.authorDisplayName,
              authorChannelId: reply.authorChannelId?.value || '',
              authorProfileImageUrl: reply.authorProfileImageUrl,
              likeCount: reply.likeCount,
              publishedAt: reply.publishedAt,
              updatedAt: reply.updatedAt,
              parentId: reply.parentId,
              isReply: true,
              replyCount: 0,
              sentiment: analyzeSentiment(reply.textDisplay)
            });
          }
        }

        comments.push(comment);
      }

      return {
        comments,
        nextPageToken: response.data.nextPageToken,
        totalResults: response.data.pageInfo.totalResults
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Erro na API do YouTube: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Busca comentários completos com informações do vídeo e estatísticas
   */
  async getCompleteCommentsData(videoUrl: string, maxResults: number = 100): Promise<CommentsResponse> {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('URL do YouTube inválida');
    }

    if (this.isDemoMode) {
      return this.getDemoData(videoId);
    }

    // Buscar informações do vídeo e comentários em paralelo
    const [videoInfo, commentsData] = await Promise.all([
      this.getVideoInfo(videoId),
      this.getVideoComments(videoId, maxResults)
    ]);

    // Calcular estatísticas
    const allComments = commentsData.comments.flatMap(c => [c, ...(c.replies || [])]);
    const statistics = this.calculateStatistics(allComments);

    return {
      videoInfo,
      comments: commentsData.comments,
      totalResults: commentsData.totalResults,
      nextPageToken: commentsData.nextPageToken,
      statistics
    };
  }

  /**
   * Calcula estatísticas dos comentários
   */
  private calculateStatistics(comments: YouTubeComment[]) {
    const totalComments = comments.length;
    const totalLikes = comments.reduce((sum, c) => sum + c.likeCount, 0);
    const averageLikes = totalComments > 0 ? totalLikes / totalComments : 0;

    // Distribuição de sentimentos
    const sentiments = comments.reduce((acc, c) => {
      if (c.sentiment) {
        acc[c.sentiment]++;
      }
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });

    // Top autores
    const authorStats = comments.reduce((acc, c) => {
      if (!acc[c.author]) {
        acc[c.author] = { commentCount: 0, totalLikes: 0 };
      }
      acc[c.author].commentCount++;
      acc[c.author].totalLikes += c.likeCount;
      return acc;
    }, {} as Record<string, { commentCount: number; totalLikes: number }>);

    const topAuthors = Object.entries(authorStats)
      .map(([author, stats]) => ({ author, ...stats }))
      .sort((a, b) => b.totalLikes - a.totalLikes)
      .slice(0, 10);

    return {
      totalComments,
      averageLikes,
      sentimentDistribution: sentiments,
      topAuthors
    };
  }
}

export default YouTubeService;