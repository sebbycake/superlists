window.Superlists = {};
window.Superlists.initialize = function() {
    // console.log('initialize called')
    $('input[name="text"]').on('keypress', function() {
        // console.log('in keypress handler');
        $('.has-error').hide();
    });
    
    $('input[name="name"]').on('keypress', function() {
        // console.log('in keypress handler');
        $('.has-error').hide();
    });


    $(document).on('submit', '.delete-button',function(event){

        event.preventDefault()
        const itemId = $(this).data('id')
        const parentDiv = $(this).parent()

        $.ajax({
            type:'POST',
            url: `/lists/api/delete/${itemId}/`,
            data: {
                id: itemId,
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function(json){
                parentDiv.remove()
            },
            error : function(xhr,errmsg,err) {
                console.log(xhr.status); // provide a bit more info about the error to the console
        }
        });
    });
    

   
};

// console.log('list.js loaded')
