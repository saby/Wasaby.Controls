define('Controls/Application/_Head',
   [
      'Core/Control',
      'Core/Deferred',
      'wml!Controls/Application/_Head',
      'Env/Env',
      'Application/Env',
      'Controls/_decorator/Markup/resolvers/noOuterTag',
      'Core/Themes/ThemesControllerNew'
   ],
   function(Base, Deferred, template, Env, AppEnv, noOuterTagResolver, ThemesControllerNew) {
      'use strict';

      // Component for <head> html-node, it contents all css depends

      function generateHeadValidHtml() {
         // Tag names and attributes allowed in the head.
         return {
            validNodes: {
               link: true,
               style: true,
               script: true,
               meta: true,
               title: true
            },
            validAttributes: {
               rel: true,
               as: true,
               name: true,
               sizes: true,
               crossorigin: true,
               type: true,
               href: true,
               'http-equiv': true,
               content: true,
               id: true,
               'class': true
            }
         };
      }

      function updateLink(link) {
         var updatedLink = link,
            resourceRoot = Env.constants.resourceRoot;
         if (link.indexOf(resourceRoot) === 0) {
            updatedLink = link.substr(resourceRoot.length);
            var moduleName = updatedLink.substr(0, updatedLink.indexOf('/')),
               moduleBuildNumber = moduleName && Env.constants.modules[moduleName] &&
                  Env.constants.modules[moduleName].buildnumber;
            updatedLink = resourceRoot + updatedLink + (moduleBuildNumber ? '?x_version=' + moduleBuildNumber : '');
         }
         return updatedLink;
      }

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

            if (typeof options.staticDomains === 'string') {
               this.staticDomainsStringified = options.staticDomains;
            } else if (options.staticDomains instanceof Array) {
               this.staticDomainsStringified = JSON.stringify(options.staticDomains);
            } else {
               this.staticDomainsStringified = '[]';
            }

            /*Этот коммент требует английского рефакторинга
            * Сохраним пользовательские данные на инстанс
            * мы хотим рендерить их только 1 раз, при этом, если мы ренедрим их на сервере мы добавим класс
            * head-custom-block */
            this.head = options.head;
            this.headJson = options.headJson;
            this.headValidHtml = generateHeadValidHtml();

            // Flag that the head block is built on server side.
            this.wasServerSide = false;
            if (typeof window !== 'undefined') {

               /*всем элементам в head назначается атрибут data-vdomignore
               * то есть, inferno их не удалит, и если в head есть спец элементы,
               * значит мы рендерились на сервере и здесь сейчас оживаем, а значит пользовательский
               * контент уже на странице и генерировать второй раз не надо, чтобы не было синхронизаций
               * */

               if (document.getElementsByClassName('head-custom-block').length > 0) {
                  this.head = undefined;
                  
                  // TODO: uncomment it before tests runs.
                  // this.headJson = undefined;
                  // this.headValidHtml = undefined;
               }

               if (document.getElementsByClassName('head-server-block').length > 0) {
                  // Element with right class name is already existed in "_beforeMount" hook on client side.
                  // All nodes in this block have true value of data-vdomignore attribute, so inferno never redraw them.
                  this.wasServerSide = true;
               }
               this.themedCss = [];
               this.simpleCss = [];
               return;
            }
            var headData = AppEnv.getStore('HeadData');
            var def = headData.waitAppContent();
            var self = this;
            var innerDef = new Deferred();
            self.cssLinks = [];
            def.addCallback(function(res) {
               self.newSimple = ThemesControllerNew.getInstance().getSimpleCssList();
               self.newThemed = ThemesControllerNew.getInstance().getThemedCssList();
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
         headTagResolver: function(value, parent) {
            var newValue = noOuterTagResolver(value, parent),
               attributes = Array.isArray(newValue) && typeof newValue[1] === 'object' &&
                  !Array.isArray(newValue[1]) && newValue[1];
            if (attributes) {
               for (var attributeName in attributes) {
                  if (attributes.hasOwnProperty(attributeName)) {
                     attributes[attributeName] = updateLink(attributes[attributeName]);
                  }
               }
            }
            return newValue;
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
