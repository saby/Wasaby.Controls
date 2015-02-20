/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 07.10.13
 * Time: 11:50
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.PageFilter", ["js!SBIS3.CORE.FieldAbstract", "html!SBIS3.CORE.PageFilter", "css!SBIS3.CORE.PageFilter"], function( FieldAbstract, dotTplFn ) {

   "use strict";

   /**
    * Элемент управления «Фильтр раздела»
    * Фильтр для всей страницы, позволяющий отображать необходимые данные для пользователя.
    * С помощью фильтра раздела можно ограничить объём отображаемых данных, расположенных на странице, что позволяет
    * получить конкретную информацию, интересующую пользователя.
    * @class $ws.proto.PageFilter
    * @extends $ws.proto.FieldAbstract
    * @control
    * @category Select
    */
   $ws.proto.PageFilter = FieldAbstract.extend(/** @lends $ws.proto.PageFilter.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Object} Источник данных
             * <wiTag group="Данные">
             * Описание источника данных.
             */
            dataSource: false,
            /**
             * @cfg {String} Колонка записи, используемая для отображения
             * Изменяется методом {@Link setDisplayColumn}.
             * <wiTag group="Отображение">
             * Данный параметр отвечает за текст, отображаемый в фильтре раздела.
             * Определяет колонку данных, из которой будет заполняться этот текст.
             * @see setDisplayColumn
             * @see getDisplayColumn
             */
            displayColumn: '',
            /**
             * @cfg {String} Колонка идентификатора записи
             * <wiTag group="Данные">
             * Колонка записи, используемая как ключ элемента фильтра раздела
             * Данный параметр отвечает за значения элементов фильтра раздела.
             * Определяет колонку данных, из которой будут браться эти значения.
             * @see setItemValueColumn
             * @see getItemValueColumn
             */
            itemValueColumn: '',
            /**
             * @cfg {String} Колонка записи, используемая как значение по умолчанию
             * Изменятеся методом {@link setDefaultColumn}
             * <wiTag group="Данные">
             * Данный параметр отвечает за значения по умолчанию фильтра раздела.
             * Определяет колонку данных, из которой это будет определяться.
             * @see setDefaultColumn
             * @see getDefaultColumn
             */
            defaultColumn: 'default',
            /**
             * @cfg {String} Текст первого пункта фильтра раздела
             * Изменяется методом {@link setItemCaption}
             * <wiTag group="Отображение">
             * Данный параметр отвечает за отображаемый текст в первом пункте фильтра раздела.
             * Этот пункт подразумевает, что фильтрация раздела будет по всем имеющимся пунктам.
             * @see setItemCaption
             */
            itemCaption: 'Любые',
             /**
              * <wiTag noShow>
              */
            cssClassName: 'ws-pageFilter',
             /**
              * <wiTag noShow>
              */
            data: [],
             /**
              * <wiTag noShow>
              * Счётчик количества дефолтных пунктов
              */
            countDefaultItems: 0
         },
         _recordSet: null
      },
      _dotTplFn: dotTplFn,
      init: function(){
         var self = this;
         this._prepareRecordSet();
         this._container.find(".ws-pageFilter__item").bind("click", function(){
            var className = "ws-pageFilter__item__checked",
                  item = $(this),
                  checkbox = item.find(".ws-pageFilter__checkbox");
            if(item.hasClass("ws-pageFilter__allItems") && !item.hasClass(className)){
               self._container.find("."+className).removeClass(className).find(".ws-pageFilter__checkbox").addClass("ws-hidden");
               item.addClass(className);
               checkbox.removeClass("ws-hidden");
               self._notify("onChange");
            }else if(!item.hasClass("ws-pageFilter__allItems")){
               var allItemsCont = self._container.find(".ws-pageFilter__allItems");
               if(item.hasClass(className)){
                  if(self._container.find("."+className).length === 1){
                     allItemsCont.addClass(className).find(".ws-pageFilter__checkbox").removeClass("ws-hidden");
                  }
                  item.removeClass(className);
                  checkbox.addClass("ws-hidden");
               }else{
                  if(allItemsCont.hasClass(className))
                     allItemsCont.removeClass(className).find(".ws-pageFilter__checkbox").addClass("ws-hidden");
                  item.addClass(className);
                  checkbox.removeClass("ws-hidden");
               }
               self._notify("onChange");
            }
         });
         $ws.proto.PageFilter.superclass.init.apply(this, arguments);
      },
      _bindInternals: function(){
         this._inputControl = undefined;
      },
      _setDisableAttr: function(){
      },
      /**
       * <wiTag group="Отображение">
       * Получить колонку записи, используемую для отображения.
       * @returns {string|pagefilter.displayColumn|displayColumn|$ws.proto.FieldDropdown.$protected._options.displayColumn|*|$ws.proto.FieldDropdown._options.displayColumn}
       * @see displayColumn
       * @see setDisplayColumn
       */
      getDisplayColumn: function(){
         return this._options.displayColumn;
      },
      /**
       * <wiTag group="Отображение">
       * Установить колонку записи, используемую для отображения.
       * @param {String} displayColumn Имя отображаемой колонки.
       * @see displayColumn
       * @see getDisplayColumn
       */
      setDisplayColumn: function(displayColumn){
         if(displayColumn)
            this._options.displayColumn = displayColumn;
      },
       /**
        * <wiTag group="Данные">
        * Получить колонку идентификатора записи.
        * @returns {String} Колонка данных.
        * @see itemValueColumn
        * @see setItemValueColumn
        */
       getItemValueColumn: function(){
         return this._options.itemValueColumn;
      },
      /**
       * <wiTag group="Данные">
       * Установить колонку идентификатора записи.
       * @param {String} itemValueColumn
       * @see itemValueColumn
       * @see getItemValueColumn
       */
      setItemValueColumn: function(itemValueColumn){
         if(itemValueColumn)
            this._options.itemValueColumn = itemValueColumn;
      },
      /**
       * <wiTag group="Данные">
       * Получить колонку значения по умолчанию.
       * @returns {string|$ws.render.defaultColumn|*}
       * @see defaultColumn
       * @see setDefaultColumn
       * @see selectDefault
       */
      getDefaultColumn: function(){
         return this._options.defaultColumn;
      },
      /**
       * <wiTag group="Данные">
       * Установить колонку значения по умолчанию.
       * @param {$ws.render.defaultColumn} defaultColumn
       * @see defaultColumn
       * @see getDefaultColumn
       * @see selectDefault
       */
      setDefaultColumn: function(defaultColumn){
         if(defaultColumn)
            this._options.defaultColumn = defaultColumn;
      },
      /**
       * <wiTag group="Отображение">
       * Установить текст первого пункта фильтра раздела.
       * При выборе этого пункта фильтрация отключена, показываются все данные.
       * Если не задать данный текст, то по умолчанию установится "Любые".
       * @param itemCaption Текст первого пункта фильтра раздела.
       * @see itemCaption
       */
      setItemCaption: function(itemCaption){
         if(itemCaption)
            this._options.itemCaption = itemCaption;
      },
      _drawPageFilter: function(){
         var records = this._recordSet.getRecords();
         this._options.data = [];
         for(var i = 0, l = records.length; i < l; i++){
            this._options.data.push(records[i].toObject());
            if(records[i].get(this._options.defaultColumn) === true)
               this._options.countDefaultItems += 1;
         }
         this._container.html(this._dotTplFn(this._options));
      },
      _prepareRecordSet: function(){
         var self = this;
         $ws.core.attachInstance('Source:RecordSet', this._options.dataSource).addCallbacks(function(recordSet){
            self._recordSet = recordSet;
            self.setValue(recordSet);
            self._drawPageFilter();
            return recordSet;
         }, function(e){
            return e;
         });
      },
      /**
       * <wiTag group="Управление">
       * Вернуть состояние по умолчанию.
       * @see onChange
       * @see setDefaultColumn
       * @see getDefaultColumn
       */
      selectDefault: function(){
         var checkedItems = this._container.find(".ws-pageFilter__item__checked");
         if(checkedItems.length !== this._options.countDefaultItems){
            checkedItems.removeClass("ws-pageFilter__item__checked").find(".ws-pageFilter__checkbox").addClass("ws-hidden");
            this._container.find(".ws-pageFilter__item__default").addClass("ws-pageFilter__item__checked").find(".ws-pageFilter__checkbox").removeClass("ws-hidden");
            this._notify("onChange");
         }
      },
      /**
       * <wiTag group="Управление">
       * Получить
       * @returns {Array} Массив с именами флагов
       * @see selectValue
       * @see removeSelection
       */
      getSelection: function(){
         var checkedItems = this._container.find(".ws-pageFilter__item__checked"),
               keys = [];
         for(var i = 0, l = checkedItems.length; i < l; i++){
            var key = $(checkedItems[i]).attr("key");
            if(key)
               keys.push(key);
         }
         return keys;
      },
      _changeValue: function(keys, isSelect){
         if(keys instanceof Array && keys.length > 0){
            var isChanged = false,
                  className = "ws-pageFilter__item__checked",
                  checkboxClass = ".ws-pageFilter__checkbox",
                  allItemsCont = this._container.find(".ws-pageFilter__allItems"),
                  checkedCount = this._container.find("."+className).length,
                  removedCount = 0;
            for(var i = 0, l = keys.length; i < l; i++){
               var item = this._container.find("[key="+ keys[i] +"]");
               if(item && item.length > 0){
                  if(isSelect){
                     if(!item.hasClass(className)){
                        item.addClass(className).find(checkboxClass).removeClass("ws-hidden");
                        if(!isChanged && allItemsCont.hasClass(className))
                           allItemsCont.removeClass(className).find(checkboxClass).addClass("ws-hidden");
                        isChanged = true;
                     }
                  }else{
                     if(item.hasClass(className)){
                        item.removeClass(className).find(checkboxClass).addClass("ws-hidden");
                        isChanged = true;
                        removedCount++;
                        if(checkedCount === l && checkedCount === removedCount)
                           allItemsCont.addClass(className).find(checkboxClass).removeClass("ws-hidden");
                     }
                  }
               }
            }
            if(isChanged)
               this._notify("onChange");
         }
      },
      /**
       * <wiTag group="Управление">
       * Выбрать значение.
       * @param {Array} keys Массив с именами флагов
       */
      selectValue: function(keys){
         this._changeValue(keys, true);
      },
      /**
       * <wiTag group="Управление">
       *
       * @param {String} keys
       */
      removeSelection: function(keys){
         this._changeValue(keys);
      },
       /**
        * <wiTag group="Управление">
        * Изменить текущее значение.
        * @param {$ws.proto.RecordSet} value Новое значение.
        * @see onChange
        */
      setValue: function(value){
         if(!(value instanceof $ws.proto.RecordSet))
            throw new TypeError("В метод setValue можно передать только RecordSet");
         this._updateSelfContextValue(value);
         if(JSON.stringify(this._recordSet.getColumns()) !== JSON.stringify(value.getColumns()) ||
            JSON.stringify(this._recordSet.getDataForSerialize()) !== JSON.stringify(value.getDataForSerialize())){
            this._recordSet = value;
            this._drawPageFilter();
            this._notify("onChange");
         }
      }
   });

   return $ws.proto.PageFilter;

});
