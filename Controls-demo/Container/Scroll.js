define('Controls-demo/Container/Scroll',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'tmpl!Controls-demo/Container/Scroll'
   ],
   function(Control, MemorySource, template) {
      return Control.extend({
         _template: template,

         _beforeMount: function() {
            var srcData = [];

            for (var id = 1; id < 100; id++) {
               srcData.push({
                  id: id,
                  title: 'Запись ' + id
               });
            }
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: srcData
            });
         }
      });
   }
);