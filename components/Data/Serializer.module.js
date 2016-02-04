/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Serializer', [
], function () {
   'use strict';

   /**
    * Сериалайзер - обеспечивает возможность сериализовать и десериализовать специальные типы
    * @class SBIS3.CONTROLS.Data.Serializer
    * @public
    * @author Мальцев Алексей
    * @deprecated Будет удалено в 3.7.3.100 используйте {@link $ws.proto.Serializer}
    */

   return $ws.proto.Serializer;
});
