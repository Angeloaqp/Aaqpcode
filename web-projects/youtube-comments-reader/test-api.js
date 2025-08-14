#!/usr/bin/env node

/**
 * Script de teste para a API do YouTube Comments Reader
 * Execute: node test-api.js
 */

const axios = require('axios').default;

const API_BASE = 'http://localhost:5000';

// Cores para output no terminal
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

async function testHealthCheck() {
  log('\n🔍 Testando Health Check...', 'blue');
  try {
    const response = await axios.get(`${API_BASE}/api/health`);
    log('✅ Health Check OK', 'green');
    log(`   Status: ${response.status}`);
    log(`   Message: ${response.data.message}`);
    return true;
  } catch (error) {
    log('❌ Health Check falhou', 'red');
    log(`   Erro: ${error.message}`);
    return false;
  }
}

async function testCommentsAPI() {
  log('\n🎥 Testando API de Comentários...', 'blue');
  
  // URL de exemplo (video popular do YouTube)
  const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Roll
  
  try {
    log('📡 Buscando comentários...', 'yellow');
    const response = await axios.get(`${API_BASE}/api/comments`, {
      params: {
        url: testUrl,
        maxResults: 10
      }
    });

    log('✅ Comentários obtidos com sucesso!', 'green');
    
    const data = response.data.data;
    log(`   Título: ${data.videoInfo.title}`);
    log(`   Canal: ${data.videoInfo.channelTitle}`);
    log(`   Views: ${data.videoInfo.viewCount}`);
    log(`   Likes: ${data.videoInfo.likeCount}`);
    log(`   Total de comentários: ${data.statistics.totalComments}`);
    
    log('\n📊 Distribuição de Sentimentos:', 'bold');
    log(`   Positivos: ${data.statistics.sentimentDistribution.positive}`);
    log(`   Negativos: ${data.statistics.sentimentDistribution.negative}`);
    log(`   Neutros: ${data.statistics.sentimentDistribution.neutral}`);
    
    if (data.comments.length > 0) {
      log('\n💬 Primeiros comentários:', 'bold');
      data.comments.slice(0, 3).forEach((comment, index) => {
        log(`   ${index + 1}. ${comment.author}: "${comment.text.substring(0, 100)}..."`);
        log(`      Likes: ${comment.likeCount} | Sentimento: ${comment.sentiment}`);
      });
    }
    
    return true;
  } catch (error) {
    log('❌ Erro ao buscar comentários', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`);
      log(`   Erro: ${error.response.data.error}`);
      if (error.response.data.code === 'YOUTUBE_API_ERROR') {
        log('   💡 Verifique se sua YouTube API Key está configurada!', 'yellow');
      }
    } else {
      log(`   Erro: ${error.message}`);
    }
    return false;
  }
}

async function testInvalidUrl() {
  log('\n🚫 Testando URL inválida...', 'blue');
  try {
    await axios.get(`${API_BASE}/api/comments`, {
      params: {
        url: 'https://invalid-url.com',
        maxResults: 10
      }
    });
    log('❌ Deveria ter falhado com URL inválida', 'red');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log('✅ Validação de URL funcionando corretamente', 'green');
      log(`   Erro: ${error.response.data.error}`);
    } else {
      log('❌ Erro inesperado', 'red');
    }
  }
}

async function runTests() {
  log('🎥 YouTube Comments Reader - Teste da API', 'bold');
  log('=' * 50);

  // Verificar se o servidor está rodando
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    log('\n❌ Servidor não está rodando. Execute "npm run dev" no backend primeiro!', 'red');
    process.exit(1);
  }

  // Testar funcionalidades
  await testCommentsAPI();
  await testInvalidUrl();

  log('\n🎉 Testes concluídos!', 'bold');
  log('\n📝 Para usar a API:', 'blue');
  log('   1. Configure sua YouTube API Key no arquivo .env');
  log('   2. Execute o backend: cd backend && npm run dev');
  log('   3. Execute o frontend: cd frontend && npm run dev');
  log('   4. Acesse: http://localhost:3000');
}

// Executar testes se o arquivo for executado diretamente
if (require.main === module) {
  runTests().catch(error => {
    log(`\n❌ Erro fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runTests };