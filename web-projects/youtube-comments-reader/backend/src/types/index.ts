// Types for YouTube Comments Reader Backend

export interface YouTubeVideoInfo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  duration: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
}

export interface YouTubeComment {
  id: string;
  text: string;
  author: string;
  authorChannelId: string;
  authorProfileImageUrl: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
  parentId?: string;
  isReply: boolean;
  sentiment?: 'positive' | 'negative' | 'neutral';
  replies?: YouTubeComment[];
  replyCount: number;
}

export interface CommentsResponse {
  videoInfo: YouTubeVideoInfo;
  comments: YouTubeComment[];
  totalResults: number;
  nextPageToken?: string;
  statistics: {
    totalComments: number;
    averageLikes: number;
    sentimentDistribution: {
      positive: number;
      negative: number;
      neutral: number;
    };
    topAuthors: Array<{
      author: string;
      commentCount: number;
      totalLikes: number;
    }>;
  };
}

export interface APIError {
  code: number;
  message: string;
  details?: string;
}

export interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

export interface FilterOptions {
  sentiment?: 'positive' | 'negative' | 'neutral';
  minLikes?: number;
  maxLikes?: number;
  dateFrom?: string;
  dateTo?: string;
  searchText?: string;
  author?: string;
  sortBy?: 'date' | 'likes' | 'replies';
  sortOrder?: 'asc' | 'desc';
}

// YouTube API Response Types
export interface YouTubeAPIVideoResponse {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      channelId: string;
      publishedAt: string;
      thumbnails: any;
    };
    statistics: {
      viewCount: string;
      likeCount: string;
      commentCount: string;
    };
    contentDetails: {
      duration: string;
    };
  }>;
}

export interface YouTubeAPICommentsResponse {
  items: Array<{
    id: string;
    snippet: {
      topLevelComment: {
        snippet: {
          textDisplay: string;
          authorDisplayName: string;
          authorChannelId: {
            value: string;
          };
          authorProfileImageUrl: string;
          likeCount: number;
          publishedAt: string;
          updatedAt: string;
        };
      };
      totalReplyCount: number;
      replies?: {
        comments: Array<{
          snippet: {
            textDisplay: string;
            authorDisplayName: string;
            authorChannelId: {
              value: string;
            };
            authorProfileImageUrl: string;
            likeCount: number;
            publishedAt: string;
            updatedAt: string;
            parentId: string;
          };
        }>;
      };
    };
  }>;
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}