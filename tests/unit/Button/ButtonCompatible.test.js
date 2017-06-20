/**
 * Created by dv.zuev on 18.05.2017.
 */
define([
   'js!SBIS3.CONTROLS.Button'
], function (
   Button
) {
   'use strict';

   describe('SBIS3.CONTROLS.Button Compatible', function () {

      var button = new Button({activableByClick:false});

      /**
       * Казалось бы, но приватные методы относительно кнопки переопределяются
       * внутри платформы
       */
      var extClass = Button.extend({
            iWantVDOM: false,
            _clickWorked: false,
            _onClick: function () {
               this._clickWorked = true;
            }
         }),
         extend = new extClass({});

      describe('Focus', function(){


         it('do not set active', function () {
            button._onMouseClick();
            assert.isTrue(!button._isControlActive);
         });

         it('redefenition _onClick', function () {
            extend._onClickHandler();
            assert.isTrue(extend._clickWorked);
            extend._clickWorked = false;
            extend.setEnabled(false);
            extend._onClickHandler();
            assert.isTrue(!extend._clickWorked);
         });


         /**it('destroy', function(){

             * TODO: вернуть тест при отрезе слоя compatible
             *
            button.destroy();
            assert.isTrue(button.isDestroyed());
         });
          */
      });

   });

});
