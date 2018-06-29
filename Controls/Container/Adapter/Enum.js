/**
 * Created by kraynovdo on 26.04.2018.
 */
define('Controls/Container/Adapter/Enum',
   [
      'Core/Control',
      'tmpl!Controls/Container/Adapter/Enum/Enum',
      'WS.Data/Source/Memory'
   ],

   function(Control, template, Memory) {
      var _private = {
         getArrayFromEnum: function(enumInstance) {
            var arr = [];
            enumInstance.each(function(item) {
               arr.push({
                  title: item
               });
            });
            return arr;
         },

         getSourceFromEnum: function(enumInstance) {
            var data = _private.getArrayFromEnum(enumInstance);
            return new Memory({
               data: data,
               idProperty: 'title'
            });
         },

         enumSubscribe: function(self, enumInstance) {
            enumInstance.subscribe('onChange', function(e, index, value) {
               self._selectedKey = value;
               self._forceUpdate();
            });
         }

      };

      /**
       * Container component for Search
       * Notify bubbling event "search".
       * Should be located inside Controls/Container/Search.
       * @class Controls/Container/Input/Search
       * @extends Core/Control
       * @author Герасимов Александр
       * @demo Controls-demo/Container/Enum
       * @control
       * @public
       */

      'use strict';

      var SearchContainer = Control.extend({

         _template: template,
         _source: null,

         _enum: null,

         _beforeMount: function(newOptions) {
            if (newOptions.enum) {
               this._enum = newOptions.enum;
               _private.enumSubscribe(this, this._enum);
               this._source = _private.getSourceFromEnum(newOptions.enum);
               this._selectedKey = newOptions.enum.getAsValue();
            }
         },

         _beforeUpdate: function(newOptions) {
            if ((newOptions.enum) && (newOptions.enum !== this._enum)) {
               this._enum = newOptions.enum;
               _private.enumSubscribe(this, this._enum);
               this._source = _private.getSourceFromEnum(newOptions.enum);
               this._selectedKey = newOptions.enum.getAsValue();
            }
         },

         _changeKey: function(e, key) {
            if (this._enum) {
               this._enum.setByValue(key);
            }
         }

      });

      /*For tests*/

      SearchContainer._private = _private;

      return SearchContainer;
   });
