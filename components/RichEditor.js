/**
 * Created by ps.borisov on 21.05.2016.
 */
define('SBIS3.CONTROLS/RichEditor',
   [
      'SBIS3.CONTROLS/RichEditor/Components/RichTextArea',
      'tmpl!SBIS3.CONTROLS/RichEditor/RichEditor',
      'SBIS3.CONTROLS/RichEditor/Components/Toolbar'
   ], function(RichTextArea, dotTplFn, Toolbar) {
      'use strict';

   var
      constants = {
         toolbarHeight: 32
      },
      /**
       * Контрол "Богатый текстовый редактор" (БТР). Состоит из двух компонентов: {@link SBIS3.CONTROLS/RichEditor/Components/RichTextArea} и {@link SBIS3.CONTROLS/RichEditor/Components/Toolbar}.
       * @class SBIS3.CONTROLS/RichEditor
       * @extends SBIS3.CONTROLS/RichEditor/Components/RichTextArea
       * @author Спирин В.А.
       * @public
       * @control
       *
       * @demo Examples/RichEditor/RichEditorDemo/RichEditorDemo В следующем примере первый контрол - SBIS3.CONTROLS.RichEditor.
       * Ниже добавлен контрол SBIS3.CONTROLS/RichEditor/Components/Toolbar, который связан с контролом SBIS3.CONTROLS/RichEditor/Components/RichTextArea с помощью метода {@link SBIS3.CONTROLS/RichEditor/Components/ToolbarBase#setLinkedEditor}.
       *
       * @category Input
       */
      RichEditor = RichTextArea.extend(/** @lends SBIS3.CONTROLS/RichEditor.prototype */{
         _dotTplFn: dotTplFn,
         $protected : {
            _options : {
               /**
                * @cfg {Boolean} Панель инструментов
                * Возможные значения:
                * <ol>
                *    <li>true - использовать панель инструментов вместе с редактором;</li>
                *    <li>false - оставить только поле ввода.</li>
                * </ol>
                */
               toolbar: true,
               /**
                * @cfg {Boolean} Видимость панели инструментов
                * При скрытии панели инструментов работа в текстовом редакторе будет осуществляться только с клавиатуры.
                * Возможные значения:
                * <ol>
                *    <li>true - панель инструментов показана;</li>
                *    <li>false - скрыта.</li>
                * </ol>
                * @see toggleToolbar
                */
               toolbarVisible: true,
               /** Пользовательские элементы тулбара
                *  Конфигурирование опции смотрите в классе {@link SBIS3.CONTROLS/RichEditor/Components/Toolbar#items}.
                */
               items:undefined
            },
            _toolbar: undefined
         },

         _initToolbar: function() {
            if (this._container.find('.controls-RichEditorToolbar').length) { //если есть конетейнер с тулбаром значит надо лишь установить на него ссылку
               this._toolbar = this.getChildControlByName('RichEditorToolbar');
            }
            else
            {//если мы неактивны значит редактор еще не строили на сервере, создадим его через new
               var options = this._options;
               var div = $('<div></div>');
               this._container.prepend(div);
               this._toolbar = new Toolbar({
                  element: div,
                  name: 'RichEditorToolbar',
                  expanded: options.toolbarVisible,
                  items: options.items
               });
            }
            this._toolbar.setLinkedEditor(this);
            this._toolbar.subscribe('onExpandedChange', function (evtName, expanded) {
               if (!this._options.autoHeight) {
                  var container = this._scrollContainer.parent();
                  container.animate(
                     {height: container.outerHeight() + (expanded ? -constants.toolbarHeight : constants.toolbarHeight)},
                     'fast'
                  );
               }
               this._container[expanded ? 'addClass' : 'removeClass']('controls-RichEditor_toolbarExpanded');
               this.execCommand('');
            }.bind(this));
         },

         _getToolbar: function() {
            if (!this._toolbar) {
               this._initToolbar();
            }
            return this._toolbar;
         },

         _setEnabled: function(enabled){
            if (this._options.toolbar && (this._hasToolbar() || enabled)) {
               this._performByReady(function () {
                  this._getToolbar().setEnabled(enabled);
               }.bind(this));
            }
            RichEditor.superclass._setEnabled.apply(this, arguments);
         },

         _hasToolbar: function(){
            return !!this._toolbar;
         },

         /**
          * Возращает элемент тулбара с указанным именем или false (если он отсутствует)
          * @param {String} name Имя элемента
          * @returns {Deprecated/Controls/Button/Button|Boolean}
          * @deprecated
          */
         getToolbarItem: function(buttonName){
            return this._toolbar && this._toolbar.getItemInstance(buttonName);
         },

         /**
          * Инициализировать высоту основных элементов. Применяется только при отсутствии автоподстройки высоты (при фиксированой высоте)
          * @protected
          */
         _initMainHeight: function () {
            var options = this._options;
            if (!options.autoHeight) {
               var toolbarHeight = options.toolbar && options.toolbarVisible ? constants.toolbarHeight : 0;
               this._scrollContainer.parent().css('height',  this._container.height() - toolbarHeight);
            }
         }
      });

      return RichEditor;
   });