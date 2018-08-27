define('SBIS3.CONTROLS/InformationPopup',
   [
      'require',
      'Lib/Control/CompoundControl/CompoundControl',
      'SBIS3.CONTROLS/Mixins/PopupMixin',
      'Lib/Mixins/LikeWindowMixin',
      'tmpl!SBIS3.CONTROLS/InformationPopup/InformationPopup',
      'css!SBIS3.CONTROLS/InformationPopup/InformationPopup'
   ],

   /**
    * Класс контрола "Всплывающее информационное окно". Содержимое окна строится по шаблону, установленному в опции {@link template}. Цвет линии в шапке окна зависит от установленного состояния {@link status}.
    *
    * @class SBIS3.CONTROLS/InformationPopup
    * @extends Lib/Control/CompoundControl/CompoundControl
    *
    * @mixes SBIS3.CONTROLS/Mixins/PopupMixin
    * @mixes Lib/Mixins/LikeWindowMixin
    *
    *
    * @control
    * @public
    * @author Красильников А.С.
    */
   function(require, CompoundControl, PopupMixin, LikeWindowMixin, dotTpl){
      'use strict';
      var InformationPopup = CompoundControl.extend([PopupMixin, LikeWindowMixin], /** @lends SBIS3.CONTROLS/InformationPopup.prototype */ {
         /**
          * @typedef {String} InformationPopupStatus
          * @variant default  Окно без состояния. Цвет линии в шапке - синий, иконка по умолчанию не задана.
          * @variant success  Состояние "Успешно". Цвет линии в шапке - зеленый, иконка - зелёная галка.
          * @variant error    Состояние "Ошибка". Цвет линии в шапке - красный, иконка - треугольник с восклицательным знаком.
          */
         _dotTplFn : dotTpl,
         $protected: {
            _options: {

               /**
                * @cfg {InformationPopupStatus} Устанавливает состояние окна. От состояния зависит цвет линии в шапке и иконка.
                */
               status: 'default',
               /**
                * @cfg {Function} Устанавливает шаблон содержимого диалога.
                */
               template: null
            }
         },
         $constructor : function(){
            if (!this._opener && require.defined('Core/WindowManager')) {
               var windowManager = require('Core/WindowManager');
               this._opener = windowManager.getActiveWindow();
            }
         },

         init : function() {
            InformationPopup.superclass.init.call(this);
         },

         /**
          * Устанавливает новое состояние окна.
          * @param {InformationPopupStatus} status Состояние.
          */
         setStatus: function(status){
            this.getContainer().removeClass('controls-InformationPopup__status-' + this._options.status).addClass('controls-InformationPopup__status-' + status);
            this._options.status = status;
         },

         _modifyOptions: function(options) {
            InformationPopup.superclass._modifyOptions.call(this, options);

            options.crossStyle = 'light';

            return options;
         }
      });

      InformationPopup.resizable = false;
      return InformationPopup;
   }
);
