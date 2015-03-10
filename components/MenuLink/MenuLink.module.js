define('js!SBIS3.CONTROLS.MenuLink', ['js!SBIS3.CONTROLS.Link', 'html!SBIS3.CONTROLS.MenuLink', 'js!SBIS3.CONTROLS.CollectionMixin', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin', 'js!SBIS3.CONTROLS.ContextMenu'], function(Link, dotTplFn, CollectionMixin, PickerMixin, MenuButtonMixin, ContextMenu) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки и выпадающее из нее меню
    * @class SBIS3.Engine.MenuLink
	* @demo SBIS3.Demo.Control.MyMenuLink Пример ссылки с выпадающим меню
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
    * @public
    * @category Buttons
    * @ignoreOptions validators, independentContext, contextRestriction, allowChangeEnable, extendedTooltip
    */

   var MenuLink = Link.extend( [PickerMixin, CollectionMixin, MenuButtonMixin], /** @lends SBIS3.Engine.Link.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _zIndex: '',
         _options: {
         }
      },

      $constructor: function() {
         this._initMenu();
      },


      setCaption: function(caption){
         Link.superclass.setCaption.call(this, caption);
         $('.controls-Link__field', this._container).html(caption);
         if (this._picker){
            $('.controls-Link__field', this._picker._container).html(caption);
         }
      },

      _initMenu: function(){
         if (this.getItems().getItemsCount() > 1) {
            $('.js-controls-MenuLink__arrowDown', this._container).show();
            this._container.removeClass('controls-MenuLink__withoutMenu');
         } else {
            $('.js-controls-MenuLink__arrowDown', this._container).hide();
            this._container.addClass('controls-MenuLink__withoutMenu');
         }
      },

      _clickHandler: function(){
         if (this.getItems().getItemsCount() > 1) {
            this._container.addClass('controls-Checked__checked');
            this.togglePicker();
         } else {
            if (this.getItems().getItemsCount() == 1) {
               var id = this.getItems().getKey(this.getItems().getNextItem());
               this._notify('onMenuItemActivate', id);
            }
         }
      },

      _setPickerContent: function(){
         var self = this;
         this._picker._container.addClass('controls-MenuLink__Menu');
         if (this._container.hasClass('controls-MenuLink-32px')){
            this._picker._container.addClass('controls-MenuLink-32px');
         } else {
            this._picker._container.addClass('controls-MenuLink-24px');
         }
         var header= $('<div class="controls-MenuLink__header"></div>');
         header.append(this._container.clone().removeAttr('style'));
         this._picker.getContainer().prepend(header);
         $(".controls-Link__icon", header.get(0)).addClass('icon-hover');
         $('.controls-MenuLink__header', this._picker._container).bind('click', function(){
            self.hidePicker();
         });
      }
   });

   return MenuLink;

});