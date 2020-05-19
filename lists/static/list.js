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
};

// console.log('list.js loaded')
