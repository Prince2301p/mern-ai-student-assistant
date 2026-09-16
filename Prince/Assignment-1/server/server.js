const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 AI Student Assistant Server running on http://localhost:${PORT}`);
  console.log(`📌 API Endpoint: http://localhost:${PORT}/api/ai/generate`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health\n`);
});
