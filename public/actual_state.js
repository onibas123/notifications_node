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

//var socket = io.connect('http://192.168.0.24:8001', { 'forceNew': true });
var socket = io.connect('http://'+ip_node+':'+port_node, { 'forceNew': true });

socket.on('add_notification_display', function(data){
	//console.log(data)
	var body = '<tr>';
	body += '<td>'+1+'</td>';
	body += '<td>'+data.title+' : '+data.people+'</td>';
	body += '<td>'+data.door+'</td>';
	body += '<td>'+data.entry+'</td>';
	body += '<td>'+data.date_time_now+'</td>';
	body += '</tr>';

	$('#table-notifications > tbody > tr:first').before(body);
	$('#table-notifications tr:last').remove();

	orderTableNotifications();
})

function orderTableNotifications()
{

	for (var i=2;i<document.getElementById('table-notifications').rows.length ;i++) 
	{
	    document.getElementById('table-notifications').rows[i].cells[0].innerHTML = i;
	}
}

