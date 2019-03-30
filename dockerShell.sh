#!/usr/bin/env bash

# 1.Jenkins Container
# this container doesn't have any links..

 docker run -p 1000:8080 --name jenkins -v //var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/lib/jenkins -v jenkins-conf:/var/lib/jenkins -d jenkinswithdocker/jenkins-with-docker:lts
 # 2.CloudantDB

 docker build -t ibmbuild ./Cloudant
 docker run -p 3000:80 -v cloudant-data:/srv --name ibm-db -d ibmbuild
 # Load databases from cloudant.tar
 docker cp ./Cloudant/cloudant.tar ibm-db:/srv/
 docker exec -ti ibm-db //bin/bash

# 3.Cruise-Site

 docker build -t cruise_site ./Cruise-Site
 docker run -p 2000:10010 --name cruise-site -e DB_HOST='ibm-db' -e DB_PORT=80 -e DB_USER='admin' -e DB_PASS='pass' --link ibm-db:ibm-db -v $(pwd)/Cruise-Site:/appDir/src -d cruise_site

# 4.Swagger-Nodejs

 docker build -t swagger_node ./Swagger/swagger-nodejs
 docker run -p 8000:10010 --name swagger-nodejs --link ibm-db:ibm-db -v $(pwd)/Swagger/swagger-nodejs:/appDir/src -d swagger_node

# 5.SwaggerUI

 docker run -p 5000:80 --name swagger-ui --link swagger-nodejs:swagger-nodejs -v $(pwd)/Swagger/swagger-ui:/usr/share/nginx/html/swagger-ui -d nginx
