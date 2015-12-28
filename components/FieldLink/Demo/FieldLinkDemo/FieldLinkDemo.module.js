/**
 * Created by am.gerasimov on 20.11.2015.
 */
define('js!SBIS3.CONTROLS.Demo.FieldLinkDemo', [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.FieldLinkDemo',
      'js!SBIS3.CONTROLS.Demo.FieldLinkDemoMemory',
      'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
       'js!SBIS3.CONTROLS.FieldLink',
       'js!SBIS3.CONTROLS.DataGridView'
    ],
    function (CompoundControl, dotTplFn, Memory, Sbis) {
   /**
    * SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace
    * @class SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
      },

      initFiledLink1: function () {
         this.setDataSource(new Memory({
            data: {
               _type: 'recordset',
               d: [
                  [0, 'Инженер-программист'],
                  [1, 'Руководитель группы'],
                  [2, 'Менеджер'],
                  [3, 'Генерал армии'],
                  [4, 'Министр обороны'],
                  [5, 'Бухгалтер']
               ],
               s: [
                  {n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'Название', t: 'Текст'}
               ]
            },
            idProperty: 'Ид',
            adapter: new Sbis()
         }));
      },

      initFiledLink2: function () {
         this.setDataSource(new Memory({
            data: {
               _type: 'recordset',
               d: [
                  [0, 'Инженер-программист'],
                  [1, 'Руководитель группы'],
                  [2, 'Менеджер'],
                  [3, 'Генерал армии'],
                  [4, 'Министр обороны'],
                  [5, 'Бухгалтер']
               ],
               s: [
                  {n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'Название', t: 'Текст'}
               ]
            },
            idProperty: 'Ид',
            adapter: new Sbis()
         }));
      }
   });
   return moduleClass;
});