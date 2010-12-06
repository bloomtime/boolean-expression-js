var ReParse = require('reparse').ReParse;

function parse(query) {
  return (new ReParse(query, true)).start(expr);
}

function expr() {
  console.log('expr', JSON.stringify(this));
  return this.chainl1(term, disjunction);
}

function term() {
  console.log('term', JSON.stringify(this));
  return this.chainl1(/*notFactor*/ factor, conjunction);
}
/*
function notFactor() {
  console.log('notFactor', JSON.stringify(this));
  return this.option(negation, factor);
}*/

function factor() {
  console.log('factor', JSON.stringify(this));
  return this.choice(group, /*phrase,*/ word);
}

function group() {
  console.log('group', JSON.stringify(this));
  return this.between(/^\(/, /^\)/, expr);
}

/*function phrase() {
  return this.between(/^\"/, /^\"/, words);
}

function words() {
  return this.many1(word).join(' ');
} */

function word() {
  console.log('word', JSON.stringify(this));
  return this.match(/^[#@_\-'&!\w\dàèìòùáéíóúäëïöüâêîôûçßåøñœæ]+/i).toString();
}
/*
function notop() {
  console.log('notop', JSON.stringify(this));
  return this.match(/^NOT/i);
}

function negation() {
  console.log('negation', JSON.stringify(this));
  return this.seq(notop, expr).slice(1);
}*/

function conjunction() {
  console.log('conjunction', JSON.stringify(this));
  return OPTREES[this.match(/^AND/i).toUpperCase()];
}

function disjunction() {
  console.log('disjunction', JSON.stringify(this));
  return OPTREES[this.match(/^OR/i).toUpperCase()];
}

var OPTREES = {
  'AND': function(a,b) { /*console.log('and', JSON.stringify(this));*/ return [ 'AND', a, b ] },
  'OR': function(a,b) { /*console.log('or', JSON.stringify(this));*/ return [ 'OR', a, b ] }
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
  return false;  
}

module.exports = {
  parse: parse,
  evalTree: evalTree
};


