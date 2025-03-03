const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'data/employees.json'));
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

// Set default middlewares
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/health', (req, res) => {
  res.json({ status: 'up' });
});

// Add CORS headers
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

// Use default router
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
