define(
   [
      'Controls/Popup/InfoBox'
   ],
   function(InfoBox) {

      'use strict';
      var getInfoBoxConfig = function() {
         return {
            float: true,
            style: 'error',
            position: 'tl',
            trigger: 'click',
            template: 'myTemplate'
         };
      };

      var getInfoBoxWithConfig = function(config) {
         var Infobox = new InfoBox(config);
         Infobox.saveOptions(config);
         return Infobox;
      };

      describe('Controls.Popup.InfoBox', () => {
         it('getConfig', () => {
            var config = getInfoBoxConfig();
            var Infobox = getInfoBoxWithConfig(config);

            assert.equal(Infobox._options.float, true);
            assert.equal(Infobox._options.style, 'error');
            assert.equal(Infobox._options.position, 'tl');
            assert.equal(Infobox._options.trigger, 'click');
            assert.equal(Infobox._options.template, 'myTemplate');

         });
      });
   }
);
