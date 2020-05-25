window.Superlists = {};
window.Superlists.initialize = function () {

    let canPost = false;

    // check list name's availability in real time
    $('#list-create-form').bind('input', function () {

        const listName = $('#id_name').val()

        $.ajax({
            type: 'GET',
            url: '/lists/api/list/find/',
            data: {
                name: listName
            },
            success: function (json) {

                if (json.is_taken) {
                    canPost = false;
                    displayMessage('fail-message-list');
                } else {
                    canPost = true;
                    displayMessage('success-message-list');
                } // end of json if avail stmt

            }, // end of success function

        }); // end of ajax call
    })


    // post list request
    $(document).on('submit', '#list-create-form', function (event) {

        event.preventDefault()
        const listName = $('#id_name').val()
        const slug = slugify(listName)

        // flag vatiable to check if list name is not taken
        if (canPost) {

            $.ajax({
                type: 'POST',
                url: '/lists/api/list/create/',
                data: {
                    name: listName,
                    slug: slug,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                },
                success: function (json) {
                    // redirect to list detail pagge
                    window.location.href = `/lists/${json.slug}`
                },

            });

        } else {
            // display again since entering would
            // cause the message triggered above to hide
            displayMessage('fail-message-list');
        }

    });




    // post to-do item request
    $(document).on('submit', '#todo-create-form', function (event) {

        event.preventDefault()
        const listId = $(this).data('id')
        const csrftoken = getCookie('csrftoken');
        const input_value = $('#id_text').val()

        $.ajax({
            type: 'POST',
            url: '/lists/api/todo/create/',
            data: {
                text: input_value,
                list: listId,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (json) {

                document.getElementById("todo-create-form").reset();

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



    // delete todo item request
    $(document).on('submit', '.delete-button', function (event) {

        event.preventDefault()
        const itemId = $(this).data('id')
        const parentDiv = $(this).parent()

        $.ajax({
            type: 'POST',
            url: `/lists/api/todo/delete/${itemId}/`,
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

