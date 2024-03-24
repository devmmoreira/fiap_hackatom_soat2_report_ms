import { app } from './app';
import { env } from '@config/env';

console.log(env);

app
  .listen({
    host: '::',
    port: env.PORT,
  })
  .then(() => {
    console.log('SGS api is Running: https://localhost:' + env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
