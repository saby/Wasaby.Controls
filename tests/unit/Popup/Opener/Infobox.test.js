define(
    [
       'Controls/Popup/InfoBox',
        'Controls/Popup/Previewer/OpenerTemplate'
    ],
    function (InfoBox, OpenerTemplate) {
       'use strict';
       var getInfoBoxConfig = function() {
          return {
             float: true,
             style: 'error',
             position: 'tl',
              template: OpenerTemplate
          };
       };

       var getInfoBoxWithConfig = function(config) {
          var infobox = new InfoBox(config);
          infobox.saveOptions(config);
          return infobox;
       };

       describe('Controls/Popup/InfoBox', function () {
          it('getConfig', () => {
             var config = getInfoBoxConfig();
             var Infobox = getInfoBoxWithConfig(config);
             var newConfig = InfoBox._private.getCfg(Infobox);

            assert.equal(newConfig.float, true);
            assert.equal(newConfig.style, 'error');
            assert.equal(newConfig.position, 'tl');
              assert.equal(newConfig.template, OpenerTemplate);

         });
      });
   }
);
