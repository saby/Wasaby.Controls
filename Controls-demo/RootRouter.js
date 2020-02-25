/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls-demo/RootRouter', [
   'Core/Control',
   'wml!Controls-demo/RootRouter',
   'Application/Initializer',
   'Application/Env',
   'css!Controls-demo/RootRouter'
], function(BaseControl,
            template,
            AppInit,
            AppEnv) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         isReloading: false,
         showMenu: true,
         pathName: 'Controls-demo/app/Controls-demo%2FIndexOld',
         reload: function() {
            this.isReloading = true;
            // ��� ���������� ����� ���������� ��� ��� ����� � settingsController (�������� �� application);
            // ����� ������ ��������� �� wi.sbis-doc
            //window.localStorage.setItem('controlSettingsStorage', '{}');
         },

         _afterMount: function() {
            window.reloadDemo = this.reload.bind(this);
         },

         _afterUpdate: function() {
            this.isReloading = false;
         },

         _isMenuButtonVisible: function() {
            var location = this._getLocation();
            if (location) {
               return location.pathname !== this._options.appRoot + this.pathName;
            }
            return null;
         },

         backClickHdl: function() {
            window.history.back();
         },

         goHomeHandler: function() {
            window.location = this._options.appRoot+this.pathName;
         },
         _getLocation: function() {
            if (AppInit.isInit()) {
               return AppEnv.location;
            } if (typeof window !== 'undefined') {
               return window.location;
            }
            return null;
         }
      }
   );

   return ModuleClass;
});
