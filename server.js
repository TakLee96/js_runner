var express = require('express');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var fs = require('fs');
var uid = require('uid');
var app = express();

app.use(logMiddlerware);
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/run', run);
app.use(errorHandlerMiddleware);

app.listen(8080, function () {
    console.log("[Server] listening on port " + this.address().port);
});

function logMiddlerware (request, response, next) {
    console.log("%s -> %s (%s)", request.method, request.url, new Date());
    next();
}

function run (request, response, next) {
    var jsid = uid();
    fs.writeFile("data/" + jsid + ".js", request.body.input, function (err) {
        if (err) {
            next(err);
        } else {
            var child = exec("node data/" + jsid + ".js", {
                timeout: 2000
            }, function (err, stdout, stderr) {
                if (err) {
                    next(err);
                } else {
                    response.status(200).json({
                        stdout: stdout.toString(),
                        stderr: stderr.toString()
                    }).end();

                    fs.unlink("data/" + jsid + ".js", function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            });
        }
    });
}

function errorHandlerMiddleware (error, request, response, next) {
    if (error) {
        console.error("An error has occured: " + error.toString());
        response.status(500).json(error).end();
    } else {
        console.error("404 request for " + request.url);
        response.status(404).end("Page not found...");
    }
}
