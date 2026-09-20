import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const outputPath = join(process.cwd(), 'src', 'environments', 'environment.generated.ts');
const requireValues = process.argv.includes('--require-values') || process.env.CF_PAGES === '1';

const variableNames = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'EMAILJS_SERVICE_ID',
  'EMAILJS_TEMPLATE_ID',
  'EMAILJS_USER_ID',
  'RECAPTCHA_SITE_KEY',
];

if (requireValues) {
  const missingVariables = variableNames.filter((name) => !process.env[name]);
  if (missingVariables.length > 0) {
    throw new Error(`Missing production environment variables: ${missingVariables.join(', ')}`);
  }
}

const value = (name) => process.env[name] ?? '';
const environment = {
  production: true,
  firebase: {
    apiKey: value('FIREBASE_API_KEY'),
    authDomain: value('FIREBASE_AUTH_DOMAIN'),
    projectId: value('FIREBASE_PROJECT_ID'),
    storageBucket: value('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: value('FIREBASE_MESSAGING_SENDER_ID'),
    appId: value('FIREBASE_APP_ID'),
  },
  emailjs: {
    serviceId: value('EMAILJS_SERVICE_ID'),
    templateId: value('EMAILJS_TEMPLATE_ID'),
    userId: value('EMAILJS_USER_ID'),
  },
  recaptcha: {
    siteKey: value('RECAPTCHA_SITE_KEY'),
  },
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `// Generated at build time. Do not commit.\nexport const environment = ${JSON.stringify(environment, null, 2)} as const;\n`,
  'utf8',
);

console.log(`Generated production environment with ${variableNames.length} configured fields.`);
