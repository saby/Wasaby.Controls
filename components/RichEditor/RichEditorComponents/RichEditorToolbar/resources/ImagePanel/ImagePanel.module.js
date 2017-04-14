define('js!SBIS3.CONTROLS.RichEditor.ImagePanel',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.PopupMixin',
      'js!SBIS3.CORE.LikeWindowMixin',
      'js!SBIS3.CORE.FileStorageLoader',
      'js!WS.Data/Di',
      'Core/helpers/fast-control-helpers',
      'html!SBIS3.CONTROLS.RichEditor.ImagePanel',
      "Core/EventBus",
      'css!SBIS3.CONTROLS.RichEditor.ImagePanel'
   ], function(CompoundControl, PopupMixin, LikeWindowMixin, FileStorageLoader, Di, fcHelpers, dotTplFn, EventBus) {
      'use strict';

      var
         COLLAGE_TEMPLATE = 4,
         ImagePanel =  CompoundControl.extend([PopupMixin, LikeWindowMixin], {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  windowTitle: 'Вставка изображения',
                  closeButton: true,
                  canMultiSelect: false,
                  corner: 'tr',
                  closeByExternalClick: true,
                  onlyTemplate: false
               }
            },
            _selectedTemplate: undefined,
            _buttonHandlerInstance: undefined,

            _modifyOptions: function(options) {
               options = ImagePanel.superclass._modifyOptions.apply(this, arguments);
               options.canMultiSelect = Di.resolve('ImageUploader').canMultiSelect;
               return options;
            },

            $constructor: function() {
               var
                  self = this;
               this._publish('onImageChange', 'onTemplateChange');
               this._buttonHandlerInstance = this._buttonClickHandler.bind(this);
               this._container.find('.controls-ImagePanel__Button').wsControl = function() { return self; };
               this._container.find('.controls-ImagePanel__Button').on('click', this._buttonHandlerInstance);
               this._container.on('mousedown focus', this._blockFocusEvents);
            },

            getFileLoader: function() {
               return Di.resolve('ImageUploader').getFileLoader(this.getParent());
            },
            _blockFocusEvents: function(event) {
               var eventsChannel = EventBus.channel('WindowChangeChannel');
               event.preventDefault();
               event.stopPropagation();
               //Если случился mousedown то нужно нотифицировать о клике, перебив дефолтное событие перехода фокуса
               if(event.type === 'mousedown') {
                  eventsChannel.notify('onDocumentClick', event);
               }
            },
            _onTargetChangeVisibility: function(){},
            _buttonClickHandler: function(event) {
               var
                  target = $(event.delegateTarget);
               this._selectedTemplate = target.attr('data-id');
               if (this._options.onlyTemplate) {
                  this._notify('onTemplateChange', this._selectedTemplate);
                  this.hide();
               } else {
                  this.getFileLoader().startFileLoad(target, this._selectedTemplate === COLLAGE_TEMPLATE, this._options.imageFolder).addCallback(function(fileobj) {
                     this._notify('onImageChange', this._selectedTemplate, fileobj);
                     this.hide();
                  }.bind(this))
               }
            },
            destroy: function() {
               this._container.find('.controls-ImagePanel__Button').off('click', this._buttonHandlerInstance);
               this._container.off('mousedown focus', this._blockFocusEvents);
               ImagePanel.superclass.destroy.apply(this, arguments);
            }
         });
      return ImagePanel;
   });