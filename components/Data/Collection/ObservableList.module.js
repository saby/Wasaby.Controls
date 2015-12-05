/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableList', [
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin',
   'js!SBIS3.CONTROLS.Data.ContextField'
], function (List, IBindCollection, ObservableListMixin, ContextField) {
   'use strict';

   /**
    * Список, в котором можно отслеживать изменения.
    * @class SBIS3.CONTROLS.Data.Collection.ObservableList
    * @extends SBIS3.CONTROLS.Data.Collection.List
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollection
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableListMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableList = List.extend([IBindCollection, ObservableListMixin], /** @lends SBIS3.CONTROLS.Data.Collection.ObservableList.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.ObservableList'
   });

   //Регистрируем класс ObservableList для работы с контекстами $ws.proto.Context
   //в новой версии ядра нужно будет сделать, чтобы привязыки данных к этим типам работали "из коробки"
   ContextField.registerDataSet('ControlsFieldTypeList', ObservableList, 'onCollectionItemChange');

   return ObservableList;
});
