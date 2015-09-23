$(document).ready(function () {

    var editor = ace.edit("input");
    var JavaScriptMode = ace.require("ace/mode/javascript").Mode;
    editor.getSession().setMode(new JavaScriptMode());

    var runButton = $('#run');
    var inputTextField = $('#input');
    var outputTextField = $('#output');

    var println = function (text) {
        outputTextField.val(text);
    };

    runButton.on('click', function () {
        
        runButton.html('running');
        runButton.prop('disabled', true);

        $.post('/run', { input: $(".ace_text-layer")[0].innerText })
         .success(function (respondObject) {
             println("STDOUT:\n" + respondObject.stdout + "\nSTDERR:\n" + respondObject.stderr);
             runButton.html('run');
             runButton.prop('disabled', false);
         })
         .fail(function (errorObject) {
             println("Program has crashed... " + JSON.stringify(errorObject));
             runButton.html('run');
             runButton.prop('disabled', false);
         });

    });

});
