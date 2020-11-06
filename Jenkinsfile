pipeline {
  agent {
    node {
      label 'node_label'
    }

  }
  stages {
    stage('run deploy script') {
      steps {
        sh 'sh deploy.sh'
      }
    }

  }
}