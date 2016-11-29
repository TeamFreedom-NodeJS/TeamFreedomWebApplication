(() => {
    const $loginForm = $('#loginForm'),
        $loginBtn = $('#loginBtn');

    $loginBtn.on('click', () => {

        return Promise.resolve()
            .then(() => {
                let dataArray = $loginForm.serializeArray(),
                    dataObj = {};

                $(dataArray).each(function(i, field) {
                    dataObj[field.name] = field.value;
                });

                return dataObj;
            })
            .then((user) => {
                $.ajax({
                        url: '/auth/sign-in',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(user)
                    })
                    .done((res) => {
                        window.location = res.redirectRoute;
                    })
                    .fail((err) => {
                       console.log(err.responseText);
                    });
            })
            .catch((err) => {
                console.log(err.responseText);
            });
    });

})();