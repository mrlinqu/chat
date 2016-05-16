
var io = require('socket.io')(5580);
//io.set('log level', 1); // Отключаем вывод полного лога - пригодится в production'е

io.sockets.on('connection', function (socket) {
    var time = (new Date).toLocaleTimeString();
    console.log('connected '+socket.request.connection.remoteAddress+':'+socket.request.connection.remotePort);

    var username,
        logedin = false;

    socket.on('join', function (msg) {
        var time = (new Date).toLocaleTimeString();
        if (msg.username !== undefined) {
            username = msg.username;
            socket.join('main');
            logedin = true;
            socket.broadcast.json.send({'event': 'joined', 'username': username, 'time': time});
        }
        console.log('join '+username);
    });
    socket.on('message', function (msg) {
        if (logedin) {
            var time = (new Date).toLocaleTimeString();
            //socket.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
            //socket.broadcast.json.send({'event': 'message', 'username': username, 'text': msg, 'time': time})
            socket.to('main').emit('message', {'username': username, 'text': msg, 'time': time});
            socket.json.send({'event': 'sent', 'time': time});
        }
    });
    socket.on('disconnect', function() {
        if (logedin) {
            var time = (new Date).toLocaleTimeString();
            socket.to('main').emit('leave', {'username': username, 'time': time});
        }
        console.log('disconnect '+username);
        //io.sockets.json.send({'event': 'leave', 'username': username, 'time': time});
    });
});
