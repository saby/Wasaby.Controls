define('js!SBIS3.CONTROLS.MenuLink', ['js!SBIS3.CONTROLS.Link', 'html!SBIS3.CONTROLS.MenuLink', 'js!SBIS3.CONTROLS.DSMixin', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin'], function(Link, dotTplFn, DSMixin, PickerMixin, MenuButtonMixin) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки и выпадающее из нее меню
    * @class SBIS3.CONTROLS.MenuLink
	 * @demo SBIS3.CONTROLS.Demo.MyMenuLink
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.MenuLink'>
    *    <option name='caption' value='Ссылка с меню'></option>
    *    <options name="items" type="array">
    *        <options>
    *            <option name="id">1</option>
    *            <option name="title">Пункт1</option>
    *         </options>
    *         <options>
    *            <option name="id">2</option>
    *            <option name="title">Пункт2</option>
    *         </options>
    *      </options>
    * </component>
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.MenuButtonMixin
    * @public
    * @category Buttons
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
    */

   var MenuLink = Link.extend( [PickerMixin, DSMixin, MenuButtonMixin], /** @lends SBIS3.Engine.Link.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _zIndex: '',
         _options: {
         }
      },


      init : function(){
         this.reload();
         MenuLink.superclass.init.call(this);
         if (this._container.hasClass('controls-Menu__hide-menu-header')){
            this._options.pickerClassName += ' controls-Menu__hide-menu-header';
         }
      },

      setCaption: function(caption){
         Link.superclass.setCaption.call(this, caption);
         $('.controls-Link__field', this._container).html(caption);
         if (this._picker){
            $('.controls-Link__field', this._picker._container).html(caption);
         }
      },

      _clickHandler: function(){
         if (this._dataSet.getCount() > 1) {
            this._container.addClass('controls-Checked__checked');
            this.togglePicker();
         } else {
            if (this._dataSet.getCount() == 1) {
               var id = this._dataSet.at(0).getKey();
               this._notify('onMenuItemActivate', id);
            }
         }
      },

      _setPickerContent: function(){
         var self = this;
         this._picker._container.css('margin-top', -parseInt(this._container.css('height'), 10) - 1);
         this._picker._container.addClass('controls-MenuLink__Menu');
         if (this._container.hasClass('controls-MenuLink__32px')){
            this._picker._container.addClass('controls-Menu__32px');
         }
         var header= $('<span class="controls-MenuLink__header"></span>');
         header.append(this._container.clone().removeAttr('style'));
         this._picker.getContainer().prepend(header);
         $(".controls-Link__icon", header.get(0)).addClass('icon-hover');
         $('.controls-MenuLink__header', this._picker._container).bind('click', function(){
            self.hidePicker();
         });
      },

      _dataLoadedCallback : function() {
         if (this._dataSet.getCount() > 1) {
            $('.js-controls-MenuLink__arrowDown', this._container).show();
            this._container.removeClass('controls-MenuLink__withoutMenu');
         } else {
            $('.js-controls-MenuLink__arrowDown', this._container).hide();
            this._container.addClass('controls-MenuLink__withoutMenu');
         }
         if (this._picker){
            this.hidePicker();
         }
      },

      _drawIcon: function(icon) {
         var
            $icon = $('.controls-Link__icon', this._container.get(0)),
            $caption = $('.controls-Link__field', this._container.get(0));
         if (icon) {
            if ($icon.length) {
               $icon.get(0).className = 'controls-Link__icon ' + this._iconClass;
            }
            else {
               $icon = $('<i class="controls-Link__icon ' + this._iconClass + '"></i>');
               $caption.before($icon);
            }
         }
         else {
            $icon.remove();
         }
      }
   });

   return MenuLink;

});