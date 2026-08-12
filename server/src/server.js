require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const seedDatabase = require("./utils/seeder");

const PORT = process.env.PORT || 5000;

// Start Express Listener IMMEDIATELY to satisfy Azure App Service Health Check
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`OpportunityBridge Server Running on Port ${PORT}`);
  console.log(`University of Ruhuna - Faculty of Technology API`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

// Initialize Database & Seeding in background
const initServices = async () => {
  try {
    await connectDB();
    await seedDatabase();
  } catch (err) {
    console.error(`[Server Init Warning] ${err.message}`);
  }
};

initServices();
