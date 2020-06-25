// modal 
const modal = document.querySelector('.modal');
const close = document.querySelector('#modal-close');

// display modal after 2s
setTimeout(function() {
    modal.classList.add('modal-active')
}, 2000)

// close modal upon clicking x
close.addEventListener('click', () => {
    modal.classList.toggle('modal-active');
})

// ---------------------

// handling get started button to show input list form
const getStartedBtn = document.querySelector('.get-started-btn');
const landingInputForm = document.querySelector('.landing-input-form');

getStartedBtn.addEventListener('click', () => {
    getStartedBtn.classList.toggle('get-started-btn-toggle');
    landingInputForm.style.display = 'flex';
})