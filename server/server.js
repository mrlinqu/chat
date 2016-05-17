
var io = require('socket.io')(5580);
//io.set('log level', 1); // Отключаем вывод полного лога - пригодится в production'е

io.sockets.on('connection', function (socket) {
    var time = (new Date).toJSON();
    console.log('connected '+socket.request.connection.remoteAddress+':'+socket.request.connection.remotePort);

    var username,
        logedin = false;

    socket.on('join', function (msg) {
        var time = (new Date).toJSON();
        if (msg.username !== undefined) {
            username = msg.username;
            socket.join('main');
            logedin = true;
            socket.emit('join_ok', {'time': time});
            socket.to('main').emit('joined', {'username': username, 'time': time});
            //socket.broadcast.json.send({'event': 'joined', 'username': username, 'time': time});
        } else {
            socket.emit('join_fail', {'time': time});
        }
        console.log('join '+username);
    });

    socket.on('send', function (msg) {
        var time = (new Date).toJSON();
        console.log(username+' send: '+msg);
        if (logedin) {
            //socket.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
            //socket.broadcast.json.send({'event': 'message', 'username': username, 'text': msg, 'time': time})
            socket.to('main').emit('message', {'username': username, 'text': msg, 'time': time});
            socket.emit('send_ok', {'time': time});
        } else {
            socket.emit('send_fail', {'time': time});
        }
    });
    socket.on('disconnect', function() {
        if (logedin) {
            var time = (new Date).toJSON();
            socket.to('main').emit('leave', {'username': username, 'time': time});
        }
        console.log('disconnect '+username);
        //io.sockets.json.send({'event': 'leave', 'username': username, 'time': time});
    });
});
