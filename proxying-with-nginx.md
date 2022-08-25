### To proxy all connections via nginx.

Ensure you have:
1. A domain name
2. nginx installed



Add the following configuration with in the `/etc/nginx/sites-available/{**your domain name**}` 

```
server {

        server_name {**your domain name**};

        location / {
            proxy_pass http://127.0.0.1:8080;
            
        }

        location /api/ {
            proxy_pass http://127.0.0.1:8081/;
        }
        location /ui/ {
            proxy_pass http://127.0.0.1:8082/;
        }
}

```

Create a symbolic link to the `/etc/nginx/sites-enabled/`
`sudo ln -s /etc/nginx/sites-available/{**your domain name**} /etc/nginx/sites-enabled/`

Restart nginx.
`sudo service nginx restart`

* Feel free to add a SSL certificate with Let's Encrypt.

You are good to go.