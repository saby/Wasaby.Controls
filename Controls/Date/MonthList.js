define('Controls/Date/MonthList', [
   'Core/Control',
   'Core/core-merge',
   'wml!Controls/Date/MonthList/MonthList',
   'Controls/Date/MonthList/CalendarSource',
   'wml!Controls/Date/MonthList/MonthListItem'
], function(
   BaseControl,
   coreMerge,
   template,
   CalendarSource
) {
   'use strict';

   /**
    * Прокручивающийся список с месяцами. Позволяет выбирать период.
    *
    * @class Controls/Calendar/DateRangePicker
    * @extends Core/Control
    * @author Миронов А.Ю.
    * @noShow
    */

   /*
      Этот компонент можно отдать прикладникам и использовать в разделе календаря на онлайне.
      Для этого надо предусмотреть api для кастомизации представления года и месяца, а так же возможность
      подмешивания пользовательских данных при рендеринге годов и месяцев.
    */
   var ModuleComponent = BaseControl.extend({
      _viewSource: null,
      _template: template,
      _page: 0,

      _startValue: null,
      _endValue: null,
      _selectionProcessing: false,
      _selectionBaseValue: null,
      _selectionHoveredValue: null,

      constructor: function() {
         ModuleComponent.superclass.constructor.apply(this, arguments);
      },

      _beforeMount: function(options) {
         this._page = 0;//options.month.getFullYear();
         this._viewSource = new CalendarSource({

            //monthSource: new MonthSource()
         });

         // TODO: портировать установку года и подскрол к нужному месяцу когда будет корректно работать навигация по курсору.
         // https://online.sbis.ru/opendoc.html?guid=f01aaceb-2c7e-4a19-9a86-2d59c5419254

         // this._startValue = options.startValue;
         // this._endValue = options.endValue;
         // this.selectionProcessing = options.selectionProcessing;
      },

      _beforeUpdate: function(options) {
         this._startValue = options.startValue;
         this._endValue = options.endValue;

         // this._selectionProcessing = options.selectionProcessing;
         // this._selectionBaseValue = options.selectionBaseValue;
         // this._selectionHoveredValue = options.selectionHoveredValue;
      },

      startValueChangedHandler: function(event, value) {
         // this._startValue = value;
         this._notify('startValueChanged', [value]);
      },

      endValueChangedHandler: function(event, value) {
         // this._endValue = value;
         this._notify('endValueChanged', [value]);
      },

      selectionChangedHandler: function(event, start, end) {
         this._notify('selectionChanged', [start, end]);
      }

   });

   ModuleComponent.getDefaultOptions = function() {
      return coreMerge({
         itemTemplate: 'wml!Controls/Date/MonthList/MonthListItem'
      }, {});
   };

   // ModuleComponent.getOptionTypes = function() {
   //    return coreMerge({
   //       // itemTemplate: types(String)
   //    }, {});
   // };

   return ModuleComponent;
});
