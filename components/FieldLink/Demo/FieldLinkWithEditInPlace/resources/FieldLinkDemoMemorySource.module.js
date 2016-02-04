define('js!SBIS3.CONTROLS.Demo.FieldLinkMemorySource', [
   'js!SBIS3.CONTROLS.Data.Source.Memory'
], function (MemorySource) {
   /**
    * SBIS3.CONTROLS.Demo.FieldLinkMemorySource
    * @class SBIS3.CONTROLS.Demo.FieldLinkMemorySource
    * @extends SBIS3.CONTROLS.Data.Source.Memory
    * @control
    */
   var FieldLinkMemorySource = MemorySource.extend(/** @lends SBIS3.CONTROLS.Demo.FieldLinkMemorySource.prototype */{
      $protected: {
         _options: {}
      },

      create: function () {
         return FieldLinkMemorySource.superclass.create.apply(this, arguments).addCallback(function(record) {
            record.setRawData({
               d: [new Date().getTime(), '',
                  {
                     _type: 'recordset',
                     d: [],
                     s: [
                        {n: 'Ид', t: 'ЧислоЦелое'},
                        {n: 'ПолеИнформации', t: 'Запись'}
                     ]
                  }
               ],
               s: [{n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'ФИО', t: 'Текст'},
                  {n: 'ИнформацияПоСотруднику', t: 'Выборка'}]
            });
            return record;
         });
      }

   });

   return FieldLinkMemorySource;
});
