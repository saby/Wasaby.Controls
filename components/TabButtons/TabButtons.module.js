/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.TabButtons', ['js!SBIS3.CONTROLS.RadioGroupBase', 'js!SBIS3.CONTROLS.TabButton', 'css!SBIS3.CONTROLS.TabButtons'], function(RadioGroupBase, TabButton) {

   'use strict';

   /**
    * Контрол, отображающий корешки закладок
    * @class SBIS3.CONTROLS.TabButtons
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @author Крайнов Дмитрий Олегович
    */

   var TabButtons = RadioGroupBase.extend( /** @lends SBIS3.CONTROLS.TabButtons.prototype */ {
      $protected: {
         _options: {
            type: 'normal',
            hasMarker: true,
            allowChangeEnable: true
         }
      },

      $constructor: function() {
         if (!this._options.hasMarker){
            this.getContainer().addClass('controls-TabButton__whithout-marker');
         }
      },

      setAllowChangeEnable: function(allowChangeEnable){
         this._options.allowChangeEnable = allowChangeEnable;
      },
      isAllowChangeEnable: function(){
         return this._options.allowChangeEnable;
      },
      appendTab: function(newTab){
         this._options.items.push(newTab);
         this.reload();
      },
      applyEmptyState: function(){
         this.setSelectedKey(this.getCurrentTab());
      },
      disableTab: function(id){
         this.setTabEnabled(id, false);
      },
      enableTab: function(id){
         this.setTabEnabled(id, true);
      },
      getCurrentTab: function(){
         return this._options.selectedItem;
      },
      getCurrentTabControl: function(){
         var currentTabId = this.getCurrentTab();
         if (currentTabId){
            return this._getTabButtonById(currentTabId);
         }
      },
      getTabButton: function(id){
         var tabButton = this._getTabButtonById(id);
         if (tabButton){
            return tabButton.getContainer();
         }
      },
      getTabs: function(){
        return this._options.items;
      },
      hideTab: function(id){
         this.setTabVisible(id, false);
      },
      /**
       * Добавляет вкладку после указанной вкладки
       * @param {Object} newTab Конфигурация новой вкладки
       * @param {String} tabId ID вкладки после которой вставлять
       * @example
       * <pre>
       *     tabButtons.insertTabAfter({id: 'id1', title: 'Tab 1'}, 'id2');
       * </pre>
       */
      insertTabAfter: function(newTab, tabId){
         var items = this.getTabs(),
            afterTabPosition = this._getTabButtonPosition(tabId);
         if (!afterTabPosition){
            return;
         }
         items.splice(afterTabPosition, 0, newTab);
         this.reload();
      },
      prependTab: function(tab){
         this._options.items.unshift(tab);
         this.reload();
      },
      removeTab: function(id){
         var tabPosition = this._getTabButtonPosition(id);
         if (tabPosition){
            this._options.items.splice(tabPosition, 1);
            this.reload();
         }
      },
      setTabAlignment: function(id, align){
         var tabPosition = this._getTabButtonPosition(id);
         if (tabPosition){
            this._options.items[tabPosition].align = align;
         }
         this.reload();
      },
      setTabEnabled: function(tabId, enabled){
         var tabButton = this._getTabButtonById(tabId);
         if (tabButton){
            tabButton.setEnabled(enabled);
         }
      },
      setTabId: function(oldId, newId){
         var tabPosition = this._getTabButtonPosition(oldId);
         if (tabPosition){
            this._options.items[tabPosition].id = newId;
         }
         this.reload();
      },
      setTabVisible: function(id, visible){
         var tabButton = this._getTabButtonById(id);
         if (tabButton){
            tabButton.setVisible(visible);
         }
      },
      showTab: function(id){
         this.setTabVisible(id, true);
      },
      _getTabButtonById: function (id) {
         var controls = this.getChildControls();
         for (var i in controls) {
            if (controls.hasOwnProperty(i) && controls[i].getContainer().data('id') == id) {
               return controls[i];
            }
         }
      },
      _getTabButtonPosition: function(tabId){
         var position;
         $.each(this.getTabs(), function(i, tab){
            if (tab.id == tabId){
               position = i;
            }
         });
         return position;
      },
      _getItemTemplate : function() {
         return '<component data-component="SBIS3.CONTROLS.TabButton">' +
            '<option name="caption" value="{{=it.item.get(\"' + this._options.captionField + '\")}}"></option>'+
            '<option name="additionalText" value="{{=it.item.get(\'additionalText\')}}"></option>'+
            '<option name="size" value="{{=it.item.get(\'size\')}}"></option>'+
            '<option name="align" value="{{=it.item.get(\'align\')}}"></option>'+
            '</component>';
      }
   });

   return TabButtons;

});