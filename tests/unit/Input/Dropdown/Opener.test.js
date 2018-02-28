define(
   [
      'Controls/Dropdown/Opener'
   ],
   (Opener) => {
      describe('Opener', () => {
         let config = {
            itemTemplate: 'itemTemplate',
            headTemplate: 'headTemplate',
            footerTemplate: 'footerTemplate',
            className: 'myClass'
         };

         let opener = new Opener(config);
         opener._beforeMount(config);
         opener.saveOptions(config);

         it('check setter className option', () => {
            assert.equal(opener._options.className, config.className);
         });

         it('check templates config', () => {
            let cfg = {
               componentOptions: {}
            };
            opener._prepareConfig(cfg);
            let compOptions = cfg.componentOptions;
            assert.isTrue(compOptions.itemTemplate === 'itemTemplate' &&
                          compOptions.headTemplate === 'headTemplate' &&
                          compOptions.footerTemplate === 'footerTemplate');
         });
      })
   });