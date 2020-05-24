window.Superlists = {};
window.Superlists.initialize = function () {

    $('input[name="name"]').on('keypress', function () {
        // console.log('in keypress handler');
        $('.has-error').hide();
    });

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formatAMPM = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'p.m.' : 'a.m.';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // post item view
    $(document).on('submit', '#todo-form', function (event) {

        event.preventDefault()
        const listId = $(this).data('id')
        const csrftoken = getCookie('csrftoken');
        const input_value = $('#id_text').val()

        $.ajax({
            type: 'POST',
            url: '/lists/api/create/',
            data: {
                text: input_value,
                list: listId,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (json) {

                document.getElementById("todo-form").reset();

                const date = new Date(json.timestamp);

                // clean and format ISO timestamp field
                day = date.getDate()
                month = months[date.getMonth()];
                hoursMins = formatAMPM(date)

                $('.todo-list').append(
                    '<div class="todo-item">' + json.text + '<br/>' +
                        '<span class="todo-timestamp">' + hoursMins + ' | ' + day + ' ' + month +
                        '</span>' +
                        '<form method="post" data-id="' + json.id + '"' + 'class="delete-button">' +
                            '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                            '<button>' +
                                '<i class="material-icons">' + 'delete_outline' +
                                '</i>' +
                            '</button>' +
                        '</form>' +
                    '</div>'
                )

            },
            error: function (xhr) {
                if (xhr.status == 400) {

                    // display error message 
                    $('.list').css("display", "block");

                    // hide after user starts typing
                    $('input[name="text"]').on('keypress', function () {
                        $('.list').hide();
                    });

                }
                else if (xhr.status == 500) {
                    alert("An error has occurred. Please try again later.")
                }
            }
        });
    });



    // delete view
    $(document).on('submit', '.delete-button', function (event) {

        event.preventDefault()
        const itemId = $(this).data('id')
        const parentDiv = $(this).parent()

        $.ajax({
            type: 'POST',
            url: `/lists/api/delete/${itemId}/`,
            data: {
                id: itemId,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (json) {
                parentDiv.remove()
            },
            error: function (xhr, errmsg, err) {

            }
        });
    });



};

// console.log('list.js loaded')
