"use strict";

document.addEventListener("DOMContentLoaded", function() {
    var status_div = document.getElementById("status");
    var back = document.getElementById("background");

    status_div.innerHTML = ""

    //var url = "http://localhost:80";
    var url = "http://185.246.155.252:80";

    fetch(url)
    .then(data => { status_div.innerHTML = "Работает"; back.classList.add("true"); })
    .catch(err => { status_div.innerHTML = "Не работает"; back.classList.add("false"); });
});
