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
            keyProperty: 'keyProperty',
            selectedKeys: 'selectedKeys',
            parentProperty: 'parentProperty',
            itemTemplateProperty: 'itemTemplateProperty',
            nodeProperty: 'nodeProperty',
            className: 'myClass',
            template: 'Controls/Dropdown/resources/template/DropdownList'
         };

         let opener = new Opener(config);
         opener._beforeMount(config);
         opener.saveOptions(config);


         it('check setter className option', () => {
            assert.equal(opener._options.className, config.className);
         });

         it('get template', () => {
            //первый раз загрузка
            opener._getTemplate(config).addCallback(() => {
               //второй раз из кэша рекваера
               opener._getTemplate(config).addCallback(() => {
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
            opener._setPopupOptions(cfg);
            assert.isTrue(cfg.className === config.className);

            opener._setComponentOptions(cfg);
            let isEqual = true;
            for (let key of Object.keys(config)) {
               if (config[key] !== cfg.componentOptions[key] && cfg.componentOptions[key] !== undefined) {
                  isEqual = false;
               }
            }
            assert.isTrue(isEqual);
         });
      })
   });