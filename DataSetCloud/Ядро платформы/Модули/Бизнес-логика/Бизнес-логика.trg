<?xml version="1.0" encoding="WINDOWS-1251"?>
<trigger_library version="1.02">

  <trigger last_changed="Абрамов В.И." name="УдалитьЧерновик" responsible="Абрамов В.И.">
    <definition>
      <language>PLPGSQL</language>
      <body>BEGIN
IF NEW."$Черновик" &lt; 0 THEN
   NEW."$Черновик" := OLD."$Черновик";
ELSEIF OLD."$Черновик" IS NOT NULL THEN
   EXECUTE 'DELETE FROM "$Черновик" WHERE "ИдОбъекта" = $1.' || quote_ident( TG_ARGV[0] ) || ' AND "ИдТаблицы" = ' || TG_RELID USING OLD;
   NEW."$Черновик" := NULL;
END IF;
RETURN NEW;
END;</body>
    </definition>
  </trigger>

</trigger_library>
