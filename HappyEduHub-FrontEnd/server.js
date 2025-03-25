import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, () => {
      console.log(
        `Server running at http://localhost:${port} in ${dev ? 'development' : 'production'} mode`
      );
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    });
  })
  .catch((err) => {
    console.error('Error starting Next.js:', err);
    process.exit(1);
  });
