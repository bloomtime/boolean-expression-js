var assert = require('assert'), // expresso
    Expression = require('../expression');

module.exports = {
    'test parse simplest': function(){
        assert.deepEqual(new Expression("foo").tree, "foo");
    },
    'test parse phrase': function(){
        assert.deepEqual(new Expression("\"foo bar\"").tree, "foo bar");
    },
    'test parse (simplest)': function(){
        assert.deepEqual(new Expression("(foo)").tree, "foo");
    },
    'test parse ("phrase")': function(){
        assert.deepEqual(new Expression("(\"foo bar\")").tree, "foo bar");
    },
/*    'test parse "(phrase)"': function(){
        assert.deepEqual(new Expression("\"(foo bar)\"").tree, "(foo bar)");
    },*/
    'test parse not': function() {
        assert.deepEqual(new Expression("NOT foo").tree, [ "NOT", "foo" ]);
    },
    'test parse not not': function() {
        assert.deepEqual(new Expression("NOT NOT foo").tree, [ "NOT", [ "NOT", "foo" ] ]);
    },
    'test parse (not)': function() {
        assert.deepEqual(new Expression("NOT (foo)").tree, [ "NOT", "foo" ]);
    },
    'test parse simple dis': function(){
        assert.deepEqual(new Expression("foo OR bar").tree, [ "OR", "foo", "bar" ]);
    },
    'test parse simple not dis': function(){
        var parsed = new Expression("NOT (foo OR bar)");
        var expected = [ "NOT", [ "OR", "foo", "bar" ] ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse simple not dis lower': function(){
        var parsed = new Expression("not (foo OR bar)");
        var expected = [ "NOT", [ "OR", "foo", "bar" ] ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse simple dis lower': function(){
        assert.deepEqual(new Expression("foo or bar").tree, [ "OR", "foo", "bar" ]);
    },
    'test parse simple con': function(){
        assert.deepEqual(new Expression("foo AND bar").tree, [ "AND", "foo", "bar" ]);
    },
    'test parse simple not con': function(){
        var parsed = new Expression("NOT (foo AND bar)");
        var expected = [ "NOT", [ "AND", "foo", "bar" ] ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse simple not con lower': function(){
        var parsed = new Expression("not (foo AND bar)");
        var expected = [ "NOT", [ "AND", "foo", "bar" ] ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse simple con lower': function(){
        assert.deepEqual(new Expression("foo and bar").tree, [ "AND", "foo", "bar" ]);
    },
    'test parse parens dis': function(){
        assert.deepEqual(new Expression("(foo OR bar)").tree, [ "OR", "foo", "bar" ]);
    },
    'test parse parens con': function(){
        assert.deepEqual(new Expression("(foo AND bar)").tree, [ "AND", "foo", "bar" ]);
    },
    'test parse complex parens': function(){
        var parsed = new Expression("(foo OR bar) AND baz");
        var expected = [ "AND", [ "OR", "foo", "bar" ], "baz" ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse dis phrase': function(){
        var parsed = new Expression("\"foo bar\" OR baz");
        var expected = [ "OR", "foo bar", "baz" ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse con phrase': function(){
        var parsed = new Expression("\"foo bar\" AND baz");
        var expected = [ "AND", "foo bar", "baz" ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse complex (parens)': function(){
        var parsed = new Expression("((((foo) OR (bar)) AND (baz)))");
        var expected = [ "AND", [ "OR", "foo", "bar" ], "baz" ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse complex prec': function(){
        var parsed = new Expression("foo OR bar AND baz");
        var expected = [ "OR", "foo", [ "AND", "bar", "baz" ] ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse complex prec2': function(){
        var parsed = new Expression("bar AND baz OR foo");
        var expected = [ "OR", [ "AND", "bar", "baz" ], "foo" ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse prec3': function() {
        var expected = [ "OR", [ "NOT", "foo" ], "bar" ];
        var parsed = new Expression("not foo OR bar");
        assert.deepEqual(parsed.tree, expected);
        var parsed2 = new Expression("(not foo) OR bar");
        assert.deepEqual(parsed2.tree, expected);
    },
    'test parse phrase not': function(){
        var parsed = new Expression("(not \"foo bar\") and \"spam ham eggs\"");
        var expected = [ "AND", [ "NOT", "foo bar" ], "spam ham eggs" ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse phrase con': function(){
        var parsed = new Expression("\"foo bar\" and \"spam ham eggs\"");
        var expected = [ "AND", "foo bar", "spam ham eggs" ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse phrase dis': function(){
        var parsed = new Expression("\"foo bar\" or \"spam ham eggs\"");
        var expected = [ "OR", "foo bar", "spam ham eggs" ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse complex nested': function(){
        var parsed = new Expression("(foo OR (bar AND baz))");
        var expected = [ "OR", "foo", [ "AND", "bar", "baz" ] ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse complex nested2': function(){
        var parsed = new Expression("(bar AND baz) OR (spam AND ham)");
        var expected = [ "OR", [ "AND", "bar", "baz" ], [ "AND", "spam", "ham" ] ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse complex nested3': function(){
        var parsed = new Expression("(bar AND baz) OR (spam AND ham AND eggs)");
        var expected = [ "OR", [ "AND", "bar", "baz" ], [ "AND", [ "AND", "spam", "ham" ], "eggs" ] ];
        assert.deepEqual(parsed.tree, expected);
    },
    'test parse complex nested4': function(){
        var parsed = new Expression("(foo OR (bar AND baz) OR (spam AND ham AND eggs))");
        var expected = [ "OR" , [ "OR", "foo", [ "AND", "bar", "baz"] ], [ "AND", [ "AND", "spam", "ham" ], "eggs" ] ]
        assert.deepEqual(parsed.tree, expected);
    },
};
