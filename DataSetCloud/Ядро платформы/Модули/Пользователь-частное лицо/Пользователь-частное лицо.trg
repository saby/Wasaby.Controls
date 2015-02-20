<?xml version="1.0" encoding="WINDOWS-1251"?>
<trigger_library version="1.02">

  <trigger last_changed="Кузьмин Н.М." name="ПроверитьПользовательЧЛ" responsible="Кузьмин Н.М.">
    <definition>
      <language>PLPGSQL</language>
      <body>DECLARE
   idLink integer;
BEGIN
   IF TG_OP = 'INSERT' THEN
      SELECT "@СвязиПользователя" INTO idLink
         FROM "СвязиПользователя"
         WHERE "Пользователь" = NEW."Пользователь"
            -- если создаем с указанным частным лицом, то нужно проверить что нет указаного другого частного лица
            AND ( NEW."ЧастноеЛицо" IS NOT NULL AND "ЧастноеЛицо" != NEW."ЧастноеЛицо"
            -- если создаем с указанным пользователем, но без частного лица, то нужно проверить может уже есть указанное частное лицо
               OR NEW."ЧастноеЛицо" IS NULL AND "ЧастноеЛицо" IS NOT NULL );
      IF idLink IS NOT NULL THEN
         RAISE EXCEPTION 'У данного пользователя уже есть приязка к другому частному лицу!';
      END IF;
   END IF;
   RETURN NEW;
END</body>
    </definition>
  </trigger>

</trigger_library>
