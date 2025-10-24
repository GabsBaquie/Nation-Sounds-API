// Simple API test
module.exports = (req, res) => {
  res.status(200).json({
    message: "Nation Sounds API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
    method: req.method,
    url: req.url
  });
};
