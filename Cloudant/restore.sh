#!/bin/bash
docker cp cloudant.tar ibm-db:/srv/
docker exec -ti ibm-db //bin/bash
