node {
        stage('Build Cruise-Site Image') {
          sh 'docker build -t cruise_site $(pwd)/Cruise-Site'
        }
        stage('Run Docker Image') {
          sh 'docker images'
        }
}
