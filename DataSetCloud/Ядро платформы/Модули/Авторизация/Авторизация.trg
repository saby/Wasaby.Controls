<?xml version="1.0" encoding="WINDOWS-1251" ?>
<trigger_library version="1.02">

  <trigger last_changed="Шаброва А.Н." name="УдалитьСвязиНаПользователяСРолей" responsible="Buravlevms">
    <definition>
      <language>PLPGSQL</language>
      <body>DECLARE
   clientID integer := OLD."Раздел";
   schemaName text := null;
BEGIN
   EXECUTE 'DELETE FROM "РолиПользователей" WHERE "Пользователь" = $1."@Пользователь";' using OLD;
   EXECUTE 'DELETE FROM "НастройкиЗоныДоступа" WHERE "Пользователь" = $1."@Пользователь";' using OLD;
   RETURN NULL;
END;</body>
    </definition>
  </trigger>

</trigger_library>
