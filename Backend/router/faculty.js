const router = require("express").Router();

const { takeSubjectAttendance } = require("../controller/attendance");

router.post("/subject", takeSubjectAttendance);

module.exports = router;
