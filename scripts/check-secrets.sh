#!/bin/bash

# Script para verificar chaves e credenciais expostas no código
# Uso: bash scripts/check-secrets.sh

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Verificando chaves API e credenciais expostas no código...${NC}"

# Padrões a serem verificados
declare -a patterns=(
  "apiKey:[[:space:]]*\"[A-Za-z0-9_-]{20,}\""
  "authDomain:[[:space:]]*\"[A-Za-z0-9.-]+\""
  "projectId:[[:space:]]*\"[A-Za-z0-9-]+\""
  "storageBucket:[[:space:]]*\"[A-Za-z0-9.-]+\""
  "messagingSenderId:[[:space:]]*\"[0-9]+\""
  "appId:[[:space:]]*\"[0-9:A-Za-z-]+\""
  "serviceId:[[:space:]]*\"[A-Za-z0-9_-]+\""
  "templateId:[[:space:]]*\"[A-Za-z0-9_-]+\""
  "userId:[[:space:]]*\"[A-Za-z0-9_-]+\""
  "siteKey:[[:space:]]*\"[A-Za-z0-9_-]+\""
)

# Diretórios a ignorar
declare -a ignore_dirs=(
  "node_modules"
  ".git"
  "dist"
  ".angular"
  ".yarn"
  "scripts"
)

# Construir a string de exclusão
ignore_string=""
for dir in "${ignore_dirs[@]}"; do
  ignore_string+=" --exclude-dir=$dir"
done

# Arquivos a ignorar
declare -a ignore_files=(
  "environment.example.ts"
  ".env.example"
  "environment.cloudflare.ts"
  "environment.prod.ts"
  "environment.ts"
  "cloudflare-build.js"
  "cloudflare-minimal-build.js"
  "build-cloudflare.sh"
  "check-secrets.sh"
)

for file in "${ignore_files[@]}"; do
  ignore_string+=" --exclude=$file"
done

# Verificar cada padrão
found_secrets=false

for pattern in "${patterns[@]}"; do
  echo -e "\n${YELLOW}Verificando padrão:${NC} $pattern"
  
  # Executar grep para encontrar correspondências
  results=$(grep -r $ignore_string --include="*.ts" --include="*.js" --include="*.json" --include="*.html" "$pattern" . 2>/dev/null || echo "")
  
  if [ -n "$results" ]; then
    echo -e "${RED}Chaves/credenciais encontradas:${NC}"
    echo "$results"
    found_secrets=true
  else
    echo -e "${GREEN}Nenhuma chave/credencial encontrada.${NC}"
  fi
done

if [ "$found_secrets" = true ]; then
  echo -e "\n${RED}ATENÇÃO:${NC} Chaves ou credenciais foram encontradas no código."
  echo -e "Recomendação: Mova estas chaves para variáveis de ambiente ou .env (que esteja no .gitignore)."
  exit 1
else
  echo -e "\n${GREEN}Nenhuma chave ou credencial exposta foi encontrada.${NC}"
  exit 0
fi 