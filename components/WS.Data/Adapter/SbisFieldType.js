define('js!WS.Data/Adapter/SbisFieldType', [], function(){
   'use strict';
   return {
      'boolean': 'Логическое',
      integer: 'Число целое',
      real: 'Число вещественное',
      money: 'Деньги',
      string: 'Строка',
      xml: 'XML-файл',
      datetime: 'Дата и время',
      date: 'Дата',
      time: 'Время',
      timeinterval: 'Временной интервал',
      link: 'Связь',//deprecated
      identity: 'Идентификатор',
      'enum': 'Перечисляемое',
      flags: 'Флаги',
      record: 'Запись',
      recordset: 'Выборка',
      binary: 'Двоичное',
      uuid: 'UUID',
      rpcfile: 'Файл-rpc',
      object: 'JSON-объект',
      array: 'Массив'
   };
});
