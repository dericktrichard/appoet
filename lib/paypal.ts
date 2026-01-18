import { client, Environment } from '@paypal/paypal-server-sdk';

const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
const mode = process.env.PAYPAL_MODE || 'sandbox';

const environment = mode === 'production' 
  ? Environment.Production 
  : Environment.Sandbox;

export const paypalClient = client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: clientId,
    oAuthClientSecret: clientSecret,
  },
  environment,
  logging: {
    logLevel: mode === 'production' ? 'error' : 'info',
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});