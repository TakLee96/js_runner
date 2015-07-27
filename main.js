$(document).ready(function () {

    $('#run').on('click', function () {
        
        $.post('/run', { input: $('#input').val() })
         .success(function (respondObject) {
             $('#output').val("Program exit with code " + respondObject.code + "\nstdout: " + respondObject.stdout + "\nstderr: " + respondObject.stderr);
         })
         .fail(function () {
             alert("failed!");
         });

    });

});
