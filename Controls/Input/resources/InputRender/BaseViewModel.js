define('Controls/Input/resources/InputRender/BaseViewModel',
   [
      'Core/core-simpleExtend',
      'WS.Data/Entity/VersionableMixin'
   ],
   function(
      simpleExtend,
      VersionableMixin
   ) {
      'use strict';

      /**
       * Базовый класс ViewModel для InputRender
       * @class Controls/Input/resources/InputRender/BaseViewModel
       * @private
       * @author Журавлев М.С.
       */

      return simpleExtend.extend([VersionableMixin], {
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

            this._options.value = value;
            this._nextVersion();

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
            this._options.value = options.value;
            this._nextVersion();
         }
      });
   }
);
