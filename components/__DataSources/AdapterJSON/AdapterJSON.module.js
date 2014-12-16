define('js!SBIS3.CONTROLS.AdapterJSON', ['js!SBIS3.CONTROLS.AdapterBase'], function(AdapterBase){
   'use strict';
   return AdapterBase.extend({
      $constructor : function() {

      },
      iterate : function(data, hdlFunction, keyField, hierField) {
         if (hierField) {
            this._hierIterate(data, hdlFunction, keyField, hierField);
         }
         else {
            this._simpleIterate(data, hdlFunction);
         }

      },

      _simpleIterate : function(data, hdlFunction) {
         for (var i = 0; i < data.length; i++) {
            hdlFunction(data[i], i);
         }
      },

      _hierIterate : function(data, hdlFunction, keyField, hierField) {
         var
            self = this,
            parItem = null,
            lvl = -1;
         function recursiveWalk(numParent) {
            parItem = data[numParent] ? data[numParent] : null;
            lvl++;
            self._simpleIterate(data, function(item, i){
               //корневой элемент
               var parId = parItem ? self.getValue(parItem, keyField) : null;
               if (self.getValue(item, hierField) == parId) {
                  hdlFunction(data[i], i, parItem, lvl);
                  parItem = data[i];
                  recursiveWalk(i);
               }
            });
            parItem = null;
            lvl--;
         }
         recursiveWalk();
      },

      getValue : function(item, field) {
         return item[field];
      },
      addItem : function(data, newItem) {
         data.push(newItem);
      },
      getItemsCount : function(data) {
         return data.length;
      },

      getSibling : function(data, item, type) {
         var sibling = null;
         //Если ключ не задан, то возвращаем первый элемент
         if (!item) {
            sibling = data[0] || null;
         }
         else {
            var
               direction = (type == 'next') ? 1 : -1;

            var index = this.getIndexOf(data, item) + direction;
            if ((index >= 0) && (index <= data.length - 1)) {
               sibling = data[index];
            }

         }
         return sibling;
      },

      getIndexOf: function(data, item){
         return data.indexOf(item);
      }
   });
});