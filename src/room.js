function Room(transmitter, onDestroy) {
    this._transmitter = transmitter;
    this._transmitter.on('close', this.destroy.bind(this));
    this._onDestroy = onDestroy;

    this.createdOn = Date.now();
}

Room.prototype = {
    destroy: function () {
        [this._receiver, this._transmitter].filter(Boolean).map(function (stream) {
            stream.close();
        });
        delete this._receiver;
        delete this._transmitter;

        if (this._onDestroy) {
            this._onDestroy();
        }
    },
    connect: function (receiver) {
        this._receiver = receiver;
        this._receiver.on('close', this.destroy.bind(this));

        this._receiver.pipe(this._transmitter);
        this._transmitter.pipe(this._receiver);
    },
    isFull: function () {
        return !!this._receiver;
    }
};

module.exports = Room;
