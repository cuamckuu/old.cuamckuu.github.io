#!/usr/bin/env python3

import sys
import requests
from bs4 import BeautifulSoup
import json

def apiRequest(payload):
    base_url = "https://ru.wikipedia.org/w/api.php"

    r = requests.get(base_url, params=payload)

    if r.status_code != 200:
        return -1

    data = json.loads(r.text)
    return data

base_url = "https://ru.wikipedia.org"
extra_url = "/wiki/Категория:Картины_по_алфавиту"

allPages = []

while True:
    try:
        r = requests.get(base_url + extra_url)

        if r.status_code != requests.codes.ok:
            print("Bad status: ", r.status_code)
            break

        html = r.text
        soup = BeautifulSoup(html, "html.parser")

        pageLinks = soup.select(".mw-category-group > ul > li > a")

        print(len(allPages))
        titles = list(map(lambda x: x["title"], pageLinks))
        allPages += titles

        navLinks = soup.select("#mw-pages > a")
        if navLinks[1].text != "Следующая страница":
            break

        extra_url = navLinks[1]["href"]

    except KeyboardInterrupt:
        break

payload = {
            "action": "query",
            "format": "json",
            "prop": "extracts",
            "utf8": "1",
            "titles": allPages[0]
          }
data = apiRequest(payload)
print(data)

with open("pages.json", "w") as file:
    file.write("raw_json_data = `")
    json_data = json.dumps(allPages, ensure_ascii=False)
    file.write(json_data)
    file.write("`")
