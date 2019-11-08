/**
 * Created by dv.zuev on 25.12.2017.
 */
define('Controls/Application',
   [
      'Core/Control',
      'wml!Controls/Application/Page',
      'Core/BodyClasses',
      'Env/Env',
      'UI/Base',
      'Controls/scroll',
      'Core/helpers/getResourceUrl',
      'Controls/decorator',
      'Controls/Application/SettingsController',
      'Controls/Utils/DOMUtil',
      'css!theme?Controls/Application/oldCss'
   ],

   /**
    * Корневой контрол для Wasaby-приложений. Служит для создания базовых html-страниц.
    * Подробнее читайте <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/controls-application/'>здесь</a>.
    *
    * @class Controls/Application
    * @extends Core/Control
    *
    * @mixes Controls/Application/BlockLayout/Styles
    *
    * @control
    * @public
    * @author Белотелов Н.В.
    */

   /*
    * Root component for WS applications. Creates basic html page.
    *
    * @class Controls/Application
    * @extends Core/Control
    *
    * @mixes Controls-demo/BlockLayouts/Index
    *
    * @control
    * @public
    * @author Белотелов Н.В.
    */

   /**
    * @name Controls/Application#staticDomains
    * @cfg {Number} Список, содержащий набор доменов для загрузки статики.
    * Список доменов решает задачу загрузки статических ресурсов с нескольких документов. Эти домены будут использоваться для создания путей для статических ресурсов и распределения загрузки для нескольких статических доменов.
    */

   /*
    * @name Controls/Application#staticDomains
    * @cfg {Number} The list of domains for distributing static resources. These domains will be used to create paths
    * for static resources and distribute downloading for several static domains.
    * There will be another way to propagate this data after this problem:
    * https://online.sbis.ru/opendoc.html?guid=d4b76528-b3a0-4b9d-bbe8-72996d4272b2
    */

   /**
    * @name Controls/Application#head
    * @deprecated Используйте {@link headJson}.
    * @cfg {Content} Дополнительное содержимое тега HEAD. Может принимать более одного корневого узла.
    */

   /*
    * @name Controls/Application#head
    * @deprecated Используйте {@link headJson}.
    * @cfg {Content} Additional content of HEAD tag. Can accept more than one root node
    */

   /**
    * @name Controls/Application#headJson
    * @deprecated Используйте одну из опций {@link scripts}, {@link styles}, {@link meta} или {@link links}.
    * @cfg {Content} Разметка, которая будет встроена в содержимое тега head.
    * Используйте эту опцию, чтобы подключить на страницу внешние библиотеки (скрипты), стили или шрифты.
    * @remark
    * Список разрешённых тегов: link, style, script, meta, title.
    * Список разрешённых атрибутов: rel, as, name, sizes, crossorigin, type, href, property, http-equiv, content, id, class.
    */

   /**
    * @name Controls/Application#scripts
    * @cfg {Content} Описание скриптов, которые будут вставлены в head страницы
    * <pre class="brush:xml">
    *     <ws:scripts>
    *        <ws:Array>
    *           <ws:Object type="text/javascript" src="/cdn/Maintenance/1.0.1/js/checkSoftware.js" data-pack-name="skip" async=""/>
    *        </ws:Array>
    *     </ws:scripts>
    * </pre>
    */

   /**
    * @name Controls/Application#meta
    * @cfg {Content} Позволяет описывать meta информацию страницы.
    * <pre class="brush:xml">
    *     <ws:meta>
    *        <ws:Array>
    *           <ws:Object name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE"/>
    *        </ws:Array>
    *     </ws:meta>
    * </pre>
    */

   /**
    * @name Controls/Application#links
    * @cfg {Content} Позволяет описывать ссылки на дополнительные ресурсы, которые необходимы при загрузке страницы.
    * <pre class="brush:xml">
    *     <ws:links>
    *        <ws:Array>
    *           <ws:Object rel="shortcut icon" href="{{_options.wsRoot}}img/themes/wi_scheme/favicon.ico?v=2" type="image/x-icon"/>
    *        </ws:Array>
    *     </ws:links>
    * </pre>
    */

   /**
    * @name Controls/Application#content
    * @cfg {Content} Разметка, которая будет встроена в содержимое тега body.
    */

   /*
    * @name Controls/Application#content
    * @cfg {Content} Content of BODY tag
    */

   /**
    * @name Controls/Application#scripts
    * @cfg {Content} Список JS-файлов, которые должны быть подключены на страницу. Скрипты встраиваются перед закрытием. Могут принимать более одного корневого узла.
    */

   /*
    * @name Controls/Application#scripts
    * @cfg {Content} Scripts, that will be pasted after content. Can accept more than one root node
    */

   /**
    * @name Controls/Application#appRoot
    * @cfg {String} Адрес к директории сервиса. Например, "/".
    * @remark
    * Значение опции задаётся относительно URL-адреса сервиса.
    * URL-адрес сервиса устанавливается через <a href="https://wi.sbis.ru/doc/platform/developmentapl/middleware/cloud-control/">Сервис управления облаком</a> в разделе "Структура облака".
    * Данная настройка попадает в свойство appRoot объекта window.wsConfig.
    */

   /*
    * @name Controls/Application#appRoot
    * @cfg {String} Path to application root url
    */

   /**
    * @name Controls/Application#resourceRoot
    * @cfg {String} Адрес к директории с ресурсами сервиса. Например, "/resources/".
    * @remark
    * Значение опции задаётся относительно URL-адреса сервиса.
    * URL-адрес сервиса устанавливается через <a href="https://wi.sbis.ru/doc/platform/developmentapl/middleware/cloud-control/">Сервис управления облаком</a> в разделе "Структура облака".
    * Данная настройка попадает в свойство resourceRoot объекта window.wsConfig.
    */

   /*
    * @name Controls/Application#resourceRoot
    * @cfg {String} Path to resource root url
    */

   /**
    * @name Controls/Application#wsRoot
    * @cfg {String} Путь к корню интерфейсного модуля WS.Core. Например, "/resources/WS.Core/".
    * @remark
    * Значение опции задаётся относительно URL-адреса сервиса.
    * URL-адрес сервиса устанавливается через <a href="https://wi.sbis.ru/doc/platform/developmentapl/middleware/cloud-control/">Сервис управления облаком</a> в разделе "Структура облака".
    * Данная настройка попадает в свойство wsRoot объекта window.wsConfig.
    */

   /*
    * @name Controls/Application#wsRoot
    * @cfg {String} Path to ws root url
    */

   /**
    * @name Controls/Application#beforeScripts
    * @cfg {Boolean} В значении true скрипты из опции {@link scripts} будут вставлены до других скриптов, созданных приложением.
    * @default false
    */

   /*
    * @name Controls/Application#beforeScripts
    * @cfg {Boolean} If it's true, scripts from options scripts will be pasted before other scripts generated by application
    * otherwise it will be pasted after.
    */

   /**
    * @name Controls/Application#viewport
    * @cfg {String} Атрибут содержимого мета-тега с именем "viewport".
    */

   /*
    * @name Controls/Application#viewport
    * @cfg {String} Content attribute of meta tag with name "viewport"
    */

   /**
    * @name Controls/Application#bodyClass
    * @cfg {String} Дополнительный CSS-класс, который будет задан для тега body.
    */

   /*
    * @name Controls/Application#bodyClass
    * @cfg {String} String with classes, that will be pasted in body's class attribute
    */

   /**
    * @name Controls/Application#title
    * @cfg {String} Значение опции встраивается в содержимое тега title, который определяет заголовок веб-страницы и подпись на вкладке веб-браузера.
    */

   /*
    * @name Controls/Application#title
    * @cfg {String} title of the tab
    */

   /**
    * @name Controls/Application#templateConfig
    * @cfg {Object} Все поля из этого объекта будут переданы в опции контента.
    */

   /*
    * @name Controls/Application#templateConfig
    * @cfg {Object} All fields from this object will be passed to content's options
    */

   /**
    * @name Controls/Application#compat
    * @deprecated Способы вставки старых контролов внутри нового окружения описаны в этой статье: {@link https://wi.sbis.ru/doc/platform/developmentapl/ws3/compound-wasaby/}
    * @cfg {Boolean} В значении true создаётся "слой совместимости" для работы с контролами из пространства имён SBIS3.CONTROLS/* и Lib/*.
    */

   /*
    * @name Controls/Application#compat
    * @deprecated There are several ways to use old controls in new environment: {@link https://wi.sbis.ru/doc/platform/developmentapl/ws3/compound-wasaby/}.
    * @cfg {Boolean} If it's true, compatible layer will be loaded
    */

   /**
    * @name Controls/Application#builder
    * @cfg {Boolean} В значении true разрешено создание статической html-страницы через <a href="https://wi.sbis.ru/doc/platform/developmentapl/development-tools/builder/#html_1">билдер</a>.
    * Необходимое условие создание таких страниц описано <a href="https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/controls-application/#static-html">здесь</a>.
    * @default false
    */

   /*
    * @name Controls/Application#builder
    * @cfg {Boolean} Allows to create static html with builder
    */

   /**
    * @name Controls/Application#builderCompatible
    * @cfg {Boolean} В значении true на странице загружается слой совместимости для работы с контролами из пространства имён SBIS3.CONTROLS/* и Lib/*.
    * Использование опции актуально, когда опция {@link builder} установлена в значение true.
    */

   /*
    * @name Controls/Application#builderCompatible
    * @cfg {Boolean} Will load compatible layer. Works only if builder option is true.
    */

   /**
    * @name Controls/Application#width
    * @cfg {String} Используется контролом Controls/popup:Manager.
    *
    * @css @font-size_App__body Font size of page body. This size inherits to other elements in page.
    */

   /*
    * @name Controls/Application#width
    * @cfg {String} Used by Controls.popup:Manager
    *
    * @css @font-size_App__body Font size of page body. This size inherits to other elements in page.
    */

   function(Base,
      template,
      BodyClasses,
      Env,
      UIBase,
      scroll,
      getResourceUrl,
      decorator,
      SettingsController,
      DOMUtils) {
      'use strict';

      var _private;

      _private = {

         /**
          * Перекладываем опции или recivedState на инстанс
          * @param self
          * @param cfg
          * @param routesConfig
          */
         initState: function(self, cfg) {
            self.templateConfig = cfg.templateConfig;
            self.compat = cfg.compat || false;
         },
         calculateBodyClasses: function() {
            // Эти классы вешаются в двух местах. Разница в том, что BodyClasses всегда возвращает один и тот же класс,
            // а TouchDetector реагирует на изменение состояния.
            // Поэтому в Application оставим только класс от TouchDetector

            var bodyClasses = BodyClasses().replace('ws-is-touch', '').replace('ws-is-no-touch', '');

            return bodyClasses;
         },

         // Generates JML from options array of objects
         translateJML: function JMLTranslator(type, objects) {
            var result = [];
            for (var i = 0; i < objects.length; i++) {
               result[i] = [type, objects[i]];
            }
            return result;
         },
         generateJML: function(links, styles, meta, scripts) {
            var jml = [];
            jml = jml.concat(_private.translateJML('link', links || []));
            jml = jml.concat(_private.translateJML('style', styles || []));
            jml = jml.concat(_private.translateJML('meta', meta || []));
            jml = jml.concat(_private.translateJML('script', scripts || []));
            return jml;
         },
         isHover: function(touchClass, dragClass) {
            return touchClass === 'ws-is-no-touch' && dragClass === 'ws-is-no-drag';
         }
      };

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
               src: true,
               name: true,
               sizes: true,
               crossorigin: true,
               type: true,
               href: true,
               property: true,
               'http-equiv': true,
               content: true,
               id: true,
               'class': true
            }
         };
      }

      var linkAttributes = {
         src: true,
         href: true
      };

      var Page = Base.extend({
         _template: template,

         /**
          * @type {String} Property controls whether or not touch devices use momentum-based scrolling for inner scrollable areas.
          * @private
          */
         _scrollingClass: 'controls-Scroll_webkitOverflowScrollingTouch',

         _dragClass: 'ws-is-no-drag',

         _getChildContext: function() {
            return {
               ScrollData: this._scrollData
            };
         },

         _scrollPage: function(ev) {
            this._children.scrollDetect.start(ev);
         },

         _resizePage: function(ev) {
            this._children.resizeDetect.start(ev);
         },
         _mousedownPage: function(ev) {
            this._children.mousedownDetect.start(ev);
         },
         _mousemovePage: function(ev) {
            this._children.mousemoveDetect.start(ev);
         },
         _mouseupPage: function(ev) {
            this._children.mouseupDetect.start(ev);
         },
         _touchmovePage: function(ev) {
            this._children.touchmoveDetect.start(ev);
         },
         _touchendPage: function(ev) {
            this._children.touchendDetect.start(ev);
         },
         _mouseleavePage: function(ev) {
            /**
             * Перемещение элементов на странице происходит по событию mousemove. Браузер генерирует его исходя из
             * доступных ресурсов, и с дополнительными оптимизациями, чтобы не перегружать систему. Поэтому событие не происходит
             * на каждое попиксельное смещение мыши. Между двумя соседними событиями, мышь проходит некоторое расстояние.
             * Чем быстрее перемещается мышь, тем больше оно будет.
             * Событие не происход, когда мышь покидает граници экрана. Из-за этого, элементы не могут быть перемещены в плотную к ней.
             * В качестве решения, генерируем событие mousemove, на момент ухода мыши за граници экрана.
             * Демо: https://jsfiddle.net/q7rez3v5/
             */
            this._children.mousemoveDetect.start(ev);
         },
         _updateClasses: function() {
            // Данный метод вызывается до построения вёрстки, и при первой отрисовке еще нет _children (это нормально)
            // поэтому сами детектим touch с помощью compatibility
            if (this._children.touchDetector) {
               this._touchClass = this._children.touchDetector.getClass();
            } else {
               this._touchClass = Env.compatibility.touch ? 'ws-is-touch' : 'ws-is-no-touch';
            }

            this._hoverClass = _private.isHover(this._touchClass, this._dragClass) ? 'ws-is-hover' : 'ws-is-no-hover';
         },

         _dragStartHandler: function() {
            this._dragClass = 'ws-is-drag';
            this._updateClasses();
         },

         _dragEndHandler: function() {
            this._dragClass = 'ws-is-no-drag';
            this._updateClasses();
         },

         _changeTouchStateHandler: function() {
            this._updateClasses();
         },

         /**
          * Код должен быть вынесен в отдельных контроллер в виде хока в 610.
          * https://online.sbis.ru/opendoc.html?guid=2dbbc7f1-2e81-4a76-89ef-4a30af713fec
          */
         _popupCreatedHandler: function() {
            this._isPopupShow = true;

            // На Ipad необходимо вызывать reflow в момент открытия окон для решения проблем с z-index-ами
            // https://online.sbis.ru/opendoc.html?guid=3f84a4bc-2973-497c-91ad-0165b5046bbc
            if (Env.detection.isMobileIOS) {
               DOMUtils.reflow();
            }

            this._changeOverflowClass();
         },

         _popupDestroyedHandler: function(event, element, popupItems) {
            if (popupItems.getCount() === 0) {
               this._isPopupShow = false;
            }

            this._changeOverflowClass();
         },

         _suggestStateChangedHandler: function(event, state) {
            this._isSuggestShow = state;

            this._changeOverflowClass();
         },

         /** ************************************************** */

         _changeOverflowClass: function() {
            if (Env.detection.isMobileIOS) {
               if (this._isPopupShow || this._isSuggestShow) {
                  this._scrollingClass = 'controls-Scroll_webkitOverflowScrollingAuto';
               } else {
                  this._scrollingClass = 'controls-Scroll_webkitOverflowScrollingTouch';
               }
            } else {
               this._scrollingClass = '';
            }
         },

         _checkDeprecatedOptions: function(opts) {
            if (opts.compat) {
               Env.IoC.resolve('ILogger').warn('Опция compat является устаревшей. Для вставки старых контролов внутри VDOM-ного окружения ' +
                'используйте один из способов, описанных в этой статье: https://wi.sbis.ru/doc/platform/developmentapl/ws3/compound-wasaby/');
            }
         },

         _beforeMount: function(cfg) {
            this._checkDeprecatedOptions(cfg);
            this.headTagResolver = this._headTagResolver.bind(this);
            this.BodyClasses = _private.calculateBodyClasses;
            this._scrollData = new scroll._scrollContext({ pagingVisible: cfg.pagingVisible });

            // translate arrays of links, styles, meta and scripts from options to JsonML format
            this.headJson = _private.generateJML(cfg.links, cfg.styles, cfg.meta, cfg.scripts);
            if (Array.isArray(cfg.headJson)) {
               this.headJson = this.headJson.concat(cfg.headJson);
            }
            this.headValidHtml = generateHeadValidHtml();

            var appData = UIBase.AppData.getAppData();
            this.RUMEnabled = cfg.RUMEnabled || appData.RUMEnabled || false;
            this.pageName = cfg.pageName || appData.pageName || '';
            this.resourceRoot = cfg.resourceRoot || Env.constants.resourceRoot;

            if (typeof window !== 'undefined') {
               if (document.getElementsByClassName('head-custom-block').length > 0) {
                  this.head = undefined;
                  this.headJson = undefined;
                  this.headValidHtml = undefined;
               }
            }
            this._updateClasses();

            SettingsController.setController(cfg.settingsController);
         },

         _beforeUpdate: function(cfg) {
            if (this._scrollData.pagingVisible !== cfg.pagingVisible) {
               this._scrollData.pagingVisible = cfg.pagingVisible;
               this._scrollData.updateConsumers();
            }
            this._updateClasses();
         },

         _afterUpdate: function(oldOptions) {
            var elements = document.getElementsByClassName('head-title-tag');
            if (elements.length === 1) {
               // Chrome на ios при вызове History.replaceState, устанавливает в title текущий http адрес.
               // Если после загрузки установить title, который уже был, то он не обновится, и в заголовке вкладки
               // останется http адрес. Поэтому сначала сбросим title, а затем положим туда нужное значение.
               if (Env.detection.isMobileIOS && Env.detection.chrome && oldOptions.title === this._options.title) {
                  elements[0].textContent = '';
               }
               elements[0].textContent = this._options.title;
            }
         },

         _getResourceUrl: function(str) {
            return getResourceUrl(str);
         },

         _headTagResolver: function(value, parent) {
            var newValue = decorator.noOuterTag(value, parent),
               attributes = Array.isArray(newValue) && typeof newValue[1] === 'object' &&
                  !Array.isArray(newValue[1]) && newValue[1];
            if (attributes) {
               for (var attributeName in attributes) {
                  if (attributes.hasOwnProperty(attributeName)) {
                     var attributeValue = attributes[attributeName];
                     if (typeof attributeValue === 'string' && linkAttributes[attributeName]) {
                        attributes[attributeName] = this._getResourceUrl(attributeValue);
                     }
                  }
               }
            }
            return newValue;
         },

         _keyPressHandler: function(event) {
            if (this._isPopupShow) {
               if (Env.constants.browser.safari) {
                  // Need to prevent default behaviour if popup is opened
                  // because safari escapes fullscreen mode on 'ESC' pressed
                  // TODO https://online.sbis.ru/opendoc.html?guid=5d3fdab0-6a25-41a1-8018-a68a034e14d9
                  if (event.nativeEvent && event.nativeEvent.keyCode === 27) {
                     event.preventDefault();
                  }
               }
            }
         }
      });

      Page.getDefaultOptions = function() {
         return {
            title: '',
            pagingVisible: false
         };
      };

      Page._theme = ['Controls/application'];

      return Page;
   });
