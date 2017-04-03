var randomButtonElement = document.getElementById('randomize');
var randomUserElement = document.getElementById('user');
var errorElement = document.getElementById('error');

function makeGetRequest(url) {

    return new Promise(function(resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                var error = new Error('Ошибка ' + xhr.status);
                error.code = xhr.statusText;
                reject(error);
            } else {
                resolve(xhr.responseText);
            }

        };

        xhr.send();
    });

}

function loadImage(user) {
    return new Promise(function(resolve, reject) {
        var img = new Image();

        img.onload = function () {
            resolve(user);
        };

        img.onerror = function () {
            reject(new Error('Что-то пошло не так'));
        };

        img.src = user.avatar_url;
    });
}

randomButtonElement.onclick = function () {
    makeGetRequest('https://api.github.com/users')
        .then(request => JSON.parse(request))
        .then(data => data[Math.floor(Math.random() * data.length)])
        .then(user => loadImage(user))
        .then(function (user) {
            hideError();
            drawUser(user);
        })
        .catch(function (error) {
            showError(error);
            console.log(error);
        });
};



function showError(err) {
    errorElement.textContent = err;
    errorElement.classList.remove('hidden');
    randomUserElement.classList.add('hidden');
}

function hideError() {
    errorElement.classList.add('hidden');
    randomUserElement.classList.remove('hidden');
}


function drawUser(data) {
    var img = randomUserElement.querySelector('img');
    var link = randomUserElement.querySelector('a');
    img.src = data.avatar_url;
    img.alt = data.login;
    link.href = data.html_url;
    link.textContent = data.login;
}
