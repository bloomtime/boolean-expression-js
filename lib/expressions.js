var ReParse = require('reparse').ReParse;

function parse(query) {
  return (new ReParse(query, true)).start(expr);
}

function expr() {
  return this.chainl1(term, disjunction);
}

function term() {
  return this.chainl1(notFactor, conjunction);
}

function notFactor() {
  return this.choice(negation, factor);
}

function factor() {
  return this.choice(group, phrase, word);
}

function group() {
  return this.between(/^\(/, /^\)/, expr);
}

function phrase() {
  return this.between(/^\"/, /^\"/, words);
}

function words() {
  return this.many1(word).join(' ');
}

function word() {
  return this.match(/^[#@_\-'&!\w\dàèìòùáéíóúäëïöüâêîôûçßåøñœæ]+/i).toString();
}

function notop() {
  return this.match(/^NOT/i).toUpperCase();
}

function negation() {
  return this.seq(notop, notFactor).slice(1);
}

function conjunction() {
  return OPTREES[this.match(/^AND/i).toUpperCase()];
}

function disjunction() {
  return OPTREES[this.match(/^OR/i).toUpperCase()];
}

var OPTREES = {
  'AND': function(a,b) { return [ 'AND', a, b ] },
  'OR': function(a,b) { return [ 'OR', a, b ] }
};

function evalTree(tree, text) {
  if (!Array.isArray(tree)) {
    return text.toLowerCase().indexOf(tree.toLowerCase()) >= 0;
  }
  var op = tree[0];
  if (op == 'OR') {
    return evalTree(tree[1], text) || evalTree(tree[2], text);
  }
  else if (op == 'AND') {
      return evalTree(tree[1], text) && evalTree(tree[2], text);
  }
  else if (op == 'NOT') {
      return !evalTree(tree[1], text);
  }
  return false;  
}

module.exports = {
  parse: parse,
  evalTree: evalTree
};


