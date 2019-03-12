#!/usr/bin/env bash

# 1.Jenkins Container

 docker run -p 1000:8080 -v //var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/lib/jenkins -d getintodevops/jenkins-withdocker:lts

# 2.Cruise-Site

docker build -t cruise_site ./Cruise-Site
docker run -p 2000:10010 --name cruise-site -v $(pwd)/Cruise-Site:/appDir -d cruise_site 

# 3.SwaggerUI

docker run -p 5000:80 --name swagger-ui -v $(pwd)/Swagger/swagger-ui:/usr/share/nginx/html -d nginx

# 4.Swagger-Nodejs

docker build -t swagger_node ./Swagger/swagger-nodejs
docker run -p 3000:10010 --name swagger-nodejs -v $(pwd)/Swagger/swagger-nodejs -d swagger_node

# 5.CloudantDB

docker run -p 8000:80 -v cloudant-data:/srv --name ibm-db ibmcom/cloudant-developer:latest


## environment variables and docker links is remaining.. ##
## we can use shell script only for final deployment it is not suitable for developement so we are using docker-compose.yml file for developement.

