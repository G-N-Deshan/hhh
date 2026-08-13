const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Security Middleware (configured for production assets & inline scripts)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS Configuration
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// Request Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    faculty: "Faculty of Technology",
    university: "University of Ruhuna",
    environment: process.env.NODE_ENV || "production",
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/opportunities", require("./routes/opportunityRoutes"));
app.use("/api/barriers", require("./routes/barrierRoutes"));
app.use("/api/qa", require("./routes/qaRoutes"));
app.use("/api/site-reviews", require("./routes/siteReviewRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

// Multi-Candidate Path Resolution for Frontend Production Build (client/dist)
const candidateDistPaths = [
  path.join(__dirname, "../../client/dist"),
  path.join(process.cwd(), "client/dist"),
  path.join(process.cwd(), "dist"),
  path.join(__dirname, "../client/dist"),
];

const clientDistPath = candidateDistPaths.find((p) => fs.existsSync(p));

if (clientDistPath) {
  console.log(`[Production App] Serving frontend static assets from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // SPA Fallback: Send index.html for all client side routes (non-API)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    const indexPath = path.join(clientDistPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
} else {
  console.warn("[Production App Warning] client/dist path not found on server.");
  app.get("/", (req, res) => {
    res.json({
      message: "OpportunityBridge API - Faculty of Technology, University of Ruhuna",
      status: "active",
      notice: "Frontend build files (client/dist) pending deployment.",
    });
  });
}

// 404 Route Handler for unmatched API endpoints
app.use("/api/*", (req, res, next) => {
  res.status(404);
  next(new Error(`API Endpoint Not Found - ${req.originalUrl}`));
});

// Centralized Error Handler
app.use(errorMiddleware);

module.exports = app;
