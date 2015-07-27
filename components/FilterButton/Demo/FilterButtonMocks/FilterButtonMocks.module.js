define('js!SBIS3.CONTROLS.Demo.FilterButtonMocks', [],
   function() {
      var
         channel = $ws.single.EventBus.channel('Transport'),
         suggestDataResp = {
            "jsonrpc":"2.0",
            "result":{
               "s":[
                  {"n":"@ТипНоменклатуры","t":"Число целое"},
                  {"n":"Название","t":"Текст"}
               ],
               "d":[
                  [121,"автотест неУдалять"]
               ],
               "_type":"recordset",
               "n":1
            },
            "id":1,
            "protocol":3
         },
         suggestDataReq = {
            "jsonrpc":"2.0",
            "protocol":3,
            "method":"ТипНоменклатуры.List",
            "params":{
               "ДопПоля":[],
               "Фильтр":{
                  "d":["авт"],"s":[{"n":"СтрокаПоиска","t":"Строка"}]
               },
               "Сортировка":null,
               "Навигация":{
                  "s":[
                     {"n":"Страница","t":"Число целое"},
                     {"n":"РазмерСтраницы","t":"Число целое"},
                     {"n":"ЕстьЕще","t":"Логическое"}
                  ],
                  "d":[0,5,false]
               }
            },
            "id":1
         },
         suggestSelectReq = {
            "jsonrpc":"2.0",
            "protocol":3,
            "method":"ТипНоменклатуры.Прочитать",
            "params":{
               "ИдО":121,"ИмяМетода":null
            },"id":1
         },
         suggestSelectResp = {
            "jsonrpc":"2.0",
            "result":{
               "s":[
                  {"n":"@ТипНоменклатуры","t":"Число целое"},
                  {"n":"ТипПресто","t":"Число целое"},
                  {"n":"Название","t":"Текст"},
                  {"n":"Признаки","t":{"n":"Флаги","s":{"1":"Основной","2":"Комплект"}}},
                  {"n":"UUID","t":"UUID"},
                  {"n":"СтавкаНДС","t":{"n":"Перечисляемое","s":{"0":"0%","1":"10%","2":"18%","3":"20%","4":"10/110","5":"18/118","6":"Без НДС"}}},
                  {"n":"ТипДокумента","t":"Текст"},
                  {"n":"ПоУмолчанию","t":"Логическое"},
                  {"n":"Категория","t":{"n":"Перечисляемое","s":{"0":"Товары","1":"Услуги и работы","2":"Неисключительные права","3":"Материалы","4":"Готовая продукция"}}},
                  {"n":"ВидУчета","t":{"n":"Перечисляемое","s":{"null":null,"0":"Количественно-суммовой","1":"Суммовой","2":"Без учета"}}},
                  {"n":"OrdinalNumber","t":"Число целое"},{"n":"НуженНаряд","t":"Логическое"},
                  {"n":"СчетУчета","t":{"n":"Связь","t":"ПланСчетов"}},
                  {"n":"ВидДохода","t":{"n":"Связь","t":"ВидДохода"}},{"n":"ctid","t":"Строка"}
               ],
               "d":[
                  121,null,"автотест неУдалять",
                  [null,null],null,2,null,false,0,0,10035,false,null,null,"(0,52)"
               ],
               "_type":"record"
            },
            "id":1,
            "protocol":3
         };

      var currentReq = null;
      channel.subscribe('onBeforeSend', function(event, xhr, settings) {
         currentReq = JSON.parse(settings.data);
         return true;
      });

      channel.subscribe('onResponseError', function(event, xhr, dfr) {
         dfr.addErrback(function(err) {
            var result = err;
            if (currentReq.method === suggestDataReq.method) {
               result = suggestDataResp;
            } else if (currentReq.method === suggestSelectReq.method) {
               result = suggestSelectResp;
            }
            return result;
         });
      });
   }
);