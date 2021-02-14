# COMMANDS
DC		=	sudo docker
DIBC	=	image build
DRUN	=	run
DSTOP	=	stop
DLC		=	logs

# FLAGS
DIBFLAGS	=	--no-cache --file
DIBTAG		=	--tag
DRUNFLAGS	=	--detach --rm --name bot-lg --volume "$(PWD)/app/:/app/"
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
	@echo "    build          :    Builds docker image for Node.js environment"
	@echo ""
	@echo "    install        :    Installs the Node.js dependencies required by the project"
	@echo ""
	@echo "    start          ;    Runs the 'bot-lg' with the node:bot-lg image"
	@echo ""
	@echo "    stop           :    Stops the 'bot-lg' container and removes it"
	@echo ""
	@echo "    restart        :    Restarts the 'bot-lg' container"
	@echo ""
	@echo "[CONTAINER ADMINISTRATION]"
	@echo "    logs           :    Reads continuously the logs from the 'bot-lg' container"
	@echo ""

prepare: build install

build: bot-lg.Dockerfile
	$(DC) $(DIBC) $(DIBFLAGS) bot-lg.Dockerfile $(DIBTAG) node:bot-lg ./
	$(DC) $(DIBC) $(DIBFLAGS) php-api.Dockerfile $(DIBTAG) alpine:php-api ./

install:
	$(DC) $(DRUN) $(DRUNFLAGS) node:bot-lg npm install

start:
	$(DC) $(DRUN) $(DRUNFLAGS) node:bot-lg

stop:
	$(DC) $(DSTOP) bot-lg

restart: stop start

logs:
	$(DC) $(DLC) $(DLFLAGS) bot-lg