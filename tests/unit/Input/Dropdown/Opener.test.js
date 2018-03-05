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

         it('get opener list', () => {
            //первый раз загрузка
            opener._getOpenerList().addCallback(() => {
               //второй раз из кэша рекваера
               opener._getOpenerList().addCallback(() => {
                  assert.isTrue(true);

               });
            });
         });

         it('open', () => {
            opener._children.StickyOpener = {
               open: function(cfg) {
                  let compOptions = cfg.componentOptions;
                  assert.isTrue(compOptions.itemTemplate === 'itemTemplate' &&
                     compOptions.headTemplate === 'headTemplate' &&
                     compOptions.footerTemplate === 'footerTemplate');
               }
            };
            opener.open({componentOptions: {}});
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