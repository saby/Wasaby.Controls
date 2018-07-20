define('Controls/SwitchableArea/ViewModel',
   [
      'Core/core-simpleExtend'
   ],
   function(SimpleExtend) {

      'use strict';

      var _private = {
         updateLoadStatus: function(selectedKey, self) {
            self._items.getRecordById(selectedKey).loaded = true;
         }
      };

      var ViewModel = SimpleExtend.extend({
         constructor: function(items, selectedKey) {
            ViewModel.superclass.constructor.apply(this, arguments);
            this._items = items;
            _private.updateLoadStatus(selectedKey, this);
         },
         updateViewModel: function(items, selectedKey) {
            if (this._items !== items) {
               this._items = items;
            }
            _private.updateLoadStatus(selectedKey, this);
         },
         mustBeLoad: function(item) {
            return this._items.getRecordById(item.get(this._items.getIdProperty())).loaded;
         }
      });

      return ViewModel;
   }
);
