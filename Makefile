# COMMANDS
DC		=	sudo docker
DIBC	=	image build
DRUN	=	run
DSTOP	=	stop

# FLAGS
DIBFLAGS	=	--no-cache --tag node:prod --file
DRUNFLAGS	=	--detach --rm --name node_prod --env NODE_ENV=production --volume $(PWD)/app/:/app/

# RULES
all : help

help:
	@echo ""
	@echo "    help           :    Shows available commands for this Makefile"
	@echo ""
	@echo "    prepare        :    Builds docker image and then run node_prod container with it"
	@echo ""
	@echo "    build          :    Builds docker image for Node.js production environment"
	@echo ""
	@echo "    start          ;    Runs node_prod with the node:prod image"
	@echo ""
	@echo "    stop           :    Stops node_prod container and removes it"
	@echo ""	
	@echo "    restart        :    Restarts the 'node_prod' container"
	@echo ""

prepare: build start

build: Dockerfile
	$(DC) $(DIBC) $(DIBFLAGS) $? .

start:
	$(DC) $(DRUN) $(DRUNFLAGS) node:prod

stop:
	$(DC) $(DSTOP) node_prod

restart: stop start