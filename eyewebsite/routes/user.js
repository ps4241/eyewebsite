var express = require("express");
var exe = require("../connection")
var router = express.Router();




router.get("/",async function(req,res)
{
    
    var intro = await exe(`SELECT * FROM topbar`)
    var aboutus = await exe(`SELECT * FROM aboutus`)
    var card = await exe(`SELECT * FROM card`);
    var blog = await exe(`SELECT * FROM blog`)
 var obj = {"intro":intro[0],"aboutus":aboutus[0],"card": card,"blog":blog}


    res.render("user/home.ejs",obj);
});

router.get("/about",async function(req,res)
{   

    var intro = await exe (`SELECT * FROM topbar`);
    var aboutus = await exe(`SELECT * FROM aboutus`);
    var doctor = await exe(`SELECT * FROM doctor`)



    var obj = {"intro":intro[0],"aboutus":aboutus[0],"doctor":doctor[0]}

    res.render("user/about.ejs",obj);
});

router.get("/service", async function(req, res) {
    var intro = await exe(`SELECT * FROM topbar`);
    var card = await exe(`SELECT * FROM card`);
    
    // Make sure 'card' remains an array
    var obj = { "intro": intro[0], "card": card};  
    res.render("user/service.ejs", obj);
});


router.get("/appointment",async function(req,res){
    var intro = await exe(`SELECT * FROM topbar`);
    var obj = { "intro": intro[0]};  

    res.render("user/appointment.ejs",obj);
});

router.get("/blog",async function(req,res){
    var blog = await exe(`SELECT * FROM blog`);
    var intro = await exe(`SELECT * FROM topbar`);

    var obj = { "intro": intro[0], "blog": blog};  


    res.render("user/blog.ejs",obj);
});

router.get("/contact",async function(req,res){
    var intro = await exe(`SELECT * FROM topbar`);

    var obj = { "intro": intro[0]};  


    res.render("user/contact.ejs",obj);
});

router.get("/privacypolicy",async function(req,res){
    var intro = await exe(`SELECT * FROM topbar`);

    var obj = { "intro": intro[0]};  

    res.render("user/privacypolicy.ejs",obj);
});

router.post("/user/save_appoint", async function (req, res) 
{
    var d = req.body;
    var sql = `INSERT INTO appoint (appoint_name,appoint_phone,appoint_date,appoint_time,appoint_msg) VALUES ('${d.appoint_name}','${d.appoint_phone}','${d.appoint_date}','${d.appoint_time}','${d.appoint_msg}')`;
    // res.send(req.body);
    var data = await exe (sql);
    // res.send(data);
    res.redirect("/");
    
});

router.post("/save_contact", async function (req, res) 
{
    var d = req.body;
    var sql = `INSERT INTO contact (contact_name,contact_email,contact_website,contact_msg) VALUES ('${d.contact_name}','${d.contact_email}','${d.contact_website}','${d.contact_msg}')`;
    // res.send(req.body);
    var data = await exe (sql);
    // res.send(data);
    res.redirect("/contact");
    
});



module.exports = router;


// CREATE TABLE appoint(
//     appoint_id INT PRIMARY AUTO_INCREMENT,
//     appoint_name VARCHAR (50),
//     appoint_date VARCHAR (20),
//     appoint_time VARCHAR (15)
// )