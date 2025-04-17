var express = require("express");
var exe = require("../connection")
var router = express.Router();


function verify_login(req,res,next)
{
    if(req.session.admin_id)
        next();
    else
        res.send("<script>location.href = document.referrer+'?login_required'</script>");
}


router.get("/",function(req,res)
{
    res.render("admin/home.ejs");

});


router.post("/proceed_login",async function(req,res){
    // res.send(req.body)
    var d = req.body;
    var sql = `SELECT * FROM user_accounts WHERE email = ? AND password = ?`;
    var data = await exe(sql,[d.email, d.password]);
    if(data.length > 0)
        {
        var admin_id = data[0].admin_id;
        req.session.admin_id = admin_id;
        // res.send(`
        //     <script>
        //         var url = document.referrer;
        //         var new_url = url.replaceAll('?login_required','');
        //         location.href = new_url;
        //     </script>
        //     `);

          // Redirect back to the referrer or a default page
          let redirectUrl = req.get("/admin/")|| "dashboard";
          redirectUrl = redirectUrl.replace("?login_required", ""); 
          // Remove login_required if present
  
          res.redirect(redirectUrl);
    }else
        res.send("login failed");
});

router.get("/logout",verify_login, function(req, res) {
    // Destroy the sessio
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
            res.send("Error logging out");
        } else {
            res.redirect("/admin/"); 
        }
    });
});


// CREATE TABLE user_accounts (user_id INT PRIMARY KEY AUTO_INCREMENT, user_name VARCHAR(100), mobile VARCHAR(15), email VARCHAR(20), password VARCHAR(4) )



router.get("/dashboard",async function(req,res)
{
    var appoint = await exe (`SELECT * FROM appoint`);
    var contact = await exe (`SELECT * FROM contact`);

    var obj = {"appoint":appoint,"contact":contact}
    res.render("admin/dashboard.ejs",obj);
    
});


router.get("/forgot",function(req,res){
    res.render("admin/forgot.ejs");
});



router.get("/topbar",async function(req,res)
{
    var data = await exe(`SELECT * FROM topbar`);
    var obj = {"intro":data[0]};
    res.render("admin/topbar.ejs",obj);
});

router.get("/home_edit",function(req,res){
    res.render("admin/home_edit.ejs");
});

router.post("/save_topbar",async function(req,res)
{
    if(req.files)
    {
        if(req.files.hospital_logo)
        {
            var hospital_logo = new Date().getTime()+req.files.hospital_logo.name;
            req.files.hospital_logo.mv("public/"+hospital_logo);
           
        }
    }
    var d = req.body;
    var sql = `UPDATE topbar SET
    hospital_name = '${d.hospital_name}',  
    hospital_location  = '${d.hospital_location}',   
    mobile_no = '${d.mobile_no}',     
     tag_line = '${d.tag_line}',
     announcement = '${d.announcement}',
     whatsapp_link = '${d.whatsapp_link}',
     google_link = '${d.google_link}',
     facebook_link = '${d.faceook_link}',
     twitter_link = '${d.twitter_link}',
     opening_hours = '${d.opening_hours}',
     email = '${d.email}',
     appointment_day = '${d.appointment_day}',
     hospital_logo = '${hospital_logo}'

     WHERE
     intro_id=2
     `;
     var data = await exe(sql)
    // res.send(data);
    res.redirect("/admin/topbar")
});









// CREATE TABLE slider(
//     slider_id INT PRIMARY KEY AUTO_INCREMENT,
//     slider_image TEXT
// )

router.get("/card",async function(req,res)
{
    var data = await exe (`SELECT * FROM card`);
    res.render("admin/card.ejs",{"card":data});
});

router.post("/save_card",async function(req,res)
{
    var card_image = '';
   if(req.files)
   {
    if(req.files.card_image)
    {
        card_image = new Date().getTime()+req.files.card_image.name;
        req.files.card_image.mv("public/"+card_image);
    }
   }
    var sql = `INSERT INTO card (card_image,card_title,card_description) VALUES ('${card_image}','${req.body.card_title}','${req.body.card_description}')`;
    // res.send(req.body);
    var data = await exe (sql);
    // res.send(data);
    res.redirect("/admin/card");

});

router.get("/delete_card/:id",async function(req,res){
    var id = req.params.id;
    var sql = `DELETE FROM card WHERE card_id = ${id}`;

    var data = await exe(sql)
    res.redirect("/admin/card");
});

router.get("/aboutus",async function(req,res){
    var data = await exe(`SELECT * FROM aboutus`);
    var obj = {"aboutus":data[0]};
    res.render("admin/aboutus.ejs",obj);
});

router.post("/save_aboutus",async function(req,res)
{

 
     
   if(req.files)
   {
    if(req.files.about_image)
    {
        var about_image  = new Date().getTime()+req.files.about_image.name;
        req.files.about_image.mv("public/"+about_image);
    }
   }
   var d = req.body;
   var sql = `UPDATE aboutus SET
   about_image = '${about_image}',  
   about_title  = '${d.about_title}',   
   about_tagline = '${d.about_tagline}', 
   main_doctor = '${d.main_doctor}',     
   about_details = '${d.about_details}'    

   WHERE aboutus_id = 3
    `;
    var data = await exe(sql)
    // res.send(data);
    res.redirect("/admin/aboutus")

});

router.get("/blogs",async function(req,res){
    var data = await exe (`SELECT * FROM blog`);
    res.render("admin/blogs.ejs",{"blog":data});
});

router.get("/delete_blog/:id",async function(req,res){
    var id = req.params.id;
    var sql = `DELETE FROM blog WHERE blog_id = ${id}`;

    var data = await exe(sql)
    res.redirect("/admin/blogs");
});

router.post("/save_blogs",async function(req,res)
{
    var blog_image = '';
   if(req.files)
   {
    if(req.files.blog_image)
    {
        blog_image = new Date().getTime()+req.files.blog_image.name;
        req.files.blog_image.mv("public/"+blog_image);
    }
   }
    var sql = `INSERT INTO blog (blog_title,blog_image,blog_date,blog_category,blog_author,blog_details) VALUES ('${req.body.blog_name}','${blog_image}','${req.body.blog_date}','${req.body.blog_category}','${req.body.blog_author}','${req.body.blog_details}')`;
    // res.send(req.body);
    var data = await exe (sql);
    // res.send(data);
    res.redirect("/admin/blogs");

});


router.get("/doctor",async function(req,res){
    var data = await exe (`SELECT * FROM doctor`);

    res.render("admin/doctor.ejs",{"doctor":data});
});

router.post("/save_doctor",async function(req,res)
{
    var doctor_photo = '';
   if(req.files)
   {
    if(req.files.doctor_photo)
    {
        doctor_photo = new Date().getTime()+req.files.doctor_photo.name;
        req.files.doctor_photo.mv("public/"+doctor_photo);
    }
   }
    var sql = `INSERT INTO doctor (doctor_photo,doctor_position,doctor_name,doct_desc,doct_mobile,doct_twitter,doct_facebbok) VALUES ('${doctor_photo}','${req.body.doctor_position}','${req.body.doctor_name}','${req.body.doct_desc}','${req.body.doct_mobile}','${req.body.doct_twitter}','${req.body.doct_facebbok}')`;
    // res.send(req.body);
    var data = await exe (sql);
    // res.send(data);
    res.redirect("/admin/doctor");

});

router.get("/delete_doctor/:id",async function(req,res){
    var id = req.params.id;
    var sql = `DELETE FROM doctor WHERE doctor_id = ${id}`;

    var data = await exe(sql)
    res.redirect("/admin/doctor");
});









module.exports = router;



// CREATE TABLE doctor
// (
//   doctor_id INT PRIMARY KEY AUTO INCREMENT,
//   doctor_photo TEXT,
//   doctor_position VARCHAR(20),
//   doctor_name VARCHAR (20),
//   doct_desc TEXT,
//   doct_mobile VARCHAR(20),
//   doct_twitter VARCHAR(50),
//   doct_facebbok VARCHAR (20)


// )


// CREATE TABLE topbar (
//     intro_id INT PRIMARY KEY AUTO INCREMENT,
//     hospital_name VARCHAR(30),
//     hospital_location VARCHAR(30),
//     mobile_no VARCHAR(15),
//     tag_line VARCHAR(100),
//     announcement VARCHAR(100),
//     whatsapp_link VARCHAR(100),
//     google_link VARCHAR(100),
//     facebook_link VARCHAR(100),
//     twitter_link VARCHAR(100),
//     opening_hours VARCHAR(100),
//     email VARCHAR(100),
//     appointment_day VARCHAR(100),
//     hospital_logo TEXT
// )

// CREATE TABLE card(
//     card_id INT PRIMARY KEY AUTO_INCREMENT,
//     card_image Text,
//     card_title VARCHAR(100),
//     card_description TEXT
// )
 
// CREATE TABLE aboutus (
//     aboutus_id INT PRIMARY KEY AUTO_INCREMENT,
//     about_image Text,
//     about_title VARCHAR (30),
//     about_tagline VARCHAR(50),
//     main_doctor VARCHAR (15),
//     about_details VARCHAR(100)
// )

// CREATE TABLE blog (
//     blog_id INT PRIMARY KEY AUTO_INCREMENT,
//     blog_title VARCHAR(60),
//     blog_image Text,
//     blog_date VARCHAR(20),
//     blog_category VARCHAR(10),
//     blog_author VARCHAR(20),
//     blog_details TEXT

// )
