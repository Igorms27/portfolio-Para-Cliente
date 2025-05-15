#!/bin/bash

# Script para instalar hooks git
# Uso: bash scripts/install-hooks.sh

HOOK_DIR=$(git rev-parse --git-dir)/hooks
PRE_COMMIT_HOOK=$HOOK_DIR/pre-commit

echo "Instalando hooks git..."

mkdir -p $HOOK_DIR

# Cria o pre-commit hook
cat > $PRE_COMMIT_HOOK << 'EOF'
#!/bin/bash

echo "Executando verificação de chaves expostas..."

# Executar o script de verificação de segredos
bash scripts/check-secrets.sh

# Verificar resultado
RESULT=$?
if [ $RESULT -ne 0 ]; then
  echo "Falha na verificação: Chaves ou credenciais expostas encontradas!"
  echo "Por favor, corrija os problemas antes de fazer o commit."
  exit 1
fi

exit 0
EOF

# Torna o hook executável
chmod +x $PRE_COMMIT_HOOK

echo "Hooks git instalados com sucesso!" 