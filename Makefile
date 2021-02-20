# COMMANDS
DC		=	sudo docker
DCC		=	sudo docker-compose
DCUPC	=	up
DCDOWNC	=	down
DIBC	=	image build
DRUN	=	run
DSTOP	=	stop
DLC		=	logs

# FLAGS
DIBFLAGS	=	--no-cache --file
DIBTAG		=	--tag
DCUPFLAGS	=	--detach
DRUNFLAGS	=	--detach --rm --name bot-lg --volume "$(PWD)/app/:/app/"
DLFLAGS		=	--follow

# VARIABLES
CONTAINER	= bot-lg

# RULES
all : help

help:
	@echo "[RULES HELP]"
	@echo "    help           :    Shows available commands for this Makefile"
	@echo ""
	@echo "[CONTAINER MANAGEMENT]"
	@echo "    prepare        :    Builds docker images and install Node.js dependencies"
	@echo ""
	@echo "    build          :    Builds docker images for the bot-lg and its API"
	@echo ""
	@echo "    install        :    Installs the Node.js dependencies required by the project within the 'bot_lg' container"
	@echo ""
	@echo "    start          ;    Starts the containers with docker-compose"
	@echo ""
	@echo "    stop           :    Stops the containers and removes it with docker-compose"
	@echo ""
	@echo "    restart        :    Restarts the containers with docker-compose"
	@echo ""
	@echo "[CONTAINER ADMINISTRATION]"
	@echo "    logs           :    Reads continuously the logs from the container mentioned with CONTAINER arg (default 'bot-lg')"
	@echo "                            Usage :"
	@echo "                              - make logs"
	@echo "                              - make logs CONTAINER=container_name"
	@echo ""

prepare: build install

build: bot-lg.Dockerfile
	$(DC) $(DIBC) $(DIBFLAGS) bot-lg.Dockerfile $(DIBTAG) node:bot-lg ./
	$(DC) $(DIBC) $(DIBFLAGS) php-api.Dockerfile $(DIBTAG) php:php-api ./

install:
	$(DC) $(DRUN) $(DRUNFLAGS) node:bot-lg npm install

start:
	$(DCC) $(DCUPC) $(DCUPFLAGS)

stop:
	$(DCC) $(DCDOWNC)

restart: stop start

logs:
	$(DC) $(DLC) $(DLFLAGS) $(CONTAINER)