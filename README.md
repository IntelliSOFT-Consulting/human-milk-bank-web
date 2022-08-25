### Human Milk Bank

This is a web application created to
1. Support the [Android reference application](https://github.com/IntelliSOFT-Consulting/human-milk-bank) for the WHO NNDAK to support linking Newborn Units and Human Milk Banks.
2. Support Administration Functionality of the same application.


### Application Architecture

Refer to the application architecture overview:
[Application Architecture](https://github.com/IntelliSOFT-Consulting/human-milk-bank-web/blob/master/Architecture.md)

### Installation

##### Pre-requisites

- Git
- Docker
- Docker Compose

#### Development Mode

Clone project.

`git clone https://github.com/IntelliSOFT-Consulting/human-milk-bank-web`

To run the project in development mode.

`yarn dev`

### Deploying to a production environment.

To run a production build

##### Prequisites
- Git
- Docker
- Docker Compose


#### Using Docker

You are able to use Docker to build and deploy all the images for the entire project or for the respective repos.

#### Build entire project

NOTE: Ensure you provide a `.env` file for both the `api` and `ui` components based on their respective `.env.example` files provided.

`docker-compose up -d --build`

This should bring up the following applications in your server.
By default, 

1. Admin Web UI - port 8082
2. Web API - port 8081
3. HAPI FHIR server - port 8080

#### Applying Database Migrations

Lastly, ensure to deploy the migrations to the database by running the following command:

`./api/run-dev-migrations.sh`

#### Build the UI only

`docker build -t ./ui` or `yarn docker:build:ui`

#### Build the API only

`docker build -t ./api` or `yarn docker:build:api`

### Quick Installation

Simply run the `deploy.sh` script provided.

```
chmod +x deploy.sh
./deploy.sh
```


### Adding a custom domain and proxying with nginx.

Refer to instruction on how to proxy connections with nginx below:
[Instructions](https://github.com/IntelliSOFT-Consulting/human-milk-bank-web/blob/master/proxying-with-nginx.md)
