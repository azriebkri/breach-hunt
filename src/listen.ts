import { createApp } from './app';
import { loadConfig } from './config';

const config = loadConfig();
const app = createApp(config);

app.listen(config.port, () => {
  console.log(
    `Job Posting Service running on http://localhost:${config.port}`,
    { activity: 'serverStarted', port: config.port },
  );
});
