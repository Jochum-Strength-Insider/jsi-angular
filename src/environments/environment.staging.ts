export const environment = {
  firebase: {
    projectId: process.env['PROJECT_ID_PROD'],
    appId: process.env['APP_ID_PROD'],
    databaseURL: process.env['DATABASE_URL_PROD'],
    storageBucket: process.env['STORATE_BUCKET_PROD'],
    locationId: process.env['LOCATION_ID_PROD'],
    apiKey: process.env['API_KEY_PROD'],
    authDomain: process.env['AUTH_DOMAIN_PROD'],
    messagingSenderId: process.env['MESSAGING_SENDER_ID_PROD'],
    emailSignInRedirect: process.env['EMAIL_SIGN_IN_REDIRECT_PROD'],
    confirmationEmailRedirect: process.env['CONFIRMATION_EMAIL_REDIRECT_PROD']
  },
  production: false,
  version: '1.0.3',
  serverUrl: 'https://api.jochumstrengthinsider.com',
  crytoKey: 'Ins1d3r!',
  login: '',
  password: '',
  paypalId: process.env['PAYPAL_CLIENT_ID_PROD'],
  paypalSecret: process.env['PAYPAL_CLIENT_SECRET_PROD'],
  subscriptionId: process.env['SUBSCRIPTION_ID_PROD'],
  subscriptionPrice: process.env['SUBSCRIPTION_PRICE_PROD'],
  userSubscriptionUrl: process.env['PAYPAL_USER_SUBSCRIPTION_URL_PROD'],
  billingSubscriptionUrl: process.env['PAYPAL_BILLING_SUBSCRIPTION_URL_PROD']
};