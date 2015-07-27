var express = require('express');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var app = express();

app.use(log);
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/run', run);

app.listen(8080, function () {
    console.log("[Server] listening on port " + this.address().port);
});

function log (request, response, next) {
    console.log("%s -> %s (%s)", request.method, request.url, new Date());
    next();
}

function escape(string) {
    return string.replace(/"/g, "\\\"")
                 .replace(/'/g, "\\\'")
                 .replace(/\n/g, "\\n");
}

function run (request, response) {
    console.log("received request with body %s", request.body.input);
    exec('echo -e \"' + escape(request.body.input) + '\" | node', function (error, stdout, stderr) {
        response.json({
            error: error.toString();
            stdout: stdout.toString(),
            stderr: stderr.toString()
        });

        response.end();
    });
}
