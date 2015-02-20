/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 14:12
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.Accordion", ["js!SBIS3.CORE.Control", "html!SBIS3.CORE.Accordion", "html!SBIS3.CORE.Accordion/Accordion_element", "css!SBIS3.CORE.Accordion"],function( control, dotTplFn, elementTplFn ) {

   "use strict";

   $ws.single.DependencyResolver.register('SBIS3.CORE.Accordion', function(config){
      return config.isCollapsing ? ['js!SBIS3.CORE.AccordionCollapsePlugin'] : [];
   });

   /**
    * Аккордеон - контрол, подходящий для создания sidebar или для раскрытия дополнительного контента страницы.
    * Аккордеон состоит из групп. Каждую группу можно разделить на области "Заголовок" и "Контент".
    *
    * "Заголовок" - это кнопка, при клике на которую открывается/скрывается "Контент".
    * "Контент" отображает xaml-шаблон, который является содержимым группы.
    *
    * @class $ws.proto.Accordion
    * @extends $ws.proto.Control
    * @control
    * @category Navigation
    * @initial
    * <component data-component='SBIS3.CORE.Accordion'>
    *    <options name='elements' type='array'>
    *       <options>
	*          <option name='id' value='1'></option>
    *          <option name='title' value='Группа 1'></option>
    *          <option name='visible' value='true'></option>
    *
    *       </options>
    *       <options>
	*          <option name='id' value='2'></option>
	*          <option name='title' value='Группа 2'></option>
    *          <option name='visible' value='true'></option>
    *       </options>
    *    </options>
    *  <option name='instantLoad' value='true'></option>
    *  <option name='autoHeight' value='true'></option>
    *  <option name='autoWidth' value='true'></option>
    *  <option name='verticalAlignment' value='Top'></option>
    * </component>
    * @designTime plugin /design/DesignPlugin
    */
   $ws.proto.Accordion = control.Control.extend(/** @lends $ws.proto.Accordion.prototype */{
      /**
       * @cfg {Boolean} Сохранять состояние
       * @name $ws.proto.Accordion#saveState
       * @description
       * Будет ли контрол сохранять состояние.
       */
      /**
       * @event onGroupOpen После открытия группы
       * Событие происходит после открытия группы. При это не гарантируется готовность контролов, находящихся в контенте группы.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор группы.
       * @example
       * <pre>
       *    accordion.subscribe('onGroupOpen', function(eventObject, id) {
       *       this.waitChildControlByName('Контент').addCallback(function(name) {
       *          name.getContainer().find('span').text(id);
       *       });
       *    });
       * </pre>
       * @see openElement
       * @see toggleElement
       */
      /**
       * @event onBeforeGroupOpen Перед открытием группы
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор группы.
       * @see openElement
       * @see toggleElement
       */
      /**
       * @event onGroupContentLoaded После загрузки контента группы
       * Событие происходит после загрузки контента группы.
       * При этом гарантируется готовность контролов, находящихся в контенте группы.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор группы.
       * @see instantLoad
       */
      /**
       * @event onLabelClick При клике по заголовку группы
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} id Идентификатор группы.
       * @example
       * При клике по заголовку группы применить фильтр к табличному представлению (tableView).
       * <pre>
       *    accordion.subscribe('onLabelClick', function(eventObject, id) {
       *       tableView.setQuery({fieldName : id});
       *    });
       * </pre>
       * @see openElement
       * @see toggleLabel
       * @see getLabelById
       * @see enableLabel
       */
      $protected: {
         _options : {
            elementTemplate: elementTplFn,
            /**
             * @cfg {Boolean} Закрывать группу по клику
             * Опция определяет поведение открытой группы при клике на заголовок.
             *
             * Возможные значения:
             * <ol>
             *    <li>true - при клике на заголовок группа закроется.</li>
             *    <li>false - при клике на заголовок группа останется открытой.</li>
             * </ol>
             * <wiTag group="Управление">
             * @see setCollapseContent
             * @see getCollapseContent
             * @group Groups
             */
            collapseContent : false,
            /**
             * @cfg {Boolean} Загружать все группы при инициализации
             * Опция позволяет задать загрузку всех групп при инициализации аккордеона. Группы загружаются параллельно.
             * После каждой загрузки группы происходит событие {@link onGroupContentLoaded}. Количество групп определяет число событий.
             * <wiTag group='Управление'>
             * @see onGroupContentLoaded
             * @group Groups
             */
            instantLoad : false,
            /**
             * @cfg {Boolean} Можно ли открыть несколько групп
             *
             * Возможные значения:
             * <ol>
             *    <li>true - одновременно открытыми могут находиться все группы аккордеона. При этом теряет актуальность опция {@link dragToTop}.</li>
             *    <li>false - одновременно не может быть открыто больше одной группы аккордеона.</li>
             * </ol>
             * <wiTag group="Управление">
             * @see dragToTop
             * @see setOpenAll
             * @see getOpenAll
             * @group Groups
             */
            openAll : false,
            /**
             * @cfg {Boolean} Перемещать открытую группу вверх
             * Опция позволяет задать поведение открытой группы аккордеона.
             * Актуально, если опция {@link openAll} установлена в значение false.
             *
             * Возможные значения:
             * <ol>
             *    <li>true - открытая группа перемещается в позицию первой группы аккордеона.</li>
             *    <li>false - открытая группа остаётся в прежней позиции аккордеона.</li>
             * </ol>
             * <wiTag group="Управление">
             * <wiTag page=1>
             * @see openAll
             * @see setDragToTop
             * @see getDragToTop
             * @group Groups
             */
            dragToTop : false,
            /**
             * @cfg {Boolean} Скрывать заголовок открытой группы
             * Опция позволяет изменить видимость заголовка открытой группы.
             *
             * Возможные значения:
             * <ol>
             *    <li>true - заголовок открытой группы скрывается. При этом теряет актуальность опция {@link collapseContent}.</li>
             *    <li>false - заголовок открытой группы не скрывается.</li>
             * </ol>
             * <wiTag group="Управление" page=2>
             * @see collapseContent
             * @see dragToTop
             * @group Groups
             */
            hideActiveLabel : false,
            /**
             * @typedef {Object} AccordionElement
             * @property {String} id идентификатор группы. Должен быть уникальным
             * @property {String} title текст заголовка группы
             * @property {String} template xml-шаблон, созданный пользователем отдельно. При раскрытии группы именно он будет отображаться в качестве содержимого
             * @property {Boolean} [visible=true] видимость группы
             * @property {Boolean} active активность группы
             * @property {String} image путь до картинки
             * @translatable title
             * @editor template ExternalComponentChooser
             */
            /**
             *
             * @cfg {AccordionElement[]} Конфигурация групп аккордеона
             * Массив объектов, описывающих конфигурацию групп аккордеона. В каждом объекте возможны следующие свойства:
             * <ol>
             *    <li>{String} id - идентификатор группы. Должен быть уникальным.</li>
             *    <li>{String} title - текст заголовка группы.</li>
             *    <li>{String} template - имя XAML-шаблона. XAML-шаблон составляет контент группы.</li>
             * </ol>
             * <wiTag group="Данные">
             * @example
             * <pre>
             *    var elements = [{
             *       id: 'ДокументВходящие',
             *       title: 'Входящие',
             *       template: 'ШаблонВходящие'
             *    },{
             *       id: 'ДокументИсходящие',
             *       title: 'Исходящие',
             *       template: 'ШаблонИсходящие'
             *    }];
             * </pre>
             * @see appendFlags
             * @group Groups
             */
            elements : [],
            autoHeight: false,
            autoWidth: false,
            cssClassName: 'ws-accordion',
            cssClass: 'ws-accordion'
         },
         _elements : {},
         _defaultActiveElement : -1,
         _activeElement : -1,
         _loading : false
      },
      $constructor: function(){
         var self = this;
         this._publish('onGroupOpen', 'onBeforeGroupOpen', 'onGroupContentLoaded', 'onLabelClick');

         /*if (!this._hasMarkup()){
            this._container.html(dotTplFn(this._options));
         }*/
         this._bindInternals();

         this._calculateSize();
         this.once('onInit', function(){
            self.once('onStateChanged', function(){
               if (self._defaultActiveElement !== -1){
                  self.openElement(self._defaultActiveElement, undefined, undefined, true);
               }
            });
            //обеспечиваем поднятие события строго после подписки на него NavigationController'ом
            self._notify('onStateChanged');
         });

         this.subscribe("onGroupOpen", function(e, id, changeState){
            this._notify("onStateChanged", id, !changeState);
         });
      },

      /**
       * <wiTag group="Управление">
       * Установить закрытие группы по клику на заголовок.
       * @param {Boolean} collapseContent true - установить закрытие по клику.
       * @example
       * Установить закрытие группы по клику на заголовок, если аккордеон является частью sidebar.
       * <pre>
       *    accordion.subscribe('onReady', function() {
       *       var name = this.getParent().getName();
       *       if (name == 'БоковаяПанель' && !this.getCollapseContent()) {
       *          this.setCollapseContent(true);
       *       }
       *    });
       * </pre>
       * @see collapseContent
       * @see getCollapseContent
       * @see hideActiveLabel
       * @see onLabelClick
       */
      setCollapseContent: function(collapseContent){
         this._options.collapseContent = !!collapseContent;
      },

      /**
       * <wiTag group="Управление">
       * Установлено ли закрытие группы по клику на заголовок.
       * @return {Boolean} true - да, установлено.
       * @example
       * Установить закрытие группы по клику на заголовок, если аккордеон является частью sidebar.
       * <pre>
       *    accordion.subscribe('onReady', function() {
       *       var name = this.getParent().getName();
       *       if (name == 'БоковаяПанель' && !this.getCollapseContent()) {
       *          this.setCollapseContent(true);
       *       }
       *    });
       * </pre>
       * @see collapseContent
       * @see getCollapseContent
       * @see hideActiveLabel
       * @see onLabelClick
       */
      getCollapseContent: function(){
         return this._options.collapseContent;
      },

      /**
       * <wiTag group="Управление">
       * <wiTag page=1>
       * Установить возможность открывать несколько групп.
       * @param {Boolean} openAll true - одновременно открытыми могут находиться все группы аккордеона.
       * @example
       * При готовности аккордеона (accordion) установить возможность открывать несколько групп.
       * <pre>
       *    accordion.subscribe('onReady', function() {
       *       if (!this.getOpenAll()) this.setOpenAll();
       *    });
       * </pre>
       * @see openAll
       * @see getOpenAll
       */
      setOpenAll: function(openAll){
         this._options.openAll = !!openAll;
      },

      /**
       * <wiTag group="Управление">
       * <wiTag page=1>
       * Разрешено ли открывать несколько групп.
       * @return {Boolean} true - да, разрешено.
       * @example
       * При готовности аккордеона (accordion) установить возможность открывать несколько групп.
       * <pre>
       *    accordion.subscribe('onReady', function() {
       *       if (!this.getOpenAll()) this.setOpenAll();
       *    });
       * </pre>
       * @see openAll
       * @see getOpenAll
       */
      getOpenAll: function(){
         return this._options.openAll;
      },

      /**
       * <wiTag group="Управление">
       * <wiTag page=1>
       * Установить отображение открытой группы вверху.
       * @param {Boolean} dragToTop true - открытая группа будет отображаться наверху.
       * @example
       * Если число групп аккордеона (accordion) больше четырёх, убрать отображение открытой группы в верхней позиции.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var object = this.getChildControlByName('Аккордеон');
       *       //ids - массив с идентификатора групп аккордеона
       *       if (object.getDragToTop() && ids.length > 4) {
       *          object.setDragToTop(false);
       *       }
       *    });
       * </pre>
       * @see dragToTop
       * @see getDragToTop
       */
      setDragToTop: function(dragToTop){
         this._options.dragToTop = !!dragToTop;
      },

      /**
       * <wiTag group="Управление">
       * <wiTag page=1>
       * Установлено ли отображение открытой группы вверху.
       * @return {Boolean} true - да, открытая группа отображается вверху.
       * @example
       * Если число групп аккордеона (accordion) больше четырёх, убрать отображение открытой группы в верхней позиции.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var object = this.getChildControlByName('Аккордеон');
       *       //ids - массив с идентификатора групп аккордеона
       *       if (object.getDragToTop() && ids.length > 4) {
       *          object.setDragToTop(false);
       *       }
       *    });
       * </pre>
       * @see dragToTop
       * @see setDragToTop
       */
      getDragToTop: function(){
         return this._options.dragToTop;
      },

      _isElementAreaVisible: function(element) {
         return !element.areaHidden;
      },

      _isElementAreaHidden: function(element) {
         return element.areaHidden;
      },

      _hideElementArea: function(element) {
         element.area.addClass('ws-hidden');
         element.areaHidden = true;
      },

      _showElementArea: function(element) {
         element.area.removeClass('ws-hidden');
         element.areaHidden = false;
      },

      _hideElementWrapper: function(element) {
         element.wrapper.addClass('ws-hidden');
         element.hidden = true;
      },

      _showElementWrapper: function(element) {
         element.wrapper.removeClass('ws-hidden');
         element.hidden = false;
      },
       /**
        * <wiTag group="Управление">
        * Открыть/закрыть группу.
        * Если свойство {@link openAll} установлено в значение false, то метод только откроет группу.
        * @param {String} id Идентификатор группы.
        * @param {Boolean} [changeState = false] false - записывать состояние контрола в историю браузера.
        * Смотреть подробнее в {@link $ws.single.NavigationController}.
        * @example
        * При клике на кнопку (button) открыть/закрыть все группы.
        * <pre>
        *    btn.subscribe('onClick', function() {
        *       if (accordion.getOpenAll()) {
        *          //ids - массив с идентификаторами групп аккордеона
        *          $ws.helpers.forEach(ids, function(id) {
        *             accordion.toggleElement(id);
        *          });
        *       }
        *    });
        * </pre>
        * @see elements
        * @see closeElement
        * @see openElement
        * @see openAll
        * @see onLabelClick
        */
      toggleElement : function(id, changeState){
         this._runInBatchUpdate('Accordion:toggleElement', function() {
            var
               self = this,
               wasActive = this._activeElement,
               openResult;

            if ((this.isGroupLoaded(id) || !this._elements[id].template) && this._isElementAreaVisible(this._elements[id]))
               this._notifyBatchDelayed('onLabelClick', id);

            if (!this._options.collapseContent && id == this._activeElement && !this._options.openAll)
               return;

            if (this._options.openAll){
               if (this._isElementAreaHidden(this._elements[id]))
                  this.openElement(id, true, undefined, changeState);
               else
                  this.closeElement(id, true);

               return;
            }

            if (this._activeElement != id)
               openResult = this.openElement(id, self._options.openAll, undefined, changeState);
            else
               this._activeElement = -1;

            openResult.addCallback(function(result){
               if (result && wasActive !== -1 && !self._options.openAll)
                  self.closeElement(wasActive, true);
            });

            return openResult;
         });
      },
      /**
       * <wiTag group="Управление">
       * Закрыть группу.
       * @param {String} id Идентификатор группы.
       * @param {Boolean} [resize = false] Перерасчитывать ли размеры элемента.
       * @example
       * При клике на кнопку (btn) закрыть все группы аккордеона (accordion).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       if (accordion.getOpenAll()) {
       *          //ids - массив с идентификаторами групп
       *          $ws.helpers.forEach(ids, function(id) {
       *             accordion.closeElement(id);
       *          });
       *       } else {
       *          accordion.closeElement(accordion.getActiveElement());
       *       }
       *    });
       * </pre>
       * @see elements
       * @see openElement
       * @see toggleElement
       * @see getActiveElement
       */
      closeElement : function(id, resize){
         var element = this._elements[id];
         if (element !== undefined){
            this._hideElementArea(element);
            element.label.removeClass('ws-accordion-active');
            this.toggleLabel(id, true);
            element.wrapper.removeClass('ws-accordion-wrapper-active');
            if (this._elements[id].toolbar !== undefined){
               this._elements[id].toolbar.hide();
            }
            if (resize)
               this._calculateSize();
            if (id == this._activeElement)
               this._activeElement = -1;
         }
      },
       /**
        * <wiTag group="Управление">
        * Открыть группу.
        * @param {String} id Идентификатор группы.
        * @param {Boolean} [resize = false] Перерасчитывать ли размеры элемента.
        * @param {Boolean} [notifyOnClick = true] Отметить выполнение метода как клик по группе.
        * В значении true происходит событие {@link onLabelClick}.
        * @param {Boolean} [changeState = false] false - записывать состояние контрола в историю браузера.
        * Смотреть подробнее в {@link $ws.single.NavigationController}.
        * @returns {$ws.proto.Deferred}
        * Перед открытием группы происходит событие {@link onBeforeGroupOpen}.
        * В зависимости от обработчика этого события в deferred приходит:
        * <ol>
        *   <li>true. Это означает, что в обработчике события метод {@link setResult} передаёт:
        *    a) true. Группа откроется;
        *    b) {@link $ws.proto.Deferred}. Группа откроется, если данный deferred возвращает true.
        *    </li>
        *    <li>false. Это означает, что в обработчике события в качестве результата передаётся false. Группа остаётся закрытой.</li>
        * </ol>
        * @example
        * При клике на кнопку (btn) открыть группу аккордеона (accordion), применить фильтр на табличное представление (tableView).
        * <pre>
        *    btn.subscribe('onClick', function() {
        *       //id - идентификатор группы
        *       accordion.openElement(id).addCallback(function(flag) {
        *          if (flag) {
        *             tableView.setQuery({'Категория': id});
        *          }
        *      });
        *    });
        * </pre>
        * @see elements
        * @see closeElement
        * @see toggleElement
        * @see getActiveElement
        * @see onLabelClick
        * @see onGroupOpen
        * @see onBeforeGroupOpen
        */
      openElement : function(id, resize, notifyOnClick, changeState){
         notifyOnClick = typeof notifyOnClick == "boolean" ? notifyOnClick : true;
         var
            self = this,
            element = this._elements[id],
            openResult = new $ws.proto.Deferred(),
            handlerResult;

         if (element !== undefined){
            handlerResult = self._notify('onBeforeGroupOpen', id);
            if (handlerResult instanceof $ws.proto.Deferred){
               handlerResult.addBoth(function(result){
                  if (result !== false){
                     self._openElement(id, element, resize, notifyOnClick, changeState);
                     openResult.callback(true);
                  }
               })
            }
            else if (handlerResult !== false){
               this._openElement(id, element, resize, notifyOnClick, changeState);
               openResult.callback(true);
            }
            else
               openResult.callback(false);

            return openResult;
         }
      },
      _openElement : function(id, element, resize, notifyOnClick, changeState){
         var self = this;

         if (this._options.dragToTop)
            this._dragToTop(id);

         if (!element.area.is(":empty") || element.template)
            this._showElementArea(element);
         element.label.addClass('ws-accordion-active');
         this.toggleLabel(id, !this._options.hideActiveLabel);
         element.wrapper.addClass('ws-accordion-wrapper-active');

         this._activeElement = id;
         if (!element.dReady && element.template){
            this._loadTemplate(id, notifyOnClick, changeState);
         }
         else{
            if (element.dReady instanceof $ws.proto.Deferred){
               element.dReady.addCallback(function(){
                  if (self._elements[id].toolbar !== undefined)
                     self._elements[id].toolbar.show();
                  self._setGroupSize(id);
                  if (resize)
                     self._calculateSize();
                  if (notifyOnClick)
                     self._notifyBatchDelayed('onLabelClick', id);
                  self._notifyBatchDelayed('onGroupOpen', id, changeState);
               })
            }
            else{
               if (notifyOnClick)
                  this._notifyBatchDelayed('onLabelClick', id);
               this._notifyBatchDelayed('onGroupOpen', id, changeState);
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Скрыть группу аккордеона.
       * @param {String} id Идентификатор группы.
       * @example
       * В зависимости от значения выпадающего списка (fieldDropdown) скрыть определённые группы аккордеона (accordion).
       * <pre>
       *    fieldDropdown.subscribe('onChange', function(eventObject, value) {
       *       if (value === 2) {
       *          //ids - массив с идентификаторами дополнительных групп
       *          $ws.helpers.forEach(ids, function(id) {
       *             element.hideElement(id);
       *          });
       *    }
       *    });
       * </pre>
       * @see showElement
       * @see isElementVisible
       */
      hideElement : function(id){
         var element = this._elements[id];
         if (element){
            this._hideElementWrapper(element);
            this._calculateSize();
         }
      },
      /**
       * <wiTag group="Управление">
       * Показать группу аккордеона.
       * @param {String} id Идентификатор группы.
       * @example
       * Если флаг (fieldCheckbox) установлен, показать дополнительные группы аккордеона (accordion).
       * <pre>
       *    fieldCheckbox.subscribe('onChange', function(eventObject, value) {
       *       if (value) {
       *          //ids - массив с идентификаторами дополнительных групп
       *          $ws.helpers.forEach(ids, function(id) {
       *             element.showElement(id);
       *          });
       *       this.setEnabled(false);
       *    }
       *    });
       * </pre>
       * @see showElement
       * @see isElementVisible
       */
      showElement : function(id){
         var element = this._elements[id];
         if (element){
            this._showElementWrapper(element);
            this._calculateSize();
         }
      },
      /**
       * <wiTag group="Управление">
       * Показана ли группа аккордеона.
       * @param {String} id Идентификатор группы.
       * @return {Boolean|undefined} true - группа показана.
       * Возвращается undefined, если группы с таким идентификатором не существует.
       * @example
       * При клике на кнопку (btn) изменить видимость некоторых групп аккордеона (accordion).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       $ws.helpers.forEach(ids, function(id) {
       *          if (!accordion.isElementVisible(id)) {
       *             accordion.showElement(id);
       *          }
       *       });
       *    });
       * </pre>
       * @see showElement
       * @see hideElement
       */
      isElementVisible : function(id){
         var element = this._elements[id];
         if (element)
            return !element.hidden;
         return undefined;
      },
      /**
       * <wiTag group="Управление">
       * Изменить видимость заголовка группы.
       * @param {String} id Идентификатор группы.
       * @param {Boolean} [state] true - показать заголовок группы.
       * Если не задать значение, то видимость заголовка группы изменится в противоположное состояние.
       * @example
       * При готовности аккордеона (accordion) убрать заголовок активной группы, если та открывается в верхней позиции.
       * <pre>
       *    accordion.subscribe('onReady', function() {
       *       if (this.getDragToTop() && !this.getOpenAll()) {
       *          //id - идентификатор произвольной группы
       *          this.openElement(id);
       *          this.toggleLabel(id, false);
       *       }
       *    });
       * </pre>
       * @see enableLable
       * @see hideActiveLabel
       * @see getLabelById
       * @see onLabelClick
       */
      toggleLabel : function(id, state){
         var label = this.getLabelById(id);
         if (label)
            label.css('display', state ? 'block' : 'none');
      },
      /**
       * <wiTag group="Управление">
       * Изменить активность заголовка группы.
       * Неактивный заголовок недоступен для взаимодействия с пользователем.
       * @param {String} id  Идентификатор группы.
       * @param {Boolean} state true - состояние активности.
       * @example
       * Если флаг (fieldCheckbox) установлен, то сделать доступными для взаимодействия все заголовки групп.
       * <pre>
       *    fieldCheckbox.subscribe('onChange', function(eventObject, value) {
       *       if (value) {
       *          //ids - массив с идентификаторами групп
       *          $ws.helpers.forEach(ids, function(id) {
       *             accordion.enableLabel(id);
       *          });
       *       }
       *    });
       * </pre>
       * @see enableLable
       * @see hideActiveLabel
       * @see getLabelById
       * @see onLabelClick
       */
      enableLabel : function(id, state){
         this._elements[id].enabled = state === undefined ? !this._elements[id].enabled : state;
         this.getLabelById(id).parent().toggleClass('ws-label-disabled', state === undefined ? state : !state);
      },
      /**
       * <wiTag group="Управление">
       * Получить объект-группу по указанному идентификатору.
       * Метод сработает только в том случае, если группа открыта.
       * @param {String} id Идентификатор группы.
       * @returns {$ws.proto.TemplatedArea|undefined} Возвращает класс открытой группы.
       * Возвращает undefined, если группа с переданным идентификатором закрыта.
       */
      getGroupById : function(id){
         if (this._elements[id])
            return this._elements[id].instance
         else
            return undefined;
      },
      /**
       * <wiTag group="Управление">
       * Получить заголовок группы.
       * @param {String} id Идентификатор группы.
       * @returns {jQuery} jQuery-объект заголовка.
       * @example
       * Обводить маркером заголовок открытой группы аккордеона.
       * <pre>
       *    accordion.subscribe('onLabelClick', function(eventObject, id) {
       *       var label = this.getLabelById(id);
       *       $ws.single.Marker.positionToElement(label);
       *    });
       * </pre>
       * @see elements
       * @see enableLable
       * @see hideActiveLabel
       * @see getLabelById
       * @see onLabelClick
       */
      getLabelById : function(id){
         if (this._elements[id])
            return this._elements[id].label;
      },
      /**
       *
       * <wiTag group="Управление">
       * Получить идентификатор открытой группы.
       * @returns {String|Number} Идентификатор группы.
       * Если все группы закрыты, то возвращается -1.
       * @example
       * При готовности аккордеона (accordion) открыть любую группу, если все группы закрыты.
       * <pre>
       *    accordion.subscribe('onReady', function() {
       *       if (this.getActiveElement() == -1) {
       *          //ids - массив с идентификаторами групп аккордеона
       *          var randomNumber = Math.random()*ids.length;
       *          //округляем случайное число до целого, открываем группу
       *          this.openElement(Math.floor(randomNumber));
       *       }
       *    });
       * </pre>
       * @see openElement
       * @see closeElement
       * @see toggleElement
       */
      getActiveElement :function(){
         return this._activeElement;
      },
      /**
       * <wiTag group="Управление">
       * Открыта ли группа.
       * @param {String} id Идентификатор группы.
       * @returns {Boolean} true - группа открыта.
       * @example
       * Если группа открыта, то по её идентификатору применить фильтр к табличному представлению (tableView).
       * <pre>
       *    accordion.subscribe('onReady', function() {
       *       //id - идентификатор группы, по которой хотим установить фильтр
       *       if (this.isGroupOpen(id)) {
       *          tableView.setQuery({'Тип': id});
       *       }
       *    });
       * </pre>
       * @see openElement
       * @see closeElement
       * @see toggleElement
       */
      isGroupOpen : function(id){
         return this._activeElement == id;
      },
       /**
        * <wiTag group="Управление">
        * Загрузилась ли группа.
        * Загрузка группы означает загрузку XAML-шаблона группы и готовность дочерних контролов.
        * @param {String} id Идентификатор группы.
        * @returns {Boolean} true - да, группа загрузилась.
        */
      isGroupLoaded : function(id){
         return (this._elements[id].dReady instanceof $ws.proto.Deferred) && this._elements[id].dReady.isReady();
      },
      destroy : function(){
         for (var i in this._elements){
            this._elements[i].label.unbind('click');
            if (this._elements[i].instance)
               this._elements[i].instance.destroy();
         }
         $ws.proto.Accordion.superclass.destroy.apply(this, arguments);
      },
      /**
       * Загрузка тулбара для группы
       * @param {String} id Идентификатор группы.
       */
      _loadToolbar : function(id){
         var
            config = this._elements[id].toolbarOpt,
            container  = $('<div class="ws-accordion-toolbar"></div>');

         this._elements[id].label.append(container);
         config.element = container;
         return $ws.core.attachInstance('SBIS3.CORE.ToolBar', config);
      },
      /**
       * Загрузка шаблона группы
       * @param {String} id Идентификатор группы.
       * @param {Boolean} [notifyOnClick] Необходимость поднятия события на клик.
       */
      _loadTemplate : function(id, notifyOnClick, changeState){
         var
            self = this,
            element = this._elements[id],
            container,
            activeElement = this._activeElement;

         self._loading = true;
         container = element.area.find(".ws-accordion-area");

         // TODO: add dimensions fix
         element.dReady = new $ws.proto.Deferred();

         this._runInBatchUpdate('_loadTemplate - Accordion', function() {
            return $ws.core.attachInstance('SBIS3.CORE.TemplatedArea', {
               autoHeight : self._options.autoHeight,
               autoWidth : self._options.autoWidth,
               template: element.template,
               element: container,
               parent: self.getParent(),
               keepSize: false,
               page: false,
               context : self.getLinkedContext(),
               owner: this.makeOwnerName(),
               isRelative: self._options.isRelative,
               handlers : {
                  onAfterLoad : function(){
                     self._loading = false;
                     self._notifyBatchDelayed('onGroupContentLoaded', id);

                     element.dReady.callback();
                     if (activeElement == id){
                        if (notifyOnClick !== false)
                           self._notifyBatchDelayed('onLabelClick', id);
                        self._notifyBatchDelayed('onGroupOpen', id, changeState);
                     }
                  }
               }
            }).addCallback(function(inst){
                  element.instance = inst;
                  if (self._elements[id].toolbarOpt !== undefined){
                     self._loadToolbar(id).addCallback(function(toolbar){
                        self._elements[id].toolbar = toolbar;
                        inst.registerChildControl(toolbar);
                     });
                  }
               });
         });
      },
      /**
       * Перетаскивает группу вверх
       * @param id
       */
      _dragToTop : function(id){
         if (this._activeElement !== -1){
            var
               p = this._elements[this._activeElement].position;
            for (var i in this._elements){
               if (this._elements[i].position < p)
                  this._elements[i].wrapper.after(this._elements[this._activeElement].wrapper);
            }
         }
         var
            first = this._container.children("div:eq(0)"),
            draggable = this._elements[id].wrapper;

         if (first[0] !== draggable[0]){
            first.before(draggable);
            draggable.removeClass("ws-accordion-wr-hover");
         }
      },
      _labelClickHandler: function(id){
         if(this._elements[id].enabled && !this._loading)
            this.toggleElement(id, true);
      },
      /**
       * Метод создания контрола
       */
      _bindInternals : function(){
         var
            self = this,
            elements = this._options.elements,
            container = this.getContainer(),
            l = elements.length;

         if (l){
            for (var i = 0; i < l; i++){
               var
                  label = container.find('.ws-element-id-' + i)
                  .bind('click', function(e){
                        var id = $(this).attr('data-acc-id');
                        self._labelClickHandler(id);
                     })
                  .hover(function(e){
                     $(this).parent().toggleClass('ws-accordion-wr-hover', e.type == 'mouseenter');
                  }),
                  wrapper = label.parent(),
                  area = wrapper.find('.ws-accordion-element-area');

               if (elements[i].active)
                  this._defaultActiveElement = elements[i].id;

               this._elements[elements[i].id] = {
                  position: i,
                  wrapper : wrapper,
                  hidden : !elements[i].visible,
                  areaHidden: true,
                  label : label,
                  area : area,
                  dReady : false,
                  template : elements[i].template,
                  toolbarOpt : elements[i].toolbar,
                  enabled : true
               };

               if (this._options.instantLoad && elements[i].template)
                  this._loadTemplate(elements[i].id);

            }
            if (this.hasEventHandlers("onLabelClick")){
               this._container.find(".ws-accordion-element-title").addClass("ws-accordion-has-handlers");
            }
         }
      },

      _dotTplFn : dotTplFn,

      _haveAutoSize: function() {
         return this._verticalAlignment !== "Stretch" && this._options.autoHeight;
      },

      _onResizeHandlerBatch: function() { this._onResizeHandler(); },

      _onSizeChangedBatch: function(controls) {
         this._calculateSize(true);
         return true;
      },

      /**
       * Подсчет размеров
       */
      _calculateSize : function(dontSendOnSizeChanged){
         var height = this._container.height();

         for (var j in this._elements){
            if (this._elements.hasOwnProperty(j)){
               var
                  label = this._elements[j].label,
                  hasSpaces = String.trim(label.text()).indexOf(" ")>-1;
               label.removeClass("ws-dbl-line");
               if (hasSpaces && label[0].scrollWidth > label[0].clientWidth)
                  label.addClass("ws-dbl-line");

               height -= label.outerHeight();
            }
         }

         if (this._verticalAlignment != "Stretch" && this._options.autoHeight){
            this._container.height('auto');
            if (!dontSendOnSizeChanged)
               this._notifyOnSizeChanged(this, this);
         }
         else{
            for(var i in this._elements){
               if (this._elements.hasOwnProperty(i)){
                  var area = this._elements[i].area;
                  area.height(height - (area.outerHeight() - area.height()));
               }
            }
         }
      },
      /**
       * обработчик изменения группы
       */
      _onResizeHandler:function(){
         if (!(this._verticalAlignment != "Stretch" && this._options.autoHeight))
            this._calculateSize();
         this._setGroupSize(this._activeElement);
         // вызов обработчика родителя($ws.proto.Control), чтобы центровать при максимальных размерах
         $ws.proto.Accordion.superclass._onResizeHandler.apply(this, arguments);
      },
      /**
       * Изменение размера группы
       * @param {String} id идентификатор группы
       */
      _setGroupSize : function(id){
         if (this._elements && this._elements[id]){
            var element = this._elements[id];
            if (element && $ws.helpers.instanceOfModule(element.instance, 'SBIS3.CORE.TemplatedArea'))
               element.instance._onResizeHandler();
         }
      },
      applyState : function(state){
         if (this._activeElement == -1) {
            if (!this._elements[state].hidden) {
               this._defaultActiveElement = state;
            }
         }
         else if (this._activeElement != state) {
            this.toggleElement(state, true);
         }
      }
   });

   return $ws.proto.Accordion;

});