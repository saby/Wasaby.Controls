define('SBIS3.CONTROLS/Menu/MenuButton', [
   'SBIS3.CONTROLS/WSControls/Buttons/MenuButton',
   'SBIS3.CONTROLS/Utils/ButtonUtil',
   'tmpl!SBIS3.CONTROLS/WSControls/Buttons/resources/AddIcon',
   'css!SBIS3.CONTROLS/Button/Button',
   'css!SBIS3.CONTROLS/Menu/MenuButton/MenuButton'
], function(WSMenuButton, ButtonUtil, svgIconTpl) {

   'use strict';

   /**
    * Класс контрола "Кнопка-меню".
    *
    * <a href='/doc/platform/developmentapl/interface-development/components/textbox/buttons/button-line/#menu-button'>Демонстрационные примеры</a>.
    * <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Спецификация</a>.
    *
    * @remark
    * Если в меню задан только один пункт, то меню НЕ будет показано, а при нажатии на кнопку будет выполнено действие, соответствующее этому пункту.
    *
    * @class SBIS3.CONTROLS/Menu/MenuButton
    * @extends WSControls/Buttons/MenuButton
    *
    * @author Крайнов Д.О.
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
    * @category Button
    * @initial
    * <component data-component='SBIS3.CONTROLS/Menu/MenuButton'>
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

   var MenuButton = WSMenuButton.extend([], /** @lends SBIS3.CONTROLS/Menu/MenuButton.prototype */ {
      $protected: {
         _options: {
            style: 'standard',
            _svgIcon: null,
            _svgIconTpl: svgIconTpl
         }
      },
      _modifyOptions: function(options, parsedOptions, attrToMerge) {
         var opts = MenuButton.superclass._modifyOptions.apply(this, arguments);
         opts.cssClassName += ' controls-Button';
         opts._type = 'Button';
         ButtonUtil.getStyleByConfig(opts, attrToMerge);
         ButtonUtil.preparedClassFromOptions(opts);
         opts._iconDisabledClass = 'icon-button-disabled';
         opts.pickerClassName += ' controls-MenuButton__Menu';
         return opts;
      },

      _toggleState: function() {
         var container = this._container;

         container[0].className = container[0].className.replace(/(^|\s)controls-Button_size-\S+/g, '').replace(/(^|\s)controls-Button_state-\S+/g, '');
         container.addClass(ButtonUtil.getClassState(this._options));
         MenuButton.superclass._toggleState.apply(this, arguments);
      }
   });

   return MenuButton;

});
