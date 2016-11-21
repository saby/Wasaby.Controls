/*global define, require, $ws*/
define('js!SBIS3.CONTROLS.Action.OpenDialog', [
   'js!SBIS3.CONTROLS.Action.Action',
   'js!SBIS3.CONTROLS.Action.DialogMixin',
   'js!WS.Data/Entity/Model',
   'js!WS.Data/Utils'
], function(Action, DialogMixin) {
   'use strict';

   /**
    * Действие открытия диалога с заданным шаблоном
    * @class SBIS3.CONTROLS.Action.OpenDialog
    * @mixes SBIS3.CONTROLS.Action.DialogMixin
    * @extends SBIS3.CONTROLS.Action.Action
    * @public
    * @author Крайнов Дмитрий Олегович
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
       * @property {String|Number} id Первичный ключ записи. Передается в конфигурацию диалога в опцию {@link SBIS3.CONTROLS.FormController#key}.
       * @property {Object} filter Объект, свойства которого могут быть использованы для установки инициализирующих данных при создании новой записи. Передается в конфигурацию диалога в опцию {@link SBIS3.CONTROLS.FormController#initValues}.
       * @property {Object} readMetaData Дополнительные мета-данные, которые будут переданы в метод прочитать. Передается в конфигурацию диалога в опцию {@link SBIS3.CONTROLS.FormController#readMetaData}.
       * @property {WS.Data/Entity/Record} item Экземпляр класса записи. Передается в конфигурацию диалога в опцию {@link SBIS3.CONTROLS.FormController#record}.
       * @property {String} initializingWay Способ инициализации данных диалога, подробнее о котором вы можете прочитать <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/dialogs/initializing-way/">здесь</a>.
       * @property {Object} componentOptions Пользовательские опции, которые будут переданы в диалог в секцию _options.
       * @property {Object} dialogOptions Опции, которые переопределяют конфигурацию диалога. Набор опций зависит от типа диалога (см. {@link mode}).
       * <ul>
       *    <li>Если <i>mode=dialog</i>, то набор опций такой: {@link $ws.proto.Dialog#title title}, {@link $ws.proto.Dialog#border border} и {@link $ws.proto.Dialog#buildMarkupWithContext buildMarkupWithContext}.</li>
       *    <li>Если <i>mode=floatArea</i>, то набор опций такой: {@link $ws.proto.FloatArea#title title}, {@link $ws.proto.FloatArea#border border}, {@link $ws.proto.FloatArea#buildMarkupWithContext buildMarkupWithContext}, {@link $ws.proto.FloatArea#animation animation}, {@link $ws.proto.FloatArea#autoCloseOnHide autoCloseOnHide}, {@link $ws.proto.FloatArea#showOnControlsReady showOnControlsReady}, {@link $ws.proto.FloatArea#autoHide autoHide}, {@link $ws.proto.FloatArea#isStack isStack}, {@link $ws.proto.FloatArea#side side} и {@link $ws.proto.FloatArea#target target}.</li>
       * </ul>
       * Производит открытие диалога.
       * @param {ExecuteMetaConfig} meta Параметры, которые переопределяют конфигурацию диалога.
       * @remark
       * Подробнее об использовании параметров вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/open-dialog/#_2">Изменение конфигурации данных диалога</a>.
       * @example
       * Открытие диалога при нажатии на кнопку.
       * <pre>
       * // myButton - экземпляр класса кнопки
       * // myDialogAction - экземпляр класса SBIS3.CONTROLS.OpenDialogAction
       * myButton.subscribe('onActivated', function(){
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