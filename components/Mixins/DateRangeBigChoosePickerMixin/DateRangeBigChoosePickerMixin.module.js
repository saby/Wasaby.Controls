define('js!SBIS3.CONTROLS.DateRangeBigChoosePickerMixin', [
   'js!SBIS3.CONTROLS.DateRangeBigChoose',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'Core/core-instance'
], function (DateRangeBigChoose, DateUtil, cInstance) {
   /**
    * Миксин, умеющий отображать выпадающий вниз блок содержащий контрол SBIS3.CONTROLS.DateRangeBigChoose.
    * Используется только совместно с SBIS3.CONTROLS.DateRangeMixin(SBIS3.CONTROLS.RangeMixin) и SBIS3.CONTROLS.PickerMixin.
    * Связывает данные текущего контрола и открываемого в выпадающем блоке.
    * @mixin SBIS3.CONTROLS.DateRangeBigChoosePickerMixin
    * @public
    * @author Миронов Александр Юрьевич
    */

   var DateRangeBigChoosePickerMixin = /**@lends SBIS3.CONTROLS.DateRangeBigChoosePickerMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Режим выбора одной даты или диапазона дат
             * @variant range Режим выбора периода
             * @variant single Режим выбора одной даты
             */
            selectionMode: 'range',

            pickerConfig: {
               corner: 'tl',
               horizontalAlign: {
                  side: 'left'
               },
               verticalAlign: {
                  side: 'top'
               }
            }
         },

         _chooserControl: null
      },

      $constructor: function () {
         if (!(cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS.RangeMixin' ||
               cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS.DateRangeMixin')))) {
            throw new Error('RangeMixin or DateRangeMixin mixin is required');
         }
         if (!cInstance.instanceOfMixin(this, 'SBIS3.CONTROLS.PickerMixin')) {
            throw new Error('PickerMixin mixin is required');
         }
      },

      before: {
         showPicker: function () {
            if (this._chooserControl) {
               this._chooserControl.setRange(this.getStartValue(), this.getEndValue());
               if (this._options.selectionMode === 'range') {
                  this._chooserControl.applyYearState();
               }
            }
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
            self._chooserControl = new DateRangeBigChoose({
               parent: this._picker,
               element: element,
               startValue: this.getStartValue(),
               endValue: this.getEndValue(),
               rangeselect: this._options.selectionMode === 'range'
            });

            // Добавляем в пикер
            this._picker.getContainer().append(element);

            this._chooserControl.subscribe('onChoose', this._onChooserRangeChange.bind(this));
            this._chooserControl.subscribe('onCancel', this._onChooserClose.bind(this));
         }
      },

      around: {
         _modifyOptions: function (parentFunc, opts) {
            opts = parentFunc.call(this, opts);

            if (opts.selectionMode === 'single') {
               if (opts.startValue && !opts.endValue) {
                  opts.endValue = opts.startValue;
               } else if (opts.endValue && !opts.startValue) {
                  opts.endValue = opts.startValue;
               }
            }
            return opts
         },
         setStartValue: function (parentFnc, value, silent) {
            var changed = parentFunc.call(this, value, silent);
            if (opts.selectionMode === 'single') {
               this.setEndValue(value, silent);
            }
            return changed;
         },

         setEndValue: function (parentFnc, value, silent) {
            var changed = parentFunc.call(this, value, silent);
            if (opts.selectionMode === 'single') {
               this.setStartValue(value, silent);
            }
            return changed;
         }
      },

      _onChooserRangeChange: function (e, start, end) {
         if (this._options.selectionMode === 'single') {
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
