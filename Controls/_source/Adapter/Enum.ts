/**
 * Created by kraynovdo on 26.04.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_source/Adapter/Enum/Enum');
import source = require('Types/source');

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
      return new source.Memory({
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
 * Container component for working with controls.
 * This container accepts an Enum object.
 * @class Controls/Container/Adapter/Enum
 * @extends Core/Control
 * @author Герасимов Александр
 * @demo Controls-demo/Container/Enum
 * @control
 * @public
 */



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
      var resultKey = key;

      //support of multiselection in dropdown
      if (key instanceof Array) {
         resultKey = key[0];
      }
      if (this._enum) {
         this._enum.setByValue(resultKey);
      }
   }

});

/*For tests*/

SearchContainer._private = _private;

export = SearchContainer;

