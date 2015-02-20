import sbis
import random

class DBCarousel :
   db_ids = [ ]
   db_ids_idx = 0
   db_ids_len = 0
   query_counts = 0
   N = 10 # после N запросов меняется БД, в которую пишутся запросы

   def __init__( self ) :
      import json

      db_config = json.loads( sbis.ConfigGet( 'Databases' ) )
      for db_id in db_config :
         DBCarousel.db_ids.append( db_id )

      DBCarousel.db_ids_len = len( DBCarousel.db_ids )
      DBCarousel.db_ids_idx = int( random.random() * DBCarousel.db_ids_len )
      sbis.SelectCurrentDB( DBCarousel.db_ids[ DBCarousel.db_ids_idx ] )

   @staticmethod
   def getCurrentDBID() :
      return DBCarousel.db_ids_idx

   @staticmethod
   def set_ID_Current_DB( db_id ):
      sbis.SelectCurrentDB( DBCarousel.db_ids[ db_id ] )
      DBCarousel.db_ids_idx = db_id

   @staticmethod
   def connectNext():
      if DBCarousel.query_counts < DBCarousel.N:
         DBCarousel.query_counts += 1
      else:
         DBCarousel.query_counts = 0
         new_db_ids_idx = int( random.random() * DBCarousel.db_ids_len )
         if new_db_ids_idx == DBCarousel.db_ids_idx:
            DBCarousel.db_ids_idx = ( DBCarousel.db_ids_idx + 1 ) % DBCarousel.db_ids_len
         else:
            DBCarousel.db_ids_idx = new_db_ids_idx
         sbis.SelectCurrentDB( DBCarousel.db_ids[ DBCarousel.db_ids_idx ] )



class HistoryHelper:
   cacheStorage = dict()
###########################################################################################################################

   @staticmethod
   def get_Context( ctx_user, ctx_subj, ctx_ip, ctx_inner_ip, db_id ) :
      ctx_subj_id = None
      ctx_subj_site = None

      if ctx_subj :
         ctx_subj_ = ctx_subj.split( '#' )
         ctx_subj_id = int( ctx_subj_[ 0 ] )
         ctx_subj_site = ctx_subj_[ 1 ]

      ctxStorageKey = 'ctx_' + str( db_id ) + '_' + str( ctx_user ) + '_' + str( ctx_subj_id ) + '_' + str( ctx_subj_site ) + '_' + str( ctx_ip ) + '_' + str( ctx_inner_ip )

      if ctxStorageKey in HistoryHelper.cacheStorage:
         return HistoryHelper.cacheStorage[ ctxStorageKey ]

      ctx = sbis.SqlQueryScalar( """
                                    SELECT   "@КонтекстИсполнения"

                                    FROM
                                             "КонтекстИсполнения"
                                    WHERE
                                             "Пользователь" IS NOT DISTINCT FROM $1 AND
                                             "IP" IS NOT DISTINCT FROM $2 AND
                                             "IPВнутренний" IS NOT DISTINCT FROM $3 AND
                                             "СубъектИд" IS NOT DISTINCT FROM $4 AND
                                             "СубъектСайтХост" IS NOT DISTINCT FROM $5
                                             LIMIT 1 """, ctx_user, ctx_ip, ctx_inner_ip, ctx_subj_id, ctx_subj_site )

      if not ctx :
         try :
            ctx = sbis.SqlQueryScalar( """
                                          INSERT INTO
                                             "КонтекстИсполнения" ( "Пользователь", "СубъектИд", "СубъектСайтХост", "IP", "IPВнутренний" )
                                          VALUES ( $1, $2, $3, $4, $5 ) RETURNING "@КонтекстИсполнения"
                                       """, ctx_user, ctx_subj_id, ctx_subj_site, ctx_ip, ctx_inner_ip )
         except Exception:
            ctx = sbis.SqlQueryScalar( """
                                          SELECT   "@КонтекстИсполнения"

                                          FROM
                                                   "КонтекстИсполнения"
                                          WHERE
                                                   "Пользователь" IS NOT DISTINCT FROM $1 AND
                                                   "IP" IS NOT DISTINCT FROM $2 AND
                                                   "IPВнутренний" IS NOT DISTINCT FROM $3 AND
                                                   "СубъектИд" IS NOT DISTINCT FROM $4 AND
                                                   "СубъектСайтХост" IS NOT DISTINCT FROM $5
                                                   LIMIT 1 """, ctx_user, ctx_ip, ctx_inner_ip, ctx_subj_id, ctx_subj_site )

      HistoryHelper.cacheStorage[ ctxStorageKey ] = ctx
      return ctx
###########################################################################################################################

   @staticmethod
   def get_Attribute_ID( attr, object, read_only, db_id ):
      if attr is None:
         return None

      key = 'attr_' + str( db_id ) + '_' + attr + '_' + str( object )
      if key in HistoryHelper.cacheStorage:
         return HistoryHelper.cacheStorage[ key ]

      _id = sbis.SqlQueryScalar( """
                                    SELECT   "@ИсторияАтрибутОбъекта"

                                    FROM
                                             "ИсторияАтрибутОбъекта"
                                    WHERE
                                             "Атрибут" = $1 AND
                                             "Объект" = $2 """, attr, object )

      if not _id and not read_only:
         try :
            _id = sbis.SqlQueryScalar( """
                     INSERT INTO
                       "ИсторияАтрибутОбъекта" ( "Атрибут", "Объект" )
                     VALUES( $1, $2 ) RETURNING "@ИсторияАтрибутОбъекта"
                      """, attr, object )

         except Exception:
            _id = sbis.SqlQueryScalar( """
                     SELECT   "@ИсторияАтрибутОбъекта"

                     FROM
                              "ИсторияАтрибутОбъекта"
                     WHERE
                              "Атрибут" = $1 AND
                              "Объект" = $2 """, attr, object )
      if _id:
         HistoryHelper.cacheStorage[ key ] = _id
      return _id

###########################################################################################################################

   @staticmethod
   def write_Instance_Name( new_instance_name, instance_id, db_id ):
      if instance_id is None:
         return None

      key = 'inst-name_' + str( db_id ) + '_' + str( instance_id )
      if key in HistoryHelper.cacheStorage:
         current_name = HistoryHelper.cacheStorage[ key ]

      else:
         current_name = sbis.SqlQueryScalar( """
                  SELECT     "Название"

                  FROM       "ИсторияЭкземплярОбъекта"

                  WHERE      "@ИсторияЭкземплярОбъекта" = $1 """, instance_id )


      if not current_name or current_name != new_instance_name:
         name = sbis.SqlQueryScalar( """UPDATE    "ИсторияЭкземплярОбъекта"

                           SET       "Название" = $1

                           WHERE     "@ИсторияЭкземплярОбъекта" = $2

                           RETURNING "Название" """, new_instance_name, instance_id )

      if name:
         HistoryHelper.cacheStorage[ key ] = name

###########################################################################################################################

   @staticmethod
   def get_Inst_Obj_ID( obj_id, object, client, read_only, db_id ):
      if obj_id is None:
         return None

      key = 'inst-obj_' + str( db_id ) + '_' + str( obj_id ) + '_' + str( object )
      if key in HistoryHelper.cacheStorage:
         return HistoryHelper.cacheStorage[ key ]

      _id = sbis.SqlQueryScalar( """
               SELECT
                 "@ИсторияЭкземплярОбъекта"
               FROM
                 "ИсторияЭкземплярОбъекта"
               WHERE
                 "Объект" = $1 AND
                 "ИдО" = $2 AND
                 "Клиент" = $3 """, object, obj_id, client )

      if not _id and not read_only:
         try :
            _id = sbis.SqlQueryScalar( """
                     INSERT INTO
                       "ИсторияЭкземплярОбъекта" ( "Объект", "ИдО", "Клиент" )
                     VALUES( $1, $2, $3 ) RETURNING "@ИсторияЭкземплярОбъекта"
                      """, object, obj_id, client )

         except Exception:
            _id = sbis.SqlQueryScalar( """
                     SELECT
                       "@ИсторияЭкземплярОбъекта"
                     FROM
                       "ИсторияЭкземплярОбъекта"
                     WHERE
                       "Объект" = $1 AND
                       "ИдО" = $2 AND
                       "Клиент" = $3 """, object, obj_id, client )
      if _id:
         HistoryHelper.cacheStorage[ key ] = _id

      return _id

###########################################################################################################################

   @staticmethod
   def get_Name_By_ID( table, field, id, prefix_cache, db_id ):

      key = prefix_cache + str( db_id ) + '_' + str( id )
      if key in HistoryHelper.cacheStorage:
         return HistoryHelper.cacheStorage[ key ]

      try:
         _name = sbis.SqlQueryScalar( """
                     SELECT
                        "{field}"
                     FROM
                        "{table}"
                     WHERE
                        "@{table}" = {id}
                     """.format( field = field, table = table, id = id ) )
      except Exception:
         return 'Не определено'

      if _name:
         HistoryHelper.cacheStorage[ key ] = _name
         return _name
      return 'Имя отсутствует'

###########################################################################################################################

   @staticmethod
   def get_ID_For_Table( table, field, value, prefix_cache, read_only, db_id ):
      if value is None:
         return None

      key = prefix_cache + str( db_id ) + '_' + value
      if key in HistoryHelper.cacheStorage:
         return HistoryHelper.cacheStorage[ key ]

      _id = sbis.SqlQueryScalar( """
               SELECT
                 "@{0}"
               FROM
                 "{0}"
               WHERE
                 "{1}" = $1
               """.format( table, field ), value )

      if not _id and not read_only:
         try :
            _id = sbis.SqlQueryScalar( """
                     INSERT INTO
                       "{0}" ( "{1}" )
                     VALUES( $1 ) RETURNING "@{0}"
                      """.format( table, field ), value )

         except Exception:
            _id = sbis.SqlQueryScalar( """
                     SELECT
                       "@{0}"
                     FROM
                       "{0}"
                     WHERE
                       "{1}" = $1
                     """.format( table, field ), value )

      if _id:
         HistoryHelper.cacheStorage[ key ] = _id

      return _id

###########################################################################################################################

   @staticmethod
   def get_Current_Attribute_Val( attr_id, inst_obj, db_id ):
      key = 'current-val-attr_' + str( db_id ) + '_' + str( attr_id ) + '_' + str( inst_obj )
      if key in HistoryHelper.cacheStorage:
         return HistoryHelper.cacheStorage[ key ]

      resRS = sbis.SqlQuery( """
               SELECT                              "Значение" AS value,
                            "@ИсторияТекущееЗначениеАтрибута" AS current

               FROM         "ИсторияТекущееЗначениеАтрибута"

               WHERE        "АтрибутОбъекта" = $1 AND
                            "ЭкземплярОбъекта" = $2 LIMIT 1 """, attr_id, inst_obj )
      if resRS:
         res = resRS[0]
         HistoryHelper.cacheStorage[ key ] = res
         return res
      return None

###########################################################################################################################

   @staticmethod
   def write_Instance_Obj_Attr( inst_obj, event_id, attr_id, attr_val ):
      if event_id:
         sbis.SqlQuery( """
            INSERT INTO  "ИсторияАтрибутЭкземпляраОбъекта" ( "ЭкземплярОбъекта", "Событие", "АтрибутОбъекта", "Значение" )

            VALUES( $1, $2, $3, $4 )

            RETURNING "@ИсторияАтрибутЭкземпляраОбъекта"
             """, inst_obj, event_id, attr_id, attr_val )

###########################################################################################################################

   @staticmethod
   def write_Attr( attr, event_id, object_id, inst_obj ):
      attr_name = attr.Name()
      attr_val = str( attr )

      attr_id = HistoryHelper.get_Attribute_ID( attr_name, object_id, False )

      # проверяем текущее значение атрибута
      currentAttrVal = HistoryHelper.get_Current_Attribute_Val( attr_id, inst_obj )

      if currentAttrVal:
         # если такое значение атрибута уже есть:
         if currentAttrVal.value == attr_val:
            # тогда уходим без создания записи
            return
         # если значение другое - меняем значение и событие, под которым оно было изменено
         elif currentAttrVal.value:
            sbis.SqlQuery( """
               UPDATE
                 "ИсторияТекущееЗначениеАтрибута"
               SET
                 "Значение" = $1,
                 "Событие" = $2
               WHERE
                 "@ИсторияТекущееЗначениеАтрибута" = $3
                """, attr_val, event_id, currentAttrVal.current )

            key = 'current-val-attr_' + str( DBCarousel.getCurrentDBID( ) ) + '_' + str( attr_id ) + '_' + str( inst_obj )
            HistoryHelper.cacheStorage[ key ] = attr_val

            HistoryHelper.write_Instance_Obj_Attr( inst_obj, event_id, attr_id, attr_val )


      else:
         try:
            sbis.SqlQuery( """
               INSERT INTO
                  "ИсторияТекущееЗначениеАтрибута" ( "ЭкземплярОбъекта", "Событие", "АтрибутОбъекта", "Значение" )
               VALUES( $1, $2, $3, $4 ) RETURNING "@ИсторияТекущееЗначениеАтрибута"
                  """, inst_obj, event_id, attr_id, attr_val )

         except Exception:
            sbis.SqlQuery( """UPDATE     "ИсторияТекущееЗначениеАтрибута"

                              SET        "Значение" = $1,
                                         "Событие" = $2

                              WHERE
                                         "@ИсторияТекущееЗначениеАтрибута" = $3
                                        """, attr_val, event_id, currentAttrVal.current )

         HistoryHelper.write_Instance_Obj_Attr( inst_obj, event_id, attr_id, attr_val )

###########################################################################################################################

   @staticmethod
   def WriteHistory( 
         message,
         _object = None,
         _key = None,
         action = None,
         client = None,
         when = None,
         ctx_usr = None,
         ctx_subj = None,
         ctx_ip = None,
         ctx_inner_ip = None,
         site_host = None,
         site_adm = None,
         object_attr = None
      ) :
      if not message :
         raise Exception( 'пустое сообщение истории недопустимо' )

      DBCarousel.connectNext( )

      current_db = DBCarousel.getCurrentDBID( )

      for id_db in range( 0, DBCarousel.db_ids_len ):

         DBCarousel.set_ID_Current_DB( id_db )

         # эти значения нам нужны для работы во всех базах
         object_id = HistoryHelper.get_ID_For_Table( "ИсторияОбъект", "Объект", _object, 'object_', False, id_db )
         inst_obj_id = HistoryHelper.get_Inst_Obj_ID( _key, object_id, client, False, id_db )
         event_id = None

         if current_db == id_db:

            # а эти только в той, куда пишем Событие
            action_id = HistoryHelper.get_ID_For_Table( "ИсторияДействие", "Действие", action, 'action_', False, id_db )
            ctx_id = HistoryHelper.get_Context( ctx_usr, ctx_subj, ctx_ip, ctx_inner_ip, id_db )
            site_h = HistoryHelper.get_ID_For_Table( "ИсторияСайтХост", "Название", site_host, 'site_host_', False, id_db )
            site_a = HistoryHelper.get_ID_For_Table( "ИсторияСайтАдм", "Название", site_adm, 'site_adm_', False, id_db )
            year_rotation = when.year % 3

            # пишем основную запись истории
            event_id = sbis.SqlQueryScalar( """
                     INSERT INTO     "ИсторияСобытие.$y{table_n}"
                              ( "Действие",
                                "Сообщение",
                                "КонтекстИсполнения",
                                "Когда",
                                "СайтХост",
                                "СайтАдм",
                                "ЭкземплярОбъекта",
                                "РотацияГода",
                                "ИдентификаторОбъекта",
                                "Клиент" )

                     VALUES( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )

                     RETURNING  "@ИсторияСобытие"
                        """.format( table_n = year_rotation ), action_id, message, ctx_id, when, site_h, site_a, inst_obj_id, year_rotation, object_id, client )

            if event_id is None:
               raise Exception( 'Сообщение истории не записано' )

         if object_attr:
            # записываем атрибуты
            for attr in object_attr:
               if attr.Name() == 'ИмяОбъекта':
                  HistoryHelper.write_Instance_Name( str( attr ), inst_obj_id, id_db )
               else:
                  HistoryHelper.write_Attr( attr, event_id, object_id, inst_obj_id )

      DBCarousel.set_ID_Current_DB( current_db )













