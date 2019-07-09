define('Controls-demo/Example/Input/Tag',
   [
      'Core/Control',
      'Controls-demo/Example/Input/SetValueMixin',
      'wml!Controls-demo/Example/Input/Tag/Tag',

      'Controls/input',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, SetValueMixin, template) {
      'use strict';

      return Control.extend([SetValueMixin], {
         _template: template,

         _currentActiveTag: null,

         _secondaryValue: '10 500.00',

         _successValue: '10 500.00',

         _warningValue: '10 500.00',

         _dangerValue: '10 500.00',

         _infoValue: '10 500.00',

         _primaryValue: '10 500.00',

         _showInfoBox: function(event, target) {
            var cfg = {
               target: target,
               message: 'Tooltip text',
               targetSide: 'top',
               alignment: 'end'
            };

            this._notify('openInfoBox', [cfg], {
               bubbling: true
            });
         }
      });
   });
