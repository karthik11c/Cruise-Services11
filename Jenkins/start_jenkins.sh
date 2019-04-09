docker run -p 1000:8080 --name jenkins -v //var/run/docker.sock:/var/run/docker.sock -v jenkins-data:/var/jenkins_home -v jenkins-conf:/var/lib/jenkins -d jenkinswithdocker/jenkins-with-docker:lts
