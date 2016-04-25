define('js!SBIS3.CONTROLS.DialogActionBase', ['js!SBIS3.CONTROLS.ActionBase', 'js!SBIS3.CORE.Dialog', 'js!SBIS3.CORE.FloatArea', 'js!SBIS3.CONTROLS.Data.Record'], function(ActionBase, Dialog, FloatArea, Record){
   'use strict';

   /**
    * Действие открытия окна с заданным шаблоном
    * @class SBIS3.CONTROLS.DialogActionBase
    * @public
    * @extends SBIS3.CONTROLS.ActionBase
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip
    *
    * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
    * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
    * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
    * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
    * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
    * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
    * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
    * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
    * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
    * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    */
   var OpenDialogAction = ActionBase.extend(/** @lends SBIS3.CONTROLS.DialogActionBase.prototype */{
      $protected : {
         _options : {
            /**
             * @cfg {String}
             * Компонент который будет отображен
             */
            dialogComponent : '',
            /**
             * @cfg {String}
             * @variant dialog в новом диалоге
             * @variant floatArea во всплывающей панели
             * Режим отображения компонента редактирования - в диалоге или панели
             */
            mode: 'dialog',
            //TODO переименовать
            linkedObject: undefined
         },
         _dialog: undefined,
         _formController: undefined
      },

      execute : function(meta) {
         this._opendEditComponent(meta, this._options.dialogComponent);
      },

      _openDialog: function(meta, dialogComponent){
         this._opendEditComponent(meta, dialogComponent, 'dialog');
      },

      _openFloatArea: function(meta, dialogComponent){
         this._opendEditComponent(meta, dialogComponent, 'floatArea');
      },

      _opendEditComponent: function(meta, dialogComponent, mode){
         var self = this,
            config, Component,

         compOptions = this._buildComponentConfig(meta);
         config = {
            opener: this,
            template: dialogComponent,
            componentOptions: compOptions
         };
         if (meta.title) {
            config.title = meta.title;
         }

         mode = mode || this._options.mode;
         if (mode == 'floatArea'){
            Component = FloatArea;
            config.isStack = meta.isStack !== undefined ? meta.isStack : true;
            config.autoHide = meta.autoHide !== undefined ? meta.autoHide : true;
            config.autoCloseOnHide = meta.autoCloseOnHide !== undefined ? meta.autoCloseOnHide : true;
         } else if (mode == 'dialog') {
            Component = Dialog;
         }

         //для формконтроллера теперь всегда есть контекст с рекордом. Сделано в рамках ускорения, чтобы в случае чего
         //компоненты на момент инициализации могли подцепить значение из контекста
         config.context = new $ws.proto.Context({restriction: 'set'}).setPrevious(this.getLinkedContext());
         config.context.setValue('record', config.record || new Record());

         if (this._dialog && !this._dialog.isAutoHide()){
            $ws.core.merge(this._dialog._options, config);
            this._dialog.reload();
            return;
         }

         config.componentOptions.handlers = this._getFormControllerHandlers();
         config.handlers = {
            onAfterClose: function (e, meta) {
               self._dialog = undefined;
               self._notifyOnExecuted(meta, this._record);
            },
            onBeforeShow: function () {
               self._formController = this._getTemplateComponent();
            }
         };

         this._dialog = new Component(config);
      },

      _getFormControllerHandlers: function(){
         return {
            onRead: this.onRead.bind(this),
            onUpdate: this.onUpdate.bind(this),
            onDestroy: this.onDestroy.bind(this),
            onCreate: this.onCreate.bind(this)
         }
      },

      onUpdate: function(event, record){
         var notifyResult = this._notify('onUpdate', record),
             collection = this._options.linkedObject;
         if (notifyResult === undefined){
            notifyResult = this._onUpdate(record);
         }
         //TODO Зачем асинхронщина?
         if (notifyResult instanceof $ws.proto.Deferred){
            notifyResult.addCallback(function(result){
               if (result !== OpenDialogAction.ACTION_MANUAL){

               }
            })
         }

         if (notifyResult !== OpenDialogAction.ACTION_MANUAL){
            if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.DSMixin')){
               collection.reload();
            }
            else if ($ws.helpers.instanceOfMixin(collection, 'SBIS3.CONTROLS.Data.Collection.IList')){
               //Обновляем поля из пришедшего рекорда в linkerObject
            }
         }
      },

      _onUpdate: function(record){
      },

      onRead: function(event, record){
         this._onRead(record);
         var notifyResult = this._notify('onRead', record);
      },
      _onRead: function(record){
      },

      onDestroy: function(event){
         this._onDestroy();
         var notifyResult = this._notify('onDestroy');
      },
      _onDestroy: function(){
      },

      onCreate: function(event, record){
         this._onCreate();
         var notifyResult = this._notify('onCreate', record);
      },
      _onCreate: function(){
      },

      _buildComponentConfig: function() {
         return {}
      }
   });
   OpenDialogAction.ACTION_MANUAL = 'manual';
   OpenDialogAction.ACTION_BASE = 'base';
   return OpenDialogAction;
});