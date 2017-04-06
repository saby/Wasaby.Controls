define('js!SBIS3.CONTROLS.Button',
   [
      'Core/core-extend',
      'js!SBIS3.CONTROLS.Button/Button.compatible',
      'tmpl!SBIS3.CONTROLS.Button',
      'js!SBIS3.CONTROLS.Button/babelHelpers',
      'Core/tmpl/js/helpers2/entityHelpers',
      'Core/helpers/dom&controls-helpers',
      'css!SBIS3.CONTROLS.Button',
      'css!WS.Controls.Button/resources/ButtonCommonStyles'
   ],

   function (extend,
             Compatible,
             template,
             babelHelpers,
             entityHelpers,
             controlsHelpers) {

      'use strict';

      var Button = function () {
         babelHelpers.createClass(Button, [{
            key: '_controlName',
            get: function get() {
               return 'SBIS3.CONTROLS.Button';
            }
         }, {
            key: '_template',
            get: function get() {
               return template;
            }
         }, {
            key: '_container',
            get: function get() {
               return this.container;
            },
            set: function set(val) {
               if (this.container && !this.container.startTag && typeof(this.container.unbind) === 'function')
                  this.container.unbind();

               this.container = val;

               try{
                  this.container[0].wsControl = this;
               }catch (e){}

               this._initInnerAction();
            }
         }]);

         function Button(cfg) {
            babelHelpers.classCallCheck(this, Button);

            this._options = cfg;
            this._container = cfg.container;

            if (!this._container)
            {
               this._container = cfg.element;
            }
            var defaultInstanceData = controlsHelpers.getDefaultInstanceData(Button);
            this._options = controlsHelpers.mergeOptionsToDefaultOptions(Button, this._options, {_options:defaultInstanceData});

            this.deprecatedContr(cfg);

            this._thisIsInstance = true;

            this._publish('onActivated');
         }

         babelHelpers.createClass(Button, [{
            key: 'render',
            value: function render(redraw) {

               var decOptions = this._container ? entityHelpers.createRootDecoratorObject(this._options.id, true, this.getAttr('data-component'), {}) : {},
                  attributes = {};

               try {
                  var attrs = this._container.attributes||this._container[0].attributes;
                  for (var atr in attrs)
                  {
                     if (attrs.hasOwnProperty(atr))
                     {
                        var name = attrs[atr].name?attrs[atr].name:atr,
                           value = attrs[atr].value||attrs[atr];
                        decOptions[name] = attributes[name] = value;

                     }
                  }

               }catch(e){

               }

               //decOptions = entityHelpers.resolveDecOptionsClassMerge(decOptions, this._options, this._options);
               if (!this._options['class'])
               {
                  var className = (this._options['class']?this._options['class']+' ':'')+
                     (this._options['className']?this._options['className']+' ':'')+
                     (this._options['cssClassName']?this._options['cssClassName']+' ':'')+
                     (attributes['class']?attributes['class']+' ':'');
                  this._options['class'] = className;
               }

               decOptions['class'] = this._options['class'];
               decOptions['class'] += ' controls-Button ' + (this._options.enabled?' ws-enabled ':' ws-disabled ')+(this._options.visible?'':' ws-hidden ') +
                  (this._options.primary?' controls-Button__primary' : ' controls-Button__default')+" ";
//
               decOptions['disabled'] = this._options.enabled?undefined:'disabled';
               decOptions['tabindex'] = 0;
               this._options['config'] = decOptions['config'];

               var markup = this._template(this, decOptions);
               if (redraw) {
                  try {
                     var temp = $(markup);

                     $(this._container).before(temp);
                     $(this._container).remove();
                     this._container = temp;
                  }catch (e){}
               }
               return markup;
            }
         }, {
            key: '_initInnerAction',
            value: function _initInnerAction()
            {
               var self = this;

               if (window && this.container && !this.container.startTag) {
                  this.container.click(function (e) {
                     self._onClickHandler(e);
                  });
               }
            }
         }]);
         return Button;
      }();

      Object.assign(Button.prototype, Compatible);
      Button.extend = Button.prototype.extend;
      return Button;
   });