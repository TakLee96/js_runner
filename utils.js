var util = require('util');
var Writable = require('stream').Writable;
util.inherits(SimpleWritableStream, Writable);

function SimpleWritableStream () {
    Writable.call(this);
    this.buffer = new Buffer("");
}

SimpleWritableStream.prototype._write = function(chunk, encoding, callback) {
    this.buffer += chunk;
    callback();
};

SimpleWritableStream.prototype.toString = function() {
    return this.buffer.toString();
};

exports.SimpleWritableStream = SimpleWritableStream;
