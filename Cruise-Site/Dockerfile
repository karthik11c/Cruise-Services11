from node:lts-slim
workdir appDir
copy package.json .
copy ./config/.env .
run npm install
expose 10010
cmd npm start
