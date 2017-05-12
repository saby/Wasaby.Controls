/**
 * Created by ps.borisov on 05.04.2017.
 */
define('js!SBIS3.CONTROLS.Utils.WrapFileOpener', [
   'Core/constants',
   'Core/helpers/additional-helpers'
], function (cConstants, additionalHlps) {


   var
      fileOpener = {

         linkClickHandler: function(event) {
            var
               target = $(event.target || event.srcElement);
            if( target && target[0] !== document && target[0].tagName !== 'HTML') {
               if (target.is('[data-open-file]')) {
                  additionalHlps.openFile(target.attr('data-open-file'));
                  event.preventDefault();
                  event.stopImmediatePropagation();
               }
            }
         }
      };

   if (cConstants.isBrowserPlatform) {
      document.addEventListener('click', fileOpener.linkClickHandler, true);
   }

   return fileOpener;
});

