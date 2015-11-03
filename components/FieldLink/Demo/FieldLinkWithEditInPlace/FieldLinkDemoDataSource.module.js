define('js!SBIS3.CONTROLS.Demo.FieldLinkDataSource', [
   'js!SBIS3.CONTROLS.StaticSource'
], function (StaticSource) {
   /**
    * SBIS3.CONTROLS.Demo.FieldLinkDataSource
    * @class SBIS3.CONTROLS.Demo.FieldLinkDataSource
    * @extends SBIS3.CONTROLS.StaticSource
    * @control
    */
   var FieldLinkDataSource = StaticSource.extend(/** @lends SBIS3.CONTROLS.Demo.FieldLinkDataSource.prototype */{
      $protected: {
         _options: {}
      },

      create: function () {
         return FieldLinkDataSource.superclass.create.apply(this, arguments).addCallback(function(record) {
            record.setRaw( {
               d: [new Date().getTime(), '',
                  {
                     _type: 'record',
                     d: [],
                     s: []
                  }
               ],
               s: [ {n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'ФИО', t: 'Текст'},
                  {n: 'МестоРаботы', t: 'Запись'}]
            });
            return record;
         });
      }

   });
      return FieldLinkDataSource;
});
