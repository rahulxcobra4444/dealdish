const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const { startCronJobs } = require('./services/cron.service');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  startCronJobs();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();