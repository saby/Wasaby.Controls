define('Controls/Input/Date/LinkView', [
   'Core/Control',
   'Core/IoC',
   'Controls/Calendar/Utils',
   'Controls/Date/model/DateRange',
   'Controls/Input/Date/interface/ILinkView',
   'wml!Controls/Input/Date/LinkView/LinkView',
   'css!theme?Controls/Input/Date/LinkView/LinkView'
], function(
   BaseControl,
   IoC,
   CalendarControlsUtils,
   DateRangeModel,
   IDateLinkView,
   componentTmpl
) {
   'use strict';

   /**
    * A link button that displays the period. Supports the change of periods to adjacent.
    *
    * @class Controls/Input/Date/LinkView
    * @extends Core/Control
    * @mixes Controls/Input/Date/interface/ILinkView
    * @control
    * @public
    * @category Input
    * @author Мироново А.Ю.
    * @demo Controls-demo/Input/Date/LinkView
    *
    */

   var _private = {
      _updateEnabled: function(self, readOnly) {
         if (self._options === readOnly) {
            return;
         }
         self._prevNextButtonsEnabledClass = 'controls-DateLinkView__prevNextButtons-';
         self._prevNextButtonsEnabledClass += readOnly ? 'disabled' : 'enabled';

         self._valueEnabledClass = 'controls-DateLinkView__value-';
         self._valueEnabledClass += readOnly ? 'disabled' : 'enabled';
      },

      _updateCaption: function(self, options) {
         var opt = options || self._options;

         self._caption = opt.captionFormatter(
            self._rangeModel.startValue,
            self._rangeModel.endValue,
            opt.emptyCaption
         );
      }
   };

   var Component = BaseControl.extend({
      _template: componentTmpl,

      _rangeModel: null,
      _caption: '',
      _prevNextButtonsEnabledClass: null,
      _valueEnabledClass: null,

      constructor: function() {
         Component.superclass.constructor.apply(this, arguments);
         this._rangeModel = new DateRangeModel();
         CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
      },

      _beforeMount: function(options) {
         this._rangeModel.update(options);
         _private._updateCaption(this, options);
         _private._updateEnabled(this, options.readOnly);

         if (options.showPrevArrow || options.showNextArrow) {
            IoC.resolve('ILogger').error('LinkView', rk('You should use prevArrowVisibility and nextArrowVisibility instead of showPrevArrow and showNextArrow'));
         }

         // clearButtonVisibility is option of clearButton visibility state

         if ((options.prevArrowVisibility && options.clearButtonVisibility) || (options.nextArrowVisibility && options.clearButtonVisibility)) {
            IoC.resolve('ILogger').error('LinkView', rk('The Controls functional is not intended for showClearButton and showPrevArrow/showNextArrow options using in one time'));
         }
      },
      _beforeUpdate: function(options) {
         var changed = this._rangeModel.update(options);
         if (changed) {
            _private._updateCaption(this, options);
         }
         _private._updateEnabled(this, options.readOnly);
      },

      shiftBack: function() {
         this._rangeModel.shiftBack();
         _private._updateCaption(this);
      },

      shiftForward: function() {
         this._rangeModel.shiftForward();
         _private._updateCaption(this);
      },

      _clearDate: function() {
         this._rangeModel.startValue = null;
         this._rangeModel.endValue = null;
      },

      _onClick: function() {
         this._notify('linkClick');
      },

      _beforeUnmount: function() {
         this._rangeModel.destroy();
      }
   });

   Component.EMPTY_CAPTIONS = IDateLinkView.EMPTY_CAPTIONS;

   Component.getDefaultOptions = IDateLinkView.getDefaultOptions;

   Component.getOptionTypes = IDateLinkView.getOptionTypes;

   return Component;
});
