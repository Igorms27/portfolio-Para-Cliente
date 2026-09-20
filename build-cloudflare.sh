#!/bin/bash

# Script para construir o projeto Angular para o Cloudflare Pages

# Configurar node
export NODE_VERSION="20.19.0"

# Limpar a pasta dist
echo "Limpando pasta dist..."
rm -rf dist

# Instalar dependências
echo "Instalando dependências..."
corepack yarn install --immutable

# Construir o projeto
echo "Construindo o projeto..."
corepack yarn run build:cloudflare

# Copiar arquivos adicionais
echo "Copiando arquivos adicionais..."
cp src/_redirects dist/cloudflare/

# Criar a estrutura de diretórios para o Cloudflare Pages Functions
echo "Criando estrutura do Cloudflare Pages Functions..."
mkdir -p dist/cloudflare/functions

# Criar o arquivo _middleware.js
cat <<EOF > dist/cloudflare/functions/_middleware.js
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
EOF

# Criar o arquivo package.json para o Cloudflare Pages Functions
cat <<EOF > dist/cloudflare/functions/package.json
{
  "name": "portifolio-functions",
  "version": "1.0.0",
  "description": "Cloudflare Pages Functions para o portfólio",
  "main": "_middleware.js",
  "type": "module",
  "dependencies": {}
}
EOF

# Criar o arquivo _headers se não existir
if [ ! -f dist/cloudflare/_headers ]; then
  echo "/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer-when-downgrade
  Cache-Control: no-cache" > dist/cloudflare/_headers
fi

echo "Build completed for Cloudflare Pages"
