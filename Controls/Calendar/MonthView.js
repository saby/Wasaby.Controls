define('Controls/Calendar/MonthView', [
   'Core/Control',
   'Core/core-merge',
   'Core/helpers/Date/format',
   'Controls/Calendar/Utils',
   'Controls/Calendar/MonthView/MonthViewModel',
   'Controls/Utils/Date',
   'tmpl!Controls/Calendar/MonthView/MonthView',
   'tmpl!Controls/Calendar/MonthView/MonthViewTableBody',
   'tmpl!Controls/Calendar/MonthView/day',
   'Controls/Calendar/interface/IMonth',
   'i18n!SBIS3.CONTROLS/Calendar',
   'css!Controls/Calendar/MonthView/MonthView'
], function(
   BaseControl,
   coreMerge,
   formatDate,
   calendarUtils,
   MonthViewModel,
   DateUtil,
   dotTplFn,
   tableBodyTmpl,
   dayTmpl,
   IMonth
) {

   'use strict';

   /**
    * Календарь отображающий 1 месяц. У меет только отображать представление месяца и поддерживает события
    * взаимодействия пользователя с днями. Есть возможность переопределить конструктор модели и шаблон дня.
    * С помощью этого механизма можно кастомизировать отображение дней.
    * @class Controls/Calendar/MonthView
    * @extends Core/Control
    * @mixes Controls/Calendar/interface/IMonth
    * @control
    * @public
    * @author Миронов А.Ю.
    * @demo Controls-demo/Calendar/MonthView
    *
    */

   var _private = {
      _updateView: function(self, options) {
         var newMonth = options.month || new Date();

         // localization can change in runtime, take the actual translation of the months each time the component
         // is initialized. In the array, the days of the week are in the same order as the return values
         // of the Date.prototype.getDay () method.  Moving the resurrection from the beginning of the array to the end.
         self._days = calendarUtils.getWeekdaysCaptions();

         if (!DateUtil.isDatesEqual(newMonth, self._month)) {
            self._month = newMonth;
            if (options.showCaption) {
               self._caption = formatDate(self._month, options.captionFormat);
            }
         }
         self._month = DateUtil.normalizeMonth(self._month);
         self._showWeekdays = options.showWeekdays;
      }
   };

   var MonthView = BaseControl.extend({
      _template: dotTplFn,
      _tableBodyTmpl: tableBodyTmpl,

      _dayTmpl: null,

      _month: null,
      _showWeekdays: null,
      _monthViewModel: null,
      _caption: null,

      _themeCssClass: '',

      _beforeMount: function(options) {
         this._dayTmpl = options.dayTemplate || dayTmpl;

         // TODO: Тема для аккордеона. Временное решение, переделать когда будет понятно, как мы будем делать разные темы в рамках одной страницы.
         if (options.theme === 'accordion') {
            this._themeCssClass = 'controls-MonthView__accordionTheme';
         }

         _private._updateView(this, options);
         this._monthViewModel = options.monthViewModel ? new options.monthViewModel(options) : new MonthViewModel(options);
      },

      _beforeUpdate: function(newOptions) {
         _private._updateView(this, newOptions);

         this._monthViewModel.updateOptions(newOptions);
      },

      _dayClickHandler: function(event, item) {
         this._notify('itemClick', [item]);
      },

      _mouseEnterHandler: function(event, item) {
         this._notify('itemMouseEnter', [item]);
      }

      // cancelSelection: function () {
      //    var canceled = MonthView.superclass.cancelSelection.call(this);
      //    // if (canceled) {
      //    //    this._selectionType = null;
      //    // }
      //    return canceled;
      // }
   });

   MonthView._private = _private;

   MonthView.getDefaultOptions = function() {
      return coreMerge({}, IMonth.getDefaultOptions());
   };

   MonthView.getOptionTypes = function() {
      return coreMerge({}, IMonth.getOptionTypes());
   };

   return MonthView;
});
