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
                    displayMessage('list-name-error-msg', null, 'input[name="name"]');
                } else {
                    canPost = true;
                    displayMessage('list-name-success-msg', null, 'input[name="name"]');
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
                        displayMessage('list-name-error-msg', null, 'input[name="name"]');
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

                const urlizedText = urlize(json.text);

                $('.item-list').append(
                    '<div class="item animate__animated animate__fadeIn">' +
                    urlizedText + '<br/>' +
                        '<span class="item-timestamp">' + 'Just now' +
                        '</span>' +
                        '<span class="delete-item-btn" data-id="' + json.id +  '">' +
                            '<i class="material-icons" style="color:#fff">' + 'delete_outline' +
                            '</i>' +
                        '</span>' +
                        '<span class="pin-item-btn" data-id="' + json.id +  '">' +
                            '<i class="material-icons" style="color:#fff">' + 'push_pin' +
                            '</i>' +
                        '</span>' +
                    '</div>'
                ) // end of appending todo item
             
            },
            error: function (xhr) {
                if (xhr.status == 400) {
                    // display error message
                    displayMessage('item-error-msg', 'This item already exists in your list.', 'input[name="text"]')

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


    // pin item request
    $(document).on('click', '.pin-item-btn', function () {

        const itemId = $(this).data('id')
        const pinButton = $(this).find('i.material-icons')[0];
        const parentDiv = $(this).parent()
        const csrfToken = getCookie('csrftoken')
        
        $.ajax({
            type: 'POST',
            url: `/lists/api/item/pin/${itemId}/`,
            data: {
                id: itemId,
                csrfmiddlewaretoken: csrfToken
            },
            success: function (json) {
                if (json.is_pinned) {
                    // prepend to .item-list div
                    $('.item-list').prepend(parentDiv);
                    pinButton.style.color = "#ff1f5a";
                    // scroll to top of the page where item is pinned
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                } else {
                    $('.item-list').append(parentDiv);
                    pinButton.style.color = "#fff";
                }
    
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

    // ------------------------- 
    // sharing list with other users 

    // open modal 
    $('.share-list-btn').click(() => {
        $('.share-list-modal').css('display', 'block');
        $('.item-list, .header, .input-form, .share-list-btn, nav').addClass('share-list-modal-open');
    })

    // close modal 
    $('.share-list-modal-close').click(() => {
        $('.share-list-modal').css('display', 'none');
        $('.item-list, .header, .input-form, .share-list-btn, nav').removeClass('share-list-modal-open');
    })

    // add users to share list with
    $(document).on('submit', '.share-list-email-form', function (event) {
        
        event.preventDefault();
        const userEmail = $('#share-list-email-input').val();
        const listId = $(this).data('id');
        const csrfToken = getCookie('csrftoken')
        
        $.ajax({
            type: 'POST',
            url: `/lists/api/list/share/${listId}/`,
            data: {
                user_email: userEmail,
                csrfmiddlewaretoken: csrfToken
            },
            success: function (json) {

                // add to the bottom of the list 
                $('.share-list-user-list').append(
                    '<div class="share-list-user-item animate__animated animate__fadeIn">' +
                        json.user_email +
                        '<span class="list-owner">shared</span>' + 
                        '<span class="delete-shared-user" user-id="' + json.user_id + '">&times;</span>' +
                    '</div>'
                    );
            },
            error: function (xhr) {

                if (xhr.status == 400) {
                    // display error msg
                    displayMessage('item-error-msg-share-list', 'User is already in the list.', "input[id='share-list-email-input']")
                } else if (xhr.status == 404) {
                    displayMessage('item-error-msg-share-list', 'User with this email cannot be found. Please try again.', "input[id='share-list-email-input']")
                } 
            } // end of error func

        }); // end of ajax call
    
    }); 

    // delete shared user
    $(document).on('click', '.delete-shared-user', function () {

        const userId = $(this).attr("user-id")
        const listId = $('.share-list-email-form').data('id');
        const parentDiv = $(this).parent()
        const csrfToken = getCookie('csrftoken')

        $.ajax({
            type: 'POST',
            url: `/lists/api/list/share/${listId}/delete/`,
            data: {
                user_id: userId,
                csrfmiddlewaretoken: csrfToken
            },
            success: function () {
                // remove 
                parentDiv.remove();
            },
            error: function (xhr) {
            } // end of error func

        }); // end of ajax call

    });



}; // end of window initialize()

