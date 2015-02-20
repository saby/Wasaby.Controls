<?php

class NET_RPC
{

    private $sSession = '';
    private $sUrlAT = 'https://test-inside.tensor.ru/auth/service/sbis-rpc-service300.dll';
    private $sUrlBL = 'https://test-inside.tensor.ru/service/sbis-rpc-service300.dll';
    private $sUser = 'cfsstat';
    private $sPass = 'cfsstat';

    public function __construct()
    {

        // если не отлдака локально лезем сами на себя иначе на инсайд
        if (!strstr($_SERVER['SERVER_NAME'], 'localhost')) {

            // хлопоты по вызову, т.к. на диспетчер может приходить HTTPS а внутри гоняться HTTP а надо
            // дергать как положено

            $sSheme = '';
            if (isset($_SERVER['HTTP_REFERER'])) {
                $aUrl = parse_url($_SERVER['HTTP_REFERER']);
                if (isset($aUrl['scheme'])) {
                    $sSheme = $aUrl['scheme'];
                }
            }

            if (!empty($sSheme)) {
                $sRPCHost = $sSheme . '://' . $_SERVER['SERVER_NAME'];
            } else {
                if ($_SERVER['SERVER_PORT'] == 80) {
                    $sRPCHost = 'http://' . $_SERVER['SERVER_NAME'];
                } elseif ($_SERVER['SERVER_PORT'] == 443) {
                    $sRPCHost = 'https://' . $_SERVER['SERVER_NAME'];
                } else {
                    $sRPCHost = 'http://' . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'];
                }
            }

            $this->sUrlAT = $sRPCHost . '/auth/service/sbis-rpc-service300.dll';
            $this->sUrlBL = $sRPCHost . '/service/sbis-rpc-service300.dll';

        } else {
            $this->sUrlAT = 'http://' . $_SERVER['SERVER_NAME'] . '/auth/service/sbis-rpc-service300.dll';
            $this->sUrlBL = 'http://' . $_SERVER['SERVER_NAME'] . '/service/sbis-rpc-service300.dll';
            $this->sSession = 'xakep';
        }
    }

    private
    function makeJSON($sMethod = 'Объект.Метод', $aParams = array(), $iId = 1, $bForce = false)
    {

        $aJSON = array(
            'jsonrpc' => '2.0',
            'method' => $sMethod,
            'protocol' => 2,
            'params' => $aParams,
            'id' => $iId
        );

        if (!$bForce)
            return json_encode($aJSON);
        else
            return json_encode($aJSON, JSON_FORCE_OBJECT);

    }

    private
    function RPC($sURL, $sJSON)
    {

        $aHeaders = array(
            'Content-Type: application/json; charset=utf-8',
            'X-Requested-With: XMLHttpRequest',
            'User-Agent' => 'PHPRPC Telephony',
            'Content-Length: ' . strlen($sJSON),
            'Cookie: sid=' . $this->sSession
        );
        // create a new cURL resource
        $ch = curl_init();

        // set URL and other appropriate options
        curl_setopt($ch, CURLOPT_URL, $sURL);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $aHeaders);
        // если вдруг редирект
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 1);

        curl_setopt($ch, CURLINFO_HEADER_OUT, 1);
        //curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_VERBOSE, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $sJSON);

        curl_setopt($ch, CURLOPT_TIMEOUT, 5);

        // не проверять SSL сертификат
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        // не проверять Host SSL сертификата
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

        $out = curl_exec($ch);

        if ($out === false) {
            return $this->error('RPC: CURL error: ' . curl_error($ch), array('url' => $sURL));
        }

        $info = curl_getinfo($ch);
        $aJSON = json_decode($out, true);
        curl_close($ch);

        return array('json' => $aJSON, 'info' => $info);
    }

    private
    function error($msg = '', $data = array())
    {
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json; charset=utf-8');
        $aJSON = array(
            "jsonrpc" => "2.0",
            "phprpc" => "1.0",
            'error' => array(
                'message' => 'PHPRPC: ' . $msg
            ),
            'data' => $data
        );
        print_r(json_encode($aJSON));
        exit();

    }

    private
    function auth()
    {

        if (!empty($this->sSession))
            return true;

        $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"САП.Аутентифицировать","params":{"login":"' . $this->sUser . '","password":"' . $this->sPass . '"},"id":1}';

        $aTmp = $this->RPC($this->sUrlAT, $sJSON);

        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND !empty($aJSON['result'])) {
            $this->sSession = $aJSON['result'];
            return true;
        }

        if (isset($aJSON['error']['message']))
            $this->error($aJSON['error']['message'], $aTmp);
        else {
            $this->error('Ошибка авторизации.<br />Код ответа [' . $aINFO['http_code'] . ']', $aTmp);
        }

        return false;
    }

    private
    function check()
    {

        $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"САП.ПроверитьСессию","params":{},"id":1}';

        $aTmp = $this->RPC($this->sUrlAT, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND !empty($aJSON['result'])) {
            return true;
        }
        if (!empty($aJSON['error']))
            return false;

        return true;
    }

    private
    function sbis_auth()
    {

        $oMem = TOOLS_Cache::getInstance();
        $sidname = 'sid/' . $this->sUser;
        $sid = $oMem->getData($sidname);

        if ($sid === false) {
            $this->auth();
            $oMem->setData($sidname, $this->sSession);
        } else {
            $this->sSession = $sid;
            if (!$this->check()) {
                $this->sSession = '';
                $this->auth();
                $oMem->setData($sidname, $this->sSession);
            }
        }
        if (empty($this->sSession)) {
            $this->error('Пустая сессия.');
        }

        return true;

    }

    public
    function getATCS()
    {


        if (!$this->sbis_auth())
            return false;

        $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"АТС.Список","params":{"ДопПоля":[],"Фильтр":{"d":{"Раздел":null,"ВидДерева":"Только листья","HierarchyField":"Раздел","Разворот":"С разворотом","ПутьКУзлу":"true","ЗаголовокИерархии":"Имя"},"s":{"Раздел":"Строка","ВидДерева":"Строка","HierarchyField":"Строка","Разворот":"Строка","ПутьКУзлу":"Строка","ЗаголовокИерархии":"Строка"}},"Сортировка":null,"Навигация":null},"id":1}';

        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result']['d'])) {
            return $aJSON['result']['d'];
        }

        if (isset($aJSON['error']['message']))
            $this->error($aJSON['error']['message'], $aTmp);
        else
            $this->error('Ошибка авторизации.<br />Код ответа [' . $aINFO['http_code'] . ']', $aTmp);
        return false;

    }

    public
    function getATC($iATC)
    {

        if (!$this->sbis_auth())
            return false;

        $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"АТС.Прочитать","params":{"ИдО":' . $iATC . ',"ИмяМетода":"АТС.СелектПлюс"},"id":1}';

        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result']['d'])) {
            return $aJSON['result']['d'];
        }

        if (isset($aJSON['error']['message']))
            $this->error($aJSON['error']['message'], $aTmp);
        else
            $this->error('Ошибка авторизации.<br />Код ответа [' . $aINFO['http_code'] . ']', $aTmp);
        return false;

    }

    public
    function getUsers($iATC, $bNames = false)
    {


        if (!$this->sbis_auth())
            return false;

        $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"Агент.Список","params":{"ДопПоля":[],"Фильтр":{"d":{"АТС":"' . $iATC . '","Раздел":null,"ВидДерева":"С узлами и листьями","HierarchyField":"Раздел","Разворот":"С разворотом","ПутьКУзлу":"true","ЗаголовокИерархии":"Имя"},"s":{"АТС":"Строка","Раздел":"Строка","ВидДерева":"Строка","HierarchyField":"Строка","Разворот":"Строка","ПутьКУзлу":"Строка","ЗаголовокИерархии":"Строка"}},"Сортировка":null,"Навигация":null},"id":1}';

        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result']['d'])) {
            if ($bNames)
                return $aJSON['result'];
            else
                return $aJSON['result']['d'];
        }

        if (isset($aJSON['error']['message']))
            $this->error($aJSON['error']['message'], $aTmp);
        else
            $this->error('Ошибка авторизации.<br />Код ответа [' . $aINFO['http_code'] . ']', $aTmp);
        return false;

    }

    public
    function getUsersAll($bNames = false)
    {

        if (!$this->sbis_auth())
            return false;

        $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"Агент.Список","params":{"ДопПоля":[],"Фильтр":{"d":{"Раздел":null,"ВидДерева":"С узлами и листьями","HierarchyField":"Раздел","Разворот":"С разворотом","ПутьКУзлу":"true","ЗаголовокИерархии":"Имя"},"s":{"Раздел":"Строка","ВидДерева":"Строка","HierarchyField":"Строка","Разворот":"Строка","ПутьКУзлу":"Строка","ЗаголовокИерархии":"Строка"}},"Сортировка":null,"Навигация":null},"id":1}';

        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result']['d'])) {
            if ($bNames)
                return $aJSON['result'];
            else
                return $aJSON['result']['d'];
        }

        if (isset($aJSON['error']['message']))
            $this->error($aJSON['error']['message'], $aTmp);
        else
            $this->error('Ошибка авторизации.<br />Код ответа [' . $aINFO['http_code'] . ']', $aTmp);
        return false;

    }

    public
    function getQueue($iQueue, $bNames = false)
    {

        if (!$this->sbis_auth())
            return false;

        $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"Очередь.Прочитать","params":{"ИдО":' . ($iQueue) . ',"ИмяМетода":"Базовое расширение"},"id":1}';

        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result']['d'])) {
            if ($bNames)
                return $aJSON['result'];
            else
                return $aJSON['result']['d'];
        }

        if (isset($aJSON['error']['message']))
            $this->error($aJSON['error']['message'], $aTmp);
        else
            $this->error('Ошибка авторизации.<br />Код ответа [' . $aINFO['http_code'] . ']', $aTmp);
        return false;

    }


    public
    function getQueues($iATC = 0, $bNames = false)
    {

        if (!$this->sbis_auth())
            return false;

        if ($iATC)
            $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"Очередь.УАТССписок","params":{"ДопПоля":[],"Фильтр":{"d":{"АТС":"' . $iATC . '","Раздел":null,"ВидДерева":"Только листья","HierarchyField":"Раздел","Разворот":"С разворотом","ПутьКУзлу":"true","ЗаголовокИерархии":"Имя"},"s":{"АТС":"Строка","Раздел":"Строка","ВидДерева":"Строка","HierarchyField":"Строка","Разворот":"Строка","ПутьКУзлу":"Строка","ЗаголовокИерархии":"Строка"}},"Сортировка":null,"Навигация":null},"id":1}';
        else
            $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"Очередь.УАТССписок","params":{"ДопПоля":[],"Фильтр":{"d":{"Раздел":null,"ВидДерева":"Только листья","HierarchyField":"Раздел","Разворот":"С разворотом","ПутьКУзлу":"true","ЗаголовокИерархии":"Имя"},"s":{"Раздел":"Строка","ВидДерева":"Строка","HierarchyField":"Строка","Разворот":"Строка","ПутьКУзлу":"Строка","ЗаголовокИерархии":"Строка"}},"Сортировка":null,"Навигация":null},"id":1}';

        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result']['d'])) {
            if ($bNames)
                return $aJSON['result'];
            else
                return $aJSON['result']['d'];
        }

        if (isset($aJSON['error']['message']))
            $this->error($aJSON['error']['message'], $aTmp);
        else
            $this->error('Ошибка авторизации.<br />Код ответа [' . $aINFO['http_code'] . ']', $aTmp);
        return false;
    }


    public
    function getUsersInQueue($iQueue, $bNames = false)
    {

        if (!$this->sbis_auth())
            return false;

        $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"АгентыВОчередях.СписокАгентов","params":{"ДопПоля":[],"Фильтр":{"d":{"Очередь":"' . $iQueue . '"},"s":{"Очередь":"Строка"}},"Сортировка":null,"Навигация":null},"id":1}';

        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result']['d'])) {
            if ($bNames)
                return $aJSON['result'];
            else
                return $aJSON['result']['d'];
        }

        if (isset($aJSON['error']['message']))
            $this->error($aJSON['error']['message'], $aTmp);
        else
            $this->error('Ошибка авторизации.<br />Код ответа [' . $aINFO['http_code'] . ']', $aTmp);
        return false;

    }

    public
    function ClientCreate($iATC)
    {

        $aParams = array(
            "Фильтр" => Array(
                "d" => array(
                    "HierarchyField" => "Раздел",
                    "АТС" => $iATC,
                    "ВидДерева" => "С узлами и листьями",
                    "ЗаголовокИерархии" => "Имя",
                    "ПутьКУзлу" => "true",
                    "Разворот" => "Без разворота",
                    "Раздел" => null,
                ),
                "s" => array(
                    "HierarchyField" => "Строка",
                    "АТС" => "Строка",
                    "ВидДерева" => "Строка",
                    "ЗаголовокИерархии" => "Строка",
                    "ПутьКУзлу" => "Строка",
                    "Разворот" => "Строка",
                    "Раздел" => "Строка",
                )
            ),
            "ИмяМетода" => "Агент.Список"
        );

        $sJSON = $this->makeJSON('Агент.Создать', $aParams);
        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND !empty($aJSON['result']['d']['@Агент'])) {
            $iClient = $aJSON['result']['d']['@Агент'];
            return $iClient;
        } else {
            //print_r($sJSON);
            print_r($aINFO);
            print_r($aJSON);
            exit();
        }

        return false;

    }

    private
    function translit($str)
    {
        $tr = array(
            "А" => "A", "Б" => "B", "В" => "V", "Г" => "G",
            "Д" => "D", "Е" => "E", "Ж" => "J", "З" => "Z", "И" => "I",
            "Й" => "Y", "К" => "K", "Л" => "L", "М" => "M", "Н" => "N",
            "О" => "O", "П" => "P", "Р" => "R", "С" => "S", "Т" => "T",
            "У" => "U", "Ф" => "F", "Х" => "H", "Ц" => "Ts", "Ч" => "Ch",
            "Ш" => "Sh", "Щ" => "Sch", "Ъ" => "", "Ы" => "Yi", "Ь" => "",
            "Э" => "E", "Ю" => "Yu", "Я" => "Ya", "а" => "a", "б" => "b",
            "в" => "v", "г" => "g", "д" => "d", "е" => "e", "ж" => "j",
            "з" => "z", "и" => "i", "й" => "y", "к" => "k", "л" => "l",
            "м" => "m", "н" => "n", "о" => "o", "п" => "p", "р" => "r",
            "с" => "s", "т" => "t", "у" => "u", "ф" => "f", "х" => "h",
            "ц" => "ts", "ч" => "ch", "ш" => "sh", "щ" => "sch", "ъ" => "y",
            "ы" => "yi", "ь" => "", "э" => "e", "ю" => "yu", "я" => "ya"
        );

        return strtr($str, $tr);
    }


    public
    function ClientUpdate($iClient, $iNumber, $sName, $iATC, $bBoss = false, $iBoss = null)
    {

        $sNameATC = $this->translit($sName);

        if ($sName[0] == '[')
            $bActive = false;
        else
            $bActive = true;

        $aParams = Array(
            "Запись" => Array(
                "d" => Array(
                    "@Агент" => $iClient,
                    "АТС" => $iATC,
                    "Активен" => $bActive,
                    "Идентификатор" => null,
                    "Имя" => $sName,
                    "ИмяАТС" => $sNameATC,
                    "Номер" => $iNumber,
                    "Сотрудник" => null
                ),
                "s" => Array(
                    "@Агент" => "Число целое",
                    "АТС" => array(
                        "Связь" => "АТС"
                    ),
                    "Активен" => "Логическое",
                    "Идентификатор" => "Текст",
                    "Имя" => "Текст",
                    "ИмяАТС" => "Текст",
                    "Номер" => "Текст",
                    "Сотрудник" => array(
                        "Связь" => "Сотрудник"
                    ),
                )
            )
        );

        $aParams['Запись']['s']['Раздел'] = array(
            "Иерархия" => array(
                true,
                "Имя"
            )
        );
        $aParams['Запись']['d']['Раздел'] = array(
            array($bBoss),
            $iBoss
        );

        $sJSON = $this->makeJSON('Агент.Записать', $aParams);
        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result'])) {
            return $aJSON['result'];
        } else {

            header('Content-Type: text/html; charset=utf-8');

            print($sJSON);
            exit();

            print_r($aParams);
            print_r($aINFO);
            print_r($aJSON);
            //print_r($sJSON);
            //print_r(json_decode($sJSON,true));
            exit();
        }

        return -1;

    }

    public
    function QueueCreate($iATC)
    {

        $aParams = array(
            "Фильтр" => Array(
                "d" => array(
                    "АТС" => $iATC,
                    "Раздел" => null,
                ),
                "s" => array(
                    "АТС" => "Строка",
                    "Раздел" => "Строка",
                )
            ),
            "ИмяМетода" => "Очередь.УАТССписок"
        );

        $sJSON = $this->makeJSON('Очередь.Создать', $aParams);
        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND !empty($aJSON['result']['d']['@Очередь'])) {
            $iQueue = $aJSON['result']['d']['@Очередь'];
            return $iQueue;
        } else {
            print_r($aINFO);
            print_r($aJSON);
            exit();
        }

        return false;

    }

    public
    function QueueUpdate($iQueue, $iNumber, $sName, $iATC)
    {

        $aParams = Array(
            "Запись" => Array(
                "d" => Array(
                    "@Очередь" => $iQueue,
                    "АТС" => $iATC,
                    "Имя" => $sName,
                    "Номер" => $iNumber
                ),
                "s" => Array(
                    "@Очередь" => "Число целое",
                    "Имя" => "Текст",
                    "Номер" => "Текст",
                    "АТС" => array(
                        "Связь" => "АТС"
                    )
                )
            )
        );

        $sJSON = $this->makeJSON('Очередь.Записать', $aParams);
        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result'])) {
            return $aJSON['result'];
        } else {
            print_r($aINFO);
            print_r($aJSON);
            exit();
        }

        return -1;

    }

    public
    function AbonentInQueueCreate($iAbonent, $iQueue)
    {

        // {"jsonrpc":"2.0","method":"АбонентыВОчередях.Создать","params":{"ИмяМетода":"АбонентыВОчередях.Список","Фильтр":{"d":{"Абонент":20430,"Очередь":2218},"s":{"Абонент":"Число целое","Очередь":"Число целое"}}},"id":1}

        $aParams = array(
            "Фильтр" => Array(
                "d" => array(
                    "Агент" => $iAbonent,
                    "Очередь" => $iQueue,
                ),
                "s" => array(
                    "Агент" => array(
                        "Связь" => "Агент"
                    ),
                    "Очередь" => array(
                        "Связь" => "Очередь"
                    ),
                )
            ),
            "ИмяМетода" => "АгентыВОчередях.Список"
        );

        $sJSON = $this->makeJSON('АгентыВОчередях.Создать', $aParams);
        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND !empty($aJSON['result']['d']['@АгентыВОчередях'])) {
            $iID = $aJSON['result']['d']['@АгентыВОчередях'];
            return $iID;
        } else {
            print_r($aINFO);
            print_r($aJSON);
            print_r($aParams);
            exit();
        }

        return false;

    }

    public
    function RegionCreate()
    {

        if (!$this->sbis_auth())
            return false;

        $aParams = array(
            "Фильтр" => Array(
                "d" => array(),
                "s" => array()
            ),
            "ИмяМетода" => "Базовое расширение"
        );

        $sJSON = $this->makeJSON('Регион.Создать', $aParams, 1, true);
        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND !empty($aJSON['result']['d']['@Регион'])) {
            $iRegion = $aJSON['result']['d']['@Регион'];
            return $iRegion;
        } else {
            print_r($sJSON);
            print_r($aINFO);
            print_r($aJSON);
            exit();
        }

        return false;

    }

    public
    function RegionUpdate($iRegion, $sNumber, $sName)
    {

        if (!$this->sbis_auth())
            return false;

        $aParams = Array(
            "Запись" => Array(
                "d" => Array(
                    "@Регион" => $iRegion,
                    "Название" => $sName,
                    "Код" => $sNumber
                ),
                "s" => Array(
                    "@Регион" => "Число целое",
                    "Название" => "Текст",
                    "Код" => "Текст"
                )
            )
        );

        $sJSON = $this->makeJSON('Регион.Записать', $aParams);
        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result'])) {
            return $aJSON['result'];
        } else {
            print_r($sJSON);
            print_r($aINFO);
            print_r($aJSON);
            exit();
        }

        return -1;

    }

    public
    function getRegions()
    {

        if (!$this->sbis_auth())
            return false;

        $sJSON = '{"jsonrpc":"2.0","protocol":2,"method":"Регион.Список","params":{"ДопПоля":[],"Фильтр":{"d":{"Раздел":null,"ВидДерева":"С узлами и листьями","HierarchyField":"Раздел","Разворот":"С разворотом","ПутьКУзлу":"true","ЗаголовокИерархии":"Имя"},"s":{"Раздел":"Строка","ВидДерева":"Строка","HierarchyField":"Строка","Разворот":"Строка","ПутьКУзлу":"Строка","ЗаголовокИерархии":"Строка"}},"Сортировка":null,"Навигация":null},"id":1}';
        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result']['d'])) {
            return $aJSON['result'];
        }

        //print('<pre>');
        //print_r($aINFO);
        //print_r($aJSON);

        return false;

    }

    public
    function PointCreate()
    {

        if (!$this->sbis_auth())
            return false;

        $aParams = array(
            "Фильтр" => Array(
                "d" => array(),
                "s" => array()
            ),
            "ИмяМетода" => "Базовое расширение"
        );

        $sJSON = $this->makeJSON('ТочкаПродаж.Создать', $aParams, 1, true);
        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND !empty($aJSON['result']['d']['@Лицо'])) {
            $iPoint = $aJSON['result']['d']['@Лицо'];
            return $iPoint;
        } else {
            print_r($sJSON);
            print_r($aINFO);
            print_r($aJSON);
            exit();
        }

        return false;

    }

    public
    function PointUpdate($iPoint, $iReg, $sKod, $sName)
    {

        if (!$this->sbis_auth())
            return false;

        $aParams = Array(
            "Запись" => Array(
                "d" => Array(
                    "@Лицо" => $iPoint,
                    "Регион" => $iReg,
                    "Название" => $sName,
                    "Код" => $sKod,
                    "ТипТочкиПродаж" => 7
                ),
                "s" => Array(
                    "@Лицо" => "Число целое",
                    "Регион" => array(
                        "Связь" => "Регион"
                    ),
                    "Название" => "Текст",
                    "Код" => "Текст",
                    "ТипТочкиПродаж" => array(
                        "Связь" => "ТипТочкиПродаж"
                    ),

                )
            )
        );

        $sJSON = $this->makeJSON('ТочкаПродаж.Записать', $aParams);
        $aTmp = $this->RPC($this->sUrlBL, $sJSON);
        $aJSON = $aTmp['json'];
        $aINFO = $aTmp['info'];

        if ($aINFO['http_code'] == 200 AND isset($aJSON['result'])) {
            return $aJSON['result'];
        } else {
            print_r($sJSON);
            print_r($aINFO);
            print_r($aJSON);
            exit();
        }

        return -1;

    }


}





