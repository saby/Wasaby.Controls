/**
 * Created by ps.borisov on 18.07.2016.
 */

define('SBIS3.CONTROLS/RichEditor/Components/Toolbar', [
   "Core/core-merge",
   "SBIS3.CONTROLS/RichEditor/Components/ToolbarBase",
   "tmpl!SBIS3.CONTROLS/RichEditor/Components/Toolbar/RichEditorToolbar",
   "SBIS3.CONTROLS/RichEditor/Components/Toolbar/resources/config",
   'SBIS3.CONTROLS/RichEditor/Components/Toolbar/resources/ImagePanel/ImagePanel',
   'WS.Data/Di',
   "SBIS3.CONTROLS/WSControls/Buttons/Button",
   "SBIS3.CONTROLS/WSControls/Buttons/ToggleButton",
   'SBIS3.CONTROLS/Menu/MenuButton',
   'SBIS3.CONTROLS/ComboBox',
   'css!SBIS3.CONTROLS/RichEditor/Components/Toolbar/RichEditorToolbar',
   'css!SBIS3.CONTROLS/Button/ToggleButton/resources/ToggleButton__square',
   'css!SBIS3.CONTROLS/Menu/MenuIcon/MenuIcon'
], function( cMerge, RichEditorToolbarBase, dotTplFn, defaultConfig, ImagePanel, Di) {

   'use strict';

   var
      constants = {
         toolbarHeight: 32,
         DI_IMAGE_UPLOADER : 'ImageUploader'
      },
      /**
       * @class SBIS3.CONTROLS/RichEditor/Components/Toolbar
       * @extends SBIS3.CONTROLS/RichEditor/Components/ToolbarBase
       * @author Волоцкой В.Д.
       * @public
       * @control
       */
      RichEditorToolbar = RichEditorToolbarBase.extend(/** @lends SBIS3.CONTROLS/RichEditor/Components/Toolbar.prototype */{
         _dotTplFn: dotTplFn,
         $protected : {
            _options : {
               /**
                * @cfg {Object} Объект с настройками стандартных и пользовательских кнопок.
                * @remark
                * Стандартные кнопки мержатся с пользовательскими, последние в приоритете.
                * <br/>
                * Список стандартных кнопок:
                * <ol>
                *    <li>undo - шаг назад;</li>
                *    <li>redo - шаг вперед;</li>
                *    <li>styles - панель стилей;</li>
                *    <li>style - стиль текста;</li>
                *    <li>bold - полужирный;</li>
                *    <li>italic - курсив;</li>
                *    <li>underLine - подчеркнутый;</li>
                *    <li>strike - зачеркнутый;</li>
                *    <li>blockquote - цитата;</li>
                *    <li>align - выравнивание текста;</li>
                *    <li>color - цвет текста;</li>
                *    <li>list - вставить/Удалить список;</li>
                *    <li>link - вставить/редактировать ссылку;</li>
                *    <li>unlink - убрать ссылку;</li>
                *    <li>image - вставить картинку;</li>
                *    <li>smile - смайлики;</li>
                *    <li>source - html-разметка;</li>
                *    <li>paste - вставка с/без сохранением стилей;</li>
                *    <li>history - история ввода;</li>
                *    <li>codesample - вставка кода (ведутся работы);</li>
                * </ol>
                * Пользовательские кнопки задаются аналогично {@link SBIS3.CONTROLS/Mixins/ItemsControlMixin#items}.
                * <ul>
                *    <li>componentType - обязательный параметр, определяющий вид компонента</li>
                *    <li>name - имя компонента, по которому можно получить элемент тулбара.</li>
                * </ul>
                * @example
                * <pre>
                *    <options name="items" type="array">
                *       <options>
                *          <option name="name">myButton</option>
                *          <option name="componentType">SBIS3.CONTROLS/Button</option>
                *          <option name="icon" >sprite:icon-16 icon-Add icon-primary</option>
                *          <options name="handlers">
                *             <option name="onActivated" type="function">MyComponentName:prototype.myButtonClick</option>
                *          </options>
                *       </options>
                *    </options>
                * </pre>
                */
               items: undefined
            },
            _toggleToolbarButton: undefined,
            _itemsContainer:  undefined,
            _doAnimate: false,
            _textFormats: {
               title: false,
               subTitle: false,
               additionalText: false
            },
            _textAlignState: {
               alignleft: false,
               alignright: false,
               aligncenter: false,
               alignjustify: false
            },
            _styleBox: undefined,
            _fromFormatChange: false
         },

         init: function() {
            RichEditorToolbar.superclass.init.call(this);
            //Необходимо делать блокировку фокуса на пикере comboBox`a чтобы редактор не терял выделение
            //Делаем это при первом показе пикера
            this._setExpandedAnimateCallback = this._setExpandedAnimateCallback.bind(this);

            if (this.getItems().getRecordById('style')){
               this._styleBox = this.getItemInstance('style');
               this._pickerOpenHandler = this._pickerOpenHandler.bind(this);
               this._styleBox.once('onPickerOpen', this._pickerOpenHandler);
            }
         },

         _pickerOpenHandler: function() {
            this._styleBox._picker._container.on('mousedown focus', this._blockFocusEvents);
         },

         $constructor: function() {
            this._toggleToolbarButton = this._container.find('.controls-RichEditorToolbar__toggleButton').bind('click', this.toggleToolbar.bind(this));
            this._toggleToolbarButton.on('mousedown focus', this._blockFocusEvents);
         },

         _modifyOptions: function (options) {
            // Так как в конфиге используется локализация через rk(), то только сейчас:
            options.defaultConfig = defaultConfig();
            options = RichEditorToolbar.superclass._modifyOptions.apply(this, arguments);
            return options;
         },

         setExpanded: function(expanded) {
            if (!this._doAnimate) {
               this._doAnimate = true;
               this._settedExpanded = expanded;
               this._itemsContainer.animate(
               {
                  height: expanded ? constants.toolbarHeight : 0
               },
               'fast',
               this._setExpandedAnimateCallback
               );
               RichEditorToolbar.superclass.setExpanded.apply(this, arguments);
            }
         },
         _setExpandedAnimateCallback: function () {
            this._doAnimate = false;
            this._container.toggleClass('controls-RichEditorToolbar__hide', !this._settedExpanded);
         },

         _undoRedoChangeHandler : function(event, hasUndoRedo) {
            this._buttonSetEnabled('redo', hasUndoRedo.hasRedo);
            this._buttonSetEnabled('undo', hasUndoRedo.hasUndo)
         },

         _nodeChangeHandler : function(event, tinyEvent) {
            this._buttonSetEnabled('unlink', $(tinyEvent.element).closest('a').length);
         },

         _formatChangeHandler : function(event, obj, state) {
            switch (obj.format) {
               case 'bold':
               case 'italic':
               case 'underline':
               case 'strikethrough':
                  this._toggleState(state, obj);
                  break;
               case 'blockquote':
                  this._toggleState(state, obj);
                  break;
               case 'alignleft':
               case 'aligncenter':
               case 'alignright':
               case 'alignjustify':
                  this._updateTextAlignButtons(state, obj);
                  break;
               case 'title':
               case 'subTitle':
               case 'additionalText':
                  this._updateTextFormat(state, obj);
                  break;
               default: {
                  this._toggleState(state, obj);
               }
            }
         },

         _toggleState: function(state, obj) {
            var
               result = RichEditorToolbar.superclass._toggleState.apply(this, arguments);
            if (this.getItems().getRecordById(result.name) && this.getItemInstance(result.name)) {
                this.getItemInstance(result.name).setChecked(result.state);
            }
         },

         _updateTextAlignButtons: function(state, obj) {
            this._textAlignState[obj.format] = state;
            var
               button = this.getItemInstance('align');
            if (button) {
               var
                  align = 'alignleft';
               for (var a in this._textAlignState) {
                  if (this._textAlignState[a]) {
                     align = a;
                  }
               }
               button.setIcon(button.getItems().getRecordById(align).get('icon'));
            }
         },

         _updateTextFormat: function(state, obj) {
            this._textFormats[obj.format] = state;
            var
               button = this.getItemInstance('style');
            if (button) {
               var
                  textFormat = 'mainText';
               for (var tf in this._textFormats) {
                  if (this._textFormats[tf]) {
                     textFormat = tf;
                  }
               }
               this._fromFormatChange = true;
               button.setSelectedKey(button.getItems().getRecordById(textFormat).get('key'));
               this._fromFormatChange = false;
            }
         },

         _buttonSetEnabled: function(buttonName,enabled ) {
            this.getItemInstance(buttonName).setEnabled(enabled);
         },

         _toggleContentSourceHandler: function(event, state) {
            var buttons = this.getItemsInstances();

            if (state && !this._buttonsState) {
               this._buttonsState = {};
               for (var i in buttons) {
                  if (  buttons[i].getName() !== 'source') {
                     this._buttonsState[i] = buttons[i].isEnabled();
                     buttons[i].setEnabled(false);
                  }
               }
            } else if (this._buttonsState) {
               for (var j in this._buttonsState) {
                  if ( buttons[j].getName() !== 'source') {
                     buttons[j].setEnabled(this._buttonsState[j]);
                  }
               }
               this._buttonsState = undefined;
            }
         },

         _prepareItems: function(){
            var
               items = RichEditorToolbar.superclass._prepareItems.apply(this, arguments);
            for (var i in items) {
               if (items.hasOwnProperty(i)) {
                  items[i] = cMerge({
                     cssClassName: 'controls-RichEditorToolbar__item mce-',
                     tabindex: -1,
                     caption: '',
                     idProperty: 'key',
                     displayProperty: 'title'
                  }, items[i]);
               }
            }
            return items;
         },

         _unbindEditor: function() {
            var
               editor = this._options.linkedEditor;
            RichEditorToolbar.superclass._unbindEditor.apply(this, arguments);
            if (editor) {
               editor.unsubscribe('onUndoRedoChange', this._handlersInstances.undoRedo);
               editor.unsubscribe('onNodeChange', this._handlersInstances.node);
               editor.unsubscribe('onToggleContentSource', this._handlersInstances.source);
            }
         },

         _bindEditor: function() {
            var
               editor = this._options.linkedEditor;
            RichEditorToolbar.superclass._bindEditor.apply(this, arguments);

            this._handlersInstances.undoRedo = this._undoRedoChangeHandler.bind(this);
            this._handlersInstances.node = this._nodeChangeHandler.bind(this);
            this._handlersInstances.source = this._toggleContentSourceHandler.bind(this);

            if (this.getItems().getRecordById('undo') && this.getItems().getRecordById('redo')) {
               editor.subscribe('onUndoRedoChange', this._handlersInstances.undoRedo);
            }
            if (this.getItems().getRecordById('unlink')) {
               editor.subscribe('onNodeChange', this._handlersInstances.node);
            }
            if (this.getItems().getRecordById('source')) {
               editor.subscribe('onToggleContentSource', this._handlersInstances.source);
            }
         },

         getImagePanel: function(button){
            var
               self = this;
            //todo: https://online.sbis.ru/opendoc.html?guid=2842f4a3-d4b7-4454-a034-4051337f0e25&des=
            //кдалить проверку на destroyed после выполнения задачи
            if (!this._imagePanel || this._imagePanel.isDestroyed()) {
               var editor = this.getLinkedEditor();
               this._imagePanel = new ImagePanel({
                  parent: button,
                  opener: editor,
                  target: button.getContainer(),
                  verticalAlign: {
                     side: 'top',
                     offset: -10
                  },
                  horizontalAlign: {
                    side: 'right'
                  },
                  element: $('<div></div>'),
                  linkedEditor: editor,
                  imageFolder: editor._options.imageFolder
               });
               this.subscribeTo(this._imagePanel, 'onImageChange', function(event, key, fileobj){
                  self._insertImageTemplate(key, fileobj);
               });
            }
            return this._imagePanel;
         },

         /*БЛОК ФУНКЦИЙ ОБЁРТОК ДЛЯ ОТПРАВКИ КОМАНД РЕДАКТОРУ*/

         _setFontStyle: function(style) {
         //_fromFormatChange - означает, что формат сменился под курсором и не нужно применять стиль
            if (this._options.linkedEditor && !this._fromFormatChange) {
               this._options.linkedEditor.setFontStyle(style);
            }
         },

         _setTextAlign: function(align) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.setTextAlign(align);
            }
         },

         _setFontColor: function(color) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.setFontColor(color);
            }
         },

         _insertLink: function(onAfterCloseHandler, target) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.insertLink(onAfterCloseHandler, target);
            }
         },

         _insertSmile: function(smile) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.insertSmile(smile);
            }
         },

         _pasteFromBufferWithStyles: function(onAfterCloseHandler, target, saveStyles) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.pasteFromBufferWithStyles(onAfterCloseHandler, target, saveStyles);
            }
         },

         _toggleContentSource: function() {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.toggleContentSource();
            }
         },
         _insertImageTemplate: function(key, fileobj) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.insertImageTemplate(key, fileobj);
            }
         },

         _checkImageLoader: function(button){
            if (!Di.isRegistered(constants.DI_IMAGE_UPLOADER)) {
               button.hide();
            }
         },
         _openImagePanel: function(button){
            var
               imagePanel = this.getImagePanel(button);
            imagePanel.show();
         },
         /*БЛОК ФУНКЦИЙ ОБЁРТОК ДЛЯ ОТПРАВКИ КОМАНД РЕДАКТОРУ*/

         destroy: function() {
            this._toggleToolbarButton.unbind('click');
            this._toggleToolbarButton = null;
            if (this.getItems().getRecordById('style') && this._pickerOpenHandler) {
               this._styleBox.unsubscribe('onPickerOpen', this._pickerOpenHandler);
               this._pickerOpenHandler = null;
            }
            RichEditorToolbar.superclass.destroy.apply(this, arguments);
            this._itemsContainer = null;
            this._imagePanel = null;
         }

      });
   return RichEditorToolbar;
});
