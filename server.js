const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.join(__dirname, "server/.env") });

const app = require("./server/src/app");
const connectDB = require("./server/src/config/db");
const seedDatabase = require("./server/src/utils/seeder");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`OpportunityBridge Azure App Service Running on Port ${PORT}`);
  console.log(`University of Ruhuna - Faculty of Technology API`);
  console.log(`====================================================`);
});

const initServices = async () => {
  try {
    await connectDB();
    await seedDatabase();
  } catch (err) {
    console.error("[Azure Init Notice]:", err.message);
  }
};

initServices();
