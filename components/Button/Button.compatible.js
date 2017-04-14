/**
 * Created by dv.zuev on 13.03.2017.
 */
define('js!SBIS3.CONTROLS.Button/Button.compatible', [
   'Core/EventBus',
   'Core/helpers/collection-helpers',
   'Core/core-functions',
   "Core/Deferred",
   'Core/core-simpleExtend',
   "Deprecated/helpers/collection-helpers",
   "Core/ControlBatchUpdater",
   "Core/CommandDispatcher",
   'Core/tmpl/js/helpers2/entityHelpers',
   "Core/helpers/dom&controls-helpers",
   "Core/constants",
   "Core/WindowManager",
   "Core/core-instance",
   "Core/helpers/functional-helpers",
   'Core/helpers/generate-helpers'
], function (EventBus,
             colhelper,
             cFunctions,
             cDeferred,
             simpleExtend,
             dColHelpers,
             ControlBatchUpdater,
             CommandDispatcher,
             entityHelpers,
             dcHelpers,
             cConstants,
             WindowManager,
             cInstance,
             funcHelpers,
             generate) {
   'use strict';

   if (typeof window !== 'undefined') {
      $(document).on("touchend  mouseup", function () {
         $('.controls-Click__active').removeClass('controls-Click__active');
      });
   }

   function ucFirst(str) {
      return str.substr(0, 1).toUpperCase() + str.substr(1);
   }

   return {

      $protected: {
         _options: {
            enabled: true,
            visible: true,
            primary: false,
            allowChangeEnable: true,
            caption: '',
            tooltip: '',
            icon: '',
            text: ''
         },
         _container: null
      },

      _isControlActive: false,
      _needRegistWhenParent: false,


      render: function (redraw) {

         var decOptions = this._container ? entityHelpers.createRootDecoratorObject(this._options.id, true, this.getAttr('data-component'), {}) : {},
            attributes = {};

         try {
            var attrs = this._container.attributes || this._container[0].attributes;
            for (var atr in attrs) {
               if (attrs.hasOwnProperty(atr)) {
                  var name = attrs[atr].name ? attrs[atr].name : atr,
                     value = attrs[atr].value || attrs[atr];
                  if (name === 'disabled' || name === 'title')
                     continue;
                  decOptions[name] = attributes[name] = value;

               }
            }

         } catch (e) {

         }

         /*КОСТЫЛЬ ЧИСТКА КЛАССОВ*/
         if (attributes['class']) {
            attributes['class'] = attributes['class'].replace('ws-enabled', '').replace('ws-disabled', '').replace('ws-hidden', '')
               .replace('controls-Button__primary', '').replace('controls-Button__default', '');
         }
         /**/

         //decOptions = entityHelpers.resolveDecOptionsClassMerge(decOptions, this._options, this._options);
         if (!this._options['class']) {
            var className = (this._options['class'] ? this._options['class'] + ' ' : '') +
               (this._options['className'] ? this._options['className'] + ' ' : '') +
               (this._options['cssClassName'] ? this._options['cssClassName'] + ' ' : '') +
               (attributes['class'] ? attributes['class'] + ' ' : '');
            this._options['class'] = className;
         }

         decOptions['class'] = this._options['class'];
         this._options['config'] = decOptions['config'];

         var markup = this._template(this, decOptions);

         //for example DSMixin
         if (window && this._container[0].tagName === "COMPONENT")
            redraw = true;

         if (redraw) {
            try {
               var temp = $(markup);

               $(this._container).before(temp);
               $(this._container).remove();
               this._container = temp;
               this.setContainer(this._container);
            } catch (e) {
            }
         }
         return markup;
      },

      setContainer: function(val) {
         if (!val)
            return;

         try {
            this._container.unbind();
         }catch(e){}

         this._container = val;

         try{
            if (!this._container[0].startTag)
               this._container[0].wsControl = this;
         }catch (e){}

         this._initInnerAction(this._container);
      },

      _initInnerAction: function(container)
      {
         if (window && container && !container[0].startTag) {
            container.on('click', this._onClickHandler.bind(this));
            var self = this;

            container.keydown(function(e) {
               var result = self._notify('onKeyPressed', e);
               if (e.which == cConstants.key.enter && result !== false ) {
                  self._onClickHandler(e);
               }
               if(e.which == cConstants.key.tab){
                  self.moveFocus(e);
               }
            });

            container.on("touchstart  mousedown", function (e) {
               if ((e.which == 1 || e.type == 'touchstart') && self.isEnabled()) {
                  self._container.addClass('controls-Click__active');
               }
               //return false;
            });
         }
         this._containerReady(container);
      },

      _containerReady:function(container){

      },

      getAttr: function (attrName) {
         if (!window) {
            return this._container.attributes[attrName].value;
         } else
            return $(this._container).attr(attrName);
      },

      setIdProperty: function(){

      },

      fixIcon: function() {
         if (this._options.icon && this._options.icon.indexOf(":")>-1){
            this._options.icon = this._options.icon.split(":")[1];
         }
      },

      setUserData: function(name, value) {
         if (!this._userData) {
            this._userData = {};
         }
         this._userData[name] = value;
      },

      getUserData: function(name) {
         return this._userData && this._userData[name];
      },

      deprecatedContr: function (cfg) {

         this._$context = null;
         this._$independentContext = false;
         this._$contextRestriction = '';
         this._$record = false;
         this._$modal = false;
         this._$validateIfHidden = false;
         this._$handleFocusCatch = false;
         this._$ignoreTabCycles = true;
         this._$groups = {};
         this._$currentTemplate = '';
         this._$isRelativeTemplate = false;
         this._$children = [];
         this._$_doGridCalculation = false;
         this._moduleName = 'SBIS3.CONTROLS.NewControl';
         this._horizontalAlignment = 'Left';
         this._pending = [];
         this._pendingTrace = [];
         this._waiting = [];
         this._groupInstances = {};
         this._activeChildControl = -1;
         this._activatedWithTabindex = true;
         this._childControls = [];
         this._childNonControls = [];
         this._childsMapName = {};
         this._childsMapId = {};
         this._childContainers = [];
         this._childsTabindex = false;
         this._childsSizes = {};
         this._maxTabindex = 0;
         this._dChildReady = null;
         this._keysWeHandle = [cConstants.key.tab,
                               cConstants.key.enter];

         this._resizer = null;
         this._toolbarCount =  {top: 0, right: 0, bottom: 0, left: 0};;
         this._defaultButton = null;
         this._activationIndex = 0;
         this._opener = undefined;
         this._isModal = false;
         this._isReady = false;
         this._waitersByName = {};
         this._waitersById = {};
         this._onDestroyOpener = null;
         this._isInitComplete = false;

         var ctor = this.constructor,
            defaultInstanceData = dcHelpers.getDefaultInstanceData(ctor);
         this._options = dcHelpers.mergeOptionsToDefaultOptions(ctor, this._options, {_options:defaultInstanceData});


         if (!cfg.name && cfg.container && cfg.container.getAttribute) {
            var iddata = cfg.container.getAttribute('data-id');
            cfg.name = iddata;
            cfg.sbisname = iddata;
            cfg.id = cfg.id||iddata;
         }

         if (!this._options.id){
            this._options.id = generate.randomId("cnt-");
         }

         if (!this._options.tabindex)
            this._options.tabindex = -1;

         this._handlers = this._handlers || (cfg && cfg.handlers && typeof cfg.handlers == 'object' ? cFunctions.shallowClone(cfg.handlers) : {});
         this._subscriptions = this._subscriptions || [];
         this._subDestroyControls = this._subDestroyControls || [];
         this._destroyed = false;




         if (window) {
            this._container = $(cfg.container || cfg.element);
         } else {
            this._container = cfg.container || cfg.element;
         }

         this.setContainer(this._container);

         this.fixIcon();

         if (this._options.primary === true) {
            this._registerDefaultButton();
         }

         /*ДИКИЙ ПРИДРОТ!!!*/
         if (this._container && this._options.parent) {
            this.render(true);
         }

      },

      _onResizeHandler: function () {

      },

      //совместимость для наследников;
      init: function () {

      },

      setProperties: function (obj) {
         this.runInPropertiesUpdate(function () {
            dColHelpers.forEach(obj, function (value, name) {
               this.setProperty(name, value);
            }, this);
         });
      },

      getReadyDeferred: function () {
         return new cDeferred().callback(true);
      },

      setProperty: function (name, value) {
         var
            methodName = 'set' + ucFirst(name),
            hasMethod = typeof(this[methodName]) === 'function',
            msg, result = undefined;

         if (hasMethod) {
            result = this[methodName](value);
         } else if (this._hasOption(name)) {
            this._setOption(name, value);
            this._setDirty();
         } else {
            msg = 'Метод setProperty вызвали для несуществующего свойства "' + name + '" (не определено соответствующего ему метода ' +
               methodName + ' и нет опции с именем "' + name + '"';

            throw new Error(msg);
         }

         return result;
      },


      //Для всплывающих панелей. Если не вернуть правильный дестрой - будет ошибка
      isDestroyed: function () {
         return this._destroyed;
      },

      destroy: function () {
         this._destroyed = true;
         try {
            this._container.remove();
         }catch(e){}

         if (this._options.parent._childsMapId[this._options.id]===0 || this._options.parent._childsMapId[this._options.id]) {
            delete this._options.parent._childControls[this._options.parent._childsMapId[this._options.id]];
            delete this._options.parent._childsMapId[this._options.id];
            delete this._options.parent._childsMapName[this._options.name];
            delete this._options.parent._childsTabindex[this._options.tabindex];
         }
      },

      /*For AreaAbstract*/
      getId: function () {
         return this._options.id;
      },

      getName: function () {
         return this._options.name;
      },

      ///resources/Obmen_soobscheniyami_-_bazovyj/components/SendMessageInternal/Buttons/ButtonMixin/ButtonMixin.module.js
      getParent: function () {
         return this._options.parent;
      },

      getTopParent: function(){
         return this._options && this._options.parent?this._options.parent.getTopParent():this;
      },
      ///resources/Obmen_soobscheniyami_-_bazovyj/components/SendMessageInternal/SendMessageInternal.module.js : 2438
      setEnabled: function (value) {
         if (!this._options.allowChangeEnable)
            return;

         if (this._options.enabled !== value) {
            this._options.enabled = value;
            this._setDirty();
         }
      },

      _setEnabled: function(value) {
         this.setEnabled(value);
      },

      _drawIcon: function(icon){
         this.setIcon(icon);
      },

      isEnabled: function () {
         return this._options.enabled;
      },
      //debug/resources/Obmen_soobscheniyami_-_bazovyj/components/SendMessageInternal/SendMessageInternal.module.js
      isVisible: function () {
         return this._options.visible;
      },
      //https://test-online.sbis.ru/debug/resources/Obmen_soobscheniyami_-_bazovyj/components/SendMessageInternal/SendMessageInternal.module.js
      setVisible: function (value) {
         if (this._options.visible !== value) {
            this._options.visible = value;
            this._setDirty();
         }
      },

      isDefaultButton: function(){
         return !!this._options.primary;
      },

      _unregisterDefaultButton: function() {
         this.sendCommand('unregisterDefaultButtonAction');
      },

      _registerDefaultButton: function() {
         if (!this._options.parent) {
            this._needRegistWhenParent = true;
            return;
         }
         function defaultAction(e) {
            if (self && self.isEnabled()) {
               self._onClickHandler(e);
               return false;
            } else {
               return true;
            }
         }
         var self = this;

         // регистрироваться имеют права только видимые кнопки. если невидимая кнопка зарегистрируется, мы нажмем enter и произойдет неведомое действие
         if (this.isVisible()) {
            // сначала отменяем регистрацию текущего действия по умолчанию, а потом регистрируем новое действие
            this._unregisterDefaultButton();
            this.sendCommand('registerDefaultButtonAction', defaultAction, this);
         }
      },

      /**
       * @noShow
       * @param isDefault
       */
      setDefaultButton: function(isDefault){
         if (isDefault === undefined) {
            isDefault = true;
         }

         if (isDefault) {
            this._registerDefaultButton();
         }
         else {
            this._unregisterDefaultButton();
         }

         this.setPrimary(isDefault);
      },

      setCaption: function(value)
      {
         this._options.caption = value||'';
         this._setDirty();
      },

      isInitialized: function(){
         return true;
      },

      setIcon: function(value)
      {
         this._options.icon = value||'';
         this.fixIcon();
         this._setDirty();
      },

      //resources/Obmen_soobscheniyami_-_bazovyj/components/SendMessageInternal/SendMessageInternal.module.js
      getContainer: function () {
         return $(this._container);
      },

      _setDirty: function () {
         this.render(true);
      },

      extend: function (mixins, overrides) {
         return simpleExtend.extend(this, mixins, overrides);
      },

      //use in MenuButton
      _modifyOptions: function (options) {
         return options;
      },

      setPrimary: function(flag){
         this._options.primary = !!flag;
         this._setDirty();
      },
      isPrimary: function(){
         return this._options.primary;
      },

      getProperty: function(name) {
         var
            nameUc = ucFirst(name),
            methodNameGet = 'get' + nameUc,
            hasMethodGet = typeof(this[methodNameGet]) === 'function',
            methodNameIs = 'is' + nameUc,
            hasMethodIs = typeof(this[methodNameIs]) === 'function',
            result, msg;

         if (hasMethodGet) {
            result = this[methodNameGet]();
         } else if (hasMethodIs) {
            result = this[methodNameIs]();
         } else if (this._hasOption(name)){
            result = this._getOption(name);
         } else {
            msg = 'Метод getProperty вызвали для несуществующего свойства "' + name + '" (не определено соответствующего ему метода ' +
               methodNameGet + ' или ' + methodNameIs + ' и нет опции с именем "' + name + '"';

            throw new Error(msg);
         }

         return result;
      },

      _hasOption: function (name) {
         //для обратной совместимости
         if (this._options && (name in this._options)) {
            return true;
         }
         return ('_$' + name) in this;
      },

      _getOption: function (name) {
         //для обратной совместимости
         if (this._options && (name in this._options)) {
            return this['_$' + name] = this._options[name];
         }
         if (('_$' + name) in this) {
            return this['_$' + name];
         }
         return this._options[name];
      },

      _setOption: function (name, value, silent) {
         //для обратной совместимости
         if (this._options && (name in this._options)) {
            this['_$' + name] = this._options[name] = value;
            return;
         }
         if (('_$' + name) in this) {
            this['_$' + name] = value;
            return;
         }
         this._options[name] = value;
      },


      _registerToParent: function(parent){

         var cur = parent._childControls.length,
            _id = this.getId(),
            tabindex = this.getTabindex();

         if (parent._childsMapId[_id] !== 0 && !parent._childsMapId[_id]) {

            if (tabindex) {
               var tabindexVal = parseInt(tabindex, 10);
               // Если индекс занят или -1 (авто) назначим последний незанятый
               if (tabindexVal == -1 || parent._childsTabindex[tabindexVal] !== undefined) {
                  tabindexVal = parent._maxTabindex + 1;
                  this.setTabindex(tabindexVal, true);
               }


               if (tabindexVal > 0) {
                  parent._maxTabindex = Math.max(parent._maxTabindex, tabindexVal);
                  if (!parent._childsTabindex) {
                     parent._childsTabindex = {};
                  }
                  parent._childsTabindex[tabindexVal] = cur;
               }
            }
            parent._childsMapId[this.getId()] = cur;
            parent._childsMapName[this.getName()] = cur;
            parent._childControls.push(this);
            parent._childContainers.push(this);
         }

      },

      registerChildControl: function(control){
         if(control instanceof  baseControl.Control){
            var oldParent = control.getParent();
            if(oldParent){
               if (oldParent !== this || this._childsMapId[control.getId()]) {
                  IoC.resolve('ILogger').error('AreaAbstract::registerChildControl',
                     rk('Нельзя зарегистрировать этот контрол:') + ' (' + control.getId() + ') ' + rk("в контроле:") + ' ' +
                     this.getId() + ', ' + rk("у него уже есть родитель:") + ' ' + oldParent.getId());
               }
            }
            var cur = this._childControls.length,
               tabindex = control.getTabindex();
            if(tabindex){
               var tabindexVal = parseInt(tabindex, 10);

               // Если индекс занят или -1 (авто) назначим последний незанятый
               if(tabindexVal == -1 || this._childsTabindex[tabindexVal] !== undefined){
                  tabindexVal = this._maxTabindex + 1;
                  control.setTabindex(tabindexVal, true);
               }
               if(tabindexVal > 0){
                  this._maxTabindex = Math.max(this._maxTabindex, tabindexVal);
                  if(!this._childsTabindex) {
                     this._childsTabindex = {};
                  }
                  this._childsTabindex[tabindexVal] = cur;
               }
            }
            this._childsMapId[control.getId()] = cur;
            this._childsMapName[control.getName()] = cur;
            this._childControls.push(control);
            this._childContainers.push(control);
            if(control instanceof AreaAbstract) {
               this._childContainers.push(control);
            }

            control.once('onInit', this._notifyOnChildAdded.bind(this, control));
         }
      },

      getParentByName : function(name){
         return this.findParent(function(parent){
            return parent.getName() == name;
         });
      },

      getOwner: function() {

         var owner = null,
            names, ctrlName, parentName, parent;

         // Если есть закэшированный владелец - отдадим его
         if (this._owner) {
            owner = this._owner;
         } else if (this._getOption('owner')) {
            if (this._getOption('owner').indexOf('/') !== -1) {
               names = this._getOption('owner').split('/');
               ctrlName = names[1];
               parentName = names[0];
            } else {
               ctrlName = this._getOption('owner');
            }
            // Если нет, но задан в опция - попробуем получить его
            try {
               parent = parentName ?  this.getParentByName(parentName) : this.getTopParent();
               // и закэшировать, если получилось
               this._owner = owner = parent.getChildControlByName(ctrlName);
            } catch(e){
               IoC.resolve('ILogger').error('Control', 'Некорректно задано св-во owner или отсутствует owner c именем "' + ctrlName + '"');
            }
         }

         return owner;
      },

      //for working getChildControlByName
      setParent: function (parent) {
         this._options.parent = parent;
         this._parent = parent;

         if (this._parent){
            this._registerToParent(this._parent);
            var topParent = this.getTopParent();
            if (topParent) {
               if (topParent.isReady()) {
                  // находим и кэшируем владельца
                  this.getOwner();
               } else {
                  // если родитель еще не готов, дождемся готовности и закэшируем овнера
                  topParent.subscribe('onReady', funcHelpers.forAliveOnly(this.getOwner, this));
               }
            }
         }

         /*if (parent._childsMapId[this._options.id]!==0 && !parent._childsMapId[this._options.id]) {
            parent._childControls.push(this);
            parent._childsMapId[this._options.id] = parent._childControls.length - 1;
            parent._childsMapName[this._options.name] = parent._childControls.length - 1;
         }*/

         if (this._needRegistWhenParent)
         {
            this._needRegistWhenParent = false;
            this._registerDefaultButton();
         }

         this.setContainer(this._container);
      },

      _getElementToFocus: function() {
         return this._container;
      },

      canAcceptFocus: function () {
         //беда, так в оригинале:
         //return this.isVisible() && this.isEnabled() && this.getTabindex() && dcHelpers.isElementVisible(this.getContainer());

         return true;
      },

      _isCorrectContainer: function () {
         // Container must be valid jQuery object having only one element inside
         return this._container !== undefined && ('jquery' in this._container) && this._container.length == 1;
      },

      _updateActiveStyles: function () {
         var active = this._isControlActive;
         if (this._isCorrectContainer()) {
            this._container.toggleClass('ws-control-inactive', !active).toggleClass('ws-has-focus', active);
         }
      },

      findParent: function (filter) {
         if (typeof filter != 'function')
            throw new Error("Control.findParent - требуется передать функцию-фильтр");
         var parent = this;
         do {
            parent = parent.getParent();
         } while (parent && !filter(parent));
         return parent;
      },

      _needFocusOnActivated: function () {
         var isMobile = false,//Constants.browser.isMobilePlatform,
            focusOpt = this._options['focusOnActivatedOnMobiles'];

         return !isMobile || focusOpt === undefined || focusOpt;
      },

      getTabindex: function () {
         if (!this._options['tabindex'])
            this._options['tabindex'] = 0;

         return +this._options['tabindex'];
      },

      setTabindex : function(tabindex, notCalculate){
         var parent = this.getParent();
         if (!notCalculate && parent) {
            parent.changeControlTabIndex(this, tabindex);
         } else {
            this._setOption('tabindex', tabindex);
         }
      },


      changeControlTabIndex : function(control, tabindex){
         var curTabIndex = control.getTabindex(),
            controlPos =  colHelpers.findIdx(this._childControls, function (child) {
               return child === control;
            }),
            calcMaxTabIndex = dColHelpers.reduce.bind(this, this._childsTabindex, function(max, _, idx) {
               return Math.max(max, idx);
            }, 0),
            enumerateChildByTabIdx = function(func, reverse) {
               var i, child, childId, maxIdx = calcMaxTabIndex();

               function handleTabIdx(i) {
                  if (this._childsTabindex[i] !== undefined) {
                     childId = this._childsTabindex[i];
                     child = this._childControls[childId];
                     if (child) {
                        func.call(this, child, childId);
                     }
                  }
               }

               if (reverse) {
                  for (i = maxIdx; i > 0; i--) {
                     handleTabIdx.call(this, i);
                  }
               } else {
                  for (i = 1; i <= maxIdx; i++) {
                     handleTabIdx.call(this, i);
                  }
               }
            }.bind(this);

         //Если контрол был в обходе
         if (curTabIndex !== 0) {
            delete this._childsTabindex[curTabIndex];

            //Сдвигаем старые индексы
            enumerateChildByTabIdx(function (child, idx) {
               var childTabIndex = child.getTabindex();
               if (childTabIndex > curTabIndex) {
                  delete this._childsTabindex[childTabIndex];
                  this._childsTabindex[childTabIndex - 1] = idx;
                  this._childControls[idx].setTabindex(childTabIndex - 1, true);
               }
            }, false);
         }

         //Если контрол не удаляется вообще из обхода (tabindex !== 0)
         if (tabindex === -1) {
            this._maxTabindex = calcMaxTabIndex() + 1;

            control.setTabindex(this._maxTabindex, true);
            this._childsTabindex[this._maxTabindex] = controlPos;
         } else {
            if (tabindex !== 0) {
               enumerateChildByTabIdx(function (child, idx) {
                  var childTabIndex = child.getTabindex();
                  if (childTabIndex >= tabindex) {
                     delete this._childsTabindex[childTabIndex];
                     this._childsTabindex[childTabIndex + 1] = idx;
                     this._childControls[idx].setTabindex(childTabIndex + 1, true);
                  }
               }, true);

               this._childsTabindex[tabindex] = controlPos;
            }

            control.setTabindex(tabindex, true);
            this._maxTabindex = calcMaxTabIndex();
         }
      },

      isVisibleWithParents: function () {
         var parent = this, visible = this.isVisible() && dcHelpers.isElementVisible(this.getContainer());

         while (parent && visible) {
            visible = parent.isVisible();
            parent = parent.getParent();
         }
         return visible;
      },

      isActive : function(){
         return this._isControlActive;
      },

      setActive: function (active, shiftKey, noFocus, focusedControl) {
         var wasActive = this._isControlActive,
            myParent;

         this._isControlActive = active;
         this._updateActiveStyles();

         if (this._isCorrectContainer()) {
            if (active) {

               if (active !== wasActive) {
                  // Если контрол был ранее неактивен - поднимем FocusIn - это приведет к возможному появлению подсказки
                  myParent = this.getParent();
                  if (myParent) {
                     myParent.activate(this);
                  }

                  //_isControlActive надо проверить - какой-то onFocusIn/onFocusOut в myParent.activate мог отменить активность
                  if (this._isControlActive) {
                     this._notify('onFocusIn');
                  }
               } else {

                  // Если контрол уже активный - возможно надо показать подсказку
                  /*if(this._isCanShowExtendedTooltip() && this._tooltipSettings.handleFocus) {
                   this._showExtendedTooltip();
                   }*/

               }

               // Откладываем фокусировку до подняния вверх myParent.activate, иначе там очищалось выделение
               // _isControlActive надо проверить - какой-то onFocusIn/onFocusOut мог отменить активность - тогда фокус ставить не надо
               if (this._isControlActive && !noFocus) {
                  ControlBatchUpdater.runBatchedDelayedAction('Control.focus', [this]);
               }
            }
            else if (active !== wasActive) {
               this._notify('onFocusOut', false, focusedControl);

               // Если контрол теряет активность, его предки тоже должны потерять активность,
               // иначе при уходе с контрола активности будет отключаться активность его предков, дойдет до CompoundActiveFixMixin,
               // он вызовет setActive не AreaAbstract а этот, и дизактивация предков на нем и завершится, то что выше будет считаться активным не являясь таковым
               if (focusedControl) {
                  var filter = function (parent) {
                     return parent === myParent;
                  };

                  myParent = this.getParent();
                  if (myParent) {
                     //область надо деактивировать, если новый активный контрол не лежит внутри неё
                     if (!focusedControl.findParent(filter)) {
                        if (focusedControl !== myParent) {
                           myParent.setActive(false, undefined, undefined, focusedControl);
                        } else {
                           // если компонент теряет активность, его предок должен забыть про то, что этот компонент внутри предка - активен
                           myParent._activeChildControl = -1;
                           myParent._activatedWithTabindex = false;
                        }
                     }
                  }
               }
            }
         }
      },


      //В ЭДО в кнопке есть что-то
      hasChildControlByName: function () {
         return false;
      },

      show: function () {
         this._container.removeClass("ws-hidden");
      },

      hide: function () {
         this._container.addClass("ws-hidden");
      },


      /*EVENTS BLOCK*/
      getEventHandlers: function(name) {
         return this._getChannel().getEventHandlers(name);
      },

      _getChannel: function () {
         if (!this._eventBusChannel) {
            if (!this._options.eventBusId)
               this._options.eventBusId = "eb_" + this._options.id;

            this._eventBusChannel = EventBus.channel(this._options.eventBusId, {
               _waitForPermit: false
            });
         }
         return this._eventBusChannel;
      },

      _publish: function () {
         for (var i = 0, li = arguments.length; i < li; i++) {
            var event = arguments[i], handlers = this._handlers[event], j, lh;
            if (handlers) {
               if (typeof handlers === 'function') {
                  this._getChannel().subscribe(event, handlers, this);
                  this._handlers[event] = null;
               }
               else {
                  lh = handlers.length;
                  if (lh) {
                     for (j = 0; j < lh; j++) {
                        this._getChannel().subscribe(event, handlers[j], this);
                     }
                     this._handlers[event].length = 0;
                  }
               }
            }
         }
      },

      _notify: function (event/*, payload*/) {

         var
            channel = this._getChannel(),
            args = Array.prototype.slice.call(arguments, 1),
            result;

         channel._waitForPermit = false;
         result = channel._notifyWithTarget(event, this, args);

         return result;
      },

      _onClickHandler: function(e)
      {
         try{
            e.stopImmediatePropagation();
            e.stopPropagation();
         }catch(e){}

         if (!this._options.enabled)
            return;


         if (!!this._options.command) {
            var args = [this._options.command].concat(this._options.commandArgs);
            this.sendCommand.apply(this, args);
         }
         this._onClick();
      },

      sendCommand : function( commandName) {
         var payload = Array.prototype.slice.call(arguments, 1);
         payload.unshift(this, commandName);
         return CommandDispatcher.sendCommand.apply(CommandDispatcher, payload);
      },

      once: function (event, handler) {
         this._getChannel().once(event, handler, this);
      },

      subscribe: function (event, $handler) {
         this._getChannel().subscribe(event, $handler, this);
         return this;
      },

      unsubscribe: function (event, handler) {
         this._getChannel().unsubscribe(event, handler);
         return this;
      },

      unbind: function (event) {
         this._getChannel().unbind(event);
         return this;
      },

      subscribeTo: function (control, event, handler) {
         return this._subscribeTo(control, event, handler, false);
      },


      _subscribeTo: function (control, event, handler, once) {
         if (!control.isDestroyed || (!control.isDestroyed() && !this.isDestroyed())) {
            if (typeof handler !== 'function') {
               throw new Error(rk('Аргумент handler у метода subscribeTo должен быть функцией'));
            }

            var sub, onceWrapper, contr;
            control[once ? 'once' : 'subscribe'](event, handler);

            if (once) {
               onceWrapper = function () {
                  this._unsubscribeFrom(control, event, handler, onceWrapper);
               }.bind(this);

               this._subscriptions.push({
                  handler: handler,
                  control: control,
                  event: event,
                  onceWrapper: onceWrapper
               });

               control.once(event, onceWrapper);
            }
            else {
               sub = colhelper.find(this._subscriptions, function (sub) {
                  return sub.control === control && sub.handler === handler &&
                     sub.event === event && sub.onceWrapper === undefined;
               });

               if (!sub) {
                  this._subscriptions.push({
                     handler: handler,
                     control: control,
                     event: event
                  });
               }
            }

            contr = colhelper.find(this._subDestroyControls, function (sub) {
               return sub.control === control;
            });

            if (!contr) {
               var onDestroy = function (event) {
                  //нужно отписываться только на onDestroy своего контрола
                  if (event.getTarget() === control) {
                     this.unsubscribeFrom(control);
                  }
               }.bind(this);
               this._subDestroyControls.push({control: control, handler: onDestroy});

               //тут я ожидаю, что отписка внутри notify('onDestroy') не испортит уже выполняющуюся цепочку onDestroy
               //(см. EventBusChannel.notify) - иначе пользовательские onDestroy, подписанные после служебного onDestroy,
               //не выполнятся, поскольку служебный onDestroy отписывает все мои обработчики всех событий этого контрола.
               control.subscribe('onDestroy', onDestroy);
            }
         }

         return this;
      },

      unsubscribeFrom: function (control, event, handler) {
         return this._unsubscribeFrom(control, event, handler);
      },

      _unsubscribeFrom: function (control, event, handler, onceWrapper) {
         var self = this;

         function filterSubs(needUnsub) {
            return colhelper.filter(self._subscriptions, function (sub) {
               var ok = (control === undefined || control === sub.control) &&
                  (event === undefined || event === sub.event) &&
                  (handler === undefined || handler === sub.handler) &&
                  (onceWrapper === undefined || onceWrapper === sub.onceWrapper);

               return needUnsub ? ok : !ok;
            });
         }

         function filterControlDestroys(needUnsub) {
            return colhelper.filter(self._subDestroyControls, function (controlSub) {
               var ok = !colhelper.find(self._subscriptions, function (sub) {
                  return sub.control === controlSub.control;
               });
               return needUnsub ? ok : !ok;
            });
         }

         var unsubs = filterSubs(true);

         this._subscriptions = filterSubs(false);

         //если _unsubscribeFrom вызывается из onceWrapper (см. subscribeTo+once), то источник - sub.control
         //уже сам отписал обработчики у себя, и приёмнику отписываться не надо (и нельзя, потому что тогда источник отпишет не once-обработчики с таким вот handler)
         if (!onceWrapper) {
            colhelper.forEach(unsubs, function (sub) {
               if (!sub.control.isDestroyed || !sub.control.isDestroyed()) {
                  sub.control.unsubscribe(sub.event, sub.handler);
               }
            });
         }

         //оставляем те обработчики удаления контрола, для которых есть какие-то подписки на этот контрол
         var unsubControls = filterControlDestroys(true);
         this._subDestroyControls = filterControlDestroys(false);

         colhelper.forEach(unsubControls, function (sub) {
            if (!sub.control.isDestroyed || !sub.control.isDestroyed()) {
               sub.control.unsubscribe('onDestroy', sub.handler);
            }
         });

         return this;
      },

      hasEventHandlers: function(name) {
         return this._getChannel().hasEventHandlers(name);
      },

      /*END EVENTS BLOCK*/
      _notifyOnPropertyChanged: function (propertyName) {
         if (!this._propertiesChangedLock)
            this._propertiesChangedLock = 0;

         this._notify('onPropertyChanged', propertyName);
         if (this._propertiesChangedLock > 0) {
            this._propertiesChangedCnt++;
         } else {
            this._notify('onPropertiesChanged');
         }
      },

      runInPropertiesUpdate: function (func, args) {
         //USING IN DSMixin. Control.module.js
         var result;
         if (!this._propertiesChangedLock)
            this._propertiesChangedLock = 0;


         try {
            this._propertiesChangedLock++;
            result = func.apply(this, args || []);
         } finally {
            this._propertiesChangedLock--;
            if (this._propertiesChangedLock === 0 && this._propertiesChangedCnt !== 0) {
               this._propertiesChangedCnt = 0;
               this._notify('onPropertiesChanged');
            }
         }
         return result;
      },

      setTooltip: function(tt)
      {
         this._options.tooltip = tt;
         this._setDirty();
      },

      getTooltip: function()
      {
         return this._options.tooltip;
      },

      getCaption: function()
      {
         return this._options.caption;
      },

      getIcon: function()
      {
         return this._options.icon?"sprite:"+this._options.icon:'';
      },

      toggle: function(show)
      {
         if(arguments.length > 0){
            this.setVisible(!!show);
         }else{
            this.setVisible(!this._options.visible);
         }
      },

      /**********************************************************************************************************************************************************************/

      moveFocus: function(event){
         event.stopPropagation();
         if(!this.detectNextActiveChildControl(event.shiftKey)){//Не смогли найти следующий
            // Мы должны либо отпустить фокус в браузер либо выйти из вложенного ареа
            if(this.focusCatch(event)){
               return true;
            }
         }
         return false;
      },

      focusCatch: function(event){
         var parent = this.getParent();
         if(!parent){ //Если нет парента то это либо окно, либо самая верхняя ареа => отпускаем в браузер
            WindowManager.disableLastActiveControl();
            if(event.shiftKey){
               WindowManager.focusToFirstElement();
            }
            else{
               WindowManager.focusToLastElement();
            }
            return true;
         }
         else{
            //Пытаемся найти следующий, пробегаюсь по своим парентам.
            return parent.moveFocus(event);
         }
      },

      detectNextActiveChildControl: function(isShiftKey, searchFrom) {
         var
            nextInfo = this.detectNextActiveChildControlIndex(isShiftKey, searchFrom),
            next = nextInfo.index,
            res = nextInfo.isValid, active;

         if (res) {
            //Установка фокуса на найденный контрол
            active = nextInfo.isTabIndex ? this._childsTabindex[next] : next;
            res = !!this._childControls[active];
            if (res) {
               this._childControls[active].setActive(true, isShiftKey);
            }
         }
         return res;
      },

      _getNextIndexInfo: function(isShiftKey, searchFrom) {
         var
            curIndex = searchFrom !== undefined ? searchFrom : this._activeChildControl,
            curIndexIsTabIndex = (searchFrom !== undefined || this._activatedWithTabindex) && !!this._childsTabindex,
            childLength = this._childControls.length,
            nextIndex = isShiftKey ? curIndex - 1 : curIndex + 1,
            isOk = curIndexIsTabIndex ? //Проверка следующего табиндекса на доступное значение
               (isShiftKey ? nextIndex > 0 : nextIndex <= this._maxTabindex) :
               (isShiftKey ? nextIndex >= 0 : nextIndex < childLength),
            last, first;

         if (!isOk) {
            last = curIndexIsTabIndex ? this._maxTabindex : childLength - 1;
            first = curIndexIsTabIndex ? 1 : 0;

            nextIndex = isShiftKey ? last : first;
         }

         return {
            nextIndex: nextIndex,
            nextIndexIsTabIndex: curIndexIsTabIndex,
            isNextCycle: !isOk
         };
      },

      detectNextActiveChildControlIndex: function(isShiftKey, searchFrom) {
         // проверка контрола, в который планируется переход по табу
         function controlOk(idx, idxIsTabIdx) {
            var
               contrIdx = idxIsTabIdx ? self._childsTabindex[idx] : idx,
               contr = contrIdx !== undefined && self._childControls[contrIdx];

            return contr && contr.canAcceptFocus();
         }

         var
            self = this,
            nextIndexInfo = this._getNextIndexInfo(isShiftKey, searchFrom),
            idxIsTabIdx = nextIndexInfo.nextIndexIsTabIndex,
            cur = nextIndexInfo.nextIndex,
            first = idxIsTabIdx ? 1 : 0,
            last = idxIsTabIdx ? this._maxTabindex : this._childControls.length - 1,
            ignoreTabCycles = this._getOption('ignoreTabCycles');

         if (nextIndexInfo.isNextCycle && ignoreTabCycles) {
            //если обход по табу в этом контроле не должен зацикливаться, то заменяем cur на индекс за границами
            //массива дочерних контролов - тогда клиент метода detectNextActiveChildControlIndex обработает это как выход
            //из этого контрола в родительский
            cur = isShiftKey ? first - 1 : last + 1;
         }
         else {
            //ищем индекс подходящего контрола
            while (isShiftKey ? cur >= first : cur <= last) {
               if (controlOk(cur, idxIsTabIdx)) {
                  break;
               }
               cur = isShiftKey ? cur - 1 : cur + 1;
            }

            //если не нашли, и обход по табу должен зацикливаться, то становимся в начало обхода, и ищем подходящий контрол
            if ((cur < first || cur > last) && !ignoreTabCycles) {
               cur = isShiftKey ? last : first;

               while (cur >= first && cur <= last) {
                  if (controlOk(cur, idxIsTabIdx)) {
                     break;
                  }
                  cur = isShiftKey ? cur - 1 : cur + 1;
               }
            }
         }
         return {
            index: cur,
            isTabIndex: nextIndexInfo.nextIndexIsTabIndex,
            isValid: cur >= first && cur <= last
         };
      },
   };

});