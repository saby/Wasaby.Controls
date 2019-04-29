define(
   [
      'Controls/toolbars',
      'Types/entity',
      'Types/collection',
      'Types/source'
   ],
   (toolbars, entity, collection, sourceLib) => {
   describe('Toolbar', () => {
   let defaultItems = [
      {
         id: '1',
         title: 'Запись 1',
         parent: null,
         '@parent': null
      },
      {
         id: '2',
         title: 'Запись 2',
         parent: null,
         '@parent': true,
         icon: 'icon-Ezy',
         iconStyle: 'super'
      },
      {
         id: '3',
         title: 'Запись 3',
         icon: 'icon-medium icon-Doge icon-primary',
         parent: null,
         '@parent': null,
         showType: 2
      },
      {
         id: '4',
         title: 'Запись 4',
         buttonViewMode: 'link',
         parent: '2',
         '@parent': null,
         showType: 0
      },
      {
         id: '5',
         title: 'Запись 4',
         buttonViewMode: 'link'
      }
   ];

   let records = new collection.RecordSet({
      rawData: defaultItems
   });
   let config = {
      items: new sourceLib.Memory({
         idProperty: 'id',
         data: defaultItems
      }),
      parentProperty: 'parent',
      nodeProperty: '@parent'
   };
   let itemWithMenu = new entity.Model({
      rawData: defaultItems[1]
   });
   let itemWithOutMenu = new entity.Model({
      rawData: defaultItems[5]
   });
   let toolbar = new toolbars.View(config);

   toolbar._notify = (e, data) => {
      assert.equal(data[0].id, 'myTestItem');
      assert.equal(e, 'itemClick');
   };
   toolbar._children.menuOpener = {
      close: setTrue.bind(this, assert),
      open: setTrue.bind(this, assert)
   };
   toolbar._children.popupTarget = {
      _container: 'target'
   };

         describe('publicMethod', function() {
            it('check received state', () => {
               toolbar._beforeMount(config, null, records);
               assert.equal(toolbar._items, records);
               assert.equal(!!toolbar._needShowMenu, true);
               assert.equal(toolbar._menuItems.getCount(), 4);
               assert.equal(toolbar._popupOptions.opener, toolbar);
            });
            it('need show menu', function() {
               return new Promise((resolve) => {
                  toolbar._beforeMount({
                     keyProperty: 'id',
                     source: config.items
                  }).addCallback(() => {
                     assert.equal(!!toolbar._needShowMenu, true);
                     assert.equal(toolbar._menuItems.getCount(), 4);
                     assert.equal(toolbar._items.getCount(), defaultItems.length);
                     resolve();
                  });
               });
            });
            it('open menu', function() {
               toolbar._notify = (e) => {
                  assert.equal(e, 'menuOpened');
               };
               toolbar._children.menuOpener = {
                  close: setTrue.bind(this, assert),
                  open: setTrue.bind(this, assert)
               };
               toolbar._children.popupTarget = {
                  _container: 'target'
               };
               toolbar._showMenu();
            });
            it('click toolbar item', function() {
               let isNotify = false;
               toolbar._notify = (e) => {
                  assert.equal(e, 'itemClick');
                  isNotify = true;
               };
               toolbar._onItemClick({ stopPropagation: () => {} }, {
                  id: 'myTestItem',
                  get: () => {},
                  handler: () => {}
               });
               assert.equal(isNotify, true);
            });
            it('click item with menu', function() {
               let isNotify = false;
               let eventString = '';
               toolbar._beforeMount(config, null, records);
               let isHeadConfigCorrect = false;
               let standart = {
                  icon: 'icon-Ezy',
                  caption: 'Запись 2',
                  iconStyle: 'super'
               };
               let itemConfig = toolbars.View._private.generateItemPopupConfig(itemWithMenu, {}, toolbar);
               if (standart.caption === itemConfig.templateOptions.headConfig.caption &&
                  standart.icon === itemConfig.templateOptions.headConfig.icon &&
                  standart.iconStyle === itemConfig.templateOptions.headConfig.iconStyle) {
                  isHeadConfigCorrect = true;
               }
               assert.isTrue(isHeadConfigCorrect);
               toolbar._notify = (e) => {
                  eventString += e;
                  isNotify = true;
               };
               toolbar._onItemClick({ stopPropagation: () => {} }, itemWithMenu);
               assert.equal(eventString, 'menuOpeneditemClick');
               assert.equal(isNotify, true);
            });
            it('before update source', () => {
               defaultItems.push({
                  id: '10',
                  title: 'Запись 10'
               });
               return new Promise((resolve) => {
                  toolbar._beforeUpdate({
                     size: 's',
                     source: new sourceLib.Memory({
                        idProperty: 'id',
                        data: defaultItems
                     })
                  });
                  toolbar._sourceController._loader.addCallback(() => {
                     assert.equal(toolbar._items.getCount(), defaultItems.length);
                     resolve();
                  });
               });
            });
            it('menu item click', () => {
               let isMenuClosed = false;
               toolbar._nodeProperty = '@parent';
               toolbar._notify = (e) => {
                  assert.equal(e, 'itemClick');
               };
               toolbar._children.menuOpener.close = function() {
                  isMenuClosed = true;
               };
               toolbar._onResult({ action: 'itemClick', event: { name: 'event', stopPropagation: () => {} }, data: [itemWithMenu] });
            });
            it('menu not closed if item has child', function() {
               let isMenuClosed = false;
               toolbar._nodeProperty = '@parent';
               toolbar._children.menuOpener.close = function() {
                  isMenuClosed = true;
               };
               assert.equal(isMenuClosed, false);
            });
            it('item popup config generation', function() {
               var
                  testItem = new entity.Model({
                     rawData:
                     {
                        buttonViewMode: 'buttonViewMode',
                        popupClassName: 'popupClassName',
                        keyProperty: 'itemKeyProperty',
                        showHeader: 'showHeader',
                        icon: 'icon',
                        title: 'title',
                        iconStyle: 'iconStyle'
                     }
                  }),
                  testSelf = {
                     _options: {
                        size: 'size',
                        theme: 'default',
                        keyProperty: 'keyProperty'
                     },
                     _items: 'items'
                  },
                  testEvent = {
                     currentTarget: 'target'
                  },
                  config = {
                     className: 'controls-Toolbar__popup__icon_theme-default popupClassName',
                     corner: {
                        horizontal: 'left',
                        vertical: 'top'
                     },
                     horizontalAlign: {
                        side: 'right'
                     },
                     target: 'target',
                     templateOptions: {
                        headConfig: {
                           caption: 'title',
                           icon: 'icon',
                           iconStyle: 'iconStyle'
                        },
                        items: 'items',
                        rootKey: 'itemKeyProperty',
                        showHeader: 'showHeader'
                     }
                  };
               assert.deepEqual(toolbars.View._private.generateItemPopupConfig(testItem, testEvent, testSelf), config);
            });
            it('menu popup config generation', function() {
               var
                  testSelf = {
                     _options: {
                        theme: 'default',
                        size: 'size',
                        popupClassName: 'popupClassName',
                        itemTemplateProperty: 'itp'
                     },
                     _children: {
                        popupTarget: 'popupTarget'
                     },
                     _menuItems: 'menuItems'
                  },
                  config = {
                     className: 'controls-Toolbar__popup__list_theme-default popupClassName',
                     target: 'popupTarget',
                     templateOptions: {
                        items: 'menuItems',
                        itemTemplateProperty: 'itp'
                     }
                  };
               assert.deepEqual(toolbars.View._private.generateMenuConfig(testSelf), config);
            });
            it('toolbar closed by his parent', () => {
               let isMenuClosed = false;
               toolbar._nodeProperty = '@parent';
               toolbar._children.menuOpener.close = function() {
                  isMenuClosed = true;
               };
               toolbar._onResult({ action: 'itemClick', event: { name: 'event', stopPropagation: () => {} }, data: [itemWithOutMenu] });
               assert.equal(isMenuClosed, true, 'toolbar closed, but his submenu did not');
            });
            it('_closeHandler', () => {
               let isMenuClosed = false;
               toolbar._notify = (e, arr, bubl) => {
                  assert.equal(e, 'menuClosed', 'closeHandler is uncorrect');
                  assert.equal(bubl.bubbling, true, 'closeHandler is uncorrect');
               };
               toolbar._closeHandler();
            });
         });
         function setTrue(assert) {
            assert.equal(true, true);
         }
      });
   }
);
