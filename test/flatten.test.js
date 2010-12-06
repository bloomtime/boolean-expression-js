var assert = require('assert'), // expresso
    expressions = require('expressions'),
    parse = expressions.parse,
    flattenTree = expressions.flattenTree;

module.exports = {
    'test flattenTree simplest': function(){
        assert.deepEqual(flattenTree(parse("foo")), [ "foo" ]);
    },
    'test flattenTree simplest not': function(){
        assert.deepEqual(flattenTree(parse("not foo")), []);
    },
    'test flattenTree simplest not not': function(){
        assert.deepEqual(flattenTree(parse("not not foo")), [ "foo" ]);
    },
    'test flattenTree not phrase': function(){
        assert.deepEqual(flattenTree(parse("\"not bar\"")), [ "not", "bar" ]);
    },
    'test flattenTree not not phrase': function(){
        assert.deepEqual(flattenTree(parse("not \"not bar\"")), []);
    },
    'test flattenTree phrase': function(){
        assert.deepEqual(flattenTree(parse("\"foo bar\"")), [ "foo", "bar" ]);
    },
    'test flattenTree simple dis': function(){
        var parsed = parse("foo OR bar");
        assert.deepEqual(flattenTree(parsed), [ "foo", "bar" ]);
    },
    'test flattenTree simple dis lower': function(){
        var parsed = parse("foo or bar");
        assert.deepEqual(flattenTree(parsed), [ "foo", "bar" ]);
    },
    'test flattenTree simple con': function(){
        var parsed = parse("foo AND bar");
        assert.deepEqual(flattenTree(parsed), [ "foo", "bar" ]);
    },
    'test flattenTree simple con lower': function(){
        var parsed = parse("foo and bar");
        assert.deepEqual(flattenTree(parsed), [ "foo", "bar" ]);
    },
    'test flattenTree parens dis': function(){
        var parsed = parse("(foo OR bar)");
        assert.deepEqual(flattenTree(parsed), [ "foo", "bar" ]);
    },
    'test flattenTree parens con': function(){
        var parsed = parse("(foo and bar)");
        assert.deepEqual(flattenTree(parsed), [ "foo", "bar" ]);
    },
    'test flattenTree complex parens': function(){
        var parsed = parse("(foo OR bar) AND baz");
        assert.deepEqual(flattenTree(parsed), [ "foo", "bar", "baz" ]);
    },
    'test flattenTree complex prec': function(){
        var parsed = parse("foo OR bar AND baz");
        assert.deepEqual(flattenTree(parsed), [ "foo", "bar", "baz" ]);
    },
    'test flattenTree complex prec2': function(){
        var parsed = parse("bar AND baz OR foo");
        assert.deepEqual(flattenTree(parsed), [ "bar", "baz", "foo" ]);
    },
    'test flattenTree prec3': function() {
        var parsed = parse("not foo or bar");
        var parsed2 = parse("(not foo) or bar");
        assert.deepEqual(flattenTree(parsed), [ "bar" ] );
        assert.deepEqual(flattenTree(parsed2), [ "bar" ]);
    },
    'test flattenTree complex nested': function(){
        var parsed = parse("(foo OR (bar AND baz))");
        assert.deepEqual(flattenTree(parsed), [ "foo", "bar", "baz" ]);
    },
    'test flattenTree complex nested2': function(){
        var parsed = parse("(bar AND baz) OR (spam AND ham)");
        assert.deepEqual(flattenTree(parsed), [ "bar", "baz", "spam", "ham" ]);
    },
    'test flattenTree complex nested3 not': function(){
        var parsed = parse("(bar AND NOT baz) OR (spam AND ham AND eggs)");
        assert.deepEqual(flattenTree(parsed), [ "bar", "spam", "ham", "eggs" ]);
    },
    'test flattenTree complex nested3': function(){
        var parsed = parse("(bar AND baz) OR (spam AND ham AND eggs)");
        assert.deepEqual(flattenTree(parsed), [ "bar", "baz", "spam", "ham", "eggs" ]);
    },
    'test flattenTree complex nested4 not': function(){
        var parsed = parse("not (foo OR (bar AND baz) OR (spam AND ham AND eggs))");
        assert.deepEqual(flattenTree(parsed), []);
    },
    'test flattenTree complex nested4': function(){
        var parsed = parse("(foo OR (bar AND baz) OR (spam AND ham AND eggs))");
        assert.deepEqual(flattenTree(parsed), [ "foo", "bar", "baz", "spam", "ham", "eggs" ]);
    }
};
