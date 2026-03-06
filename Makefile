.PHONY: install dev build clean server web lint typecheck help

# Default target
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	pnpm install

dev: ## Start server + web in parallel (development)
	pnpm -r --parallel dev

server: ## Start only the server (port 7331)
	pnpm --filter @unloved/server dev

web: ## Start only the web dev server (port 5173)
	pnpm --filter @unloved/web dev

build: ## Build all packages
	pnpm -r build

build-server: ## Build server package only
	pnpm --filter @unloved/server build

build-web: ## Build web package only
	pnpm --filter @unloved/web build

typecheck: ## Run TypeScript type checking across all packages
	pnpm -r exec tsc --noEmit

clean: ## Remove all build artifacts and node_modules
	rm -rf node_modules packages/*/node_modules packages/*/dist packages/*/*.tsbuildinfo

reset: ## Clean + reinstall (nuclear option)
	$(MAKE) clean
	$(MAKE) install
