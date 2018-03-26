define('Controls/Dropdown/resources/template/DropdownList',
   [
      'Core/Control',
      'tmpl!Controls/Dropdown/resources/template/DropdownList',
      'Controls/Dropdown/resources/MenuViewModel',
      'tmpl!Controls/Dropdown/resources/template/itemTemplate',
      'css!Controls/Dropdown/resources/template/DropdownList'
   ],
   function (Control, MenuItemsTpl, MenuViewModel, itemTemplate) {

      /**
       * Действие открытия прилипающего окна
       * @class Controls/Popup/Opener/Menu
       * @control
       * @public
       * @category Popup
       */
      var Menu = Control.extend([], {
         _template: MenuItemsTpl,
         _defaultItemTemplate: itemTemplate,
         _controlName: 'Controls/Dropdown/resources/template/DropdownList',
         constructor: function () {
            Menu.superclass.constructor.apply(this, arguments);
            this.resultHandler = this.resultHandler.bind(this);
            this._documentClickHandler = this._documentClickHandler.bind(this);

            //TODO Подписка на события вместе с логикой закрытия подменю переедет в попап
            document.addEventListener('mousedown', this._documentClickHandler);
            document.addEventListener('touchstart', this._documentClickHandler);
         },
         _beforeMount: function (newOptions) {
            if (newOptions.items) {
               this._listModel = new MenuViewModel({
                  items: newOptions.items,
                  rootKey: newOptions.rootKey || null,
                  selectedKeys: newOptions.selectedKeys,
                  keyProperty: newOptions.keyProperty,
                  itemTemplateProperty: newOptions.itemTemplateProperty,
                  nodeProperty: newOptions.nodeProperty,
                  parentProperty: newOptions.parentProperty
               });
            }
         },

         //TODO Логика открытия подменю переедет в попап
         _itemMouseEnter: function (event, item, hasChildren) {
            if (hasChildren) {
               var config = {
                  componentOptions: {
                     items: this._options.items,
                     itemTemplate: this._options.itemTemplate,
                     keyProperty: this._options.keyProperty,
                     parentProperty: this._options.parentProperty,
                     nodeProperty: this._options.nodeProperty,
                     selectedKeys: this._options.selectedKeys,
                     rootKey: item.get(this._options.keyProperty),
                     depth: this._options.depth + 1 //TODO когда будут готовы opener'ы, нужно проверять куда ушел фокус по ним. Сейчас связи OpenerTemplate->OpenerTemplate нет
                  },
                  corner: {
                     horizontal: 'right'
                  },
                  target: event.target
               };
               this._children['MenuOpener' + item.get(this._options.keyProperty)].open(config, this);
            }
         },
         //TODO Логика закрытия подменю переедет в попап
         _itemMouseOut: function (event, item) {
            var targetMenu = event.nativeEvent.relatedTarget && event.nativeEvent.relatedTarget.closest('.controls-DropdownList__popup'),
               targetDepth = targetMenu && parseInt(targetMenu.getAttribute('depth'), 10),
               childSubMenu = this._children['MenuOpener' + item.get(this._options.keyProperty)];

            if (!targetDepth) { //Увели мимо меню
               childSubMenu && childSubMenu.close(); //Скрываем открытое подменю
               if (this._options.depth !== 1) { //не с основного меню - закрываем открытых детей и текущее подменю
                  this._notify('sendResult', [['itemMouseOut', event]]);
                  this._notify('close');
               }
            }
            else if (this._options.depth >= targetDepth) { //Если увели на родителя или на другую запись в текущем меню - скрываем подменю
               childSubMenu && childSubMenu.close(); //Скрываем открытое подменю
            }
         },
         resultHandler: function (args) {
            switch (args[0]) {
               //Увели мышь мимо всех меню => сообщаем родительскому подменю что надо закрыться и закрываемся сами
               case 'itemMouseOut':
                  if (this._options.depth > 1) {
                     this._notify('sendResult', [['itemMouseOut', args[1]]]);
                     this._notify('close');
                  }
                  break;
               case 'itemClick':
                  this._notify('sendResult', [['itemClick', args[1], args[2]]]);
            }
         },
         _itemClickHandler: function (event, item) {
            this._notify('sendResult', [['itemClick', event, [item]]]); //TODO Баг/Фича с передачей аргументов в попап.
         },
         _footerClick: function (event) {
            this._notify('sendResult', [['footerClick', event]]);
         },
         _documentClickHandler: function (event) {
            //Если кликнули мимо меню - закрываемся
            if (!event.target.closest('.controls-DropdownList__popup')) {
               this._notify('close');
            }
         },
         destroy: function () {
            document.removeEventListener('mousedown', this._documentClickHandler);
            document.removeEventListener('touchstart', this._documentClickHandler);
            Menu.superclass.destroy.apply(this, arguments);
         }
      });

      return Menu;
   }
);