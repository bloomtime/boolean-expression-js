Uses https://github.com/weaver/ReParse

Compiles and evaluates simple boolean search expressions, e.g.

```javascript
var parsed = new Expression("John AND Paul AND Ringo AND George");
assert.equal(parsed.test("John"), false);
assert.equal(parsed.test("Paul"), false);
assert.equal(parsed.test("Ringo"), false);
assert.equal(parsed.test("George"), false);
assert.equal(parsed.test("John Paul George Ringo"), true);
assert.equal(parsed.test("Ringo George Paul John"), true);
```

Supports parens for disambiguation. Supports AND, OR and NOT. Supports quotes for phrases. Case insensitive.

See tests for more examples.

TODO:

* allow domain names and other punctuation in terms
* flatten quoted terms
* more Googley searching (implied AND, negation with -, etc.)

