/**
 * Библиотека контролов, позволяющих организовать работу событий сверху вниз.
 * @library Controls/event
 * @includes Register Controls/_event/Register
 * @includes Listener Controls/_event/Listener
 * @public
 * @author Крайнов Д.О.
 * @deprecated Использование библиотеки допускается только для авторесайза, о чем подробнее можно прочитать в <a href="/doc/platform/developmentapl/interface-development/controls/tools/autoresize/">статье</a>.
 * В остальных случаях использовать библиотеку не рекомендуется, поскольку это приведёт к неконтролируемому потоку распространения данных. 
 */

/*
 * event library
 * @library Controls/event
 * @includes Register Controls/_event/Register
 * @includes Listener Controls/_event/Listener
 * @public
 * @author Крайнов Д.О.
 */

import Register = require('Controls/_event/Register');
import Listener = require('Controls/_event/Listener');
import Registrar = require('Controls/_event/Registrar');
import {register as RegisterUtil,unregister as UnregisterUtil} from 'Controls/_event/ListenerUtils'

export {
   Register,
   Listener,
   Registrar,
   RegisterUtil,
    UnregisterUtil
}
