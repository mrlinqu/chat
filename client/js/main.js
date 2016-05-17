var soc = io.connect('ws://h.xffa.net:5580');
soc.on('connect', function(){
	//soc.on('', function(data){});
	soc.on('join_ok', function(data){
		$('#loginForm_fieldset').attr('disabled',false);
		$('#btn_login').html('Login');
		$('#login_modal').modal('hide');
	});
	soc.on('join_fail', function(data){
		$('#loginForm_fieldset').attr('disabled',false);
		$('#btn_login').html('Login');
		$('#login_modal').modal('show');
	});
	soc.on('send_ok', function(data){
		$('#txtar_send').attr('disabled',false);
		$('#btn_send').attr('disabled',false);
		$('#btn_send').html('<span class="glyphicon glyphicon-play"></span>');
	});
	soc.on('send_fail', function(data){
		$('#txtar_send').attr('disabled',false);
		$('#btn_send').attr('disabled',false);
		$('#btn_send').html('<span class="glyphicon glyphicon-play"></span>');
	});


	soc.on('joined', function(data){
		console.log('joined', data);
	});
	soc.on('leave', function(data){
		console.log('leave', data);
	});
	soc.on('message', function(data){
		var dt = new Date(data.time);
		addMessage({type:'in', date:dt, user:data.username, text:data.text});
		//console.log('message', data);
	});

});

function on_bntLogin() {
	var username = $('#txt_username').val(),
		passwd = $('#txt_passwd').val();
	$('#loginForm_fieldset').attr('disabled',true);
	$('#btn_login').html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Logging in...');
	soc.emit('join', {username:username,password:passwd});
}

function on_btnSend() {
	var msg = $('#txtar_send').val();
	$('#txtar_send').attr('disabled',true);
	$('#btn_send').attr('disabled',true);
	$('#btn_send').html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
	soc.emit('send', msg);
}

function addMessage(data) {
	var msgType = 'msg '+data.type,
		dt = data.date,
		msg_board = $('#content'),
		msg = '<div class="'+msgType+'">'
			+'<span class="icon"></span>'
			+'<span class="time">'+dt+'</span>'
			+'<span class="username">'+data.username+'</span>'
			+'<span class="text">'+data.text+'</span>'
			+'</div>';

	msg_board
		.append(msg)
		.scrollTop(msg_board[0].scrollHeight);
}

$('#btn_login').on('click', on_bntLogin);
$('#btn_send').on('click', on_btnSend);
