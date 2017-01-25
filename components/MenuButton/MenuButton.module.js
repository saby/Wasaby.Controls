define('js!SBIS3.CONTROLS.MenuButton', [
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.ContextMenu',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.MenuButtonMixin',
   'Core/helpers/dom&controls-helpers',
   'css!SBIS3.CONTROLS.MenuButton',
   'css!SBIS3.CONTROLS.MenuButtonMixin'
], function(Button, ContextMenu, PickerMixin, DSMixin, MenuButtonMixin, dcHelpers) {

   'use strict';

   /**
    * Класс контрола "Кнопка с выпадающим меню".
    * @class SBIS3.CONTROLS.MenuButton
    * @extends SBIS3.CONTROLS.Button
    * @remark
    * !Важно: Если в меню задан только один пункт, то меню НЕ будет показано, а при нажатии на кнопку будет выполнено действие, соответствующее этому пункту.
    * Кнопка с меню - это кнопка с выбором варината действия, и если возможно только одно действие, то оно и будет выполнено по нажатию.
    * @demo SBIS3.CONTROLS.Demo.MyMenuButton Пример кнопки с выпадающим меню
    *
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.MenuButtonMixin
    *
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    *
    * @ignoreMethods activate activateFirstControl activateLastControl addPendingOperation changeControlTabIndex
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onBeforeShow onAfterShow onBeforeLoad onAfterLoad onBeforeControlsLoad onKeyPressed onResize
    * @ignoreEvents onFocusIn onFocusOut onReady onDragIn onDragStart onDragStop onDragMove onDragOut
    *
    * @control
    * @public
    * @category Buttons
    * @initial
    * <component data-component='SBIS3.CONTROLS.MenuButton'>
    *    <option name='caption' value='Кнопка с меню'></option>
    *    <options name="items" type="array">
    *        <options>
    *            <option name="id">1</option>
    *            <option name="title">Пункт1</option>
    *        </options>
    *        <options>
    *            <option name="id">2</option>
    *            <option name="title">Пункт2</option>
    *        </options>
    *    </options>
    * </component>
    */

   var MenuButton = Button.extend( [PickerMixin, DSMixin, MenuButtonMixin], /** @lends SBIS3.CONTROLS.MenuButton.prototype */ {
      $protected: {
      },

      _modifyOptions : function() {
         var opts = MenuButton.superclass._modifyOptions.apply(this, arguments);
         opts.pickerClassName += ' controls-MenuButton__Menu';
         return opts;
      },

      init: function(){
         var self = this;
         this._container.addClass('controls-MenuButton');
         if(this._container.hasClass('controls-Button__big')){
            this._options.pickerClassName += ' controls-Menu__big';
         }
         this.reload();
         MenuButton.superclass.init.call(this);
      },

      _clickHandler: function(){
         if (this._dataSet){
            if (this._dataSet.getCount() > 1) {
               this.togglePicker();
            } else {
               if (this._dataSet.getCount() == 1) {
                  var id = this._dataSet.at(0).getId();
                  this._notify('onMenuItemActivate', id);
               }
            }
         }
      },
      /**
       * Показывает меню у кнопки
       */
      showPicker: function() {
         MenuButton.superclass.showPicker.call(this);
      },

      _initializePicker: function(){
         MenuButton.superclass._initializePicker.call(this);
         var self = this;
         this._picker._oppositeCorners.tl.horizontal.top = 'tr';
         this._picker._oppositeCorners.tr.horizontal.top = 'tl';
         this._picker.subscribe('onDrawItems', function(){
            self._picker.recalcPosition(true);
         });
      },

      _dataLoadedCallback : function() {
         if (this._dataSet.getCount() > 1) {
            $('.js-controls-MenuButton__arrowDown', this._container).show();
            this._container.removeClass('controls-MenuButton__withoutMenu');
         } else {
            $('.js-controls-MenuButton__arrowDown', this._container).hide();
            this._container.addClass('controls-MenuButton__withoutMenu');
            this._container.removeClass('controls-Picker__show');
         }
         if (this._picker){
            this.hidePicker();
         }
      }
   });

   return MenuButton;

});