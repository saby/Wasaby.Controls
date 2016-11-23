define('js!SBIS3.CONTROLS.MenuButton', [
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.ContextMenu',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DSMixin',
   'js!SBIS3.CONTROLS.MenuButtonMixin',
   'Core/helpers/dom&controls-helpers'
], function(Button, ContextMenu, PickerMixin, DSMixin, MenuButtonMixin, dcHelpers) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuButton
    * @extends SBIS3.CONTROLS.Button
    * @remark
    * !Важно: Если в меню задан только один пункт, то меню НЕ будет показано, а при нажатии на кнопку будет выполнено действие, соответствующее этому пункту.
    * Кнопка с меню - это кнопка с выбором варината действия, и если возможно только одно действие, то оно и будет выполнено по нажатию.
    * @demo SBIS3.CONTROLS.Demo.MyMenuButton Пример кнопки с выпадающим меню
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.MenuButtonMixin
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
         _header: null,
         _headerAlignment: {
            horizontal: 'left',
            vertical: 'top'
         }
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

      _moveHandler: function(){
         this._moveHeaderToButton();
      },
      
      _moveHeaderToButton: function(force){
         if (this._header && (!this._picker.isFixed() || force)) {
            this._header.css({
               left: (this._headerAlignment.horizontal == 'left') ? this._container.offset().left : this._container.offset().left - 12,
               top: (this._headerAlignment.vertical == 'top') ? this._container.offset().top + 2 : this._container.offset().top - 7
            });
         }
      },

      destroy: function(){
         this._toggleTrackHeader(false);
         if(this._header) 
            this._header.remove();
         MenuButton.superclass.destroy.call(this);
      },

      _onAlignmentChangeHandler: function(alignment){
         var right = alignment.horizontalAlign.side == 'right',
             bottom = alignment.verticalAlign.side == 'bottom';
         this._header.toggleClass('controls-MenuButton__header-revert-horizontal', right).toggleClass('controls-MenuButton__header-revert-vertical', bottom);
         if (right){
            this._header.css('left', this._container.offset().left - 12);
            this._headerAlignment.horizontal = 'right';
         } else {
            this._header.css('left', this._container.offset().left);
            this._headerAlignment.horizontal = 'left';
         }
         if (bottom){
            this._header.css('top', this._container.offset().top - 7);
            this._headerAlignment.vertical = 'bottom';
         } else {
            this._header.css('top', this._container.offset().top + 2);
            this._headerAlignment.vertical = 'top';
         }
      },

      _toggleTrackHeader: function(state){
      	var track = dcHelpers.trackElement(this._container);
      	if (state){
      		track.subscribe('onMove', this._moveHandler, this);
      	} else {
      		track.unsubscribe('onMove', this._moveHandler);
      	}
      },

      _clickHandler: function(){
         if (this._dataSet){
            if (this._dataSet.getCount() > 1) {
               this._container.addClass('controls-Checked__checked');
               this.togglePicker();
               this._toggleTrackHeader(true);
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
         if (!this._header) {
            this._createHeader();
         }
         MenuButton.superclass.showPicker.call(this);
         //Если не задавали координаты, то их нужно задать в любом случае
         var isInit = !parseInt(this._header.css('top'));
         this._moveHeaderToButton(isInit);
         this._header.css({
            'z-index': parseInt(this._picker.getContainer().css('z-index'), 10) + 1,
            position: this._picker.isFixed() ? 'fixed' : 'absolute'
         });
         this._header.removeClass('ws-hidden');
         this._setWidth();
      },
      _createHeader: function(){
         this._header = $('<span class="controls-MenuButton__header ws-hidden">\
                                  <i class="controls-MenuButton__headerLeft"></i>\
                                  <i class="controls-MenuButton__headerCenter"></i>\
                                  <i class="controls-MenuButton__headerRight"></i>\
                               </span>');
         var self = this;
         this._header.mousedown(function(){
            //TODO придрот, чтоб на кнопку вешался класс, как будто на кнопку нажали
            self._container.addClass('controls-Click__active');
         });
         $('body').append(this._header);
      },

      _setWidth: function(){
         this._setPickerSizes();
         this._setHeaderSizes();
      },

      _setHeaderSizes: function(){
         if (this._header) {
            this._header.css({
               width: this._container.outerWidth() + 12,  //ширина выступающей части обводки
               height: this._container.outerHeight()
            });
         }
      },

      _setPickerSizes: function() {
         this._picker && this._picker.getContainer().css({
            'min-width': this._container.outerWidth() - this._border + 20 //ширина выступающей части обводки
         });
      },

      _initializePicker: function(){
         MenuButton.superclass._initializePicker.call(this);
         var self = this;
         this._picker._oppositeCorners.tl.horizontal.top = 'tr';
         this._picker._oppositeCorners.tr.horizontal.top = 'tl';
         this._picker.subscribe('onDrawItems', function(){
            self._picker.recalcPosition(true);
         });
         this._picker.subscribe('onChangeFixed', function(event, fixed){
            self._header.css({
               position: fixed ? 'fixed' : 'absolute'
            });
         });
      },

      _setPickerContent: function(){
         var self = this;
         this._picker.subscribe('onClose', function(){
            self._closeHandler();
         });
      },

      _closeHandler: function(){
         this._container.removeClass('controls-Checked__checked');
         if (this._header) {
            this._header.addClass('ws-hidden');
            this._toggleTrackHeader(false);
         }
      },

      _dataLoadedCallback : function() {
         if (this._dataSet.getCount() > 1) {
            $('.js-controls-MenuButton__arrowDown', this._container).show();
            this._container.removeClass('controls-MenuButton__withoutMenu');
         } else {
            $('.js-controls-MenuButton__arrowDown', this._container).hide();
            this._container.addClass('controls-MenuButton__withoutMenu');
            this._container.removeClass('controls-Picker__show');
            $('.controls-MenuButton__header', this._container).remove();
         }
         if (this._picker){
            this.hidePicker();
         }
      }
   });

   return MenuButton;

});