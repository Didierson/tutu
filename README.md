# TUTÛ 🗺️
This project is a partial fulfillment of the requirements for the Holy Angel University degree B.S in Information Technology with Area of Specialization in Web Development.

## Summary
TUTÛ is an interactive map of articles from news portals in the Philippines. It aggregates articles in a list of news portals and extracts information in each articles through Natural Language Processing. TUTÛ also features a news portal analyzer which scores the credibility of a news portal and its content using a trained machine-learning model. You can learn more about it [here](https://www.esquiremag.ph/culture/cars-and-tech/tutunews-com-identifies-credible-and-fake-news-sites-a00225-20180131) and you can ask questions [here](https://www.facebook.com/tutunewsph).

## TUTÛ means “true” or “truth” in Kapampangan language.


## Notable Features
- - -
### Credible News Map
![Credible News Map gif](./gifs/cred-map.gif)

### Not Credible News Map
![Not Credible Map gif](./gifs/not-cred-map.gif)

### Recommended Credible Articles
![Recommended Credible Articles](./gifs/rec-cred-art.png)
![Recommended Credible Articles 2](./gifs/rec-cred-art2.png)

### Popular and Recent News
![Popular and Recent News gif](./gifs/pop-rec-news.gif)

### Visualized Data
![Visualized Data gif](./gifs/vis.gif)

### Detector
![Detector gif](./gifs/detector.gif)


## Requirements
- - -
* [Python v3.6+](https://www.python.org/downloads/)
* [Node.js v9.2+](https://nodejs.org/en/download/current/)

  ### NPM Global Packages
  * [yarn](https://www.npmjs.com/package/yarn)
  * [create-react-app](https://www.npmjs.com/package/create-react-app)


## User Client Installation
- - -
```sh
cd app/client/

yarn install
yarn start
```
The default port is 3000

## Admin Client Installation
- - -
```sh
cd app/admin/

yarn install
yarn start
```
The default port is 3001

## Server Installation
- - -
```sh
cd server/

yarn install
yarn start
```
The default port is 5000

## Spider Installation
- - -
```sh
cd spider/

pip install pipenv
pipenv install

pipenv run python spider.py
```
It will scrape the sources after running



# Project Structure
- - -
```
tutu
├── README.md
├── .eslintrc
├── .gitignore
├── app
│   ├── admin
│   │   └── package.json
│   └── client
│       └── package.json
├── server
│   └── package.json
└── spider
    └── spider.py
    └── Pipfile.lock
    └── Pipfile
```
