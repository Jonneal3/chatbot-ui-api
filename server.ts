import * as express from 'express';
import { handleRunsRequest } from './samurai/back-end/src/routes/api/runs/runs'; // Import the function from runs.ts

const app = express();

let isStartupProcess = process.env.START_PROCESS === 'true';

if (isStartupProcess) {
  console.log('Startup process is running...');
}

// Handle API requests if not in the startup process
if (!isStartupProcess) {
  app.use(async (req, res, next) => {
    // Check if the request path starts with '/api/runs'
    if (req.url && req.url.startsWith('/api/runs')) {
      try {
        await handleRunsRequest(req, res);
      } catch (error: any) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    } else {
      // For other paths, just pass through
      next();
    }
  });

  isStartupProcess = true;
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  if (!isStartupProcess) {
    console.log(`Server is running on port ${PORT}`);
  }
});
