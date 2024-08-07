## Zither Web App

[![Built with open-wc recommendations](https://img.shields.io/badge/built%20with-open--wc-blue.svg)](https://github.com/open-wc)

Zither is a stringed instrument for any device with a touchscreen and a web browser.

The web app is built according to the recommendations of open-wc.org.

The audio is built with https://faust.grame.fr

The current build is available at https://zither.elf.org

There will eventually be documentation at https://elf.org/zither/

### Recreating the project

The following commands will fetch the current source, 
install dependencies, build resources, launch a development server,
and open the app in a browser page.
```
git clone https://github.com/recri/zither-pwa.git
cd zither-pwa
npm install
make wasm
make start 
```
If you need to install ```npm``` best to visit nodejs.org and follow
their instructions for installing ```nodejs``` and ```npm```, because
the linux repo versions will be stale in comparison.


