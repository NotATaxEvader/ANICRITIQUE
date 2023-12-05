var page = 0;

function goHome () {
    res.redirect('/home')
}

function goAccount () {
    res.redirect('/login')
}

function loggedIn (username, password) {
    if (username === true && password === true){
        location.href = "/MCO1/account.html"
    }
}

function redirectAnime (event, aniName) {
    res.render('anime')
}

function writeReview () {
        window.location.href = '/anime/review';
}