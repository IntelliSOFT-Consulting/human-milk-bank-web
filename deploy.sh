cd /opt/human-milk-bank-web
git pull origin master && sudo docker-compose up -d --build && sudo ./api/run-dev-migrations.sh