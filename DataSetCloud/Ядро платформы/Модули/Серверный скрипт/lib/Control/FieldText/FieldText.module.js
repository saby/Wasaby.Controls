/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 23:04
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.FieldText", [
      "js!SBIS3.CORE.FieldString",
      "html!SBIS3.CORE.FieldText",
      'css!SBIS3.CORE.FieldText',
      'is!browser?js!SBIS3.CORE.FieldText/resources/Autosize-plugin'
   ], function(FieldString, dotTplFn) {

   "use strict";

   /**
    * @class $ws.proto.FieldText аналог textarea
    * @extends $ws.proto.FieldString
    * @control
    * @category Fields
    * @initial
    * <component data-component='SBIS3.CORE.FieldText' style='width: 100px;'>
    *    <option name="value">Текст</option>
    * </component>
    * @designTime actions SBIS3.CORE.FieldString/design/design
    * @ignoreOptions maxlength
    * @ignoreOptions readonly
    * @ignoreOptions password
    */
   $ws.proto.FieldText = FieldString.extend(/** @lends $ws.proto.FieldText.prototype */{
      $protected : {
         _options : {
            cssClassName: 'ws-field-text',
            cssClass: 'ws-field-text',
            /**
             * @cfg {Boolean} Режим текстового поля с автовысотой
             * <wiTag group="Управление">
             */
            autoHeight: false,
             /**
              * @cfg {Number} Минимальное количество отображаемых строк
              * Текстовое поле изначально будет состоять из заданного в данной опции количества строк.
              * <wiTag group="Управление">
              * @see maxLinesCount
              * @see getMinVisibleLines
              * @see setMinVisibleLines
              * @see getMaxVisibleLines
              * @see setMaxVisibleLines
              */
            minLinesCount: 0,
            /**
             * @cfg {Number} Максимальное количество отображаемых строк
             * Многострочное текстовое поле может расширяться по высоте до указанного в этой опции количества строк.
             * После добавления строки по счёту max+1 текстовое поле больше не будет расширяться, появится вертикальная полоса прокрутки.
             * <wiTag group="Управление">
             * @see minLinesCount
             * @see getMinVisibleLines
             * @see setMinVisibleLines
             * @see getMaxVisibleLines
             * @see setMaxVisibleLines
             */
            maxLinesCount: 0
         },
         _fieldText: undefined,
         _firstSetValue: false,
         _keysWeHandle: [
            $ws._const.key.enter,
            $ws._const.key.del
         ]
      },
      /**
       * @lends $ws.proto.FieldText.prototype
       */
      $constructor: function() {
         this._prepareField();
         if ($ws.helpers.compareValues(this.getValue(), this._notFormatedVal())) {
            this._container.removeClass('ws-invisible');
            this._firstSetValue = true;
         }
      },
      _prepareField: function() {
         this.subscribe('onValueChange', this._applyScrollClass);
         this._inputControl.height('100%')
            .val('');   //TODO IE10 pp 9200.16438 (+/final ?)

         this._fieldText = this._container.find('.ws-field');
         this._fieldText.addClass('ws-field-fullheight');

         // у ie версии ниже 8 проблемы с выставлением высоты в процентах для textarea
         if ($ws._const.browser.isIE && $.browser.version < 8) {
            var
               self = this,
               containerHeight,
               wsField = this._fieldText,
               calculateHeight = function() {
                  containerHeight = this.getContainer().height();
                  containerHeight -= wsField.outerHeight() - wsField.height();
                  wsField.height(containerHeight);
                  self._inputControl.height(containerHeight);
               };
            this.getParent()
               .subscribe('onResize', $.proxy(calculateHeight, this))
               .subscribe('onAfterShow', $.proxy(calculateHeight, this));
         }
         this._inputControl.unbind('keypress paste');
         if (this._options.autoHeight) {
            this._options.minLinesCount = parseInt(this._options.minLinesCount, 10);
            this._options.maxLinesCount = parseInt(this._options.maxLinesCount, 10);
            if (this._options.minLinesCount > this._options.maxLinesCount) {
               this._options.maxLinesCount = this._options.minLinesCount;
            }
            this._inputControl.data('minLinesCount', this._options.minLinesCount);
            this._inputControl.data('maxLinesCount', this._options.maxLinesCount);
            this._inputControl.autosize({
               callback: this._textAreaResize.bind(this),
               append: ''
            });
         }
      },
      /**
       * Функция-обработчик события _onKeyUp. Переопределена, т.к. работа по нажатию на delete/backspace выполняется в событии onkeyDown
       * @param {object} event
       * @private
       */
      _onKeyUp: function(event) {
      },
      _applyScrollClass: function() {
         var 
            area = this._container.find('textarea')[0];
         if (area) {
            this._container.toggleClass('ws-field-fullheight-has-scrollbar', area.scrollHeight > area.clientHeight);
         }
      },
      _onResizeHandler: function() {
         this._applyScrollClass();
         this._inputControl.trigger('autosize.resize');
      },
      /**
       * <wiTag group="Управление">
       * Изменить текущее значение.
       * @param {*} value Вставляемое значение.
       * @param {Boolean} [ignoreReadonly] Игнорировать признак "только для чтения".
       * @param {Boolean} [noRevalidate] Не проводить валидацию контрола.
       * @example
       * <pre>
       *    var field = this.getTopParent().getChildControlByName('demoFieldText');
       *    field.setValue('новое значение');
       * </pre>
       */
      setValue: function(value, ignoreReadonly) {
         if (!this._options.readOnly || ignoreReadonly) {
            $ws.proto.FieldText.superclass.setValue.apply(this, arguments);
            if (this._options.autoHeight) {
               this._inputControl.trigger('autosize.resize');
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Установить минимальное количество отображаемых строк.
       * Метод позволяет изменить минимальное количество отображаемых строк текстового поля, установленное опцией {@link minLinesCount}.
       * @param {Number} count Количество строк.
       * @example
       * Проверим минимальное количество отображаемых строк: не превышает ли оно двух. Если превышает, то установим значение в 2 строки.
       * <pre>
       *    var field = this.getTopParent().getChildControlByName('demoFieldText');
       *    if (field.getMinVisibleLines() > 2) {
       *       //устанавливаем минимальное количество отображаемых строк
       *       field.setMinVisibleLines(2);
       *    }
       * </pre>
       * @see minLinesCount
       * @see maxLinesCount
       * @see getMinVisibleLines
       * @see getMaxVisibleLines
       * @see setMaxVisibleLines
       */
      setMinVisibleLines: function(count) {
         if (this._options.autoHeight === true && typeof count === 'number') {
            if (count > this._options.maxLinesCount) {
               this._options.maxLinesCount = count;
               this._inputControl.data('maxLinesCount', this._options.maxLinesCount);
            }
            this._options.minLinesCount = count;
            this._inputControl.data('minLinesCount', this._options.minLinesCount);
            this._inputControl.trigger('autosize.resize');
         }
      },
      /**
       * <wiTag group="Управление">
       * Установить максимальное количество отображаемых строк.
       * Метод позволяет изменить максимальное количество отображаемых строк текстового поля, установленное опцией {@link maxLinesCount}.
       * @param {Number} count Количество строк.
       * @example
       * Проверим максимальное количество отображаемых строк: не превышает ли оно пяти. Если превышает, то установим значение в 5 строк.
       * <pre>
       *    var field = this.getTopParent().getChildControlByName('demoFieldText');
       *    if (field.getMaxVisibleLines() > 5) {
       *       //устанавливаем максимальное количество отображаемых строк
       *       field.setMaxVisibleLines(5);
       *    }
       * </pre>
       * @see minLinesCount
       * @see maxLinesCount
       * @see getMinVisibleLines
       * @see getMaxVisibleLines
       * @see setMinVisibleLines
       */
      setMaxVisibleLines: function(count) {
         if (this._options.autoHeight === true && typeof count === 'number') {
            if (count < this._options.minLinesCount) {
               this._options.minLinesCount = count;
               this._inputControl.data('minLinesCount', this._options.minLinesCount);
            }
            this._options.maxLinesCount = count;
            this._inputControl.data('maxLinesCount', this._options.maxLinesCount);
            this._inputControl.trigger('autosize.resize');
         }
      },
      /**
       * <wiTag group="Данные">
       * Получить минимальное количество отображаемых строк.
       * @returns {Number} Возвращает минимальное количество отображаемых строк текстового поля, заданных либо опцией {@link minLinesCount},
       * либо методом {@link setMinVisibleLines}.
       * @example
       * Проверим минимальное количество отображаемых строк: не превышает ли оно двух. Если превышает, то установим значение в 2 строки.
       * <pre>
       *    var field = this.getTopParent().getChildControlByName('demoFieldText');
       *    //получаем минимальное количество отображаемых строк
       *    if (field.getMinVisibleLines() > 2) {
       *       field.setMinVisibleLines(2);
       *    }
       * </pre>
       * @see minLinesCount
       * @see maxLinesCount
       * @see getMaxVisibleLines
       * @see setMaxVisibleLines
       * @see setMinVisibleLines
       */
      getMinVisibleLines: function() {
         if (this._options.autoHeight === true) {
            return this._options.minLinesCount;
         }
      },
      /**
       * <wiTag group="Данные">
       * Получить максимальное количество отображаемых строк.
       * @returns {Number} Возвращает максимальное количество отображаемых строк текстового поля, заданных либо опцией {@link maxLinesCount},
       * либо методом {@link setMaxVisibleLines}.
       * @example
       * Проверим максимальное количество отображаемых строк: не превышает ли оно пяти. Если превышает, то установим значение в 5 строк.
       * <pre>
       *    var field = this.getTopParent().getChildControlByName('demoFieldText');
       *    //получаем максимальное количество отображаемых строк
       *    if (field.getMaxVisibleLines() > 5) {
       *       field.setMaxVisibleLines(5);
       *    }
       * </pre>
       * @see minLinesCount
       * @see maxLinesCount
       * @see getMinVisibleLines
       * @see setMaxVisibleLines
       * @see setMinVisibleLines
       */
      getMaxVisibleLines: function() {
         if (this._options.autoHeight === true) {
            return this._options.maxLinesCount;
         }
      },

      _textAreaResize : function() {
         this._notifyOnSizeChanged(this, this);
      },
      _setValueInternal: function() {
         $ws.proto.FieldText.superclass._setValueInternal.apply(this, arguments);
         if (this._options.autoHeight) {
            this._inputControl.trigger('autosize.resize');
         }
         if (!this._firstSetValue) {
            this._container.removeClass('ws-invisible');
            this._firstSetValue = true;
         }
      },
      setEditAtPlace: function () {
         $ws.proto.FieldText.superclass.setEditAtPlace.apply(this, arguments);
         if (this._options.autoHeight && !this._editAtPlace) { // bugfix: ресайз области при показе во всплывающей панели
            this._inputControl.trigger('autosize.resize');
         }
      },

      /**
       * Обновление значения в текстовом поле при его изменении извне
       * @param {*} value новое значение
       * @private
       */
      _updateInPlaceValue: function (value) {
         if (this._editAtPlace) {
            if (this._options.editAtPlaceTooltip && !value) {
               value = this._options.editAtPlaceTooltip;
               this._editAtPlaceElement.addClass('editAtPlace-empty');
            } else {
               this._editAtPlaceElement.removeClass('editAtPlace-empty');
            }
            this._editAtPlaceHasAuto = !!value && (this._textAlign !== 'right');
            this.getContainer()
               .toggleClass('ws-editAtPlace-empty', !value)
               .toggleClass('ws-editAtPlace-autowidth', this._editAtPlaceHasAuto);
            var text = '';
            $ws.helpers.forEach((value||'').split('\n'), function (s) {
               text = text + '<div>' + $ws.helpers.escapeHtml(s.replace(/&/g, '&amp;').replace(/\s\s/g, ' &nbsp;')) + (s ? '' : '&nbsp;') + '</div>';
               // вставляем &nbsp; в div с пустой строкой, чтобы у него была ненулевая высота при отображении
            });
            this._editAtPlaceElementInner.html(text || '&nbsp;');
            if (!this._options.tooltip) {
               this._editAtPlaceElement.attr('title', value);
            }
         }
      },
      _setEditAtPlaceStyles: function() {
         this._editAtPlaceElementInner.css({
            'lineHeight': this._container.css('line-height')
         });
      },
      _firstSelect : function(){
         return true;
      },
      _dotTplFn: dotTplFn,
      _bindInternals : function(){
         this._inputControl = this._container.find("textarea");
         if (this._options.highlightLinks) {
            this._dataReview = this._container.find('.input-string-data-review');
         }
         this._createPlaceholder();
      },
      /**
       * Обработка клавиш. В многострочном поле enter должен служить только одной причине
       * @param {Event} event Объект события
       */
      _keyboardHover: function(event){
         if(event.shiftKey || event.altKey || event.ctrlKey)
            return true;
         event.stopPropagation();
         return true;
      },
      destroy: function() {
         this._inputControl instanceof $ && this._inputControl.trigger('autosize.destroy');
         $ws.proto.FieldText.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.FieldText;

});