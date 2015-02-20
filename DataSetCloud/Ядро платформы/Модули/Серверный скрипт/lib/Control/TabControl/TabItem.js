define([],
   function() {
   'use strict';

   /**
    * @class TabItem
    * @extends $ws.proto.Abstract
    */
   var TabItem = $ws.proto.Abstract.extend(/** @lends TabItem.prototype */{
      $protected: {
         _linkedTabButton: null,
         _options: {
            /**
             * @cfg {String} Выравнивание корешка закладки
             * <wiTag group="Отображение">
             * @example
             * <pre>
             *     <options name="items" type="array">
             *        <options>
             *           <option name="title">Корпуса</option>
             *           //задаём положение корешка закладки слева
             *           <option name="align">left</option>
             *           <option name="id">Корпуса</option>
             *        </options>
             *        <options>
             *           <option name="title">Процессоры</option>
             *           <option name="id">Процессоры</option>
             *        </options>
             *     <options>
             * </pre>
             * @variant left слева
             * @variant right справа
             */
            align: 'right',
            /**
             * @cfg {String} CSS-класс, который будет добавлен к корешку закладки
             * <wiTag group="Отображение">
             * @example
             * <pre>
             *     <options name="items" type="array">
             *        <options>
             *           <option name="title">Процессоры</option>
             *           <option name="id">Процессоры</option>
             *           //задаём имя заранее созданного класса, влияющего на содержимое корешка закладки
             *           <option name="cssClass">demoCode-tabs</option>
             *        </options>
             *     </options>
             * </pre>
             */
            cssClass: '',
            /**
             * @cfg {Boolean} Редактирование по месту корешка закладки
             * <wiTag group="Управление" page=1>
             * При включении редактирования по месту необходимо задать значение опции {@link tabContent}.
             * @example
             * <pre>
             *     <options name="items" type="array">
             *        <options>
             *           <option name="editable">true</option>
             *           <option name="id">Процессоры</option>
             *           //задаём шаблон редактирования по месту для корешка закладки
             *           <option name="tabContent">
             *              <component data-component="SBIS3.CORE.FieldString" style="width: 150px;" name="FieldString 1">
             *                 //задаём текст начального значения
             *                 <option name="value">Процессоры</option>
             *                 <option name="tabindex">1</option>
             *              </component>
             *          </option>
             *        </options>
             *     </options>
             * </pre>
             * @see tabContent
             * @see title
             */
            editable : false,
            /**
             * @cfg {String} Заголовок корешка закладки
             * <wiTag group="Данные">
             * Текст этого заголовка применяется тольков случае editable =  false.
             * @example
             * <pre>
             *     <options name="items" type="array">
             *        <options>
             *           <option name="title">Процессоры</option>
             *           <option name="id">Процессоры</option>
             *        </options>
             *     </options>
             * </pre>
             * @translatable
             * @see editable
             * @see tabContent
             */
            title: '',
            /**
             * @cfg {String} Идентификатор закладки
             * <wiTag group="Данные">
             * @example
             * <pre>
             *     <options name="items" type="array">
             *        <options>
             *           <option name="title">Процессоры</option>
             *           <option name="id">Процессоры</option>
             *        </options>
             *     </options>
             * </pre>
             */
            id: '',
            /**
             * @cfg {String} Путь к иконке
             * <wiTag group="Данные">
             * @example
             * <pre>
             *     <options name="items" type="array">
             *        <options>
             *           <option name="title">Процессоры</option>
             *           <option name="id">Процессоры</option>
             *           <option name="icon">sprite:icon-16 icon-Truck icon-primary</option>
             *        </options>
             *     </options>
             * </pre>
             * @editor ImageEditor
             */
            icon: '',
            /**
             * @cfg {Content} Содержимое закладки
             * <wiTag group="Данные">
             * В данной опции задаётся html-вёрстка содержимого закладки.
             * @example
             * <pre>
             *     <options name="items" type="array">
             *        <options>
             *           <option name="title">Корпуса</option>
             *           <option name="content"><div class="demoCode-tabs">Корпуса</div></option>
             *           <option name="id">Корпуса</option>
             *        </options>
             *        <options>
             *           <option name="title">Процессоры</option>
             *           <option name="content"><div class="demoCode-tabs">Процессоры</div></option>
             *           <option name="id">Процессоры</option>
             *        </options>
             *     <options>
             * </pre>
             */
            content: '',
            /**
             * @cfg {Content} Содержимое корешка закладки, редактируемой по месту
             * <wiTag group="Данные page=1">
             * В данной опции задаётся html-вёрстка корешка закладки с встроенный шаблоном редактирования по месту.
             * Кнопки сохранения и закрытия встроены в шаблон.
             * Для активации режима редактирования необходимо кликнуть на корешок закладки.
             * @example
             * <pre>
             *     <options name="items" type="array">
             *        <options>
             *           <option name="editable">true</option>
             *           <option name="id">Процессоры</option>
             *           //задаём шаблон редактирования по месту для корешка закладки
             *           <option name="tabContent">
             *              <component data-component="SBIS3.CORE.FieldString" style="width: 150px;" name="FieldString 1">
             *                 //задаём текст начального значения
             *                 <option name="value">Процессоры</option>
             *                 <option name="tabindex">1</option>
             *              </component>
             *          </option>
             *        </options>
             *     </options>
             * </pre>
             * @see title
             * @see editable
             */
            tabContent: '',
            /**
             * @cfg {Boolean} Доступна ли закладка для выбора
             * <wiTag group="Управление">
             */
            enabled: true,
            /**
             * @cfg {Boolean} Видима ли закладка
             * <wiTag group="Управление">
             */
            visible: true
         },
         loaded: false,
         tabSheet: null
      },
      $constructor: function() {
         this._publish('onOptionChanged');
      },
      init: function() {
         TabItem.superclass.init.apply(this, arguments);
      },

      getTitle: function() {
         return this._options.title;
      },
      setTitle: function(title) {
         this._options.title = title;
         this._notify('onOptionChanged', this.getId(), 'title', title);
      },
      getId: function() {
         return this._options.id;
      },
      setId: function(id) {
         var oldId = this.getId();
         this._options.id = id;
         this._notify('onOptionChanged', oldId, 'id', id);
      },
      getIcon: function() {
         return this._options.icon;
      },
      setIcon: function(icon) {
         this._options.icon = icon;
         this._notify('onOptionChanged', this.getId(), 'icon', icon);
      },
      getContent: function() {
         return this._options.content;
      },
      setContent: function(content) {
         this._options.content = content;
         this._notify('onOptionChanged', this.getId(), 'content', content);
      },
      getEnabled: function() {
         return this._options.enabled;
      },
      setEnabled: function(enabled) {
         this._options.enabled = enabled;
         this._notify('onOptionChanged', this.getId(), 'enabled', enabled);
      },
      /**
       * <wiTag group="Данные" page=1>
       * Возвращает объект корешка закладки.
       * @returns {jQuery} Объект корешка вкладки
       */
      getHeadContainer: function () {
         return this._linkedTabButton;
      },
      setHeadContainer: function (container) {
         this._linkedTabButton = container;
      },
      getVisible: function() {
         return this._options.visible;
      },
      setVisible: function(visible) {
         this._options.visible = visible;
         // если скрываем, то скрываем и корешок и область, если же показываем, то только корешок
         // (корешок скрывается/показывается в TabControl)
         if (!visible) {
            this.tabSheet.addClass('ws-hidden');
         }
         this._notify('onOptionChanged', this.getId(), 'visible', visible);
      },
      setAlign : function(align) {
         this._options.align = align;
         this._notify('onOptionChanged', this.getId(), 'align', align);
      },
      getAlign: function() {
         return this._options.align;
      },
      getLoaded: function() {
         return this.loaded;
      },
      setLoaded: function(loaded) {
         this.loaded = loaded;
      },
      getTabSheet: function() {
         return this.tabSheet;
      },
      setTabSheet: function(tabSheet) {
         this.tabSheet = tabSheet;
      }
   });

   return TabItem;
});