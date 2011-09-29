all: test 

test:
	./node_modules/expresso/bin/expresso test/*

.PHONY: test 
