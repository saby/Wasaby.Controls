/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls-demo/Index', [
   'Core/Control',
   'Core/Deferred',
   'Core/LinkResolver/LinkResolver',
   'Env/Env',
   'wml!Controls-demo/Index',
   'Application/Initializer',
   'Application/Env',
   'css!Controls-demo/Demo/Page'
], function(BaseControl,
   Deferred,
   LinkResolver,
   Env,
   template,
   AppInit,
   AppEnv) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         backClickHdl: function() {
            window.history.back();
         },
         changeTheme: function(event, theme) {
            this._notify('themeChanged', [theme], { bubbling: true });
         },
         _beforeMount: function(options, context, receivedState) {
            this._title = this._getTitle();
            this._createLinkResolver();
            if (receivedState !== undefined) {
               this._correctTemplate = receivedState;
            } else {
               return this._checkTemplate().addCallback(function(isCorrectTemplate) {
                  this._correctTemplate = isCorrectTemplate;
                  return this._correctTemplate;
               }.bind(this));
            }
         },

         _createLinkResolver: function() {
            this.linkResolver = new LinkResolver(Env.cookie.get('s3debug') === 'true',
               Env.constants.buildnumber,
               Env.constants.wsRoot,
               Env.constants.appRoot,
               Env.constants.resourceRoot);
         },

         _checkTemplate: function() {
            var templateName = this._getTemplateName();
            var loadTplDef = new Deferred();
            if (templateName) {
               require([templateName], function(tpl){
                  loadTplDef.callback(!!tpl);
               }, function(e) {
                  loadTplDef.callback(null);
               });
               return loadTplDef;
            }
            return loadTplDef.callback(true);
         },

         _getTemplateName: function() {
            var location = this._getLocation();
            if (location) {
               var controlName = location.pathname.replace('/Controls-demo/app/', '').replace(/%2F/g, '/');
               return this._replaceLastChar(controlName);
            }
            return '';
         },

         _replaceLastChar: function(controlName) {
            if (controlName[controlName.length - 1] === '/') {
               return controlName.slice(0, -1);
            }
            return controlName;
         },

         _getTitle: function() {
            var location = this._getLocation();
            if (location) {
               var splitter = '%2F';
               var index = location.pathname.lastIndexOf(splitter);
               if (index > -1) {
                  var controlName = location.pathname.slice(index + splitter.length);
                  return this._replaceLastChar(controlName);
               }
            }
            return 'Wasaby';
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