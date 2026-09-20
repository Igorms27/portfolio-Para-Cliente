# Portfólio Profissional

[![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap)](https://getbootstrap.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=for-the-badge&logo=cloudflare)](https://pages.cloudflare.com/)

Um projeto de portfólio profissional desenvolvido como trabalho freelance para cliente. Sistema criado com Angular 20, suporte a múltiplos idiomas (PT e EN), hospedado na Cloudflare Pages e integrado ao Firebase.

## 🚀 Funcionalidades

- **Design Responsivo**: Adaptado para todos os dispositivos com Bootstrap 5
- **Múltiplos Idiomas**: Suporte para Português e Inglês
- **Seções Completas**:
  - 🏠 Home: Página inicial com apresentação
  - 👨‍💼 Sobre: Informações pessoais e profissionais
  - 📂 Projetos: Portfólio de projetos desenvolvidos
  - 🛠️ O que eu faço: Habilidades e serviços oferecidos
  - 📄 Currículo: Experiência profissional e formação acadêmica
  - 🏆 Certificados: Certificações e cursos realizados
  - 📧 Contato: Formulário de contato com validação
- **Formulário de Contato**: Integração com EmailJS
- **Proteção contra Spam**: Implementação de reCAPTCHA
- **Analytics**: Integração com Firebase Analytics

## 🔧 Tecnologias Utilizadas

- **Frontend**:
  - Angular 20
  - TypeScript 5.8
  - Bootstrap 5.3
  - RxJS

- **Backend e Serviços**:
  - Firebase (Authentication, Firestore, Analytics)
  - Cloudflare Pages
  - EmailJS

## Produção na Cloudflare Pages

O projeto é compatível com os comandos de build já usados normalmente pela
Cloudflare Pages (`npm run build` ou `yarn build`) e gera a configuração do
frontend durante o build. O script `./build-cloudflare.sh` também pode ser usado
sem exigir mudanças no painel. O diretório de saída é `dist/cloudflare`.

As seguintes variáveis devem existir tanto no ambiente de preview quanto no de
produção:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_USER_ID`
- `RECAPTCHA_SITE_KEY`

A chave `RECAPTCHA_SITE_KEY` deve ser de um reCAPTCHA v2 do tipo checkbox e deve
autorizar o domínio `pages.dev` do projeto e qualquer domínio personalizado. O
build detecta automaticamente a Cloudflare por meio de `CF_PAGES=1` e falha se
alguma dessas variáveis não estiver configurada. Builds locais e o CI podem usar
valores vazios para validar a compilação sem acessar as credenciais do cliente.

## 📚 Estrutura do Projeto

```
portifolio/
├── src/
│   ├── app/
│   │   ├── core/           # Serviços core, autenticação, interceptors
│   │   ├── features/       # Módulos de recursos (about, projects, etc.)
│   │   ├── models/         # Interfaces e tipos
│   │   └── shared/         # Componentes, diretivas e pipes compartilhados
│   ├── assets/
│   │   ├── i18n/           # Arquivos de tradução (pt, en)
│   │   └── ...             # Outros assets (imagens, fontes, etc.)
│   └── environments/       # Configurações de ambiente
└── functions/              # Funções serverless (Cloudflare Workers)
```

## 📄 Licença

Este projeto foi desenvolvido para uso exclusivo do cliente e está protegido por acordo de confidencialidade.

---

⭐️ Desenvolvido por Igor Desenvolvedor Web | Full-stack |
