define([
   'Controls/Application/DepsCollector/DepsCollector'
], function(DepsCollector) {
   var modDeps = {
      "aaa/aaa": [],
      "css!aaa/bbb": [],
      "css!themed?aaat/bbbt": [],
      "tmpl!aaa/ccc": [],
      "css!aaa/ddd": [],
      "css!theme?aaat/dddt": [],
      "ccc/aaa": ["ccc/ccc", "css"],
      "ccc/ccc": ["ddd/aaa"],
      "js/tmplDep": ["tmpl!tmplDep"],
      "css": [],
      "ccc/bbb": [],
      "xxx/aaa": [],
      "tmpl!xxx/aaa": []
   };
   var modInfo = {
      "css!aaa/ddd": {path: "resources/aaa/ddd.min.css"},
      "xxx/aaa": {path: "resources/xxx/aaa.min.js"},
      "tmpl!xxx/aaa": {path: "resources/xxx/aaa.min.tmpl"}
   };
   var bundlesRoute = {
      "aaa/aaa": "resources/bdl/aaa.package.min.js",
      "css!aaa/bbb": "resources/bdl/aaa.package.min.css",
      "css!theme?aaat/bbbt": "resources/bdl/aaat.package.min.css",
      "tmpl!aaa/ccc": "resources/bdl/bbb.package.min.js",
      "vvv/aaa": "resources/bdl/ccc.package.min.js",
      "vvv/bbb": "resources/bdl/ccc.package.min.js",
      "ccc/aaa": "resources/bdl/ddd.package.min.js",
      "ccc/ccc": "resources/bdl/eee.package.min.js",
      "js/tmplDep": "resources/jstmplbdl/tmpldep.package.min.js",
      "css": "resources/bdl/ggg.package.min.js",
      "ddd/aaa": "resources/bdl/hhh.package.min.js",
      "xxx/aaa": "resources/bdl/jjj.package.min.js",
      "tmpl!ppp/ppp": "resources/bdl/tmplpckd.package.min.js"
   }
   var depsCollectorWithThemes = new DepsCollector(modDeps, modInfo, bundlesRoute, true);
   describe('DepsCollector', function() {
      it('single in bundle', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["aaa/aaa"]);
         assert.deepEqual(deps.js, ["bdl/aaa.package"]);
      });
      it('several in bundle', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["vvv/aaa", "vvv/bbb"]);
         assert.deepEqual(deps.js, ["bdl/ccc.package"]);
      });
      it('css-bundle hook js simple', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["css!aaa/bbb"]);
         assert.deepEqual(deps.js, ["bdl/aaa.package"]);
         assert.deepEqual(deps.css.simpleCss, ["bdl/aaa.package"]);
      });
      it('css-bundle hook js themed', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["css!theme?aaat/bbbt"]);
         assert.deepEqual(deps.js, ["bdl/aaat.package"]);
         assert.deepEqual(deps.css.themedCss, ["bdl/aaat.package"]);
      });
      it('single css not hooks js simple', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["css!aaa/ddd"]);
         assert.deepEqual(deps.css.simpleCss, ["aaa/ddd"]);
         assert.deepEqual(deps.js, []);
      });
      it('single css not hooks js themed', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["css!theme?aaa/ddd"]);
         assert.deepEqual(deps.css.themedCss, ["aaa/ddd"]);
         assert.deepEqual(deps.js, []);
      });
      it('recursive', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["ccc/aaa"]);
         assert.deepEqual(deps.js, ["bdl/ddd.package",
            "bdl/eee.package",
            "bdl/hhh.package",
            "bdl/ggg.package"]);
      });
      it('optional pre-load', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["optional!xxx/aaa"]);
         assert.deepEqual(deps.js, ["bdl/jjj.package"]);
      });
      it('optional no pre-load', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["optional!ccc/bbb"]);
         assert.deepEqual(deps.js, []);
      });
      it('ext tmpl', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["tmpl!xxx/aaa"]);
         assert.deepEqual(deps.tmpl, ["xxx/aaa"]);
      });
      it('tmpl packed in parent js', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["js/tmplDep"]);
         assert.deepEqual(deps.js, ["jstmplbdl/tmpldep.package"]);
         assert.deepEqual(deps.tmpl, []);
      });
      it('custom extension in bundlesRoute', function() {
         var deps = depsCollectorWithThemes.collectDependencies(["tmpl!ppp/ppp"]);
         assert.deepEqual(deps.js, ["bdl/tmplpckd.package"]);
         assert.deepEqual(deps.tmpl, []);
      });
   });
});
