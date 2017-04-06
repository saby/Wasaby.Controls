/**
 * Created by aa.petrunkov on 13.03.2017.
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
   "Core/helpers/dom&controls-helpers"
], function (EventBus,
             colhelper,
             cFunctions,
             cDeferred,
             simpleExtend,
             dColHelpers,
             ControlBatchUpdater,
             CommandDispatcher,
             dcHelpers) {
   'use strict';

   function ucFirst(str) {
      return str.substr(0, 1).toUpperCase() + str.substr(1);
   }

   return {

      $protected: {
         _options: {
            enabled: true,
            visible: true,
            primary: false,
            caption: '',
            tooltip: '',
            icon: ''
         }
      },

      _isControlActive: false,

      getAttr: function (attrName) {
         if (!window) {
            return this._container.attributes[attrName].value;
         } else
            return $(this._container).attr(attrName);
      },

      setIdProperty: function(){

      },

      fixIcon: function() {
         if (this._options.icon && this._options.icon.indexOf(":")){
            this._options.icon = this._options.icon.split(":")[1];
         }
      },

      deprecatedContr: function (cfg) {
         this._handlers = this._handlers || (cfg && cfg.handlers && typeof cfg.handlers == 'object' ? cFunctions.shallowClone(cfg.handlers) : {});
         this._subscriptions = this._subscriptions || [];
         this._subDestroyControls = this._subDestroyControls || [];
         this._destroyed = false;




         if (window) {
            this._container = $(this._container);
            //this._container[0].wsControl = this;
         }

         this.fixIcon();
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
      ///resources/Obmen_soobscheniyami_-_bazovyj/components/SendMessageInternal/SendMessageInternal.module.js : 2438
      setEnabled: function (value) {
         if (this._options.enabled !== value) {
            this._options.enabled = value;
            this._setDirty();
         }
      },

      isEnabled: function () {
         return this._options.enabled;
      },
      //debug/resources/Obmen_soobscheniyami_-_bazovyj/components/SendMessageInternal/SendMessageInternal.module.js
      isVisible: function () {
         return !this._options.hidden;
      },
      //https://test-online.sbis.ru/debug/resources/Obmen_soobscheniyami_-_bazovyj/components/SendMessageInternal/SendMessageInternal.module.js
      setVisible: function (value) {
         if (this._options.hidden !== !value) {
            this._options.hidden = !value;
            this._setDirty();
         }
      },

      setCaption: function(value)
      {
         this._options.caption = value;
         this._setDirty();
      },

      setIcon: function(value)
      {
         this._options.icon = value;
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
         IoC.resolve('ILogger').info(this._moduleName || 'Abstract', 'Метод _getOption вызвали для несуществующей опции "' + name + '"');
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
         if (!silent) {
            IoC.resolve('ILogger').info(this._moduleName || 'Abstract', 'Метод _setOption вызвали для несуществующей опции "' + name + '"');
         }
      },

      //for working getChildControlByName
      setParent: function (parent) {
         if (!parent._childsMapId[this._options.id]) {
            parent._childControls.push(this);
            parent._childsMapId[this._options.id] = parent._childControls.length - 1;
            parent._childsMapName[this._options.name] = parent._childControls.length - 1;
         }
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
         if (!!this._options.command) {
            var args = [this._options.command].concat(this._options.commandArgs);
            this.sendCommand.apply(this, args);
         }
         this._notify("onActivated");
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
      }

   };

});