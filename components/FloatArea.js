/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('SBIS3.CONTROLS/FloatArea', [
   'Lib/Control/CompoundControl/CompoundControl',
   'SBIS3.CONTROLS/Mixins/PopupMixin',
   'Lib/Mixins/LikeWindowMixin',
   'tmpl!SBIS3.CONTROLS/FloatArea/FloatArea',
   'SBIS3.CONTROLS/Utils/TemplateUtil',
   'css!SBIS3.CONTROLS/FloatArea/FloatArea'
], function(CompoundControl, PopupMixin, LikeWindowMixin, dotTpl, TemplateUtil) {

   'use strict';


/**
 * Всплывающая панель
 * Панель, которая либо выезжает с левого края, либо появляется с правого края с fadeIn
 * При открытии панели происходит поиск контрола, для которого установлен CSS-класс ws-autofocus.
 * <ol>
 * <li>Если подходящий контрол найден, на него устанавливается фокус методом {@link setActive}. В случае, если класс установлен на панель, фокус устанавливается на дочерний компонент панели согласно установленным tabindex. В случае, если класс установлен на компонент внутри панели, то поиск будет происходить внутри нее;</li>
 *    <li>Если такой контрол не найден:
 *       <ul><li>В случае загрузки страницы активируется первый попавшийся компонент.</li></ul>
 *       <ul><li>В случае загрузки панели происходит поиск согласно установленным tabindex. Если таких компонентов несколько, фокус устанавливается на первый найденный. Если ничего активировать не удается, фокус устанавливается на саму панель.</li></ul>
 *    </li>
 * </ol>
 * @author Крайнов Д.О.
 * @class SBIS3.CONTROLS/FloatArea
 * @cssModifier ws-float-area-header-background Класс, задающий цвет пользовательской шапки.
 * @extends Lib/Control/CompoundControl/CompoundControl
 * @control
 * @public
 */

   var FloatArea = CompoundControl.extend([PopupMixin, LikeWindowMixin], /** @lends SBIS3.CONTROLS/FloatArea.prototype*/ {
      _dotTplFn : dotTpl,
      $protected: {
         _options: {
            /** @cfg {String} Устанавливает анимацию появления панели.
             * @variant no Без анимации.
             * @variant fade Появление.
             * @variant slide Всплывание.
             */
            animation : 'no',
             /**
              * @cfg {String} Устанавливает имя компонента, который будет открыт на всплывающей панели, или вёрстку всего шаблона.
              * @remark
              * Имя компонента устанавливают в формате "SBIS3/MyArea/MyComponent".
              */
            template: null,
            /** @cfg {Object} Опции для компонента, отображаемого внутри {@link template}
             */
            componentOptions: {}
         }
      },

      _modifyOptions: function(options) {
         options = FloatArea.superclass._modifyOptions.apply(this, arguments);
         //В рамках совместимости, делаю функцию, если прислали верстку
         if (typeof options.template == 'string' && options.template.indexOf('js!') !== 0) {
            options.template = TemplateUtil.prepareTemplate(options.template);
         }
         return options;
      },

      $constructor: function() {
         
      },

      //TODO должен быть нормально переписан в новом Control
      toggle: function(){
         if (this.isVisible()){
            this.hide();
         }else {
            this.show();
         }
      }
   });

   return FloatArea;

});