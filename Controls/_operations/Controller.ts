import Control = require('Core/Control');
import template = require('wml!Controls/_operations/Controller/Controller');
import tmplNotify = require('Controls/Utils/tmplNotify');


/**
    * Контроллер для работы с множественным выбором. 
    * Передает состояние массового выделения дочерним контролам.
    * Подробное описание и инструкцию по настройке читайте <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/operations/'>здесь</a>.
    *
    * @class Controls/_operations/Controller
    * @extends Core/Control
    * @mixes Controls/interface/IPromisedSelectable
    * @control
    * @author Авраменко А.С.
    * @public
    */

   /*
    * Container for content that can work with multiselection.
    * Puts selection in child context.
    * The detailed description and instructions on how to configure the control you can read <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/operations/'>here</a>.
    *
    * @class Controls/_operations/Controller
    * @extends Core/Control
    * @mixes Controls/interface/IPromisedSelectable
    * @control
    * @author Авраменко А.С.
    * @public
    */

   var MultiSelector = Control.extend(/** @lends Controls/_operations/Controller.prototype */{
      _template: template,
      _selectedKeysCount: undefined,

      _selectedTypeChangedHandler: function(event, typeName, limit) {
         this._children.registrator.start(typeName, limit);
      },

      _selectedKeysCountChanged: function(e, count) {
         e.stopPropagation();
         this._selectedKeysCount = count;

         // TODO: по этой задаче сделаю так, что опции selectedKeysCount вообще не будет: https://online.sbis.ru/opendoc.html?guid=d9b840ba-8c99-49a5-98d3-78715d10d540
      },

      _notifyHandler: tmplNotify
   });

   export = MultiSelector;

