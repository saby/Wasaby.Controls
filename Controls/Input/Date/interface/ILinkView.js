define('Controls/Input/Date/interface/ILinkView', [
   'Types/entity',
   'Controls/Calendar/Utils'
], function(
   entity,
   dateControlsUtils
) {
   'use strict';

   /**
    * @interface Controls/Input/Date/interface/ILinkView
    * @public
    */
   var EMPTY_CAPTIONS = {
      NOT_SPECIFIED: rk('Не указан'),
      NOT_SELECTED: rk('Не выбран'),
      WITHOUT_DUE_DATE: rk('Бессрочно', 'ShortForm'),
      ALL_TIME: rk('Весь период')
   };

   return {
      getDefaultOptions: function() {
         return {

            /**
             * @name Controls/Input/Date/interface/ILinkView#style
             * @cfg {String} Display style of component.
             * @variant default Component display as default style.
             * @variant linkMain Component display as main link style.
             * @variant linkMain2 Component display as first nonaccent link style.
             * @variant linkAdditional Component display as third nonaccent link style.
             */
            style: 'default',

            linkClickable: true,

            /**
             * @name Controls/Input/Date/interface/ILinkView#showNextArrow
             * @cfg {Boolean} Display the control arrow to switch to the next period
             */
            showNextArrow: false,

            /**
             * @name Controls/Input/Date/interface/ILinkView#showPrevArrow
             * @cfg {Boolean} Display the control arrow to switch to the previous period
             */
            showPrevArrow: false,

            /**
             * @name Controls/Input/Date/interface/ILinkView#showDeleteButton
             * @cfg {Boolean} Enables or disables the display of the period clear button.
             */
            showDeleteButton: true,

            /**
             * @name Controls/Input/Date/interface/ILinkView#emptyCaption
             * @cfg {String} Text that is used if the period is not selected.
             */
            emptyCaption: EMPTY_CAPTIONS.NOT_SPECIFIED,

            /**
             * @name Controls/Input/Date/interface/ILinkView#captionFormatter
             * @cfg {Function} Caption formatting function.
             */
            captionFormatter: dateControlsUtils.formatDateRangeCaption
         };
      },

      EMPTY_CAPTIONS: EMPTY_CAPTIONS,

      getOptionTypes: function() {
         return {
            style: entity.descriptor(String).oneOf([
               'default',
               'linkMain',
               'linkMain2',
               'linkAdditional',
               'secondary'
            ]),
            showNextArrow: entity.descriptor(Boolean),
            showPrevArrow: entity.descriptor(Boolean),
            showDeleteButton: entity.descriptor(Boolean),
            emptyCaption: entity.descriptor(String),
            captionFormatter: entity.descriptor(Function)
         };
      }
   };
});
