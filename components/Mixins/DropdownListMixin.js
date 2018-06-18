/**
 * Created by iv.cheremushkin on 21.04.2015.
 */
define('SBIS3.CONTROLS/Mixins/DropdownListMixin', [
   'SBIS3.CONTROLS/Utils/TemplateUtil'
],
function(TemplateUtil) {
   /**
         * @mixin SBIS3.CONTROLS/Mixins/DropdownListMixin
         * @public
         * @author Крайнов Д.О.
         */
   'use strict';

   var DropdownListMixin = /**@lends SBIS3.CONTROLS/Mixins/DropdownListMixin.prototype  */{
      $protected: {
         _options: {

            /**
                    * @cfg {Boolean} Обрабатывать двойной клик по элементу коллекции
                    */
            allowDblClick: true,

            /**
                    * @cfg {} Шаблон отображения каждого элемента коллекции
                    * @deprecated Используйте опцию {@link SBIS3.CONTROLS.Dropdownlist#itemTpl}.
                    */
            itemTemplate: ''
         }
      },

      $constructor: function() {
         if (!this._options.displayProperty) {
            //По умолчанию отображаемое поле - 'title'
            this._options.displayProperty = 'title';
         }
      },

      _getItemTemplate: function(item) {
         var title = item.getContents().get(this._options.displayProperty);
         if (this._options.itemTemplate) {
            return TemplateUtil.prepareTemplate(this._options.itemTemplate).call(this, {
               item: item.getContents(),
               title: title,
               multiselect: this._options.multiselect,
               hierField: this._options.parentProperty,
               parentProperty: this._options.parentProperty,
               nodeProperty: this._options.nodeProperty,
               included: this._buildIncluded()
            });
         } else {
            return '<div>' + title + '</div>';
         }
      },

      // Метод собирающий вложенные шаблоны
      // Он должен отрабатывать на уровне DSMixin,
      // но вызов функции-шаблона DropdownList происходит здесь,
      // поэтому чтобы не ломать логику работы и вследствии того, что DSMixin нужно выпилить
      // добавил метод сюда
      _buildIncluded: function() {
         var included;
         if (this._options.includedTemplates) {
            var tpls = this._options.includedTemplates;
            included = {};
            for (var j in tpls) {
               if (tpls.hasOwnProperty(j)) {
                  included[j] = TemplateUtil.prepareTemplate(tpls[j]);
               }
            }
         }
         return included;
      },

      _bindItemSelect: function() {
         //TODO На некоторых терминалах для престы неправильно работает mouseup (срабатывает не для того контейнера, над которым сделали тач)
         //Если на устройстве есть тач - обрабатываем его. если нет, то mouseup
         //На VDOM компонентах нужно сделать через переопределение метода clickHandler (или его аналоге), который уже имеет в себе костыльную логику, умеющую
         //определять правильный таргет. Сейчас нет необходимости в пробросе колбэков в пикерМиксин и/или добавлении в нем нового события
         var self = this;
         this._picker.getContainer().on('tap', function(e) {
            //Чекбоксы появляются по ховеру. если ткнуть в место, где был чекбокс, то ничего не выберется, т.к. ховера еще не было
            if (!this._options.multiselect) {
               self._tapEvent = true;
               self._clickItemHandler(e);
            }
         });
         this._picker.getContainer().on('mouseup', function(e) {
            if (!self._tapEvent) { //Флаг, обрабатываем mouseup, если tap не отработал
               self._clickItemHandler(e);
            }
            self._tapEvent = false;
         });
         this._picker.getContainer().bind('dblclick', this._dblClickItem.bind(this));
      },
      _clickItemHandler: function(e) {
         var row = $(e.target).closest('.' + self._getItemClass());
         if (row.length && (e.button === 0)) {
            self.setSelectedKeys([row.data('id')]);
            self.hidePicker();
         }
      },
      _dblClickItem: function(e) {
         if (this._options.allowDblClick) {
            this._dblClickItemHandler(e);
         }
      },
      _dblClickItemHandler: function(e) {
         e.stopImmediatePropagation();

         /*Method can be implemented*/
      },
      _getItemClass: function() {
         /*Method must be implemented*/
      }
   };

   return DropdownListMixin;
});
