//################# FUNCTION TO READ INI FILE#####################
var file = "http://192.10.10.133:8080/control2/config.ini";

var ip_node = '';
var port_node = '';

var ip_http = '';
var port_http = '';

var project_name = '';

var rawFile = new XMLHttpRequest();
rawFile.open("GET", file, false);
rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          
            var allText = rawFile.responseText;
            var lines = allText.split('\n');

            ip_node = lines[1].replace("host = ","").trim();
            port_node = lines[2].replace("port = ","").trim();

            ip_http = lines[4].replace("host = ","").trim();
            port_http = lines[5].replace("port = ","").trim();

            project_name = lines[7].replace("project_name = ","").trim();

        }
    }
}
rawFile.send(null);
//################# END FUNCTION TO READ INI FILE#####################
var socket = io.connect('http://'+ip_node+':'+port_node, { 'forceNew': true });
//var socket = io.connect('http://192.168.0.24:8001', { 'forceNew': true });
var cont = 0;
//id="body-access_real_time"
//-----------------------------------------
socket.on('access_pending', function(data) {
	console.log(data);
	render(data);
});
//-----------------------------------------
socket.on('wrong_event', function(data) {
	//console.log(data);
	$('#label-bell-notification').html('Nueva');

	var audio = $('#audio')[0];
	audio.play();

	if(data.pop_up == 1)
		showPop_up_Wrong_event(data);
});
//-----------------------------------------
socket.on('clean_notification', function(data) {
	if(data.clean == '1')
		$('#label-bell-notification').html('');
});
//-----------------------------------------
socket.on('access_people', function(data){
	console.log(data)
	render(data)
})
//-----------------------------------------
socket.on('visit', function(data) {
	//alert(in_people.length);
	//console.log(data);
	if(data.exit == 0)
	{
		//add in
		table_in.row.add([
	        data.people_rut,
	        data.people_name,
	        data.companies_name,
	        data.vehicle_patent,
	        data.access_people_date,
	        '<a href="http://'+ip_http+':'+port_http+'/'+project_name+'/index.php/cAccess_People/getDetail?id='+data.access_people_id+'" class="btn btn-primary btn-xs" role="button"><i class="fa fa-search"></i> Ver</a>'
	    ]).node().id = data.access_people_id;

	    table_in.draw(false);
	}
	else
	{
		//remove in
		table_in.row('#'+data.access_people_id).remove().draw(false);

		//add out
		table_out.row.add([
	        data.people_rut,
	        data.people_name,
	        data.companies_name,
	        data.vehicle_patent,
	        data.access_people_date,
	        '<a href="http://'+ip_http+':'+port_http+'/'+project_name+'/index.php/cAccess_People/getDetail?id='+data.access_people_id+'" class="btn btn-primary btn-xs" role="button"><i class="fa fa-search"></i> Ver</a>'
	    ]).node().id = data.access_people_id;

	    table_out.draw(false);
	}
});
//-----------------------------------------




//-------------------------------------------------------------------------------------------------

function render(data)
{
	if(data.operation == '1')
	{
		if($('#tr-'+data.id).length == 0)
		{
			var html = '';

			html += '<tr id="tr-'+data.id+'" style="cursor: pointer;" onclick="showAccessPeople('+data.id+');">';
		    //html += '<tr>';
		    html += '<td>'+data.id+'</td>';
		    html += '<td>'+data.rut+'</td>';
		    html += '<td>'+data.name+'</td>';
		    html += '<td>'+data.profile+'</td>';
		    html += '<td>'+data.access_type+'</td>';
		    html += '<td>'+data.company+'</td>';
		    html += '<td class="date_time_created" id="'+data.date_time_entrance+'">'+data.date_time_entrance+'</td>';
		    html += '<td class="date_time_end_time" id="'+data.date_time_end+'">'+data.date_time_end+'</td>';
		    html += '<td class="date_time_current"></td>';
		    html += '</tr>';

			document.getElementById('body-access_real_time').innerHTML += html;
		}
	}
	else
	{
		if($('#tr-'+data.id).length > 0)
			$('#tr-'+data.id).remove();
	}
}

function showPop_up_Wrong_event(data)
{

	var body = '';

	body += '<table class="table">';

	body += '<tr>'
	body += '<td>Persona</td>';
	body += '<td>'+data.people+'</td>';
	body += '</tr>';

	body += '<tr>'
	body += '<td>Puerta</td>';
	body += '<td>'+data.door+'</td>';
	body += '</tr>';

	body += '<tr>'
	body += '<td>Sensor</td>';
	body += '<td>'+data.sensor+'</td>';
	body += '</tr>';

	body += '<tr>'
	body += '<td>Movimiento</td>';
	body += '<td>'+data.entry+'</td>';
	body += '</tr>';

	body += '<tr>'
	body += '<td>Ubicación</td>';
	body += '<td>'+data.ubication+'</td>';
	body += '</tr>';

	body += '<tr>'
	body += '<td>Fecha</td>';
	body += '<td>'+data.date_time_now+'</td>';
	body += '</tr>';

	body += '</table>';

	$('#modal-wrong_event-title').html(data.title);
	$('#modal-wrong_event-body').html(body);

	$('#modal-wrong_event').modal('show');
}

