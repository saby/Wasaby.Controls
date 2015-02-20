/**
 * Модуль "Компонент кнопка".
 *
 * @description
 */
define('js!SBIS3.CORE.LinkButton', ['js!SBIS3.CORE.Button', 'css!SBIS3.CORE.LinkButton'], function( Button ) {

   'use strict';

   /**
    * Кнопка
    *
    * @class $ws.proto.LinkButton
    * @extends $ws.proto.Button
    * @control
    * @initial <component data-component="SBIS3.CORE.LinkButton"><option name="caption" value="Кнопка как ссылка"></option></component>
    * @category Button
    * @designTime actions /design/design
    */
   $ws.proto.LinkButton = Button.extend({
      $protected:{
         _options:{
            /**
             * @cfg {String} Ссылка, которая откроется при клике на кнопку-ссылку
             * Изменяется методом {@link setOpenLink}
             * <wiTag group="Управление">
             */
            openLink : '',
            renderStyle : 'asLink'
         }
      },
      getOpenLink: function(){
         return this._options.openLink;
      },
      setOpenLink: function(openLink){
         this._options.openLink = openLink;
         this._bodyContainer.attr('href', openLink);
      }
   });


   return $ws.proto.LinkButton;

});
