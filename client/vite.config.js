import fs from 'fs';
import path from 'path';

export default {
  server: {
    https: true, // <-- force HTTPS even if certs fail
    key: fs.readFileSync(path.resolve(__dirname, 'certs', 'localhost+2-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'localhost+2.pem')),
  }
}