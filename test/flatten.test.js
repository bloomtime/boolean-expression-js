var assert = require('assert'), // expresso
    Expression = require('../expression');

module.exports = {
    'test flattenTree simplest': function(){
        assert.deepEqual(new Expression("foo").flatten(), [ "foo" ]);
    },
    'test flattenTree simplest not': function(){
        assert.deepEqual(new Expression("not foo").flatten(), []);
    },
    'test flattenTree simplest not not': function(){
        assert.deepEqual(new Expression("not not foo").flatten(), [ "foo" ]);
    },
    'test flattenTree not phrase': function(){
        assert.deepEqual(new Expression("\"not bar\"").flatten(), [ "not bar" ]);
    },
    'test flattenTree not not phrase': function(){
        assert.deepEqual(new Expression("not \"not bar\"").flatten(), []);
    },
    'test flattenTree phrase': function(){
        assert.deepEqual(new Expression("\"foo bar\"").flatten(), [ "foo bar" ]);
    },
    'test flattenTree simple dis': function(){
        var parsed = new Expression("foo OR bar");
        assert.deepEqual(parsed.flatten(), [ "foo", "bar" ]);
    },
    'test flattenTree simple dis lower': function(){
        var parsed = new Expression("foo or bar");
        assert.deepEqual(parsed.flatten(), [ "foo", "bar" ]);
    },
    'test flattenTree simple con': function(){
        var parsed = new Expression("foo AND bar");
        assert.deepEqual(parsed.flatten(), [ "foo", "bar" ]);
    },
    'test flattenTree simple con lower': function(){
        var parsed = new Expression("foo and bar");
        assert.deepEqual(parsed.flatten(), [ "foo", "bar" ]);
    },
    'test flattenTree parens dis': function(){
        var parsed = new Expression("(foo OR bar)");
        assert.deepEqual(parsed.flatten(), [ "foo", "bar" ]);
    },
    'test flattenTree parens con': function(){
        var parsed = new Expression("(foo and bar)");
        assert.deepEqual(parsed.flatten(), [ "foo", "bar" ]);
    },
    'test flattenTree complex parens': function(){
        var parsed = new Expression("(foo OR bar) AND baz");
        assert.deepEqual(parsed.flatten(), [ "foo", "bar", "baz" ]);
    },
    'test flattenTree complex prec': function(){
        var parsed = new Expression("foo OR bar AND baz");
        assert.deepEqual(parsed.flatten(), [ "foo", "bar", "baz" ]);
    },
    'test flattenTree complex prec2': function(){
        var parsed = new Expression("bar AND baz OR foo");
        assert.deepEqual(parsed.flatten(), [ "bar", "baz", "foo" ]);
    },
    'test flattenTree prec3': function() {
        var parsed = new Expression("not foo or bar");
        var parsed2 = new Expression("(not foo) or bar");
        assert.deepEqual(parsed.flatten(), [ "bar" ] );
        assert.deepEqual(parsed2.flatten(), [ "bar" ]);
    },
    'test flattenTree complex nested': function(){
        var parsed = new Expression("(foo OR (bar AND baz))");
        assert.deepEqual(parsed.flatten(), [ "foo", "bar", "baz" ]);
    },
    'test flattenTree complex nested2': function(){
        var parsed = new Expression("(bar AND baz) OR (spam AND ham)");
        assert.deepEqual(parsed.flatten(), [ "bar", "baz", "spam", "ham" ]);
    },
    'test flattenTree complex nested3 not': function(){
        var parsed = new Expression("(bar AND NOT baz) OR (spam AND ham AND eggs)");
        assert.deepEqual(parsed.flatten(), [ "bar", "spam", "ham", "eggs" ]);
    },
    'test flattenTree complex nested3': function(){
        var parsed = new Expression("(bar AND baz) OR (spam AND ham AND eggs)");
        assert.deepEqual(parsed.flatten(), [ "bar", "baz", "spam", "ham", "eggs" ]);
    },
    'test flattenTree complex nested4 not': function(){
        var parsed = new Expression("not (foo OR (bar AND baz) OR (spam AND ham AND eggs))");
        assert.deepEqual(parsed.flatten(), []);
    },
    'test flattenTree complex nested4': function(){
        var parsed = new Expression("(foo OR (bar AND baz) OR (spam AND ham AND eggs))");
        assert.deepEqual(parsed.flatten(), [ "foo", "bar", "baz", "spam", "ham", "eggs" ]);
    }
};
