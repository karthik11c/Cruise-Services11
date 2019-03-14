# Cruise-Services11
#### Developement Mode(docker-compose) ####
 Run following steps:
   1) run this command from root of this repo.
      - $ docker-compose up
   2) To load database frm tar file run following commands
      - a) $ docker ps                                                  [check container id for ibmcom/cloudant-developers and copy it]
      - b) $ docker cp cloudant.tar db_con_id:/srv/                     [paste container id in place of db_con_id]      
      - c) $ docker exec -ti db_con_id sh                               [paste container id in place of db_con_id]
      - d) # cd /src
      - e) # tar xvf cloudant.tar
      - f) # rm cloudant.tar
   3) docker-compose restart
   4) Open browser and goto following url for Cruise-Site UI
      - http://localhost:2000
      - You need to register first and then login..
   5) For database dashboard -
      - http://localhost:3000/dashboard.html
      - you can log into dashboard by username - admin and password - pass
   6) For SwaggerUI -
      - http://localhost:5000/swagger-ui
#### Developement Mode(dockerShell.sh) ####
  -  Run following command :
     - $ sh dockerShell.sh
  - Run above step 2) from docker-compose section for database load ..
     - repeat the same procedure from step 3) to 6)...
