/**
 * Created by nv.belotelov on 14.07.2017.
 */
define('js!WSTest/Focus/Scenario/30', [
   'Core/constants',
   'js!WSTest/Focus/TestFocusHelpers',
   'js!SBIS3.CORE.Button',
   'js!SBIS3.CORE.Window',
   'tmpl!WSTest/Focus/Case30',
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CORE.CompoundActiveFixMixin',
   'js!WSTest/Focus/Case13'
], function (cConstants,
             fHelpers,
             Button,
             W,
             Case30,
             CompoundControl,
             CompoundActiveFixMixin) {
   'use strict';
   /*
    AreaAbstract0
    Textbox0
    CORE.Button tabindex=0 onclick=function(){floatarea1.show()}
    FloatArea1
    Textbox1

    кликаем на Textbox0, кликаем на кнопку, открылась панель, нажимаем esc, активность должна уйти на Textbox0
    */
   return function scenario30(done) {
      var wnd,
         testControlName = 'WSTest/Focus/Case13';

      function onActivated(e) {
         wnd = new W({
            opener: this,
            width: '500px',
            height: '200px',
            template: 'js!' + testControlName
         })
      }

      var Control = CompoundControl.extend({
            _dotTplFn: Case30
         }),
         control = new Control({
            element: $('#component')
         });
      Button = Button.extend([CompoundActiveFixMixin], {});
      var button = new Button({
         element: $('<div></div>').appendTo('.Case30Control'),
         handlers: {
            'onActivated': onActivated,
            'onClick': onActivated
         },
         img: 'sprite:icon-16 icon-Search icon-primary'
      });
      fHelpers.fireClick(button);
      setTimeout(function () {
         fHelpers.fireEsc(wnd);
         fHelpers.childHasFocus(control, 'TextBox0');
         delete window[testControlName];
         control.destroy();
         done();
      }, 50);

   };
});
