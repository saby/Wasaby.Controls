define(
   [
      'Controls/Dropdown/Opener',
      'Controls/Popup/Opener/BaseOpener'
   ],
   (Opener, BaseOpener) => {
      describe('Dropdown/Opener', () => {
         let config = {
            popupOptions: {
               templateOptions: {
                  itemTemplate: 'itemTemplate',
                  headTemplate: 'headTemplate',
                  footerTemplate: 'footerTemplate',
                  keyProperty: 'keyProperty',
                  selectedKeys: 'selectedKeys',
                  parentProperty: 'parentProperty',
                  itemTemplateProperty: 'itemTemplateProperty',
                  nodeProperty: 'nodeProperty',
                  headConfig: {
                     icon: 'icon-small'
                  }
               },
               className: 'myClass'
            }
         };

         function getOpener(openerConfig) {
            let opener = new Opener(openerConfig);
            opener._beforeMount(openerConfig);
            opener._children.LoadingIndicator = {
               toggleIndicator: () => {}
            };
            opener.saveOptions(openerConfig);
            return opener;
         }

         BaseOpener.isNewEnvironment = function() {
            return true;
         };

         it('get template', () => {
            let opener = getOpener(config);
            let controllerName = 'Controls/Popup/Opener/Sticky/StickyController';

            // первый раз загрузка
            opener._requireModules(config, controllerName).addCallback(() => {
               // второй раз из кэша рекваера
               opener._requireModules(config, controllerName).addCallback(() => {
                  assert.isTrue(true);
               });
            });
         });

         it('open', () => {
            let opener = getOpener(config);
            opener._children.StickyOpener = {
               open: function(cfg) {
                  let compOptions = cfg.templateOptions;
                  assert.isTrue(compOptions.itemTemplate === 'itemTemplate' &&
                     compOptions.headTemplate === 'headTemplate' &&
                     compOptions.footerTemplate === 'footerTemplate');
               }
            };
            opener.open({
               templateOptions: {
                  items: {
                     each: () => {}
                  }
               }
            });
         });

         it('check templates config', () => {
            let opener = getOpener(config);
            let cfg = {
               templateOptions: {
                  items: {
                     each: () => {}
                  }
               }
            };
            Opener._private.setPopupOptions(opener, cfg);
            assert.isTrue(cfg.className === 'myClass');

            Opener._private.setTemplateOptions(opener, cfg);
            let isEqual = true;
            for (let key of Object.keys(config)) {
               if (config[key] !== cfg.templateOptions[key] && cfg.templateOptions[key] !== undefined) {
                  isEqual = false;
               }
            }
            assert.isTrue(isEqual);
         });

         it('checkIcons', function() {
            let opener = getOpener(config);
            Opener._private.checkIcons(opener, config);
            assert.deepEqual(config.popupOptions.templateOptions.iconPadding, { null: [null, 'icon-small'] });
            config.popupOptions.templateOptions.rootKey = 'testKey';
            Opener._private.checkIcons(opener, config);
            assert.deepEqual(config.popupOptions.templateOptions.iconPadding, { testKey: [null, 'icon-small'] });
         });
      });
   }
);
