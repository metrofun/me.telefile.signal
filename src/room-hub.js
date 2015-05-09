var Room = require('./room.js');

function RoomHub() {
    this._roomByPin = Object.create(null);

    this._enableRoomCollector();
}

RoomHub.prototype = {
    PIN_LENGTH: 4,
    ROOM_COLLECTOR_PERIOD: 30 * 60 * 60 * 1000,

    createRoom: function (transmitter) {
        var pin = this._getFreePin();

        this._roomByPin[pin] = new Room(transmitter);

        return pin;
    },
    joinRoom: function (pin, receiver) {
        var room = this._roomByPin[pin];

        if (room && !room.isFull()) {
            room.connect(receiver);
        } else {
            receiver.close(404);
        }
    },
    _enableRoomCollector: function () {
        var pin, room, now = Date.now();

        for (pin in this._roomByPin) {
            room = this._roomByPin[pin];

            if (now - room.createdOn > this.ROOM_COLLECTOR_PERIOD) {
                room.destroy();
                delete this._roomByPin[pin];
            }
        }

        setTimeout(this._enableRoomCollector.bind(this), this.ROOM_COLLECTOR_PERIOD);
    },
    _getFreePin: function () {
        var pin;

        do {
            pin = this._generatePin();
        } while (this._roomByPin[pin]);

        return pin;
    },
    _generatePin: function () {
        return Array.apply(null, {length: this.PIN_LENGTH}).map(function () {
            return Math.floor(Math.random() * 10);
        }).join('');
    }
};

module.exports = new RoomHub();
