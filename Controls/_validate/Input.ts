import Controller = require('Controls/_validate/Controller');
import template = require('wml!Controls/_validate/Input');
/**
 * Контрол, регулирующий валидацию своего контента. Используется с контролами, поддерживающими интерфейс IInputField( {@link Controls/interface/IInputField} )
 * Автоматически вызывает валидацию при потере фокуса.
 * @class Controls/_validate/Input
 * @extends Controls/_validate/Controller
 * @control
 * @public
 * @author Красильников А.С.
 */

     const Input = Controller.extend({
         _template: template,
         _deactivatedHandler: function() {
            if (!this._options.readOnly) {
               this._shouldValidate = true;
               this._forceUpdate();
            }
         },
         _inputCompletedHandler: function(event, value) {
            this._notify('inputCompleted', [value]);
            // Because of this error:
            // https://online.sbis.ru/opendoc.html?guid=ef52bfb5-56ea-4397-a77f-89e5c3413ed9
            // we need to stop event propagation, otherwise all subscribtions to inputComplete-event of
            // this control will be called twice
            event.stopPropagation();
         },
         _afterUpdate: function(oldOptions) {
            if (this._shouldValidate || this._options.value !== oldOptions.value) {
               this._shouldValidate = false;
               this.validate();
            }
         }
      });
      export = Input;
