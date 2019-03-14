#!/usr/bin/env bash

# 1.Jenkins Container
# this container doesn't have any links..

 docker run -p 1000:8080 --name jenkins -v //var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/lib/jenkins -d getintodevops/jenkins-withdocker:lts
 docker logs jenkins
 # 2.CloudantDB

 docker run -p 3000:80 -v cloudant-data:/srv --name ibm-db -d ibmcom/cloudant-developer:latest
 docker logs ibm-db
 docker cp cloudant.tar ibm-db:/srv/
 docker exec -ti ibm-db /bin/sh
 cd /srv
 tar -xvf cloudant.tar
 rm cloudant.tar
 docker container restart ibm-db

# 3.Cruise-Site

 docker build -t cruise_site ./Cruise-Site
 docker run -p 2000:10010 --name cruise-site -e DB_HOST='ibm-db' -e DB_PORT=80 -e DB_USER='admin' -e DB_PASS='pass' --link ibm-db:ibm-db -v $(pwd)/Cruise-Site:/appDir/src -d cruise_site

# 4.Swagger-Nodejs

 docker build -t swagger_node ./Swagger/swagger-nodejs
 docker run -p 8000:10010 --name swagger-nodejs --link ibm-db:ibm-db -v $(pwd)/Swagger/swagger-nodejs:/appDir/src -d swagger_node

# 5.SwaggerUI

 docker run -p 5000:80 --name swagger-ui --link swagger-nodejs:swagger-nodejs -v $(pwd)/Swagger/swagger-ui:/usr/share/nginx/html/swagger-ui -d nginx

# Load databases from cloudant.tar
