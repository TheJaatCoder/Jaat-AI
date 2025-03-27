import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Serve static files from client directory
app.use(express.static(join(__dirname, '../client')));

// Handle all routes and serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Jaat-AI server running on port ${PORT}`);
});