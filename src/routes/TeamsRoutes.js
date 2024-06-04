const express = require("express");
const router = express.Router();
const teamMember = require('../controllers/teams.controller')

router.get("/", (req, res) => {
  res.render("Teams", { message: null });
});

router.get('/AddMember',(req, res) => {
  res.render("Teams", { message: null });
})
router.post('/AddMember',teamMember.addMember);
module.exports=router;