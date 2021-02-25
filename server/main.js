var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cors = require('cors');

var access_pending = [];

app.use(cors());
app.use(express.static('public'));
//---------------------------------
//estado actual
var id;
var rut;
var name;
var profile;
var access_type;
var company;
var date_time_entrance;
var date_time_end;
var operation;
//---------------------------------
//notificaciones
var title;
var people;
var door;
var sensor;
var entry;
var ubication;
var fecha;
var pop_up;
//---------------------------------
//limpiar "nueva notificacion"
var clean;
//---------------------------------
//visit
var access_people_id;
var people_rut;
var people_name;
var companies_name;
var vehicle_patent;
var access_people_date;
var exit;
//---------------------------------


//recibe parametros autorización visita
app.get("/parametros",function(req,res){

	id = req.query.add_id;
	rut = req.query.add_rut;
	name = req.query.add_name;
	profile = req.query.add_profile;
	access_type = req.query.add_access_type;
	company = req.query.add_company;
	date_time_entrance = req.query.add_date_time_entrance;
	date_time_end = req.query.add_date_time_end;
	operation = req.query.operation;

	var temp = {
		id: id,
		rut: rut,
		name: name,
		profile: profile,
		access_type: access_type,
		company: company,
		date_time_entrance: date_time_entrance,
		date_time_end: date_time_end,
		operation: operation
	};

	io.sockets.emit('access_pending', temp);
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('1');
	res.end();
			
});

//recibe wrong_event desde raspberry
app.get("/wrong_event",function(req,res){

	title = req.query.title;
	people = req.query.people;
	door = req.query.door;
	sensor= req.query.sensor;
	entry = req.query.entry;
	ubication = req.query.ubication;
	date_time_now = req.query.date_time_now;
	pop_up = req.query.pop_up;

	var temp = {

		title: title,
		people: people,
		door: door,
		sensor: sensor,
		entry: entry,
		ubication: ubication,
		date_time_now: date_time_now,
		pop_up: pop_up
	}

	io.sockets.emit('wrong_event', temp);
	io.sockets.emit('add_notification_display', temp);

	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('1');
	res.end();
			
});

//recibe el parametro del evento del boton Notificaciones
app.get("/clean_notification",function(req,res){

	clean = req.query.clean;

	var temp = {
		clean: clean
	}

	io.sockets.emit('clean_notification', temp);
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('1');
	res.end();
			
});

//recibe visit desde raspberry
app.get("/visit",function(req,res){

	access_people_id = req.query.access_people_id;
	people_rut = req.query.people_rut;
	people_name = req.query.people_name;
	companies_name = req.query.companies_name;
	vehicle_patent = req.query.vehicle_patent;
	access_people_date = req.query.access_people_date;
	exit = req.query.exit;

	var temp = {

		access_people_id: access_people_id,
		people_rut: people_rut,
		people_name: people_name,
		companies_name: companies_name,
		vehicle_patent: vehicle_patent,
		access_people_date: access_people_date,
		exit: exit
	}

	io.sockets.emit('visit', temp);
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('1');
	res.end();
			
});

io.on('connection', function(socket){
	console.log('conexion mediante socket.');
	//console.log('sessionID ' + socket.id);

	socket.on('access_pending', function(data){
		//recibe parametros
		app.get("/parametros",function(req,res){

			id = req.query.add_id;
			rut = req.query.add_rut;
			name = req.query.add_name;
			//last_name = req.query.add_last_name;
			profile = req.query.add_profile;
			access_type = req.query.add_access_type;
			company = req.query.add_company;
			date_time_entrance = req.query.add_date_time_entrance;
			date_time_end = req.query.add_date_time_end;
			operation = req.query.operation;

			var temp = {
				id: id,
				rut: rut,
				name: name,
				//last_name: last_name,
				profile: profile,
				access_type: access_type,
				company: company,
				date_time_entrance: date_time_entrance,
				date_time_end: date_time_end,
				operation: operation
			};

			io.sockets.emit('access_pending', temp);
		});
	});

	socket.on('wrong_event', function(data){
		//recibe wrong_event desde raspberry
		app.get("/wrong_event",function(req,res){

			title = req.query.title;
			people = req.query.people;
			door = req.query.door;
			sensor= req.query.sensor;
			entry = req.query.entry;
			ubication = req.query.ubication;
			date_time_now = req.query.date_time_now;
			pop_up = req.query.pop_up;

			var temp = {

				title: title,
				people: people,
				door: door,
				sensor: sensor,
				entry: entry,
				ubication: ubication,
				date_time_now: date_time_now,
				pop_up: pop_up
			}

			io.sockets.emit('wrong_event', temp);
			io.sockets.emit('add_notification_display', temp);

		});

	});

	socket.on('clean_notification', function(data){
		//recibe el parametro del evento del boton Notificaciones
		app.get("/clean_notification",function(req,res){

			clean = req.query.clean;

			var temp = {
				clean: clean
			}

			io.sockets.emit('clean_notification', temp);
		});
	});


	socket.on('visit', function(data){
		//recibe el parametro del evento del boton Notificaciones
		app.get("/visit",function(req,res){

			access_people_id = req.query.access_people_id;
			people_rut = req.query.people_rut;
			people_name = req.query.people_name;
			companies_name = req.query.companies_name;
			vehicle_patent = req.query.vehicle_patent;
			access_people_date = req.query.access_people_date;
			exit = req.query.exit;

			var temp = {

				access_people_id: access_people_id,
				people_rut: people_rut,
				people_name: people_name,
				companies_name: companies_name,
				vehicle_patent: vehicle_patent,
				access_people_date: access_people_date,
				exit: exit
			}

			io.sockets.emit('visit', temp);
		});
	});
});

server.listen(8001,'0.0.0.0', function() {
	console.log('Servidor corriendo en http://localhost:8001');
});