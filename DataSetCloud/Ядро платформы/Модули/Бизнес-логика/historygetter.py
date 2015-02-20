from sbis import *
import re


class HistoryGetter :
   #####################################################################################################################
   #Класс обрабатывает входящий фильтр поиска для конкретной таблицы
   #type - slave, master
   #####################################################################################################################
   class SqlConditionHelper :
      def __init__( self, table, table_type ) :
         self.__private_table = table
         self.__private_table_type = table_type

      def __call__( self, match ) :
         return """( HSTORE( {table_type}."ЗаписьСтарая" )->'{column_name}' )::{column_type}""".format(
            table_type = self.__private_table_type,
            column_name = match.group( 2 ),
            column_type = HistoryGetter.get_column_type( self.__private_table, match.group( 2 ) )
         )

   #####################################################################################################################
   #Класс, содержащий описание конкретного объекта истории
   #####################################################################################################################
   class ObjectDescriptor :
      def __init__( self, object_description ) :
         import copy

         element = {
            'Таблица' : '',
            'Связь' : None,
            'УсловиеСвязи' : '',
            'Объект' : '',
            'Дети' : [ ],
            'Родитель' : None
         }

         element_storage = { }
         object_by_table_storage = { }
         root_element_array = [ ]

         for description in object_description :
            handling_element = copy.deepcopy( element )

            if description.Родитель :
               parent = element_storage[ description.Родитель ]
               handling_element[ 'Родитель' ] = parent
               handling_element[ 'Объект' ] = parent[ 'Объект' ]
               parent[ 'Дети' ].append( handling_element )
            else :
               root_element_array.append( handling_element )

            handling_element[ 'Таблица' ] = description.Таблица
            handling_element[ 'Объект' ] = description.Объект or handling_element[ 'Объект' ]
            handling_element[ 'УсловиеСвязи' ] = description.УсловиеСвязи
            handling_element[ 'Связь' ] = description.Связь
            element_storage[ description.Ключ ] = handling_element
            object_by_table_storage[ handling_element[ 'Таблица' ] ] = handling_element[ 'Объект' ]

         self.__private_object_description = object_description
         self.__private_object_by_table_storage = object_by_table_storage
         self.root_element_array = root_element_array

      #####################################################################################################################
      #Возвращает имя объекта истории, который содержит указанную таблицу ( самый вложенный )
      #####################################################################################################################
      def get_object_by_table_name( self, table_name ) :
         return self.__private_object_by_table_storage[
            table_name ] if table_name in self.__private_object_by_table_storage else 'Не определен'

   #####################################################################################################################
   #Класс хранил информацию о текущих ссылках
   #####################################################################################################################
   class LinkHelper :
      def __init__( self, link, from_string = True ) :
         if from_string :
            #Левая.ЛевоеПоле=Правая.ПравоеПоле
            fields = link.split( '=' )  #list: ['Левая.ЛевоеПоле', 'Правая.ПравоеПоле']
            self.link_condition = None
         else :
            fields = link[ 'Связь' ].split( '=' )
            self.link_condition = link[ 'УсловиеСвязи' ]

         self.master = fields[ 0 ].split( '.' )[ 0 ]  #str: Левая
         self.slave = fields[ 1 ].split( '.' )[ 0 ]  #str: Правая
         self.master_fld = fields[ 0 ].split( '.' )[ 1 ]  #str: ЛевоеПоле
         self.slave_fld = fields[ 1 ].split( '.' )[ 1 ]  #str: ПравоеПоле
         self.master_pk_name = HistoryGetter.get_pk_name_by_table_name( self.master )  #name_pk_master = @Левое
         self.slave_pk_name = HistoryGetter.get_pk_name_by_table_name( self.slave )  #name_pk_slave = @Правое

   #шаблонная часть пользовательского метода обработки события
   userConstructingMethodTemplate = 'ПользовательскоеПредставлениеТаблицы'
   #поле класса, хранит информацию о названиях имен первичных ключей таблиц
   mapOfPkNameOfTable = dict( )
   #поле класса, хранит информацию о типах полей по имени поля и названию таблицы
   mapOfColumnType = dict( )
   #поле класса, хранит информацию о наличии таблицы "Пользователь"
   hasUserTable = SqlQueryScalar( """
      SELECT (
         SELECT
            tablename
         FROM
            pg_tables
         WHERE
            tablename = 'Пользователь'
         LIMIT 1
      ) IS NOT NULL"""
   )

   #####################################################################################################################
   #приватный метод. Проверяет наличие определенного фильтра
   #####################################################################################################################
   def __private_test_filter( self, filterName ) :
      return True if self.__private_filter.TestField( filterName ) is not None and \
                     not self.__private_filter[ filterName ].IsNull( ) and \
                     str( self.__private_filter[ filterName ] ).strip( ) != "" \
         else False

   #####################################################################################################################
   #конструктор. Может в качестве параметра принимать фильтр запроса
   #####################################################################################################################
   def __init__( self, methodFilter = None, navigation = None ) :
      self.__private_filter = methodFilter
      self.__private_navi = navigation
      self.__private_navi_result = None
      self.__private_links = None
      self.__private_tables = None
      self.__private_onlyFields = True
      self.__private_onlyChangedRecords = True
      self.__private_onlyChangedFields = True
      self.__private_event_id_array = None
      self.__private_object_id = None
      self.__private_object_descriptor = None
      self.__private_filter_user = None
      self.__private_timeLeft = None
      self.__private_timeRight = None
      self.__private_timeReal = None

      if self.__private_test_filter( 'ВремяОт' ) :
         self.__private_timeLeft = self.__private_filter.ВремяОт

      if self.__private_test_filter( 'ВремяОтсчета' ) :
         self.__private_timeRight = self.__private_filter.ВремяОтсчета
      elif self.__private_test_filter( 'ВремяДо' ) :
         self.__private_timeRight = self.__private_filter.ВремяДо

      if self.__private_test_filter( 'ИдО' ) :
         self.__private_object_id = self.__private_filter.ИдО

      if self.__private_test_filter( 'ИдСобытия' ) :
         self.__private_event_id_array = [ self.__private_filter.ИдСобытия ]

      if self.__private_test_filter( 'ИдСобытияСписок' ) :
         self.__private_event_id_array = self.__private_filter.ИдСобытияСписок

      if self.__private_test_filter( 'Таблицы' ) :
         self.__private_tables = self.__private_filter.Таблицы.split( ';' )

      if self.__private_test_filter( 'Связи' ) :
         self.__private_links = self.__private_filter.Связи.split( ';' )

      if self.__private_test_filter( 'ТолькоНазванияПолей' ) :
         self.__private_onlyFields = self.__private_filter.ТолькоНазванияПолей

      if self.__private_test_filter( 'ТолькоИзмененные' ) :
         self.__private_onlyChangedRecords = self.__private_filter.ТолькоИзмененные

      if self.__private_test_filter( 'ТолькоИзмененныеПоля' ) :
         self.__private_onlyChangedFields = self.__private_filter.ТолькоИзмененныеПоля

      if self.__private_test_filter( 'ОписаниеОбъекта' ) :
         self.__private_object_descriptor = self.ObjectDescriptor( self.__private_filter.ОписаниеОбъекта.Описание )

      if self.__private_test_filter( 'Пользователь' ) :
         self.__private_filter_user = self.__private_filter.Пользователь

   #####################################################################################################################
   #Возвращает тип поля в предствлении PostgreSQL по сбисовому типу поля
   #####################################################################################################################
   @staticmethod
   def get_pg_type_from_sbis_field_type( field_type ) :
      return {
         FieldType.ftBOOLEAN : "boolean",
         FieldType.ftINT8 : "char",
         FieldType.ftINT16 : "smallint",
         FieldType.ftINT32 : "integer",
         FieldType.ftINT64 : "bigint",
         FieldType.ftSTRING : "varchar",
         FieldType.ftTEXT : "text",
         FieldType.ftENUM : "smallint",
         FieldType.ftFLAGS : "boolean[]",
         FieldType.ftFLOAT : "real",
         FieldType.ftDOUBLE : "double precision",
         FieldType.ftDATE : "date",
         FieldType.ftTIME : "time",
         FieldType.ftDATETIME : "timestamp",
         FieldType.ftMONEY : "numeric(32,2)",
         FieldType.ftBINARY : "bytea",
         FieldType.ftBLOB : "integer",
         FieldType.ftUUID : "uuid",
         FieldType.ftLINK_COND_MASTER : "regclass",
         FieldType.ftXML : "xml",
         FieldType.ftARRAY_TEXT : "text[]",
         FieldType.ftARRAY_INT64 : "int8[]",
         FieldType.ftARRAY_INT32 : "int4[]",
         FieldType.ftARRAY_INT16 : "int2[]",
         FieldType.ftARRAY_MONEY : "numeric(32,2)[]",
         FieldType.ftARRAY_UUID : "uuid[]",
         FieldType.ftARRAY_BOOLEAN : "boolean[]",
         FieldType.ftARRAY_FLOAT : "real[]",
         FieldType.ftARRAY_DOUBLE : "double precision[]",
         FieldType.ftARRAY_DATE : "date[]",
         FieldType.ftARRAY_TIME : "time[]",
         FieldType.ftARRAY_DATETIME : "timestamp[]"
      }[ field_type ]


   #####################################################################################################################
   #Возвращает описание в "сыром" виде по пришедшей записи
   #####################################################################################################################
   @staticmethod
   def get_message_by_data( rec, field_name = None, valueGetter = None ) :
      if valueGetter is None :
         valueGetter = lambda value : value
      if not rec.СтароеЗначение :
         return 'Добавил %s \"%s\"' % (
            rec.Поле.lower( ) if field_name is None else field_name, valueGetter( rec.НовоеЗначение ) )
      elif not rec.НовоеЗначение :
         return 'Удалил %s \"%s\"' % (
            rec.Поле.lower( ) if field_name is None else field_name, valueGetter( rec.СтароеЗначение ) )
      else :
         return 'Изменил %s \"%s\" на \"%s\"' % (
            rec.Поле.lower( ) if field_name is None else field_name, valueGetter( rec.СтароеЗначение ),
            valueGetter( rec.НовоеЗначение ) )

   #####################################################################################################################
   #метод возвращает название первичного ключа указанной таблицы. Результат кэшируется
   #####################################################################################################################
   @staticmethod
   def get_pk_name_by_table_name( table ) :
      if table not in HistoryGetter.mapOfPkNameOfTable :
         tbl_format = TableFormat( table )
         size = len( tbl_format )
         i = 0
         pk_field = None
         while i < size :
            field_name = tbl_format[ i ].Name( )
            if field_name[ 0 ] == '@' :
               pk_field = field_name
               break
            i += 1

         if not pk_field :
            pk_field = tbl_format[ 0 ].Name( )

         HistoryGetter.mapOfPkNameOfTable[ table ] = pk_field

      return HistoryGetter.mapOfPkNameOfTable[ table ]

   #####################################################################################################################
   #Возвращает тип поля по названию таблицы и названию поля таблицы
   #####################################################################################################################
   @staticmethod
   def get_column_type( table, column ) :
      key = table + '.' + column
      if key not in HistoryGetter.mapOfColumnType :
         tbl_format = TableFormat( table )
         size = len( tbl_format )
         i = 0
         column_type = None
         while i < size :
            field = tbl_format[ i ]
            if field.Name( ) == column :
               column_type = HistoryGetter.get_pg_type_from_sbis_field_type( field.Type( ) )
               break
            i += 1

         if not column_type :
            raise Error( "Не удалось определить тип поля {column} таблицы {table}".format(
               table = table,
               column = column
            ) )
         else :
            HistoryGetter.mapOfColumnType[ key ] = column_type

      return HistoryGetter.mapOfColumnType[ key ]

   #####################################################################################################################
   #возвращает идентификатор события по указанной таблице и идентификатору записи из таблицы
   #####################################################################################################################
   def __private_get_event_id_rs_by_rec_id_array_of_table( self, rec_id_array, table ) :
      if not rec_id_array :
         return [ ]

      pk_name_of_table = HistoryGetter.get_pk_name_by_table_name( table.replace( '"', '' ) )

      single = len( rec_id_array ) == 1
      array_pk = "any( '{" + ",".join( str( v ) for v in rec_id_array ) + "}' )"
      #filter by pk

      query = """
               SELECT
                  array_agg( "_id" ) as "res"
               FROM
               (
                  SELECT
                  (
                     SELECT
                        T1."@$Изменение"
                     FROM
                        "log.$Изменение" T1
                     WHERE
                        T1."@$Изменение" = T."@$Изменение" AND
                        "ДатаВремя" >= '{time_old}'::timestamp AND
                        "ДатаВремя" <= '{time_new}'::timestamp
                  ) as "_id"
                  FROM
                  (
                     SELECT
                        "@$Изменение"
                     FROM
                        {log_table}
                     WHERE
                        "ЗаписьНовая" = {pk}
                     {subQuerySecond}
                  ) T
               ) T
               WHERE
                  _id IS NOT NULL
               """.format(
         pk = str( rec_id_array[ 0 ] ) if single else array_pk,
         log_table = table.replace( ".\"", ".\"log." ) if table.find( "." ) > 0 else ("\"log." + table + "\""),
         time_old = str( self.__private_timeLeft ),
         time_new = str( self.__private_timeRight ),
         subQuerySecond = """
                     UNION
                     SELECT
                        "@$Изменение"
                     FROM
                        {log_table}
                     WHERE
                        "ЗаписьСтарая"->'{pk_t}' = {pk}
         """.format( 
            pk = "'" + str( rec_id_array[ 0 ] ) + "'" if single else array_pk,
            log_table = table.replace( ".\"", ".\"log." ) if table.find( "." ) > 0 else ("\"log." + table + "\""),
            pk_t = str( pk_name_of_table )
         ) if pk_name_of_table is not None else ""
      )

      return SqlQueryScalar( query )

   #####################################################################################################################
   #возвращает список событий истории по параметрам фильтрации
   #####################################################################################################################
   def get_events( self, table ) :
      changes = SqlQuery( """
         SELECT
            T1.*,
            T2."ЗаписьНовая" as "ИдО"
         FROM
         (
            SELECT
               T."id"  as "id",
               T."ts"  as "Время",
               T."Транзакция",
               {field} as "Поле",
               T."old" as "СтароеЗначение",
               T."new" as "НовоеЗначение",
               '{table}' as "Таблица",
               NULL as "Сообщение",
               NULL as "Действие"
            FROM
               (
                  SELECT
                     "@$Изменение" as "id",
                     "ДатаВремя" as "ts",
                     "Транзакция",
                     (log_diff( "@$Изменение", '{pk_name}' )).*
                  FROM
                     "log.$Изменение"
                  WHERE
                     "@$Изменение" = any( {event_id} )
               ) T
            {condition}
         ) T1
         INNER JOIN
            "log.{table}" T2
         ON
            T1."id" = T2."@$Изменение"
         """.format(
         table = table,
         field = """T."key" """ if self.__private_onlyFields else "'" + table + """.' || T."key" """,
         pk_name = HistoryGetter.get_pk_name_by_table_name( table ),
         event_id = "'{" + ",".join( str( v ) for v in self.__private_event_id_array ) + "}'",
         condition = """WHERE T."old" IS DISTINCT FROM T."new" """ if self.__private_onlyChangedFields else ""
      )
      )

      changes.SortRows( lambda rec_a, rec_b : rec_a.id > rec_b.id )
      return changes

   #####################################################################################################################
   #возвращает список идентификаторов первичных ключей для указанной таблицы по массиву изменений master-таблицы
   #####################################################################################################################
   def __private_get_linked_table_pk_array_by_change_id( self, linkHelper, change_id_array ) :
      change_id_array_str = "'{" + ",".join( str( v ) for v in change_id_array ) + "}'"

      single = len( change_id_array ) == 1
      if single :
         pk = str( change_id_array[ 0 ] )
      else :
         master_column_type = HistoryGetter.get_column_type( linkHelper.master, linkHelper.master_pk_name )
         pk = "any( (" + change_id_array_str + ")::" + master_column_type + "[] )"

      def get_condition( ) :
         condition_with_handled_slave = re.sub( r'(slave.)"([^"]+)"',
                                                self.SqlConditionHelper( linkHelper.slave, "slave" ),
                                                linkHelper.link_condition )
         return re.sub( r'(master.)"([^"]+)"', self.SqlConditionHelper( linkHelper.master, "master" ),
                        condition_with_handled_slave )


      master_pk_field = HistoryGetter.get_pk_name_by_table_name( linkHelper.master )
      table_slave_ids = SqlQueryScalar( """
SELECT
   ARRAY_AGG( DISTINCT "id" )
FROM
(
   (
      SELECT
         DISTINCT slave."{slave_pk_name}" as "id"
      FROM
      (
         SELECT
            *
         FROM
            "{master}"
         WHERE
            "{master_pk_name}" = {pk}
      )  master
      INNER JOIN
         "{slave}" slave
      ON
         slave."{slave_fld}" = master."{master_fld}"
      {additional_condition}
   )
   UNION
   (
      WITH master AS (
         SELECT
             *
         FROM
             "log.{master}"
         WHERE
            ( HSTORE( "ЗаписьСтарая" )->'{master_pk_name}' ) = {change_id} OR
            "ЗаписьНовая" = {pk}
      )
      SELECT
         DISTINCT ( HSTORE( slave."ЗаписьСтарая" )->'{slave_pk_name}' )::integer as "id"
      FROM
         master
      INNER JOIN
         "log.{slave}" slave
      ON
         HSTORE( slave."ЗаписьСтарая" )->'{slave_fld}' = ANY( (
            SELECT ARRAY_AGG( DISTINCT "id_" ) FROM (
               SELECT (master."ЗаписьСтарая"->'{master_fld}')::bigint as "id_" FROM master
               {additional_filter}
            ) T1
         )::text[] )
         AND slave."ЗаписьСтарая" IS DISTINCT FROM NULL
      {additional_condition_}
   )
) T
         """.format(
         pk = pk,
         master = linkHelper.master,
         master_fld = linkHelper.master_fld,
         master_pk_name = linkHelper.master_pk_name,
         slave = linkHelper.slave,
         slave_fld = linkHelper.slave_fld,
         slave_pk_name = linkHelper.slave_pk_name,
         additional_condition = 'WHERE ( ' + linkHelper.link_condition + ' )' if linkHelper.link_condition else '',
         additional_condition_ = 'WHERE ( ' + get_condition( ) + ' )' if linkHelper.link_condition else '',
         change_id = "'" + pk + "'" if single else "any( " + change_id_array_str + " )",
         additional_filter = "" if linkHelper.master_fld != master_pk_field else """UNION SELECT "ЗаписьНовая"::bigint as "id_" FROM master"""
      )
      ) or [ ]

      #убираем одинаковые записи и сортируем
      return sorted( set( table_slave_ids ) )

   #####################################################################################################################
   #обрабатывает одну таблицу - вычисляет все идентификаторы событий по идентификатору объекта истории
   #####################################################################################################################
   def handle_one_table( self, event_id_set, table_description, table_primary_key_array ) :
      event_id_array = self.__private_get_event_id_rs_by_rec_id_array_of_table( table_primary_key_array,
                                                                                table_description[ 'Таблица' ] )

      event_id_set |= set( event_id_array ) if event_id_array else set( )
      child_description_list = table_description[ 'Дети' ]

      for child_description in child_description_list :
         linkHelper = self.LinkHelper( child_description, from_string = False )
         ids = self.__private_get_linked_table_pk_array_by_change_id( linkHelper, table_primary_key_array )
         self.handle_one_table( event_id_set, child_description, ids )
         #for ido in ids:
         #  self.__private_fill_dict_of_changes_by_change_id_of_table( ids_dict, ido, linkHelper.slave )

   #####################################################################################################################
   #Возвращает заголовки истории по параметрам, от которых был построен объект
   #####################################################################################################################
   def get_history_headers( self ) :
      event_ids_array = set( )
      #####################################################################
      for table_description in self.__private_object_descriptor.root_element_array :
         #TODO:здесь нужно будет научить класс принимать идентификаторы разных основных таблиц, пока что только то, что передали в фильтре для 1 таблицы
         self.handle_one_table( event_ids_array, table_description, [ self.__private_object_id ] )

      site = ConfigGet( 'АдресСервиса' ).lower()
      site = site[ site.find( '://' ) + 3 : ]
      page_size = int( self.__private_navi[ 'РазмерСтраницы' ] ) if self.__private_navi is not None else 0

      transactions = SqlQuery( """
WITH RES_ as (
    WITH RES as (
         SELECT
             T0."@$Изменение" as "id",
             T0."Транзакция",
             (
                  SELECT
                      CASE WHEN T."Предок" < 0
                           THEN
                               (
                                    SELECT
                                        "Предок"
                                    FROM
                                        "log.$Изменение"
                                    WHERE
                                        "Транзакция" = ABS( T."Предок" ) AND
                                        "Предок" IS NOT NULL
                                    LIMIT 1
                               )
                           ELSE
                               "Предок"
                      END
                  FROM
                      "log.$Изменение" T
                  WHERE
                      T."Транзакция" = T0."Транзакция" AND
                      T."Предок" IS NOT NULL
                  LIMIT 1
             ) as "Контекст"
         FROM
             "log.$Изменение" T0
         WHERE
             T0."@$Изменение" = ANY( '{array_id}'::bigint[] )
    )
    SELECT
         "id",    
         "Транзакция",
         "Контекст"
    FROM
         RES
)
SELECT
    "Транзакция",
    "Контекст",
    MIN( "id" ) as "change"
FROM
	 RES_
{condition}
GROUP BY
    "Транзакция",
    "Контекст"
ORDER BY
 "change" DESC
{navigation}
   """.format(
            array_id='{' + ",".join(str(v) for v in event_ids_array) + '}',
            condition= """WHERE "Контекст" = ANY( ( SELECT ARRAY_AGG( "@$Пользователь" ) FROM "log.$Пользователь" WHERE {filter_user} )::BIGINT[] )""".format(
               filter_user = ( "\"Субъект\" = '" + str( self.__private_filter_user ) + "'"  ) if '#' in str( self.__private_filter_user ) else ( "\"Пользователь\" = " + str( self.__private_filter_user ) )
            ) if self.__private_filter_user is not None else "",
            navigation = """LIMIT """ + str( page_size + 1 ) if self.__private_navi is not None else ""
      ) )

      transaction_and_context = dict()
      context = set()
      transaction = set()

      for r in transactions:
         transaction_and_context[ r.Транзакция ] = r.Контекст if r.Контекст and r.Контекст > 0 else None
         if r.Контекст:
            context.add( r.Контекст )
         transaction.add( r.Транзакция )

      res = SqlQuery( """
SELECT
    T0."@$Изменение" AS "id",
    T0."ДатаВремя" AS "Время",
    T0."Транзакция",
    T0."Таблица",
    0::BIGINT as "Контекст",
    '' as "Пользователь",
    '' AS "Имя",
    '' as "Объект"
FROM
    "log.$Изменение" T0
WHERE
    T0."@$Изменение" = ANY( '{array_id}'::bigint[] )
    AND T0."Транзакция" = ANY( '{array_transaction}'::bigint[] )
      """.format(
         array_id = '{' + ",".join(str(v) for v in event_ids_array) + '}',
         array_transaction = '{' + ",".join(str(v) for v in transaction) + '}'
      ) )

      context_and_name_tmp = SqlQuery( """
SELECT
   "@$Пользователь" as "Контекст",
   COALESCE( "Имя", 'Не определен' ) as "Имя",
   "Субъект"
FROM
(
SELECT
   "@$Пользователь",
   CASE WHEN SUBSTRING( "Субъект" FROM '#.+' ) = '#{site}'
      THEN
         SUBSTRING("Субъект" FROM '\d+')::INTEGER
      ELSE
         "Пользователь"
   END AS "Пользователь",
   CASE WHEN SUBSTRING( "Субъект" FROM '#.+' ) = '#{site}'
      THEN
         "Субъект"
      ELSE
         "Пользователь"::text
   END AS "Субъект"
FROM
   "log.$Пользователь"
WHERE
   "@$Пользователь" = ANY( '{context}'::INTEGER[] )
) T0
LEFT JOIN
   "Пользователь" T1
ON
   T0."Пользователь" = T1."@Пользователь"
      """.format(
         context = '{' + ",".join(str(v) for v in context) + '}',
         site = site
      ) )

      context_and_name = dict()
      context_and_subject = dict()
      for r in context_and_name_tmp:
         context_and_name[ r.Контекст ] = r.Имя
         context_and_subject[ r.Контекст ] = r.Субъект

      for rec in res:
         dirty_table = rec.Таблица
         dirty_table = dirty_table[ dirty_table.rfind( '.' ) + 1 :-1 ].replace( '"', '' )
         rec.Таблица = dirty_table
         rec.Объект = self.__private_object_descriptor.get_object_by_table_name( dirty_table )
         ctx = transaction_and_context[ rec.Транзакция ]
         rec.Контекст = ctx
         rec.Имя = context_and_name[ ctx ] if ctx else 'Не определен'
         rec.Пользователь = context_and_subject[ ctx ] if ctx else None

      return res


debug = '''
########################################################################################################################
########################################################################################################################
########################################################################################################################
def ИсторияСобытий():
   #TEST################################################################################################################
   #TEST################################################################################################################
   #TEST################################################################################################################

   Session.Set( WebServerContextKey.icsSESSION_ID, '000ba0eb-000ba0ec-00ba-d43264215e3841bf' )

   Описание = Record()
   Описание.AddInt64("Ключ", 1)
   Описание.AddInt64("Родитель", None)
   Описание.AddString("Таблица", 'СвязиПользователя')
   Описание.AddString("Объект", 'Сотрудник') #РолиПользователей;
   Описание.AddString("УсловиеСвязи", None) #
   Описание.AddString("Связь", None) #
   ObjectDescription = CreateRecordSet(Описание.Format())
   ObjectDescription.AddRow(Описание)

   Описание.Ключ = 2
   Описание.Родитель = 1
   Описание.Таблица = 'ЧастноеЛицо'
   Описание.Объект = None
   Описание.Связь = 'СвязиПользователя.ЧастноеЛицо=ЧастноеЛицо.@Лицо'
   Описание.УсловиеСвязи = ''
   ObjectDescription.AddRow(Описание)

   Описание.Ключ = 3
   Описание.Родитель = 2
   Описание.Таблица = 'ЧастноеЛицоРасширение'
   Описание.Объект = None
   Описание.Связь = 'ЧастноеЛицоРасширение.@Лицо=ЧастноеЛицо.@Лицо'
   Описание.УсловиеСвязи = ""
   ObjectDescription.AddRow(Описание)

   Описание.Ключ = 4
   Описание.Родитель = 1
   Описание.Таблица = 'Пользователь'
   Описание.Объект = None
   Описание.Связь = 'СвязиПользователя.Пользователь=Пользователь.@Пользователь'
   Описание.УсловиеСвязи = ""
   ObjectDescription.AddRow(Описание)

   Описание.Ключ = 5
   Описание.Родитель = 4
   Описание.Таблица = 'РолиПользователей'
   Описание.Объект = None
   Описание.Связь = 'Пользователь.@Пользователь=РолиПользователей.Пользователь'
   Описание.УсловиеСвязи = ""
   ObjectDescription.AddRow(Описание)

   Описание.Ключ = 6
   Описание.Родитель = 4
   Описание.Таблица = 'НастройкиОВПользователя'
   Описание.Объект = None
   Описание.Связь = 'Пользователь.@Пользователь=НастройкиОВПользователя.Пользователь'
   Описание.УсловиеСвязи = ""
   ObjectDescription.AddRow(Описание)

   Навигация = Record()
   Навигация.AddInt64( "Страница", 0 )
   Навигация.AddInt64( "РазмерСтраницы", 100 )
   Навигация.AddBool( "ЕстьЕще", False )

   Фильтр = Record()
   Фильтр.AddString("ВремяДо", '2014-04-27')
   Фильтр.AddString("ВремяОт", '2014-03-01')
   Фильтр.AddInt64("ИдО", 1) #онлайн 67467 inside- 10283
   #Фильтр.AddString("Сообщение", 'теле')
   #Фильтр.AddInt64("Пользователь", 46)
   #Фильтр.AddString("Объект", 'Пользователь') #РолиПользователей;
   Описание = Record()
   Описание.AddRecordSet("Описание", ObjectDescription.Format(), ObjectDescription)
   ptrFilter = MoveToSharedPtr(Описание)
   Фильтр.AddRecord("ОписаниеОбъекта", ptrFilter.Format(), ptrFilter ) #РолиПользователей;
   Фильтр.AddBool("ТолькоИзмененные", True) #записи
   Фильтр.AddBool("ТолькоИзмененныеПоля", True)
   Фильтр.AddString( "ПользовательскийОбработчик", '_')

   #~TEST###############################################################################################################
   #~TEST###############################################################################################################
   #~TEST###############################################################################################################

   frmt = MethodResultFormat('История.Список', 4)
   res = CreateRecordSet(frmt)
   recRes = Record(frmt)

   filter_for_change = Record()
   filter_for_change.AddArrayInt32("ИдСобытияСписок")
   filter_for_change.AddBool( "ТолькоНазванияПолей" )
   user_history_handler = Фильтр.ПользовательскийОбработчик
   filter_for_change.ТолькоНазванияПолей = not not user_history_handler #так как в пользовательский метод поля должны приходить без префиксов таблиц

   transaction = 0
   history = HistoryGetter(Фильтр, Навигация)
   captions = history.get_history_headers()
   transactions_and_it_changes = dict()
   table_and_it_changes = dict()
   changes_by_table_in_transaction = dict()
   event_rs_by_transaction = dict()

   #handle_transaction##################################################################################################
   def handle_transaction( transaction_, transaction_details ):
      context = None

      for table_, table_info in transaction_details.items():
         if not context:
            context = table_info['context']
            break

      changes_in_transaction = event_rs_by_transaction[ transaction_ ]

      #Если присуствутет пользовательский метод обработки
      if user_history_handler:
         ПользовательскоеПредставлениеТаблицыРолиПользователей( changes_in_transaction )
         #locals_ = { 'in_' : changes_in_transaction }
         #exec( user_handler, dict( globals() ), locals_ )

      first_record = True
      message = ''
      #Занести изменения в результирующий список записей
      if changes_in_transaction is not None:
         changes_in_transaction.SortRows(lambda rec_a, rec_b: rec_a.id > rec_b.id)
         for change in changes_in_transaction:
            if not first_record:
               message += '.\r\n'
            message += HistoryGetter.get_message_by_data( change ) if not change.Сообщение else change.Сообщение

            if first_record:
               recRes.Транзакция = context.Транзакция #id
               recRes.Время = context.Время #Время
               recRes.Объект = context.Объект #Таблица
               recRes.Пользователь = context.Пользователь #Пользователь
               recRes.Контекст = context.Контекст #Идентификатор контекста исполнения
               recRes.Имя = context.Имя
               recRes.Действие = change.Действие
               first_record = False

         if ( ( 'Сообщение' not in Фильтр or not Фильтр.Сообщение ) or re.search( Фильтр.Сообщение, message, re.I ) ) and changes_in_transaction.Size():
            recRes.Сообщение = message
            res.AddRow(recRes)
      #~newContext
   #~handle_transaction#################################################################################################

   for caption in captions:
      #чтобы первоначальную транзакцию инициализировать
      if transaction == 0:
         transaction = caption.Транзакция

      #определяем сменилась ли транзакция
      newContext = caption.Транзакция != transaction

      old_transaction = transaction
      #запоминаем транзакцию
      transaction = caption.Транзакция

      if newContext: #здесь вычисляем все записи, подобавляем и тд
         transactions_and_it_changes[ old_transaction ] = changes_by_table_in_transaction.copy()
         changes_by_table_in_transaction.clear()

      if caption.Таблица in changes_by_table_in_transaction:
         changes_by_table_in_transaction[caption.Таблица]['changes'].append( caption.id )
         #changes_by_table_in_transaction[caption.Таблица]['action'] = HistoryGetter.get_mixed_action( changes_by_table_in_transaction[caption.Таблица]['action'], caption.Действие )
      else:
         changes_by_table_in_transaction[caption.Таблица] = {
            'changes': [caption.id],
            'context': caption
            #'action': caption.Действие
         }

      if caption.Таблица in table_and_it_changes:
         table_and_it_changes[ caption.Таблица ].append( caption.id )
      else:
         table_and_it_changes[ caption.Таблица ] = [caption.id]

   transactions_and_it_changes[ transaction ] = changes_by_table_in_transaction.copy()
   changes_by_table_in_transaction.clear()

   rs_format = None

   for table, changes in table_and_it_changes.items():
      filter_for_change.ИдСобытияСписок = changes
      detailed_changes = HistoryGetter( filter_for_change )
      events_by_table = detailed_changes.get_events( table )

      for event in events_by_table:
         if not rs_format:
            rs_format = event.Format()

         tr = event.Транзакция
         if tr not in event_rs_by_transaction:
            event_rs_by_transaction[ tr ] = CreateRecordSet( rs_format )

         event_rs_by_transaction[ tr ].AddRow( event )

   for transaction, changes in transactions_and_it_changes.items():
      if transaction not in event_rs_by_transaction:
         continue
      handle_transaction( transaction, changes )

   res.SortRows( lambda rec_a, rec_b: rec_a.Транзакция > rec_b.Транзакция )

   mlr = MethodListResult()
   mlr.cursor = res.Cursor()
   mlr.nav_result = NavigationResult( history.navi_result() )

   print( history.navi_result() )

   return res

########################################################################################################################
rs = ИсторияСобытий()
for r in rs:
   print(r)
########################################################################################################################
'''