/**
 * Created by as.krasilnikov on 21.01.2019.
 */
define('Controls-demo/Popup/PopupAnimation',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/PopupAnimation/PopupAnimation',
      'css!Controls-demo/Popup/PopupAnimation/PopupAnimation'
   ],
   function(Control, template) {
      return Control.extend({
         _animationDelay: 200,
         _fullCreateDelay: 1000,
         _template: template,
         openStack: function() {
            this._children.stack.open({
               className: 'ControlsDemo-PopupAnimation_duration-' + this._animationDelay,
               templateOptions: {
                  fullCreateDelay: this._fullCreateDelay
               }
            });
         },
         _inputHandlerHandler: function(event, param, value) {
            if (value < 0) {
               this[param] = 0;
            } else if (value > 1500) {
               this[param] = 1500;
            }
         }
      });
   });
