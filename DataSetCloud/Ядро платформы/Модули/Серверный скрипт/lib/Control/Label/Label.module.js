/**
 * Модуль "Компонент метка".
 *
 * @description
 */
define("js!SBIS3.CORE.Label", ["js!SBIS3.CORE.CompoundControl", "html!SBIS3.CORE.Label", "css!SBIS3.CORE.Label"], function (Control, dotTplFn) {
   "use strict";

   /**
    * Метка
    *
    * @class $ws.proto.Label
    * @extends $ws.proto.CompoundControl
    * @initial <component data-component="SBIS3.CORE.Label"><option name="value" value="Метка"></option></component>
    * @icon buttonIcon.png
    * @category Containers
    * @ignoreOptions allowChangeEnable element linkedContext parent className context enabled extendedTooltip name owner record saveState tooltip visible
    * @designTime actions /design/design
    * @designTime plugin /design/DesignPlugin
    */
   $ws.proto.Label = Control.extend(/** @lends $ws.proto.Label.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Положение метки
             * Этот параметр определяет положение кнопки, относительно контейнера.
             * <wiTag group="Управление">
             * @variant none без привязки
             * @variant left слева
             * @variant top сверху
             */
            position: 'none',
            /**
             * @cfg {String} Выравнивание текста метки по горизонтали
             * При положении "top".
             * <wiTag group="Управление">
             * @variant left слева
             * @variant center по центру
             * @variant right справа
             */
            textAlign: 'left',
            /**
             * @cfg {String} Стиль метки
             * <wiTag group="Управление" noShow>
             */
            style: 'font-size: 12px;',
            /**
             * @cfg {String} Выравнивание текста метки по вертикали
             * <wiTag group="Управление">
             * @variant top сверху
             * @variant baseline по базовой линии контрола
             */
            verticalAlign : 'baseline',

            /**
             * @cfg {String} Текст метки
             * <wiTag group="Управление">
             */
            value: 'Метка',

            width: '',

            height: '',
            /**
             * @cfg {Content} Содержимое
             * <wiTag group="Управление" noShow>
             */
            labelContent : '',
            /**
             * @cfg {number} Ширина метки
             * <wiTag group="Управление" noShow>
             */
            labelWidth: undefined
         },
         _label: '',
         _textContainer: '',
         _holder: '',
         _aliasForContent : 'labelContent'
      },
      _dotTplFn: dotTplFn,

      $constructor: function () {
         this._textContainer = this._container.find(".ws-Label__text");
         this._label = this._container;
         this._textContainer.width(this._options.labelWidth);
         this._container.height('auto');
         this._container.width('auto');
         //сделаем контекст "прозрачным", чтобы контролы внутри метки работали с контекстом родителя
         this._craftedContext = false;
         this._context = this._context.getPrevious();
      },

      _linkTo: function (control) {
      },

      _unlink: function () {
      },

      /**
       * Смена текста метки
       * @param {String} value Значение
       */
      setValue: function (value) {
         this._options.value = value;
         this._textContainer.text(value || '');
      },

      /**
       * Смена горизонтальноего выравнивания метки
       * @param {String} value Значение
       */
      setTextAlign: function (value) {
         var oldAlign = this._options['textAlign'];
         this._options['textAlign'] = value;
         this._textContainer.removeClass('ws-Label__text-align-'+oldAlign).addClass('ws-Label__text-align-'+value);
      },

      /**
       * Смена вертикального выравнивания метки
       * @param {String} value Значение
       */
      setVerticalAlign: function (value) {
         var oldAlign = this._options['verticalAlign'];
         this._options['verticalAlign'] = value;
         this._container.removeClass('ws-Label__vertical-align-'+oldAlign).addClass('ws-Label__vertical-align-'+value);
      },

      /**
       * Смена привязки метки
       * @param {String} value Значение
       */
      setPosition: function (value) {
         this._options['position'] = value;
         var classes = this._container.attr('class') || "";
         classes = classes.replace(/ws\-Label__binding\-(top|left|none)/, 'ws-Label__binding-' + value || 'none');
         this._container.attr('class', classes);
      },

      /**
       * Смена ширины
       * @param {String} value Значение
       */
      setWidth: function (value) {
         var v = parseInt(value, 10);
         if (!isNaN(v)) {
            this._options.width = v + 'px';
            this._label.width(this._options.width);
         }
      },

      /**
       * Смена высоты
       * @param {String} value Значение
       */
      setHeight: function (value) {
         var v = parseInt(value, 10);
         if (!isNaN(v)) {
            this._options.height = v + 'px';
            this._label.height(this._options.height);
         }
      }
   });
   return $ws.proto.Label;
});