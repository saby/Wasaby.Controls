define('Controls/Application/_Head',
   [
      'Core/Control',
      'Core/Deferred',
      'wml!Controls/Application/_Head',
      'View/Request'
   ],
   function(Base, Deferred, template, Request) {
      'use strict';

      // Component for <head> html-node, it contents all css depends

      var Page = Base.extend({
         _template: template,
         _beforeMountLimited: function() {
            // https://online.sbis.ru/opendoc.html?guid=252155de-dc95-402c-967d-7565951d2061
            // This component awaits completion of building content of _Wait component
            // So we don't need timeout of async building in this component
            // Because we need to build depends list in any case
            // before returning html to client
            return this._beforeMount.apply(this, arguments);
         },
         _beforeMount: function(options) {
            this.resolvedSimple = [];
            this.resolvedThemed = [];
            this._forceUpdate = function() {
               //do nothing
            };

            /*Этот коммент требует английского рефакторинга
            * Сохраним пользовательские данные на инстанс
            * мы хотим рендерить их только 1 раз, при этом, если мы ренедрим их на сервере мы добавим класс
            * head-custom-block */
            this.head = options.head;

            if (typeof window !== 'undefined') {

               /*всем элементам в head назначается атрибут data-vdomignore
               * то есть, inferno их не удалит, и если в head есть спец элементы,
               * значит мы рендерились на сервере и здесь сейчас оживаем, а значит пользовательский
               * контент уже на странице и генерировать второй раз не надо, чтобы не было синхронизаций
               * */
               if (document.getElementByClassName('head-custom-block').length > 0) {
                  this.head = undefined;
               }
               this.themedCss = [];
               this.simpleCss = [];
               return;
            }
            if (typeof options.staticDomains === 'string') {
               this.staticDomainsStringified = options.staticDomains;
            } else if (options.staticDomains instanceof Array) {
               this.staticDomainsStringified = JSON.stringify(options.staticDomains);
            } else {
               this.staticDomainsStringified = '[]';
            }
            var headData = Request.getCurrent().getStorage('HeadData');
            var def = headData.waitAppContent();
            var self = this;
            var innerDef = new Deferred();
            self.cssLinks = [];
            def.addCallback(function(res) {
               self.themedCss = res.css.themedCss;
               self.simpleCss = res.css.simpleCss;
               self.errorState = res.errorState;
               innerDef.callback(true);
               return res;
            });
            return innerDef;
         },
         _shouldUpdate: function() {
            return false;
         },
         isArrayHead: function() {
            return Array.isArray(this.head);
         },
         isMultiThemes: function() {
            return Array.isArray(this._options.theme);
         },
         getCssWithTheme: function(value, theme) {
            return value.replace('.css', '') + '_' + theme + '.css';
         }
      });

      return Page;
   }
);
