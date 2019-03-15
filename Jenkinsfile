node {
        stage('Clone Repo'){
           checkout scm
        }
        stage('Build Cruise-Site Image') {
          sh 'docker build -t cruise_site $(pwd)/Cruise-Site'
        }
        stage('Run Docker Image') {
             docker.withRegistry('docker.io/v2/', 'docker-cred') {
               sh 'docker tag cruise_site karthik11c/cruise-site:lts'
               sh 'docker push karthik11c/cruise-site:lts'
             }
        }
}
