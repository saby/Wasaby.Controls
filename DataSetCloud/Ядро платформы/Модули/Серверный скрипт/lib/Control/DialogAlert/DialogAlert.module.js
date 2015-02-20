/**
 * Модуль "Компонент Информационное собщение".
 *
 * @description
 */
define("js!SBIS3.CORE.DialogAlert", ["js!SBIS3.CORE.SimpleDialogAbstract"], function( SimpleDialogAbstract ) {

   "use strict";

   /**
    * Информационное сообщение
    *
    * @class $ws.proto.DialogAlert
    * @extends $ws.proto.SimpleDialogAbstract
    * @control
    */
   $ws.proto.DialogAlert = SimpleDialogAbstract.extend(/** @lends $ws.proto.DialogAlert.prototype */{
      $protected : {
         _options : {
            /**
             * @cfg {String} Тип окна сообщения
             * Окна разных типов отличаются внешним видом.
             * Возможные варианты окон:
             * <ol>
             *    <li>'info' - информационное, предназначено для вывода сообщения пользователю;</li>
             *    <li>'alert' - предупреждающее,</li>
             *    <li>'error' - предназначено для отображения сообщения о возникшей ошибке.</li>
             * </ol>
             */
            type : "info",
            buttons : [
               {
                  tabindex : 1,
                  width : "100%",
                  height : "100%",
                  name : "simpleDialogOk",
                  renderStyle: "classic",
                  isDefault : true,
                  caption : "OK",
                  handlers: {
                     onActivated  : function(){
                        this.getParent().close();
                     }
                  }
               }
            ]
         }
      },
      $constructor : function(){
         this._window.addClass("ws-smp-dlg-" + (this._options.type || "info"));
      }
   });

   return $ws.proto.DialogAlert;

});