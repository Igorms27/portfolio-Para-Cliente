# Scripts de Segurança

Este diretório contém scripts para melhorar a segurança do repositório.

## Check Secrets

O script `check-secrets.sh` verifica se há chaves ou credenciais expostas no código.

### Uso

```bash
./scripts/check-secrets.sh
```

O script verifica padrões comuns de chaves e credenciais no código, como chaves de API, chaves de acesso, tokens, etc.

## Install Hooks

O script `install-hooks.sh` instala hooks git para verificar automaticamente se há chaves expostas antes de cada commit.

### Uso

```bash
./scripts/install-hooks.sh
```

### Hooks instalados

- **pre-commit**: Verifica se há chaves ou credenciais expostas antes de cada commit.

## Melhores Práticas de Segurança

1. **Nunca comitar chaves ou credenciais diretamente no código**
   - Use variáveis de ambiente ou arquivos `.env` (que estejam no `.gitignore`)

2. **Usar arquivos de exemplo**
   - Crie arquivos `.env.example` ou `environment.example.ts` com placeholders para as variáveis

3. **Configuração para diferentes ambientes**
   - Use arquivos `.env` para desenvolvimento local
   - Use variáveis de ambiente para produção e ambientes de CI/CD

4. **Revogar chaves expostas**
   - Se uma chave for exposta, revogue-a imediatamente e crie uma nova 