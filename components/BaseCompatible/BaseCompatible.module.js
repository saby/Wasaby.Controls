/**
 * Created by dv.zuev on 11.04.2017.
 */
/**
 * Created by dv.zuev on 13.03.2017.
 */
define('js!SBIS3.CONTROLS.BaseCompatible', [
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
   "Core/Context",
   "Core/ParallelDeferred",
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
             Context,
             cParallelDeferred,
             generate) {
   'use strict';

   return {

      render: function (redraw) {

         var decOptions = this._container ? entityHelpers.createRootDecoratorObject(this._options.id, true, this.getAttr('data-component'), {}) : {},
            attributes = {};

         try {
            var attrs = this._container.attributes || this._container[0].attributes;
            for (var atr in attrs) {
               if (attrs.hasOwnProperty(atr)) {
                  var name = attrs[atr].name ? attrs[atr].name : atr,
                     value = attrs[atr].value || attrs[atr];
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

         var markup = this._template(this, decOptions, this._context);

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
         } else if (window) {
            this._container = $('[config="'+this._options.config+'"]');
            this.setContainer(this._container);
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
            /*TODO:: ЧЕКНУТЬ*/
            if (!this._container[0].startTag)
               this._container[0].wsControl = this;


         }catch (e){}

         if (window && this._container && this._container[0])
            this._initInnerAction(this._container);
      },

      _initInnerAction: function(container)
      {
         if (typeof(this._containerReady) === 'function')
            this._containerReady(container);
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

      isReady: function(){
         return true;
      },

      initOptions: function(){
         if (!this._options)
            this._options = {};

         if (!this._options.eventBusId)
            this._options.eventBusId = "ev-"+this.getId();
         if (!this._options.owner)
            this._options.owner = null;
         if (!this._options.enabled)
            this._options.enabled = true;
         if (!this._options.visible)
            this._options.visible = true;
         if (!this._options.primary)
            this._options.primary = false;
         if (!this._options.allowChangeEnable)
            this._options.allowChangeEnable = true;
         if (!this._options.caption)
            this._options.caption = '';
         if (!this._options.tooltip)
            this._options.tooltip = '';
         if (!this._options.icon)
            this._options.icon = '';
         if (!this._options.text)
            this._options.text = '';

      },

      deprecatedContr: function (cfg) {
         this._thisIsInstance = true;

         this._icanrulefocus = false;

         this._context = null;
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
         this._moduleName = 'SBIS3.CORE.AreaAbstract';
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
         this._keysWeHandle = [cConstants.key.tab,
                               cConstants.key.enter];

         //Для getReadyDeferred
         this._dChildReady = new cParallelDeferred();
         this._dChildReady.done();
         //Для isInitialized
         this._isInitialized = true;

         //Для isReady
         this._isReady = true;

         this._resizer = null;
         this._toolbarCount =  {top: 0, right: 0, bottom: 0, left: 0};;
         this._defaultButton = null;
         this._activationIndex = 0;
         this._opener = undefined;
         this._isModal = false;


         this._waitersByName = {};
         this._waitersById = {};
         this._onDestroyOpener = null;
         this._isInitComplete = false;

         var ctor = this.constructor,
            defaultInstanceData = dcHelpers.getDefaultInstanceData(ctor);
         //this._options = cFunctions.shallowClone(cfg);
         this._options = dcHelpers.mergeOptionsToDefaultOptions(ctor, cfg, {_options:this._options});


         if (!this._options.name && this._options.container && this._options.container.getAttribute) {
            var iddata = cfg.container.getAttribute('data-id');
            this._options.name = iddata;
            this._options.sbisname = iddata;
            this._options.id = cfg.id||iddata;
         }

         if (!this._options.id){
            this._options.id = generate.randomId("cnt-");
         }


         this._id = this._options.id;

         this._handlers = this._handlers || (cfg && cfg.handlers && typeof cfg.handlers == 'object' ? cFunctions.shallowClone(cfg.handlers) : {});
         this._subscriptions = this._subscriptions || [];
         this._subDestroyControls = this._subDestroyControls || [];
         this._isDestroyed = false;

         this._childControls = [];
         this._childContainers = [];
         this._childsMapId = {};
         this._childsMapName = {};

         if (!this._options.tabindex)
            this._options.tabindex = -1;

         /*TODO:: check container*/

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

         this.initOptions();
         var obj = this._createContext(this._options);
         this._context = obj.context;

         this._allowEvents();

         if (this._options.parent){
            this.setParent(this._options.parent);
         }

         if (this._container && this._options.parent && (typeof this._container.attr === "function") && this._container.attr("hasMarkup")!=="true") {
            this.render(true);
         }
      },


      //совместимость для наследников;
      init: function () {

      },

      clearInformationOnParent: function() {
         delete this._parent._childControls[this._parent._childsMapId[this._options.id]];
         delete this._parent._childContainers[this._parent._childsMapId[this._options.id]];
         delete this._parent._childsMapId[this._options.id];
         delete this._parent._childsMapName[this._options.name];
         delete this._parent._childsTabindex[this._options.tabindex]
      },

      destroy: function () {
         if(this.isActive()){
            this._isControlActive = false;
            this._notify('onFocusOut', true);   //Фокус с элемента уходит
         }

         this._isDestroyed = true;
         try {
            this._container.remove();
         }catch(e){}

         CommandDispatcher.deleteCommandsForObject(this);

         if (this._options.parent && this._options.parent._childsMapId[this._options.id]===0 || this._options.parent._childsMapId[this._options.id]) {
            this.clearInformationOnParent();
         }
      },

      unregisterChildControl: function(control){
         if (this._childsMapId[control._options.id]===0 || this.childsMapId[control._options.id]) {
            delete this._childControls[this._childsMapId[control._options.id]];
            delete this._childContainers[this._childsMapId[control._options.id]];
            
            delete this._childsMapId[control._options.id];
            delete this._childsMapName[control._options.name];
            delete this._childsTabindex[control._options.tabindex];
         }
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

      _setVisibility: function(value) {
         this.setVisible(value);
      },

      setCaption: function(value) {
         this._options.caption = value||'';
         this._setDirty();
      },


      setIcon: function(value) {
         this._options.icon = value;
         this.fixIcon();
         this._setDirty();
      },

      _setDirty: function () {
         this.render(true);
      },

      setPrimary: function(flag){
         this._options.primary = !!flag;
         this._setDirty();
      },
      isPrimary: function(){
         return this._options.primary;
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

      recalcSelfTabindex: function() {
         if (this._parent && this._baseTabIndex===-1){
            this.clearInformationOnParent();
            this._options.tabindex = this._baseTabIndex;
            this._registerToParent(this._parent);
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

      finalRegToParent: function(){
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
      },

      //for working getChildControlByName
      setParent: function (parent) {
         this._options.parent = parent;
         this._parent = parent;

         if (this._parent){
            this.finalRegToParent();
         }

         if (this._needRegistWhenParent)
         {
            this._needRegistWhenParent = false;
            this._registerDefaultButton();
         }

         this.setContainer(this._container);
      },

      setTooltip: function(tt)
      {
         this._options.tooltip = tt;
         this._setDirty();
      },


      getCaption: function()
      {
         return this._options.caption;
      },

      getIcon: function()
      {
         return this._options.icon?"sprite:"+this._options.icon:this._options.icon;
      }



   };

});