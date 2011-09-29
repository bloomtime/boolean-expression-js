all: test coverage

test:
	./node_modules/expresso/bin/expresso -I lib test/*

coverage:
	./node_modules/expresso/bin/expresso -I lib --cov test/*

.PHONY: test coverage
