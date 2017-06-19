define('js!WSControls/Text/TextBox',
   [
      'Core/core-extend',
      "Core/Abstract.compatible",
      'js!SBIS3.CORE.Control/Control.compatible',
      "js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible",
      'js!SBIS3.CORE.BaseCompatible',
      'js!WS.Data/Entity/InstantiableMixin',
      'tmpl!WSControls/Text/TextBox',
      'Core/core-functions',
      'tmpl!SBIS3.CONTROLS.TextBox/resources/textFieldWrapper',
      'js!SBIS3.CONTROLS.Utils.TemplateUtil',
      'css!SBIS3.CONTROLS.TextBox'
   ],

   function (extend,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             InstantiableMixin,
             template,
             functions,
             textFieldWrapper,
             TemplateUtil) {

      'use strict';

      var TextBox = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, InstantiableMixin],
         {
            _controlName: 'WSControls/Text/TextBox',
            _template: template,
            iWantVDOM: false,
            _isActiveByClick: false,


            constructor: function (cfg) {
               cfg.textFieldWrapper = TemplateUtil.prepareTemplate(cfg.textFieldWrapper || textFieldWrapper);
               cfg.afterFieldWrapper = TemplateUtil.prepareTemplate(cfg.afterFieldWrapper);
               this.deprecatedContr(cfg);
               this._publish('onPaste');
            },

            _containerReady: function() {

            },

            //<editor-fold desc="Event handlers">

            _onMouseClick: function (e) {
               if (!this._options.enabled) {
                  return;
               }
               this._onClickHandler(e);
               this._notify("onActivated", e);
            },

            _onMouseDown: function () {
               this._isActiveByClick = true;
            },

            _onMouseUp: function () {
               this._isActiveByClick = false;
            },

            _onKeyDown: function (e) {
               var result = this._notify('onKeyPressed', e);
               if (e.nativeEvent.key === 'Enter' && result !== false) {
                  this._onMouseClick(e);
               }
            },

            _onMouseEnter: function(e){
               this._notify('onMouseEnter', e);
            },

            _onMouseLeave: function(e){
               this._notify('onMouseLeave', e);
            }
            //</editor-fold>
         });

      return TextBox;
   });