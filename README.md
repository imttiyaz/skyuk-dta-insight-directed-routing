# skyuk-dta-insight-directed-routing

Insight Directed Routing Recommendations

This is a Node.js API to be deployed in Google App Engine standard to create an API for Insight Directed Routing Recommendations.

## Pre-Requisites
- Access to the relevant Google Cloud project(s). Note that most deployment will be done via CI/CD, but developers will still require access. The project setup is managed outside of this API development.
- Install gcloud CLI (https://cloud.google.com/sdk/install) locally on laptop.
- Run gcloud init (https://cloud.google.com/sdk/gcloud/reference/init) locally on laptop and authenticate into GCP project.
- Install NPM (https://docs.npmjs.com/cli/install) locally on laptop.
- Visual Studio Code installed locally on laptop (or other suitable IDE).

## App.yaml settings
The app.yaml consists the basic infromation of the cloud sql instance and the sensitive information in stored in Secret Manager and the respective keys are to be added in the app.yaml file

Template for app.yaml

```
runtime: nodejs14
env: standard

env_variables: 
  DATABASE_NAME: "Name of the Database"
  DATABASE_CLOUD_SQL_INSTANCE_NAME: "Name of Cloud SQL Instance"
  DATABASE_USERNAME_KEY: "Key provided in Secret Manager for Database user"
  DATABASE_PASSWORD_KEY: "Key provided in Secret Manager for Database password"
  DATABASE_PORT: Default Database port
  PROJECT_NAME: "Name of GCP project"
  PORT: "8080"
  API_PATH: "/RoutingRecommendations"
  LOG_LEVEL: "info"
  AUTH_USERNAME: "Key provided in Secret Manager for for Basic Authentiaction username"
  AUTH_PASSWORD: "Key provided in Secret Manager for for Basic Authentiaction password" 

automatic_scaling:
  min_instances: 5
```


## .env settings
The .env file has been excluded from source control to protect any sensitive details. See below for the settings required for this project.
Create a .env file in the root folder of the project and provide the below information in the file

NOTE - values in the .env should be replaced according to the project

```
DATABASE_NAME="Name of the Database"
DATABASE_CLOUD_SQL_INSTANCE_NAME="Name of Cloud SQL Instance"
DATABASE_USERNAME= "Username for the Database"
DATABASE_PASSWORD= "Password for the Database"
DATABASE_PORT= Port
PORT=8080
API_PATH="/RoutingRecommendations"
LOG_LEVEL="info"
AUTH_USERNAME="Username for the Basic Auth"
AUTH_PASSWORD="Password for the Basic Auth"
```


## Deploying the application
Note that most deployment will be done via CI/CD. However, if needed, providing that gcloud has been initialised to the right project locally the following code can be executed to deploy the API into App Engine:
```
gcloud app deploy "path to app.yaml"
```

## Coding Styles
ESLint will be used for enforcing that coding styles are consistent. The StrongLoop style will be used.
Please run the following command to install ESLint with Strongloop;
npm install --save-dev eslint eslint-config-strongloop
This does not need to be ran as the file is already included in the project, but this is how it was created.
echo '{"extends": "strongloop"}' > .eslintrc.json
Overriding the styling can be done by adding rules to .eslintrc.json
Files not part of GAE such as the CF scripts etc should be exculded from es lint validation by adding them in the .eslintignore file
It is possible to hook up ESLint to run before checkins.  
To run the and test the codebase run the following command;
npm run pretest

## Tips
Add these to the configurations section of the launch.json;
"outputCapture": "std" //this enables winston logging to show up in the Visual Studio Code debug console
"env": {"NODE_ENV":"development"} --this sets you NODE_ENV setting to development when the app is launched through Visual Studio Code 

## Unit Testing
Each new functionality should be unit tested and aded into the CI/CD pipeline.
Once deployed the API can also be checked using the URL provided in the deployment and a tool such as Postman to send the JSON request and view the response.
Unit testing will use the Vows framework. Please install Vows using 'npm install vows'.
All unit tests should go into the test folder. Each test should follow the naming convention of 'test-folder_name_of_script_testing-name_of_script_testing.js' so for example the serverconfig.js script in the config folder would have the test named test-config-serverconfig.js.
Vows would not run if there are eslint issues in the code, to skip folder and files not part of the GAE, add it to .eslintignore file
The test can be ran using the command "vows --spec test/*.js" or "npm test".

## Running the application
See the scripts section of the package.json file.
For running from the command line then to run standard start or test the commands 'npm start' or 'nmp test' can be used. To run other scripts like start_dev or start_prod the command 'npm run start:dev' will need to be used.

## Setting up Cloud SQL proxy to connect to database from local
The article on https://cloud.google.com/sql/docs/postgres/quickstart-proxy-test details on how to connect to cloud sql from local, provided that the Cloud SQL API is enabled.
- Install and authenticate gcloud command line tool
- Install the cloud sql proxy client from google on your local machine based on your OS.
- Get the instance name from https://console.cloud.google.com/sql/instances
- Start the proxy using the following command
```
./cloud_sql_proxy -instances=<INSTANCE_CONNECTION_NAME>=tcp:5433
```
After running the command it should say Ready for new connections. Note that the port for proxy should be the same as the one used in the application as Database Port

build test 123
