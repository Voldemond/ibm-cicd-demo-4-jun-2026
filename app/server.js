const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Change this message during the live demo (e.g. "v2 - now live!")
// to prove a fresh commit really flows all the way to the running pod.
const MESSAGE = 'Hello from the Simple CI/CD Demo!';

app.get('/', (req, res) => {
  res.json({
    message: MESSAGE,
    version: process.env.APP_VERSION || '1.0.0',
    hostname: require('os').hostname() // useful to show load across replicas
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
