const express = require("express");
const router = express.Router();
const {
  getBarrierReports,
  getBarrierReportById,
  createBarrierReport,
  updateBarrierStatus,
  deleteBarrierReport,
  getBarrierAnalytics,
} = require("../controllers/barrierController");
const { protect, providerOrAdmin } = require("../middleware/authMiddleware");

router.get("/analytics/overview", getBarrierAnalytics);

router
  .route("/")
  .get(getBarrierReports)
  .post(protect, createBarrierReport);

router
  .route("/:id")
  .get(getBarrierReportById)
  .put(protect, providerOrAdmin, updateBarrierStatus)
  .delete(protect, deleteBarrierReport);

module.exports = router;
