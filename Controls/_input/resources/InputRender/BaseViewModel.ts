import simpleExtend = require('Core/core-simpleExtend');
import entity = require('Types/entity');
      

      /**
       * Базовый класс ViewModel для InputRender
       * @class Controls/_input/resources/InputRender/BaseViewModel
       * @private
       * @author Красильников А.С.
       */

      export = simpleExtend.extend([entity.VersionableMixin], {
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
            var oldValue = this._options.value;
            this._options.value = options.value;

            // если ничего не поменялось - не надо изменять версию
            if (oldValue !== this._options.value) {
               this._nextVersion();
            }
         }
      });
   
