import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const timestamp = () => new Date().toISOString();

export const logger = {
  info: (message) => {
    const log = `[${timestamp()}] [INFO] ${message}`;
    console.log(log);
    fs.appendFileSync(path.join(logsDir, 'app.log'), log + '\n');
  },

  error: (message, error) => {
    const log = `[${timestamp()}] [ERROR] ${message}${error ? '\n' + error.stack : ''}`;
    console.error(log);
    fs.appendFileSync(path.join(logsDir, 'error.log'), log + '\n');
  },

  warn: (message) => {
    const log = `[${timestamp()}] [WARN] ${message}`;
    console.warn(log);
    fs.appendFileSync(path.join(logsDir, 'app.log'), log + '\n');
  },

  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      const log = `[${timestamp()}] [DEBUG] ${message}`;
      console.debug(log);
      fs.appendFileSync(path.join(logsDir, 'debug.log'), log + '\n');
    }
  }
};
