$(document).ready(function () {

    var runButton = $('#run');
    var inputTextField = $('#input');
    var outputTextField = $('#output');

    var println = function (text) {
        outputTextField.val(text);
    };

    // copied code to handle tab
    $(document).delegate('#input', 'keydown', function(e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) {
            e.preventDefault();
            var start = $(this).get(0).selectionStart;
            var end = $(this).get(0).selectionEnd;

            $(this).val($(this).val().substring(0, start) + "    " + $(this).val().substring(end));

            $(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + 4;
        }
    });

    runButton.on('click', function () {
        
        runButton.html('running');
        runButton.prop('disabled', true);

        $.post('/run', { input: $('#input').val() })
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
