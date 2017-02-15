define('js!SBIS3.CONTROLS.DateRangeChoosePickerMixin', [
   'js!SBIS3.CONTROLS.DateRangeChoose',
   'js!SBIS3.CONTROLS.Utils.DateUtil',
   'Core/core-instance'
], function (DateRangeChoose, DateUtil, cInstance) {
   /**
    * Миксин, умеющий отображать выпадающий вниз блок содержащий контрол SBIS3.CONTROLS.DateRangeChoose.
    * Используется только совместно с SBIS3.CONTROLS.DateRangeMixin(SBIS3.CONTROLS.RangeMixin) и SBIS3.CONTROLS.PickerMixin.
    * Связывает данные текущего контрола и открываемого в выпадающем блоке.
    * @mixin SBIS3.CONTROLS.DateRangeChoosePickerMixin
    * @public
    * @author Миронов Александр Юрьевич
    */

   var DateRangeChoosePickerMixin = /**@lends SBIS3.CONTROLS.DateRangeChoosePickerMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Отобразить возможность выбора по месяцам. По умолчанию true.
             */
            showMonths: true,
            /**
             * @cfg {Boolean} Отобразить возможность выбора по кварталам. По умолчанию true.
             */
            showQuarters: true,
            /**
             * @cfg {Boolean} Отобразить возможность выбора по полугодиям. По умолчанию true.
             */
            showHalfyears: true,
            /**
             * @cfg {Boolean} Отобразить возможность выбора по годам. По умолчанию true.
             */
            showYears: true,

            /**
             * @cfg {Date|String} Дата, начиная с которой месяца будут отмечены зеленой галочкой.
             */
            checkedStart: null,
            /**
             * @cfg {Date|String} Дата, до которой месяца будут отмечены зеленой галочкой.
             */
            checkedEnd: null,

            /**
             * @cfg {String} CSS класс который будет установлен у выделенных иконок. По умолчанию - зеленая галочка.
             */
            checkedIconCssClass: 'icon-Yes icon-done',
            /**
             * @cfg {String} CSS класс который будет установлен у не выделенных иконок. По умолчанию - серая галочка.
             */
            uncheckedIconCssClass: 'icon-Yes icon-disabled',
            /**
             * @cfg {String} Подсказка которая будет отображаться у выделенных иконок. По умолчанию - 'Период отчетности закрыт'.
             */
            checkedIconTitle: rk('Период отчетности закрыт'),
            /**
             * @cfg {String} Подсказка которая будет отображаться у не выделенных иконок. По умолчанию - ''Период отчетности открыт'.
             */
            uncheckedIconTitle: rk('Период отчетности открыт'),

            /**
             * @cfg {Function} устанавливает функцию которая будет вызвана во время перерисовки компонента.
             * @remark
             * Аргументы функции:
             * <ol>
             *    <li>periods - Массив содержащий массивы из начала и конца периода</li>
             * </ol>
             * Функция должна вернуть массив элементов типа Boolean либо объект содержащих информацию об отображаемой
             * иконке {@link Icon} или Deferred, стреляющий таким объектом.
             * Если функция возвращает true, то будет отрисована иконка соответствующая опциям {@Link checkedIconCssClass} и
             * {@Link checkedIconTitle}. Если возвращает false, то иконки будут соответствовать опциям
             * {@Link uncheckedIconCssClass} и {@Link uncheckedIconTitle}. По умолчанию это зеленые и серые галочки.
             * Функция может вернуть объект содержащий онформацию о кастомных оконках.
             * { iconClass: 'icon-Yes icon-done',
             *   title: 'Период отчетности закрыт'
             *   }
             *
             * @see updateIcons
             */
            iconsHandler: null,

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
               this._chooserControl.updateIcons();
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
               element = $(['<div class="', this._cssRangeSlider.pickerContainer, '"></div>'].join(' '));

            this._picker.getContainer().empty();
            // Преобразуем контейнер в контролл DateRangeChoose и запоминаем
            self._chooserControl = new DateRangeChoose({
               parent: this._picker,
               element: element,
               startValue: this.getStartValue(),
               endValue: this.getEndValue(),
               showMonths: this._options.showMonths,
               showQuarters: this._options.showQuarters,
               showHalfyears: this._options.showHalfyears,
               showYears: this._options.showYears,
               checkedStart: this._options.checkedStart,
               checkedEnd: this._options.checkedEnd,
               checkedIconCssClass: this._options.checkedIconCssClass,
               uncheckedIconCssClass: this._options.uncheckedIconCssClass,
               checkedIconTitle: this._options.checkedIconTitle,
               uncheckedIconTitle: this._options.uncheckedIconTitle,
               iconsHandler: this._options.iconsHandler
            });

            // Добавляем в пикер
            this._picker.getContainer().append(element);

            this._chooserControl.subscribe('onChoose', this._onChooserRangeChange.bind(this));
         }
      },

      _onChooserRangeChange: function (e, start, end) {
         this.setRange(start, end);
         this.hidePicker();
      }
   };

   return DateRangeChoosePickerMixin;
});
