CareerVocab PWA — Firebase Web Push + Apps Script token registration

1. Upload this folder to an HTTPS static host such as GitHub Pages.
2. Keep these files together at the app root:
   /index.html
   /manifest.json
   /service-worker.js
   /firebase-messaging-sw.js
   /firebase-config.js
3. Firebase web config and the public Web Push/VAPID key are already configured in firebase-config.js.
4. In the app, open Profile → Enable Notifications and choose Allow in the browser permission prompt.
5. The browser obtains an FCM token and sends it to the Apps Script backend. The backend stores it in the FcmTokens sheet.
6. Do NOT put Firebase Admin/service-account private keys in frontend files or GitHub.

Backend setup:
- Use CareerVocab_AppsScript_V18_2_FCM.gs.
- Run setupSheets() once. It creates the FcmTokens sheet without deleting existing CareerVocab data.
- In Apps Script Project Settings → Script Properties, add:
  FCM_PROJECT_ID = careervocab-e34ba
  FCM_CLIENT_EMAIL = <Firebase/Google service-account client email>
  FCM_PRIVATE_KEY = <service-account private key, including \n line breaks or literal \\n>
- The service account must have permission to send Firebase Cloud Messaging messages for this project.
- Deploy/update the Apps Script Web App so the existing frontend API URL uses the updated code.
- The existing ADMIN_KEY remains for admin operations; token registration is intentionally public so a browser does not need the admin key.

Manual test:
- After a browser token appears in FcmTokens and the FCM_* Script Properties are configured, run sendTestPush() in Apps Script.
- Expected result: the registered browser receives “CareerVocab Test — FCM Web Push is working.”

Important:
- Web FCM and native Android FCM are separate. A simple Android WebView wrapper does not automatically provide native FCM.
- GitHub Pages project path support is preserved with relative service-worker/config paths.
