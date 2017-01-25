/**
 * Модуль 'Кнопка-иконка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.IconButton', ['js!SBIS3.CONTROLS.ButtonBase', 'js!SBIS3.CONTROLS.IconMixin', 'html!SBIS3.CONTROLS.IconButton', 'css!SBIS3.CONTROLS.IconButton'], function(ButtonBase, IconMixin, dotTplFn) {

   'use strict';

   /**
    * Класс контрола, который предназначен для отображения кнопки в виде иконки.
    *
    * @class SBIS3.CONTROLS.IconButton
    * @extends SBIS3.CONTROLS.ButtonBase
    * @mixes SBIS3.CONTROLS.IconMixin
    * @demo SBIS3.CONTROLS.Demo.MyIconButton
    * @author Борисов Петр Сергеевич
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
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
    * @ignoreEvents onDragIn onDragStart onDragStop onDragMove onDragOut
    *
    * @cssModifier controls-IconButton__round-border Добавляет круглую границу вокруг иконки. Размер границы подстраивается под размеры иконки.
    * По умолчанию граница серого цвета. При наведении курсора цвет границы изменяется в соответствии с цветом иконки, установленной в опции {@link icon}.
    * @cssModifier controls-IconButton__round-border-24 Устанавливает круглую границу (диаметр в 24 px) вокруг иконки быстрой операции, доступной по наведению курсора. Подробнее о таких типах операций вы можете прочитать <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/items-action/fast/">здесь</a>.
    * Модификатор применяется совместно с иконками 16 px. Цвет границы соответствует цвету иконки, установленной в опции {@link icon}.
    * @cssModifier controls-IconButton__filter-left Устанавливает внешний вид для кнопки открытия/закрытия фильтров слева.
    * @cssModifier controls-IconButton__filter-right Устанавливает внешний вид  для кнопки открытия/закрытия фильтров справа.
    *
    * @category Buttons
    * @control
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.IconButton'>
    *    <option name="icon" value="icon-16 icon-AddButton icon-primary"></option>
    * </component>
    */

   var IconButton = ButtonBase.extend([IconMixin], /** @lends SBIS3.CONTROLS.IconButton.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
         }
      },

      $constructor: function () {
         /*TODO оставляем добавку класса через jquery
          * чтобы избавиться - надо убрать зависимость от icons.css
          * в котором прописаны поведение и цвета для иконок по ховеру*/
         var className = this._container.get(0).className;
         if (className && className.indexOf('controls-IconButton__round-border') >= 0) {
            this._container.removeClass('action-hover');
         }
      },

      _modifyOptions: function (opts) {
         var
            options = IconButton.superclass._modifyOptions.apply(this, arguments),
            iconClass = options._iconClass;
         if (iconClass) {
            options._moreClass = '';
            if (((iconClass.indexOf('icon-error') >= 0) || (iconClass.indexOf('icon-done') >= 0))){
               if (iconClass.indexOf('icon-error') >= 0) {
                  options._moreClass += ' controls-IconButton__errorBorder';
               }
               else {
                  options._moreClass += ' controls-IconButton__doneBorder';
               }
            }
         }
         return options;
      },

      _drawIcon: function(icon){
      	if (this._oldIcon){
      		this._container.removeClass(this._oldIcon);
      	}
         this._container.addClass('controls-IconButton ' + this._options._iconClass);
      }
   });

   return IconButton;

});