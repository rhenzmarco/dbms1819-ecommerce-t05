/*
CREATE TABLE Products(id SERIAL PRIMARY KEY, name varchar(80), type varchar(80), description varchar(300), brand varchar(80), price float(4), pic varchar(80));
INSERT INTO Products(name, type, description, brand, price, pic) VALUES('Nike Kobe A.D. NXT 360 Multicolor', 'Basketball Shoes', 'Kobes legacy continues. Kobe AD NXT 360 Mens Shoe resurrects the Mambas on-court mentality and killer instinct. ', 'Nike' , '9895', '/kobe.png');
INSERT INTO Products(name, type, description, brand, price, pic) VALUES('adidas Harden Vol. 2 LS Grey Five', 'Basketball Shoes', 'Gas, brake, cook. James Harden freezes defenders with his signature mix of Euro steps, hesitations and lightning-quick crossovers. These shoes combine James Hardens go-to style with a streetwear inspired design.', 'Adidas', '8500','/harden.png');
INSERT INTO Products(name, type, description, brand, price, pic) VALUES('Nike LeBron Soldier 12 SFG Team Red/Gum', 'Basketball Shoes', 'The LeBron Soldier XII SFG Basketball Shoe delivers lightweight, responsive cushioning for the court with Nike Zoom Air cushioning. Adjustable hook-and-loop straps offer adjustable, secure lockdown.', 'Nike', '6745','/lebron.png');
INSERT INTO Products(name, type, description, brand, price, pic) VALUES('Nike Kyrie 4 Laser Fuchsia', 'Basketball Shoes', 'The Kyrie 4 Mens Basketball Shoe is ultra-flexible, responsive and supportive. Its designed for Kyrie Irvings sudden changes of direction and smooth yet rapid playing style.', 'Nike', '6,295','/kyrie.png');
INSERT INTO Products(name, type, description, brand, price, pic) VALUES('Under Armour Curry 3Zero', 'Basketball Shoes', 'Built to perform on the gameÕs biggest stages, this shoe helped Stephen sweep his way through the first three rounds of the 2017 playoffs.', 'Under-Armour', '6295','/curry.png');
INSERT INTO Products(name, type, description, brand, price, pic) VALUES('Air Jordan XXXII Low Wing It', 'Basketball Shoes', 'The Air Jordan XXXII Low Mens Basketball Shoe features light, breathable Flyknit fabric that wraps your foot like a sock, plus powerful cushioning that helps you explode off the hardwood.', 'Jordan', '8095','/jordan.png');
database laman
*/
const express = require('express');
const path = require('path');
const { Client } = require('pg');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 5000

const client = new Client({
	database: 'dd3c9ddqhmqsf1',
	user: 'blyngucjcpjbdl',
	password: 'a3f53719e07cadeb9e08ed97af16fd1c4be426fac803b7214ae7633197223394',
	host: 'ec2-54-163-227-253.compute-1.amazonaws.com',
	port: 5432,
	ssl: true
});
/*
const client = new Client({
	database: 'storedb',
	user: 'postgres',
	password: '1234',
	host: 'localhost',
	port: 5432
});
*/
client.connect()
	.then(function() {
		console.log('You are connected to the database!');
	})
	.catch(function() {
		console.log('Error');
	})

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req,res) {
	client.query('SELECT * FROM Products', (req, data)=>{
		var list = [];
		for (var i = 0; i < data.rows.length; i++) {
			list.push(data.rows[i]);
		}
		res.render('home',{
			data: list,
			title: 'Basketball Shoes'
		});
	});
});
app.get('/products/:id', (req,res)=>{
	var id = req.params.id;
	client.query('SELECT * FROM Products', (req, data)=>{
		var list = [];
		for (var i = 0; i < data.rows.length+1; i++) {
			if (i==id) {
				list.push(data.rows[i-1]);
			}
		}
		res.render('products',{
			data: list
		});
	});
});
app.get('/edit', (req,res)=>{
	var id = req.params.id;
	res.render('edit');
});

app.post('/products/:id/send', function(req, res) {
	console.log(req.body);
	var id = req.params.id;
	const output = `
		<p>MAGANDANG ARAW MAY BAGO KANG INQUIRY!</p>
		<h3>Mga Detalye!</h3>
		<ul>
			<li>Customer Name: ${req.body.name}</li>
			<li>Phone: ${req.body.phone}</li>
			<li>Email: ${req.body.email}</li>
			<li>Product ID: ${req.body.productid}</li>
			<li>Quantity: ${req.body.quantity}</li>
		</ul>
	`;

		//nodemailer
	let transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        secure: true,
        auth: {
            user: 'basketball.shoes2018@gmail.com', 
            pass: 'gilasbasketball' 
        }
    });

    let mailOptions = {
        from: '"Basketball.shoes2018" <basketball.shoes2018@gmail.com>',
        to: 'rhenz.marco@yahoo.com',
        subject: 'Mga Requests',
        //text: req.body.name,
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        client.query('SELECT * FROM Products', (req, data)=>{
			var list = [];
			for (var i = 0; i < data.rows.length+1; i++) {
				if (i==id) {
					list.push(data.rows[i-1]);
				}
			}
			res.render('products',{
				data: list,
				msg: '---Email has been sent---'
			});
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

app.listen(3000,function() {
	console.log('Server started at port 3000');
});

app.listen(PORT);