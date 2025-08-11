# 🎥 YouTube Comments Reader

> App web interativo para ler, analisar e visualizar comentários de vídeos do YouTube

## 📝 Descrição

O YouTube Comments Reader é uma aplicação web moderna que permite aos usuários extrair, visualizar e analisar comentários de vídeos do YouTube de forma interativa. Com uma interface intuitiva e recursos avançados de filtragem e análise.

## ✨ Funcionalidades

- ✅ Extração de comentários por URL do vídeo
- ✅ Interface interativa e responsiva
- ✅ Busca e filtros avançados nos comentários
- ✅ Análise de sentimentos dos comentários
- ✅ Estatísticas em tempo real (likes, replies, etc.)
- ✅ Exportação de dados (JSON, CSV)
- ✅ Visualizações e gráficos
- 🚧 Detecção de spam/comentários tóxicos
- 📋 Análise de palavras-chave e trending topics

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, TypeScript
- **API**: YouTube Data API v3
- **Base de Dados**: JSON (para cache local)
- **Deploy**: Frontend (Vercel), Backend (Railway/Heroku)

## ⚙️ Instalação e Configuração

### Pré-requisitos
- [Node.js v18+](https://nodejs.org/)
- [YouTube Data API Key](https://developers.google.com/youtube/v3/getting-started)

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Angeloaqp/Aaqpcode.git
   cd Aaqpcode/web-projects/youtube-comments-reader
   ```

2. **Configure o Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Adicione sua YouTube API Key no arquivo .env
   npm run dev
   ```

3. **Configure o Frontend**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Acesse a aplicação**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🚀 Como Usar

1. **Cole a URL do vídeo do YouTube** no campo de entrada
2. **Clique em "Buscar Comentários"** para extrair os dados
3. **Use os filtros** para encontrar comentários específicos:
   - Por sentimento (positivo, negativo, neutro)
   - Por número de likes
   - Por data de publicação
   - Por palavras-chave
4. **Visualize estatísticas** em gráficos interativos
5. **Exporte os dados** para análise posterior

## 📁 Estrutura do Projeto

```
youtube-comments-reader/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CommentsList.tsx
│   │   │   ├── VideoInput.tsx
│   │   │   ├── Filters.tsx
│   │   │   └── Analytics.tsx
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── types/
│   ├── .env.example
│   └── package.json
├── README.md
└── docs/
```

## 🔑 Configuração da API do YouTube

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **YouTube Data API v3**
4. Crie credenciais (API Key)
5. Adicione a key no arquivo `.env` do backend

## 🧪 API Endpoints

### `GET /api/comments/:videoId`
Busca comentários de um vídeo específico

**Parâmetros:**
- `videoId`: ID do vídeo do YouTube
- `maxResults` (opcional): Número máximo de comentários (padrão: 100)

**Resposta:**
```json
{
  "videoInfo": {
    "title": "Título do Vídeo",
    "channelTitle": "Nome do Canal",
    "publishedAt": "2024-01-01T00:00:00Z"
  },
  "comments": [
    {
      "id": "comment_id",
      "text": "Texto do comentário",
      "author": "Nome do Autor",
      "likeCount": 10,
      "publishedAt": "2024-01-01T00:00:00Z",
      "sentiment": "positive"
    }
  ],
  "totalResults": 150
}
```

## 📊 Funcionalidades Interativas

### 🔍 Filtros Disponíveis
- **Sentimento**: Positivo, Negativo, Neutro
- **Popularidade**: Comentários mais curtidos
- **Data**: Comentários mais recentes/antigos
- **Palavra-chave**: Busca por texto específico
- **Autor**: Filtro por canal/usuário

### 📈 Análises e Estatísticas
- Distribuição de sentimentos
- Comentários mais populares
- Timeline de comentários
- Nuvem de palavras
- Estatísticas do canal

## 🚀 Deploy

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

### Backend (Railway)
```bash
cd backend
npm run build
# Configure as variáveis de ambiente no Railway
railway deploy
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: Nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [MIT](../../LICENSE).

## 👤 Autor

**Angelo** - [@Angeloaqp](https://github.com/Angeloaqp)

## 🙏 Recursos e Inspirações

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!

## 📝 Notas de Desenvolvimento

- Rate limit da API: 10.000 units/dia (uso gratuito)
- Cache local implementado para evitar chamadas desnecessárias
- Tratamento de erros robusto para URLs inválidas
- Interface otimizada para mobile e desktop