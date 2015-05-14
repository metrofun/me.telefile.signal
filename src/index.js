var app = require('koa')(),
    router = require('routes')(),
    cors = require('koa-cors'),
    Frame = require('../node_modules/me.telefile.www/src/network/frame.js'),
    httpServer = require('http').createServer(app.callback()),
    sockjsServer = require('sockjs').createServer(),
    roomHub = require('./room-hub.js');

router.addRoute('/v1/room/create/*', function (stream) {
    // TODO check race condition
    var pin = roomHub.createRoom(stream);

    stream.write(Frame.encode(1, {pin: pin}));
});
router.addRoute('/v1/room/:pin/*', function (stream, params) {
    roomHub.joinRoom(params.pin, stream);

    stream.write(Frame.encode(1, {pin: params.pin}));
});

app.use(cors());

sockjsServer.installHandlers(httpServer, {prefix: '[/]v1[/]room[/](?:create|[0-9]{4})'});
sockjsServer.on('connection', function (stream) {
    var match = router.match(stream.pathname);

    match.fn.apply(stream, [stream, match.params, match.splats]);
});

httpServer.listen(80);
// httpServer.listen(8888);
