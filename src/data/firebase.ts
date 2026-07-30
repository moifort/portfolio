/**
 * Web app config for the `portfolio-23342` Firebase project, as printed by
 * `firebase apps:sdkconfig WEB`. These identifiers are public by design: they
 * ship inside the page whatever we do, and Analytics is the only service this
 * app can reach. Kept in the repo rather than in build secrets for that reason.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyBrtD-6y7ma8eLjPhJBQ2WJKBuDEYFtI7M',
  authDomain: 'portfolio-23342.firebaseapp.com',
  projectId: 'portfolio-23342',
  storageBucket: 'portfolio-23342.firebasestorage.app',
  messagingSenderId: '111735143527',
  appId: '1:111735143527:web:66f989c583d22fb20328c2',
  measurementId: 'G-LBTD5PFLPN',
} as const
