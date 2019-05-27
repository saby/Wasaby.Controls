define('Controls/Input/Date/LinkView', [
   'Core/Control',
   'Env/Env',
   'Controls/Calendar/Utils',
   'Controls/Date/model/DateRange',
   'Controls/interface/ILinkView',
   'wml!Controls/Input/Date/LinkView/LinkView',
   'css!theme?Controls/Input/Date/LinkView/LinkView'
], function(
   BaseControl,
   Env,
   CalendarControlsUtils,
   DateRangeModel,
   IDateLinkView,
   componentTmpl
) {
   'use strict';

   /**
    * A link button that displays the period. Supports the change of periods to adjacent.
    * <a href="/materials/demo-ws4-input-date-linkView">Demo examples.</a>.
    * @class Controls/Input/Date/LinkView
    * @extends Core/Control
    * @mixes Controls/interface/ILinkView
    * @control
    * @private
    * @category Input
    * @author Миронов А.Ю.
    * @demo Controls-demo/Input/Date/LinkView
    *
    */

   var _private = {
      styleMap: {
         default: {
            viewMode: 'selector',
            styleMode: 'secondary'
         },
         linkMain: {
            viewMode: 'link',
            styleMode: 'secondary'
         },
         linkMain2: {
            viewMode: 'link',
            styleMode: 'info'
         },
         linkAdditional: {
            viewMode: 'label',
            styleMode: null
         }
      },
      defaultStyleMap: {
         selector: 'secondary',
         link: 'secondary'
      },

      _updateCaption: function(self, options) {
         var opt = options || self._options;

         self._caption = opt.captionFormatter(
            self._rangeModel.startValue,
            self._rangeModel.endValue,
            opt.emptyCaption
         );
      },

      _updateStyles: function(self, options) {
         var changed = false;

         // TODO: remove style option https://online.sbis.ru/opendoc.html?guid=882c43d4-8f3c-4998-8660-bfa08fcef227
         if (options.style && self._options.style !== options.style) {
            self._viewMode = _private.styleMap[options.style].viewMode;
            self._styleMode = _private.styleMap[options.style].styleMode;
            changed = true;
         } else if (self._options.viewMode !== options.viewMode || self._options.styleMode !== options.styleMode) {
            self._viewMode = options.viewMode;
            self._styleMode = options.styleMode || _private.defaultStyleMap[options.viewMode];
            changed = true;
         }
         if (self._options.readOnly !== options.readOnly) {
            changed = true;
         }
         if (changed) {
            if (self._styleMode) {
               self._styleClass = 'controls-DateLinkView__style-';
               self._styleClass += self._styleMode;
            }
            if (options.readOnly) {
               self._styleClass +=  '_readOnly';
            }

            self._valueEnabledClass = options.readOnly ? '' : 'controls-DateLinkView__value-enabled';
         }
      }
   };

   var Component = BaseControl.extend({
      _template: componentTmpl,

      _rangeModel: null,
      _caption: '',
      _styleClass: null,
      _valueEnabledClass: null,
      _viewMode: null,
      _styleMode: null,

      constructor: function() {
         Component.superclass.constructor.apply(this, arguments);
         this._rangeModel = new DateRangeModel();
         CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged', 'rangeChanged']);
      },

      _beforeMount: function(options) {
         this._rangeModel.update(options);
         _private._updateCaption(this, options);
         _private._updateStyles(this, options);

         // TODO: remove style option https://online.sbis.ru/opendoc.html?guid=882c43d4-8f3c-4998-8660-bfa08fcef227
         if (options.style) {
            Env.IoC.resolve('ILogger').error('LinkView', rk('You should use viewMode and styleMode options instead of style option.'));
         }

         if (options.showPrevArrow || options.showNextArrow) {
            Env.IoC.resolve('ILogger').error('LinkView', rk('You should use prevArrowVisibility and nextArrowVisibility instead of showPrevArrow and showNextArrow'));
         }

         // clearButtonVisibility is option of clearButton visibility state

         if ((options.prevArrowVisibility && options.clearButtonVisibility) || (options.nextArrowVisibility && options.clearButtonVisibility)) {
            Env.IoC.resolve('ILogger').error('LinkView', rk('The Controls functional is not intended for showClearButton and showPrevArrow/showNextArrow options using in one time'));
         }
      },
      _beforeUpdate: function(options) {
         var changed = this._rangeModel.update(options);
         if (changed) {
            _private._updateCaption(this, options);
         }
         _private._updateStyles(this, options);
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
