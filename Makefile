# VARIABLES
IMAGE_MKDOCS = $(shell cat .env | grep IMAGE_MKDOCS | cut -f2 -d'=')
BOTLG_VERSION = 2.0.0

# RULES
all : help

help:
	@echo "[RULES HELP]"
	@echo "    help                      : Shows available commands for this Makefile"
	@echo ""
	@echo "[CONTAINER MANAGEMENT]"
	@echo "    install                   : Installs the Node.js dependencies required by the project within the 'botlg' container"
	@echo ""
	@echo "    update                    : Updates the Node.js dependencies required by the project within the 'botlg' container"
	@echo ""
	@echo "    start                     ; Starts the containers with docker-compose"
	@echo ""
	@echo "    stop                      : Stops the containers and removes it with docker-compose"
	@echo ""
	@echo "    restart                   : Restarts the containers with docker-compose"
	@echo ""
	@echo "[BOT COMMAND MANAGEMENT]"
	@echo "    deploy-commands           : Deploys application commands to the server in config.json"
	@echo ""
	@echo "    deploy-commands-global    : Deploys application commands to all servers"
	@echo ""
	@echo "    delete-commands           : Deletes application commands on the server in config.json"
	@echo ""
	@echo "[BUILD]"
	@echo "    build-docs                : Builds documentation site with MkDocs"
	@echo ""
	@echo "    build                     : Builds documentation and app Docker images"
	@echo ""

# CONTAINER MANAGEMENT

install:
	docker-compose run --rm botlg_app pnpm install

update:
	docker-compose run --rm botlg_app pnpm update

start:
	docker-compose up --detach

stop:
	docker-compose down

restart: stop start

# BOT COMMAND MANAGEMENT

deploy-commands:
	docker-compose run --rm botlg_app node deploy-commands.js

deploy-commands-global:
	docker-compose run --rm botlg_app node deploy-commands.js true

delete-commands:
	docker-compose run --rm botlg_app node delete-commands.js

# BUILD

build-docs:
	docker run --rm --interactive --tty --volume ${PWD}/mkdocs/:/docs/ ${IMAGE_MKDOCS} mkdocs build -f config/en/mkdocs.yaml
	docker run --rm --interactive --tty --volume ${PWD}/mkdocs/:/docs/ ${IMAGE_MKDOCS} mkdocs build -f config/fr/mkdocs.yaml

build: build-docs
	docker image build --file botlg-app.Dockerfile --tag docker.home-pouliquen.local/botlg-app:${BOTLG_VERSION} ./
	docker image build --file botlg-web.Dockerfile --tag docker.home-pouliquen.local/botlg-web:${BOTLG_VERSION} ./
