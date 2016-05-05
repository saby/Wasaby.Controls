define('js!SBIS3.CONTROLS.Data.Adapter.FieldType', [], function(){
   'use strict';
   return {
      Boolean: 'Логическое',
      Integer: 'Число целое',
      Real: 'Число вещественное',
      Double: 'Число вещественное',
      Money: 'Деньги',
      String: 'Строка',
      Text: 'Текст',
      Xml: 'XML-файл',
      DateTime: 'Дата и время',
      Date: 'Дата',
      Time: 'Время',
      TimeInterval: 'Временной интервал',
      Identity: 'Идентификатор',
      Enum: 'Перечисляемое',
      Flags: 'Флаги',
      Record: 'Запись',
      RecordSet: 'Выборка',
      Binary: 'Двоичное',
      Uuid: 'UUID',
      RpcFile: 'Файл-rpc',
      Hierarchy: 'Иерархия',
      Object: 'JSON-объект',
      Array: 'Массив'
   };
});