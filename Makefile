# VARIABLES
POSTGRES_USER = $(shell cat .env | grep POSTGRES_USER | cut -f2 -d'=')
POSTGRES_DB   = $(shell cat .env | grep POSTGRES_DB | cut -f2 -d'=')

# RULES
all : help

help:
	@echo "[RULES HELP]"
	@echo "    help           :    Shows available commands for this Makefile"
	@echo ""
	@echo "[CONTAINER MANAGEMENT]"
	@echo "    prepare        :    Builds docker images and install Node.js dependencies"
	@echo ""
	@echo "    build          :    Builds docker images for the botlg and its PHP API"
	@echo ""
	@echo "    install        :    Installs the Node.js dependencies required by the project within the 'botlg' container"
	@echo ""
	@echo "    update         :    Updates the Node.js dependencies required by the project within the 'botlg' container"
	@echo ""
	@echo "    start          ;    Starts the containers with docker-compose"
	@echo ""
	@echo "    stop           :    Stops the containers and removes it with docker-compose"
	@echo ""
	@echo "    restart        :    Restarts the containers with docker-compose"
	@echo ""

prepare: build install

build: Dockerfile php-api.Dockerfile
	docker image build --file Dockerfile --tag node:botlg ./

install:
	docker-compose run --rm botlg pnpm install

update:
	docker-compose run --rm botlg pnpm update

start:
	docker-compose up --detach

stop:
	docker-compose down

restart: stop start

deploy-commands:
	docker-compose run --rm botlg node deploy-commands.js
