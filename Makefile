ENV ?= dev

envfiles:
	cp -f .env.${ENV} .env

up:
	docker-compose up

clean:
	docker-compose down --remove-orphans

cleanAll: clean
	rm -f .env
	rm -f docker-compose.yml

run: envfiles up

build: envfiles
	docker-compose build

all: clean envfiles build up

dev:
	$(MAKE) ENV=dev all

prod:
	$(MAKE) ENV=prod all