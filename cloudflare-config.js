// Configuração para o Cloudflare Pages
module.exports = {
  // Configuração de rotas
  routes: [
    // Servir arquivos estáticos diretamente
    {
      pattern: '/assets/*',
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    {
      pattern: '/*.js',
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    {
      pattern: '/*.css',
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    // Todas as outras rotas vão para index.html (App Angular)
    {
      pattern: '/**',
      destination: '/index.html'
    }
  ],
  
  // Manipuladores para o Cloudflare Workers
  handlers: {
    // Manipulador para arquivos estáticos
    staticFiles: {
      '/.js$/': {
        contentType: 'application/javascript; charset=utf-8'
      },
      '/.css$/': {
        contentType: 'text/css; charset=utf-8'
      },
      '/.html$/': {
        contentType: 'text/html; charset=utf-8'
      }
    }
  }
}; 