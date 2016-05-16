var soc = io.connect('ws://h.xffa.net:5580');
soc.on('connect', function(){
	//soc.on('', function(data){});
	soc.on('join_ok', function(data){
		$('#loginForm_fieldset').attr('disabled','');
		$('#btn_login').innerHTML = 'Login';
		$('#login_modal').modal('hide');
	});
	soc.on('join_fail', function(data){
		$('#loginForm_fieldset').attr('disabled','');
		$('#btn_login').innerHTML = 'Login';
		$('#login_modal').modal('show');
	});
	soc.on('send_ok', function(data){
		$('#txtar_send').attr('disabled','');
		$('#btn_send').attr('disabled','');
		$('#btn_send').innerHTML = '<span class="glyphicon glyphicon-play"></span>';
	});
	soc.on('send_fail', function(data){
		$('#txtar_send').attr('disabled','');
		$('#btn_send').attr('disabled','');
		$('#btn_send').innerHTML = '<span class="glyphicon glyphicon-play"></span>';
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
	$('#loginForm_fieldset').attr('disabled',true);
	$('#btn_login').innerHTML = '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Logging in...';
	soc.emit('join', {username:username,password:passwd});
}

function on_btnSend() {
	var msg = $('#txtar_send').val();
	$('#txtar_send').attr('disabled',true);
	$('#btn_send').attr('disabled',true);
	$('#btn_send').innerHTML = '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>';
	soc.emit('send', {msg:msg});
}