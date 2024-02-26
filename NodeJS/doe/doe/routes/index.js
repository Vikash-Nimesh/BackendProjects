var express = require("express")
var router = express.Router();


router.get("/",function(req,res,next){
    res.send('working data')
});

module.exports = router;