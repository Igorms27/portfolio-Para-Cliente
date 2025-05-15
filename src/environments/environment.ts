// Este arquivo será substituído pelo arquivo environment.prod.ts na build de produção.
// O arquivo environment.dev.ts será usado para desenvolvimento.

// Declaração necessária para TypeScript reconhecer process.env
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: { env: Record<string, string | undefined> };

export const environment = {
  production: false,
  firebase: {
    apiKey: process.env['FIREBASE_API_KEY'] || '',
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || '',
    projectId: process.env['FIREBASE_PROJECT_ID'] || '',
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || '',
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || '',
    appId: process.env['FIREBASE_APP_ID'] || ''
  },
  emailjs: {
    serviceId: process.env['EMAILJS_SERVICE_ID'] || '',
    templateId: process.env['EMAILJS_TEMPLATE_ID'] || '',
    userId: process.env['EMAILJS_USER_ID'] || ''
  },
  recaptcha: {
    siteKey: process.env['RECAPTCHA_SITE_KEY'] || ''
  }
}; 