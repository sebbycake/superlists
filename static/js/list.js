window.Superlists = {};
window.Superlists.initialize = function () {

    // navbar animation
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        links.forEach(link => {
            link.classList.toggle('fade');
        })
    })



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
                    displayMessage('fail-error-msg');
                } else {
                    canPost = true;
                    displayMessage('success-error-msg');
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
                        displayMessage('fail-error-msg');
                    }

                } // end of error function

            }); // end of ajax

        } // end of canPost

    }); // end of on submit




    // post to-do item request
    $('#todo-create-form').submit(function (event) {

        event.preventDefault()
        const listId = $(this).data('id');
        const csrftoken = getCookie('csrftoken');
        const input_value = $('#id_text').val();

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
                day = dayOfTheMonth(date);
                month = months[date.getMonth()];
                hoursMins = formatAMPM(date);

                $('.todo-list').append(
                    '<div class="todo-item animate__animated animate__fadeIn">' +
                    json.text + '<br/>' +
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
                ) // end of appending todo item

            },
            error: function (xhr) {
                if (xhr.status == 400) {

                    // display error message 
                    $('.list').html('This item already exists in your list.')
                    $('.list').css("display", "block");

                    // hide after user starts typing
                    $('input[name="text"]').on('keypress', function () {
                        $('.list').hide();
                    });

                }
                else if (xhr.status == 500) {
                    alert("An error has occurred. Please try again later.")
                }
            } // end of error function

        }); // end of ajax call

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
            success: function () {
                parentDiv.remove()
            },
            error: function (xhr) {

                // display error message 
                $('.list').html('An error has occurred. Please try again later.')
                $('.list').css("display", "block");

                // delay 3s before hiding error msg
                setTimeout(function () {
                    $('.list').hide()
                }, 3000) // end of setTimeout()

            } // end of error func

        }); // end of ajax call
        
    });



    // delete list item for user
    $('.delete-list-item').click(function () {

        confirm_delete = confirm('Do you want to delete this list?')

        if (confirm_delete) {

            const listID = $(this).attr("list-id")
            const parentDiv = $(this).parent()
            const csrftoken = getCookie('csrftoken');

            $.ajax({
                type: 'POST',
                url: `/lists/api/list/delete/${listID}/`,
                data: {
                    id: listID,
                    csrfmiddlewaretoken: csrftoken,
                },
                success: function () {
                    parentDiv.remove()
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


};

