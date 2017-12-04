$(document).ready(function () {

    $('#removeModal').on('show.bs.modal', function (event) {
        var btn = $(event.relatedTarget);
        var title = btn.data('title');
        var modal = $(this);
        modal.find('.modal-title').text('確認刪除' + title);
    });

    $('input[type=radio][name=inlineRadioOptions]').change(function () {
        if (this.value == 'ATM') {
            $('.ATM').show();
        }
        else {
            $('.ATM').hide();
        }
        if (this.value == 'store') {
            $('.store').show();
        }
        else {
            $('.store').hide();
        }
    });

});

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    "use strict";
    window.addEventListener("load", function () {
        var form = document.getElementById("needs-validation");
        form.addEventListener("submit", function (event) {
            if (form.checkValidity() == false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated");
        }, false);
    }, false);
}());
