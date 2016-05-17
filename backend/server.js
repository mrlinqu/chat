
var io = require('socket.io')(5580);
var htmlspecialchars = require('htmlspecialchars');
var userlist = [];

io.sockets.on('connection', function (socket) {
    var time = (new Date).toJSON();
    var userAddr = socket.request.connection.remoteAddress+':'+socket.request.connection.remotePort;
    console.log('connected '+userAddr);

    var username,
        logedin = false;

    socket.on('join', function (msg) {
        var time = (new Date).toJSON();
        if (msg.username !== undefined && msg.username != '') {
            username = htmlspecialchars(msg.username);
            socket.join('main');
            logedin = true;
            userlist.push(username);
            socket.emit('join_ok', {'username': username, 'userlist': userlist, 'time': time});
            socket.to('main').emit('joined', {'username': username, 'time': time});
        } else {
            socket.emit('join_fail', {'time': time});
        }
        console.log('join '+username);
    });

    socket.on('send', function (msg) {
        var time = (new Date).toJSON();
        console.log(username+' send: '+msg);
        if (logedin) {
            msg = htmlspecialchars(msg);
            socket.to('main').emit('message', {'username': username, 'text': msg, 'time': time});
            socket.emit('send_ok', {'text': msg, 'time': time});
        } else {
            socket.emit('send_fail', {'time': time});
        }
    });
    socket.on('disconnect', function() {
        if (logedin) {
            var time = (new Date).toJSON();
            userlist = userlist.filter(function(val){
                return val != username;
            });
            socket.to('main').emit('leave', {'username': username, 'time': time});
        }
        console.log('disconnect '+userAddr+' '+username);
    });
});
