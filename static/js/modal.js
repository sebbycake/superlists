// modal 
const modal = document.querySelector('.modal');
const close = document.querySelector('#modal-close');

// display modal after 3s
setTimeout(function() {
    modal.classList.add('modal-active')
}, 2000)

// close modal upon clicking x
close.addEventListener('click', () => {
    modal.classList.add('modal-inactive');
})