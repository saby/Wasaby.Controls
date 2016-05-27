var test = new function test() {
   var logger = new function(){
         var display,
            getDisplay = function() {
               if (!display) {
                  display = document.createElement('pre');
                  var body = document.querySelector('body');
                  body.appendChild(display);

                  display.log = function(message) {
                     this.appendChild(document.createTextNode(message + '\n'));
                  };
               }
               return display;
            };

         this.log = function(message) {
            getDisplay().log(message);
         };
      },
      counters = {};

   return {
      createData: (function() {
         var recordsCount = 100000,
            fieldsCount = 25;

         return function() {
            var items = [],
               item,
               i,
               j;
            for (i = 0; i < recordsCount; i++) {
               item = {};
               for (j = 0; j < fieldsCount; j++) {
                  item['field' + j] = i +':' + j;
               }
               items.push(item);
            }
            return items;
         };
      })(),

      log: function(message) {
         logger.log(message);
      },

      startCounter: function(tag) {
         counters[tag] = Date.now();
      },

      finishCounter: function(tag) {
         counters[tag] = Date.now() - counters[tag];
         logger.log(tag + ': ' + counters[tag] + 'ms');
      }
   };
};
