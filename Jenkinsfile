node{
     try{

	stage('Check Repo'){
	           checkout scm
	}
	stage('Build Images'){
      sh 'docker build -t cruise-site $(pwd)/Cruise-Site'
	}
	stage('Check Builds'){
	           sh 'docker images'
	}
	emailext body: '${PROJECT_NAME} - Build # ${BUILD_NUMBER} - $BUILD_STATUS:Check console output at $BUILD_URL to view the results.', recipientProviders: [developers()], subject: 'Build Failed... ', to: '${EMAIL}'
     }catch(err){
	     emailext body: '${PROJECT_NAME} - Build # ${BUILD_NUMBER} - $BUILD_STATUS:Check console output at $BUILD_URL to view the results.', recipientProviders: [developers()], subject: 'Build Failed... ', to: '${EMAIL}'
	    }
}
