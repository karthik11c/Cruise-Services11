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
	
	     stage('send email'){
		emailext body: 'This is Jenkins Build', recipientProviders: [developers()], subject: 'Build Success... ', to: '${EMAIL}'
	     }
       }catch(err){

	    }
}
