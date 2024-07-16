## Zither Web App

[![Built with open-wc recommendations](https://img.shields.io/badge/built%20with-open--wc-blue.svg)](https://github.com/open-wc)

Zither is a stringed instrument that runs in a web page.

The web app is built according to the recommendations of open-wc.org.

The audio is built with https://faust.grame.fr/.

### Recreating the project
```
git clone https://github.com/recri/zither-pwa.git
cd zither-pwa
git checkout main3
npm install
cd faust
make
cd ..
make start
```
