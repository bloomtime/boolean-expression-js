var assert = require('assert'), // expresso
    expressions = require('expressions'),
    parse = expressions.parse,
    evalTree = expressions.evalTree;

module.exports = {
    'test evalTree simplest': function(){
        assert.equal(evalTree(parse("foo"), "foo"), true);
    },
    'test evalTree simple dis': function(){
        var parsed = parse("foo OR bar");
        assert.equal(evalTree(parsed, "foo"), true);
        assert.equal(evalTree(parsed, "bar"), true);
        assert.equal(evalTree(parsed, "baz"), false);
    },
    'test evalTree simple dis lower': function(){
        var parsed = parse("foo or bar");
        assert.equal(evalTree(parsed, "foo bar"), true);
        assert.equal(evalTree(parsed, "foo"), true);
        assert.equal(evalTree(parsed, "bar"), true);
        assert.equal(evalTree(parsed, "baz"), false);
    },
    'test evalTree simple con': function(){
        var parsed = parse("foo AND bar");
        assert.equal(evalTree(parsed, "foo bar"), true);
        assert.equal(evalTree(parsed, "bar foo"), true);
        assert.equal(evalTree(parsed, "bar"), false);
        assert.equal(evalTree(parsed, "foo"), false);
        assert.equal(evalTree(parsed, "baz"), false);
        assert.equal(evalTree(parsed, "foo baz"), false);
        assert.equal(evalTree(parsed, "foo baz bar"), true);
        assert.equal(evalTree(parsed, "bar baz foo"), true);
    },
    'test evalTree simple con lower': function(){
        var parsed = parse("foo and bar");
        assert.equal(evalTree(parsed, "foo bar"), true);
        assert.equal(evalTree(parsed, "bar foo"), true);
        assert.equal(evalTree(parsed, "bar"), false);
        assert.equal(evalTree(parsed, "foo"), false);
        assert.equal(evalTree(parsed, "baz"), false);
        assert.equal(evalTree(parsed, "foo baz"), false);
        assert.equal(evalTree(parsed, "foo baz bar"), true);
        assert.equal(evalTree(parsed, "bar baz foo"), true);
    },
    'test evalTree parens dis': function(){
        var parsed = parse("(foo OR bar)");
        assert.equal(evalTree(parsed, "foo bar"), true);
        assert.equal(evalTree(parsed, "foo"), true);
        assert.equal(evalTree(parsed, "bar"), true);
        assert.equal(evalTree(parsed, "baz"), false);
    },
    'test evalTree parens con': function(){
        var parsed = parse("(foo and bar)");
        assert.equal(evalTree(parsed, "foo bar"), true);
        assert.equal(evalTree(parsed, "bar foo"), true);
        assert.equal(evalTree(parsed, "bar"), false);
        assert.equal(evalTree(parsed, "foo"), false);
        assert.equal(evalTree(parsed, "baz"), false);
        assert.equal(evalTree(parsed, "foo baz"), false);
        assert.equal(evalTree(parsed, "foo baz bar"), true);
        assert.equal(evalTree(parsed, "bar baz foo"), true);
    },
    'test evalTree complex parens': function(){
        var parsed = parse("(foo OR bar) AND baz");
        assert.equal(evalTree(parsed, "foo baz"), true);
        assert.equal(evalTree(parsed, "bar baz"), true);
        assert.equal(evalTree(parsed, "baz bar"), true);
        assert.equal(evalTree(parsed, "baz foo"), true);
        assert.equal(evalTree(parsed, "foo bar baz"), true);
        assert.equal(evalTree(parsed, "foo baz bar"), true);
        assert.equal(evalTree(parsed, "bar baz foo"), true);
        assert.equal(evalTree(parsed, "bar foo baz"), true);
        assert.equal(evalTree(parsed, "baz bar foo"), true);
        assert.equal(evalTree(parsed, "baz foo bar"), true);
        assert.equal(evalTree(parsed, "baz"), false);
        assert.equal(evalTree(parsed, "foo"), false);
        assert.equal(evalTree(parsed, "bar"), false);
        assert.equal(evalTree(parsed, "bar foo"), false);
        assert.equal(evalTree(parsed, "foo bar"), false);
    },
    'test evalTree complex prec': function(){
        var parsed = parse("foo OR bar AND baz");
        assert.equal(evalTree(parsed, "bar baz"), true);
        assert.equal(evalTree(parsed, "foo"), true);
        assert.equal(evalTree(parsed, "foo bar"), true);
        assert.equal(evalTree(parsed, "foo baz"), true);
        assert.equal(evalTree(parsed, "baz"), false);
        assert.equal(evalTree(parsed, "bar"), false);
    },
    'test evalTree complex prec2': function(){
        var parsed = parse("bar AND baz OR foo");
        assert.equal(evalTree(parsed, "bar baz"), true);
        assert.equal(evalTree(parsed, "foo"), true);
        assert.equal(evalTree(parsed, "foo bar"), true);
        assert.equal(evalTree(parsed, "foo baz"), true);
        assert.equal(evalTree(parsed, "baz"), false);
        assert.equal(evalTree(parsed, "bar"), false);
    },
    'test evalTree complex nested': function(){
        var parsed = parse("(foo OR (bar AND baz))");
        assert.equal(evalTree(parsed, "bar baz"), true);
        assert.equal(evalTree(parsed, "foo"), true);
        assert.equal(evalTree(parsed, "foo bar"), true);
        assert.equal(evalTree(parsed, "foo baz"), true);
        assert.equal(evalTree(parsed, "baz"), false);
        assert.equal(evalTree(parsed, "bar"), false);
    },
    'test evalTree complex nested2': function(){
        var parsed = parse("(bar AND baz) OR (spam AND ham)");
        assert.equal(evalTree(parsed, "bar"), false);
        assert.equal(evalTree(parsed, "baz"), false);
        assert.equal(evalTree(parsed, "spam"), false);
        assert.equal(evalTree(parsed, "ham"), false);
        assert.equal(evalTree(parsed, "bar baz"), true);
        assert.equal(evalTree(parsed, "baz bar"), true);
        assert.equal(evalTree(parsed, "spam ham"), true);
        assert.equal(evalTree(parsed, "ham spam"), true);
        assert.equal(evalTree(parsed, "bar spam"), false);
        assert.equal(evalTree(parsed, "baz ham"), false);
        assert.equal(evalTree(parsed, "bar ham"), false);
        assert.equal(evalTree(parsed, "baz spam"), false);
    },
    'test evalTree complex nested3': function(){
        var parsed = parse("(bar AND baz) OR (spam AND ham AND eggs)");
        assert.equal(evalTree(parsed, "bar"), false);
        assert.equal(evalTree(parsed, "baz"), false);
        assert.equal(evalTree(parsed, "spam"), false);
        assert.equal(evalTree(parsed, "ham"), false);
        assert.equal(evalTree(parsed, "eggs"), false);
        assert.equal(evalTree(parsed, "bar baz"), true);
        assert.equal(evalTree(parsed, "baz bar"), true);
        assert.equal(evalTree(parsed, "spam ham"), false);
        assert.equal(evalTree(parsed, "ham spam"), false);
        assert.equal(evalTree(parsed, "ham eggs"), false);
        assert.equal(evalTree(parsed, "spam eggs"), false);
        assert.equal(evalTree(parsed, "spam ham eggs"), true);
        assert.equal(evalTree(parsed, "ham spam eggs"), true);
        assert.equal(evalTree(parsed, "spam eggs ham"), true);
        assert.equal(evalTree(parsed, "ham eggs spam"), true);
        assert.equal(evalTree(parsed, "eggs spam ham"), true);
        assert.equal(evalTree(parsed, "eggs ham spam"), true);
        assert.equal(evalTree(parsed, "baz ham"), false);
        assert.equal(evalTree(parsed, "baz eggs"), false);
        assert.equal(evalTree(parsed, "baz spam"), false);
        assert.equal(evalTree(parsed, "bar ham"), false);
        assert.equal(evalTree(parsed, "bar eggs"), false);
        assert.equal(evalTree(parsed, "bar spam"), false);
    },
    'test evalTree complex nested4': function(){
        var parsed = parse("(foo OR (bar AND baz) OR (spam AND ham AND eggs))");
        assert.equal(evalTree(parsed, "foo"), true);
        assert.equal(evalTree(parsed, "bar"), false);
        assert.equal(evalTree(parsed, "baz"), false);
        assert.equal(evalTree(parsed, "spam"), false);
        assert.equal(evalTree(parsed, "ham"), false);
        assert.equal(evalTree(parsed, "eggs"), false);
        assert.equal(evalTree(parsed, "bar baz"), true);
        assert.equal(evalTree(parsed, "baz bar"), true);
        assert.equal(evalTree(parsed, "spam ham"), false);
        assert.equal(evalTree(parsed, "ham spam"), false);
        assert.equal(evalTree(parsed, "ham eggs"), false);
        assert.equal(evalTree(parsed, "spam eggs"), false);
        assert.equal(evalTree(parsed, "spam ham eggs"), true);
        assert.equal(evalTree(parsed, "ham spam eggs"), true);
        assert.equal(evalTree(parsed, "spam eggs ham"), true);
        assert.equal(evalTree(parsed, "ham eggs spam"), true);
        assert.equal(evalTree(parsed, "eggs spam ham"), true);
        assert.equal(evalTree(parsed, "eggs ham spam"), true);
        assert.equal(evalTree(parsed, "baz ham"), false);
        assert.equal(evalTree(parsed, "baz eggs"), false);
        assert.equal(evalTree(parsed, "baz spam"), false);
        assert.equal(evalTree(parsed, "bar ham"), false);
        assert.equal(evalTree(parsed, "bar eggs"), false);
        assert.equal(evalTree(parsed, "bar spam"), false);
    }
};
