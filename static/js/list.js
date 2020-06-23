window.Superlists = {};
window.Superlists.initialize = function () {

    let canPost = true;
    const delay = 500;

    // check list name's availability in real time
    // use of debounce to delay 0.5s before firing ajax call
    $('#id_name').keyup(debounce(function () {

        $.ajax({
            type: 'GET',
            url: '/lists/api/list/find/',
            data: {
                name: $(this).val()
            },
            success: function (json) {

                if (json.is_taken) {
                    canPost = false;
                    displayMessage('list-name-error-msg', 'input[name="name"]');
                } else {
                    canPost = true;
                    displayMessage('list-name-success-msg', 'input[name="name"]');
                } // end of json if avail stmt

            }, // end of success function   

        }); // end of ajax call

    }, delay) // end of debounce()

    ) // end of keyup()


    // post list request
    $('#list-create-form').submit(function (event) {

        event.preventDefault()
        const listName = $('#id_name').val()
        const slug = slugify(listName)

        // flag variable to check if list name is not taken
        // if the list name is taken from the ajax check,
        // then the ajax post request will not fire
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
                    window.location.href = `/lists/${json.id}/${json.slug}`
                }, // end of success function
                error: function (xhr) {
                    if (xhr.status == 400) {
                        displayMessage('list-name-error-msg', 'input[name="name"]');
                    }

                } // end of error function

            }); // end of ajax

        } // end of canPost

    }); // end of on submit


    // delete list for user
    $('.delete-list-btn').click(function () {

        confirm_delete = confirm('Do you want to delete this list?')

        if (confirm_delete) {

            const listID = $(this).attr("list-id")
            const parentDiv = $(this).parent()
            const csrfToken = getCookie('csrftoken')

            $.ajax({
                type: 'POST',
                url: `/lists/api/list/delete/${listID}/`,
                data: {
                    id: listID,
                    csrfmiddlewaretoken: csrfToken
                },
                success: function () {
                    // remove with animation
                parentDiv.hide('slow', () => $(this).remove() );
                },
                error: function (xhr) {
                    if (xhr.status == 500) {
                        alert("An error has occurred. Please try again later.")
                    } else if (xhr.status == 400) {
                        alert('400 error')
                    }

                } // end of error func

            }); // end of ajax call

        } // end of if confirm()

    }); // end of click()


    // ------------------------- 

     // post item request
     $('#item-create-form').submit(function (event) {

        event.preventDefault()
        const listId = $(this).data('id');
        const input_value = $('#id_text').val();

        $.ajax({
            type: 'POST',
            url: '/lists/api/item/create/',
            data: {
                text: input_value,
                list: listId,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (json) {

                document.getElementById("item-create-form").reset();

                const date = new Date(json.timestamp);

                // clean and format ISO timestamp field
                day = dayOfTheMonth(date);
                month = months[date.getMonth()];
                hoursMins = formatAMPM(date);

                $('.item-list').append(
                    '<div class="item animate__animated animate__fadeIn">' +
                    json.text + '<br/>' +
                        '<span class="item-timestamp">' + hoursMins + ' | ' + day + ' ' + month +
                        '</span>' +
                        '<span class="delete-item-btn" data-id="' + json.id +  '">' +
                            '<i class="material-icons" style="color:#fff">' + 'delete_outline' +
                            '</i>' +
                        '</span>' +
                    '</div>'
                ) // end of appending todo item
             
            },
            error: function (xhr) {
                if (xhr.status == 400) {
                    // display error message
                    displayMessage('item-error-msg', 'input[name="text"]', 'This item already exists in your list.')

                }
                else if (xhr.status == 500) {
                    displayMessage('item-error-msg', 'An error has occurred. Please try again later.')
                }
            } // end of error function

        }); // end of ajax call

    });



    // delete item request
    $(document).on('click', '.delete-item-btn', function () {

        const itemId = $(this).data('id')
        const parentDiv = $(this).parent()
        const csrfToken = getCookie('csrftoken')

        $.ajax({
            type: 'POST',
            url: `/lists/api/item/delete/${itemId}/`,
            data: {
                id: itemId,
                csrfmiddlewaretoken: csrfToken
            },
            success: function () {
                // remove with animation
                parentDiv.hide('slow', () => $(this).remove() );
            },
            error: function (xhr) {

                // display error msg
                displayMessage('item-error-msg', 'An error has occurred. Please try again later.')

                // delay 3s before hiding error msg
                setTimeout(function () {
                    $('.item-error-msg').hide()
                }, 3000) // end of setTimeout()

            } // end of error func

        }); // end of ajax call

    });


};

