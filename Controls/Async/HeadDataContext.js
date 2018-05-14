define('Controls/Async/HeadDataContext', [
   'Core/DataContext',
   'Core/Deferred',
   'Core/IoC'
], function (DataContext, Deferred, IoC) {

   function waitAsync(def) {
      var self = this;
      setTimeout(function waitAsyncCallback() {
         if (self.hasAsync()) {
            waitAsync.call(self, def);
         } else {
            def.callback({
               jsLinks: self.jsLinks,
               cssLinks: self.cssLinks
            });
         }
      }, 0);
   }

   return DataContext.extend({
      push: function (def) {
         var self = this;
         if (!(def instanceof Deferred)) {
            IoC.resolve('ILogger').error('Should be instance of Deferred');
         }
         this.data.push(def);
         def.addCallback(function (res) {
            if (res.jsLinks) {
               for (var i = 0; i < res.jsLinks.length; i++) {
                  if (!~self.jsLinks.indexOf(res.jsLinks[i])) {
                     self.jsLinks.push(res.jsLinks[i]);
                  }
               }
            }
            if (res.cssLinks) {
               for (var i = 0; i < res.cssLinks.length; i++) {
                  if (!~self.cssLinks.indexOf(res.cssLinks[i])) {
                     self.cssLinks.push(res.cssLinks[i]);
                  }
               }
            }
            self.remove(def);
            return res;
         });
         this.defCount++;
      },
      hasAsync: function () {
         return this.defCount > 0;
      },
      remove: function (def) {
         var dataArray = this.data;
         dataArray.splice(dataArray.indexOf(def, 1));
         this.defCount--;
      },
      constructor: function (cfg) {
         this.data = [];
         this.cssLinks = [];
         this.jsLinks = [];
         this.defCount = 0;
      },
      waitForAllAsync: function () {
         var def = new Deferred();
         waitAsync.call(this, def);
         return def;
      }
   });
});
