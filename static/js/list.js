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
                    parentDiv.hide('slow', () => $(this).remove());
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
                    '<div>' +
                    urlizedText +
                    '<br/></div>' +
                    '<span class="item-timestamp">' + 'Just now' +
                    '</span>' +
                    '<span class="delete-item-btn" data-id="' + json.id + '">' +
                    '<i class="material-icons" style="color:#fff">' + 'delete_outline' +
                    '</i>' +
                    '</span>' +
                    '<span class="edit-item-btn" data-id="' + json.id + '">' +
                    '<i class="fa fa-edit" style="font-size:24px; color:white; margin-left:3px"></i>' +
                    '</span>' +
                    '<span class="pin-item-btn" data-id="' + json.id + '">' +
                    '<i class="material-icons" style="color:#fff">' + 'push_pin' +
                    '</i>' +
                    '</span>' +
                    '<span class="palette-item-btn">' +
                    '<i class="material-icons" style="color:#fff">palette</i>' +
                    '</span>' +
                    '<div class="palette-tooltip" data-id="' + json.id + '">' +
                    '<div class="tooltip-color tooltip-red">i</div>' +
                    '<div class="tooltip-color tooltip-green">i</div>' +
                    '<div class="tooltip-color tooltip-blue">i</div>' +
                    '<div class="tooltip-color tooltip-purple">i</div>' +
                    '<div class="tooltip-color tooltip-original">i</div>' +
                    '</div>' +
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


    // edit item request
    $(document).on('click', '.edit-item-btn', function () {

        const itemId = $(this).data('id')
        const itemText = $(this).siblings()[0];
        const listId = $(this).data('list-id')
        const csrfToken = getCookie('csrftoken')

        // toggle contenteditable attribute
        if (itemText.hasAttribute("contenteditable")) {
            itemText.removeAttribute("contenteditable");
        } else {
            itemText.setAttribute("contenteditable", "true");
        }
        // display border bottom to simulate a form
        itemText.classList.toggle('item-text');
        // show input cursor to simulate a form
        itemText.focus();

        $(itemText).keydown(function (event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                updatedText = itemText.innerText.trim();
                console.log(updatedText)

                // post to server 
                $.ajax({
                    type: 'POST',
                    url: `/lists/api/item/update/${itemId}/`,
                    data: {
                        text: updatedText,
                        listId: listId,
                        csrfmiddlewaretoken: csrfToken
                    },
                    success: function () {
                        itemText.removeAttribute("contenteditable");
                        itemText.classList.remove('item-text');
                        itemText.blur();
                    },
                    error: function (xhr) {

                        if (xhr.status == 400) {
                            // display error message
                            displayMessage('item-error-msg', 'This item already exists in your list.', 'input[name="text"]')

                        }
                        else if (xhr.status == 500) {
                            displayMessage('item-error-msg', 'An error has occurred. Please try again later.')
                            // delay 3s before hiding error msg
                            setTimeout(function () {
                                $('.item-error-msg').hide()
                            }, 3000) // end of setTimeout()
                        }

                    } // end of error func

                }); // end of ajax call

            } // end of key keycide

        }); // end of keydown fn

    }); // end of click edit item btn



    // delete item request
    $(document).on('click', '.delete-item-btn', function () {

        confirm_delete = confirm('Do you want to delete this item?')

        if (confirm_delete) {

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
                    parentDiv.hide('slow', () => $(this).remove());
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

        }

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
                $('html, body').animate({ scrollTop: 0 }, 'fast');

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
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
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

    // ------------------------- 
    // changing list item's color

    $(document).on('click', '.palette-item-btn', function (e) {

        const paletteTooltip = $(this).siblings().slice(-1);

        // toggle paletteTooltip 
        if (paletteTooltip.css('display') == 'none') {
            paletteTooltip.css('display', 'flex');
        } else {
            paletteTooltip.css('display', 'none');
        }

    });  // end of on-click

    // update color field database
    $(document).on('click', '.tooltip-color', function () {

        const color = $(this).css('background-color');
        const paletteTooltip = $(this).parent();
        const itemDiv = $(this).parent().parent();
        const itemId = paletteTooltip.data('id');
        const csrfToken = getCookie('csrftoken');

        let isNotSameColor = color !== itemDiv.css('background-color');

        if (isNotSameColor) {
            $.ajax({
                type: 'POST',
                url: `/lists/api/item/color/change/${itemId}/`,
                data: {
                    color: color,
                    csrfmiddlewaretoken: csrfToken
                },
                success: function () {
                    // change div color
                    itemDiv.css('background-color', color);
                    paletteTooltip.css('display', 'none');
                },
                error: function (xhr) {
                    // display error msg
                    displayMessage('item-error-msg', 'An error has occurred. Please try again later.')
                    $('html, body').animate({ scrollTop: 0 }, 'fast');

                    // delay 3s before hiding error msg
                    setTimeout(function () {
                        $('.item-error-msg').hide()
                    }, 3000) // end of setTimeout()
                } // end of error func

            }); // end of ajax call 
        } else {
            paletteTooltip.css('display', 'none');
        }

    });  // end of on-click

    // ---------------

    // scroll to top feature

    //Get the button:
    mybutton = document.getElementById("scrollToTopBtn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() { displayScrollButton() };

    function displayScrollButton() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    mybutton.addEventListener('click', () => {
        const body = $("html, body");
        body.animate({ scrollTop: 0 }, 300);
        // document.body.scrollTop = 0; // For Safari
        // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    })

   


}; // end of window initialize()

