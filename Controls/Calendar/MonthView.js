define('Controls/Calendar/MonthView', [
   'Core/Control',
   'Core/core-merge',
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

   var MonthView = BaseControl.extend({
      _template: dotTplFn,
      _tableBodyTmpl: tableBodyTmpl,

      _dayTmpl: null,

      _month: null,
      _showWeekdays: null,
      _monthViewModel: null,

      _themeCssClass: '',

      _updateView: function(options) {

         // локализация может поменяться в рантайме, берем актуальный перевод месяцев при каждой инициализации компонента
         // В массиве дни недели находятся в таком же порядке как возвращаемые значения метода Date.prototype.getDay()
         // Перемещаем воскресение из начала массива в конец
         this._days = calendarUtils.getWeekdaysCaptions();
         
         this._month = options.month || new Date();
         this._month = DateUtil.normalizeMonth(this._month);
         this._showWeekdays = options.showWeekdays;
      },

      _beforeMount: function(options) {
         this._dayTmpl = options.dayTemplate || dayTmpl;

         // TODO: Тема для аккордеона. Временное решение, переделать когда будет понятно, как мы будем делать разные темы в рамках одной страницы.
         if (options.theme === 'accordion') {
            this._themeCssClass = 'controls-MonthView__accordionTheme';
         }

         this._updateView(options);
         this._monthViewModel = options.monthViewModel ? new options.monthViewModel(options) :  new MonthViewModel(options);
      },

      _beforeUpdate: function(newOptions) {
         this._updateView(newOptions);

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

   MonthView.getDefaultOptions = function() {
      return coreMerge({}, IMonth.getDefaultOptions());
   };

   MonthView.getOptionTypes = function() {
      return coreMerge({}, IMonth.getOptionTypes());
   };

   return MonthView;
});
