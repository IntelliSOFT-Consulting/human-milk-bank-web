./api/run-dev-migrations.sh
git pull origin master && sudo docker-compose up -d --build && sudo ./api/run-dev-migrations.sh
