const cron = require('node-cron');
const Offer = require('../models/Offer');

const startCronJobs = () => {
  // Run every day at midnight — deactivate expired offers
  cron.schedule('0 0 * * *', async () => {
    try {
      const result = await Offer.updateMany(
        {
          validTill: { $lt: new Date() },
          isActive: true
        },
        { isActive: false }
      );
      console.log(`Cron: Deactivated ${result.modifiedCount} expired offers`);
    } catch (error) {
      console.error('Cron error:', error.message);
    }
  });

  console.log('Cron jobs started');
};

module.exports = { startCronJobs };