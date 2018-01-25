/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls/Tabs/Buttons', [
   'Core/Control'

], function (Control
) {
   'use strict';

   var _private = {};

   /**
    * Компонент - корешки закладок
    * @class Controls/Tabs/Buttons
    * @extends Controls/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/ISingleSelectable
    * @control
    * @public
    * @category List
    */

   /**
    * @name Controls/Tabs/Buttons#tabSpaceTemplate
    * @cfg {Content} Шаблон содержимого области, находящейся на одном уровне с корешками закладок
    */

   var TabsButtons = Control.extend({
      _controlName: 'Controls/BreadCrumbs'

   });
   return TabsButtons;
});