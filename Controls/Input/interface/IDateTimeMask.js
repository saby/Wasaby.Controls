define('Controls/Input/interface/IDateTimeMask', [
   'WS.Data/Type/descriptor'
], function(
   types
) {

   /**
    * Interface for date/time inputs mask.
    *
    * @interface Controls/Input/interface/IDateTimeMask
    * @public
    */

   return {
      getDefaultOptions: function() {
         return {

            /**
             * @name Controls/Input/interface/IDateTimeMask#mask
             * @cfg {String} Data format.
             *
             * One of the listed mask must be choosen. Allowed mask chars:
             * <ol>
             *    <li>D - day.</li>
             *    <li>M - month.</li>
             *    <li>Y - year.</li>
             *    <li>H - hour.</li>
             *    <li>m - minute.</li>
             *    <li>s - second.</li>
             *    <li>U - millisecond.</li>
             *    <li>".", "-", ":", "/" - delimiters.</li>
             * </ol>
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM.YY'
             * @variant 'DD.MM'
             * @variant 'YYYY-MM-DD'
             * @variant 'YY-MM-DD'
             * @variant 'HH:mm:ss.UUU'
             * @variant 'HH:mm:ss'
             * @variant 'HH:mm'
             * @variant 'DD.MM.YYYY HH:mm:ss.UUU'
             * @variant 'DD.MM.YYYY HH:mm:ss'
             * @variant 'DD.MM.YYYY HH:mm'
             * @variant 'DD.MM.YY HH:mm:ss.UUU'
             * @variant 'DD.MM.YY HH:mm:ss'
             * @variant 'DD.MM.YY HH:mm'
             * @variant 'DD.MM HH:mm:ss.UUU'
             * @variant 'DD.MM HH:mm:ss'
             * @variant 'DD.MM HH:mm'
             * @variant 'YYYY-MM-DD HH:mm:ss.UUU'
             * @variant 'YYYY-MM-DD HH:mm:ss'
             * @variant 'YYYY-MM-DD HH:mm'
             * @variant 'YY-MM-DD HH:mm:ss.UUU'
             * @variant 'YY-MM-DD HH:mm:ss'
             * @variant 'YY-MM-DD HH:mm'
             * @variant 'YYYY'
             * @variant 'MM/YYYY'
             * @default 'DD.MM.YY'
             */
            mask: 'DD.MM.YY'
         };
      },

      getOptionTypes: function() {
         return {
            mask: types(String).oneOf([
               'DD.MM.YYYY',
               'DD.MM.YY',
               'DD.MM',
               'YYYY-MM-DD',
               'YY-MM-DD',
               'HH:mm:ss.UUU',
               'HH:mm:ss',
               'HH:mm',
               'DD.MM.YYYY HH:mm:ss.UUU',
               'DD.MM.YYYY HH:mm:ss',
               'DD.MM.YYYY HH:mm',
               'DD.MM.YY HH:mm:ss.UUU',
               'DD.MM.YY HH:mm:ss',
               'DD.MM.YY HH:mm',
               'DD.MM HH:mm:ss.UUU',
               'DD.MM HH:mm:ss',
               'DD.MM HH:mm',
               'YYYY-MM-DD HH:mm:ss.UUU',
               'YYYY-MM-DD HH:mm:ss',
               'YYYY-MM-DD HH:mm',
               'YY-MM-DD HH:mm:ss.UUU',
               'YY-MM-DD HH:mm:ss',
               'YY-MM-DD HH:mm',
               'YYYY',
               'MM/YYYY'
            ])
         };
      }
   };

});
