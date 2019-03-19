#!/bin/sh
     echo "backup script is not running(loading data to container...)"
     cd /srv
     tar -xvf cloudant.tar
     rm cloudant.tar
     exit
