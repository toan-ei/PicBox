COMPOSE=docker compose -f docker/docker-compose.dev.yml --env-file docker/.env

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

reset:
	$(COMPOSE) down -v
	$(COMPOSE) up -d

kafka-ui:
	@echo "Kafka UI: http://localhost:8080"