testing.configureMocha = function() {
   mocha.globals(['doT', 'encodeHTML', 'wrapUndefined', 'encodeEval', 'def']);
   mocha.checkLeaks();
};
