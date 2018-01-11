/*global define, require, $ws*/
define('SBIS3.CONTROLS/Action/OpenDialog', [
   'SBIS3.CONTROLS/Action',
   'SBIS3.CONTROLS/Action/Mixin/DialogMixin',
   'WS.Data/Entity/Model',
   'WS.Data/Utils'
], function(Action, DialogMixin) {
   'use strict';

   /**
    * Класс, описывающий действие открытия диалога с заданным шаблоном.
    * @class SBIS3.CONTROLS/Action/OpenDialog
    * @extends SBIS3.CONTROLS/Action
    *
    * @mixes SBIS3.CONTROLS/Action/Mixin/DialogMixin
    *
    * @public
    * @author Красильников А.С.
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip
    * @ignoreOptions visible tooltip tabindex enabled className alwaysShowExtendedTooltip allowChangeEnable
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
    * @ignoreMethods setVisible toggle show isVisible hide getTooltip isAllowChangeEnable isEnabled isVisibleWithParents
    * @ignoreMethods addOwnedContext canAcceptFocus describe getAlignment getContainer getEditRecordDeferred getId getMinHeight
    * @ignoreMethods getMinSize getMinWidth getName getParent getParentByClass getParentByName getParentWindow getProperty
    * @ignoreMethods getTopParent hasEvent init initializeProperty isCanExecute isInitialized isSubControl runInPropertiesUpdate
    * @ignoreMethods setAllowChangeEnable setEnabled setProperties setProperty subscribeOnceTo subscribeTo unbind unsubscribeFrom
    *
    * @ignoreEvents onActivate onAfterLoad onBeforeControlsLoad onBeforeLoad onChange onClick onPropertyChanged
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onCommandCatch onDestroy onPropertiesChanged
    */
   var OpenDialog = Action.extend([DialogMixin],/** @lends SBIS3.CONTROLS/Action/OpenDialog.prototype */{

      /**
       * Производит <a href='/doc/platform/developmentapl/interface-development/forms-and-validation/windows/editing-dialog/open/'>открытие диалога редактирования</a>.
       * @param {Object} meta Параметры, которые переопределяют конфигурацию диалога.
       * @param {String|Number} meta.id Идентификатор записи. Переопределяет значение опции {@link SBIS3.CONTROLS/FormController#key key}.
       * @param {WS.Data/Entity/Record} meta.item Экземпляр класса записи. Переопределяет значение опции {@link SBIS3.CONTROLS/FormController#record record}.
       * @param {Object} meta.filter Набор инициализирующих значений, который используется при создании новой записи. Переопределяет значение опции {@link SBIS3.CONTROLS/FormController#initValues initValues}.
       * @param {Object} meta.readMetaData Набор инициализирующих значений, который используется при чтении записи. Переопределяет значение опции  {@link SBIS3.CONTROLS/FormController#readMetaData readMetaData}.
       * @param {String} meta.initializingWay переопределяет <a href='/doc/platform/developmentapl/interface-development/forms-and-validation/windows/editing-dialog/initializing-way/'>способ инициализации данных диалога</a>.
       * @param {Object} meta.dialogOptions Объект с пользовательскими опциями, которые передаются в диалог редактирования в <a href='/doc/platform/developmentapl/interface-development/core/oop/#configuration-class-parameters'>секцию _options</a>.
       * @param {Object} meta.componentOptions Объект с конфигурацией контрола, на основе которого создаётся диалог редактирования (см. {@link mode}).
       * @param {Boolean} meta.isNewRecord Установив этот флаг, при закрытии диалога будет отображено диалоговое окно для подтверждения действия. Если в диалоге выбран ответ "Нет", то запись будет удалена из БД при выполнении условий: на диалоге открыта новая запись (создана в БД и ей присвоен ID) и для записи не были изменены поля.
       * @example
       * <pre>
       * // myButton - экземпляр класса кнопки
       * // myDialogAction - экземпляр класса SBIS3.CONTROLS/Action/OpenDialog
       * myButton.subscribe('onActivated', function() {
       *    myDialogAction.execute({
       *       id: myId,
       *       item: myItem
       *    });
       * });
       * </pre>
       */
      execute: function(meta){
         return OpenDialog.superclass.execute.call(this, meta);
      },

      getDialog : function() {
         return this._dialog;
      }

   });
   return OpenDialog;
});