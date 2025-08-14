# 🎥 YouTube Comments Reader - Demo

## 🚀 Como Executar o Projeto

### 1. Backend (Node.js + Express)

```bash
cd backend
npm install
cp .env.example .env
# Edite o arquivo .env e adicione sua YouTube API Key
npm run dev
```

O backend estará rodando em: `http://localhost:5000`

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

O frontend estará rodando em: `http://localhost:3000`

## 🔑 Configuração da YouTube API Key

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **YouTube Data API v3**
4. Crie credenciais (API Key)
5. Adicione a key no arquivo `.env` do backend:

```env
YOUTUBE_API_KEY=sua_api_key_aqui
```

## 📡 Testando a API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Buscar Comentários
```bash
curl "http://localhost:5000/api/comments?url=https://www.youtube.com/watch?v=VIDEO_ID&maxResults=50"
```

### Exemplo de Resposta
```json
{
  "success": true,
  "data": {
    "videoInfo": {
      "title": "Título do Vídeo",
      "channelTitle": "Nome do Canal",
      "viewCount": "1000000",
      "likeCount": "50000",
      "commentCount": "2500"
    },
    "comments": [
      {
        "id": "comment_id",
        "text": "Ótimo vídeo!",
        "author": "Nome do Usuário",
        "likeCount": 15,
        "publishedAt": "2024-01-01T00:00:00Z",
        "sentiment": "positive",
        "replies": []
      }
    ],
    "statistics": {
      "totalComments": 100,
      "averageLikes": 5.2,
      "sentimentDistribution": {
        "positive": 60,
        "negative": 15,
        "neutral": 25
      }
    }
  }
}
```

## 🎯 Funcionalidades Implementadas

### Backend ✅
- ✅ Integração com YouTube Data API v3
- ✅ Extração de comentários e informações do vídeo
- ✅ Análise básica de sentimentos
- ✅ Cálculo de estatísticas
- ✅ Sistema de filtros
- ✅ Rate limiting e middleware de segurança
- ✅ Tratamento robusto de erros
- ✅ Documentação da API

### Frontend (Em Desenvolvimento) 🚧
- 🚧 Interface React com TypeScript
- 🚧 Design responsivo com Tailwind CSS
- 🚧 Componentes interativos para visualização
- 🚧 Gráficos e estatísticas em tempo real
- 🚧 Sistema de filtros avançados
- 🚧 Exportação de dados

## 🔧 Próximos Passos

1. **Completar Frontend**: Implementar todos os componentes React
2. **Análise Avançada**: Integrar ML para análise de sentimentos mais precisa
3. **Cache**: Implementar sistema de cache para otimizar API calls
4. **Paginação**: Adicionar suporte para carregar mais comentários
5. **Export**: Funcionalidade de exportar dados (CSV, JSON)
6. **Dark Mode**: Tema escuro para a interface
7. **PWA**: Transformar em Progressive Web App

## 📊 Demonstração com cURL

Você pode testar a API diretamente com comandos cURL:

```bash
# Buscar comentários de um vídeo popular
curl -X GET "http://localhost:5000/api/comments?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&maxResults=10" \
  -H "Content-Type: application/json"

# Filtrar comentários por sentimento
curl -X POST "http://localhost:5000/api/comments/filter" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": [...], 
    "filters": {
      "sentiment": "positive",
      "minLikes": 5,
      "sortBy": "likes",
      "sortOrder": "desc"
    }
  }'
```

## 🎥 Vídeos Sugeridos para Teste

- Vídeos populares com muitos comentários
- Vídeos educacionais (geralmente comentários positivos)
- Vídeos controversos (mix de sentimentos)
- Vídeos de música (comentários variados)

## 🚨 Limitações da YouTube API

- **Rate Limit**: 10.000 units por dia (gratuito)
- **Comentários por Request**: Máximo 100
- **Comentários Desabilitados**: Alguns vídeos não permitem comentários
- **Comentários Privados**: Não são acessíveis via API

## 🔗 Links Úteis

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Desenvolvido por Angelo** - [GitHub](https://github.com/Angeloaqp)