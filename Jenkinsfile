node{
     try{

	stage('Check Repo'){
	           checkout scm
	}
	stage('Build Images'){
		   sh 'docker-compose build'
	}
	stage('Check Builds'){
	           sh 'docker images'
	}
	stage('Push Image'){
		docker.withRegistry('https://index.docker.io/v1/','docker-cred') {
		   sh 'docker tag front-end karthik11c/front-end:lts'
		   sh 'docker push karthik11c/front-end:lts'
	   }
	}
       }catch(err){
	     emailext body: 'Build Failed \n Found Exception : ' + {err}, recipientProviders: [developers()], subject: 'Build Failure Notification', to: 'karthik11yemul@gmail.com,ganeshtatipamul27@gmail.com,amitsilam25@gmail.com,shravaniboddul041@gmail.com,ishwariparanjape@gmail.com'
	}
}
