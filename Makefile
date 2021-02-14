# COMMANDS
DC		=	sudo docker
DIBC	=	image build
DRUN	=	run
DSTOP	=	stop
DLC		=	logs

# FLAGS
DIBFLAGS	=	--no-cache --tag bot-lg:node-prod --file
DRUNFLAGS	=	--detach --rm --name bot-lg --env NODE_ENV=production --volume "$(PWD)/app/:/app/"
DLFLAGS		=	--follow

# RULES
all : help

help:
	@echo "[RULES HELP]"
	@echo "    help           :    Shows available commands for this Makefile"
	@echo ""
	@echo "[CONTAINER MANAGEMENT]"
	@echo "    prepare        :    Builds docker image and install node dependencies"
	@echo ""
	@echo "    build          :    Builds docker image for Node.js production environment"
	@echo ""
	@echo "    install        :    Installs the Node.js dependencies required by the project"
	@echo ""
	@echo "    start          ;    Runs the 'bot-lg' with the bot-lg:node-prod image"
	@echo ""
	@echo "    stop           :    Stops the 'bot-lg' container and removes it"
	@echo ""
	@echo "    restart        :    Restarts the 'bot-lg' container"
	@echo ""
	@echo "[CONTAINER ADMINISTRATION]"
	@echo "    logs           :    Reads continuously the logs from the 'bot-lg' container"
	@echo ""

prepare: build install

build: Dockerfile
	$(DC) $(DIBC) $(DIBFLAGS) $? ./

install:
	$(DC) $(DRUN) $(DRUNFLAGS) bot-lg:node-prod npm install --production

start:
	$(DC) $(DRUN) $(DRUNFLAGS) bot-lg:node-prod nodemon index.js

stop:
	$(DC) $(DSTOP) bot-lg

restart: stop start

logs:
	$(DC) $(DLC) $(DLFLAGS) bot-lg