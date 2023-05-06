const setTokenButton = document.querySelector('.send-token');
const setTokenInput = document.querySelector('.token');

setTokenButton.addEventListener('click', () => {
    const inputValue = setTokenInput.value
    if (!inputValue) {
        alert("Введите токен")
    } else {
        alert("Токен успешно записан")
    }
})