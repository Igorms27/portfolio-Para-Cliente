# Portfólio Profissional

[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap)](https://getbootstrap.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=for-the-badge&logo=cloudflare)](https://pages.cloudflare.com/)

Um projeto de portfólio profissional desenvolvido como trabalho freelance para cliente. Sistema criado com Angular 19, suporte a múltiplos idiomas (PT e EN), hospedado na Cloudflare Pages e integrado ao Firebase.

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
- **Animações 3D**: Utilizando Three.js para elementos visuais interativos
- **Formulário de Contato**: Integração com EmailJS
- **Proteção contra Spam**: Implementação de reCAPTCHA
- **Analytics**: Integração com Firebase Analytics

## 🔧 Tecnologias Utilizadas

- **Frontend**:
  - Angular 19
  - TypeScript 5.7
  - Bootstrap 5.3
  - Three.js
  - Font Awesome
  - RxJS

- **Backend e Serviços**:
  - Firebase (Authentication, Firestore, Analytics)
  - Cloudflare Pages
  - EmailJS

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
