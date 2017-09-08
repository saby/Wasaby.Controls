/**
 * Created by ps.borisov on 23.08.2016.
 */

define('js!SBIS3.CONTROLS.RichEditorRoundToolbar', [
   'js!SBIS3.CONTROLS.RichEditorToolbarBase',
   'tmpl!SBIS3.CONTROLS.RichEditorRoundToolbar',
   'js!SBIS3.CONTROLS.RichEditorRoundToolbar/resources/config',
   'js!WS.Data/Di',
   'js!SBIS3.CONTROLS.MenuIcon',
   'js!SBIS3.CONTROLS.IconButton',
   'css!SBIS3.CONTROLS.RichEditorRoundToolbar',
   'js!SBIS3.CONTROLS.IconButton'
], function(RichEditorToolbarBase, dotTplFn, defaultConfig, Di) {

   'use strict';
   var
      constants = {
         INLINE_TEMPLATE: '6'
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
                *   <li>order - число-порядок сортировки элементов тулбара, по умолчанию 0;</li>
                *   <li>basic - остаётся ли элемент тулбара видимым при переключении выдимости, по умолчанию false.</li>
                * <ul>
                * @example
                * <pre>
                *    <options name="items" type="array">
                *       <options>
                *          <option name="name">myButton</option>
                *          <option name="order">100</option>
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
               expanded: false,
               /**
                * @cfg {Boolean} Сторона с которой находится кнопка переключения видимости
                */
               side: 'right'
            }
         },

         _modifyOptions: function (options) {
            // Так как в конфиге используется локализация через rk(), то только сейчас:
            options.defaultConfig = defaultConfig();
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

         _formatChangeHandler : function(event, obj, state) {
            if (['bold', 'italic', 'underline', 'strikethrough'].indexOf(obj.format) != -1) {
               this._toggleState(state, obj);
            }
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
         getFileLoader: function() {
            return Di.resolve('ImageUploader').getFileLoader();
         },
         _startFileLoad: function(target) {
            var
               self = this;
            if (self._options.linkedEditor) {
               this.getFileLoader().startFileLoad(target, false, 'images').addCallback(function (fileobj) {
                  self._options.linkedEditor.insertImageTemplate(constants.INLINE_TEMPLATE, fileobj);
               }.bind(this))
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
         }

         /*БЛОК ФУНКЦИЙ ОБЁРТОК ДЛЯ ОТПРАВКИ КОМАНД РЕДАКТОРУ*/

      });
   return RichEditorRoundToolbar;
});