var soc = io.connect('ws://h.xffa.net:5580');
soc.on('connect', function(){
	//soc.on('', function(data){});
	soc.on('join_ok', function(data){
		
	});
	soc.on('join_fail', function(data){
		
	});
	soc.on('send_ok', function(data){
		
	});
	soc.on('send_fail', function(data){
		
	});


	soc.on('joined', function(data){
		console.log('joined', data);
	});
	soc.on('leave', function(data){
		console.log('leave', data);
	});
	soc.on('message', function(data){
		console.log('message', data);
	});

});

function on_bntLogin() {
	var username = $('#txt_username').val(),
		passwd = $('#txt_passwd').val();
	soc.emit('join', {username:username,password:passwd});
}