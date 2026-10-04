/**
 * ETERNAL FLAME TECH (EFT) - STATIC FILE SERVER
 * Node.js & Express v5 server serving static assets with proper caching and fallbacks.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static assets from root directory
app.use(express.static(path.join(__dirname, '.'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true
}));

// 404 fallback handler (serves custom 404.html)
app.use((req, res) => {
  res.status(404).sendFile(path.resolve(__dirname, '404.html'));
});

// Start HTTP server
app.listen(PORT, () => {
  console.log('\n======================================================');
  console.log('ETERNAL FLAME TECH (EFT) // STATIC SERVER');
  console.log('CLB AI & Robotics - THPT Chuyên Nguyễn Thị Minh Khai');
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log('======================================================\n');
});
