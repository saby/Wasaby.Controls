define(
   [
      'Controls/Dropdown/Opener',
      'Controls/Popup/Opener/BaseOpener'
   ],
   (Opener, BaseOpener) => {
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

         BaseOpener.isNewEnvironment = function() {
            return true;
         };


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
            let cfg = {
               templateOptions: {
                  items: {
                     each: () => {}
                  }
               }
            };
            Opener._private.setPopupOptions(opener, cfg);
            assert.isTrue(cfg.className === config.className);

            Opener._private.setTemplateOptions(opener, cfg);
            let isEqual = true;
            for (let key of Object.keys(config)) {
               if (config[key] !== cfg.templateOptions[key] && cfg.templateOptions[key] !== undefined) {
                  isEqual = false;
               }
            }
            assert.isTrue(isEqual);
         });
      });
   });
