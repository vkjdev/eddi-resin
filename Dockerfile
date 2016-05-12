FROM resin/%%RESIN_MACHINE_NAME%%-node

WORKDIR /usr/src/app

COPY package.json ./package.json
RUN npm install

COPY . /usr/src/app
CMD [ "npm", "start" ]