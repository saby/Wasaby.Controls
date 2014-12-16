define("js!SBIS3.ROLE.RoleFunction", ['css!SBIS3.ROLE.RoleRegistry'], function(control) {
   var RoleFunction;
   return RoleFunction = {
      OnRowOptionsOfClientRoleBrows : function( event, rec ) {
         var exclude = [];
         if( rec.get( "Системная" ) === true )
            exclude.push( 'delete' );

         var isDir = rec.get( '@Роль' ).split(',')[1];
         if ( isDir === '-1' ){
            exclude.push( 'edit', 'delete' );
         }

         event.setResult( exclude );
      },

      OnRowOptionsOfUserRole : function( event ) {
         var exclude = ['edit','sendMsg'];
         event.setResult( exclude );
      },

      OnRowOptionsOfChildRoleBrows : function( event, rec  ) {
         var exclude = [];
         if( rec.getKey() == "0,Пользователь системы" )
            exclude.push( "delete" );
         event.setResult( exclude );
      },

      RenderRowClientRoleBrows: function( record, object ){
         var div = object.find( '.ws-browser-cell-container');
         var offsetLeft = 0;

         if  ( record._colDef["Дир"] !== undefined ) {
            offsetLeft = parseInt( record.get( 'Дир' ) , 10 );
         }

         offsetLeft *= 20;

         var isDir = record.get( '@Роль' ).split(',')[1];
         if ( ( offsetLeft > 0 ) || ( isDir === '-1' ) ){
            var div2 = object.find( '.ws-browser-text-no-render' );

            if ( isDir === '-1' ){
               object.find('.ws-browser-cell').addClass('dirSeparator');
               div2.html( '<div style=" padding-left: ' + offsetLeft+ 'px; font-size: 16px; font-style: italic; font-family: georgia; color: #999999;">' + div2.html() + '</div>' );
            }
            else
               div2.html( '<span style="padding-left: ' + offsetLeft+ 'px; ">' + div2.html() + '</span>' );
         }

         if(( record.get( 'Системная' ) === false ) && ( isDir !== '-1' )){
            div.append( $('<div class="icon-16 icon-Profile icon-disabled" style="margin-right: 57px; margin-top: 4px; float:right;" title="Клиентская роль" ></div>') );
         } else {
            if ( isDir !== '-1' )
               div.append( $('<span style="margin-right: 57px; width:16px; height: 16px; float:right"></span>') );
         }
         if( record.get( 'Скрытая' ) === true )
            div.append( $('<div class="icon-16 icon-Lock icon-disabled" style="margin-right: 10px; margin-top: 4px; float:right;" title="Не отображается в списке ролей на карточке пользователя"></div>') );

         if( record.get( 'ForServiceUsers' ) === true )
            div.append( $('<div class="icon-16 icon-Settings icon-disabled" style="margin-right: 10px; margin-top: 4px; float:right;" title="Доступна для назначения только служебным пользователям"></div>') );
         var comment = record.get("Примечание");

         if( comment ){
            comment = $ws.helpers.escapeHtml( comment );
            div.append( $( '<div style="padding-left: ' + offsetLeft+ 'px;">' + "<div style='color:#999999; font-size:11px; text-overflow:ellipsis; white-space:pre-line; overflow:hidden;' title='"+comment+"'>"+comment+"</div></div>" ) );
         }
      },

      RenderRowClientUserBrows: function( record, object ){
         var div = object.find( '.ws-browser-cell-container ws-browser-text-no-render');
         var divHTML = div.context.innerHTML;
         var userFolder = record.get("Раздел");

         if ( userFolder === null)
            userFolder = '';
         else
            userFolder = userFolder.split(',')[1];

         divHTML = divHTML.replace('<a class="ws-browser-edit-link ws-browser-text-no-render" href="javascript:void(0)">','');
         divHTML = divHTML.replace('</a>','');
         divHTML = divHTML.replace('<span','<a class="ws-browser-edit-link ws-browser-text-no-render" href="javascript:void(0)" style="text-decoration: none !important;"><span');
         divHTML = divHTML.replace('</div>','<div style="color:#999999; font-size:11px; text-overflow:ellipsis; white-space:pre-line; overflow:hidden;"> ' + userFolder + '</div></div></a>');
         div.context.innerHTML = divHTML;
      },

      OnChangeSelectionOfClientRoleBrows : function(eventObject, row, dataRow){
         var zones = $ws.single.ControlStorage.containsByName('zones'),
            isRoleFocus = this;

         if(dataRow && (((dataRow.get('@Роль') !== idActiveRow) || !zones) && !this.getLinkedContext().getValue( 'newRole' ) && !onSuccess)) {
            var isDir = dataRow.get( '@Роль' ).split(',')[1];
            if ( isDir === '-1' ){
               eventObject.setResult(false);
               // если мы попали курсором в ячейку-заголовок, то оставляем выделение на ячейке которая была до этого
               var element = isRoleFocus.getContainer().find('[rowkey="'+activSelectRow+'"]');
               isRoleFocus.setActiveRow(element);

               if(isTimeOut)
                  clearTimeout(isTimeOut);
               return;
            }

            function startTimer() {
               isTimeOut =  setTimeout(function(){
                  // записываем активную ястрочку что бы потом перевести фокус назад на табличку и выделить
                  // строчку. (иногда сбрасывается активная строка это дублирование)
                  activSelectRow = isRoleFocus.getActiveRow().attr('rowkey');

                  if( dataRow === undefined )
                     return;

                  var configMessage = {
                     'role' : parseStr(dataRow.get('@Роль')),
                     'addresService' : getLocalOrigin() + isService,
                     'idClass' : idClass
                  }
                  $ws.single.EventBus.channel('roleReestr').notify('clickRow',configMessage);
                  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  // Очень важно, когда буду подключать компонент не забывать поставить в нем setPage(0) //
                  /* подписаться отписаться на события готовности и разрушения контрола, который будет слушать реестр ролдей.
                  subscribeChanel : function() {
                     console.log('add');
                     var self = this;
                     $ws.single.EventBus.channel('roleReestr').subscribe('clickRow',sub,this);
                  },

                  unSubscribeChanel : function() {
                     console.log('unsubscribe');
                     $ws.single.EventBus.channel('roleReestr').unsubscribe('clickRow',sub,this);
                  }

                  function sub(event,arg){
                      console.log(arg);
                      this.getLinkedContext().setValue( 'Роль', arg.role);
                      this.getLinkedContext().setValue( 'АдресСервиса', arg.addresService);
                      this.getLinkedContext().setValue( 'ИдКласса', arg.idClass);
                      this.reload();
                  }
                  */
                  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  if(zones){
                     if( isLoadDialog !== row.attr('rowkey')){
                        isRoleFocus.sendCommand('edit');
                     }
                  }
                  isTimeOut = undefined;
               },400)
            }
            // таймаут от частых кликов по ячейкам
            if(!isTimeOut) {
               startTimer();
            } else {
               clearTimeout(isTimeOut);
               startTimer();
            }
         } else {
            onSuccess = false;
         }
      },

      onAfterShow : function() {
         var self = this.getTopParent().getOpener();
         if(self) {
            this.getOpener().getTopParent().getLinkedContext().setValue('dialogEdit', this.getTopParent().getChildControlByName('zones'));
            self.setActive(true);
         } else {
            this.setActive(true);
         }
      },

      OnSelectRolesForRole: function() {
         var roles = [],
            selfOpener = this.getTopParent().getOpener().getTopParent(),
            sel_recs = this.getTopParent().getChildControlByName('roles').getSelection( true ),
            parents = selfOpener.getChildControlByName( 'parents' ).getRecordSet(),
            zone = selfOpener.getChildControlByName( 'zones' ),
            child = selfOpener.getChildControlByName( 'childs' ),
            child_rs = child.getRecordSet(),
            child_correct_rs = this.getTopParent().getLinkedContext().getValue( 'Наследники' ), // рекордсет записи, которую таки можно релоадить с БЛ
            id, rec;

         blackList = [];
         listParentAccet = [];

         id_curr_role = this.getTopParent().getLinkedContext().getValue( '@Роль' );

         for( var i = 0; i < sel_recs.length; ++i ){
            rec = sel_recs[i];
            // Не добавляем себя и которые есть в родителях
            id =  parseStr( rec.get('@Роль') );
            if( id == id_curr_role || parents.contains( "0," + id ) || child_rs.contains( "0," + id ) )
               continue;
            roles.push( id );
            // Добавим рекорд в детей
            var new_rec = new $ws.proto.Record( {
               colDef : {
                  '@Роль': { type : "Идентификатор", title: "@Роль", index: 0 },
                  'Название': { type : "Текст", title: "Название", index: 1 },
                  "Примечание" : { type : "Текст", title: "Примечание", index: 2 }
               },
               row : ["0,"+ id, rec.get('Название'), rec.get('Примечание')],
               pkValue : "0,"+ id,
               parentRecordSet : child_rs
            });
            child_rs.appendRecord( new_rec );
            child_correct_rs.appendRecord( new_rec ); // Сюда тоже добавим
         }
         child.reload();

         if( roles.length ){
            var obj = new $ws.proto.BLObject({name:'Роль', serviceUrl:isService + '/service/sbis-rpc-service300.dll'});
            obj.call( "ЗоныРоли", {'Роль': roles}, $ws.proto.BLObject.RETURN_TYPE_RECORDSET )
               .addCallbacks( function( recordset ){
                  var zone_rs,
                     multiMap = $ws.single.GlobalContext.getValue( "multiMap");

                  if(selfOpener.getChildControlByName('Флаг1').getValue()) {
                     zone_rs = new $ws.proto.RecordSetStatic({
                        defaultColumns: recordSetValueOld.getColumns(),
                        records: recordSetValueOld.getRecords()
                     });
                  } else {
                     zone_rs = zone.getRecordSet();
                  }
                  recordset.each( function( record ){
                     // Найдем роль и зафигачим туда новые значения
                     var item = multiMap[ record.get( 'ЗонаДоступа' ) ],
                        isReadZone;
                     if( item ){
                        for( var i = 0, count = item.length; i < count; ++i ){
                           var zr_record = zone_rs.getRecordByPrimaryKey( item[i] );

                           var changeUser = zr_record.get("ЯвноНазначена"),
                              conf = {
                                 value : false,
                                 mode : true
                              };
                           /*
                           Параметр cnf.mode означает, что функция выполняется когда мы производим добавления роли для наследования
                            */

                           // Проверяем есть ли в этом уровне доступа id нашей роли, если да, значит приоритет отдан этому УД, скажим об этом остальным УД.
                           function isFindRole(role){
                              var strToFind = role.split(',');
                              return Array.indexOf(strToFind, id_curr_role);
                           }

                           zr_record.set( "НаследуетЗаписьОт", new_unity_id( zr_record.get( "НаследуетЗаписьОт" ), record.get( "НаследуетЗаписьОт" ),conf,false, changeUser) );
                           isReadZone =  isFindRole(zr_record.get( "НаследуетЗаписьОт")) != -1 ? true : false;

                           zr_record.set( "НаследуетЧтениеОт", new_unity_id( zr_record.get( "НаследуетЧтениеОт" ), record.get( "НаследуетЧтениеОт" ),conf, isReadZone, changeUser) );
                           if(!isReadZone)
                              isReadZone =  isFindRole(zr_record.get( "НаследуетЧтениеОт")) != -1 ? true : false;

                           zr_record.set( "НаследуетЗапретОт", new_unity_id( zr_record.get( "НаследуетЗапретОт" ), record.get( "НаследуетЗапретОт" ),conf,isReadZone, changeUser) );
                           zr_record.set( "ОбластиВидимости", unity_flags( zr_record.get( "ОбластиВидимости" ), record.get( "ОбластиВидимости" ) ) );
                        }
                     }
                  } );

                  //TODO: Добавляем проверку на несколько одинаковых Зон Доступа.
                  if(zone.getTopParent().hasChildControlByName('Флаг1'))
                     if(!zone.getTopParent().getChildControlByName('Флаг1').getValue())
                        stepMultiMap(zone);

                  if(selfOpener.getChildControlByName('Флаг1').getValue()) {
                     recordSetValueNew = new $ws.proto.RecordSetStatic({
                        defaultColumns: $ws.core.merge([],  zone_rs.getColumns()),
                        records: $ws.core.merge([], zone_rs.getRecords())
                     });
                     recordSetValueNew.setHierarchyField('Раздел');

                     recordSetValueOld = new $ws.proto.RecordSetStatic({
                        defaultColumns: $ws.core.merge([],  zone_rs.getColumns()),
                        records: $ws.core.merge([], zone_rs.getRecords())
                     });
                     recordSetValueOld.setHierarchyField('Раздел');

                     searchStar(zone, true);

                     var listBlack = storageNameStar.listName;

                     for(i = 0, length = listBlack.length; i < length; i++) {
                        recordSetValueNew.deleteRecord(listBlack[i]);
                     }
                     zone.setData(recordSetValueNew);
                  } else
                     zone.reload();
               }, function( e ) {
                  $ws.core.alert( e.message, 'error' );
                  return e;
               } );
         }
         this.getTopParent().close();
      },

      onRowDoubleClick: function(event, row, record) {
         var dialogEdit = this.getTopParent().getLinkedContext().getValue('dialogEdit');
         if(dialogEdit) {
            dialogEdit = dialogEdit.getTopParent().isOpened;
         } else {
            dialogEdit = false;
         }
         if(!dialogEdit) {
            if ( record.get('@Роль').split(',')[1] === '-1' ){
               event.setResult( false );
            }
         } else {
            event.setResult( false );
         }
      },

      OnBeforeReadRole: function( event, id ) {
         idActiveRow = id;

         var bLObject = new $ws.proto.BLObject({name:"Роль"}),
            addres = getLocalOrigin() + isService,
            params = id.split(','),
            conf;

         if(isAdminService){
            conf = {
               'ИдО' : params[1],
               'ИмяМетода' : 'Роль.Список',
               'АдресСервиса' : addres,
               'ИдПользователя' : idClass
            }
         } else {
            conf = {
               'ИдО' : params[1],
               'ИмяМетода' : 'null'
            }
         }

         event.setResult(bLObject.call(
            'Прочитать',
            conf,
            $ws.proto.BLObject.RETURN_TYPE_RECORD).addCallback(function(record){
               return record;
            })
         );
      },

      OnDelStarted: function( event, records ){
         // На всякий случай проверим одна ли запись там лежит
         event.setResult( false );
         var oneRec = records.length == 1;
         if( oneRec && records[0].get( 'Системная' ) === true ){
            return;
         }

         var self = this;
         $ws.helpers.question( oneRec ? "Удалить роль?" : "Удалить выбранные роли?" ).addCallback( function( res ){
            if( res ){
               var obj = new $ws.proto.BLObject('Роль');
               for( var i = 0, len = records.length; i < len; i++ ){
                  if( records[i].get( 'Системная' ) !== true ) {
                     var def = obj.call("Удалить", { 'ИдО' : [parseStr( records[i].get("@Роль") )] }, $ws.proto.BLObject.RETURN_TYPE_ASIS);
                     def.addCallback( function( result ){
                        self.reload();
                        return result;
                     } );
                     event.setResult( def );
                  }
               }
            }
         } );
      },

      OnDelStartedChild: function( event, records ){
         var self = this,
            record = records[0],
            child_correct_rs = self.getTopParent().getLinkedContext().getValue( 'Наследники' ), // рекордсет записи, которую таки можно релоадить с БЛ
            zones = self.getTopParent().getChildControlByName('zones'),
            zones_rs,
            curr_rs = self.getRecordSet();

         if($ws.single.ControlStorage.getByName('Флаг1').getValue()) {
            zones_rs = zones.getRecordSet();
            zones_rs.setRecords(recordSetValueOld.getRecords());
         } else {
            zones_rs = zones.getRecordSet();
         }

         changeAccessRecursive( zones_rs, null, parseStr( record.get( "@Роль" ) ), false, [ 'НаследуетЗаписьОт', 'НаследуетЧтениеОт', 'НаследуетЗапретОт' ], true, true ); // Удалим идиентификатор роли из зоны доступа
         deleteIdFromZoneScopeRecursive( zones_rs, null, parseStr( record.get( "@Роль" ) ) );
         curr_rs.deleteRecord( record.getKey() );
         child_correct_rs.deleteRecord( record.getKey() );
         self.reload();

         if( child_correct_rs.getRecordCount() === 0 ){
            var obj = new $ws.proto.BLObject('Роль'),
               roles = [ 'Пользователь системы' ];
            obj.call( "ЗоныРоли", {'Роль': roles}, $ws.proto.BLObject.RETURN_TYPE_RECORDSET )
               .addCallbacks( function( recordset ){
                  var multiMap = $ws.single.GlobalContext.getValue( "multiMap"),
                     arrayItem = [];

                  var curentRecordRole = zones.getRecordSet();

                  recordset.each( function( record ){
                     // Найдем роль и зафигачим туда новые значения
                     var item = multiMap[ record.get( 'ЗонаДоступа' ) ];
                     if( item ){
                        for( var i = 0, count = item.length; i < count; ++i ){
                           arrayItem.push(item[i]);
                           var zr_record = zones_rs.getRecordByPrimaryKey( item[i]),
                              conf = {
                                 value : true,
                                 mode : false
                              };

                           zr_record.set( "НаследуетЗаписьОт", new_unity_id( zr_record.get( "НаследуетЗаписьОт" ), record.get( "НаследуетЗаписьОт" ), conf) );

                           zr_record.set( "НаследуетЧтениеОт", new_unity_id( zr_record.get( "НаследуетЧтениеОт" ), record.get( "НаследуетЧтениеОт" ), conf) );

                           zr_record.set( "НаследуетЗапретОт", new_unity_id( zr_record.get( "НаследуетЗапретОт" ), record.get( "НаследуетЗапретОт" ), conf) );
                           zr_record.set( "ОбластиВидимости", unity_flags( zr_record.get( "ОбластиВидимости" ), record.get( "ОбластиВидимости" ) ) );
                        }
                     }
                  } );

                  // составлен массив ключей которые изменили свой доступ, осталось пройти по остальным
                  // кроме этих, и задать им по умолчанию запрещено. т.е. оставить все уровни доступа пустые.
                  var recordArray = curentRecordRole.getRecords();
                  for(var i = 0, length = recordArray.length; i< length; i++) {
                     var pKey = recordArray[i].getKey();
                     if(Array.indexOf(arrayItem,pKey)  === -1) {

                        var record = curentRecordRole.getRecordByPrimaryKey(pKey);

                        // если наша зона доступа явно назначена, значит ее менять не надо.
                        if(record.get("ЯвноНазначена"))
                           break;

                        record.set( "НаследуетЗаписьОт", '');
                        record.set( "НаследуетЧтениеОт", '');
                        record.set( "НаследуетЗапретОт", '');
                     }
                  }
                  createNewRecordSet();
               }, function( e ) {
                  $ws.core.alert( e.message, 'error' );
                  return e;
               } );
         } else {
            createNewRecordSet();
         }

         function createNewRecordSet() {

            //TODO: Добавляем проверку на несколько одинаковых Зон Доступа.
            stepMultiMap(zones);

            if(zones.getTopParent().getChildControlByName('Флаг1').getValue()) {
               recordSetValueNew = new $ws.proto.RecordSetStatic({
                  defaultColumns: $ws.core.merge([], zones_rs.getColumns()),
                  records: $ws.core.merge([], zones_rs.getRecords())
               } );
               recordSetValueNew.setHierarchyField('Раздел');

               recordSetValueOld = new $ws.proto.RecordSetStatic({
                  defaultColumns: $ws.core.merge([], zones_rs.getColumns()),
                  records: $ws.core.merge([], zones_rs.getRecords())
               });
               recordSetValueOld.setHierarchyField('Раздел');

               searchStar(zones, true);
               var listBlack = storageNameStar.listName;

               for(var i = 0, length = listBlack.length; i < length; i++) {
                  recordSetValueNew.deleteRecord(listBlack[i]);
               }
               zones.setData(recordSetValueNew);
            } else
               zones.reload();
         }
      },

      onAfterLoadReestrRole : function() {
         var isRoleFocus = this,
            recordSetRole = isRoleFocus.getRecordSet();
         searchRowActiveId(isRoleFocus, recordSetRole);
      },

      onAfterLoad : function(parent) {
         var self = (parent.self) ? parent.self : this;
         var sys = self.getLinkedContext().getValue( 'Системная' );
         if(sys) {
            // Заблокируем весь диалог, кроме галки "Не используется"
            var rights_exists = self.getChildControlByName( 'save').isEnabled();
            self.setEnabled( false );
            if( rights_exists ) {
               // если права (визуальные) были, значит возвращаем,
               // если нет, значит редактировать вообще нельзя
               if(!self.getTopParent().getOpener().getParent().getOnlyRead()){
                  self.getChildControlByName( 'save' ).setEnabled( true );
                  self.getChildControlByName( 'Скрытая' ).setEnabled( true );
               }
            }
         }
         if( self.getLinkedContext().getValue( 'newRole' ) )
            self.getChildControlByName( 'Скрытая' ).hide();
      },

      onBeforeUpdate : function(event, record){
         var sys = record.get('Системная');
         if(sys)
            event.setResult('Диалог системной роли');
         else {
            event.setResult('Диалог роли');
         }
      },

      onBeforeShowDialog : function () {
         var self = this;
         if(!this.hasEventHandlers('onSuccess')) {
            this.subscribe('onSuccess',function(){
               if(self.getOpener().getTopParent().hasChildControlByName('reestrRoles')) {
                  var reestrRoles = self.getOpener().getTopParent().getChildControlByName('reestrRoles');
                  if( reestrRoles && !this.getLinkedContext().getValue( 'newRole' ) ){
                     reestrRoles.reload();
                  }
               }
            });
         }
      },

      OnAfterClose: function(){
         this.getLinkedContext().setValue("newRole", false);
      },

      OnReadyRoleDialog: function(parent){
         var self = (parent.self) ? parent.self : this,
            context = self.getLinkedContext(),
            zone = self.getChildControlByName( 'zones' ),
            zone_rs = context.getValue( 'СписокЗон' ),
            child_rs = context.getValue( 'Наследники' ),
            parents_rs = context.getValue( 'Родители' ),
            parent_text = $( '.parentClass' );

         if(!parent.self)
            id_curr_role = this.getTopParent().getLinkedContext().getValue('@Роль');
         else {
            if(parent.self.getTopParent)
            id_curr_role = parent.self.getTopParent().getLinkedContext().getValue('@Роль');
         }

         // при открытие диалога редактировния блокируем выподаущий список с сервисами.
         if(this.getTopParent) {
            var opener = this.getTopParent().getOpener().getTopParent();
               if(opener.hasChildControlByName('setServiceDropdown')){
                  opener.getChildControlByName('setServiceDropdown').setEnabled(false);
                  opener.getChildControlByName('FieldRadioClass').setEnabled(false);
               }
         }

         if (parents_rs.getRecordCount() === 0)
            parent_text.hide();
         else
            parent_text.show();

         zone_rs.setHierarchyField( "Раздел" );
         var zone_static_rs = new $ws.proto.RecordSetStatic({defaultColumns:zone_rs.getColumns(), hierarchyField:'Раздел', records: zone_rs.getRecords()} ),
            child_static_rs = new $ws.proto.RecordSetStatic({defaultColumns:child_rs.getColumns(), records: child_rs.getRecords()} ),
            parents_static_rs = new $ws.proto.RecordSetStatic({defaultColumns:parents_rs.getColumns(), records: parents_rs.getRecords()} );

         zone_static_rs.setHierarchyField( "Раздел" );
         zone_static_rs.loadNode( null, true, undefined, true );
         // Надо пройтись по рекордсету и составить свой мультимап
         var multiMap = {};
         zone_static_rs.each( function( record ) {
            var key = record.getKey(),
               key_ = key.substring( ( key.indexOf(',') ) + 1);
            if( !multiMap[key_] )
               multiMap[key_] = [];
            if( Array.indexOf( multiMap[key_], key ) == -1 )
               multiMap[key_].push(key);
         } );
         $ws.single.GlobalContext.setValue( "multiMap", multiMap );
         zone.setData( zone_static_rs );
         zone.reload();
         // Надо вставить еще мистического Пользователя системы, которого нельзя будет редактировать

         if( child_static_rs.getRecordCount() || !context.getValue( 'Системная' ) )
         {
            var child = self.getChildControlByName( 'childs'),
               control = self.getTopParent().getChildControlByName( "Parent"),
               parents = self.getTopParent().getChildControlByName( 'parents' );

            child.setData( child_static_rs );
            child.reload();

            parents.setData( parents_static_rs );
            parents.reload();

            parent_text.click( function() {
               parent_text.addClass( 'parentPressed' );
               var pt_top = parseInt( parent_text.css( "top" ), 10 ),
                  s_height = self.getContainer().height(),
                  bottom = Math.max(pt_top, s_height ) - Math.min( pt_top, s_height );

               control.getContainer().css({ "bottom": ( bottom ) + "px", 'right': '-26px'});
               control.show();

               var onclick = function(e){
                  var attr = e.target.getAttribute( 'sbisname' );
                  if( attr && attr == "Parent" ){
                     e.stopPropagation();
                     e.preventDefault();
                  } else {
                     control.hide();
                     control.getTopParent().getContainer().unbind('container-clicked');
                  }
               };
               control.getTopParent().getContainer().bind('container-clicked', onclick);

            } );
         } else {
            $('[sbisname="ТеньВРолях"]').hide();
         }
         if(!self.hasEventHandlers('onChangeRecord')){
            function changeRecord() {
               if( isSystemRole === this.getLinkedContext().getValue('Системная')) {
                  if(this.getLinkedContext().getValue('Системная') === false) {
                     var flag = self.getTopParent();
                     if(flag.hasChildControlByName('Флаг1')) {
                        flag.getChildControlByName('Флаг1').setValue(false);
                     }
                  }

                  RoleFunction.OnReadyRoleDialog({self : this});
                  RoleFunction.onAfterLoad({self : this});
               } else {
                  self.unsubscribe('onChangeRecord', changeRecord);
               }
            }
            isSystemRole = self.getLinkedContext().getValue('Системная');
            self.subscribe('onChangeRecord', changeRecord);
         }
      },

      RenderChildRoleBrows: function( record, name ){
         if( record.getKey() == "0,Пользователь системы" )
            return $('<span class= "ws-browser-text-no-render grayText">' + record.get( name ) + '</span>');
      },

      RenderRowZoneBrows: function( record, object ){
         var div = object.find( '.ws-browser-text-container');
         var comment = record.get("Примечание");
         if( comment ){
            div.append( $( "<div style='color:#999999; font-size:11px; text-overflow:ellipsis; white-space:pre-line; overflow:hidden;' title='"+comment+"'>"+comment+"</div>" ) );
         }

         if( this.getLinkedContext().getValue('Системная' ) ) {
            this.getContainer().addClass( 'ws-browser-no-pointer' ); // Скроем руку с браузера
         } else {
            this.getContainer().removeClass( 'ws-browser-no-pointer' );

            if( !record.get( 'ОбластиВидимости' ) || record.get( "Доступ" ) === '+--' ) {
               var last = object.find( '.ws-no-pointer' ).parent().parent();
               if( last )
                  last.css( 'cursor', 'default' );
            }
         }
      },

      RenderZonesAccessLite: function( record ){
         var access = record.get( 'Доступ' ),
            text, color;
         if( access[0] == '+'){
            text = 'Запрещено';
            color = '#EF463A';
         } else if( access[1] == '+' ){
            text = 'Просмотр';
            color = 'black';
         }
         else if( access[2] == '+' ){
            text = 'Изменение';
            color = 'green';
         }
         else if( access[3] == '+' ){
            text = 'Запрещено (лицензия)';
            color = 'gray';
         }
         else if( access[4] == '+' ){
            text = 'Просмотр (лицензия)';
            color = 'gray';
         }

         if( record.get( "Раздел@" ) && hasExceptRecursive( this.getRecordSet(), record.getKey(), access, true ) )
            text += ', кроме...';

         return $('<div><span style="color: '+color+'; padding-left: 5px; font-size:13px;">'+text+'</span></div>' );
      },

      RenderZonesAccess: function( record ){
         // Надо как бы плясать от поля ЯвноНазанчена
         var self = this,
            selfTopParent = self.getTopParent(),
            context = this.getLinkedContext(),
            current_role = context.getValue( '@Роль' ),
            is_system_role = context.getValue('Системная' ),
            record_set = this.getRecordSet(),
            child_rs = context.getValue('Наследники' ),
            ret = calcAccess( record_set, child_rs, record, current_role, is_system_role, this ),
            div_obj = $("<div class='" + (is_system_role ? '' : "accessControl dropAccess") + "' id='" + parseStr( record.get("Имя") ) + "' pkValue='"+record.getKey()+"'>" +
               "<span class='" + (is_system_role ? '' : "accessControlSpan" ) + "' style='color:"+ret.color+"; padding-left:5px; font-size:13px; font-weight:"+ret.weight+";' title='"+ret.title+"'>" +
               ret.text +
               "</span></div>" );

         return div_obj;
      },

      RenderZonesScopeLite: function( record ){
         var self = this;

         if( !record.get( 'ОбластиВидимости' ) || record.get( "Доступ" )[0] === '+' )
            return $('<span class="ws-no-pointer"></span>');

         var scopes_recordset = record.get( "ЗначенияОбластейВидимости" );
         var div_scopes = $('<div></div>');
         scopes_recordset.each( function( record ) {
            var div_obj;
            if( record.get('Значения') ) {
               div_obj = $('<div class="scopesControl" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap; margin-bottom:5px;">' +
                  '<span class="scopesControlSpan" style="color:black; padding-left:5px; font-size:13px;" valueScope="'+record.get( 'ОбластьВидимости' )+'" title="Ограничения ' +  scopeToText( record.get( 'ОбластьВидимости' )).toLowerCase() + '">' +
                  record.get( 'Значения' ) + '</span></div>' );
               div_scopes.append( div_obj );
            }
            else {
               div_obj = $('<div class="scopesControl" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap; margin-bottom:5px;">' +
                  '<span class="scopesControlSpan" style="color:black; padding-left:5px; font-size:13px;" title="Ограничения ' +  scopeToText( record.get( 'ОбластьВидимости' )).toLowerCase() + '">' +
                  scopeToText( record.get( 'ОбластьВидимости' )) + '</span></div>' );
               div_scopes.append( div_obj );
            }
         });
         return div_scopes;
      },

      onAccessDelegateTabe: function(){
         var self = this;
         self.delegateUserEvent('.scopesControlSpan','click',function(event){

            event.stopPropagation();

            $ws.helpers.showFloatArea( {
               template: 'ValueAccess',
               opener: self,
               overlay: true,
               target: $(this),
               offset: { x: 20, y:0 },
               side : 'left',
               context: {
                  'Значения' : $(this).html(),
                  'ОбластьВидимости' : $(this).attr('valueScope')
               },
               animation : 'fade',
               autoHide : true,
               modal: true,
               fullShadow: true
            });
         });
      },

      RenderValuesOfScopesPanel: function( event ) {
         var self = this,
            context = self.getLinkedContext(),
            values_of_scope = self.getChildControlByName( 'Values');
         $('[sbisname=NameOfScope]').find( 'span').text( scopeToText( context.getValue( 'ОбластьВидимости' ) ) );
         values_of_scope.setContent( $( '<div style="margin-bottom:5px;line-height:20px;">' + context.getValue( 'Значения' ) + '</div>'  ) );
      },

      RenderZonesScope: function( record ){
         var self = this,
            selfTopParent = self.getTopParent(),
            context = this.getLinkedContext(),
            is_system_role = context.getValue('Системная' ),
            current_role = context.getValue( '@Роль' );

         if( !record.get( 'ОбластиВидимости' ) || record.get( "Доступ" ) === '+--' )
            return $('<span class="ws-no-pointer"></span>');

         var ret = calcZoneScope( record, current_role ),
            div_obj = $('<div class="'+ ( is_system_role ? '' : 'accessControl dropScope' ) +'" pkValue="'+record.getKey()+'" style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">' +
               '<span class="' + ( is_system_role ? '' : 'accessControlSpan' ) + '" style="color:'+ret.color+'; font-size:13px; padding-left:5px;" title="'+ (is_system_role ? ret.text : '') +'">'+ ret.text +'</span></div>' );

         return div_obj;
      },

      onDelegateTable: function(){
         /*
          после готовности танлички, подписываем row на нужные нам события
          */
         var self = this.getChildControlByName('zones'),
            context = self.getLinkedContext(),
            current_role = context.getValue( '@Роль' ),
            is_system_role = context.getValue('Системная' ),
            record_set = self.getRecordSet(),
            child_rs = context.getValue('Наследники' );

         if( !is_system_role ){
            self.delegateUserEvent('.dropAccess','click',function(event){
               event.stopPropagation();
               if(self.getTopParent().getChildControlByName('save').isEnabled()) {
                  var control = $ws.single.ControlStorage.getByName("Access"),
                     div_obj = $(this),
                     record = record_set.getRecordByPrimaryKey(div_obj.attr('pkValue'));

                  if ($ws.single.ControlStorage.getByName('Флаг1').getValue())
                     changeCheckBoxEnadle = true;

                  div_obj.addClass('pressed');
                  control.getContainer().css("top", ( div_obj.offset().top - self.getTopParent().getContainer().offset().top + 26 ) + "px");
                  control.getContainer().css("left", ( div_obj.offset().left - self.getTopParent().getContainer().offset().left ) + "px");
                  control.show();

                  var flags_control = $ws.single.ControlStorage.getByName("ДоступФлаги");
                  flags_control.getLinkedContext().setValue({ "div": div_obj, "currentRecord": record, "currentRole": current_role,
                     "browser": self, "childRecordSet": child_rs ,"control" : control});

                  var evidently = record.get('ЯвноНазначена'),
                     access = record.get('Доступ'),
                     rowkey = 'По умолчанию',
                     depend_on_write = record.get("НаследуетЗаписьОт"),
                     depend_on_read = record.get("НаследуетЧтениеОт"),
                     depend_on_inhibit = record.get("НаследуетЗапретОт"),
                     parent_access = '', parent_name = '', from_role = true;

                  if (evidently && access[0] == '+')
                     rowkey = "Запрещено";
                  else if (evidently && access[1] == '+')
                     rowkey = "Просмотр";
                  else if (evidently && access[2] == '+')
                     rowkey = "Изменение";
                  flags_control.setActiveRow($('tr[rowkey="' + rowkey + '"]'));

                  // Просщитаем, от кого будем наследоваться.
                  if (!!depend_on_write) {
                     if (( parent_access = getParentField(record_set, record.get('Раздел'), 'Доступ') )) {
                        from_role = false;
                        parent_name = getParentField(record_set, record.get('Раздел'), 'Название');
                     } else {
                        parent_access = '--+';
                        parent_name = getParentsName(record_set, child_rs, current_role, depend_on_write);
                     }
                  } else if (!!depend_on_read) {
                     if (( parent_access = getParentField(record_set, record.get('Раздел'), 'Доступ') )) {
                        from_role = false;
                        parent_name = getParentField(record_set, record.get('Раздел'), 'Название');
                     } else {
                        parent_access = '-+-';
                        parent_name = getParentsName(record_set, child_rs, current_role, depend_on_read);
                     }
                  } else if (!!depend_on_inhibit) {
                     if (( parent_access = getParentField(record_set, record.get('Раздел'), 'Доступ') )) {
                        from_role = false;
                        parent_name = getParentField(record_set, record.get('Раздел'), 'Название');
                     } else {
                        parent_access = '+--';
                        parent_name = getParentsName(record_set, child_rs, current_role, depend_on_inhibit);
                     }
                  } else {
                     parent_access = access;
                     parent_name = 'Пользователь системы';
                  }

                  if (parent_access[0] == '+')
                     rowkey = "Запрещено";
                  else if (parent_access[1] == '+')
                     rowkey = "Просмотр";
                  else if (parent_access[2] == '+')
                     rowkey = "Изменение";

                  $('tr[rowkey="По умолчанию"]').find('.ws-browser-cell-container').attr('title', '"' + rowkey + '" от ' + ( from_role ? 'роли' : 'зоны доступа' ) + ' "' + parent_name + '"');

                  var onclick = function (e) {
                     var attr = e.target.getAttribute('sbisname');
                     if (attr && attr == "ДоступСетка"){
//                        changeFlags(flags_control.getLinkedContext(), flags_control.getActiveRecord(), self);
                     } else {
                        closePanel(div_obj, control);
                     }
                  };
                  control.getTopParent().getContainer().bind('container-clicked', onclick);
               }
            });

            //************************************************************************************************************//

            self.delegateUserEvent('.dropScope','click',function(event){
               event.stopPropagation();

               if(self.getTopParent().getChildControlByName('save').isEnabled()) {
                  var control = $ws.single.ControlStorage.getByName("Scope"),
                     div_obj = $(this),
                     record = record_set.getRecordByPrimaryKey(div_obj.attr('pkValue'));

                  if (record.get("Доступ") === '+--') {
                     return;
                  }

                  div_obj.addClass('pressed');
                  control.getContainer().css("top", ( div_obj.offset().top - self.getTopParent().getContainer().offset().top + 26 ) + "px");
                  control.getContainer().css("left", ( div_obj.offset().left - self.getTopParent().getContainer().offset().left ) + "px");

                  var flags_control = $ws.single.ControlStorage.getByName("ZonesScope");
                  flags_control.getLinkedContext().setValue({ "div_obj": div_obj, "currentRecord": record,
                     "currentRole": current_role, "browser": self, "childRecordSet": context.getValue('Наследники') });
                  createFlags(record, context.getValue('@Роль'), flags_control, control);
                  control.show();

                  var onclick = function (e) {
                     var attr = e.target.getAttribute('sbisname');
                     if (attr && attr == "ZonesScope") {
                        e.stopPropagation();
                        e.preventDefault();
                     } else {
                        closePanel(div_obj, control);
                     }
                  };
                  control.getTopParent().getContainer().bind('container-clicked', onclick);
               }
            });
         }
      },

      OnChangeFlags: function( event, row, record ) {
         var contxt = this.getLinkedContext();
         changeFlags( contxt, record, contxt.getValue('browser'));
         closePanel(contxt.getValue('div'), contxt.getValue('control'));
      },

      onChangeSelect: function(event, record, flag){
         if(flag)
            this.getParent().getChildControlByName('Все организации').setValue(false);
      },

      onChangeOurOrg: function(flag){
         if(flag)
            this.getTopParent().getChildControlByName('orgs').removeSelection();
      },

      OnChangeDepartmentFlags: function( event, record, name ) {
         if( record.get( name ) === true && name === 'Все подразделения' )
            this.getTopParent().getChildControlByName( 'department' ).removeSelection();
         this.setValue( record );
      },

      OnChangeSelectionDepartment: function(event, record, flag){
         if(flag){
            var
               flags = this.getTopParent().getChildControlByName('Флаги'),
               rec = flags.getValue();
            rec.each(function(name ){
               if( name !== 'Свой офис' )
                  rec.set(name, false);
            });
            flags.setValue(rec);
         }

      },

      OnBeforeLoadDialogDepartments: function(){
         var
            rs_deps = $ws.single.ControlStorage.getByName( 'ПодразделенияСписок' ).getRecordSet();
         if( !rs_deps.contains( '0,ВсеПодразделения' ) ){
            var
               selection_array = [];
            rs_deps.each( function ( record ) {
               selection_array.push( record.getComplexKey().objKey );
            });
            this.waitChildControlByName('department').addCallback(function ( brow ){
               brow.setSelection( selection_array );
               brow.subscribe( 'onAfterLoad', function(){
                  $ws.helpers.forEach( selection_array,function( elem, key ){
                     brow.showBranch( elem );
                  });
               });
               return brow;
            });
         }
         this.waitChildControlByName('Флаги').addCallback(function ( ctrl ){
            var
               flags = ctrl.getValue();
            flags.set( 'Свой офис', true );
            if( rs_deps.contains( '0,ВсеПодразделения' ) )
               flags.set( 'Все подразделения', true );
            ctrl.setValue( flags );
            return ctrl;
         });
      },

      RenderRowLiteBrows: function( record, object ) {
         object.find('.ws-browser-type-Текст').css( 'border', "none" )
            .find( '.ws-browser-cell-container' ).css( {"min-height": "11px", "line-height": "11px" } );
      },

      OnChangeFlagsZoneScope: function( event, record, name ) {
         var context = this.getLinkedContext(),
            current_record = context.getValue( 'currentRecord' ),
            evidently = current_record.get( "ЯвноНазначена" );

         if( record.get( name ) === true ){
            setCurrentRoleInOneZoneScope( context, this, name, true );
         } else {
            setCurrentRoleInOneZoneScope( context, this, name, false );
         }

         if( !evidently ) {
            record = recalcValue( this, context, record ); // Надо пересчитать значения, так как теперь будем следить только за теми, где есть своя роль
            // Не забываем прописать наследование для доступа
            var access = current_record.get( "Доступ" );
            if( access[0] == '+'){
               changeAccess( context, true, [ 'НаследуетЗапретОт' ], null );
               changeAccess( context, false, [ 'НаследуетЗаписьОт', 'НаследуетЧтениеОт' ], null ); // Надо удалить текущую роль из себя и наследников
            } else if( access[1] == '+' ){
               changeAccess( context, true, [ 'НаследуетЧтениеОт' ], null );
               changeAccess( context, false, [ 'НаследуетЗаписьОт', 'НаследуетЗапретОт' ], null );
            } else if( access[2] == '+' ){
               changeAccess( context, true, [ 'НаследуетЗаписьОт' ], null );
               changeAccess( context, false, [ 'НаследуетЗапретОт', 'НаследуетЧтениеОт' ], null );
            }
         }

         this.setValue( record );
      },

      RenderZoneCaption: function( record, object ) {
         var self = this,
            context = this.getLinkedContext(),
            current_role = context.getValue( '@Роль' ),
            is_system_role = context.getValue('Системная' ),
            child_rs = context.getValue('Наследники' ),
            ret = calcAccess( this.getRecordSet(), child_rs, record, current_role, is_system_role, this ),
            div_obj = $("<div title='" + record.get( object ) + "' id='" + parseStr( record.get("Имя") ) + "'>" +
               "<span style='color:"+ret.color+"; font-weight:"+ret.weight+";'>" + record.get( object ) + "</span></div>" );
         return div_obj;
      },

      RenderZoneCaptionLite: function( record, object ) {
         var access = record.get( 'Доступ' ),
            color;
         if( access[0] == '+') {
            color = '#EF463A';
         } else if( access[1] == '+' ) {
            color = 'black';
         } else if( access[2] == '+' ) {
            color = 'green';
         } else if( access[3] == '+' ) {
            color = 'gray';
         } else if( access[4] == '+' ) {
            color = 'gray';
         }

         var div_obj = $("<div id='" + parseStr( record.get("Имя") ) + "'>" +
            "<span style='color:"+color+";'>" + record.get( object ) + "</span></div>" );
         return div_obj;
      },

      onAfterRender : function () {
         isLoadDialog = idActiveRow;
         if(this.getTopParent().hasChildControlByName('Флаг1')) {
            if(!this.getTopParent().getChildControlByName('Флаг1').getValue())
               searchStar(this);
         } else {
            var visibleBox;
            if(this.getLinkedContext().getValue('Системная' ))
               visibleBox = false;
            else
               visibleBox = true;

            $ws.core.attachInstance('SBIS3.CORE.GroupCheckBox', {
               name : 'box',
               element: $('.hederRow1'),
               visible: visibleBox,
               parent: this.getParent(),
               elements : [
                  {
                     name: 'Флаг1',
                     tabindex: 1,
                     caption: 'Явно назначеные',
                     value: false
                  }
               ],
               handlers: {
                  onChange : RoleFunction.hideStarColum
               }
            });
            searchStar(this);
         }
      },

      hideStarColum : function() {
         var zones = this.getTopParent().getChildControlByName('zones');
         if(!this.getParent().getChildControlByName('Флаг1').getValue()) {
            zones.setData(recordSetValueOld);
         } else {
            var listBlack = storageNameStar.listName;
            for(var i = 0, length = listBlack.length; i < length; i++) {
               recordSetValueNew.deleteRecord(listBlack[i]);
            }
            zones.setData(recordSetValueNew);
         }
      },

      onBeforeRender : function () {
         if(changeCheckBoxEnadle) {
            changeCheckBoxEnadle = false;
            if(this.getTopParent().getChildControlByName('Флаг1').getValue()) {
               var record = this.getTopParent().getChildControlByName('zones');
               searchStar(record, true);
               var listBlack = storageNameStar.listName;
               for(var i = 0, length = listBlack.length; i < length; i++) {
                  record.getRecordSet().deleteRecord(listBlack[i]);
               }
            }
         }
         if(!isFirstLoad){
            isFirstLoad = true;
            stepMultiMap(this, this.getRecordSet())
         }
      },

      onCloseWindow : function() {
         // когда закрываем диалог редактирования, включаем управление dropDown с сервисами.
         if(this.getTopParent) {
            var opener = this.getTopParent().getOpener().getTopParent();
            if(opener.hasChildControlByName('setServiceDropdown')){
               opener.getChildControlByName('setServiceDropdown').setEnabled(true);
               opener.getChildControlByName('FieldRadioClass').setEnabled(true);
            }
         }

         recordSetValueOld = undefined;
         recordSetValueNew = undefined;
         isLoadDialog = undefined,
         storageNameStar.listName = [],
         selfTopParent = this.getTopParent();

         if(selfTopParent.getChildControlByName('Флаг1'))
            selfTopParent.getChildControlByName('box').destroy();
      },
      // рисует заголовок у первого столбца таблицы
      renderRowHeder: function() {
         var jqHeight,jqMargin;
         if(this.getLinkedContext().getValue('Системная')) {
            jqHeight = 'auto';
            jqMargin = '0px';
         } else {
            jqHeight = '24px';
            jqMargin = '3px';
         }
         var jq = $('<div class="hederRow1" style="width: 135px; height:'+jqHeight+'; left: -4px; position: relative; margin-top : '+jqMargin+';"></div>');
         return jq;
      },

      onBeforeCreateRole: function() {
         this.getLinkedContext().setValue( "newRole", true );
      },

      onRowActivated : function( eventObject) {
         if(isEnterPressed) {
            idActiveRow = undefined;
            isEnterPressed = false;
            eventObject.setResult(false);
         }
      },

      onKeyPressed : function(eventObject, event){
         var actElem,
            nxtElem,
            isDir = 0;

         if(this.isEnabled()) {
            if (event.which == $ws._const.key.enter) {
               isEnterPressed = true;
            }

            if (event.which == $ws._const.key.esc) {

               var dialogEdit = this.getTopParent().getLinkedContext().getValue('dialogEdit'),
                  controlTemp;
               if(dialogEdit) {
                  controlTemp = dialogEdit;
                  dialogEdit = dialogEdit.getTopParent().isOpened;
               } else {
                  dialogEdit = false;
               }
               if(dialogEdit) {
                  controlTemp.getTopParent().sendCommand('close');
               }
            }

            if (event.keyCode === 38 ){
               actElem = this.getActiveElement();
               actElem = actElem.prev();
               while (actElem[0]){
                  isDir = actElem.attr('rowkey');
                  isDir = isDir.split(',')[1];
                  if ( isDir != '-1' ){
                     this.setActiveElement( actElem );
                     eventObject.setResult(false);
                     return;
                  }
                  actElem = actElem.prev();
               }
               eventObject.setResult(false);
               return
            }

            if (event.keyCode === 40 ){
               actElem = this.getActiveElement();
               nxtElem = actElem.next();
               if ( nxtElem[0] !== undefined ){
                  isDir = nxtElem.attr('rowkey');
                  isDir = isDir.split(',')[1];
                  if ( isDir === '-1' ){
                     nxtElem = nxtElem.next();
                     this.setActiveElement( nxtElem );
                     eventObject.setResult(false);
                     return;
                  }
               }
            }
         }
      },

      onReadyWhatHeCan : function() {
         if( this.setTitle && $('#FIO').length)
            this.setTitle( "Разрешено пользователю " + $('#FIO').text() );
      },

      onBeforeSaveRole : function( event ) {
         var context = this.getLinkedContext(),
         // Надо удалять привязку к пользователю, если поставлена галка не используется
            def = new $ws.proto.Deferred(),
            self = this,
            context = self.getLinkedContext(),
            role = context.getValue( '@Роль' ),
            idUser = self.getOpener().getLinkedContext().getValue('@Пользователь'),
            flag = self.getChildControlByName( 'Скрытая' ),
            obj = new $ws.proto.BLObject( "Роль" );

         if(context.getValue( 'newRole' )){
            this.getOpener().getLinkedContext().setValue('nameNewRole',this.getRecord().getKey());
         }
         /*
          Если опенер является  модуль roleEdit.module то тогда добавляем параметр id пользователя.
          Иначе он нам ненужен.
         */
         if(self.getOpener().getName() === 'roleEdit') {
            this.getRecord().addColumn('ИдПользователя',$ws.proto.Record.FIELD_TYPE_INTEGER);
            this.getRecord().set('ИдПользователя',idUser);
         }

         event.setResult( def );

         // Закроем все инъекции
         var comment_text = self.getChildControlByName( "Примечание" ).getValue();
         self.getChildControlByName( "Примечание" ).setValue( $ws.helpers.escapeHtml( comment_text ) );
         if( flag.getValue() ) {
            obj.query( "СписокПользователей", {"Роль":role} )
               .addCallback( function( recordset ) {
                  if( recordset.getRecordCount() > 0 ) {
                     $ws.helpers.question( "Не используемая роль не может быть привязана ни к одному пользователю!<br>Сделать ее таковой и удалить привязки?" ).addCallback( function( res ) {
                        if( res ) {
                           var obj = new $ws.proto.BLObject('РолиПользователя' ),
                              users = [];
                           recordset.each( function( record ) {
                              users.push( record.getKey() );
                           });
                           obj.call("УдалитьПользователей", { 'Роль' : role, 'Пользователи' : users }, $ws.proto.BLObject.RETURN_TYPE_ASIS )
                              .addCallback( function() {
                                 def.callback( true );
                              } )
                              .addErrback( function( error ) {
                                 $ws.core.alert( error.message, "error" );
                                 def.callback( false );
                              } );
                        } else {
                           self.getChildControlByName( 'Скрытая' ).setValue( false );
                           def.callback( true );
                        }
                     } );
                  } else
                     def.callback( true );
               } );
         } else
            def.callback( true );
      },

      onBeforeLoadRoleList : function() {
         setSevice('Роль', 'Список', this, null);
      },

      onChangeFieldDropdown : function(eventObject, value) {
         isService = '/'+this.getValue();

         var addresService = getLocalOrigin() + isService,
            filter = {
               'd': [ addresService, idClass],
               's': [
                  {'n': 'АдресСервиса', 't': 'Строка'},
                  {'n': 'ИдПользователя', 't': 'Число целое'}
               ]
            }

         setSevice('Роль','СписокСГруппами',this.getParent().getChildControlByName('reestrRoles'),filter);
      },

      onChangeFieldDropdownTableView : function(eventObject, value) {
         isService = '/'+this.getValue();
         var idUser = this.getLinkedContext().getValue('@Пользователь'),
            addresService = getLocalOrigin() + isService,
            filter = {
               'd': [ idUser, true, addresService],
               's': [
                  {'n': 'Пользователь', 't': 'Строка'},
                  {'n': 'ТолькоНазначенные', 't': 'Логическое'},
                  {'n': 'АдресСервиса', 't': 'Строка'}
               ]
            };
         setSevice('Авторизация', 'МаксимальныеРолиПользователяСГруппами', this.getParent().getChildControlByName('roleViewTable'), filter);
      },

      onReadyRoles : function(){
         this.getRecordSet().getReader().getAdapter().getRPCClient()._transport._options.url = isService +'/service/sbis-rpc-service300.dll';
         this.reload();
      },

      switchServiceSetVisible : function(){
         var self = this;

         if($ws._const.resourceRoot !== '/admin/resources/') {
            isService = '';
         } else {
            this.setVisible(true);

            var key = [], value = [];
            var bLObject = new $ws.proto.BLObject({name:"Приложение"});
            bLObject.call(
               'СписокСлужебныхПриложений',
               { "ДопПоля":null, "Фильтр":null, "Сортировка":null, "Навигация":null },
               $ws.proto.BLObject.RETURN_TYPE_RECORDSET).addCallback(function(record){
                  value.push('admin');
                  key.push('admin');
                  record.each(function(r){
                     key.push(r.get('Код'));
                     value.push(r.get('Название'));
                  });
                  self.setData(
                     {
                        keys: key,
                        values: value
                     }
                  );
               }
            );
         }
      },

      ////////// обработчики для RoleEdit /////////////////

      onInitRoleTemplate: function(){
         this.getLinkedContext().setValue( 'Назначеные', [] );
      },

      onRoleClick: function(event, row, record){
         var
            id = record.getKey(),
            sel = this.getSelection(true);

         for(var i in sel){
            if(sel[i].getKey() === id){
               this.clearSelection([id]);
               return;
            }
         }
         this.setSelection([id, id]);
      },

      onChangeSelectionRole: function( event, records, value ) {
         if(records){
            var self = this;
            function ChangeSelectionRole( record ){
               if( record.hasColumn('Назначена') ){
                  var selection_array = self.getLinkedContext().getValue( 'Назначеные' );
                  if( value ){
                     if( $.inArray( record.get('@Роль'), selection_array ) === -1 )
                        selection_array.push( record.get('@Роль') );
                  } else {
                     if(!records.length)
                        selection_array.splice( selection_array.indexOf( record.get('@Роль') ), 1 );
                  }
                  self.getLinkedContext().setValue( 'Назначеные', selection_array );
                  record.set('Назначена', value);
               }
            }
            if( !(records.propertyIsEnumerable('length')) && typeof records === 'object' && typeof records.length === 'number' ){
               for( var i = 0, count = records.length; i < count; i++ )
                  ChangeSelectionRole( records[i] );
            } else
               ChangeSelectionRole( records );
         }
      },

      onAfterRenderRoleBrowser: function() {
         var rs = this.getRecordSet(),
            selection_array = this.getLinkedContext().getValue( 'Назначеные' );

         if( selection_array.length === 0 )
            rs.each( function ( record ) {
               if( record.get('Назначена') && $.inArray(record.get('@Роль'), selection_array) === -1 )
                  selection_array.push( record.get('@Роль') );
            });

         this.getLinkedContext().setValue( 'Назначеные', selection_array );

         this.setSelection( selection_array );
      },

      onSaveRoles : function(){
         var
            dialog = this.getTopParent(),
            user = dialog.getContext().getValue('@Пользователь'),
            brows_roles = dialog.getOpener().getTopParent().getChildControlByName('roleViewTable'),
            brows_changed_roles = dialog.getChildControlByName('rightRoles'),
            sel_recs = brows_changed_roles.getSelection(true),
            roles = [],
            addresService = getLocalOrigin() + isService;

         if ( sel_recs ) {
            for (var i = 0; i < sel_recs.length; ++i) {
               var str = sel_recs[i].get('@Роль');
               roles.push(str.substring(str.indexOf(',') + 1, str.length));
            }

            var userFilter = { 'Пользователь': user,'Роли': roles};

            if($ws._const.resourceRoot == '/admin/resources/'){
               userFilter.АдресСервиса = addresService;
            }

            new $ws.proto.BLObject({name:"РолиПользователя"})
               .call('Установить', userFilter, $ws.proto.BLObject.RETURN_TYPE_ASIS)
               .addCallback( function(){
                  dialog.close(true);
                  /*
                  Вызываем метод Бизнес Лигики на список груп, только назначенных
                  и вставляем в табличку ново полученные данные.
                   */
                  var filter =
                  {
                     'd': [ user, true],
                     's': [
                        {'n': 'Пользователь', 't': 'Строка'},
                        {'n': 'ТолькоНазначенные', 't': 'Логическое'}
                     ]
                  };

                  if($ws._const.resourceRoot == '/admin/resources/'){
                     filter.d.push(addresService);
                     filter.s.push({'n': 'АдресСервиса', 't': 'Строка'});
                  }

                  setSevice('Авторизация', 'МаксимальныеРолиПользователяСГруппами', brows_roles, filter);
               })
               .addErrback(function(response){
                  $ws.core.attachInstance("Control/Area:DialogAlert", {
                     'opener' : dialog,
                     'type' : 'info',
                     'message' : response.details
                  });
               });
         }

      },

      onRenderRowRole: function( record, row ) {
         var show_only_leafs = this.getLinkedContext().getValue('ПоказыватьНазначенныеРоли');
         if(record.get('ДоступнаЛиДляНазначения') === false)
            row.addClass('ws-hidden');

         var offsetLeft = 0;

         if ( record._colDef["Дир"] !== undefined )
            offsetLeft = parseInt( record.get( 'Дир' ) , 10 );

         offsetLeft *= 20;

         var isDir = record.get( '@Роль' ).split(',')[1];
         if ( ( offsetLeft > 0 ) || ( isDir === '-1' ) ){
            var div2 = row.find( '.ws-browser-cell-container');

            if ( isDir === '-1' ){
               if ( isDir === '-1' ){
                  row.addClass( 'dir' );
                  row.find('.ws-browser-cell').addClass('dirSeparator');

                  var chBox = row.html();
                  chBox = chBox.replace('<span class="ws-browser-checkbox"></span>','');
                  row.html( chBox );

                  div2 = row.find( '.ws-browser-cell-container');
                  div2.html( '<div style="padding-left: ' + offsetLeft + 'px; font-size: 16px; font-style: italic; font-family: georgia; color: #999999;">' + div2.html() + '</div>' );

                  var rowCell = row.find('.ws-browser-cell');
                  if(rowCell.length > 1){
                     $(rowCell[0]).removeClass('ws-browser-cell');
                  }
               }
            }
            else
               div2.html( '<div style="padding-left: ' + offsetLeft + 'px;">' + div2.html() + '</div>' );
         }

         var div = row.find( '.ws-browser-cell-container' ),
            comment = record.get("Примечание");
         if( comment )
            div.append( $( '<div style="padding-left: ' + offsetLeft+ 'px;">' + "<div style='color:#999999; font-size:11px; text-overflow:ellipsis; white-space:pre-line; overflow:hidden;' title='"+comment+"'>"+comment+"</div></div>" ) );

      },

      ////////// обработчики для RoleEdit КОНЕЦ /////////////////

      onBeforeDeleteUser : function(event, record){
         var self = this;
         event.setResult(false);

         new $ws.proto.BLObject('РолиПользователя').call(
            'УдалитьПользователей',
            {
               'Роль': this.getLinkedContext().getValue('Роль'),
               'Пользователи': [record[0].get('@Пользователь')],
               'АдресСервиса': getLocalOrigin() + isService
            },
            'asis').addCallback(function(result){
               self.reload();
            });

      },

      subscribeChanel : function() {
         $ws.single.EventBus.channel('roleReestr').subscribe('clickRow',sub,this);
      },

      unSubscribeChanel : function() {
         $ws.single.EventBus.channel('roleReestr').unsubscribe('clickRow',sub,this);
      },

      onBeforeLoadAdmins : function(){
         this.setRootNode(idClass);
      },

      onSaveAddAdmins : function(){
         var topParent = this.getTopParent(),
            tableParent = topParent.getOpener().getTopParent().getChildControlByName('users'),
            role = tableParent.getLinkedContext().getValue('Роль'),
            select = topParent.getChildControlByName('addAdmins').getSelection(true),
            blankSelect = [],
            addresService = getLocalOrigin() + isService;

         $ws.helpers.toggleIndicator(true);
         for(var i = 0, length = select.length; i < length; i++){
            blankSelect.push(select[i].get('@Пользователь'));
         }


         new $ws.proto.BLObject('РолиПользователя').call(
            'ДобавитьПользователей',
            {
               'Роль': role,
               'Пользователи': blankSelect,
               'АдресСервиса': addresService
            },
            'asis').addCallback(function(event){
               $ws.helpers.toggleIndicator(false);
               topParent.close();
               tableParent.reload();
            }).addErrback(function(response){
               $ws.helpers.toggleIndicator(false);
               $ws.core.alert(response.message);
            });
      },

      onFirstLoadRoleAccess : function(){
         var bLObject = new $ws.proto.BLObject({name:"РолиПользователя"}),
            idUser = this.getLinkedContext().getValue('Пользователь'),
            self = this,
            addresService = getLocalOrigin() + isService,
            roles = this.getLinkedContext().getValue('Роли');

         if($ws._const.resourceRoot === '/resources/')
            addresService = undefined;

         bLObject.call(
            'ЧтоМожно',
            { "ДопПоля":[], "Фильтр":{
               'd' : [
                  idUser,
                  roles,
                  "С узлами и листьями",
                  "Раздел",
                  "С разворотом",
                  true,
                  "Название",
                  false,
                  null,
                  addresService
               ],
               's' : [{'n': "Пользователь",'t': "Строка"},
                  {'n': "Роли",'t': {'n': "Массив",'t': "Текст"}},
                  {'n': "ВидДерева",'t': "Строка"},
                  {'n': "HierarchyField",'t': "Строка"},
                  {'n': "Разворот",'t': "Строка"},
                  {'n': "ПутьКУзлу",'t': "Строка"},
                  {'n': "ЗаголовокИерархии",'t': "Строка"},
                  {'n': "_ЕстьДочерние",'t': "Логическое"},
                  {'n': "Раздел",'t': "Строка"},
                  {'n': "АдресСервиса",'t': "Строка"}
               ]
            }, "Сортировка":null, "Навигация":null },
            $ws.proto.BLObject.RETURN_TYPE_RECORDSET).addCallback(function(record){
               record.setHierarchyField('Раздел');
               self.setData(record);
            });
      },

      onFirstLoadAddRole : function(){
         var bLObject = new $ws.proto.BLObject({name:"Авторизация"}),
            idUser = this.getLinkedContext().getValue('@Пользователь'),
            self = this,
            addresService = getLocalOrigin() + isService,
            filter = {
               'd' : [idUser],
               's' : [
                  {
                     'n': "Пользователь",
                     't': "Строка"
                  }
               ]
            };

         if($ws._const.resourceRoot == '/admin/resources/'){
            filter.d.push(addresService);
            filter.s.push({
               'n': "АдресСервиса",
               't': "Строка"
            });
         }

         bLObject.call(
            'МаксимальныеРолиПользователяСГруппами',
            { "ДопПоля":[], "Фильтр":filter, "Сортировка":null, "Навигация":null },
            $ws.proto.BLObject.RETURN_TYPE_RECORDSET).addCallback(function(record){
               self.setData(record);
            });
      },

      setOnlyRead : function(){
         if($ws._const.resourceRoot == '/admin/resources/'){
            this.setReadOnly(true);
         }
      },

      onChangeRadioButton : function(eventObject, value){
         userClass = this.getValueAsString();
         requestIdClass();
      },

      getIdClass : function(){
         if($ws._const.resourceRoot == '/admin/resources/'){
            requestIdClass();
            isAdminService = true;
         }
         else {
            // Если это не админка, то просто запускаем табличку.
            isAdminService = false;
            this.reload();
         }
      },

      getAddresService : function(){
         if($ws._const.resourceRoot === '/resources/'){
            return undefined;
         } else {
            return getLocalOrigin() + '/admin';
         }
      },

      setDefaultSetting : function(){
         isService = $ws._const.resourceRoot == '/admin/resources/' ? '/admin' : '';
         userClass = '__сбис__администратор';
      },

      onClickCreateNewRole : function(){
         var window = this.getTopParent(),
            browser = window.getChildControlByName( 'rightRoles');

         $ws.helpers.newRecordSet('Роль', 'Список', undefined, undefined, false).addCallback( function( recordset ){
            recordset.createRecord().addCallback( function( record ){
               $ws.core.attachInstance('Control/Area:RecordFloatArea', {
                  template: 'Диалог роли',
                  record: record,
                  side: 'right',
                  isStack: true,
                  autoHide: false,
                  opener: window,
                  handlers: {
                     onAfterClose: function (eventObject) {
                        var selection_array = browser.getLinkedContext().getValue( 'Назначеные'),
                           user = browser.getTopParent().getContext().getValue('@Пользователь');
                        selection_array.push( "0," + record.get('@Роль') );
                        browser.getLinkedContext().setValue( 'Назначеные', selection_array );

                        var filter =
                        {
                           'd': [ user],
                           's': [
                              {'n': 'Пользователь', 't': 'Строка'}
                           ]
                        };

                        setSevice('Авторизация', 'МаксимальныеРолиПользователяСГруппами', browser, filter);
                     }
                  }
               })
            } );
         } );
      },

      onRoleClickUser: function(event, row, record){
         if(record.get( "Раздел@" ) === true)
            return;

         var isDir = record.get( '@Роль' ).split(',')[1];
         if ( isDir === '-1' )
            return;

         var
            id = record.getKey(),
            sel = this.getSelection(true);
         for(var i in sel){
            if(sel[i].getKey() === id){
               this.clearSelection([id]);
               return;
            }
         }
         this.setSelection([id, id]);
         hdl.onChangeSelectionRole.apply(this, [{}, record, true]);
      },

      // Если находимся в админке то скрываем возмоджность добавить новую роль
      hideNewRole: function(){
         if($ws._const.resourceRoot === '/admin/resources/'){
            this.getTopParent().getChildControlByName('ДобавитьРоль').hide();
         }
      },
      /*
       После каждой загрузке таблици, мы кричим в нашу шину событие с количеством рекордов
       если их нет то контрол RoleEdit = Добавить, если рекорды есть то = Изменить.
      */
      onAfterLoadTableView: function(){
         var count = {
            'countRecord': this.getRecordSet().getRecordCount()
         };

         $ws.single.EventBus.channel('roleReestr').notify('reloadRoleView',count);
      },

      subscribeRoleView: function(){
         $ws.single.EventBus.channel('roleReestr').subscribe('reloadRoleView',loadRoleView,this);
      },

      unSubscribeRoleView: function(){
         $ws.single.EventBus.channel('roleReestr').unsubscribe('reloadRoleView',loadRoleView,this);
      },

      tableSetRowOnce: function(){
         // Бежим сверху по ячейкам таблички и щем строчку которая НЕ заголовок и устанавливаем курсор.
         this.once('onAfterRender', function() {
            var rows = this.getContainer().find('[rowkey]');
            if(rows.length){
               function isHederRow(id){
                  return $(id).attr('rowkey').split(",")[1] === '-1' ? false : true;
               }
               for(var i = 0, length = 1; i <= length; i++){
                  if(isHederRow(rows[i])){
                     this.setActiveRow($(rows[i]));
                     break;
                  }
               }

            }
         });
      }
   }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadRoleView(event,arg){
   if(arg.countRecord){
      this.setCaption('изменить');
   }else{
      this.setCaption('добавить');
   }
}

function getLocalOrigin(){
   return location.protocol +"//"+ location.host;
}

function requestIdClass(){
   new $ws.proto.BLObject('Пользователь').call(
      'Найти',
      {'Логин':userClass, 'Вид' : 'клиент'},
      'asis')
      .addCallback(function(response){
         idClass = response;

         var addresService = getLocalOrigin() + isService,
            filter = {
            'd': [ addresService, idClass],
            's': [
               {'n': 'АдресСервиса', 't': 'Строка'},
               {'n': 'ИдПользователя', 't': 'Число целое'}
            ]
         }

         setSevice('Роль','СписокСГруппами',$ws.single.ControlStorage.getByName('reestrRoles'),filter);
      });
}

function sub(event,arg){
   if($ws._const.resourceRoot === '/admin/resources/'){
      this.getLinkedContext().setValue( 'Роль', arg.role);
      this.getLinkedContext().setValue( 'АдресСервиса', arg.addresService);
      this.getLinkedContext().setValue( 'ИдКласса', arg.idClass);
   } else {
      this.getLinkedContext().setValue( 'ИдО', arg.role);
   }
   
   this.setPage(0, false);
   this.reload();
}

function setSevice(object, method, table, filter) {
   $ws.helpers.toggleIndicator(true);

   var bLObject = new $ws.proto.BLObject({name:object});
   bLObject.call(
      method,
      { "ДопПоля":null, "Фильтр":filter, "Сортировка":null, "Навигация":null },
      $ws.proto.BLObject.RETURN_TYPE_RECORDSET).addCallback(function(record){
         table.setData(record);
         isOldService = isService;
         $ws.helpers.toggleIndicator(false);
      }).addErrback(function(event){
         if(method === 'СписокСГруппами' || method === 'МаксимальныеРолиПользователяСГруппами'){
            var dropDown = table.getTopParent().getChildControlByName('setServiceDropdown'),
               message,
               nameService = dropDown.getValueByKey(isService.replace('/',''));
            if(event.classid.toLowerCase() == '{1b4dbb13-ce61-483f-b1dd-03558672d15a}'){
               message = 'Для сервиса "'+nameService+'" невозможно настроить права, т.к.' +
                  ' на сервисе отсутствует модуль "Авторизация". Все методы сервиса ' +
                  'доступны без ограничений. Если настройка прав необходима, обратитесь ' +
                  'с предложением добавления модуля "Авторизация" к ответственному за сервис.';
            } else {
               message = 'Не удается загрузить список ролей c "'+nameService+'" по причине: ' + event.details;
            }

            $ws.core.alert( message, "info" );

            dropDown.setValue(isOldService.replace('/',''));
            isService = isOldService;
            $ws.helpers.toggleIndicator(false);
         }
      });
}

function parseStr( str ) {
   return str.substr( str.search(',')+1 );
}

function getParentsName( record_set, record_set_child, current_role, depend_on ){
   var array = depend_on.split( ',' ),
      multiMap = $ws.single.GlobalContext.getValue( "multiMap" ),
      names = "", record;
   for( var i = 0, count = array.length; i < count; i++ ){
      if( current_role == array[i] || !array[i] )
         continue;
      if( multiMap[ array[i] ] )
         record = record_set.getRecordByPrimaryKey(multiMap[array[i]][0]);
      else if( record_set_child.contains( "0," + array[i] ) )
         record = record_set_child.getRecordByPrimaryKey( "0," + array[i] );

      names += (!names ? '"' : ', "') + ( record ? record.get( 'Название' ) : array[i] ) + '"';
   }

   return names;
}

function hasExceptRecursive( record_set, key, access, is_first ,current_role){
   var childs, i, count, rec, ret;
   if( record_set.contains( key ) ){
      rec = record_set.getRecordByPrimaryKey( key );
   }
   /*
   Проверка на детей и запуск рекурсии проверки детей.
    */
   if( ( key === "null" || key === null ) || ( rec && rec.get( "Раздел@" ) ) ) {
      childs = record_set.recordChilds( key );
      for( i = 0, count = childs.length; i < count; i++ ){
         ret = hasExceptRecursive( record_set, childs[i], access, false, current_role);
         if( ret )
            return true;
      }
   }
   /*
   Иногда существует момент, когда у ЗД фактически Уд изменен, а графический ключ get('Доступ')
    еще не расчитан, данным функционалом мы проводим досрочный перерасчет. Мы пробегаем по всем УД, ищем текущую роль (как признак выбора)
    Если ее нет, будет выставлен доступ родителя,  если его нет, значит ЗД обладает +-- (запрещено).
    Есди у нас current_role == undefined значит мы ее использует диалог "Что можно" тогда эта проверка не нужна.
    */
   if(current_role)
      realVisualAccet(rec, record_set, current_role);

   if( !is_first && rec && rec.get( "Доступ" ) !== access )
      return true;

   return false;
}

function getParentRole(record ,currentRole){
   for(var j = 0; j < 3; j++){
      var constCurrentName = constNameAccess[j],
         isCurrZoneValue = findCurrentZone(record, constCurrentName.value, currentRole, false);

      if(isCurrZoneValue)
         return record.get(constCurrentName.value);
   }
   return '';
}

function getParentField( record_set, key, field_name ){
   var parent_record, _key = key;

   while( _key ){
      parent_record = record_set.getRecordByPrimaryKey( _key )
      if( parent_record.get( "ЯвноНазначена" ) === true )
         return parent_record.get( field_name );
      else
         _key = parent_record.get( 'Раздел' );
   }

   return '';
}

function calcAccess( record_set, record_set_child, record, current_role, is_system_role, browser ){
   var evidently = record.get( 'ЯвноНазначена' ),
      depend_on_write = record.get( "НаследуетЗаписьОт" ),
      depend_on_read  = record.get( "НаследуетЧтениеОт" ),
      depend_on_inhibit  = record.get( "НаследуетЗапретОт" ),
      roleTitle,
      access = '', parent_access = '', title = '', style, is_star, appointed,
      isKeyBlackList = !searchZoneInBlackList(record.getKey());

   if(isKeyBlackList) {
      if( evidently ? (depend_on_write.indexOf( current_role ) != -1) : ( !!depend_on_write ) ){
         access = '--+';
         if( evidently ) // Значит у нас все права, звезду не рисуем, текст жирный
            style = 'normal';
         else if( ( parent_access = getParentField( record_set, record.get( 'Раздел' ), 'Доступ' ) ) && ( access = parent_access ) ) // Надо посмотреть, может есть явно назначеный родитель, тогда надо брать доступ с него, звезду не рисуем, текст бледный
            style = 'pale';
         else { // Звезду рисуем, текст обычный
            is_star = true;
            roleTitle = getParentsName( record_set, record_set_child, current_role, depend_on_write );
            if( roleTitle == '"Пользователь системы"')
               title = 'Используется доступ по умолчанию';
            else
               title = 'Определено в роли: ' + roleTitle;
         }
      } else if( evidently ? ( depend_on_read.indexOf( current_role ) != -1 ) : ( !!depend_on_read ) ){
         access = '-+-';
         if( evidently ) // Значит права только на чтение, звезду не рисуем, текст жирный
            style = 'normal';
         else if( ( parent_access = getParentField( record_set, record.get( 'Раздел' ), 'Доступ' ) ) && ( access = parent_access ) )// Надо посмотреть, может есть явно назначеный родитель, тогда надо брать доступ с него, звезду не рисуем, текст бледный
            style = 'pale';
         else { // Звезду рисуем, текст обычный
            is_star = true;
            roleTitle = getParentsName( record_set, record_set_child, current_role, depend_on_read );
            if( roleTitle == '"Пользователь системы"')
               title = 'Используется доступ по умолчанию';
            else
               title = 'Определено в роли: ' + roleTitle;
         }
      } else if( evidently ? ( depend_on_inhibit.indexOf( current_role ) != -1 ) : ( !!depend_on_inhibit ) ){
         access = '+--';
         if( evidently ) // Значит все запрещено, звезду не рисуем, текст жирный
            style = 'normal';
         else if( ( parent_access = getParentField( record_set, record.get( 'Раздел' ), 'Доступ' ) ) && ( access = parent_access ) ) // Надо посмотреть, может есть явно назначеный родитель, тогда надо брать доступ с него, звезду не рисуем, текст бледный
            style = 'pale';
         else { // Звезду рисуем, текст обычный
            is_star = true;
            roleTitle = getParentsName( record_set, record_set_child, current_role, depend_on_inhibit );
            if( roleTitle == '"Пользователь системы"')
               title = 'Используется доступ по умолчанию';
            else
               title = 'Определено в роли: ' + roleTitle;
         }
      } else if( !evidently ) {
         style = 'pale';
         if( !record.get( "Раздел" ) ) // Значит все запрещено, звезду не рисуем, текст обычный
            access = '+--';
         else
            access = record_set.getRecordByPrimaryKey( record.get( 'Раздел' ) ).get( 'Доступ' );
      }
      // Установим доступ
      record.set( 'Доступ', access );
   } else {
      // алгоритм правильного отображения цвета и условных символов для одинаковых ролей находящихся в разных иерархиях.
      access = record.get('Доступ');
      if (!isKeyBlackList && !evidently) {
         var keyRecord = record.getKey(),
            isItemListParent = Array.indexOf(listParentAccet, keyRecord.split(',')[0]);

         if (isItemListParent > -1) {
            style = 'pale';
            is_star = false;
         } else {
            var flagFindAccess = 0;
            for (var j = 0; j < 3; j++) {
               var constCurrentName = constNameAccess[j],
                  isCurrZoneValue = findCurrentZone(record, constCurrentName.value, current_role, false);

               if (isCurrZoneValue) {
                  flagFindAccess = record.get(constCurrentName.value).split(',').length;
               }
            }
            if (flagFindAccess >= 2) {
               style = 'normal';
               is_star = true;
            } else {
               style = 'pale';
               is_star = false;
            }
         }
      }
   }

   var text, color;
   if( access[0] == '+') {
      text = 'Запрещено';
      color = ( style == 'pale' ) ? '#DA8B97' : '#EF463A';
   } else if( access[1] == '+' ){
      text = 'Просмотр';
      color = ( style == 'pale' ) ? '#909090' : 'black';
   } else if( access[2] == '+' ){
      text = 'Изменение';
      color = ( style == 'pale' ) ? '#70B060' : 'green';
   }

   if(style == 'pale' || is_star ) {
      appointed = true;
   } else {
      appointed = false;
   }

   if( browser && record.get( "Раздел@" ) && hasExceptRecursive( record_set, record.getKey(), access, true, current_role) ) {
      text += ', кроме...';
   }
   text += ( is_star && !is_system_role ) ? '*' : '';

   return { "text": text, "color": color, "appointed": appointed, "title": title, "weight": ( style == 'bold' ) ? 'bold' : 'normal' };
}

// Меняет права на себя и наследников. Не трогает тех, кто явно назначен
function changeAccessRecursive( record_set, key, current_role, is_added, from, from_all, is_first ) {
   var childs, i, count, rec, depend_on = "",
      changeUser,
      isDeleteFlag = false,
      isCurrentRole = false,
      isDeleteCurrentRole = false;

   if( record_set.contains( key ) ) {
      rec = record_set.getRecordByPrimaryKey( key );
      changeUser = rec.get("ЯвноНазначена");
   }

   if( rec ){
      if( !from_all && !is_first && changeUser )
         return;
      if( is_added === false ) {
         /*
            флаг означающий можно ли назначать наследование во время изменения наследования.
            Может появиться момент когда зона доступа не наследует права ни от кого, и тогда даем возможность
            назначить наследование зонам доступа ниже по приоритету.
         */
         var isFavorite = false;
         // Сначала удалим из себя
         for( i = 0, count = from.length; i < count; i++ ) {
            var fromI = from[i];

            depend_on = rec.get( fromI );

            var resultId = getIdS(depend_on);
            if(resultId.length > 2) {

               var tempIndex = Array.indexOf(resultId.array, current_role);
               /*
               Если у нас current_role !== id_curr_role это говорит нам о том, что мы в режиме удаления.
                */
               if(current_role !== id_curr_role && tempIndex !== -1)
                  isDeleteFlag = true;

               if(count !== 3 || isFavorite || isDeleteFlag) {
                  /*
                   Среди наследованных ролей для этой зоны доступа ищем текущую роль (которую удаляем)
                   Если такая имеется - удаляем.
                   */
                  if (tempIndex !== -1) {
                     resultId.array.splice(tempIndex, 1);
                     /*
                      Если тут присутствует наша роль, то мы даем знак, что этот уровень доступа
                      для нас приоритетный и в этот цвет будет окрашена зона доступа.
                      */
                     if(Array.indexOf(resultId.array,id_curr_role) !== -1)
                        isFavorite = true;
                     rec.set(fromI, resultId.array.toString());
                     continue;
                  }
               } else {
                  if(!isFavorite && isDeleteCurrentRole){
                     var tempChar = depend_on.length != 0 ? ',' : '';
                     rec.set(fromI, id_curr_role + tempChar + depend_on);
                     if(tempIndex !== -1)
                        isFavorite = true;
                     continue;
                  }
               }

               if(tempIndex !== -1)
                  isFavorite = true;

               rec.set( fromI, resultId.array.toString());
            } else {
               if(Array.indexOf(resultId.array,current_role) !== -1) {
                  isCurrentRole = true;
                  if(Array.indexOf(resultId.array,id_curr_role) !== -1 && current_role !== id_curr_role) {
                     var tempIndex = Array.indexOf(resultId.array,current_role);
                     if(tempIndex !== -1 && changeUser) {
                        resultId.array.splice(tempIndex, 1);
                        /*
                         Если тут присутствует наша роль, то мы даем знак, что этот уровень доступа
                         для нас приоритетный и в этот цвет будет окрашена зона доступа.
                         */
                        isFavorite = true;
                        rec.set( fromI, resultId.array.toString());
                        continue;
                     } else
                        rec.set( fromI, '' );
                  } else {
                     if(current_role !== id_curr_role || from.length !== 3 || isFavorite)
                     resultId.array.splice(Array.indexOf(resultId.array,current_role),1);
                     else
                        if(resultId.length === 1){
                           isDeleteCurrentRole = true;
                           rec.set(fromI, '');
                           continue;
                        }
                     rec.set(fromI, resultId.array.toString());
                  }
               } else {
                  if(depend_on && from.length === 3 && !isFavorite && !changeUser && depend_on !== id_curr_role){
                     var tempChar = '',
                        strAccess = '';
                     if(Array.indexOf(resultId.array,id_curr_role) !== -1 || isCurrentRole){
                        strAccess = depend_on;
                     } else {
                        tempChar = depend_on.length != 0 ? ',' : '';
                        strAccess = id_curr_role + tempChar + depend_on;
                  }
                     rec.set( fromI, strAccess);
                     isFavorite = true;
                     continue;
               } else {
                        rec.set(fromI, depend_on);
                  }
               }
            }
         }
      } else {
         for( i = 0, count = from.length; i < count; i++ ) {
            var fromI = from[i];
            depend_on = rec.get( fromI );
            if( depend_on.indexOf( current_role ) == -1 ){
               var tempChar = depend_on.length === 0 ? '' : ',';
               depend_on = current_role + tempChar + depend_on;
               rec.set( fromI, depend_on );
         }
      }
      }
   }

   if( ( key === "null" || key === null ) || ( rec && rec.get( "Раздел@" ) ) ) {
      childs = record_set.recordChilds( key );
      for( i = 0, count = childs.length; i < count; i++ )
         changeAccessRecursive( record_set, childs[i], current_role, is_added, from, from_all, false );
   }
}

// Меняет права на себя и наследников. Не трогает тех, кто явно назначен
function changeAccess( context, is_added, from, obviouslySet ) {
   var current_role = context.getValue( 'currentRole' ),
      record = context.getValue( 'currentRecord' ),
      record_set = record.getRecordSet(),
      record_set_child = context.getValue( 'childRecordSet' ),
      browser = context.getValue( 'browser' ),
      recArray = [],
      zoneId = parseStr( record.getKey() );
   /*
   Здесь мы идем по всему рекордсету и ищем все роли с одинаковым названием, допустим "id,Входящие"
   Но отсеиваем все идентификаторы, которые "id,Входящие зоны"
   Это делается потому что у всех Ролей разные идентификаторы, а роли с одним названием должны считаться равными
   */
   record_set.each( function( rec ) {
      // Волшебная комбинация, так экранируются все левые символы
      var trueZoneID = zoneId.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\\$&");
      if( rec.getKey().match( new RegExp( ".+," + trueZoneID + "$") ) !== null )
         recArray.push( rec );
   } );

   for( var i = 0; i != recArray.length; i++ ) {
      if( obviouslySet !== undefined && obviouslySet !== null ) {
         context.getValue( 'currentRecord' ).set( "ЯвноНазначена", obviouslySet );
         recArray[i].set( "ЯвноНазначена", obviouslySet );
      }

      // Вызов рекурсивной функции
      changeAccessRecursive( record_set, recArray[i].getKey(), current_role, is_added, from, false, true );
      // Пересчет состояния
      var ret = calcAccess( record_set, record_set_child, recArray[i], current_role, false, browser );
      $('tr[rowkey="' + recArray[i].getKey() + '"]').find( '.ws-browser-text-container' ).find('span').css( 'color', ret.color ); //Красим название в цвет доступа
   }
}

function stepMultiMap(self, recordSet){
   var multiMap = $ws.single.GlobalContext.getValue("multiMap");
   for(var nameGroup in multiMap){
      findMaxAccess(self, recordSet, nameGroup);
   }
}

// определение максимального Уровня Достапа для данной Зоны Доступа
// УД - Уровень Доступа. ЗД - Зона Доступа.
var constNameAccess = [
      {
         'access': '+--',
         'value': 'НаследуетЗапретОт'
      },{
         'access': '-+-',
         'value':'НаследуетЧтениеОт'
      },{
         'access': '--+',
         'value':'НаследуетЗаписьОт'
      }
   ],
   blackList = [],
   listParentAccet = [];

// self - указатель на табличку zone. nameZoneAccess - имя из multiMap.
function findMaxAccess(self, rSet, nameZoneAccess){
   var multiMap = $ws.single.GlobalContext.getValue( "multiMap"),
      context = self.getLinkedContext(),
      currentRole = context.getValue('@Роль'),
      recordSet = self.getRecordSet(),
      arrayZoneAccess = multiMap[nameZoneAccess], // массив сотержит id ЗД которые существуют в разных иерархиях.
      arrayZoneAccessLength = arrayZoneAccess.length,
   // Находится ли зона доступа в черном списке, в нем содержатся зоны не подлежащие проверке.
   // т.е. отработанные или у которых length === 1
      accessValue = { // объект для содержания инфы о УД с max приоритетом.
         access : '',
         value : '',
         power : 0
      },
      parentSet = false, // Явноназначенный продок, если мы встретили хоть одного, играем только в этой лиги.
      parentSetReturnAccess; // Уровень доступа от явно назначенного предка.

   if(arrayZoneAccess.length > 1){
      for(var i = 0; i < arrayZoneAccessLength; i++){
         blackList.push(arrayZoneAccess[i]);
         var zoneAccess = recordSet.getRecordByPrimaryKey(arrayZoneAccess[i]),
            returnAccess;

         realVisualAccet(zoneAccess, recordSet, currentRole);

         // Если мы явно назначены, то прекращаем проверку, так как без этого алгоритма у нас получится верный УД, так что сматываемся.
         if(zoneAccess.get('ЯвноНазначена'))
            return;

         function getTopParentRec(rec){
            if(rec.get('ЯвноНазначена'))
               return rec;
            else {
               var parentKey = rec.getParentKey();
               if(parentKey){
                  return getTopParentRec(recordSet.getRecordByPrimaryKey(parentKey));
               } else {
                  return rec;
               }
            }
         }

         var nameZoneParent = zoneAccess.getParentKey();
         if(nameZoneParent) {
            var parRec = recordSet.getRecordByPrimaryKey(nameZoneParent);
            nameZoneParent = getTopParentRec(parRec);

            if(nameZoneParent.get('ЯвноНазначена')) {
               listParentAccet.push(nameZoneAccess);
               if(!parentSet)
                  accessValue.power = 0;

               parentSet = true;
               parentSetReturnAccess = nameZoneParent.get('Доступ');
            }
            returnAccess = parRec.get('Доступ');
         } else {
            returnAccess = zoneAccess.get('Доступ');
         }

         function setMaxLevel(returnAccess){
            // Если мы не обладаем max приоритетом, то продолжаем его искать, если нашли, то сварачиваемся и идем на MERGE !..!
            if (accessValue.power !== 3) {
               // Если УД по приоритету выше чем имеющийся, то оставляем его себе.
               var valuePower = findPowerAccess(returnAccess);
               if ((valuePower > accessValue.power)) {
                  accessValue.power = valuePower;
                  accessValue.access = returnAccess;
               }
            }
         }

         if(!parentSet) {
            setMaxLevel(returnAccess);
         } else {
            setMaxLevel(parentSetReturnAccess);
         }
      }
      // Получили приоритет по УД, производим мерж УД в ЗД до максимального , который получили.
      // --- MERGE ---
      // todo: кажется это value нам вообще не надо. уточнить.
//      switch (accessValue.access){
//         case '+--': accessValue.value = constNameAccess[0].value; break
//         case '-+-': accessValue.value = constNameAccess[1].value; break
//         case '--+': accessValue.value = constNameAccess[2].value;
//      }

      var editLevelAccess = false;

      for(var i = 0; i < arrayZoneAccessLength; i++){
         var currentZoneAccess = recordSet.getRecordByPrimaryKey(arrayZoneAccess[i]);
         for(var j = 0; j < 3; j++){
            var constCurrentName = constNameAccess[j],
               isCurrZoneValue = findCurrentZone(currentZoneAccess,constCurrentName.value,currentRole,false);

            if(isCurrZoneValue)
               editLevelAccess = true;
         }
      }

      for (var i = 0; i < arrayZoneAccessLength; i++) {
         if(parentSet) {
            var currentZoneAccess = recordSet.getRecordByPrimaryKey(arrayZoneAccess[i]);
            for (var j = 0; j < 3; j++) {
               var constCurrentName = constNameAccess[j],
                  levelAccess = currentZoneAccess.get(constCurrentName.value);

               currentZoneAccess.set('Доступ', accessValue.access);
               if (accessValue.access === constCurrentName.access) {
                  // Если в УД что-то есть, то ищем текущую роль.
                  if (levelAccess && findCurrentZone(currentZoneAccess, constCurrentName.value, currentRole, false)) {
                     // Уровень доступа выставлен приоритетный, переходим к другой записи.
                     continue;
                  }
                  else {
                     var char = currentZoneAccess.get(constCurrentName.value) ? ',' : '';
                     // Формируем УД: строка с текущей ролью + id ролей которые были в этом УД.
                     currentZoneAccess.set(constCurrentName.value, currentRole + char + currentZoneAccess.get(constCurrentName.value));
                     continue;
                  }
               } else {
                  // Сначало провери есть ли что то в УД. Организуем поиск и удаление текущей роли в текущем УД.
                  if (levelAccess && editLevelAccess) {
                     findCurrentZone(currentZoneAccess, constCurrentName.value, currentRole, true);
                  }
               }
            }
         } else {
            // выставляем значения по умолчанию для всего списка.
            //todo: достум выставляется в функции calc
            var listAction = [ 'НаследуетЗаписьОт', 'НаследуетЧтениеОт', 'НаследуетЗапретОт' ];

            changeAccessRecursive( recordSet, arrayZoneAccess[i], currentRole, false, listAction, false, true );

            var currentZoneAccess = recordSet.getRecordByPrimaryKey(arrayZoneAccess[i]);
            for(var j = 0; j < 3; j++){
               var constCurrentName = constNameAccess[j],
                  isCurrZoneValue = findCurrentZone(currentZoneAccess,constCurrentName.value,currentRole,false);
               /*
               Если у нас , после того как мы выполнили "поумолчанию" есть текущая роль, то  оставляем УД в котором она присутствует
               иначе мы присваеваем "доступ" который получили путем поиска max срези arrayZoneAccess.
                */
               if(isCurrZoneValue)
                  currentZoneAccess.set('Доступ',constCurrentName.access);
               else
                  currentZoneAccess.set('Доступ',accessValue.access);
            }
         }
      }
   }
}
function closePanel(div_obj, control){
   div_obj.removeClass( 'pressed' );
   control.hide();
   control.getTopParent().getContainer().unbind('container-clicked');
   control.getTopParent().getChildControlByName( 'zones' ).reload();
};

/*
 Организуем поиск подстроки, если включен mode, то удаляем ее если нашли
 Иначе просто возвращаем ответ о ее существовании
 */
function findCurrentZone(record, access, currentRole, mode){
   var levelAccess = record.get(access), // уровень доступа
      arrayLevelAccess = record.get(access).split(','),
      isFindeCurrentRole = Array.indexOf(arrayLevelAccess, currentRole);
   if(!mode){
      // ответ, есть в этом УД текущая роль.
      return isFindeCurrentRole === -1 ? false : true;
   } else {
      if(isFindeCurrentRole > -1) {
         arrayLevelAccess.splice(isFindeCurrentRole, 1);
         record.set(access,arrayLevelAccess.toString());
      }
   }
}

function searchZoneInBlackList(nameZone){
   // Наличие ЗД в черном списке.
   return Array.indexOf(blackList, nameZone) < 0 ? false : true;
}

// Определяем приоритет УД
function findPowerAccess(returnAccess){
   var valuePower = 0;
   switch (returnAccess){
      case '+--': valuePower = 1; break
      case '-+-': valuePower = 2; break
      case '--+': valuePower = 3; break
      default : returnAccess = '+--'; valuePower = 1;
   }
   return valuePower;
}

/*
 Иногда существует момент, когда у ЗД фактически Уд изменен, а графический ключ get('Доступ')
 еще не расчитан, данным функционалом мы проводим досрочный перерасчет. Мы пробегаем по всем УД, ием текущую роль (как признак выбора)
 Если ее нет, значит ЗД обладает +-- (запрещено).
 */
function realVisualAccet(rec, recordSet, current_role) {
   if (rec) {
      for (var j = 0; j < 3; j++) {
         var constCurrentName = constNameAccess[j],
            isCurrZoneValue = findCurrentZone(rec, constCurrentName.value, current_role, false);

         if (isCurrZoneValue) {
            rec.set('Доступ', constCurrentName.access);
            return true;
         }
      }
      var parentKey = rec.getParentKey();
      if(parentKey) {
         var recParent = recordSet.getRecordByPrimaryKey(parentKey);
         // Сделаем перерасчет доступа для предка. Так как он может быть не верным.
         realVisualAccet(recParent, recordSet, current_role);
         rec.set('Доступ', recParent.get('Доступ'));
         return false;
      } else {
         rec.set('Доступ','+--');
      }

   }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function unity_id( ids1, ids2 ){
   if( !ids1 )
      return ids2;
   else if( !ids2 )
      return '';
   else {
      var array = ids2.split( ',' ),
         temp = "";
      for( var i in array ){
         if( array.hasOwnProperty( i ) && array[i] && ids1.indexOf( array[i] ) == -1 )
            temp += "," + array[i];
      }
      return ids1 + temp;
   }
}

function new_unity_id(ids1, ids2, conf, isFovarite, changeUser) {
   var s1 = getIdS(ids1, conf),
      s2 = getIdS(ids2, conf),
      tempVar;

   if(conf.value) {
      if(ids2.length > 0) {
         tempVar = ids2.length != 0 ? ',' : '';
         return id_curr_role + tempVar + ids2;
      } else {
         return ids1;
      }
   }
   // если у нас в s2 что-то есть, то делаем запятую.
   tempVar = s2.str.length != 0 ? ',' : '';

   if(s1.length === 0) {
      if(s2.length !== 0){
         if(!isFovarite) {
            /*
             Если мы попалю сюда и мы явно назначены, то не нужно сливать s2 c текущей ролью, просто отдаем s2.
             так как уже выброна другая зона доступа.
             Иначе берем текущую роль + s2 и формируем. Тем самым назначаяэту роль себе по наследованию.
             */
            if(changeUser)
               return s2.str;
            else
               return id_curr_role + tempVar + s2.str;
         } else {
            return s2.str;
         }
      } else
      return '';
   } else {
      if(s1.length >= 2){
         var currentRoleInS1 = Array.indexOf(s1.array,id_curr_role);
         if(isFovarite && !changeUser){
            // поиск и удаление текущей, суммируем без текущей и добавление s2
            if(currentRoleInS1 !== -1)
               s1.array.splice(currentRoleInS1,1);
            return s1.array.toString() + tempVar + s2.str;
         } else {
            if(s2.length === 0){
               /*
                  Проверяем, если мы находимся в режиме добавления роли для насследования, то должны избавиться
                  от 'Пользователь системы' в зонах доступа.
               */
               if(conf.mode) {
                  if(s1.array.toString() === 'Пользователь системы')
                     return '';
                  else
                     return s1.str;
               }
               else {
                  // если мы не в режиме обавления, то производим поиск и удаление текущей роли.
                  if(currentRoleInS1 !== -1)
                     s1.array.splice(currentRoleInS1,1);
                  return s1.array.toString();
               }
      } else
               return s1.str + tempVar + s2.str;
         }
      } else {
         if(s2.length !== 0){
            return s1.str + tempVar + s2.str;
         } else
            if((s1.str === id_curr_role) && !changeUser)
            return '';
            else
               return s1.str;
      }
   }
}

function getIdS(str, conf) {
   if(str.length === 0 )
      return {
         length : 0,
         str : '',
         array : []
      };

   var massId = str.split( ','),
      index = Array.indexOf(massId,'Пользователь системы');

   if(conf && conf.mode){
      if(index !== -1) {
         massId.splice(index,1);
      }
   }

   var result = {
      length : 0,
      str : '',
      array : massId
   };
   for(var i = 0, length = massId.length; i < length; i++) {
      result.str += massId[i];
      if(i + 1 < length)
         result.str += ',';
      result.length++;
   }
   return result;
}

function getFlagArray( ids ){
   var array = new Object(),
      temp = ids.split(';' ),
      name, value;
   for( var i = 0, count = temp.length; i < count; i++ ){
      if( temp[i] ){
         name = temp[i].match( /.+(?=:)/ ) + '';
         value = temp[i].match( /:.*/ ).join().replace( ":", '' );
         array[name] = value;
      }
   }

   return array;
}

function unity_flags( ids1, ids2 ){
   if( !ids1 )
      return ids2;
   else if( !ids2 )
      return ids1;
   else {
      var array1 = getFlagArray( ids1 ),
         array2 = getFlagArray( ids2 ),
         temp = [];
      for( var i in array2 ){
         if( array1.hasOwnProperty( i ) || array1[i] ){
            temp = array2[i].split( ',' );
            for( var j in temp ) {
               if( temp.hasOwnProperty( j ) && temp[j] && array1[i].indexOf( temp[j] ) == -1 ){
                  array1[i] += ( array1[i].length === 0 ? "" : "," ) + temp[j];
               }
            }
         } else
            array1[i] = array2[i];
      }
      // Теперь склеим все
      var str = '';
      for( var k in array1 )
         str += k + ":" + array1[k] + ";";
      return str;
   }
}

function AppendSystemUser( recordset ){
   var new_rec = new $ws.proto.Record( {
      colDef : {
         '@Роль': { type : "Идентификатор", title: "@Роль", index: 0 },
         'Название': { type : "Текст", title: "Название", index: 1 },
         "Примечание" : { type : "Текст", title: "Примечание", index: 2 }
      },
      row : ["0,Пользователь системы", "Пользователь системы", "Служебная роль"],
      pkValue : "0,Пользователь системы",
      parentRecordSet : recordset
   });
   recordset.insertAfter( "null", new_rec );
}

function scopeToText( scope ){
   switch( scope )
   {
      case 'ОбластьВидимости.ДокументыМоегоОфиса':
         return 'По подразделению';
      case 'ОбластьВидимости.НашиОрганизации':
         return 'По организации';
      case 'ОбластьВидимости.НазначениеРолейНеБольшеСвоих':
         return 'Роли не больше своих';
      default:
         return scope;
   }
}

function createFlags( record, current_role, flags_control, control){
   var vision_area = record.get( 'ОбластиВидимости' );
   if( vision_area ){
      var flags_array = vision_area.match( /(.*?);/g ),
         evidently = record.get( 'ЯвноНазначена' ),
         flags = new Object(),
         flag_array = [],
         flag;
      // Ищем все флаги, где есть текущая роль, и в них проставим флаги
      for( var i = 0, count = flags_array.length; i < count; i++ ){
         flag_array = flags_array[i].match( /(.*):(.*);/ );
         flag = new Object();
         flag[ 'Имя' ] = flag_array[1];
         flag[ 'Текст' ] = scopeToText( flag_array[1] );
         flag[ 'Значение' ] = evidently ? ( ( flag_array[2].indexOf( current_role ) != -1 ) ? true : false ) : (!!flag_array[2]);
         flags[i] = flag;
      }

      var heightList = (count === 1) ? 50 : 35 * count;
      control.setSize ({height : heightList});
      flags_control.appendFlags( flags, true );
   }
}

function setCurrentRoleInZoneScopeRecursive( record_set, key, current_role, is_added, is_first ){
   var childs, i, count, rec, zone_scope;
   if( record_set.contains( key ) )
      rec = record_set.getRecordByPrimaryKey( key );

   // Явно назначеные пропускаем
   if( rec ){
      if( !is_first && rec.get( "ЯвноНазначена" ) )
         return;
      zone_scope = rec.get( 'ОбластиВидимости' );
      if( zone_scope ){

         var keyName = rec.getComplexKey().objName,
            multiMap = $ws.single.GlobalContext.getValue( "multiMap"),
            nameCategory = multiMap[keyName]; // список рекордов имеющих одно имя

         for(var i = 0, length = nameCategory.length; i < length; i++) {
            var recordCategory = record_set.getRecordByPrimaryKey(nameCategory[i]);

            if (is_added) {
               // Надо пройтись по всем непустым флагам, и добавить значение
               var temp = zone_scope.replace(new RegExp(current_role + ',?|,?' + current_role, 'g'), '"_"');
               temp = temp.replace(new RegExp(';', 'g'), ',' + current_role + ';');
               temp = temp.replace(new RegExp('"_",?|,?"_"', 'g'), '');
               recordCategory.set('ОбластиВидимости', temp.replace(new RegExp(':,' + current_role + ';', 'g'), ':;')); // Вернем пустые значения
            } else
               recordCategory.set('ОбластиВидимости', zone_scope.replace(new RegExp(current_role + ',?|,?' + current_role, 'g'), ''));
         }
      }
   }

   if( ( key === "null" || key === null ) || ( rec && rec.get( "Раздел@" ) ) ) {
      childs = record_set.recordChilds( key );
      for( i = 0, count = childs.length; i < count; i++ )
         setCurrentRoleInZoneScopeRecursive( record_set, childs[i], current_role, is_added, false );
   }
}

function setCurrentRoleInZoneScope( context, is_added ) {
   var record = context.getValue( 'currentRecord' );
   // Уходим вниз и делаем все тоже самое для неявно назначеных
   setCurrentRoleInZoneScopeRecursive( record.getRecordSet(), record.getKey(), context.getValue( 'currentRole' ), is_added, true )
}

function setCurrentRoleInOneZoneScopeRecursive( record_set, key, name, current_role, is_added, is_first ){
   var childs, i, count, rec, zone_scope;
   if( record_set.contains( key ) )
      rec = record_set.getRecordByPrimaryKey( key );

   // Явно назначеные пропускаем
   if( rec ){
      if( !is_first && rec.get( "ЯвноНазначена" ) )
         return;
      zone_scope = rec.get( 'ОбластиВидимости' );
      if( zone_scope ){

         var keyName = rec.getKey(),
            multiMap = $ws.single.GlobalContext.getValue( "multiMap"),
            nameCategory = multiMap[keyName.split(',')[1]]; // список рекордов имеющих одно имя

         for(var i = 0, length = nameCategory.length; i < length; i++){
            var recordCategory = record_set.getRecordByPrimaryKey(nameCategory[i]);

            recordCategory.set( "ЯвноНазначена", true );
            if(is_added){
               recordCategory.set( 'ОбластиВидимости', zone_scope.replace( new RegExp( '(' + name + ':.*?);', '' ), '$1' + ( zone_scope.match( new RegExp( name+ ':(.+?);', '' ) ) ? ',' : '' ) + current_role + ';' ) );
            } else {
               var match = zone_scope.match( new RegExp( '(' + name + ':.*?' + current_role + ',?)', 'g' ) );
               if( match )
               {
                  var temp = match.join();
                  recordCategory.set( 'ОбластиВидимости', zone_scope.replace( temp, temp.replace( new RegExp( current_role + ',?|,?' + current_role, 'g' ), '' ) ) );
               }
            }
         }
      }
   }

   if( ( key === "null" || key === null ) || ( rec && rec.get( "Раздел@" ) ) ) {
      childs = record_set.recordChilds( key );
      for( i = 0, count = childs.length; i < count; i++ )
         setCurrentRoleInOneZoneScopeRecursive( record_set, childs[i], name, current_role, is_added, false );
   }
}

function setCurrentRoleInOneZoneScope( context, self, name, is_added ) {
   var current_role = context.getValue( 'currentRole' ),
      record = context.getValue( 'currentRecord' );

   setCurrentRoleInOneZoneScopeRecursive( record.getRecordSet(), record.getKey(), name, current_role, is_added, true );
   context.getValue( 'div_obj' ).find( '.accessControlSpan' ).text( calcZoneScope( record, current_role ).text );
}

function calcZoneScope( record, current_role ){
   var zone_scope = record.get( 'ОбластиВидимости' ),
      evidently = record.get( 'ЯвноНазначена' ),
      depend_on_write = record.get( "НаследуетЗаписьОт" ),
      depend_on_read  = record.get( "НаследуетЧтениеОт" ),
      depend_on_inhibit  = record.get( "НаследуетЗапретОт" ),
      record_set = record.getRecordSet(),
      key = record.get( 'Раздел' ),
      full_name = '', color = "black";
   if( zone_scope ){
      // Надо замержить с записью выше по дереву, если она не явно назначена и эта не явно назначена
      if( record_set.contains( key ) && !evidently ){
         var zs = getParentField( record_set, key, 'ОбластиВидимости' );
         zone_scope = (!zs) ? unity_flags( zone_scope, record_set.getRecordByPrimaryKey( key ).get( "ОбластиВидимости" ) ) : zs;
         record.set( "ОбластиВидимости", zone_scope );
		 record.commit();
      }
      var zone_array = zone_scope.match( /(.*?);/g ),
         temp = [],
         name = '';
      for( var i = 0, count = zone_array.length; i < count; i++ ){
         temp = zone_array[i].match( /.*:(?!;)/ );
         if( temp ){
            name = temp[0].replace( ':', '' );
            if( evidently && zone_array[i].indexOf( current_role ) == -1 )
               continue;
            caption = scopeToText( name );
            full_name += caption ? ( full_name ? ', ' + caption : caption ) : '';
         }
      }
   }
   if( !evidently ){
      var is_find = true;
      if( !!depend_on_write || !!depend_on_read || !!depend_on_inhibit )
         is_find = getParentField( record_set, key, 'ЯвноНазначена' );
   }

   if( !full_name )
      full_name = "";

   return { "text": full_name, "color": color };
}

function calcZoneScopeLite( record ){
   var zone_scope = record.get( 'ОбластиВидимости'),
      full_name = '';
   if( zone_scope ){
      var zone_array = zone_scope.match( /(.*?);/g ),
         temp = [],
         name = '';
      for( var i = 0, count = zone_array.length; i < count; i++ ){
         temp = zone_array[i].match( /.*:(?=;)/ );
         if( temp ){
            name = temp[0].replace( ':', '' );
            caption = scopeToText( name );
            full_name += caption ? ( full_name ? ', ' + caption : caption ) : '';
         }
      }
   }
   return full_name;
}

function recalcValue( self, context, values ){
   var current_role = context.getValue( 'currentRole' ),
      record = context.getValue( 'currentRecord' ),
      zone_scope = record.get( 'ОбластиВидимости' ),
      zone_array = zone_scope.match( /(.*?);/g ),
      temp = [],
      name = '';
   for( var i = 0, count = zone_array.length; i < count; i++ ){
      temp = zone_array[i].match( /.*:(?!;)/ );
      if( temp ){
         name = temp[0].replace( ':', '' );
         values.set( name, ( zone_array[i].indexOf( current_role ) != -1 ) );
      }
   }

   self.getContainer().removeClass( 'part' );

   return values;
}

// Меняет права на себя и наследников. Не трогает тех, кто явно назначен
function deleteIdFromZoneScopeRecursive( record_set, key, current_role ) {
   var childs, i, count, rec;
   if( key !== "null" && key !== null ) {
      rec = record_set.getRecordByPrimaryKey( key );
      rec.set( 'ОбластиВидимости', rec.get("ОбластиВидимости").replace( new RegExp( current_role + ',?|,?' + current_role, 'g' ), '' ) );
   }

   if( key === "null" || key === null || rec.get( "Раздел@" ) ) {
      childs = record_set.recordChilds( key );
      for( i = 0, count = childs.length; i < count; i++ )
         deleteIdFromZoneScopeRecursive( record_set, childs[i], current_role );
   }
}

function changeFlags( context, record, self){
   var name = record.get( "Название" ),
      obviouslySet = ( name === 'По умолчанию' ) ? false : true;

   blackList = [];
   listParentAccet = [];

//   context.getValue( 'currentRecord' ).set( "ЯвноНазначена", obviouslySet );
   setCurrentRoleInZoneScope( context, obviouslySet );

   if( name === 'По умолчанию' )
      changeAccess( context, false, [ 'НаследуетЗаписьОт', 'НаследуетЧтениеОт', 'НаследуетЗапретОт' ], obviouslySet ); // Надо удалить везде себя
   else if( name === 'Запрещено' ) {
      changeAccess( context, true, [ 'НаследуетЗапретОт' ], obviouslySet );
      changeAccess( context, false, [ 'НаследуетЗаписьОт', 'НаследуетЧтениеОт' ], obviouslySet ); // Надо удалить текущую роль из себя и наследников
   } else if( name === 'Просмотр' ){
      changeAccess( context, true, [ 'НаследуетЧтениеОт' ], obviouslySet );
      changeAccess( context, false, [ 'НаследуетЗаписьОт', 'НаследуетЗапретОт' ], obviouslySet );
   } else if( name === 'Изменение' ){
      changeAccess( context, true, [ 'НаследуетЗаписьОт' ], obviouslySet );
      changeAccess( context, false, [ 'НаследуетЗапретОт', 'НаследуетЧтениеОт' ], obviouslySet );
   }

   //TODO: Добавляем проверку на несколько одинаковых Зон Доступа.
   if(self.getTopParent().hasChildControlByName('Флаг1'))
      if(!self.getTopParent().getChildControlByName('Флаг1').getValue())
         stepMultiMap(self);
}

function changeSelection( browser, record ) {
   var
      id = record.getKey(),
      sel = browser.getSelection(true);
   for(var i in sel){
      if(sel[i].getKey() === id) {
         browser.clearSelection([id]);
         return false;
      }
   }
   browser.setSelection([id]);
   return true;
}
//TODO://ищем и показываем только явно назначеные.
var recordSetValueOld = undefined,
   recordSetValueNew = undefined,
   changeCheckBoxEnadle = false,
   isSystemRole = undefined,
   isTimeOut = undefined,
   idActiveRow = undefined,
   isEnterPressed = false,
   isLoadDialog = undefined,
   activSelectRow = undefined,
   onSuccess = false,
   isService = '/admin',
   userClass = '__сбис__администратор',
   idClass = undefined,
   id_curr_role = undefined,
   isOldService = '/admin',
   isAdminService = undefined,
   isFirstLoad = false,

// объект для работы с массивом имен на удаление
   storageNameStar = {
      addName : function(name) { // добавление
         this.listName.push(name);
      },
      deleteName : function(name) {
         var indexName = this.listName.indexOf(name);
         if(indexName >= 0) {
            this.listName[indexName] = null; // Поиск и удаление
         }
      },
      listName : [] // хранилище
   };

function saveRecordSet(zones, mode) { // Сохраняет текущий полный рекорд сет таблички
   if(!mode) {
      var record = zones.getRecordSet();
      recordSetValueOld = new $ws.proto.RecordSetStatic({
         defaultColumns: $ws.core.merge([], record.getColumns()),
         records: $ws.core.merge([], record.getRecords())
      });
      recordSetValueOld.setHierarchyField('Раздел');

      recordSetValueNew = new $ws.proto.RecordSetStatic({ // Этот рекордсет будет изменяться и содержать только явно назначеные права
         defaultColumns: $ws.core.merge([], record.getColumns()),
         records: $ws.core.merge([], record.getRecords())
      });
      recordSetValueNew.setHierarchyField('Раздел');
   }
}
// поиск не явно назначенных
function searchStar(self, mode) {
   var selfTopParent = self.getTopParent().getChildControlByName('zones'),
      record_set = selfTopParent.getRecordSet(),
      context = self.getLinkedContext(),
      current_role = context.getValue( '@Роль' ),
      is_system_role = context.getValue('Системная' ),
      browser = context.getValue( 'browser' ),
      child_rs = context.getValue('Наследники' );

   if(mode) {
      record_set = new $ws.proto.RecordSetStatic({
         defaultColumns: recordSetValueOld.getColumns(),
         records: recordSetValueOld.getRecords()
      });
   }

   saveRecordSet(selfTopParent, mode); // сохронили рекордсеты
   storageNameStar.listName = [];
   for(var i = 0, length = recordSetValueNew.getRecords().length; i < length; i++) {
      var record_id = record_set.at(i);

      if(!record_id) {
         continue;
      }
      var item = calcAccess(record_set, child_rs, record_id, current_role, is_system_role, browser);
      if(item.appointed) {
         storageNameStar.addName(record_id.get("Имя"));
      } else {
         searchFather(record_id);
      }
   }
}

function searchRowActiveId(isRoleFocus, recordSetRole) {
   if(activSelectRow){
      var str = activSelectRow.split(',')[1],
         row,
         activeRow = isRoleFocus.getActiveRow().attr('rowkey').split(',')[1],
         nameNewRole = isRoleFocus.getLinkedContext().getValue( 'nameNewRole');
      /*
      Проверяем, если в контексте реестра ролей, в полле nameNewRole есть id роли, значит этот новая роль
      и нам на нее надо установить курсор. Забираем id роли себе и освобождаем контекст.
       */
      if(nameNewRole){
         str = nameNewRole;
         isRoleFocus.getLinkedContext().setValue('nameNewRole', false);
      }
      /*
       Если у нас новыя роль, нам надо не только поставить курсор но и крикнуть в шину событиий
       парамерт onSuccess помогает:
       Если он true - кричим собитие clickRow
       Если false - устанавливаем курсор и не сигналим событие в шину.
       */
      if((str !== activeRow) && !nameNewRole ) {
         onSuccess = true;
      }
      /*
      пробегаем по всем рекордам ищем роль на которую надо выставить курсор.
       */
      for(var i = 0, length = recordSetRole.getRecordCount(); i < length; i++){
         if(recordSetRole.at(i).get('@Роль').split(",")[1] === str) {
            activSelectRow = recordSetRole.at(i).get('@Роль');
            row = isRoleFocus.getContainer().find('[rowkey="'+activSelectRow+'"]');
            isRoleFocus.setActiveRow(row);
            break;
         }
      }
   }
}
/*
 Если рекорд явно назначен.
 У рекорда ищем предка, и смотрим в черном списке он или нет storageNameStar.listName
 если да,то удаляем, и так далее рекурсия.
 */

var index = 0;
function searchFather(record) {
   if(record.get('Раздел')) {
      var recordFather = recordSetValueNew.getRecordByPrimaryKey(record.get('Раздел'));
      storageNameStar.deleteName(recordFather.get('Имя'));
      searchFather(recordFather);
   }
   return;
}