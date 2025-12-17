const router = require("express").Router();
const {
  getHodDashboard,
  getTGList,
  createTG,
  getTGById,
  updateTG,
  deleteTG,
} = require("../controller/hod");

const { verifyToken, verifyRole } = require("../middleware/authentication");

// ==================== DASHBOARD ====================
router.get("/dashboard", verifyToken, verifyRole("hod"), getHodDashboard);

// ==================== TG MANAGEMENT ====================
router.get("/tg/all", verifyToken, verifyRole("hod"), getTGList);
router.post("/tg/create", verifyToken, verifyRole("hod"), createTG);
router.get("/tg/:tgId", verifyToken, verifyRole("hod"), getTGById);
router.put("/tg/:tgId", verifyToken, verifyRole("hod"), updateTG);
router.delete("/tg/:tgId", verifyToken, verifyRole("hod"), deleteTG);

module.exports = router;
