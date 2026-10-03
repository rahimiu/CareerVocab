CareerVocab PWA — OneSignal Web Push (GitHub Pages)

WHAT CHANGED
- Firebase Web Push code is removed from the frontend.
- CareerVocab Profile → Enable Notifications now uses OneSignal Web Push.
- Vocabulary, Jobs, Notices, ads, offline/PWA UI and existing Apps Script API are otherwise preserved from the supplied build.

ONE-TIME ONESIGNAL SETUP
1. Create a OneSignal account and create a new Web app.
2. Choose Custom Code / Web integration.
3. Site URL: https://rahimiu.github.io/CareerVocab/
4. Use the Web Push setup for that exact site.
5. Copy the OneSignal App ID into onesignal-config.js, replacing 1dc98c30-f536-48ae-abea-a8205747888d.
6. Keep OneSignalSDKWorker.js in the same GitHub Pages app folder as index.html.
7. Upload the files to the CareerVocab GitHub repository and wait for GitHub Pages to publish.
8. Open Profile → Enable Notifications and choose Allow.

IMPORTANT
- Do not put a OneSignal REST API Key in GitHub/frontend files. Only the public App ID belongs in onesignal-config.js.
- The worker is intentionally named OneSignalSDKWorker.js and is hosted beside index.html so its scope matches the /CareerVocab/ GitHub Pages path. OneSignal's current Web SDK is loaded from its CDN.
- The existing Firebase/FCM Apps Script backend is not deleted. It is simply no longer used by this frontend for browser notification subscription.
- If you later want Apps Script to send OneSignal notifications automatically, add the OneSignal REST API Key only to Apps Script Script Properties and use the OneSignal REST API from the server side.

CURRENT PLACEHOLDER
onesignal-config.js contains: 1dc98c30-f536-48ae-abea-a8205747888d
Replace that one value before uploading.

ONE SIGNAL SUBSCRIPTION FIX (2026-10-03)
This build only marks notifications enabled after OneSignal reports a real push subscription ID and token. Browser permission alone is not treated as a subscription.
