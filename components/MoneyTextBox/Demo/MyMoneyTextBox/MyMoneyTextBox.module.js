define('js!SBIS3.CONTROLS.Demo.MyMoneyTextBox',
    ['js!SBIS3.CORE.CompoundControl',
       'html!SBIS3.CONTROLS.Demo.MyMoneyTextBox',
       'js!SBIS3.CONTROLS.MoneyTextBox',
       'js!SBIS3.CONTROLS.IconButton'
    ],
    function(CompoundControl, dotTplFn) {
       /**
        * SBIS3.CONTROLS.Demo.MyMoneyTextBox
        * @class SBIS3.CONTROLS.Demo.MyMoneyTextBox
        * @extends $ws.proto.CompoundControl
        * @control
        */
       var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyNumberTextBox.prototype */{
          _dotTplFn: dotTplFn,
          $protected: {
             _options: {

             },
             moneyTextBox: null,
             enabledButton: null
          },
          $constructor: function() {
          },
          init: function() {
             var self = this,
                 enabled,
                 iconClass;
             moduleClass.superclass.init.call(this);
             this.moneyTextBox = this.getChildControlByName('MoneyTextBox');
             this.enabledButton = this.getChildControlByName('enabledButton');
             this.enabledButton.subscribe('onActivated', function(){
                enabled = !self.moneyTextBox.isEnabled();
                iconClass = enabled ? 'icon-16 icon-Unlock icon-primary' : 'icon-16 icon-Lock icon-primary';
                self.enabledButton.setIcon(iconClass);
                self.moneyTextBox.setEnabled(enabled);
             });
          }
       });
       return moduleClass;
    });