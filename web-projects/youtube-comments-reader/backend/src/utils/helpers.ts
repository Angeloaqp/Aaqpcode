/**
 * Utilitários para o YouTube Comments Reader
 */

/**
 * Extrai o ID do vídeo de uma URL do YouTube
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Se não for uma URL, pode ser que já seja um ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
}

/**
 * Análise básica de sentimento usando palavras-chave
 * Implementação simples - pode ser substituída por uma solução mais robusta
 */
export function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = [
    'ótimo', 'excelente', 'maravilhoso', 'incrível', 'fantástico', 'perfeito',
    'love', 'amazing', 'awesome', 'great', 'excellent', 'perfect', 'wonderful',
    'bom', 'legal', 'massa', 'top', 'show', 'lindo', 'parabéns', 'gostei',
    '👍', '❤️', '😍', '🔥', '👏', '🎉', '😊', '😄', '🥰'
  ];

  const negativeWords = [
    'ruim', 'péssimo', 'horrível', 'terrível', 'odeio', 'detesto',
    'hate', 'awful', 'terrible', 'horrible', 'worst', 'bad', 'disgusting',
    'chato', 'irritante', 'nojento', 'decepcionante', 'fraco', 'lixo',
    '👎', '😡', '😠', '🤮', '😤', '💩', '😞', '😢', '🙄'
  ];

  const normalizedText = text.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;

  // Contar palavras positivas
  positiveWords.forEach(word => {
    if (normalizedText.includes(word.toLowerCase())) {
      positiveCount++;
    }
  });

  // Contar palavras negativas
  negativeWords.forEach(word => {
    if (normalizedText.includes(word.toLowerCase())) {
      negativeCount++;
    }
  });

  // Determinar sentimento
  if (positiveCount > negativeCount) {
    return 'positive';
  } else if (negativeCount > positiveCount) {
    return 'negative';
  } else {
    return 'neutral';
  }
}

/**
 * Formata número para exibição (ex: 1000 -> 1K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Formata duração ISO 8601 para formato legível
 */
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1]?.replace('H', '') || '0');
  const minutes = parseInt(match[2]?.replace('M', '') || '0');
  const seconds = parseInt(match[3]?.replace('S', '') || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Valida se uma string é uma URL válida do YouTube
 */
export function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/,
    /^(youtube\.com|youtu\.be)\/.+$/
  ];

  return patterns.some(pattern => pattern.test(url));
}

/**
 * Limpa e normaliza texto de comentário
 */
export function cleanCommentText(text: string): string {
  return text
    .replace(/\n+/g, ' ') // Substituir quebras de linha por espaços
    .replace(/\s+/g, ' ') // Remover espaços extras
    .trim();
}

/**
 * Calcula tempo relativo (ex: "2 horas atrás")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'ano', seconds: 31536000 },
    { label: 'mês', seconds: 2592000 },
    { label: 'dia', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 },
    { label: 'segundo', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} atrás`;
    }
  }

  return 'agora';
}

/**
 * Gera cores para gráficos baseado no índice
 */
export function generateChartColors(count: number): string[] {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
    '#4BC0C0', '#FF6384'
  ];

  return Array.from({ length: count }, (_, index) => colors[index % colors.length]);
}