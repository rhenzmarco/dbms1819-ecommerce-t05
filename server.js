const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const PORT = (process.env.PORT || 3000);
const { Client } = require('pg');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
const replaceString = require('replace-string');
var _ = require('lodash');
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'pictures')
  },
  filename: function (req, file, cb) {
    console.log(file);
    const ext = file.mimetype.split('/')[1];
    cb(null, file.fieldname + '-' + Date.now() + '.'+ext);
  }
})

var fileFilter = function(req, file, cb) {
var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

if (_.includes(allowedMimes, file.mimetype)) {
cb(null, true);
} else {
cb(new Error('Invalid file type. Only jpg, png and gif image files are allowed.'));
}
};

 
 
var upload = multer({ storage: storage,fileFilter: fileFilter })

const client = new Client({
	database: 'dd3c9ddqhmqsf1',
	user: 'blyngucjcpjbdl',
	password: 'a3f53719e07cadeb9e08ed97af16fd1c4be426fac803b7214ae7633197223394',
	host: 'ec2-54-163-227-253.compute-1.amazonaws.com',
	port: 5432,
	ssl: true
});

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "basketball.shoes2018@gmail.com",
        pass: "gilasbasketball"
    }
});

client.connect().then(function() {
	console.log('connected to database!')
}).catch(function(err) {
	console.log('cannot connect to database!')
});

const app = express();
// tell express which folder is a static/public folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('pictures'));
app.use('/static', express.static(path.join(__dirname, 'pictures')))

// tell express to use bodyparse to parse application/json
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// tell express to use handebars XD
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');




app.get('/', function(req, res) {
	
	client.query("Select * FROM products ORDER BY id ASC", (req, data)=>{
		console.log(data.rows);
		
		res.render('product',{
			title: 'Products',
			products: data.rows,
		});
	});

});

app.get('/member/Francis', function(req, res){
	res.render('member', {
		name: 'Francis Manalastas',
		email: 'francis.manalastas@gmail.com',
		phone: '09228952440',
		imageurl: 'https://scontent.fmnl4-6.fna.fbcdn.net/v/t1.0-9/31290267_1870298586321829_7153447419387052032_n.jpg?_nc_cat=0&_nc_eui2=AeH3tzbqJyfKqvUdNBZm4W2JXNNllK9G5_UjlQtTgCIGo3e__1OhGlm1kcGQHx5LnuxRcUxXlNG-Ivmx7dP-u4LD-GmONcKe85fkwdgVMpU8Ow&oh=64d70d087a8e20718bde7686efb9ad5e&oe=5C12218D',
		hobbies: ['sketching', 'reading','listening to music']
	});
});

app.get('/member/Rhenz', function(req, res){
	res.render('member', {
		name: 'Rhenz Marco Mayor',
		email: 'rhenz.mayor@gmail.com',
		phone: '09228951997',
		imageurl:'https://scontent.fmnl4-6.fna.fbcdn.net/v/t1.0-9/35238068_2133538313341203_8797277153281441792_n.jpg?_nc_cat=0&_nc_eui2=AeGFxPEavGyE94osbtK_Q2WUbxY0ktZWELxNur_0EgxhADVwf3AOrrlCjIXPTLWPjZ0vuIYEnhYbh4Idw5uQxu5GSryL6Btd0cEoKL1IhPxvoQ&oh=ade0b4d2905fc2e83eb2066818bef663&oe=5BD71678',
		hobbies: ['studying', 'programming','playing']
	});
});
app.get('/product/id', function(req,res){
	res.redirect('/');
});

app.post('/form', function(req,res){
	console.log(req.body);

	var mailOptions={
        to : req.body.email,
        subject : "Order confirmation",
        text : 'Your order has been successfuly received.'
    }

    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
		}else{
			res.render('emailsent');
		}
	});

    var textBody = req.body.name + '\n' + req.body.number+'\n'+ req.body.idproduct + ' : '+req.body.quantity +"\nAddress : " +req.body.address +'\n'+req.body.order_request;
	var mailOptions={
        to : 'basketball.shoes2018@gmail.com',
        from: req.body.email,
        subject : "New Order",
        text : textBody
    }

    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
		}else{
			res.render('emailsent');
		}
	});

});


app.get('/form', function(req,res){
	res.render('form')
});

//
//
//
//
//
//
//
//module 2

app.get('/brand/create', function(req,res){
	res.render('brand_create');
});


app.get('/brands',function(req,res){
	client.query("SELECT * FROM brands;", (req, data)=>{
		console.log(data.rows);
		
		res.render('brand_lists',{
			brands: data.rows,
		});
		
	});
});

app.post('/brand/create', function(req,res){
	brand_name = req.body.brand_name;
	brand_description = req.body.brand_description;

	var query = 'INSERT INTO brands (name,description) VALUES($1,$2);';
	var values = new Array();
	values.push(brand_name);
	values.push(brand_description);
	console.log(values);
	client.query(query,values, (req, data)=>{
		res.redirect('/brands');
	});

});
app.get('/category/create', function(req,res){
	res.render('category_create');
});

app.get('/categories',function(req,res){
	client.query("SELECT * FROM products_category;", (req, data)=>{
		console.log(data.rows);
		
		res.render('categories',{
			categories: data.rows,
		});
		
	});
});

app.post('/category/create', function(req,res){
	category_name = req.body.name;

	var query = 'INSERT INTO products_category (name) VALUES ($1);';
	var values = new Array();
	values.push(category_name);
	console.log(values);
	client.query(query,values, (req, data)=>{
		res.redirect('/categories');
	});

});



app.get('/product/create', function(req,res){
	var brands = new Array();
	var categories = new Array();
	client.query("SELECT * FROM brands;", (req, data1)=>{
		brands = data1.rows;
	});

	client.query("SELECT * FROM products_category;", (req, data2)=>{
		categories = data2.rows;

		console.log(brands);
		console.log(categories);
		res.render('product_create',{
			brands: brands,
			categories: categories
		});
	});


});

app.post('/product/update', function(req,res){
	id = req.body.product_id;

	res.redirect('/product/update/id',{
		id: id
	});
});

app.post('/product/create', upload.single('primary_picture'), function(req,res){
	name = req.body.name;
	price = req.body.price;
	description = req.body.description;
	warranty = req.body.warranty;
	brand = req.body.brand;
	category = req.body.category;
	primary_picture = req.file.filename;

	var query = 'INSERT INTO products (name,price,description,warranty,brand_id,category_id,primary_picture) VALUES ($1,$2,$3,$4,$5,$6,$7);';
	var values = new Array();
	values.push(name);
	values.push(price);
	values.push(description);
	values.push(warranty);
	values.push(brand);
	values.push(category);
	values.push(primary_picture);

	client.query(query,values,(req,data)=>{

	});
   	res.redirect('/');
});
app.post('/product/id', function (req, res) {
	//var obj = (JSON.stringify(req.body));

	console.log(req.body.product_name);
	console.log(req.body.product_price);
	console.log(req.body.product_primary_picture);
	var product_description = req.body.product_description;
	res.render('form',{
		product_name: req.body.product_name,
		product_price: req.body.product_price,
		product_primary_picture: req.body.product_primary_picture,
		product_description : product_description,
		product_id: req.body.productuid,
		product_type: req.body.product_type,
		product_brand: req.body.product_brand
	});
});
app.listen(PORT, function() {
	console.log('Server started at port 3000');
});