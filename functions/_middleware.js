// Middleware para interceptar todas as requisições
export async function onRequest(context) {
  // Obter a requisição e a URL
  const request = context.request;
  const url = new URL(request.url);
  const path = url.pathname;

  // Verificar o tipo de arquivo sendo solicitado
  if (path.endsWith('.js')) {
    // Para arquivos JavaScript
    return setMimeType(context, 'application/javascript; charset=utf-8');
  } else if (path.endsWith('.css')) {
    // Para arquivos CSS
    return setMimeType(context, 'text/css; charset=utf-8');
  } else if (path.endsWith('.json')) {
    // Para arquivos JSON
    return setMimeType(context, 'application/json; charset=utf-8');
  } else if (path.includes('/assets/')) {
    // Para arquivos estáticos em /assets/
    return setCache(context, 'public, max-age=31536000, immutable');
  } else if (path.endsWith('.html') || path === '/' || !path.includes('.')) {
    // Para HTML ou rotas sem extensão (URLs da aplicação Angular)
    return setHeaders(context, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }

  // Para outros tipos de arquivos, continuar normalmente
  return context.next();
}

// Função auxiliar para definir o tipo MIME
async function setMimeType(context, mimeType) {
  const response = await context.next();
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Content-Type', mimeType);
  newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  return newResponse;
}

// Função auxiliar para definir o cache
async function setCache(context, cacheControl) {
  const response = await context.next();
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Cache-Control', cacheControl);
  return newResponse;
}

// Função auxiliar para definir múltiplos cabeçalhos
async function setHeaders(context, headers) {
  const response = await context.next();
  const newResponse = new Response(response.body, response);
  
  for (const [key, value] of Object.entries(headers)) {
    newResponse.headers.set(key, value);
  }
  
  return newResponse;
} 