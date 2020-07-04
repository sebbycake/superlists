// display (error) message
const displayMessage = (className, message = null, inputSelector = null) => {

    // fill class selector with custom error message
    if (message !== null) {
        $(`.${className}`).html(message);
    }

    // show error msg
    $(`.${className}`).css('display', 'block');

    // hide error msg upon keypress or keydown events
    if (inputSelector !== null) {
        $(inputSelector).on('keypress keydown', () => {
            $(`.${className}`).hide();
        })
    } // end of if

}


// generate csrf token for Django form requests
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

// Slugify a string
const slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    let from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    let to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '')
        // Collapse whitespace and replace by -
        .replace(/\s+/g, '-')
        // Collapse dashes
        .replace(/-+/g, '-');

    return str;
}

// The debounce function delays the processing of the keyup event until 
// the user has stopped typing for a predetermined amount of time
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Converts URLs in text into clickable links
const urlize = (text) => {

    // checks whether the link starts from http, https, ftp, file
    const regExp1 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    let text1 = text.replace(regExp1, "<a href='$1'>$1</a>");

    // checks whether the link starts from www
    const regExp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    let text2 = text1.replace(regExp2, '$1<a target="_blank" href="http://$2">$2</a>');
    
    return text2
}