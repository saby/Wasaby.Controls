define('Controls-demo/ServiceUpdateNotifierTest/ServiceUpdateNotifierTest', [
      'Core/Control',
      'tmpl!Controls-demo/ServiceUpdateNotifierTest/ServiceUpdateNotifierTest',
      'Lib/ServerEvent/Bus',
      'Core/EventBus'
   ],
   function (Control, template, SEBus, EB) {
      window.product = 'inside';

      var module = Control.extend({
         _template: template,
         checkVersion: function () {
            SEBus.serverChannel('versionmanager.updatestaticcomplete').notify('onMessage', {
               distr: 'inside',
               product: 'inside',
               get: function (name) {
                  return (name === 'Distribution') ? this.distr : this.product;
               }
            });
         },
         wakeUp: function () {
            EB.globalChannel().notify('onwakeup');
         },
      });
      return module;
   });