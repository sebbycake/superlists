window.Superlists = {};
window.Superlists.initialize = function () {
    
    // $('input[name="text"]').on('keypress', function () {
    //     // console.log('in keypress handler');
    //     $('.has-error').hide();
    // });

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

    // const showErrorMsg = (msg) => {
    //     const errorDiv = document.getElementById('error')
    //     errorDiv.className = "warning has-error"
    //     const newContent = document.createTextNode(msg);
    //     // add the text node to the newly created div
    //     errorDiv.appendChild(newContent);
    // }

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

                // clean timestamp ISO field
                var date = new Date(json.timestamp);

                day = date.getDate()
                month = date.getMonth()

                month = months[month];
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
                    alert(input_value + ' already exists in your list.')
                    showErrorMsg("THIS ITEM EXISTS...")
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
