/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.HierarchyModel', [
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.HierarchyModelMixin'
], function (Model, HierarchyModelMixin) {
   'use strict';

   /**
    * Модель, реализующая узел иерархии.
    * @class SBIS3.CONTROLS.Data.HierarchyModel
    * @extends SBIS3.CONTROLS.Data.Model
    * @mixes SBIS3.CONTROLS.Data.HierarchyModelMixin
    * @public
    * @author Мальцев Алексей
    */

   var HierarchyModel = Model.extend([HierarchyModelMixin], /** @lends SBIS3.CONTROLS.Data.HierarchyModel.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.HierarchyModel'
   });

   return HierarchyModel;
});
