FROM node:latest

# set working directory
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:${PATH}

ENV DB_HOST shopping_cart-db
ENV DB_NAME carts

ENV COUCHDB_ADMIN_USER admin
ENV COUCHDB_ADMIN_PASS admin
ENV DB_URL http://${COUCHDB_ADMIN_USER}:${COUCHDB_ADMIN_PASS}@${DB_HOST}:5984/${DB_NAME}

ENV DEBUG users-d

ADD package.json .
RUN npm install

#
ADD gulpfile.js .
ADD scripts scripts
ADD src src

CMD ./scripts/run.sh
