define('Controls-demo/Popup/Opener/resources/oldChildPnlTitle',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!Controls-demo/Popup/Opener/resources/oldChildPnlTitle',
      'SBIS3.CONTROLS/TextBox'
   ],
   function (CompoundControl, template) {
      'use strict';

      var Panel = CompoundControl.extend({
         _dotTplFn: template,

         $constructor: function () {

         },

         init: function() {
            var self = this;
            Panel.superclass.init.call(this);
            self._button1 = self.getChildControlByName('testButton1');
            self._button2 = self.getChildControlByName('testButton2');
            self._subscribe();
         },
         _subscribe: function() {
            var self = this;
            this.getTopParent().subscribeTo(self._button1, 'onActivated', function() {
               self.sendCommand('close');
            });
            this.getTopParent().subscribeTo(self._button2, 'onActivated', function() {
               self.sendCommand('close');
            });
         }
      });

      return Panel;
   }
);

