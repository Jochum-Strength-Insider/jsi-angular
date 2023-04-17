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
    confirmationEmailRedirect: process.env['CONFIRMATION_EMAIL_REDIRECT_PROD']
  },
  production: true,
  hmr: false,
  version: '1.0',
  serverUrl: 'https://api.jochumstrengthinsider.com',
  test: process.env['TEST_PROD'],
  crytoKey: 'Ins1d3r!',
  login: process.env['TEST_USER_LOGIN'],
  password: process.env['TEST_USER_PASSWORD'],
  paypalId: process.env['PAYPAL_CLIENT_ID_PROD'],
  paypalSecret: process.env['PAYPAL_CLIENT_SECRET_PROD'],
};