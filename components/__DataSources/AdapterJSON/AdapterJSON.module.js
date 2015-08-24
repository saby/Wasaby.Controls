define('js!SBIS3.CONTROLS.AdapterJSON', ['js!SBIS3.CONTROLS.AdapterBase'], function(AdapterBase){
   'use strict';

   /**
    * Адаптер для JSON
    * @class SBIS3.CONTROLS.AdapterJSON
    * @extends SBIS3.CONTROLS.AdapterBase
    * @author Крайнов Дмитрий Олегович
    */

   return AdapterBase.extend(/** @lends SBIS3.CONTROLS.AdapterJSON.prototype */{
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
            lvl = 0,
            curParent = null,
            parents = [];
         do {
            this._simpleIterate(data, function (item, i) {
               if ((item[hierField] || null) === (curParent ? curParent[keyField] : null)) {
                  parents.push(data[i]);
                  hdlFunction(data[i], i, curParent, lvl);
               }
            });

            if (parents.length) {
               curParent = Array.remove(parents, 0)[0];
            }
            else {
               curParent = null;
            }
         }
         while (curParent)
      },

      getValue : function(item, field) {
         return item[field];
      },
      addItem : function(data, newItem) {
         data.push(newItem);
      },
      destroyItem : function(data, id, keyField) {
         var num;
         for (var i = 0; i < data.length; i++) {
            if (data[i][keyField] == id) {
               num = i;
               break;
            }
         }
         if (typeof num != 'undefined') {
            Array.remove(data, num);
         }
      },

      hasChild : function(data, id, key, hier) {
         var result = false;
         this._hierIterate(data, function(item, i){
            if (item[hier] == id) {
               result = true;
            }
         }, key, hier);
         return result;
      },

      getChildItems : function(data, id, key, hier, rec) {
         var
            child = [],
            parents = {};
         parents[id] = 1;

         this._hierIterate(data, function(item, i){
            if ((rec && parents[item[hier]]) || item[hier] == id) {
               child.push(item);
               parents[item[key]] = 1;
            }
         }, key, hier);
         return child;
      },

      getItemsCount : function(data) {
         return data.length;
      },


      getParent : function (item, hierField) {
         var parent = null;
         if (hierField) {
            parent = item[hierField];
         }
         return parent;
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