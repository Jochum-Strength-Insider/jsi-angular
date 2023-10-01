// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// `.env.ts` is generated by the `npm run env` command
// `npm run env` exposes environment variables as JSON for any usage you might
// want, like displaying the version or getting extra config from your CI bot, etc.
// This is useful for granularity you might need beyond just the environment.
// Note that as usual, any environment variables you expose through it will end up in your
// bundle, and you should not use it for any sensitive information like passwords or keys.
// import { en } from 'dotenv';

export const environment = {
  firebase: {
    projectId: process.env['PROJECT_ID_DEV'],
    appId: process.env['APP_ID_DEV'],
    databaseURL: process.env['DATABASE_URL_DEV'],
    storageBucket: process.env['STORATE_BUCKET_DEV'],
    locationId: process.env['LOCATION_ID_DEV'],
    apiKey: process.env['API_KEY_DEV'],
    authDomain: process.env['AUTH_DOMAIN_DEV'],
    messagingSenderId: process.env['MESSAGING_SENDER_ID_DEV'],
    emailSignInRedirect: process.env['EMAIL_SIGN_IN_REDIRECT_DEV'],
    confirmationEmailRedirect: process.env['CONFIRMATION_EMAIL_REDIRECT_DEV']
  },
  production: false,
  version: '1.0',
  serverUrl: 'http://localhost:3000',
  test: process.env['TEST_DEV'],
  crytoKey: 'Ins1d3r!',
  login: process.env['TEST_USER_LOGIN'],
  password: process.env['TEST_USER_PASSWORD'],
  paypalId: process.env['PAYPAL_CLIENT_ID_DEV'],
  paypalSecret: process.env['PAYPAL_CLIENT_SECRET_DEV'],
  subscriptionId: process.env['SUBSCRIPTION_ID_DEV'],
  subscriptionPrice: process.env['SUBSCRIPTION_PRICE_DEV'],
  userSubscriptionUrl: process.env['PAYPAL_USER_SUBSCRIPTION_URL_DEV'],
  billingSubscriptionUrl: process.env['PAYPAL_BILLING_SUBSCRIPTION_URL_DEV'],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
