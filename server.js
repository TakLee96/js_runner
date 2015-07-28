var express = require('express');
var bodyParser = require('body-parser');
var vm = require('vm');
var SimpleWritableStream = require('./utils').SimpleWritableStream;
var app = express();

app.use(logMiddlerware);
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/run', run);
app.use(errorHandlerMiddleware);

app.listen(process.env.PORT || 8080, function () {
    console.log("[Server] listening on port " + this.address().port);
});

function logMiddlerware (request, response, next) {
    console.log("(%s) %s -> [%s] ", new Date(), request.method, request.url);
    next();
}

function run (request, response, next) {
    try {
        var stdout = new SimpleWritableStream();
        var stderr = new SimpleWritableStream();
        var module = { exports: {} };
        var fake_require = function () {
            throw new Error("require is not supported");
        };
        fake_require.toString = function () {
            return "function () { [native code] }";
        };

        vm.runInNewContext(request.body.input, {
            console: new console.Console(stdout, stderr),
            process: {},
            module: module,
            exports: module.exports,
            require: fake_require
        }, { timeout: '2000' });
    } catch (e) {
        stderr.write(new Buffer(e.stack.toString()));
    } finally {
        response.json({
            stdout: stdout.toString(),
            stderr: stderr.toString()
        }).end();
    }
}

function errorHandlerMiddleware (error, request, response, next) {
    if (error) {
        console.error(error.stack.toString());
        response.status(500).json(error).end();
    } else {
        console.error("404 request for " + request.url);
        response.status(404).end("Page not found...");
    }
}
