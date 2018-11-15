define('Controls/Input/RichEditor/Controller/FormatModel', [
   'Core/core-simpleExtend',
   'Core/IoC',
   'WS.Data/Collection/RecordSet',
   'Controls/Input/RichArea/helpers/constants'
], function(cExtend, IoC, RecordSet, constantsHelper) {
   /**
    * Format model for RTE
    * Contains all current formats from selected text
    */

   return cExtend.extend({
      constructor: function(additionalFormats) {
         var formatsData = [];

         constantsHelper.defaultFormats.forEach(function(formatName) {
            formatsData.push({
               formatName: formatName,
               state: null
            });
         });

         for (var formatName in additionalFormats) {
            formatsData.push({
               formatName: formatName,
               state: null
            });
         }

         this._formats = new RecordSet({
            idProperty: 'formatName',
            rawData: formatsData
         });
      },

      /**
       * Function updates formats
       * @param formats
       */
      updateFormats: function(formats) {
         formats.forEach(function(format) {
            try {
               this._formats.getRecordById(format.formatName).set('state', format.state);
            } catch (e) {
               IoC.resolve('ILogger').error('Format with name ' + format.formatName + ' isn`t defined');
            }
         }, this);
      },

      getFormats: function() {
         return this._formats;
      }
   });
});
