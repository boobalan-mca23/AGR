const express = require("express");
const router = express.Router();
const {
  createJobcard,updateJobCard,getAllJobCardsByGoldsmithId,getJobCardById} = require("../Controllers/assignment.controller");

router.post("/create", createJobcard);
router.put("/:goldSmithId/:jobCardId",updateJobCard)
router.get('/:id',getAllJobCardsByGoldsmithId);
router.get('/:id/jobcard',getJobCardById)


module.exports = router;
