/**
 * Created by ps.borisov on 23.08.2016.
 */

define('js!SBIS3.CONTROLS.RichEditorRoundToolbar', [
   'js!SBIS3.CONTROLS.RichEditorToolbarBase',
   'html!SBIS3.CONTROLS.RichEditorRoundToolbar',
   'js!SBIS3.CONTROLS.RichEditorRoundToolbar/resources/config',
   'js!SBIS3.CONTROLS.FloatArea',
   'Core/helpers/string-helpers',
   'js!SBIS3.CONTROLS.StylesPanelNew',
   'js!SBIS3.CONTROLS.MenuIcon',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.StylesPanel',
   'css!SBIS3.CONTROLS.RichEditorRoundToolbar',
   'js!SBIS3.CONTROLS.IconButton'

], function(RichEditorToolbarBase, dotTplFn, defaultConfig, FloatArea, strHelpers , StylesPanel) {

   'use strict';
   var
      constants = {
         colorsMap: {
            'rgb(0, 0, 0)': 'black',
            'rgb(255, 0, 0)': 'red',
            'rgb(0, 128, 0)': 'green',
            'rgb(0, 0, 255)': 'blue',
            'rgb(128, 0, 128)': 'purple',
            'rgb(128, 128, 128)': 'grey'
         }
      },
      /**
       * @class SBIS3.CONTROLS.RichEditorRoundToolbar
       * @extends SBIS3.CONTROLS.RichEditorToolbarBase
       * @author Борисов П.С.
       * @public
       * @control
       */
      RichEditorRoundToolbar = RichEditorToolbarBase.extend(/** @lends SBIS3.CONTROLS.RichEditorRoundToolbar.prototype */{
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
                *    <li>styles - панель со стилями текста текста;</li>
                *    <li>toggle - переключение видимости редактора;</li>
                *    <li>list - вставить/Удалить список;</li>
                *    <li>link - вставить/редактировать ссылку;</li>
                *    <li>image - вставить картинку;</li>
                *    <li>smile - смайлики;</li>
                *    <li>history - история ввода.</li>
                * </ol>
                * Пользовательские кнопки задаются аналогично {@link SBIS3.CONTROLS.ItemsControlMixin#items}.
                * <ul>
                *   <li>componentType - обязательный параметр, определяющий вид компонента;</li>
                *   <li>name - имя компонента, по которому можно получить элемент тулбара;</li>
                *   <li>round - число-порядок сортировки элементов тулбара, по умолчанию 0;</li>
                *   <li>basic - остаётся ли элемент тулбара видимым при переключении выдимости, по умолчанию false.</li>
                * <ul>
                * @example
                * <pre>
                *    <options name="items" type="array">
                *       <options>
                *          <option name="name">myButton</option>
                *          <option name="round">100</option>
                *          <option name="basic">true</option>
                *          <option name="componentType">SBIS3.CONTROLS.Button</option>
                *          <option name="icon" >sprite:icon-16 icon-Add icon-primary</option>
                *          <options name="handlers">
                *             <option name="onActivated" type="function">js!MyComponentName:prototype.myButtonClick</option>
                *          </options>
                *      </options>
                *    </options>
                * </pre>
                */
               items: undefined,
               defaultConfig: defaultConfig,
               expanded: false,
               /**
                * @cfg {Boolean} Сторона с которой находится кнопка переключения видимости
                */
               side: 'right'
            },
            _buttons:{
               bold:false,
               italic:false,
               underline:false,
               strikethrough: false
            },
            _stylesPanel: undefined
         },

         _modifyOptions: function(options) {
            options.defaultConfig[0].order = options.side === 'right' ? 1000 : 1;
            options.defaultConfig[0].icon = options.side === 'right' ? 'sprite:icon-16 icon-View icon-primary' : 'sprite:icon-16 icon-ViewBack icon-primary';
            options = RichEditorRoundToolbar.superclass._modifyOptions.apply(this, arguments);
            return options;
         },

         setExpanded: function(expanded){
            var
               buttons = this.getItemsInstances(),
               toggleButton = this.getItemInstance('toggle'),
               icon = (expanded && this._options.side === 'right') || (!expanded && this._options.side === 'left') ? 'Back' : '';
            for (var button in buttons){
               if (buttons.hasOwnProperty(button)) {
                  if (!buttons[button]._options.basic) {
                     buttons[button].setVisible(expanded);
                  }
               }
            }
            toggleButton.setIcon('sprite:icon-16 icon-View' + icon + ' icon-primary');
            RichEditorRoundToolbar.superclass.setExpanded.apply(this, arguments);
         },

         _bindEditor: function() {
            RichEditorRoundToolbar.superclass._bindEditor.apply(this, arguments);
            this._fillHistory();
         },

         _formatChangeHandler : function(event, obj, state) {
            if (['bold', 'italic', 'underline', 'strikethrough'].includes(obj.format)) {
               this._toggleState(state, obj);
            }
         },

         _toggleState: function(state, obj) {
            var
               selectors = {
                  'bold':  'strong',
                  'italic':  'em',
                  'underline':  'span[style*="decoration: underline"]',
                  'strikethrough':  'span[style*="decoration: line-through"]'
               };
            if (!state && $(obj.node).closest(selectors[obj.format]).length) {
               state = true;
            }
            this._buttons[obj.format] = state;
         },

         _prepareItems: function(items, defaultconfig, expanded) {
            var
               items = RichEditorRoundToolbar.superclass._prepareItems.apply(this, arguments);
            for (var i in items) {
               if (items.hasOwnProperty(i)) {
                  items[i].visible = items[i].basic || expanded;
               }
            }
            return items;
         },

         _fillHistory: function(){
            var
               prepareHistory = function(value){
                  var
                     stripText, title,
                     $tmpDiv = $('<div/>').append(value);
                  $tmpDiv.find('.ws-fre__smile').each(function(){
                     var smileName = $(this).attr('title');
                     $(this).replaceWith('[' + (smileName ? smileName : rk('смайл')) +']');
                  });
                  stripText = title = strHelpers.escapeHtml($tmpDiv.text());
                  stripText = stripText.replace('/\n/gi', '');
                  if (!stripText && value) {
                     stripText = rk('Контент содержит только html-разметку, без текста.');
                  } else if (stripText && stripText.length > 140) { // обрезаем контент, если больше 140 символов
                     stripText = stripText.substr(0, 140) + ' ...';
                  }
                  return stripText;
               };
            if (this.getItems().getRecordById('history')) {
               this.getLinkedEditor().getHistory().addCallback(function (arrBL) {
                  var
                     items = [],
                     history = this.getItemInstance('history');
                  for (var i in arrBL) {
                     if (arrBL.hasOwnProperty(i)) {
                        items.push({
                           key: items.length,
                           title: prepareHistory(arrBL[i]),
                           value: arrBL[i]
                        })
                     }
                  }
                  if (!arrBL.length) {
                     history.setEnabled(false);
                  }
                  history.setItems(items)
               }.bind(this));
            }
         },

         /*БЛОК ФУНКЦИЙ ОБЁРТОК ДЛЯ ОТПРАВКИ КОМАНД РЕДАКТОРУ*/

         _insertLink: function(onAfterCloseHandler, target) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.insertLink(onAfterCloseHandler, target);
            }
         },

         _selectFile: function(originalEvent) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor._getFileLoader().selectFile(originalEvent);
            }
         },

         _insertSmile: function(smile) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.insertSmile(smile);
            }
         },

         _execCommand : function(name) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.execCommand(name);
            }
         },

         _setText: function(text) {
            if (this._options.linkedEditor) {
               this._options.linkedEditor.setText(text);
            }
         },

         _openStylesPanel: function(button){
            var
               stylesPanel = this.getStylesPanel(button);
            stylesPanel.setStylesFromObject({
               fontsize: tinyMCE.DOM.getStyle(this.getLinkedEditor().getTinyEditor().selection.getNode(), 'font-size', true).replace('px',''),
               color: constants.colorsMap[tinyMCE.DOM.getStyle(this.getLinkedEditor().getTinyEditor().selection.getNode(), 'color', true)],
               bold: this._buttons.bold,
               italic: this._buttons.italic,
               underline: this._buttons.underline,
               strikethrough: this._buttons.strikethrough
            });
            stylesPanel.show();
         },

         getStylesPanel: function(button){
            var
               self = this;
            if (!this._stylesPanel) {
               this._stylesPanel = new StylesPanel({
                  parent: button,
                  target: button.getContainer(),
                  corner: 'tl',
                  verticalAlign: {
                     side: 'top',
                     offset: -4
                  },
                  element: $('<div></div>'),
                  fontSizes: [12, 14, 15, 18],
                  colors: [
                     {color:'black'},
                     {color:'red'},
                     {color:'green'},
                     {color:'blue'},
                     {color:'purple'},
                     {color:'grey'}
                  ]
               });

               this._stylesPanel.subscribe('changeFormat', function(){
                  self._applyFormats(self._stylesPanel.getStylesObject())
               });
            }
            return this._stylesPanel;
         },

         _applyFormats: function(formats){
            if (this._options.linkedEditor) {
               this._options.linkedEditor.setFontColor(formats.color);
               this._options.linkedEditor.setFontSize(formats.fontsize);
               for ( var button in this._buttons) {
                  if (this._buttons.hasOwnProperty(button)) {
                     if (this._buttons[button] !== formats[button]) {
                        this._options.linkedEditor.execCommand(button);
                     }
                  }
               }
            }
         }

         /*БЛОК ФУНКЦИЙ ОБЁРТОК ДЛЯ ОТПРАВКИ КОМАНД РЕДАКТОРУ*/

      });
   return RichEditorRoundToolbar;
});