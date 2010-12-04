var ReParse = require('reparse').ReParse;

var filters = [
  {
    name: "The Hills",
    query: "(((#thehills OR thehills) OR ((hills AND the) AND mtv)) OR (@MTV_TheHills OR MTV_TheHills))"
  },
  {
    name: "The Hills Finale",
    query: "(finale AND (((#thehills OR thehills) OR ((hills AND the) AND mtv)) OR (@MTV_TheHills OR MTV_TheHills)))"
  },
  {
    name: "Goodbye Hills",
    query: "(#goodbyehills OR goodbyehills)"
  },
  {
    name: "Lauren Conrad",
    query: "(((#laurenconrad OR laurenconrad) OR @laurenconrad) OR (conrad AND lauren))"
  },
  {
    name: "Heidi Montag",
    query: "(((#heidimontag OR heidimontag) OR @heidimontag) OR (heidi AND montag))"
  },
  {
    name: "Spencer Pratt",
    query: "(((#spencerpratt OR spencerpratt) OR @spencerpratt) OR (pratt AND spencer))"
  },
  {
    name: "Kristin Cavallari",
    query: "((((#kristincavallari OR kristincavallari) OR @kristincav) OR kristincav) OR (cavallari AND kristin))"
  },
  {
    name: "Audrina Patridge",
    query: "((((#audrinapatridge OR audrinapatridge) OR @officialaudrina) OR officialaudrina) OR (audrina AND patridge))"
  },
  {
    name: "Brody Jenner",
    query: "(((#brodyjenner OR brodyjenner) OR @brodyjenner) OR (brody AND jenner))"
  },
  {
    name: "Lo Bosworth",
    query: "(((#lobosworth OR lobosworth) OR @lobosworth) OR (bosworth AND lo))"
  },
  {
    name: "Stephanie Pratt",
    query: "(((#stephaniepratt OR stephaniepratt) OR @stephaniepratt) OR (pratt AND stephanie))"
  },
  {
    name: "Whitney Port",
    query: "(((#whitneyport OR whitneyport) OR (port AND whitney)) OR (@WhitneyEve AND WhitneyEve))"
  },
  {
    name: "Justin Bobby",
    query: "(((#justinbobby OR justinbobby) OR @justinbobby) OR (bobby AND justin))"
  },
  {
    name: "Frankie Delgado",
    query: "(((#frankiedelgado OR frankiedelgado) OR @frankiedelgado) OR (delgado AND frankie))"
  },
  {
    name: "Stacie Hall",
    query: "(((#staciehall OR staciehall) OR @staciehall) OR (hall AND stacie))"
  }, 
];

function parse(query) {
  return (new ReParse(query, true)).start(expr);
}

function expr() {
  return this.chainl1(term, disjunction);
}

function term() {
  return this.chainl1(factor, conjunction);
}

function factor() {
  return this.choice(group, /*phrase,*/ word);
}

function group() {
  return this.between(/^\(/, /^\)/, expr);
}

/*function phrase() {
  return this.between(/^\"/, /^\"/, words);
}

function words() {
  return this.many1(word).join(' ');
} */

function word() {
  return this.match(/^[#@_\w\d]+/).toString();
}

function conjunction() {
  return OPTREES[this.match(/^AND/)];
}

function disjunction() {
  return OPTREES[this.match(/^OR/)];
}

var OPTREES = {
  'AND': function(a,b) { return [ 'AND', a, b ] },
  'OR': function(a,b) { return [ 'OR', a, b ] }
};

function evalTree(tree, text) {
  if (!Array.isArray(tree)) {
    return text.toLowerCase().indexOf(tree.toLowerCase()) >= 0;
  }
  var op = tree.shift();
  switch(op) {
    case 'OR':
      return evalTree(tree[0], text) || evalTree(tree[1], text);
      break;
    case 'AND':
      return evalTree(tree[0], text) && evalTree(tree[1], text);
      break;
    default:
      return text.toLowerCase().indexOf(op.toLowerCase()) >= 0;
      break;
  }  
}

filters.forEach(function(filter) {
  filter.tree = parse(filter.query);
  console.log(filter.name);
  console.log(filter.query);
  console.log(filter.tree);
  console.log(evalTree(filter.tree, "#staciehall"))
});


