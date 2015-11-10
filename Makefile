test:
	node_modules/mocha/bin/_mocha "infrastructure/tests" --reporter spec

.PHONY: test