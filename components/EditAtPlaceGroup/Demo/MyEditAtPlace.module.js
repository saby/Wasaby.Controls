define('js!SBIS3.CONTROLS.Demo.MyEditAtPlace', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MyEditAtPlace',
   'js!SBIS3.CONTROLS.TabControl',
   'js!SBIS3.CONTROLS.SwitcherDouble'
], function (CompoundControl, dotTplFn) {
   'use strict';
   /**
    * SBIS3.CONTROLS.Demo.MyTabControl
    * @class SBIS3.CONTROLS.Demo.MyTabControl
    * @extends $ws.proto.CompoundControl
    */
   var MyEditAtPlace = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTabControl.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
         this.getLinkedContext().setValue('tabs', {
            name: 'Имя',
            name2: 'Отчество',
            date: '19.02.16',
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

         var popupEdit = this.getChildControlByName('poop');
         var tabs = this.getChildControlByName('lool');

         this.getChildControlByName('switch').subscribe('onActivated', function(event, state){
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
});