node{
  //  try{
    	stage('Check Repo'){
	       checkout scm
	}
	stage('Build Images'){ 
		    sh "docker-compose -f  " +$(pwd)+"/docker-compose.yml build'
	    }
	    stage('Check Builds'){
	           sh 'docker images'
	    }
      stage('Push Images to DOCKER-HUB'){
         docker.withRegistry('https://index.docker.io/v1/','docker-cred') {
           sh 'docker tag cruise-services_uinodejs karthik11c/cruise-site:lts'
           sh 'docker tag cruise-services_swaggernodejs karthik11c/swagger-nodejs:lts'
           sh 'docker tag cruise-services_swaggerui karthik11c/swaggerui:lts'
           sh 'docker push karthik11c/cruise-site:lts'   
	   sh 'docker push karthik11c/swagger-nodejs:lts'
           sh 'docker push karthik11c/swaggerui:lts'
	 }
      }
//	     emailext body: '${PROJECT_NAME} - Build # ${BUILD_NUMBER} - $BUILD_STATUS:Check console output at $BUILD_URL to view the results.', recipientProviders: [developers()], subject: 'Build Successful... ', to: '${EMAIL}'
//     }catch(err){
//	     emailext body: '${PROJECT_NAME} - Build # ${BUILD_NUMBER} - $BUILD_STATUS:Check console output at $BUILD_URL to view the results.', recipientProviders: [developers()], subject: 'Build Failed... ', to: '${EMAIL}'
//	   }
}
