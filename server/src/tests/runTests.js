require("dotenv").config();
const http = require("http");
const connectDB = require("../config/db");
const seedDatabase = require("../utils/seeder");
const app = require("../app");

const PORT = 5099; // Isolated test port

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : "";
    const headers = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        host: "localhost",
        port: PORT,
        method,
        path,
        headers,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch (e) {
            parsed = body;
          }
          resolve({ status: res.statusCode, data: parsed });
        });
      }
    );

    req.on("error", (err) => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
}

const runAllTests = async () => {
  console.log("Starting Automated API CRUD Verification Suite...");

  await connectDB();
  await seedDatabase();

  const server = app.listen(PORT, async () => {
    try {
      // 1. Health check
      console.log("\n[TEST 1] GET /api/health");
      const health = await makeRequest("GET", "/api/health");
      console.log("Status:", health.status, "| Response:", health.data);
      if (health.status !== 200 || health.data.status !== "ok") throw new Error("Health check failed");

      // 2. Register New User
      console.log("\n[TEST 2] POST /api/auth/register");
      const testEmail = `testuser_${Date.now()}@fot.ruh.ac.lk`;
      const regRes = await makeRequest("POST", "/api/auth/register", {
        name: "Test Developer",
        email: testEmail,
        password: "Password@123",
        role: "admin",
        department: "Department of Information & Communication Technology",
      });
      console.log("Status:", regRes.status, "| Registered User ID:", regRes.data._id);
      if (regRes.status !== 201 || !regRes.data.token) throw new Error("Register failed");
      const adminToken = regRes.data.token;

      // 3. Login User
      console.log("\n[TEST 3] POST /api/auth/login");
      const loginRes = await makeRequest("POST", "/api/auth/login", {
        email: testEmail,
        password: "Password@123",
      });
      console.log("Status:", loginRes.status, "| Login User Role:", loginRes.data.role);
      if (loginRes.status !== 200) throw new Error("Login failed");

      // 4. Get Current User Profile
      console.log("\n[TEST 4] GET /api/auth/me");
      const meRes = await makeRequest("GET", "/api/auth/me", null, adminToken);
      console.log("Status:", meRes.status, "| User Name:", meRes.data.name);
      if (meRes.status !== 200) throw new Error("Get profile failed");

      // 5. Create Opportunity (CREATE)
      console.log("\n[TEST 5] POST /api/opportunities (Create)");
      const oppRes = await makeRequest("POST", "/api/opportunities", {
        title: "Cyber Security Penetration Testing Internship",
        description: "Hands-on vulnerability assessment internship for technology students.",
        category: "Internship",
        department: "Department of Information & Communication Technology",
        deadline: "2026-12-31",
        contactEmail: "security-lab@fot.ruh.ac.lk",
        tags: ["CyberSecurity", "Networking"],
      }, adminToken);
      console.log("Status:", oppRes.status, "| Opportunity ID:", oppRes.data._id);
      if (oppRes.status !== 201) throw new Error("Create opportunity failed");
      const oppId = oppRes.data._id;

      // 6. Get Opportunities (READ)
      console.log("\n[TEST 6] GET /api/opportunities (Read)");
      const getOppsRes = await makeRequest("GET", "/api/opportunities?category=Internship");
      console.log("Status:", getOppsRes.status, "| Count:", getOppsRes.data.length);
      if (getOppsRes.status !== 200 || !Array.isArray(getOppsRes.data)) throw new Error("Get opportunities failed");

      // 7. Update Opportunity (UPDATE)
      console.log("\n[TEST 7] PUT /api/opportunities/:id (Update)");
      const updateOppRes = await makeRequest("PUT", `/api/opportunities/${oppId}`, {
        title: "Updated Cyber Security Fellowship",
        status: "Open",
      }, adminToken);
      console.log("Status:", updateOppRes.status, "| Updated Title:", updateOppRes.data.title);
      if (updateOppRes.status !== 200 || updateOppRes.data.title !== "Updated Cyber Security Fellowship") {
        throw new Error("Update opportunity failed");
      }

      // 8. Delete Opportunity (DELETE)
      console.log("\n[TEST 8] DELETE /api/opportunities/:id (Delete)");
      const delOppRes = await makeRequest("DELETE", `/api/opportunities/${oppId}`, null, adminToken);
      console.log("Status:", delOppRes.status, "| Message:", delOppRes.data.message);
      if (delOppRes.status !== 200) throw new Error("Delete opportunity failed");

      // 9. Create Barrier Report (CREATE)
      console.log("\n[TEST 9] POST /api/barriers (Create)");
      const barrierRes = await makeRequest("POST", "/api/barriers", {
        title: "Robotics Hardware Sensor Calibration Equipment Shortage",
        description: "Insufficient digital oscilloscopes for sensor calibration.",
        category: "Equipment & Hardware",
        department: "Department of Engineering Technology",
        urgency: "High",
      }, adminToken);
      console.log("Status:", barrierRes.status, "| Barrier ID:", barrierRes.data._id);
      if (barrierRes.status !== 201) throw new Error("Create barrier failed");
      const barrierId = barrierRes.data._id;

      // 10. Update Barrier Status (UPDATE)
      console.log("\n[TEST 10] PUT /api/barriers/:id (Update Status)");
      const updateBarrierRes = await makeRequest("PUT", `/api/barriers/${barrierId}`, {
        status: "Resolved",
        resolutionNotes: "Calibrated 5 oscilloscope units from university central electronics workshop.",
      }, adminToken);
      console.log("Status:", updateBarrierRes.status, "| Barrier Status:", updateBarrierRes.data.status);
      if (updateBarrierRes.status !== 200 || updateBarrierRes.data.status !== "Resolved") {
        throw new Error("Update barrier status failed");
      }

      // 11. GET Barrier Analytics
      console.log("\n[TEST 11] GET /api/barriers/analytics/overview");
      const analyticsRes = await makeRequest("GET", "/api/barriers/analytics/overview");
      console.log("Status:", analyticsRes.status, "| Total Barriers:", analyticsRes.data.summary.totalBarriers);
      if (analyticsRes.status !== 200 || !analyticsRes.data.summary) throw new Error("Analytics failed");

      console.log("\n====================================================");
      console.log("ALL BACKEND API CRUD TESTS PASSED SUCCESSFULLY! 100%");
      console.log("====================================================\n");

      server.close(() => process.exit(0));
    } catch (err) {
      console.error("\nTEST FAILURE:", err.message);
      server.close(() => process.exit(1));
    }
  });
};

runAllTests();
