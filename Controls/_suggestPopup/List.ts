/**
 * Created by am.gerasimov on 18.04.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_suggestPopup/List/List');
import clone = require('Core/core-clone');
import _SuggestOptionsField = require('Controls/_suggestPopup/_OptionsField');
import tmplNotify = require('Controls/Utils/tmplNotify');
import { constants } from 'Env/Env';
import scrollToElement = require('Controls/Utils/scrollToElement');


var DIALOG_PAGE_SIZE = 25;

var _private = {
   checkContext: function(self, context) {
      if (context && context.suggestOptionsField) {
         self._suggestListOptions = context.suggestOptionsField.options;

         if (self._suggestListOptions.dialogMode) {
            var navigation = clone(self._suggestListOptions.navigation);

            /* to turn on infinityScroll */
            navigation.view = 'infinity';
            if (!navigation.viewConfig) {
               navigation.viewConfig = {};
            }

            /* to show paging */
            navigation.viewConfig.pagingMode = true;
            navigation.sourceConfig.pageSize = DIALOG_PAGE_SIZE;
            self._navigation = navigation;
         } else {
            let stickyPosition = self._suggestListOptions.stickyPosition;

            self._navigation = self._suggestListOptions.navigation;
            self._reverseList = stickyPosition && stickyPosition.verticalAlign.side === 'top';
         }
      }
   },

   isTabChanged: function(options, tabKey) {
      var currentTabSelectedKey = options.tabsSelectedKey;
      return currentTabSelectedKey !== tabKey;
   },

   getTabKeyFromContext: function(context) {
      var tabKey = context && context.suggestOptionsField && context.suggestOptionsField.options.tabsSelectedKey;
      return tabKey !== undefined ? tabKey : null;
   },

   dispatchEvent: function(container, nativeEvent, customEvent) {
      customEvent.keyCode = nativeEvent.keyCode;
      container.dispatchEvent(customEvent);
   },

   scrollToFirstItem: function(self) {
      let
         list = self._children.list,
         listContainer = list._container[0] || list._container,
         itemsContainers = listContainer.getElementsByClassName('controls-ListView__itemV'),
         indexFirstItem = self._reverseList ? itemsContainers.length - 1 : 0;

      if (itemsContainers.length) {
         scrollToElement(itemsContainers[indexFirstItem], true);
      }
   }
};

/**
 * Container for list inside Suggest.
 * The detailed description and instructions on how to configure the control you can read <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/suggest/'>here</a>.
 *
 * @class Controls/_suggestPopup/List
 * @extends Core/Control
 * @author Герасимов Александр
 * @control
 * @public
 */
var List = Control.extend({

   _template: template,
   _notifyHandler: tmplNotify,
   _reverseList: false,
   _markedKey: null,
   _items: null

   _beforeMount: function(options, context) {
      this._searchEndCallback = this._searchEndCallback.bind(this);
      _private.checkContext(this, context);
   },

   _beforeUpdate: function(newOptions, context) {
      let
         self = this,
         oldReverseList = this._reverseList,
         tabKey = _private.getTabKeyFromContext(context);

      /* Need notify after getting tab from query */
      if (_private.isTabChanged(this._suggestListOptions, tabKey)) {
         this._notify('tabsSelectedKeyChanged', [tabKey]);
      }

      _private.checkContext(this, context);
   },

   _tabsSelectedKeyChanged: function(event, key) {
      /* It is necessary to separate the processing of the tab change by suggest layout and
       a user of a control.
       To do this, using the callback-option that only suggest layout can pass.
       Event should fired only once and after list was loading,
       because in this event user can change template of a List control. */
      this._suggestListOptions.tabsSelectedKeyChangedCallback(key);

      //FIXME remove after https://online.sbis.ru/opendoc.html?guid=5c91cf92-f61e-4851-be28-3f196945884c
      if (this._options.task1176635657) {
         this._notify('tabsSelectedKeyChanged', [key]);
      }
   },

   _inputKeydown: function(event, domEvent) {
      let
         items = this._items,
         itemsCount = items && items.getCount();

      if (this._markedKey === null && itemsCount && domEvent.nativeEvent.keyCode === constants.key.up) {
         let indexItem = this._reverseList ? 0 : itemsCount - 1;

         this._markedKey = items.at(indexItem).getId();
      } else {
         /* TODO will refactor on the project https://online.sbis.ru/opendoc.html?guid=a2e1122b-ce07-4a61-9c04-dc9b6402af5d
          remove list._container[0] after https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3 */
         let
            list = this._children.list,
            listContainer = list._container[0] || list._container,
            customEvent = new Event('keydown');

         _private.dispatchEvent(listContainer, domEvent.nativeEvent, customEvent);
      }
   },

   _searchEndCallback: function(result, filter) {
      if (this._suggestListOptions.searchEndCallback instanceof Function) {
         this._suggestListOptions.searchEndCallback(result, filter);
      }

      if (result) {
         this._items = result.data;
      }
   },

   _markedKeyChanged: function(event, key) {
      this._markedKey = key;
      this._notify('markedKeyChanged', [key]);
   },

   _drawItems: function() {
      // toDO До .500, пока не появится опция https://online.sbis.ru/opendoc.html?guid=301f9f1b-9036-4b9b-b25f-1c363d0d32ee
      _private.scrollToFirstItem(this);
   }
});

List.contextTypes = function() {
   return {
      suggestOptionsField: _SuggestOptionsField
   };
};

List._private = _private;

export = List;


