.PHONY: install dev build clean server web typecheck help publish install-local test-e2e

# Default target
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	pnpm install

dev: ## Start server + web in parallel (development)
	pnpm -r --parallel dev

server: ## Start only the server (port 6200)
	pnpm --filter @unloved/server dev

web: ## Start only the web dev server (port 6201)
	pnpm --filter @unloved/web dev

build: ## Build all packages (server → web → cli)
	pnpm build

build-server: ## Build server package only
	pnpm --filter @unloved/server build

build-web: ## Build web package only
	pnpm --filter @unloved/web build

build-cli: ## Build CLI package (includes web prebuild)
	pnpm --filter unloved build

typecheck: ## Run TypeScript type checking across all packages
	pnpm -r exec tsc --noEmit

clean: ## Remove all build artifacts and node_modules
	rm -rf node_modules packages/*/node_modules packages/*/dist packages/*/*.tsbuildinfo packages/cli/public

reset: ## Clean + reinstall (nuclear option)
	$(MAKE) clean
	$(MAKE) install

publish: ## Build and publish CLI to npm
	pnpm build
	cd packages/cli && npm publish

install-local: ## Install latest globally after publish
	npm i -g unloved

test-e2e: build ## Run Playwright end-to-end tests
	cd packages/web && pnpm exec playwright test
