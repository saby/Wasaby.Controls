/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!Controls/List/ListControl/ListView', [
   'Core/Control',
   'tmpl!Controls/List/ListControl/ListView',
   'js!Controls/List/ListControl/ListViewModel',
   'js!Controls/List/resources/utils/ItemsUtil',
   'tmpl!Controls/List/ListControl/ItemTemplate',
   'js!Controls/List/Controllers/ScrollWatcher',
   'css!Controls/List/ListControl/ListView'
], function (BaseControl,
             ListViewTpl,
             ListViewModel,
             ItemsUtil,
             defaultItemTemplate,
             ScrollWatcher
   ) {
   'use strict';

   var _private = {
      createListModel: function(cfg) {
         return new ListViewModel ({
            items : cfg.items,
            idProperty: cfg.idProperty,
            displayProperty: cfg.displayProperty,
            selectedKey: cfg.selectedKey
         })
      },

      onListChange: function() {
         this._forceUpdate();
      },

      topPlaceholderClassName: 'ws-ListView__topPlaceholder',
      bottomPlaceholderClassName: 'ws-ListView__bottomPlaceholder',
      topLoadTriggerClass: 'ws-ListView__topLoadTrigger',
      bottomLoadTriggerClass: 'ws-ListView__bottomLoadTrigger',
      topListTriggerClass: 'ws-ListView__topListTrigger',
      bottomListTriggerClass: 'ws-ListView__bottomListTrigger',
      triggerLoadOffset: 10,
      createScrollWatcher: function(container) {
         var
            children = container.children(),
            elements = {
               scrollContainer: container.closest('.scroll-container')
            };

         // TODO: когда будет возможность получить дом-элемент по имени - переписать этот код
         for (var i = 0; i < children.length; i++) {
            if (children[i].className === this.topPlaceholderClassName) {
               for (var k = 0; k < children[i].children.length; k++) {
                  if (children[i].children[k].className === this.topLoadTriggerClass) {
                     elements.topLoadTrigger = children[i].children[k];
                  }/* else if (children[i].children[k].className === this.topListTriggerClass) {
                     elements.topListTrigger = children[i].children[k];
                  }*/
               }
            } else if (children[i].className === this.bottomPlaceholderClassName) {
               for (var k = 0; k < children[i].children.length; k++) {
                  if (children[i].children[k].className === this.bottomLoadTriggerClass) {
                     elements.bottomLoadTrigger = children[i].children[k];
                  }/* else if (children[i].children[k].className === this.bottomListTriggerClass) {
                     elements.bottomListTrigger = children[i].children[k];
                  }*/
               }
            } else if (children[i].className === this.topListTriggerClass) {
               elements.topListTrigger = children[i];
            } else if (children[i].className === this.bottomListTriggerClass) {
               elements.bottomListTrigger = children[i];
            }
         }

         return new ScrollWatcher ({
            elements : elements
         })
      }

   };

   var ListView = BaseControl.extend(
      {
         _controlName: 'Controls/List/ListControl/ListView',

         _template: ListViewTpl,
         _defaultItemTemplate: defaultItemTemplate,

         constructor: function (cfg) {
            ListView.superclass.constructor.apply(this, arguments);
            this._onListChangeFnc = _private.onListChange.bind(this);
         },

         _beforeMount: function(newOptions) {
            if (newOptions.items) {
               this._listModel = _private.createListModel(newOptions);
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.items && (this._items != newOptions.items)) {
               this._listModel = _private.createListModel(newOptions);
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
         },

         _afterMount: function() {
            ListView.superclass._afterMount.apply(this, arguments);
            this._scrollWatcher = _private.createScrollWatcher(this._container);

            var self = this;
            this._scrollWatcher.subscribe('onLoadTriggerTop', function(){console.log('SCROLL LOAD TOP'); self._notify('onListTop');});
            this._scrollWatcher.subscribe('onLoadTriggertBottom', function(){console.log('SCROLL LOAD BOTTOM'); self._notify('onListBottom');});
            this._scrollWatcher.subscribe('onListTop', function(){console.log('LIST TOP');});
            this._scrollWatcher.subscribe('onListtBottom', function(){console.log('LIST BOTTOM');});
         },

         _onItemClick: function(e, dispItem) {
            var item, newKey;
            item = dispItem.getContents();
            newKey = ItemsUtil.getPropertyValue(item, this._options.idProperty);
            this._listModel.setSelectedKey(newKey);
         }
      });



   return ListView;
});