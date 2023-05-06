const fs = require('fs');

const setTokenButton = document.querySelector('.send-token');
const setTokenInput = document.querySelector('.token');

const database = JSON.parse(fs.readFileSync('../database.json', 'utf-8'))

setTokenButton.addEventListener('click', () => {
    const inputValue = setTokenInput.value;
    if (!inputValue) {
        alert("Введите токен")
    } else {
        database.access_token = inputValue;
        fs.writeFileSync('../database.json', database)
    }
});