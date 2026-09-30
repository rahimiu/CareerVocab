CareerVocab PWA setup

1. Upload this folder to an HTTPS static host.
2. Ensure these files are at the site root:
   /index.html
   /manifest.json
   /service-worker.js
   /firebase-messaging-sw.js
   /firebase-config.js
3. Create a Firebase Web App and generate a Web Push/VAPID key.
4. Put the Firebase web config and public VAPID key into firebase-config.js.
5. Enable notifications in the app only after the credentials are added.
6. Keep the Google Apps Script URL in the app configuration.

Important:
- Do not put Firebase Admin/service-account private keys in frontend files.
- The public Firebase web config and VAPID public key are not secret.
