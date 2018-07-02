define([
   'Controls/Application/DepsCollector/DepsCollector'
], function(DepsCollector) {
   var modDeps = {
      "aaa/aaa": [],
      "css!aaa/bbb": [],
      "tmpl!aaa/ccc": [],
      "css!aaa/ddd": [],
      "ccc/aaa": ["ccc/ccc", "css"],
      "ccc/ccc": ["ddd/aaa"],
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
      "tmpl!aaa/ccc": "resources/bdl/bbb.package.min.js",
      "vvv/aaa": "resources/bdl/ccc.package.min.js",
      "vvv/bbb": "resources/bdl/ccc.package.min.js",
      "ccc/aaa": "resources/bdl/ddd.package.min.js",
      "ccc/ccc": "resources/bdl/eee.package.min.js",
      "css": "resources/bdl/ggg.package.min.js",
      "ddd/aaa": "resources/bdl/hhh.package.min.js",
      "xxx/aaa": "resources/bdl/jjj.package.min.js"
   }
   var depsCollector = new DepsCollector(modDeps, modInfo, bundlesRoute);
   describe('DepsCollector', function() {
      it('single in bundle', function() {
         var deps = depsCollector.collectDependencies(["aaa/aaa"]);
         assert.deepEqual(deps, {
            "js": ["/resources/bdl/aaa.package.min.js"],
            "css": []
         });
      });
      it('several in bundle', function() {
         var deps = depsCollector.collectDependencies(["vvv/aaa", "vvv/bbb"]);
         assert.deepEqual(deps, {"js": ["/resources/bdl/ccc.package.min.js"], "css": []});
      });
      it('css-bundle hook js', function() {
         var deps = depsCollector.collectDependencies(["css!aaa/bbb"]);
         assert.deepEqual(deps, {
            "js": ["/resources/bdl/aaa.package.min.js"],
            "css": ["/resources/bdl/aaa.package.min.css"]
         });
      });
      it('single css not hook js', function() {
         var deps = depsCollector.collectDependencies(["css!aaa/ddd"]);
         assert.deepEqual(deps, {"js": [], "css": ["/resources/aaa/ddd.min.css"]});
      });
      it('recursive', function() {
         var deps = depsCollector.collectDependencies(["ccc/aaa"]);
         assert.deepEqual(deps, {
            "js": ["/resources/bdl/ddd.package.min.js",
               "/resources/bdl/eee.package.min.js",
               "/resources/bdl/hhh.package.min.js",
               "/resources/bdl/ggg.package.min.js"],
            "css": []
         });
      });
      it('optional pre-load', function() {
         var deps = depsCollector.collectDependencies(["optional!xxx/aaa"]);
         assert.deepEqual(deps, {
            "js": ["/resources/bdl/jjj.package.min.js"],
            "css": []
         });
      });
      it('optional no pre-load', function() {
         var deps = depsCollector.collectDependencies(["optional!ccc/bbb"]);
         assert.deepEqual(deps, {
            "js": [],
            "css": []
         });
      });
      it('tmpl', function() {
         var deps = depsCollector.collectDependencies(["tmpl!xxx/aaa"]);
         assert.deepEqual(deps, {
            "js": ["/resources/xxx/aaa.min.tmpl"],
            "css": []
         });
      })
   });
});
