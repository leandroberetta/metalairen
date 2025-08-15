# ===== Config =====
NPM           ?= npm
NEXT          ?= npx next
PRISMA        ?= npx prisma
PORT          ?= 3000
NODE_ENV      ?= development

# ===== Contenedor DB (Docker/Podman) =====
CONTAINER_ENGINE ?= docker
DB_IMAGE         ?= docker.io/library/postgres:latest
DB_CONTAINER     ?= metalairen-db
DB_VOLUME        ?= metalairen-pgdata
DB_HOST_PORT     ?= 5432
DB_PORT          ?= 5432
DB_USER          ?= metalairen
DB_PASSWORD      ?= metalairen
DB_NAME          ?= metalairen

# Ruta al dump. Si DUMP_SQL está definida se usa esa;
# si no, si existe ./dump.sql se monta automáticamente.
# Si no hay dump, la DB arranca vacía.
DUMP_SQL         ?=

# Cargar variables de .env si existe
ifneq (,$(wildcard .env))
include .env
export
endif

# ===== Ayuda =====
.PHONY: help
help: ## Muestra esta ayuda
	@echo "Targets disponibles:"
	@awk 'BEGIN {FS":.*##"} /^[a-zA-Z0-9_.-]+:.*##/ {printf "  \033[36m%-24s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ===== Next.js =====
.PHONY: dev build start
dev: ## Inicia Next.js en modo desarrollo
	$(NEXT) dev -p $(PORT)

build: ## Compila la app (production)
	$(NEXT) build

start: ## Levanta el server de producción (requiere build previo)
	$(NEXT) start -p $(PORT)

# ===== Prisma: esquema y cliente =====
.PHONY: format generate studio
format: ## Formatea schema.prisma
	$(PRISMA) format

generate: ## Genera el Prisma Client
	$(PRISMA) generate

studio: ## Abre Prisma Studio
	$(PRISMA) studio

# ===== Prisma: migraciones y DB =====
.PHONY: migrate-dev migrate-deploy db-push reset
migrate-dev: ## Crea/aplica una migración en desarrollo (requiere MIGRATION="nombre")
ifndef MIGRATION
	$(error Debes pasar MIGRATION="nombre_de_migracion")
endif
	$(PRISMA) migrate dev --name "$(MIGRATION)"

migrate-deploy: ## Aplica migraciones pendientes (producción/CI)
	$(PRISMA) migrate deploy

db-push: ## Sin migraciones: sincroniza schema.prisma con la base (cuidado en prod)
	$(PRISMA) db push

reset: ## Resetea la base de desarrollo (elimina datos)
	$(PRISMA) migrate reset --force

# ===== Rebuild del esquema =====
.PHONY: schema-rebuild
schema-rebuild: format generate db-push ## Formatea, regenera cliente y actualiza DB

# ===== Postgres en contenedor =====
.PHONY: db-up db-down db-restart db-logs db-psql db-sh db-status db-rm db-wait print-db-vars

db-up: ## Levanta Postgres (monta dump si está disponible)
	@{ \
	  set -euo pipefail; \
	  echo ">> Usando engine: $(CONTAINER_ENGINE)"; \
	  if $(CONTAINER_ENGINE) container inspect $(DB_CONTAINER) >/dev/null 2>&1; then \
	    state=$$($(CONTAINER_ENGINE) inspect -f '{{.State.Status}}' $(DB_CONTAINER)); \
	    if [ "$$state" = "running" ]; then \
	      echo ">> $(DB_CONTAINER) ya está corriendo."; \
	      exit 0; \
	    else \
	      echo ">> Iniciando contenedor existente $(DB_CONTAINER)..."; \
	      $(CONTAINER_ENGINE) start $(DB_CONTAINER) >/dev/null; \
	      $(MAKE) db-wait; \
	      exit 0; \
	    fi; \
	  fi; \
	  # Normalizar puertos (por si vienen con espacios del entorno/.env) \
	  HOST_PORT="$$(printf '%s' '$(DB_HOST_PORT)' | tr -d '[:space:]\r')"; \
	  CONT_PORT="$$(printf '%s' '$(DB_PORT)'      | tr -d '[:space:]\r')"; \
	  PUBLISH="$${HOST_PORT}:$${CONT_PORT}"; \
	  echo ">> Publicando puerto: '$${PUBLISH}'"; \
	  # Determinar si montamos dump \
	  MOUNT_ARG=""; \
	  if [ -n "$(DUMP_SQL)" ] && [ -f "$(DUMP_SQL)" ]; then \
	    echo ">> Montando dump: $(DUMP_SQL)"; \
	    MOUNT_ARG="-v $(DUMP_SQL):/docker-entrypoint-initdb.d/dump.sql:z"; \
	  elif [ -f "./dump.sql" ]; then \
	    echo ">> Montando dump: ./dump.sql"; \
	    MOUNT_ARG="-v $$(pwd)/dump.sql:/docker-entrypoint-initdb.d/dump.sql:z"; \
	  else \
	    echo ">> Sin dump: la DB se inicializará vacía (sin esquema)."; \
	  fi; \
	  echo ">> MOUNT_ARG = '$$MOUNT_ARG'"; \
	  # Crear volumen si no existe (idempotente en Docker/Podman) \
	  $(CONTAINER_ENGINE) volume create $(DB_VOLUME) >/dev/null; \
	  # Correr el contenedor \
	  set -x; \
	  $(CONTAINER_ENGINE) run -d --name $(DB_CONTAINER) \
	    -e POSTGRES_USER=$(DB_USER) \
	    -e POSTGRES_PASSWORD=$(DB_PASSWORD) \
	    -e POSTGRES_DB=$(DB_NAME) \
	    --publish "$$PUBLISH" \
	    -v $(DB_VOLUME):/var/lib/postgresql/data:Z $$MOUNT_ARG \
	    $(DB_IMAGE) >/dev/null; \
	  set +x; \
	  echo ">> Contenedor $(DB_CONTAINER) levantado en puerto $$HOST_PORT."; \
	  $(MAKE) db-wait; \
	}

db-down: ## Detiene el contenedor de Postgres
	-$(CONTAINER_ENGINE) stop $(DB_CONTAINER)

db-restart: ## Reinicia el contenedor de Postgres
	$(MAKE) db-down
	$(MAKE) db-up

db-logs: ## Muestra logs de Postgres
	$(CONTAINER_ENGINE) logs -f $(DB_CONTAINER)

db-psql: ## Entra a psql dentro del contenedor
	$(CONTAINER_ENGINE) exec -it $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME)

db-sh: ## Shell dentro del contenedor
	$(CONTAINER_ENGINE) exec -it $(DB_CONTAINER) bash

db-status: ## Estado del contenedor
	@$(CONTAINER_ENGINE) ps -a --filter name=$(DB_CONTAINER)

db-rm: ## Elimina contenedor y volumen (¡borra datos!)
	-$(CONTAINER_ENGINE) rm -f $(DB_CONTAINER)
	-$(CONTAINER_ENGINE) volume rm $(DB_VOLUME)

db-wait: ## Espera a que la DB acepte conexiones (muestra logs si falla)
	@echo ">> Esperando que Postgres esté listo..."; \
	for i in $$(seq 1 60); do \
	  if $(CONTAINER_ENGINE) exec $(DB_CONTAINER) pg_isready -U $(DB_USER) -d $(DB_NAME) >/dev/null 2>&1; then \
	    echo ">> Postgres listo."; exit 0; \
	  fi; \
	  sleep 1; \
	done; \
	echo "!! Timeout esperando Postgres. Últimas líneas de logs:"; \
	$(CONTAINER_ENGINE) logs --tail=50 $(DB_CONTAINER); \
	exit 1

# ===== Restaurar / Backup =====
.PHONY: db-restore db-restore-custom db-backup

db-restore: ## Restaura DUMP_SQL (texto) con psql en $(DB_NAME) (usar DUMP_SQL=/ruta.sql)
ifndef DUMP_SQL
	$(error Debes pasar DUMP_SQL=/ruta/al/dump.sql)
endif
	@test -f "$(DUMP_SQL)" || (echo "No existe $(DUMP_SQL)"; exit 1)
	$(CONTAINER_ENGINE) exec -i $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME) < "$(DUMP_SQL)"

db-restore-custom: ## Restaura DUMP_SQL (-Fc) con pg_restore (usar DUMP_SQL=/ruta.dump)
ifndef DUMP_SQL
	$(error Debes pasar DUMP_SQL=/ruta/al/dump.dump)
endif
	@test -f "$(DUMP_SQL)" || (echo "No existe $(DUMP_SQL)"; exit 1)
	$(CONTAINER_ENGINE) exec -i $(DB_CONTAINER) pg_restore -U $(DB_USER) -d $(DB_NAME) --clean --if-exists < "$(DUMP_SQL)"

db-backup: ## Crea backup.sql de la DB actual
	$(CONTAINER_ENGINE) exec -i $(DB_CONTAINER) pg_dump -U $(DB_USER) -d $(DB_NAME) > backup.sql
	@echo "Backup escrito en ./backup.sql"
