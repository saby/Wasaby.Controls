define([
   'Controls/Utils/getSVGIconURL'
], function(Util) {
   define('getSVGIconURLUtil', () => {
      define('getSVGIconURL', () => {
         it('returns url with external use svg syntax', () => {
            assert.equal(Util.getSVGIconURL('commonIcons/icon-done'), '/cdn/icons/commonIcons#icon-done');
         });

         it('returns original icon with incorrect syntax', () => {
            assert.equal(Util.getSVGIconURL('icon-done'), 'icon-done');
         });
      });
   });
});
