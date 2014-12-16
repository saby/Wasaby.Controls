window.SHOW_CLIENT_CERTS = 0x0001; //показывает сертификаты  с клиента
window.SHOW_SERVER_CERTS = 0x0002; //показывает сертификаты  с сервера

window.HIDE_DATE_INVALID_CERTS = 0x0100; //скрывать сертификаты не валидные по дате

//Используя следующий конструктор для Record'a преобразуем дату в воспринимаемый им тип
window.cert_recordSet_definition = [
   {"n" : "@Сертификат","t" : "Идентификатор"},
   {"n" : "ФИО","t" : "Текст"},
   {"n" : "Должность", "t" : "Текст"},
   {"n" : "Организация", "t" : "Текст"},
   {"n" : "ДействителенС", "t" : "Дата и время"},
   {"n" : "ДействителенПо", "t" : "Дата и время"},
   {"n" : "Действителен", "t" : "Логическое"},
   {"n" : "Комментарий", "t" : "Текст"},
   {"n" : "Файл", "t" : "Двоичное"},
   {"n" : "ИНН", "t" : "Текст"},
   {"n" : "СтрокаДляОтображения", "t" : "Текст"},
   {"n" : "Подробнее", "t" : "Текст"},
   {"n" : "Контейнер", "t" : "Текст"},
   {"n" : "Контрагент", "t" : "Число целое"},
   {"n" : "Отпечаток", "t" : "Текст"},
   {"n" : "ДляОтчетности", "t" : "Логическое"},
   {"n" : "КлючНаСервере", "t" : "Логическое"},
   {"n" : "Доступен", "t" : "Логическое"},
   {"n" : "ТипДоступа", "t" : { "n": "Перечисляемое", "s":{0: "БезДополнительнойАутентификации", 1: "СтатическийПароль", 2: "ВременныйПароль"} } },
   {"n" : "Объект", "t" : "Двоичное"},
   {"n" : "ДопДанные", "t" : "Запись" },
   {"n" : "СерийныйНомер", "t" : "Текст"},
   {"n" : "Квалифицированный", "t" : "Логическое"},
   {"n" : "УлучшенноеИспользованиеКлюча", "t" : { "n" : "Массив", "t" : "Текст" } }
];

function closeCertificateChooseWindow()
{
   if( $ws.single.ControlStorage && $ws.single.ControlStorage.containsByName('ОкноВыбораСертификатов') )
    {
        $ws.single.ControlStorage.getByName('ОкноВыбораСертификатов').destroy();
    }
}


function showLoadingAddInd( message ){
   if ($ws.single.ControlStorage.containsByName('cert_window_indic')){
      $ws.single.ControlStorage.getByName('cert_window_indic').show();
      $ws.single.ControlStorage.getByName('cert_window_indic').setMessage( message );
   }
   else{
      $ws.core.attachInstance('Control/LoadingIndicator',{
         showInWindow : true,
         message : message,
         name: 'cert_window_indic'
      })
   }
}

function hideLoadAdd( need_close_window )
{
   if( $ws.single.ControlStorage.containsByName( "cert_window_indic" ) ){
      $ws.single.ControlStorage.getByName( "cert_window_indic" ).close();
   }
   if( need_close_window )
   {
      closeCertificateChooseWindow();
      if( $ws.single.ControlStorage.containsByName( "ВсеСертификаты" ) ){
         $ws.single.ControlStorage.getByName('ВсеСертификаты').reload();
      }
   }
}

function _AddClientCerts( rs, silent_mode ){
   var def = new $ws.proto.Deferred();
   silent_mode = silent_mode === true ? true : false;
   try{
      require(["js!SBIS3.CRYPTO.Plugin"], function( pluginModule ){
         pluginModule.init( { silentMode: silent_mode } ).addCallback( function( plugin ){
            plugin.GetCertificates( silent_mode ).addCallback( function( certs ){
               for( var i = 0; i < certs.length; i++ ){
                  var currDate = new Date(),
                      issueDate = new Date( certs[i].IssueDateTime ),
                      expirDate = new Date( certs[i].ExpirationDateTime ),
                      cert_is_qualified = certs[i].IsQualified,
                      valid_by_date = ( issueDate < currDate ) && ( expirDate > currDate );
                  var record = new $ws.proto.Record({
                     colDef : $ws.core.clone( cert_recordSet_definition ),
                     row : [-i,
                        certs[i].FIO,
                        certs[i].Title,
                        certs[i].OrganizationName,
                        issueDate.toSQL( true ),
                        expirDate.toSQL( true ),
                        valid_by_date,
                        "",
                        certs[i].Data,
                        certs[i].INN,
                        "",
                        "",
                        certs[i].container_name,
                        null,
                        certs[i].ID,
                        ( cert_is_qualified || certs[i].SignQualification.length > 0 ),
                        false,
                        null,
                        0,
                        certs[i].object,
                        null,
                        certs[i].SerialNumber,
                        cert_is_qualified,
                        certs[i].EnhancedKeyUsage
                     ],
                     pkValue : -i,
                     parentRecordSet : null
                  });
                  rs.appendRecord( record );
               }
               def.callback( rs );
            }).addErrback( function( err ){
               def.errback( err );
            });
         }).addErrback( function( err ){
            def.errback( "Не удалось получить сертификаты клиента" );
         })
      });
   }
   catch(ex){  
      def.errback( "Не удалось получить сертификаты клиента" );
   }
   return def;
}

//Перевод в воспринимаемый окном RecordSet
function WrapServerCertsRecordSet( recordSet ){
   var rs = new $ws.proto.RecordSet
      ({
         readerType: 'ReaderUnifiedSBIS',
         readerParams:
         {
            adapterType: 'TransportAdapterStatic',
            adapterParams:
            {
               data:
               {
                  s: $ws.core.clone( cert_recordSet_definition ),
                  d: []
               }
            }
         }
      });
   recordSet.each( function( rec ){
      var currDate = new Date(),
          issueDate = new Date( rec.get('ДействителенС') ),
          expirDate = new Date( rec.get('ДействителенПо') ),
          sign_qual = rec.get( 'КвалификацияПодписи' ),
          cert_is_qualified = rec.get('Квалифицированный'),
          valid_by_date = ( issueDate < currDate ) && ( expirDate > currDate );
      var eku = [],
          ekuRecArr = rec.get("УлучшенныйКлюч").getRecords();
      for( var i = 0; i < ekuRecArr.length; i++ )
         eku.push( ekuRecArr[i].get("OID") );
         
      var record = new $ws.proto.Record({
         colDef : $ws.core.clone( cert_recordSet_definition ),
         row : [rec.get( '@Сертификат' ),
            rec.get( 'ФИО' ),
            rec.get( 'Должность' ),
            rec.get( 'Организация' ),
            issueDate.toSQL( true ),
            expirDate.toSQL( true ),
            valid_by_date,
            "",
            rec.get('Файл'),
            rec.get('ИНН'),
            "",
            "",
            null,
            rec.get('Контрагент'),
            rec.get('Отпечаток'),
            ( cert_is_qualified || sign_qual.length > 0 ),
            true,
            rec.get('Доступен'),
            rec.get('ТипДоступа').getCurrentValue(),
            null,
            null,
            rec.get('СерийныйНомер'),
            cert_is_qualified,
            []
         ],
         pkValue : rec.get( '@Сертификат' ),
         parentRecordSet : null
      });
      rs.appendRecord( record );
   });
   return rs;
}

function _AddServerCerts( rs ){
   var def = new $ws.proto.Deferred(),
       rec,
       client = new $ws.proto.RPCJSON();
   try{
      var certificate_obj = new $ws.proto.BLObject( 'Сертификат' );
      certificate_obj.call( "СписокНаПродлениеССекретнымКлючом", {},
          $ws.proto.BLObject.RETURN_TYPE_RECORDSET).addCallback(function(recordSet){
            var wrapped_server_rs = WrapServerCertsRecordSet( recordSet );
            wrapped_server_rs.each( function( cur_rec ){
               rs.appendRecord( cur_rec );
            });
            return def.callback( rs );
      }).addErrback(function(err){
         //вернём как есть, пусть даже и без сертификтаов  с сервера
         return def.callback( rs );
      });
   }
   catch( ex ){
      //вернём как есть, пусть даже и без сертификтаов  с сервера
      return def.callback( rs );
   }
   return def;
}

//формируем записи для сертификатов
function _GetOnlyUninstalledCerts( rs, method_name )
{

   var rec,
       ids = [],
       def = new $ws.proto.Deferred(),
       client = new $ws.proto.RPCJSON(),
       pd = new $ws.proto.ParallelDeferred(),
       all_pd = new $ws.proto.ParallelDeferred();
       
   try{ 
   
      if( !method_name || method_name === null || method_name === '' ){
         return def.callback( rs );
      }
      
      rs.each(function(record){
         ids.push(record.get('Отпечаток'));
      })
      if( (ids === null) || (!ids.length) )
      {
         return def.errback( "Доступных для загрузки сертификатов не обнаружено." );
      }
      client.callMethod( method_name, {"СписокОтпечатков" : ids} ).addCallback
      (
         function(res_ids)
         {
            if( (res_ids === null) || (!res_ids.length) )
            {
               return def.errback( "Доступных для загрузки сертификатов не обнаружено." );
            }
            var already_added_ids = [],
                pk_keys_to_delete = [],
                i;
            for ( i = 0; i < rs.getRecordCount(); i++) {
               rec = rs.at( i );
               if( jQuery.inArray( rec.get('Отпечаток'), already_added_ids ) !== -1 ){
                  pk_keys_to_delete.push( rec.getKey() );
                  continue;
               }
               if( jQuery.inArray( i, res_ids ) === -1 )
               {
                  pk_keys_to_delete.push( rec.getKey() );
               }
               already_added_ids.push( rec.get('Отпечаток') );
            }
            for( var it = 0; it != pk_keys_to_delete.length; it++ ){
               pd.push( rs.deleteRecord( pk_keys_to_delete[it] ).addBoth( function(result) {
               }));
            }

            pd.done();
            return pd.getResult().addCallback( function(){
               return def.callback( rs );
            });
         }
      ).addErrback( function( err ){
         return def.errback( err );
      });
   }
   catch( ex ){
      return def.errback( ex );
   }
   return def;
}


//функция сортировки и фильтрации
function _SortAndFilterRS( rs, filter, flags, method_name ){
   
   var def = new $ws.proto.Deferred(),
       already_added_ids = [];
   if( !filter && !flags && !method_name  )
      return def.callback( rs );
   try{
      var rec,
          fio_arr = [],
          new_rs = new $ws.proto.RecordSet
         ({
            readerType: 'ReaderUnifiedSBIS',
            readerParams:
            {
               adapterType: 'TransportAdapterStatic',
               adapterParams:
               {
                  data:
                  {
                     s: $ws.core.clone( cert_recordSet_definition ),
                     d: []
                  }
               }
            }
         });
      var check_rec_for_filter = function( rec, filter ){
         var result = true;
         for( var prop in filter ){
            if( !filter.hasOwnProperty( prop ) )
               continue;
            if( prop === "ИНН" && Object.prototype.toString.call( filter[prop] ) === '[object Array]' ){
               //если нам передали массив ИНН, то фильтруем по "ИЛИ"
               for( var inn_iter = 0; inn_iter != filter[prop].length; inn_iter++ ){
                  result = false;
                  if( ( rec.get( prop ) === filter[prop][inn_iter] ) || ( ( rec.get( prop ) === '00' + filter[prop][inn_iter] ) ) ){
                     result = true;
                     break;
                  }
               }
            }
            else if( prop === "ИНН" && !( ( rec.get( prop ) !== filter[prop] ) || ( (rec.get( prop ) !== '00' + filter[prop]) ) ) )
               result = false;
            else if( prop === "Инженер" && filter[prop] ){
               result = false;
               var eku = rec.get( 'УлучшенноеИспользованиеКлюча' );
               for( var i = 0; i < eku.length; i++ ){
                  if( eku[i] === "1.2.643.3.58.2.1.3" ){
                     result = true;
                     break;
                  }
               }
            }
            else if( rec.hasColumn( prop ) && ( rec.get( prop ) !== filter[prop] ) )
               result = false;
         }
         return result;
      };
      _GetOnlyUninstalledCerts( rs, method_name ).addCallback( function( un_rs ){
         un_rs.each( function( rec ){
            if( jQuery.inArray( rec.get('Отпечаток'), already_added_ids ) === -1 ){
               //прячем, если нужно сертификаты, невалидные по дате
               if( ( ( flags & HIDE_DATE_INVALID_CERTS ) && rec.get( 'Действителен' ) === true ) || !( flags & HIDE_DATE_INVALID_CERTS ) ) {
                  if( check_rec_for_filter( rec, filter ) ){
                     fio_arr.push( { 'ФИО' : rec.get( 'ФИО' ), "Ключ" : rec.getKey(), "Действителен" : rec.get( 'Действителен' ) } );
                     already_added_ids.push( rec.get('Отпечаток') );
                  }
               }
            }
         });
         fio_arr.sort( function(a, b){
            if( ( a['Действителен'] === false ) && ( b['Действителен'] === true ) )
               return 1;
            else if( ( b['Действителен'] === false ) && ( a['Действителен'] === true ) )
               return -1;
            var comp = a['ФИО'].localeCompare( b['ФИО'] );
            if( comp === 0 )
               return 0;
            else if( comp < 0 )
               return -1;
            else 
               return 1;
         });
         var i;
         for( i = 0; i != fio_arr.length; i++ ){
            new_rs.appendRecord( rs.getRecordByPrimaryKey( fio_arr[i]['Ключ'] ) );
         }
         def.callback( new_rs );
      }).addErrback( function(err){
          def.callback( new_rs );
      });  
   }
   catch(ex){
      def.errback( ex );
   }
   return def;
}


/** Функция создаёт RecordSet сертификатов по заданным услвиям
* @param {Integer} flags флаги, какие сертификаты требуется отобрать window.SHOW_CLIENT_CERTS и/или window.SHOW_SERVER_CERTS
* @param {Object} filter Фильтрация (сейчас можно фильртровать только по полям ИНН, 
* @param {String} method_name Имя метода, который будет вызван для фильтрации сертификатов. В качестве параметров в него передаётся СписоОтпечатков(массив строк), 
* а на выход приходит 
 */
function CreateCertificateRS( flags, filter, method_name, silent_mode ){
   var def = new $ws.proto.Deferred();
   try{
      if( !filter )
         filter = {};
      var rs = new $ws.proto.RecordSet
      ({
         readerType: 'ReaderUnifiedSBIS',
         readerParams:
         {
            adapterType: 'TransportAdapterStatic',
            adapterParams:
            {
               data:
               {
                  s: $ws.core.clone( cert_recordSet_definition ),
                  d: []
               }
            }
         }
      });
      //если нужно показывать сертификаты с клиента, то наберём их.
      if( flags & SHOW_CLIENT_CERTS ){
         _AddClientCerts( rs, silent_mode ).addCallback( function(rs){
            //если нужно показывать ещё и сертификаты с сервера, то наберём их.
            if( flags & SHOW_SERVER_CERTS ){
               _AddServerCerts( rs ).addCallback( function(all_rs){
                  _SortAndFilterRS( all_rs, filter, flags, method_name ).addCallback( function(new_rs){
                     def.callback( new_rs );
                  });
               });
            }
            else{
               _SortAndFilterRS( rs, filter, flags, method_name ).addCallback( function(new_rs){
                  def.callback( new_rs );
               });
            }
         }).addErrback( function( err ){
            def.errback( err );
         });
      }
      //если нужны только сертификаты с сервераа, то показываем только их 
      else if( flags & SHOW_SERVER_CERTS ){
         _AddServerCerts( rs ).addCallback( function(all_rs){
            _SortAndFilterRS( all_rs, filter, flags, method_name ).addCallback( function(new_rs){
               def.callback( new_rs );
            });
         });
      }
      else{
         def.callback( rs );
      }
   }
   catch(ex){
      def.errback( ex.message );
   }
   return def;
}

function openCertificateChooseWindow( certs_rs, filter, flags, method_name, opener )
{
   closeCertificateChooseWindow();
   
   var def = new $ws.proto.Deferred();
   try{
      $ws.core.attachInstance
         (
            'Control/Area:DialogSelector',
            {
               template: "ОкноВыбораСертификатов",
               multiSelect: false,
               context: new $ws.proto.Context(),
               opener: opener,
               handlers:
               {
                  //После загрузки всех контролов
                  onReady:function( eventObject )
                  {
                     hideLoadAdd();
                     var brows = this.getChildControlByName( 'РеестрВыбораСертификатов' );
                     _SortAndFilterRS( certs_rs, filter, flags, method_name ).addCallback( function(rs){
                        brows.setData( rs );
                        //как только мы установили данные, говорим, что всё хорошо.
                        def.callback( brows );
                     });
                  }
               }
            }
         )
   }
   catch( e )
   {
      def.errback( "Произошла непредвиденная ошибка при открытии окна выбора сертификата \n Пожалуйста, повторите операцию позже." );
      hideLoadAdd(true);
   }
   return def;
}

function ShowCertificateWindow( flags, filter, method_name, opener ){
   var def = new $ws.proto.Deferred();
   CreateCertificateRS( flags, filter, method_name ).addCallback( function( rs ){ 
      openCertificateChooseWindow( rs, filter, flags, method_name, opener ).addCallback( function( inst ){
         var ctx = inst.getLinkedContext();
         ctx.setValue( 'cert_brows_params', { 'Флаги' : flags, 'Фильтр' : filter, 'ИмяМетода' : method_name  } )
         def.callback(inst);
         return inst;
      }).addErrback( function(err){
         hideLoadAdd(true);
         def.errback(err);
         return err;
      });
   }).addErrback( function(err){
      def.errback(err);
   });
   return def;
}

function showLoadingInd(){
   if ($ws.single.ControlStorage.containsByName('refresh_indic')){
      $ws.single.ControlStorage.getByName('refresh_indic').show();
   }
   else{
      $ws.core.attachInstance('Control/LoadingIndicator',{
         showInWindow : true,
         message : "Подождите, идёт обновление списка сертификатов...",
         name: 'refresh_indic'
      })
   }
}

function hideLoadingInd(){
   if ($ws.single.ControlStorage.containsByName('refresh_indic')){
      $ws.single.ControlStorage.getByName('refresh_indic').hide();
   }
}

function RefreshCertificatesInWindow( self ){

   try{
      showLoadingInd();
      var brows = self.getParent().getParent().getChildControlByName( 'РеестрВыбораСертификатов' );
      var params_val = brows.getLinkedContext().getValue( 'cert_brows_params' );
      CreateCertificateRS( params_val['Флаги'], params_val['Фильтр'], params_val['ИмяМетода'] ).addCallback( function( rs ){ 
         brows.setData( rs );
         hideLoadingInd();
         $ws.single.ControlStorage.getByName( 'КнопкаОбновленияСпискаСертификатов' ).setEnableStatus(true);
      }).addErrback( function( err ){
         hideLoadingInd();
         $ws.single.ControlStorage.getByName( 'КнопкаОбновленияСпискаСертификатов' ).setEnableStatus(true);
      });
   }
   catch(e){
      hideLoadingInd();
      $ws.single.ControlStorage.getByName( 'КнопкаОбновленияСпискаСертификатов' ).setEnableStatus(true);
   }
}