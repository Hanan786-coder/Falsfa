// Vercel Serverless Function entry point
// This file re-exports the Express app so Vercel can handle /api/* routes
const app = require('../backend/src/server');

module.exports = app;
