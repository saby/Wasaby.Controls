/*global define, require, $ws*/
define('js!SBIS3.CONTROLS.Action.OpenDialog', [
   'js!SBIS3.CONTROLS.Action.Action',
   'js!SBIS3.CONTROLS.Action.DialogMixin',
   'js!WS.Data/Entity/Model',
   'js!WS.Data/Utils'
], function(Action, DialogMixin) {
   'use strict';

   /**
    * Класс, описывающий действие открытия диалога с заданным шаблоном.
    * @class SBIS3.CONTROLS.Action.OpenDialog
    * @extends SBIS3.CONTROLS.Action.Action
    *
    * @mixes SBIS3.CONTROLS.Action.DialogMixin
    *
    * @public
    * @author Красильников Андрей Сергеевич
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
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop
    */
   var OpenDialog = Action.extend([DialogMixin],/** @lends SBIS3.CONTROLS.Action.OpenDialog.prototype */{

      /**
       * @typedef {Object} ExecuteMetaConfig
       * @property {String|Number} id Идентификатор записи. Переопределяет значение опции {@link SBIS3.CONTROLS.FormController#key key}.
       * @property {WS.Data/Entity/Record} item Экземпляр класса записи. Переопределяет значение опции {@link SBIS3.CONTROLS.FormController#record record}.
       * @property {Object} filter Набор инициализирующих значений, который используется при создании новой записи. Переопределяет значение опции {@link SBIS3.CONTROLS.FormController#initValues initValues}.
       * @property {Object} readMetaData Набор инициализирующих значений, который используется при чтении записи. Переопределяет значение опции  {@link SBIS3.CONTROLS.FormController#readMetaData readMetaData}.
       * @property {String} initializingWay переопределяет <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/editing-dialog/initializing-way/'>способ инициализации данных диалога</a>.
       * @property {Object} dialogOptions Объект с пользовательскими опциями, которые передаются в диалог редактирования в <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/oop/#configuration-class-parameters'>секцию _options</a>.
       * @property {Object} componentOptions Объект с конфигурацией контрола, на основе которого создаётся диалог редактирования (см. {@link mode}).
       * @property {Boolean} isNewRecord Установив этот флаг, при закрытии диалога будет отображено диалоговое окно для подтверждения действия. Если в диалоге выбран ответ "Нет", то запись будет удалена из БД при выполнении условий: на диалоге открыта новая запись (создана в БД и ей присвоен ID) и для записи не были изменены поля.
       */
      /**
       * Производит <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/editing-dialog/open/'>открытие диалога редактирования</a>.
       * @param {ExecuteMetaConfig} meta Параметры, которые переопределяют конфигурацию диалога.
       * @example
       * <pre>
       * // myButton - экземпляр класса кнопки
       * // myDialogAction - экземпляр класса SBIS3.CONTROLS.OpenDialogAction
       * myButton.subscribe('onActivated', function() {
       *    myDialogAction.execute({
       *       id: myId,
       *       item: myItem
       *    });
       * });
       * </pre>
       */
      execute: function(meta){
         OpenDialog.superclass.execute.call(this, meta);
      }
   });
   return OpenDialog;
});