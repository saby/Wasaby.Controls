define('SBIS3.CONTROLS/Filter/Button/Line',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'SBIS3.CONTROLS/Filter/Button/Utils/FilterToStringUtil',
      'tmpl!SBIS3.CONTROLS/Filter/Button/Line/FilterLine',
      'Core/helpers/String/escapeTagsFromStr',
      'SBIS3.CONTROLS/Mixins/Clickable'
   ],
   function(CompoundControl, FilterToStringUtil, dotTplFn, escapeTagsFromStr, Clickable) {

      /**
       * Контрол, отображающий строку из применённых фильтров рядом с кнопкой фильтров.
       * Умеет отображать строку по определенному шаблону. Работает исключительно через контекст.
       * @class SBIS3.CONTROLS/Filter/Button/Line
       * @extends Lib/Control/CompoundControl/CompoundControl
       * @author Крайнов Д.О.
       * @control
       * @public
       */

      var FilterLine = CompoundControl.extend([Clickable], {

         _dotTplFn: dotTplFn,

         $constructor: function() {
            var context = this.getLinkedContext(),
               self = this,
               updateContext = function() {
                  var linkText;

                  /* Проверяем, изменился ли фильтр */
                  if (context.getValue('filterChanged')) {
                     /* Пробежимся по структуре фильтров и склеим строку */
                     linkText = FilterToStringUtil.string(context.getValue('filterStructure'), 'itemTemplate');
                  } else {
                     linkText = context.getValue('filterResetLinkText');
                  }

                  context.setValueSelf({
                     linkText: linkText,
                     titleText: escapeTagsFromStr(linkText, '')
                  });
                  self.toggle(!!linkText);
                  self._notifyOnSizeChanged();
               };

            updateContext();
            context.subscribe('onFieldsChanged', updateContext);
         },
         _clickHandler: function() {
            this.sendCommand('show-filter');
         }
      });

      return FilterLine;
   }
);