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
    confirmationEmailRedirect: process.env['CONFIRMATION_EMAIL_REDIRECT_DEV']
  },
  production: false,
  hmr: false,
  version: '1.0',
  serverUrl: 'https://api.jochumstrengthinsider.com',
  test: process.env['TEST_STAGING'],
  crytoKey: 'Ins1d3r!'
};