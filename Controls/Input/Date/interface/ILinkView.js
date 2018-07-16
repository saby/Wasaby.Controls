define('Controls/Input/Date/interface/ILinkView', [
   'WS.Data/Type/descriptor',
   'SBIS3.CONTROLS/Utils/DateUtil'
], function(types, DateUtil) {
   'use strict';

   /**
    * mixin Controls/Input/Date/interface/ILinkView
    * @public
    */
   var EMPTY_CAPTIONS = {
      NOT_SPECIFIED: rk('Не указан'),
      NOT_SELECTED: rk('Не выбран'),
      WITHOUT_DUE_DATE: rk('Бессрочно'),
      ALL_TIME: rk('Весь период')
   };

   return {
      getDefaultOptions: function() {
         return {
            startValue: DateUtil.getStartOfMonth(new Date()),
            endValue: DateUtil.getEndOfMonth(new Date()),

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
            emptyCaption: EMPTY_CAPTIONS.NOT_SPECIFIED
         };
      },

      EMPTY_CAPTIONS: EMPTY_CAPTIONS,

      getOptionTypes: function() {
         return {
            style: types(String).oneOf([
               'default',
               'linkMain',
               'linkMain2',
               'linkAdditional'
            ]),
            showNextArrow: types(Boolean),
            showPrevArrow: types(Boolean),
            showDeleteButton: types(Boolean),
            emptyCaption: types(String)
         };
      }
   };
});
