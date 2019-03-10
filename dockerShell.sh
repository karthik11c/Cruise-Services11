#!/usr/bin/env bash
# cd /home/user/docker_backup
# remove /home/user/docker_backup/data
# rm -rf data
# Switch to root privileges. my system is set to only run Docker as root
# su
# Copy a folder from Docker container to host OS
echo "hello World..."
docker cp <container-name>:/home/user/data /home/user/docker_backup
# More general user commands
