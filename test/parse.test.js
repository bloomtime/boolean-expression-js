var assert = require('assert'), // expresso
    expressions = require('expressions'),
    parse = expressions.parse;

module.exports = {
    'test parse simplest': function(){
        assert.deepEqual(parse("foo"), "foo");
    },
    'test parse (simplest)': function(){
        assert.deepEqual(parse("(foo)"), "foo");
    },
    'test parse not': function() {
        assert.deepEqual(parse("NOT foo"), [ "NOT", "foo" ]);
    },
    'test parse (not)': function() {
        assert.deepEqual(parse("NOT (foo)"), [ "NOT", "foo" ]);
    },
    'test parse simple dis': function(){
        assert.deepEqual(parse("foo OR bar"), [ "OR", "foo", "bar" ]);
    },
    'test parse simple not dis': function(){
        var parsed = parse("NOT (foo OR bar)");
        var expected = [ "NOT", [ "OR", "foo", "bar" ] ];
        assert.deepEqual(parsed, expected);
    },
    'test parse simple not dis lower': function(){
        var parsed = parse("not (foo OR bar)");
        var expected = [ "NOT", [ "OR", "foo", "bar" ] ];
        assert.deepEqual(parsed, expected);
    },
    'test parse simple dis lower': function(){
        assert.deepEqual(parse("foo or bar"), [ "OR", "foo", "bar" ]);
    },
    'test parse simple con': function(){
        assert.deepEqual(parse("foo AND bar"), [ "AND", "foo", "bar" ]);
    },
    'test parse simple not con': function(){
        var parsed = parse("NOT (foo AND bar)");
        var expected = [ "NOT", [ "AND", "foo", "bar" ] ];
        assert.deepEqual(parsed, expected);
    },
    'test parse simple not con lower': function(){
        var parsed = parse("not (foo AND bar)");
        var expected = [ "NOT", [ "AND", "foo", "bar" ] ];
        assert.deepEqual(parsed, expected);
    },
    'test parse simple con lower': function(){
        assert.deepEqual(parse("foo and bar"), [ "AND", "foo", "bar" ]);
    },
    'test parse parens dis': function(){
        assert.deepEqual(parse("(foo OR bar)"), [ "OR", "foo", "bar" ]);
    },
    'test parse parens con': function(){
        assert.deepEqual(parse("(foo AND bar)"), [ "AND", "foo", "bar" ]);
    },
    'test parse complex parens': function(){
        var parsed = parse("(foo OR bar) AND baz");
        var expected = [ "AND", [ "OR", "foo", "bar" ], "baz" ];
        assert.deepEqual(parsed, expected);
    },
    'test parse complex (parens)': function(){
        var parsed = parse("((((foo) OR (bar)) AND (baz)))");
        var expected = [ "AND", [ "OR", "foo", "bar" ], "baz" ];
        assert.deepEqual(parsed, expected);
    },
    'test parse complex prec': function(){
        var parsed = parse("foo OR bar AND baz");
        var expected = [ "OR", "foo", [ "AND", "bar", "baz" ] ];
        assert.deepEqual(parsed, expected);
    },
    'test parse complex prec2': function(){
        var parsed = parse("bar AND baz OR foo");
        var expected = [ "OR", [ "AND", "bar", "baz" ], "foo" ];
        assert.deepEqual(parsed, expected);
    },
    'test parse complex nested': function(){
        var parsed = parse("(foo OR (bar AND baz))");
        var expected = [ "OR", "foo", [ "AND", "bar", "baz" ] ];
        assert.deepEqual(parsed, expected);
    },
    'test parse complex nested2': function(){
        var parsed = parse("(bar AND baz) OR (spam AND ham)");
        var expected = [ "OR", [ "AND", "bar", "baz" ], [ "AND", "spam", "ham" ] ];
        assert.deepEqual(parsed, expected);
    },
    'test parse complex nested3': function(){
        var parsed = parse("(bar AND baz) OR (spam AND ham AND eggs)");
        var expected = [ "OR", [ "AND", "bar", "baz" ], [ "AND", [ "AND", "spam", "ham" ], "eggs" ] ];
        assert.deepEqual(parsed, expected);
    },
    'test parse complex nested4': function(){
        var parsed = parse("(foo OR (bar AND baz) OR (spam AND ham AND eggs))");
        var expected = [ "OR" , [ "OR", "foo", [ "AND", "bar", "baz"] ], [ "AND", [ "AND", "spam", "ham" ], "eggs" ] ]
        assert.deepEqual(parsed, expected);
    },
};
