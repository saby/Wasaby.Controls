
define('js!SBIS3.CONTROLS.RichEditor.ImagePanel',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.PopupMixin',
      'js!SBIS3.CORE.FileStorageLoader',
      'js!WS.Data/Di',
      'Core/helpers/fast-control-helpers',
      'html!SBIS3.CONTROLS.RichEditor.ImagePanel'
   ], function(CompoundControl, PopupMixin, FileStorageLoader, Di, fcHelpers, dotTplFn) {
      'use strict';

      var
         ImagePanel =  CompoundControl.extend([PopupMixin], {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  closeButton: true,
                  canMultiSelect: false
               }
            },
            _selectedTemplate: undefined,

            _modifyOptions: function(options) {
               options = ImagePanel.superclass._modifyOptions.apply(this, arguments);
               options.canMultiSelect = Di.resolve('ImageUploader').canMultiSelect;
               return options;
            },

            $constructor: function() {
               var
                  self = this;
               this._publish('onImageChange');
               this._container.find('.controls-ImagePanel__Button').wsControl = function() { return self; };
               this._container.find('.controls-ImagePanel__Button').on('click', this._buttonClickHandler.bind(this));
            },

            getFileLoader: function() {
               return Di.resolve('ImageUploader').fileLoader;
            },

            _buttonClickHandler: function(event) {
               var
                  target = $(event.delegateTarget);

               this._selectedTemplate =  target.attr('data-id');
               this.getFileLoader().startFileLoad(target, this._selectedTemplate == 4, this._options.imageFolder).addCallback(function(fileobj) {
                  this._notify('onImageChange', this._selectedTemplate, fileobj);
                  this.hide();
               }.bind(this))
            }
         });
      return ImagePanel;
   });