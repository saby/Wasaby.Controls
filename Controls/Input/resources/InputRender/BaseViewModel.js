define('Controls/Input/resources/InputRender/BaseViewModel',
   [
      'Core/core-simpleExtend',
      'Types/entity'
   ],
   function(
      simpleExtend,
      entity
   ) {
      'use strict';

      /**
       * Базовый класс ViewModel для InputRender
       * @class Controls/Input/resources/InputRender/BaseViewModel
       * @private
       * @author Журавлев М.С.
       */

      return simpleExtend.extend([entity.VersionableMixin], {
         constructor: function(options) {
            this._options = options || {};
         },

         /**
          * @param splitValue
          * @returns {{value: (*|String), position: (*|Integer)}}
          */
         handleInput: function(splitValue) {
            var
               value = splitValue.before + splitValue.insert + splitValue.after;

            var oldValue = this._options.value;
            this._options.value = value;
            if (oldValue !== value) {
               this._nextVersion();
            }


            return {
               value: value,
               position: splitValue.before.length + splitValue.insert.length
            };
         },

         getDisplayValue: function() {
            return this.getValue();
         },

         getValue: function() {
            return this._options.value || '';
         },

         updateOptions: function(options) {
            var oldValue = this._options.value;
            this._options.value = options.value;
            if (oldValue !== options.value) {
               this._nextVersion();
            }
         }
      });
   }
);
