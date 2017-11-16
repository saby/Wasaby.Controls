/**
 * Created by kraynovdo on 22.09.2017.
 */
define('js!Controls/List/ListControl/ListView', [
   'Core/Control',
   'tmpl!Controls/List/ListControl/ListView',
   'js!Controls/List/ListControl/ListViewModel',
   'js!Controls/List/resources/utils/ItemsUtil',
   'tmpl!Controls/List/ListControl/ItemTemplate',
   'css!Controls/List/ListControl/ListView'
], function (BaseControl,
             ListViewTpl,
             ListViewModel,
             ItemsUtil,
             defaultItemTemplate
   ) {
   'use strict';

   var ListView = BaseControl.extend(
      {
         _controlName: 'Controls/List/ListControl/ListView',

         _template: ListViewTpl,
         _defaultItemTemplate: defaultItemTemplate,

         constructor: function (cfg) {
            ListView.superclass.constructor.apply(this, arguments);
            this._onListChangeFnc = this._onListChange.bind(this);
         },

         _beforeMount: function(newOptions) {
            if (newOptions.items) {
               this._listModel = new ListViewModel ({
                  items : newOptions.items,
                  idProperty: newOptions.idProperty,
                  displayProperty: newOptions.displayProperty,
                  selectedKey: newOptions.selectedKey
               });
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.items && (this._items != newOptions.items)) {
               this._listModel = new ListViewModel ({
                  items : newOptions.items,
                  idProperty: newOptions.idProperty,
                  displayProperty: newOptions.displayProperty,
                  selectedKey: newOptions.selectedKey
               });
               this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
         },

         _getStartEnumerationPosition: function() {
            this._listModel.reset();
         },

         _getNextEnumerationPosition: function() {
            this._listModel.goToNext();
         },

         _checkConditionForEnumeration: function() {
            return this._listModel.isEnd();
         },

         _afterMount: function() {
            ListView.superclass._afterMount.apply(this, arguments);
            this._initPageLoadTriggers();
         },

         /**
          * Sets up IntersectionObserver that will notify
          * when scroll is at the beginning or the end of the list.
          *
          * @private
          */
         _initPageLoadTriggers: function () {
            var
               children = this._container.children(),
               topLoadTrigger, bottomLoadTrigger,
               topLoadTriggerClass = 'ws-ListView__topLoadTrigger',
               bottomLoadTriggerClass = 'ws-ListView__bottomLoadTrigger';

            // Find DOM elements
            // TODO: change when access by name is implemented
            for (var i = 0; i < children.length; i++) {
               if (children[i].className === topLoadTriggerClass) {
                  topLoadTrigger = children[i];
               }
               else if (children[i].className === bottomLoadTriggerClass) {
                  bottomLoadTrigger = children[i];
               }
            }

            // Setup intersection observer
            var self = this,
               observer = new IntersectionObserver(function(changes) {
                  for (var i = 0; i < changes.length; i++) {
                     if (changes[i].isIntersecting) {
                        switch (changes[i].target.className) {
                           case topLoadTriggerClass:
                              self._notify('onListTop');
                              break;
                           case bottomLoadTriggerClass:
                              self._notify('onListBottom');
                              break;
                        }
                     }
                  }
               }, {});
            observer.observe(topLoadTrigger);
            observer.observe(bottomLoadTrigger);
         },

         _onItemClick: function(e, dispItem) {
            var item, newKey;
            item = dispItem.getContents();
            newKey = ItemsUtil.getPropertyValue(item, this._options.idProperty);
            this._listModel.setSelectedKey(newKey);
         },

         _onListChange: function() {
            this._forceUpdate();
         }

      });



   return ListView;
});