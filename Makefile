VERSION := $(shell git rev-parse --short HEAD)

CHANGES := $(shell git status --porcelain)

.PHONY: changes docker docker-push build

# print changes
changes:
	@echo $(CHANGES)

docker:
	docker build . -f docker/Dockerfile -t soundofgothic/ui:$(VERSION)

docker-push: docker
	if [ -n "$(CHANGES)" ]; then echo "You have uncommited changes, aborting"; exit 1; fi
	docker push soundofgothic/ui:$(VERSION)

version:
	@echo soundofgothic/ui:$(VERSION)

build:
	npm run build:prod

run:
	npm run server