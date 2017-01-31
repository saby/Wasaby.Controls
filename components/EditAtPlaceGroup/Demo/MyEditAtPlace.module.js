define('js!SBIS3.CONTROLS.Demo.MyEditAtPlace',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyEditAtPlace',
      'js!SBIS3.CONTROLS.TabControl',
      'js!SBIS3.CONTROLS.SwitcherDouble',
      'js!SBIS3.CONTROLS.TextBox',
      'js!SBIS3.CONTROLS.NumberTextBox',
      'js!SBIS3.CONTROLS.DatePicker',
      'js!SBIS3.CONTROLS.EditAtPlaceGroup',
      'js!SBIS3.CONTROLS.EditAtPlace'
   ],
   function (CompoundControl, dotTplFn) {
      'use strict';
      var MyEditAtPlace = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {}
         },
         $constructor: function () {
            this.getLinkedContext().setValue('tabs', {
               name: 'Имя',
               name2: 'Отчество',
               date: new Date(),
               number: '228'
            });
            this.getLinkedContext().setValue('popup', {
               ogrn: '1037739877295',
               kpp: '00083262',
               inn: '80209801001'
            });
         },

         init: function () {
            MyEditAtPlace.superclass.init.call(this);

            var popupEdit = this.getChildControlByName('poop'),
                tabs = this.getChildControlByName('lool');

            this.getChildControlByName('switch').subscribe('onActivated', function(event, state) {
               if (state == 'on') {
                  popupEdit.setInPlaceEditMode(true);
                  tabs.setInPlaceEditMode(true);
               } else {
                  popupEdit.setInPlaceEditMode(false);
                  tabs.setInPlaceEditMode(false);
               }
            });
         }
      });
      return MyEditAtPlace;
   }
);