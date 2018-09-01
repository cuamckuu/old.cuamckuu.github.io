"use strict";

const objToParams = function (obj) {
    const params = Object.keys(obj)
                         .map((key) => {
                                return `${key}=${encodeURIComponent(obj[key])}`;
                          })
                         .join("&");
    return params;
};

const callWikiApi = function (payload, callback) {
    const base_url = "https://ru.wikipedia.org/w/api.php"
    const extra_url = "?" + objToParams(payload);

    let r = fetch(base_url + extra_url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                callback(data);
            });
};

const getNewPicture = function () {
    // Clear previous picture
    document.getElementById("image").src = "";

    const data = JSON.parse(raw_json_data);
    const pageIndex = Math.floor(Math.random() * data.length);

    document.getElementById("title").innerHTML = data[pageIndex];

    const payload1 = {
                    "action": "query",
                    "format": "json",
                    "prop": "pageimages",
                    "utf8": "1",
                    "titles": data[pageIndex],
                    "origin": "*"
                    }

    callWikiApi(payload1, (data) => {
        const pages = data["query"]["pages"];
        let image = document.getElementById("image");
		const key = Object.keys(pages)[0];

        const thumbnail = pages[key]["thumbnail"];
        const width = thumbnail["width"] + "px";

        let newSize = "500px";
        if (+thumbnail["height"] > +thumbnail["width"]) {
            newSize = "300px";
        }

        let source = thumbnail["source"];
        source = source.replace(width, newSize);
        image.src = source;
    });

    const payload2 = {
                    "action": "query",
                    "format": "json",
                    "prop": "extracts",
                    "utf8": "1",
                    "titles": data[pageIndex],
                    "origin": "*",
                    "exlimit": "max"
                    }

    callWikiApi(payload2, (data) => {
		const pages = data["query"]["pages"];
		let description = document.getElementById("description");
		const key = Object.keys(pages)[0];
        description.innerHTML = pages[key]["extract"];
    });
};

document.addEventListener("DOMContentLoaded", function (e) {
    getNewPicture();

    document.getElementById("button").addEventListener("click", () => {
        document.body.style.opacity = 0;
     	setTimeout(() => { getNewPicture(); }, 1000);
     	setTimeout(() => { document.body.style.opacity = 1; }, 1000);
   });
});
