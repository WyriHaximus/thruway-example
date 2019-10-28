all: serv

webpack:
	npm run dev

webpack-production:
	npm run prod

serv:
	php app.php
