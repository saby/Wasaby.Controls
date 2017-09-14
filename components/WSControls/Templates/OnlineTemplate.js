define('js!WSControls/Templates/OnlineTemplate',
   [
      'Core/Control',
      'tmpl!WSControls/Templates/OnlineTemplate',
      'Core/helpers/URLHelpers',
      'css!WSControls/Templates/OnlineTemplate',
      //TODO: Switch должен подключаться в шаблоне workspace
      'js!WSControls/Templates/Switch'
   ],

   function (Base, template, URLHelpers) {
      'use strict';

      var OnlineTemplate = Base.extend({
         _controlName: 'WSControls/Templates/OnlineTemplate',
         _template: template,
         iWantVDOM: true,
         _rightSideVisible: true,
         _compactMode: false,

         _beforeMount: function(cfg) {
            if (cfg.tabButtonsConfig) {
               this._currentTab = URLHelpers.getQueryParam('currentTab') || 0;
            }
            //TODO: как-то нормально прописывать путь до svg
            this._logoUrl = cfg.logoUrl ? cfg.logoUrl : 'components/WSControls/Templates/resources/logo.svg';
         },

         _beforeUpdate: function(cfg) {
            if (cfg.tabButtonsConfig) {
               this._currentTab = URLHelpers.getQueryParam('currentTab') || 0;
            }
         },

         _toggleRightSide: function() {
            this._rightSideVisible = !this._rightSideVisible;
         },
         _toggleLeftSide: function() {
            this._compactMode = !this._compactMode;
         },

         _onTabChange: function(e, tabId) {
            URLHelpers.setQueryParam('currentTab', tabId);
            this._currentTab = tabId;
         }
      });

      return OnlineTemplate;
   }
);