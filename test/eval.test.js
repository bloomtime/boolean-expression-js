var assert = require('assert'), // expresso
    Expression = require('../expression');

module.exports = {
    'test evalTree simplest': function(){
        assert.equal(new Expression("foo").test("foo"), true);
        assert.equal(new Expression("foo").test("bar"), false);
    },
    'test evalTree simplest not': function(){
        assert.equal(new Expression("not foo").test("foo"), false);
        assert.equal(new Expression("not foo").test("bar"), true);
    },
    'test evalTree simplest not not': function(){
        assert.equal(new Expression("not not foo").test("foo"), true);
        assert.equal(new Expression("not not foo").test("bar"), false);
    },
    'test evalTree not phrase': function(){
        assert.equal(new Expression("\"not bar\"").test("not bar"), true);
        assert.equal(new Expression("\"not bar\"").test("baz not bar"), true);
        assert.equal(new Expression("\"not bar\"").test("not bar baz"), true);
    },
    'test evalTree not not phrase': function(){
        assert.equal(new Expression("not \"not bar\"").test("not bar"), false);
        assert.equal(new Expression("not \"not bar\"").test("baz not bar"), false);
        assert.equal(new Expression("not \"not bar\"").test("not bar baz"), false);
    },
    'test evalTree phrase': function(){
        assert.equal(new Expression("\"foo bar\"").test("foo bar"), true);
        assert.equal(new Expression("\"foo bar\"").test("baz foo bar"), true);
        assert.equal(new Expression("\"foo bar\"").test("foo bar baz"), true);
    },
    'test evalTree simple dis': function(){
        var parsed = new Expression("foo OR bar");
        assert.equal(parsed.test("foo"), true);
        assert.equal(parsed.test("bar"), true);
        assert.equal(parsed.test("baz"), false);
    },
    'test evalTree simple dis lower': function(){
        var parsed = new Expression("foo or bar");
        assert.equal(parsed.test("foo bar"), true);
        assert.equal(parsed.test("foo"), true);
        assert.equal(parsed.test("bar"), true);
        assert.equal(parsed.test("baz"), false);
    },
    'test evalTree simple con': function(){
        var parsed = new Expression("foo AND bar");
        assert.equal(parsed.test("foo bar"), true);
        assert.equal(parsed.test("bar foo"), true);
        assert.equal(parsed.test("bar"), false);
        assert.equal(parsed.test("foo"), false);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("foo baz"), false);
        assert.equal(parsed.test("foo baz bar"), true);
        assert.equal(parsed.test("bar baz foo"), true);
    },
    'test evalTree simple con lower': function(){
        var parsed = new Expression("foo and bar");
        assert.equal(parsed.test("foo bar"), true);
        assert.equal(parsed.test("bar foo"), true);
        assert.equal(parsed.test("bar"), false);
        assert.equal(parsed.test("foo"), false);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("foo baz"), false);
        assert.equal(parsed.test("foo baz bar"), true);
        assert.equal(parsed.test("bar baz foo"), true);
    },
    'test evalTree parens dis': function(){
        var parsed = new Expression("(foo OR bar)");
        assert.equal(parsed.test("foo bar"), true);
        assert.equal(parsed.test("foo"), true);
        assert.equal(parsed.test("bar"), true);
        assert.equal(parsed.test("baz"), false);
    },
    'test evalTree parens con': function(){
        var parsed = new Expression("(foo and bar)");
        assert.equal(parsed.test("foo bar"), true);
        assert.equal(parsed.test("bar foo"), true);
        assert.equal(parsed.test("bar"), false);
        assert.equal(parsed.test("foo"), false);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("foo baz"), false);
        assert.equal(parsed.test("foo baz bar"), true);
        assert.equal(parsed.test("bar baz foo"), true);
    },
    'test evalTree complex parens': function(){
        var parsed = new Expression("(foo OR bar) AND baz");
        assert.equal(parsed.test("foo baz"), true);
        assert.equal(parsed.test("bar baz"), true);
        assert.equal(parsed.test("baz bar"), true);
        assert.equal(parsed.test("baz foo"), true);
        assert.equal(parsed.test("foo bar baz"), true);
        assert.equal(parsed.test("foo baz bar"), true);
        assert.equal(parsed.test("bar baz foo"), true);
        assert.equal(parsed.test("bar foo baz"), true);
        assert.equal(parsed.test("baz bar foo"), true);
        assert.equal(parsed.test("baz foo bar"), true);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("foo"), false);
        assert.equal(parsed.test("bar"), false);
        assert.equal(parsed.test("bar foo"), false);
        assert.equal(parsed.test("foo bar"), false);
    },
    'test evalTree complex prec': function(){
        var parsed = new Expression("foo OR bar AND baz");
        assert.equal(parsed.test("bar baz"), true);
        assert.equal(parsed.test("foo"), true);
        assert.equal(parsed.test("foo bar"), true);
        assert.equal(parsed.test("foo baz"), true);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("bar"), false);
    },
    'test evalTree complex prec2': function(){
        var parsed = new Expression("bar AND baz OR foo");
        assert.equal(parsed.test("bar baz"), true);
        assert.equal(parsed.test("foo"), true);
        assert.equal(parsed.test("foo bar"), true);
        assert.equal(parsed.test("foo baz"), true);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("bar"), false);
    },
    'test evalTree prec3': function() {
        var parsed = new Expression("not foo or bar");
        var parsed2 = new Expression("(not foo) or bar");
        assert.deepEqual(parsed.tree, parsed2.tree);
        assert.equal(parsed.test("foo"), false);
        assert.equal(parsed.test("bar"), true);
        assert.equal(parsed.test("baz"), true);
    },
    'test evalTree complex nested': function(){
        var parsed = new Expression("(foo OR (bar AND baz))");
        assert.equal(parsed.test("bar baz"), true);
        assert.equal(parsed.test("foo"), true);
        assert.equal(parsed.test("foo bar"), true);
        assert.equal(parsed.test("foo baz"), true);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("bar"), false);
    },
    'test evalTree complex nested2': function(){
        var parsed = new Expression("(bar AND baz) OR (spam AND ham)");
        assert.equal(parsed.test("bar"), false);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("spam"), false);
        assert.equal(parsed.test("ham"), false);
        assert.equal(parsed.test("bar baz"), true);
        assert.equal(parsed.test("baz bar"), true);
        assert.equal(parsed.test("spam ham"), true);
        assert.equal(parsed.test("ham spam"), true);
        assert.equal(parsed.test("bar spam"), false);
        assert.equal(parsed.test("baz ham"), false);
        assert.equal(parsed.test("bar ham"), false);
        assert.equal(parsed.test("baz spam"), false);
    },
    'test evalTree complex nested3 not': function(){
        var parsed = new Expression("(bar AND NOT baz) OR (spam AND ham AND eggs)");
        assert.equal(parsed.test("bar"), true);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("spam"), false);
        assert.equal(parsed.test("ham"), false);
        assert.equal(parsed.test("eggs"), false);
        assert.equal(parsed.test("bar baz"), false);
        assert.equal(parsed.test("baz bar"), false);
        assert.equal(parsed.test("spam ham"), false);
        assert.equal(parsed.test("ham spam"), false);
        assert.equal(parsed.test("ham eggs"), false);
        assert.equal(parsed.test("spam eggs"), false);
        assert.equal(parsed.test("spam ham eggs"), true);
        assert.equal(parsed.test("ham spam eggs"), true);
        assert.equal(parsed.test("spam eggs ham"), true);
        assert.equal(parsed.test("ham eggs spam"), true);
        assert.equal(parsed.test("eggs spam ham"), true);
        assert.equal(parsed.test("eggs ham spam"), true);
        assert.equal(parsed.test("baz ham"), false);
        assert.equal(parsed.test("baz eggs"), false);
        assert.equal(parsed.test("baz spam"), false);
        assert.equal(parsed.test("bar ham"), true);
        assert.equal(parsed.test("bar eggs"), true);
        assert.equal(parsed.test("bar spam"), true);
    },
    'test evalTree complex nested3': function(){
        var parsed = new Expression("(bar AND baz) OR (spam AND ham AND eggs)");
        assert.equal(parsed.test("bar"), false);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("spam"), false);
        assert.equal(parsed.test("ham"), false);
        assert.equal(parsed.test("eggs"), false);
        assert.equal(parsed.test("bar baz"), true);
        assert.equal(parsed.test("baz bar"), true);
        assert.equal(parsed.test("spam ham"), false);
        assert.equal(parsed.test("ham spam"), false);
        assert.equal(parsed.test("ham eggs"), false);
        assert.equal(parsed.test("spam eggs"), false);
        assert.equal(parsed.test("spam ham eggs"), true);
        assert.equal(parsed.test("ham spam eggs"), true);
        assert.equal(parsed.test("spam eggs ham"), true);
        assert.equal(parsed.test("ham eggs spam"), true);
        assert.equal(parsed.test("eggs spam ham"), true);
        assert.equal(parsed.test("eggs ham spam"), true);
        assert.equal(parsed.test("baz ham"), false);
        assert.equal(parsed.test("baz eggs"), false);
        assert.equal(parsed.test("baz spam"), false);
        assert.equal(parsed.test("bar ham"), false);
        assert.equal(parsed.test("bar eggs"), false);
        assert.equal(parsed.test("bar spam"), false);
    },
    'test evalTree complex nested4 not': function(){
        var parsed = new Expression("not (foo OR (bar AND baz) OR (spam AND ham AND eggs))");
        assert.equal(parsed.test("foo"), false);
        assert.equal(parsed.test("bar"), true);
        assert.equal(parsed.test("baz"), true);
        assert.equal(parsed.test("spam"), true);
        assert.equal(parsed.test("ham"), true);
        assert.equal(parsed.test("eggs"), true);
        assert.equal(parsed.test("bar baz"), false);
        assert.equal(parsed.test("baz bar"), false);
        assert.equal(parsed.test("spam ham"), true);
        assert.equal(parsed.test("ham spam"), true);
        assert.equal(parsed.test("ham eggs"), true);
        assert.equal(parsed.test("spam eggs"), true);
        assert.equal(parsed.test("spam ham eggs"), false);
        assert.equal(parsed.test("ham spam eggs"), false);
        assert.equal(parsed.test("spam eggs ham"), false);
        assert.equal(parsed.test("ham eggs spam"), false);
        assert.equal(parsed.test("eggs spam ham"), false);
        assert.equal(parsed.test("eggs ham spam"), false);
        assert.equal(parsed.test("baz ham"), true);
        assert.equal(parsed.test("baz eggs"), true);
        assert.equal(parsed.test("baz spam"), true);
        assert.equal(parsed.test("bar ham"), true);
        assert.equal(parsed.test("bar eggs"), true);
        assert.equal(parsed.test("bar spam"), true);
    },
    'test evalTree complex nested4': function(){
        var parsed = new Expression("(foo OR (bar AND baz) OR (spam AND ham AND eggs))");
        assert.equal(parsed.test("foo"), true);
        assert.equal(parsed.test("bar"), false);
        assert.equal(parsed.test("baz"), false);
        assert.equal(parsed.test("spam"), false);
        assert.equal(parsed.test("ham"), false);
        assert.equal(parsed.test("eggs"), false);
        assert.equal(parsed.test("bar baz"), true);
        assert.equal(parsed.test("baz bar"), true);
        assert.equal(parsed.test("spam ham"), false);
        assert.equal(parsed.test("ham spam"), false);
        assert.equal(parsed.test("ham eggs"), false);
        assert.equal(parsed.test("spam eggs"), false);
        assert.equal(parsed.test("spam ham eggs"), true);
        assert.equal(parsed.test("ham spam eggs"), true);
        assert.equal(parsed.test("spam eggs ham"), true);
        assert.equal(parsed.test("ham eggs spam"), true);
        assert.equal(parsed.test("eggs spam ham"), true);
        assert.equal(parsed.test("eggs ham spam"), true);
        assert.equal(parsed.test("baz ham"), false);
        assert.equal(parsed.test("baz eggs"), false);
        assert.equal(parsed.test("baz spam"), false);
        assert.equal(parsed.test("bar ham"), false);
        assert.equal(parsed.test("bar eggs"), false);
        assert.equal(parsed.test("bar spam"), false);
    }
};
