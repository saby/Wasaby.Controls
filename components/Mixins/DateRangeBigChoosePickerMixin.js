define('SBIS3.CONTROLS/Mixins/DateRangeBigChoosePickerMixin', [
   'Core/core-instance',
   'Core/deprecated',
   'SBIS3.CONTROLS/Mixins/RangeSelectableViewMixin'
], function (cInstance, deprecated, RangeSelectableViewMixin) {
   /**
    * Миксин, умеющий отображать выпадающий вниз блок содержащий контрол SBIS3.CONTROLS.DateRangeBigChoose.
    * Используется только совместно с SBIS3.CONTROLS.DateRangeMixin(SBIS3.CONTROLS/Mixins/RangeMixin) и SBIS3.CONTROLS.PickerMixin.
    * Связывает данные текущего контрола и открываемого в выпадающем блоке.
    * @mixin SBIS3.CONTROLS/Mixins/DateRangeBigChoosePickerMixin
    * @public
    * @author Миронов А.Ю.
    */
   var selectionTypes = RangeSelectableViewMixin.selectionTypes;

   var DateRangeBigChoosePickerMixin = /**@lends SBIS3.CONTROLS/Mixins/DateRangeBigChoosePickerMixin.prototype  */{
      $protected: {
         _options: {

            /**
             * @cfg {String} Формат отображения данных в полях ввода
             * Допустимые символы в маске:
             * <ol>
             *    <li>D(day) - календарный день.</li>
             *    <li>M(month) - месяц.</li>
             *    <li>Y(year) - год.</li>
             *    <li>H(hour) - час.</li>
             *    <li>I - минута</li>
             *    <li>S(second) - секунда.</li>
             *    <li>U - доля секунды.</li>
             *    <li>".", "-", ":", "/" - разделители.</li>
             * </ol>
             * @example
             * <pre>
             *     <option name="mask">HH:II:SS.UUU</option>
             * </pre>
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM.YY'
             * @variant 'DD.MM'
             * @variant 'YYYY-MM-DD'
             * @variant 'YY-MM-DD'
             * @variant 'HH:II:SS.UUU'
             * @variant 'HH:II:SS'
             * @variant 'HH:II'
             * @variant 'DD.MM.YYYY HH:II:SS.UUU'
             * @variant 'DD.MM.YYYY HH:II:SS'
             * @variant 'DD.MM.YYYY HH:II'
             * @variant 'DD.MM.YY HH:II:SS.UUU'
             * @variant 'DD.MM.YY HH:II:SS'
             * @variant 'DD.MM.YY HH:II'
             * @variant 'DD.MM HH:II:SS.UUU'
             * @variant 'DD.MM HH:II:SS'
             * @variant 'DD.MM HH:II'
             * @variant 'YYYY-MM-DD HH:II:SS.UUU'
             * @variant 'YYYY-MM-DD HH:II:SS'
             * @variant 'YYYY-MM-DD HH:II'
             * @variant 'YY-MM-DD HH:II:SS.UUU'
             * @variant 'YY-MM-DD HH:II:SS'
             * @variant 'YY-MM-DD HH:II'
             * @variant 'YYYY'
             * @variant 'MM/YYYY'
             */
            mask: 'DD.MM.YY',

            /**
             * @cfg {String} Режим выбора одной даты или диапазона дат
             * @variant range Режим выбора периода
             * @variant single Режим выбора одной даты
             */
            selectionType: selectionTypes.range,

            /**
             * @cfg {String} Минимальный квант
             * @variant day День
             * @variant month Месяц
             */
            minQuantum: 'day',

            pickerConfig: {
               corner: 'tl',
               horizontalAlign: {
                  side: 'left'
               },
               verticalAlign: {
                  side: 'top'
               },
               bodyBounds: true,
               locationStrategy: 'bodyBounds',
               activateAfterShow: true,
               _canScroll: true
            },
            quantum: {}
         },

         _chooserControl: null
      },

      $constructor: function () {
         if (!(cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS/Mixins/RangeMixin' ||
               cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS/Mixins/DateRangeMixin')))) {
            throw new Error('RangeMixin or DateRangeMixin mixin is required');
         }
         if (!cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS/Mixins/PickerMixin')) {
            throw new Error('PickerMixin mixin is required');
         }
      },

      instead: {
         /**
          * Определение контента пикера. Переопределённый метод
          * @private
          */
         _setPickerContent: function () {
            var self = this,
               // Создаем пустой контейнер
               element = $('<div>');

            this._picker.getContainer().empty();
            // Преобразуем контейнер в контролл DateRangeChoose и запоминаем
            self._chooserControl = new this._chooserClass(this._getDateRangeBigChooseConfig(element));

            // Добавляем в пикер
            this._picker.getContainer().append(element);

            this._chooserControl.subscribe('onChoose', this._onChooserRangeChange.bind(this));
            this._chooserControl.subscribe('onCancel', this._onChooserClose.bind(this));
         }
      },

      around: {
         _modifyOptions: function (parentFunc, opts) {
            opts = parentFunc.call(this, opts);

            if (opts.selectionMode) {
               opts.selectionType = opts.selectionMode;
               deprecated.showInfoLog('Опция "selectionMode" помечена как deprecated и будет удалена. Используйте опцию "selectionType"');
            }

            if (opts.selectionType === selectionTypes.single) {
               if (opts.startValue && !opts.endValue) {
                  opts.endValue = opts.startValue;
               } else if (opts.endValue && !opts.startValue) {
                  opts.startValue = opts.endValue;
               }
            }
            return opts;
         },
         showPicker: function(parentFnc) {
            if (this._chooserControl) {
               this._chooserControl.setRange(this.getStartValue(), this.getEndValue());
               this._chooserControl.updateViewAfterShow();
               parentFnc.call(this);
               // см комментарий в updateViewAfterShow
               // this._chooserControl.updateViewAfterShow();
            } else {
               requirejs(['SBIS3.CONTROLS/Date/RangeBigChoose'], function(RangeChoose) {
                  this._chooserClass = RangeChoose;
                  parentFnc.call(this);
                  this._chooserControl.updateViewAfterShow();
               }.bind(this));
            }
         },
         setStartValue: function (parentFunc, value, silent) {
            var changed = parentFunc.call(this, value, silent);
            if (this._options.selectionType === 'single' && changed) {
               this.setEndValue(value, silent);
            }
            return changed;
         },

         setEndValue: function (parentFunc, value, silent) {
            var changed = parentFunc.call(this, value, silent);
            if (this._options.selectionType === 'single' && changed) {
               this.setStartValue(value, silent);
            }
            return changed;
         }
      },

      _getDateRangeBigChooseConfig: function (element) {
         return {
            parent: this._picker,
            element: element,
            startValue: this.getStartValue(),
            endValue: this.getEndValue(),
            mask: this._options.mask,
            emptyCaption: this._options.emptyCaption,
            selectionType: this._options.selectionType,
            quantum: this._options.quantum,
            serializationMode: this._options.serializationMode,
            minQuantum: this._options.minQuantum
         };
      },

      _onChooserRangeChange: function (e, start, end) {
         if (this._options.selectionType === 'single') {
            end = start;
         }
         this.setRange(start, end);
         this.hidePicker();
      },
      _onChooserClose: function(e) {
         this.hidePicker();
      }
   };

   return DateRangeBigChoosePickerMixin;
});
