# COMMANDS
DC		=	sudo docker
DIBC	=	image build
DRUN	=	run
DSTOP	=	stop
DLC		=	logs

# FLAGS
DIBFLAGS	=	--no-cache --tag bot-lg:node-prod --file
DRUNFLAGS	=	--detach --rm --name bot-lg --env NODE_ENV=production --volume $(PWD)/app/:/app/
DLFLAGS		=	--follow

# RULES
all : help

help:
	@echo ""
	@echo "    help           :    Shows available commands for this Makefile"
	@echo ""
	@echo "    prepare        :    Builds docker image and then run the 'bot-lg' container with it"
	@echo ""
	@echo "    build          :    Builds docker image for Node.js production environment"
	@echo ""
	@echo "    start          ;    Runs the 'bot-lg' with the node:prod image"
	@echo ""
	@echo "    stop           :    Stops the 'bot-lg' container and removes it"
	@echo ""
	@echo "    restart        :    Restarts the 'bot-lg' container"
	@echo ""
	@echo "    logs           :    Reads continuously the logs from the 'bot-lg' container"
	@echo ""

prepare: build start

build: Dockerfile
	$(DC) $(DIBC) $(DIBFLAGS) $? .

start:
	$(DC) $(DRUN) $(DRUNFLAGS) bot-lg:node-prod

stop:
	$(DC) $(DSTOP) bot-lg

restart: stop start

logs:
	$(DC) $(DLC) $(DLFLAGS) bot-lg