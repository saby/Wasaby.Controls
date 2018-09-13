testing.configure = function() {
   mocha.globals([
      'doT',
      'encodeHTML',
      'wrapUndefined',
      'encodeEval',
      'def',
      'isPlainObject',//global.isPlainObject in Core/nativeExtensions/Object
      'isPlainArray'//global.isPlainArray in Core/nativeExtensions/Array
   ]);
   mocha.checkLeaks();
};
