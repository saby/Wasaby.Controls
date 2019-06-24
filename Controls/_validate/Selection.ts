import Controller = require('Controls/_validate/Controller');
import template = require('wml!Controls/_validate/Selection');

/**
 * Контрол, регулирующий валидацию своего контента.
 * Используется с контролами, поддерживающими интерфейс IMultiSelectable( {@link Controls/_interface/IMultiSelectable} )
 * Автоматически запускает валидацию при смене значения в контроле и при его деактивации.
 * @class Controls/_validate/Selection
 * @extends Controls/_validate/Controller
 * @control
 * @public
 * @author Красильников А.С.
 */

      

      const Selection = Controller.extend({
         _template: template,
         _deactivatedHandler: function() {
            this._shouldValidate = true;
            this._forceUpdate();
         },
         _selectedKeysChangedHandler: function(event, value) {
            this._notify('selectedKeysChanged', [value]);
            this._cleanValid();
         },

         _afterUpdate: function() {
            if (this._shouldValidate) {
               this._shouldValidate = false;
               this.validate();
            }
         }
      });
      export = Selection;
   
