/**
 * Модуль "Компонент контурная кнопка".
 *
 * @description
 */
define('js!SBIS3.CORE.OutlineButton', ['js!SBIS3.CORE.Button', 'css!SBIS3.CORE.OutlineButton'], function(Button) {

   'use strict';

   /**
    * Кнопка
    *
    * @class $ws.proto.OutlineButton
    * @extends $ws.proto.Button
    * @control
    * @initial <component data-component="SBIS3.CORE.OutlineButton"><option name="caption" value="Контурная кнопка"></option></component>
    * @category Button
    * @designTime actions /design/design
    * @ignoreOptions menu
    * @ignoreOptions image
    * @ignoreOptions imageAlign
    */
   $ws.proto.OutlineButton = Button.extend({
      $protected:{
         _options:{
            renderStyle : 'outline'
         }
      },

      /**
       * Переопределяю инициализацию меню
       * @private
       */
      _initMenu: function() {
      },

      /**
       * Переопределяю установку изображения
       * @private
       */
      _applyImageChange: function() {

      }

   });

   return $ws.proto.OutlineButton;

});
