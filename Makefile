start:: wasm ; npm run start

lint:: ; npm run lint

format:: ; npm run format

test:: wasm ; npm run test

build:: wasm ; npm run build

wasm:: ; cd faust && make

startbuild:: ; npm run start:build
