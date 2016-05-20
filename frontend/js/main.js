/*
 *
 */

(function (){
    'use strict';

    function on_connect(){
    	$('#waitConnect_modal').modal('hide');
		$('#login_modal').modal('show');
    };

    function on_disconnect(){
    	$('#login_modal').modal('hide');
		$('#waitConnect_modal .modal-body').html("Connecting lost!\nReconnect...");
    	$('#waitConnect_modal').modal('show');
    };

    function on_joinOk(data){
    	$('#loginForm_fieldset').attr('disabled',false);
		$('#btn_login').html('Login');
		$('#login_modal').modal('hide');

		$('#sidebar-menu').html('<li class="header"><i id="status_icon"></i>'+data.username+'</li>');
		for (var i=0; i<data.userlist.length; i++) {
			var username = data.userlist[i],
				li_id = 'userlist_'+username,
				li = '<li id="'+li_id+'">'+username+'</li>';
				$('#sidebar-menu').append(li);
		}
    };

    function on_joinFail(data){
    	$('#loginForm_fieldset').attr('disabled',false);
		$('#btn_login').html('Login');
		$('#login_modal').modal('show');
    };

    function on_sendOk(data){
    	$('#txtar_send')
			.attr('disabled',false)
			.val('');
		$('#btn_send')
			.attr('disabled',false)
			.html('<span class="glyphicon glyphicon-play"></span>');
		addMessage({type:'out', date:data.time, text:data.text});
		$('#txtar_send').focus();
    };

    function on_sendFail(data){
    	$('#txtar_send').attr('disabled',false);
		$('#btn_send').attr('disabled',false);
		$('#btn_send').html('<span class="glyphicon glyphicon-play"></span>');
		$('#txtar_send').focus();
    };

    function on_joined(data){
    	var li = '<li id="userlist_'+data.username+'">'+data.username+'</li>';
		$('#sidebar-menu').append(li);
		addMessage({type:'sys', date:data.time, text:'User '+data.username+' joined!'});
    };

    function on_leave(data){
    	$('#userlist_'+data.username).remove();
		addMessage({type:'sys', date:data.time, text:'User '+data.username+' leave.'});
    };

    function on_message(data){
    	addMessage({type:'in', date:data.time, username:data.username, text:data.text});
    };




    function on_bntLogin() {
		var username = $('#txt_username').val().trim(),
			passwd = $('#txt_passwd').val();
		if (username == '') {
			return;
		}
		$('#loginForm_fieldset').attr('disabled',true);
		$('#btn_login').html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Logging in...');
		soc.emit('join', {username:username,password:passwd});
	};

	function on_btnSend() {
		var msg = $('#txtar_send').val().trim();
		if (msg == '') {
			return;
		}
		$('#txtar_send').attr('disabled',true);
		$('#btn_send').attr('disabled',true);
		$('#btn_send').html('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
		soc.emit('send', msg);
	};

	function txtarSend_onKeypress(e) {
		if (e.keyCode == 13 && !e.shiftKey) {
			on_btnSend();
			return false;
		}
	};

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
	};

	function onWrapperResize() {
        var neg = $('.main-header').outerHeight() + $('.main-footer').outerHeight();
        var window_height = $(window).height();
        $(".content-wrapper, .right-side").css('height', window_height - neg);
    };





	var soc = io.connect('ws://chat.lysva.ru:5580');
    soc.on('connect', on_connect);
    soc.on('disconnect', on_disconnect);
    soc.on('join_ok', on_joinOk);
    soc.on('join_fail', on_joinFail);
    soc.on('send_ok', on_sendOk);
    soc.on('send_fail', on_sendFail);
    soc.on('joined', on_joined);
    soc.on('leave', on_leave);
    soc.on('message', on_message);


    $('#btn_login').on('click', on_bntLogin);
	$('#btn_send').on('click', on_btnSend);
	$('#txtar_send').keydown(txtarSend_onKeypress);

	$('#login_modal').modal('hide');
    $('#waitConnect_modal').modal('show');
    $(window, ".wrapper").resize(onWrapperResize);

    //для простановки размеров после запуска приложения
    onWrapperResize();
});
