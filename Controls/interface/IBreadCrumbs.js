/* eslint-disable */
define('Controls/interface/IBreadCrumbs', [
], function() {

   /**
    * Интерфейс для хлебных крошек.
    *
    * @interface Controls/interface/IBreadCrumbs
    * @public
    * @author Авраменко А.С.
    */

   /*
    * Interface for breadcrumbs.
    *
    * @interface Controls/interface/IBreadCrumbs
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/interface/IBreadCrumbs#items
    * @cfg {Array.<Record>} Массив хлебных крошек.
    */

   /*
    * @name Controls/interface/IBreadCrumbs#items
    * @cfg {Array.<Record>} Array of breadcrumbs to draw.
    */

   /**
    * @name Controls/interface/IBreadCrumbs#keyProperty
    * @cfg {String} Имя свойства, содержащего информацию об идентификаторе текущей строки.
    */

   /*
    * @name Controls/interface/IBreadCrumbs#keyProperty
    * @cfg {String} Name of the item property that uniquely identifies collection item.
    */

   /**
    * @name Controls/interface/IBreadCrumbs#parentProperty
    * @cfg {String} Имя свойства, содержащего сведения о родительском узле.
    */

   /*
    * @name Controls/interface/IBreadCrumbs#parentProperty
    * @cfg {String} Name of the field that contains information about parent node.
    */

   /**
    * @name Controls/interface/IBreadCrumbs#backgroundStyle
    * @cfg {string} Префикс стиля для настройки фона внутренних компонентов хлебных крошек с абсолютным позиционированием.
    * @variant default (фон цвета темы)
    * @variant stackHeader  Используется когда крошки располагаются в шапке стекового окна
    * @variant masterDetail-master Используется, когда крошки располагаются в контенте master контрола masterDetail
    * @variant masterDetail-details Используется, когда крошки располагаются в контенте detail контрола masterDetail
    * @variant blockLayout__block_style_(number) Используется, когда крошки располагаются в области блоков controls-BlockLayout__block. Подробнее {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/content-managment/containers/blocks/ здесь}
    * @variant другое - вы сами можете задать значение опции и определить класс с необходимым цветом
    * @default default (фон цвета темы)
    * @example
    * <pre>
    *     <Controls.breadcrumbs:Path items="{{items}}" on:itemClick="_onItemClick()" keyProperty="id" backgroundStyle="MyColor"/>
    *     ......
    *    .controls-BreadCrumbsView__menu__dots-background-MyColor_theme-@{themeName} {
    *       background: red;
    *       box-shadow: @dots_shadow-offset_breadcrumbsView red;
    *    }
    * </pre>
    */

   /*
    * @name Controls/interface/IBreadCrumbs#backgroundStyle
    * @cfg {string} Style prefix to configure background for breadcrumbs components with absolute positioning.
    * @variant default (theme background)
    * @variant stackHeader Used when breadcrumbs are in the header of the stack.
    * @variant masterDetail-master  Used when breadcrumbs are in "master" of masterDetail
    * @variant masterDetail-details Used when breadcrumbs are in "detail" of masterDetail
    * @variant blockLayout__block_style_(number) More details {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/content-managment/containers/blocks/ here}
    * @variant other - you can set your option value and define a class with the desired color
    * @default default (theme background)
    * @example
    * <pre>
    *     <Controls.breadcrumbs:Path items="{{items}}" on:itemClick="_onItemClick()" keyProperty="id" backgroundStyle="MyColor"/>
    *     ......
    *    .controls-BreadCrumbsView__menu__dots-background-MyColor_theme-@{themeName} {
    *       background: red;
    *       box-shadow: @dots_shadow-offset_breadcrumbsView red;
    *    }
    * </pre>
    */


   /**
    * @name Controls/interface/IBreadCrumbs#displayProperty
    * @cfg {String} Имя свойства элемента, содержимое которого будет отображаться.
    * @default title
    */

   /*
    * @name Controls/interface/IBreadCrumbs#displayProperty
    * @cfg {String} Name of the item property which content will be displayed.
    * @default title
    */

   /**
    * @event Controls/interface/IBreadCrumbs#itemClick Происходит после клика по хлебным крошкам.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
    * @param {Types/entity:Record} item Элемент, по которому произвели клик.
    */

   /*
    * @event Controls/interface/IBreadCrumbs#itemClick Happens after clicking on breadcrumb.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Descriptor of the event.
    * @param {Types/entity:Record} item Key of the clicked item.
    */

});
