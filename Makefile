all: test coverage

test:
	expresso -I lib test/*

coverage:
	expresso -I lib --cov test/*

.PHONY: test coverage
