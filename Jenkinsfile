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
	stage('Push Image'){
		docker.withRegistry('https://index.docker.io/v1/','docker-cred') {
		   sh 'docker tag cruise-site karthik11c/cruise-site:lts'
		   sh 'docker push karthik11c/cruise-site:lts'
	   }
	}
       }catch(err){
                  emailext body: 'This is Jenkins Build', recipientProviders: [developers()], subject: 'Build Failed... ', to: env.EMAIL-ADDR
	    }finally{
       emailext body: 'This is Jenkins Build', recipientProviders: [developers()], subject: 'Build Successful... ', to: env.EMAIL-ADDR
      }
}
