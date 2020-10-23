all : help

help:
	@echo""
	@echo"    help           :    Shows available commands for this Makefile"
	@echo""
	@echo"    first_start    :    Builds docker image and then run node_prod container with it"
	@echo""
	@echo"    build          :    Builds docker image for Node.js production environment"
	@echo""
	@echo"    start          ;    Runs node_prod with the node:prod image"
	@echo""
	@echo"    stop           :    Stops node_prod container and removes it"
	@echo""

first_start: build start

build:
	sudo docker image build --no-cache -f Dockerfile -t node:prod .

start:
	sudo docker run -d --rm --name node_prod -e NODE_ENV=production node:prod

stop:
	sudo docker stop node_prod
