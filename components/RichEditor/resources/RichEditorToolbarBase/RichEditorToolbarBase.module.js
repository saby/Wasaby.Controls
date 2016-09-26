define('js!SBIS3.CONTROLS.RichEditorToolbarBase', [
   'js!SBIS3.CONTROLS.ButtonGroupBase'
   ], function(ButtonGroupBase) {

   'use strict';

   var

      RichEditorToolbarBase = ButtonGroupBase.extend(/** @lends SBIS3.CONTROLS.RichEditorToolbarBase.prototype */{
         $protected : {
            _options : {
               items: undefined,
               defaultConfig: undefined,
               _canServerRender: true,
               activableByClick: false,
               linkedEditor: undefined,
               keyField: 'name', //по данному полю getItemInstance(keyField) обращаться к элементу тулбара
               /**
                * @cfg {Boolean} Открыт(true) или свёрнут(false) тулбар
                */
               expanded: true
            },
            _itemsContainer:  undefined,
            _handlersInstances: {
               undoRedo: undefined,
               node: undefined,
               format: undefined,
               source: undefined
            }
         },

         _modifyOptions: function(options) {
            options.items = this._prepareItems(options.items, options.defaultConfig, options.expanded);
            options = RichEditorToolbarBase.superclass._modifyOptions.apply(this, arguments);
            return options;
         },

         $constructor: function() {
            this._publish('onExpandedChange');
            this._itemsContainer = this._container.find('[class*="__itemsContainer"]');
            this._container.on('mousedown focus', this._blockFocusEvents);
            this._itemsContainer.on('mousedown focus', this._blockFocusEvents);
         },

         //в buttonGroupBase проставляет активность всем дочерним контролам, избавляемся от этого
         setEnabled: function(enabled){
            ButtonGroupBase.superclass.setEnabled.call(this, enabled);
         },
         /**
          * Связывает панель инструментов с богатым полем ввода
          * @param {obj} editor Экземпляр RichTextArea
          */
         setLinkedEditor: function(editor) {
            this._unbindEditor();
            this._options.linkedEditor = editor;
            this._bindEditor();
         },

         getLinkedEditor: function() {
            return  this._options.linkedEditor;
         },

         /**
          * Переключение видимости тулбара
          */
         toggleToolbar: function() {
            this.setExpanded(!this._options.expanded);
         },
         /**
          * Установка состояния тулбара (раскрыт/свёрнут)
          *@param {boolean} expanded видимость тулбара
          */
         //Переопределить в дочернем классе
         setExpanded: function(expanded){
            this._options.expanded = expanded;
            this._notify('onExpandedChange', expanded);
         },
         /**
          * Возвращает состояние тулбара (раскрыт/свёрнут)
          */
         getExpanded: function(){
            return this._options.expanded;
         },

         _unbindEditor: function() {
            var
               editor = this._options.linkedEditor;
            if (editor) {
               editor.unsubscribe('onUndoRedoChange', this._handlersInstances.undoRedo);
               editor.unsubscribe('onNodeChange', this._handlersInstances.node);
               editor.unsubscribe('onFormatChange', this._handlersInstances.format);
               editor.unsubscribe('onToggleContentSource', this._handlersInstances.source);
            }
         },

         _bindEditor: function() {
            var
               editor = this._options.linkedEditor;
            this._handlersInstances = {
               undoRedo: this._undoRedoChangeHandler.bind(this),
               node: this._nodeChangeHandler.bind(this),
               format: this._formatChangeHandler.bind(this),
               source: this._toggleContentSourceHandler.bind(this)
            };
            editor.subscribe('onUndoRedoChange', this._handlersInstances.undoRedo);
            editor.subscribe('onNodeChange', this._handlersInstances.node);
            editor.subscribe('onFormatChange', this._handlersInstances.format);
            editor.subscribe('onToggleContentSource', this._handlersInstances.source);
         },
         _undoRedoChangeHandler : function() {},

         _nodeChangeHandler : function() {},

         _formatChangeHandler : function() {},

         _toggleContentSourceHandler: function() {},

         _blockFocusEvents: function(event) {
            var eventsChannel = $ws.single.EventBus.channel('WindowChangeChannel');
            event.preventDefault();
            event.stopPropagation();
            //Если случился mousedown то нужно нотифицировать о клике, перебив дефолтное событие перехода фокуса
            if(event.type === 'mousedown') {
               eventsChannel.notify('onDocumentClick', event);
            }
         },

         _prepareItems: function (userItems, defaultConfig) {
            var
               items,
               deleteIdexes = [];
            items = $ws.core.clone(defaultConfig);
            //мерж массивов
            for (var i in userItems){
               if (userItems.hasOwnProperty(i)) {
                  var
                     inDefault = false;
                  for (var j in defaultConfig) { //бегаем по default чтобы не бегать по только что добавленным
                     if (items.hasOwnProperty(j)) {
                        if (items[j].name == userItems[i].name) {
                           $ws.core.merge(items[j], userItems[i]);
                           inDefault = true;
                           break;
                        }
                     }
                  }
                  if (!inDefault) {
                     items.push(userItems[i]);
                  }
               }
            }
            for (var i in items) {
               if (items.hasOwnProperty(i)) {
                  items[i] = $ws.core.merge({
                     activableByClick: false
                  }, items[i]);

                  if(items[i].visible === false){
                     deleteIdexes.push(i);
                  }
               }
            }
            for (var i in deleteIdexes) {
               if (items.hasOwnProperty(i)) {
                  items.splice(deleteIdexes[i] - i, 1);
               }
            }
            return items;
         },

         /* Переопределяем получение контейнера для элементов */
         _getItemsContainer: function() {
            return this._itemsContainer;
         },

         destroy: function() {
            this._unbindEditor();
            this._handlersInstances = null;
            RichEditorToolbarBase.superclass.destroy.apply(this, arguments);
            this._itemsContainer = null;
         }
      });
   return RichEditorToolbarBase;
});