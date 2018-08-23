define('Controls-demo/ServiceUpdateNotifierTest/ServiceUpdateNotifierTest', [
      'Core/Control',
      'tmpl!Controls-demo/ServiceUpdateNotifierTest/ServiceUpdateNotifierTest',
      'Lib/ServerEvent/Bus',
      'Core/EventBus'
   ],
   function (Control, template, SEBus, EB) {

      var module = Control.extend({
         _template: template,
         checkVersion: function () {
            SEBus.serverChannel('versionmanager.updatestaticcomplete').notify('onMessage', {
               distr: 'specifications', //specifications, inside, cloud-ctrl
               product: 'inside', // cloud-ctrl, inside
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