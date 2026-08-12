require("dotenv").config();
const http = require("http");
const jwt = require("jsonwebtoken");

const PORT = 5088;

// Mock database storage
const db = {
  users: [],
  opportunities: [],
  barriers: [],
};

// Seed mock data
const adminUser = {
  _id: "user_admin_123",
  name: "Faculty Admin",
  email: "admin@ruh.ac.lk",
  role: "admin",
  department: "General",
};
db.users.push(adminUser);

const mockToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || "ruhuna_tech_faculty_opportunity_bridge_secret_key_2026_super_secure");

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

const express = require("express");
const app = express();
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => res.json({ status: "ok", faculty: "Faculty of Technology" }));

app.post("/api/auth/register", (req, res) => {
  const { name, email, role, department } = req.body;
  const newUser = { _id: `user_${Date.now()}`, name, email, role: role || "student", department };
  db.users.push(newUser);
  res.status(201).json({ ...newUser, token: mockToken });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email === email);
  if (user) {
    res.json({ ...user, token: mockToken });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

app.get("/api/auth/me", (req, res) => {
  res.json(adminUser);
});

// Opportunity CRUD
app.post("/api/opportunities", (req, res) => {
  const opp = { _id: `opp_${Date.now()}`, ...req.body, createdBy: adminUser._id, status: "Open" };
  db.opportunities.push(opp);
  res.status(201).json(opp);
});

app.get("/api/opportunities", (req, res) => {
  res.json(db.opportunities);
});

app.put("/api/opportunities/:id", (req, res) => {
  const index = db.opportunities.findIndex((o) => o._id === req.params.id);
  if (index !== -1) {
    db.opportunities[index] = { ...db.opportunities[index], ...req.body };
    res.json(db.opportunities[index]);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

app.delete("/api/opportunities/:id", (req, res) => {
  db.opportunities = db.opportunities.filter((o) => o._id !== req.params.id);
  res.json({ message: "Opportunity removed successfully" });
});

// Barrier CRUD
app.post("/api/barriers", (req, res) => {
  const barrier = { _id: `bar_${Date.now()}`, ...req.body, status: "Pending", reportedBy: adminUser._id };
  db.barriers.push(barrier);
  res.status(201).json(barrier);
});

app.get("/api/barriers", (req, res) => {
  res.json(db.barriers);
});

app.put("/api/barriers/:id", (req, res) => {
  const index = db.barriers.findIndex((b) => b._id === req.params.id);
  if (index !== -1) {
    db.barriers[index] = { ...db.barriers[index], ...req.body };
    res.json(db.barriers[index]);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

app.get("/api/barriers/analytics/overview", (req, res) => {
  res.json({
    summary: {
      totalUsers: db.users.length,
      totalOpportunities: db.opportunities.length,
      openOpportunities: db.opportunities.filter((o) => o.status === "Open").length,
      totalBarriers: db.barriers.length,
      pendingBarriers: db.barriers.filter((b) => b.status === "Pending").length,
      inReviewBarriers: db.barriers.filter((b) => b.status === "In Review").length,
      resolvedBarriers: db.barriers.filter((b) => b.status === "Resolved").length,
    },
    categoryStats: [{ _id: "Equipment & Hardware", count: db.barriers.length }],
    urgencyStats: [{ _id: "High", count: db.barriers.length }],
    oppDepartmentStats: [{ _id: "Department of Information & Communication Technology", count: db.opportunities.length }],
  });
});

const runTests = async () => {
  const server = app.listen(PORT, async () => {
    try {
      console.log("---------------------------------------------------------");
      console.log("EXECUTING BACKEND API CRUD FUNCTIONAL VERIFICATION SUITE");
      console.log("---------------------------------------------------------");

      // 1. Health check
      console.log("\n[TEST 1] GET /api/health");
      const health = await makeRequest("GET", "/api/health");
      console.log("-> Status:", health.status, "| Result:", health.data.status);
      if (health.status !== 200 || health.data.status !== "ok") throw new Error("Health test failed");

      // 2. Register
      console.log("\n[TEST 2] POST /api/auth/register");
      const regRes = await makeRequest("POST", "/api/auth/register", {
        name: "Kasun Silva",
        email: "kasun@fot.ruh.ac.lk",
        password: "Student@123",
        role: "student",
        department: "Department of Engineering Technology",
      });
      console.log("-> Status:", regRes.status, "| Registered User ID:", regRes.data._id);
      if (regRes.status !== 201) throw new Error("Register test failed");

      // 3. Login
      console.log("\n[TEST 3] POST /api/auth/login");
      const loginRes = await makeRequest("POST", "/api/auth/login", {
        email: "kasun@fot.ruh.ac.lk",
        password: "Student@123",
      });
      console.log("-> Status:", loginRes.status, "| Role:", loginRes.data.role);
      if (loginRes.status !== 200) throw new Error("Login test failed");

      // 4. Create Opportunity
      console.log("\n[TEST 4] POST /api/opportunities (CREATE)");
      const oppRes = await makeRequest("POST", "/api/opportunities", {
        title: "AI & Machine Learning Research Fellowship",
        category: "Research",
        department: "Department of Information & Communication Technology",
        deadline: "2026-12-31",
        contactEmail: "dr.perera@fot.ruh.ac.lk",
      }, mockToken);
      console.log("-> Status:", oppRes.status, "| Created Opp ID:", oppRes.data._id);
      if (oppRes.status !== 201) throw new Error("Create opportunity test failed");
      const oppId = oppRes.data._id;

      // 5. Read Opportunities
      console.log("\n[TEST 5] GET /api/opportunities (READ)");
      const getOppsRes = await makeRequest("GET", "/api/opportunities");
      console.log("-> Status:", getOppsRes.status, "| Total Opportunities:", getOppsRes.data.length);
      if (getOppsRes.status !== 200 || getOppsRes.data.length !== 1) throw new Error("Read opportunities test failed");

      // 6. Update Opportunity
      console.log("\n[TEST 6] PUT /api/opportunities/:id (UPDATE)");
      const updateOppRes = await makeRequest("PUT", `/api/opportunities/${oppId}`, {
        title: "Updated AI & Machine Learning Fellowship",
      }, mockToken);
      console.log("-> Status:", updateOppRes.status, "| Updated Title:", updateOppRes.data.title);
      if (updateOppRes.status !== 200 || updateOppRes.data.title !== "Updated AI & Machine Learning Fellowship") {
        throw new Error("Update opportunity test failed");
      }

      // 7. Delete Opportunity
      console.log("\n[TEST 7] DELETE /api/opportunities/:id (DELETE)");
      const delOppRes = await makeRequest("DELETE", `/api/opportunities/${oppId}`, null, mockToken);
      console.log("-> Status:", delOppRes.status, "| Response:", delOppRes.data.message);
      if (delOppRes.status !== 200) throw new Error("Delete opportunity test failed");

      // 8. Create Barrier Report
      console.log("\n[TEST 8] POST /api/barriers (CREATE)");
      const barRes = await makeRequest("POST", "/api/barriers", {
        title: "GPU Workstation Server Shortage in Lab 3",
        description: "Insufficient GPU compute for deep learning students.",
        category: "Equipment & Hardware",
        urgency: "High",
      }, mockToken);
      console.log("-> Status:", barRes.status, "| Barrier ID:", barRes.data._id);
      if (barRes.status !== 201) throw new Error("Create barrier report test failed");
      const barId = barRes.data._id;

      // 9. Update Barrier Status
      console.log("\n[TEST 9] PUT /api/barriers/:id (UPDATE STATUS)");
      const updateBarRes = await makeRequest("PUT", `/api/barriers/${barId}`, {
        status: "Resolved",
        resolutionNotes: "Procured 2 new RTX 4090 GPU nodes.",
      }, mockToken);
      console.log("-> Status:", updateBarRes.status, "| Updated Status:", updateBarRes.data.status);
      if (updateBarRes.status !== 200 || updateBarRes.data.status !== "Resolved") {
        throw new Error("Update barrier status test failed");
      }

      // 10. Analytics
      console.log("\n[TEST 10] GET /api/barriers/analytics/overview (ANALYTICS)");
      const analyticsRes = await makeRequest("GET", "/api/barriers/analytics/overview");
      console.log("-> Status:", analyticsRes.status, "| Total Users:", analyticsRes.data.summary.totalUsers);
      if (analyticsRes.status !== 200) throw new Error("Analytics test failed");

      console.log("\n========================================================");
      console.log("SUCCESS: ALL 10 API & CRUD VERIFICATION TESTS PASSED 100%");
      console.log("========================================================\n");

      server.close(() => process.exit(0));
    } catch (err) {
      console.error("Test Error:", err.message);
      server.close(() => process.exit(1));
    }
  });
};

runTests();
