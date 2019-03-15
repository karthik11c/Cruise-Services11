node {
        stage('Clone Repo'){
           checkout scm
        }
        stage('Build Cruise-Site Image') {
          sh 'docker build -t cruise_site $(pwd)/Cruise-Site'
        }
        stage('Run Docker Image') {
             docker.withRegistry('https://registry.hub.docker.com', 'docker-cred') {
               docker tag cruise_site karthik11c/cruise-site:lts
               docker push karthik11c/cruise-site:lts
             }
        }
}
