var soc = io.connect('ws://h.xffa.net:5580');
soc.on('connect', function(){
	//soc.on('', function(data){});
	soc.on('join_ok', function(data){
		$('#loginForm_fieldset').attr('disabled',false);
		$('#btn_login').html('Login');
		$('#login_modal').modal('hide');

		$('#sidebar-menu').append('<li class="header"><i id="status_icon"></i>'+data.username+'</li>');
		for (var i=0; i<data.userlist.length; i++) {
			var username = data.userlist[i],
				li_id = 'userlist_'+username,
				li = '<li id="'+li_id+'">'+username+'</li>';
				$('#sidebar-menu').append(li);
		}
	});
	soc.on('join_fail', function(data){
		$('#loginForm_fieldset').attr('disabled',false);
		$('#btn_login').html('Login');
		$('#login_modal').modal('show');
	});
	soc.on('send_ok', function(data){
		$('#txtar_send')
			.attr('disabled',false)
			.val('');
		$('#btn_send')
			.attr('disabled',false)
			.html('<span class="glyphicon glyphicon-play"></span>');
		addMessage({type:'out', date:data.time, text:data.text});
	});
	soc.on('send_fail', function(data){
		$('#txtar_send').attr('disabled',false);
		$('#btn_send').attr('disabled',false);
		$('#btn_send').html('<span class="glyphicon glyphicon-play"></span>');
	});


	soc.on('joined', function(data){
		var li = '<li id="userlist_'+data.username+'">'+data.username+'</li>';
		$('#sidebar-menu').append(li);
		addMessage({type:'sys', date:data.time, text:'User '+data.username+' joined!'});
	});
	soc.on('leave', function(data){
		$('#userlist_'+data.username).remove();
		addMessage({type:'sys', date:data.time, text:'User '+data.username+' leave.'});
	});
	soc.on('message', function(data){
		addMessage({type:'in', date:data.time, username:data.username, text:data.text});
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
		datespan = (data.date != undefined) ? '<span class="time">'+(new Date(data.date)).toLocaleTimeString()+'</span>' : '',
		userspan = (data.username != undefined && data.username != '') ? '<span class="username">'+data.username+':</span>' : '',
		msg_board = $('#content'),
		msg = '<div class="'+msgType+'">'
			+ '<i class="glyphicon msg-icon"></i>'
			+ datespan
			+ userspan
			+ '<span class="text">'+data.text+'</span>'
			+ '</div>';

	msg_board
		.append(msg)
		.scrollTop(msg_board[0].scrollHeight);
}

function txtarSend_onKeypress(e) {
	if (e.keyCode == 13 && !e.shiftKey) {
		on_btnSend();
		return false;
	}
}

$('#btn_login').on('click', on_bntLogin);
$('#btn_send').on('click', on_btnSend);
$('#txtar_send').keydown(txtarSend_onKeypress);
