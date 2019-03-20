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
     }catch(err){

	    }
}
