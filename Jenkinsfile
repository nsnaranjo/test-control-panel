pipeline {
    agent { label 'spad-control-panel' } // Define the Jenkins agent label for running this pipeline

    tools {
        nodejs 'nodejs'
    }

    environment { // Set up environment variables
        DOCKER_COMPOSE_FILE = 'docker-compose.yml' // Docker Compose file for deployment
        GCP_PROJECT_ID = 'score-416214' // Google Cloud Project ID
        GCP_REGISTRY = 'us-central1-docker.pkg.dev' // Google Cloud Registry URL
        GCP_REPOSITORY = 'spad-platform' // Google Cloud Repository name
        GIT_URL = 'https://innerconsulting.mytuleap.com/plugins/git/spad-landing/SPAD1.0-FRONTEND-CONTROL-PANEL.git'
        TULEAP_REPOSITORY_ID = '131' // Tuleap repository ID for status notifications
        TULEAP_CREDENTIAL_ID = 'tuleap-key' // Credential ID for Tuleap authentication
        SLACK_CHANNEL = 'spad-cicd' // Slack channel for notifications
        MAIN_BRANCH = 'main' // Main branch name for conditional steps
        BRANCH_PATTERNS = /(main|hotfix\/.*|release\/.*)/ // Branch patterns for triggering certain stages
        SONARQUBE_ENV = 'sonarqube' // SonarQube environment variable
        SONARQUBE_URL = 'https://sonarqube.spad2.com.co' // SonarQube server URL
        SONARQUBE_TOKEN = credentials('sonarqube-token') // SonarQube authentication token
        PROJECT_KEY = "spad1-frontend-control-panel"
        TULEAP_TOKEN = 'tuleap-token'
    }

    stages {
        stage("Verify Tooling") { // Stage to verify that required tools are installed
            steps {
                defineGlobalVariables() // Define directories and icons
                verifyTooling() // Custom function to verify Docker and gcloud
            }
        }

        stage('Checkout SCM') { // Stage to check out source code from the repository
            steps {
                checkoutSourceCode() // Custom function to check out code
            }
        }

        stage('SonarQube Analysis') { // Stage to run SonarQube analysis
            steps {
                runSonarQubeAnalysis() // Custom function to run SonarQube analysis
            }
        }

        stage('SonarQube Quality Gate') { // Stage to check SonarQube Quality Gate status
            steps {
                script {
                    def qgResult = waitForQualityGate()
                    if (qgResult.status != 'OK') {
                        error "Pipeline aborted due to quality gate failure: ${qgResult.status}"
                    }
                }
            }
        }

        stage('Build Docker Images') { // Stage to build Docker images
            steps {
                buildDockerImages() // Custom function to build Docker images
            }
        }

        stage('Push Docker Images') { // Stage to push Docker images to the registry
            when {
                expression { env.BRANCH_NAME == env.MAIN_BRANCH }
            }
            steps {
                pushDockerImages() // Custom function to push Docker images
            }
        }

        stage('Deploy') { // Stage to deploy services using Docker Compose
            when {
                expression { env.BRANCH_NAME == env.MAIN_BRANCH } // Only for the main branch
            }
            steps {
                deployServices() // Custom function to deploy services
            }
        }
    }

    post { // Post-build actions for notifications and Tuleap status updates
        success { // If build is successful, notify on Slack
            script { notifySlack('success') }
        }
        failure { // If build fails, notify on Slack
            script { notifySlack('failure') }
        }
        always { // Always update Tuleap commit status
            script {
                tuleapNotifyCommitStatus(
                    status: currentBuild.currentResult.toLowerCase(),
                    repositoryId: env.TULEAP_REPOSITORY_ID,
                    credentialId: env.TULEAP_CREDENTIAL_ID
                )
            }
        }
    }
}

def defineGlobalVariables() { // Define global variables for icons
    ICONS = [ // Define icons for Slack notifications
        SUCCESS: ':white_check_mark:',  // ✅
        FAILURE: ':x:',                 // ❌
        AUTHOR: ':bust_in_silhouette:', // 👤
        COMMIT: ':page_with_curl:',     // 📄
        START_TIME: ':clock1:',         // 🕐
        END_TIME: ':clock5:',           // 🕔
        DURATION: ':hourglass_flowing_sand:', // ⏳
        SONARQUBE_LINK: ':link:'        // 🔗
    ]
}

def verifyTooling() { // Function to verify necessary tools
    sh '''
        docker version
        docker info
        gcloud --version
        npm --version
    '''
}

def checkoutSourceCode() { // Function to check out source code from Git
    tuleapNotifyCommitStatus status: 'pending', repositoryId: env.TULEAP_REPOSITORY_ID, credentialId: env.TULEAP_CREDENTIAL_ID
    checkout([
        $class: 'GitSCM',
        branches: [[name: "*/${env.BRANCH_NAME}"]],
        doGenerateSubmoduleConfigurations: false,
        extensions: [],
        userRemoteConfigs: [[
            url: env.GIT_URL,
            credentialsId: env.TULEAP_CREDENTIAL_ID
        ]]
    ])
}

def runSonarQubeAnalysis() { // Function to run SonarQube analysis on a Node.js project
    withSonarQubeEnv(env.SONARQUBE_ENV) {
        def scannerHome = tool 'SonarQube Scanner'

        sh """
            ${scannerHome}/bin/sonar-scanner \
            -Dsonar.projectKey=${env.PROJECT_KEY} \
            -Dsonar.projectName=${env.PROJECT_KEY} \
            -Dsonar.branch.name=${env.BRANCH_NAME}
        """
    }
}

def buildDockerImages() { // Function to build Docker images
    echo "Building image for ${env.PROJECT_KEY}"
    sh "docker build -t ${env.GCP_REGISTRY}/${env.GCP_PROJECT_ID}/${env.GCP_REPOSITORY}/${env.PROJECT_KEY}:latest ."
}

def pushDockerImages() { // Function to push Docker images
    sh "gcloud auth configure-docker ${env.GCP_REGISTRY}"
    echo "Pushing image for ${env.PROJECT_KEY}"
    sh "docker push ${env.GCP_REGISTRY}/${env.GCP_PROJECT_ID}/${env.GCP_REPOSITORY}/${env.PROJECT_KEY}:latest"
}

def deployServices() { // Function to deploy services using Docker Compose
    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d"
}


def notifySlack(status) { // Function to send notifications to Slack
    def commitAuthor = sh(returnStdout: true, script: 'git --no-pager show -s --format=\'%an\'').trim()
    def commitMessage = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
    def startTime = new Date(currentBuild.startTimeInMillis)
    def endTime = new Date()
    def durationStr = calculateDuration(endTime.time - startTime.time)

    def sonarResults = generateSonarResults()
    def sonarMessage = sonarResults ? "\n${ICONS.SONARQUBE_LINK} *SonarQube Analysis Results*:\n${sonarResults.join('\n')}" :  "\n${ICONS.SONARQUBE_LINK} *SonarQube Analysis Results*:\nNo changes detected"

    if (env.BRANCH_NAME ==~ env.BRANCH_PATTERNS) {
        def message = "${ICONS[status.toUpperCase()]} *Pipeline ${status.capitalize()}* : ${env.BRANCH_NAME} - ${env.JOB_NAME} #${env.BUILD_NUMBER}\n" +
                      "${ICONS.AUTHOR} *Author*: ${commitAuthor}\n" +
                      "${ICONS.COMMIT} *Commit*: ${commitMessage}\n" +
                      "${ICONS.START_TIME} *Start Time*: ${startTime}\n" +
                      "${ICONS.END_TIME} *End Time*: ${endTime}\n" +
                      "${ICONS.DURATION} *Duration*: ${durationStr}\n" +
                      "<${env.BUILD_URL}|View Details>\n" +
                      "${sonarMessage}"

        if (env.BRANCH_NAME == env.MAIN_BRANCH) {
            def pullRequestId = getLatestPullRequestId()
            def approver = getMergeApprover(pullRequestId)
            message += "\n${ICONS.AUTHOR} *Approver*: ${approver}"
        }

        slackSend channel: env.SLACK_CHANNEL, message: message
    }
}

// This method calculates the duration in the most suitable unit (seconds, minutes, hours, or days) and returns it as a formatted string.
def calculateDuration(durationMillis) {
    def durationStr = durationMillis < 60000 ? String.format("%.2f seconds", durationMillis / 1000.0) :
                      durationMillis < 3600000 ? String.format("%.2f minutes", durationMillis / 60000.0) :
                      durationMillis < 86400000 ? String.format("%.2f hours", durationMillis / 3600000.0) :
                      String.format("%.2f days", durationMillis / 86400000.0)
    return durationStr
}

def generateSonarResults() { // Function to get SonarQube results
    def qualityGate = waitForQualityGate()
    def sonarResults = []

    if (qualityGate.status == 'OK') {
        def resultStatus = ICONS.SUCCESS
        def sonarUrl = "${env.SONARQUBE_URL}/dashboard?id=${env.PROJECT_KEY}&branch=${env.BRANCH_NAME}"
        sonarResults.add(">• <${sonarUrl}|${env.PROJECT_KEY} (${env.BRANCH_NAME})> ${resultStatus}")
    } else {
        def resultStatus = ICONS.FAILURE
        def sonarUrl = "${env.SONARQUBE_URL}/dashboard?id=${env.PROJECT_KEY}&branch=${env.BRANCH_NAME}"
        sonarResults.add(">• <${sonarUrl}|${env.PROJECT_KEY} (${env.BRANCH_NAME})> ${resultStatus}")
    }
    return sonarResults
}

def getLatestPullRequestId() {
    def apiUrl = "https://innerconsulting.mytuleap.com/api/git/${env.TULEAP_REPOSITORY_ID}/pull_requests"
    def queryParams = '{"status": "closed", "target_branches": [{"name": "main"}]}'

    withCredentials([string(credentialsId: env.TULEAP_TOKEN, variable: 'TULEAP_TOKEN')]) {
        try {
            def response = httpRequest(
                url: "${apiUrl}?order=desc&limit=1&query=" + URLEncoder.encode(queryParams, "UTF-8"),
                httpMode: 'GET',
                customHeaders: [[name: 'X-Auth-AccessKey', value: env.TULEAP_TOKEN]],
                validResponseCodes: '200'
            )

            def jsonResponse = new groovy.json.JsonSlurper().parseText(response.content)
            echo "Full JSON Response for PR List: ${response.content}"

            def pullRequestId = jsonResponse?.collection[0]?.id?.toString()
            if (!pullRequestId) {
                echo "No Pull Request ID found in response."
                return "Unknown"
            }
            echo "Pull Request ID: ${pullRequestId}"

            return pullRequestId

        } catch (Exception e) {
            echo "Error retrieving pull request ID: ${e}"
            return "Unknown"
        }
    }
}

def getMergeApprover(pullRequestId) {
    def apiUrl = "https://innerconsulting.mytuleap.com/api/pull_requests/${pullRequestId}"

    withCredentials([string(credentialsId: env.TULEAP_TOKEN, variable: 'TULEAP_TOKEN')]) {
        try {
            def approverResponse = httpRequest(
                url: apiUrl,
                httpMode: 'GET',
                customHeaders: [[name: 'X-Auth-AccessKey', value: env.TULEAP_TOKEN]],
                validResponseCodes: '200'
            )

            def jsonRespons = new groovy.json.JsonSlurper().parseText(approverResponse.content)

            def displayName = jsonRespons?.status_info?.status_updater?.display_name

            echo "Display Name: ${displayName}"

            return displayName

        } catch (Exception e) {
            echo "Error retrieving pull request details: ${e}"
            return "Unknown"
        }
    }
}

