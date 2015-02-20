<?php


class RPC_EXT extends RPC_RPC
{

    const   Resort = '_____';

    private $aAgents = array();
    private $aMembers = array();
    private $aStatus = array();

    private $iOpers = 0;
    private $iActiv = 0;
    private $iAway = 0;
    private $iFree = 0;
    private $iFix = 0;
    private $iBusy = 0;
    private $iIn = 0;
    private $iOut = 0;
    private $iNotInQuete = 0;
    private $iUnknown = 0;

    /** @var NET_DB */
    private $oDb = null;

    private $iDeadline = 0;

    private $iStatus = 0;

    public function getAMIData($aQueue, $iNum = 0)
    {

        $aData = explode('|', $aQueue['data']);

        return $aData[$iNum];

    }

    private function makeRow($iAgent, $sName, $iNumber, $iCallsTaken, $sTotal, $sMiddle, $sLast, $sDirection, $sTime, $sWho, $iStatus, $iBoss = 0, $bBoss = false, $iTimeFixed = 15)
    {

        $this->iOpers++;

        $sLast = ' ';
        $iLastcall = 0;
        $iPaused = 0;
        if (isset($this->aMembers['SIP/' . $iNumber])) {
            $aMember = $this->aMembers['SIP/' . $iNumber];
            $iCallsTaken = $aMember['CallsTaken'];
            $iStatus = $aMember['Status'];
            $iPaused = $aMember['Paused'];
            if ($aMember['LastCall']) {
                $iLastcall = $aMember['LastCall'];
                $iTime = intval(time() - $aMember['LastCall']);
                if ($iTime AND ($iStatus == 1))
                    $sLast = $this->Work(time() - $aMember['LastCall']);
            }
        }

        $aStatus = $this->aStatus;
        reset($aStatus);
        while (list($sChannel, $aStat) = each($aStatus)) {
            if (substr($sChannel, 4, 4) == $iNumber) {
                $sWho = $aStat['ConnectedLineNum'];
                /*
                if(!empty($aStat['ConnectedLineName']) AND ($aStat['ConnectedLineName'] != $aStat['ConnectedLineNum'])) {
                    $sWho .= " (".$aStat['ConnectedLineName'].")";
                }
                */
                if (isset($aStat['Seconds']))
                    $sTime = $this->TM($aStat['Seconds']);
                if (isset($aStat['BridgedChannel']) AND isset($aStatus[$aStat['BridgedChannel']])) {
                    $aCaller = $aStatus[$aStat['BridgedChannel']];
                    $sWho = $aCaller['CallerIDNum'];
                    if (isset($aCaller['Seconds']))
                        $sTime = $this->TM($aCaller['Seconds']);
                }
                if (isset($aStat['ChannelState'])) {
                    $sDirection = 1;
                    $this->iOut++;
                } else {
                    $sDirection = 2;
                    $this->iIn++;
                }
                $this->iBusy++;
                break;
            }
        }

        $sSQL = "
            SELECT
                `event`,`data`
            FROM
                `queue_log`
            WHERE
                `agent` =  '" . $iNumber . "'
                AND
                `event`
                IN (
                'COMPLETECALLER',  'COMPLETEAGENT', 'TRANSFER'
                )
                AND `time` >= {$this->iDeadline}
            ORDER BY
                `id` DESC
        ";

        $sMD5 = md5($sSQL);
        $oMemcache = TOOLS_Cache::getInstance();
        $aTimes = $oMemcache->getData($sMD5);
        if ($aTimes === false) {
            $aTimes = $this->oDb->queryObjects($sSQL);
            $oMemcache->setData($sMD5, $aTimes, rand(290, 310));
        }

        $iTime = 0;
        $iTimeTotal = 0;
        if (count($aTimes)) {
            foreach ($aTimes as $aTime) {
                switch ($aTime->event) {
                    case 'COMPLETECALLER':
                    case 'COMPLETEAGENT':
                        $iTime += $this->getAMIData((array)$aTime, 1);
                        break;
                    case 'TRANSFER':
                        $iTime += $this->getAMIData((array)$aTime, 3);
                        break;
                }
            }
            $iTimeTotal = $iTime;
            $iTime = round($iTime / count($aTimes));
            //print("[".$sV['Name']."/".$iTime."]");

        }
        $sTotal = $this->TM($iTimeTotal);
        $sMiddle = $this->TM($iTime);

        if ($iStatus == 1 AND ($iLastcall > 0 AND ((time() - $iLastcall) <= $iTimeFixed))) {
            $iStatus = 77;
        }

        if ($iStatus == 1 AND $iPaused == 1) {
            $iStatus = 999;
        }

        switch ($iStatus) {
            case 1:
                $this->iActiv++;
                $this->iFree++;
                break;
            case 2:
            case 3:
                $this->iActiv++;
                break;
            case 0:
            case 5:
                $this->iUnknown++;
                break;
            case 7:
            case 6:
                $this->iActiv++;
                break;
            case 77:
                $this->iActiv++;
                $this->iFix++;
                break;
            case 999:
                $this->iActiv++;
                $this->iAway++;
                break;
            default:
                $this->iUnknown++;
                break;
        }

        if ($this->iStatus == 1 AND $iStatus != 2 AND $iStatus != 3)
            return false;
        elseif ($this->iStatus == 2 AND $iStatus != 999)
            return false;
        elseif ($this->iStatus == 3 AND $iStatus != 0 AND $iStatus != 5)
            return false;
        elseif ($this->iStatus == 4 AND $iStatus != 1)
            return false;


        $aR = array();
        $aR[0] = $iAgent;
        $aR[1] = $sName;
        $aR[2] = $iNumber;
        $aR[3] = $iCallsTaken;
        $aR[4] = $sTotal;
        $aR[5] = $sMiddle;
        $aR[6] = $sLast;
        $aR[7] = $sDirection;
        $aR[8] = $sTime;
        $aR[9] = $sWho;
        $aR[10] = $iStatus;
        $aR[11] = array(
            $iBoss
        );
        $aR[12] = $bBoss;
        $aR[13] = $bBoss;
        return $aR;
    }


    public
    function QueueData($aParams)
    {

        /*
        $sJSON = <<< ENDJSON
{"jsonrpc":"2.0","method":"EXT.QueueData","id":1,"protocol":2,"result":{"s":[{"n":"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u0417\u043d\u0430\u0447\u0435\u043d\u0438\u0435","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"color","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"stat","t":"\u0427\u0438\u0441\u043b\u043e \u0446\u0435\u043b\u043e\u0435"}],"d":[["\u0412\u0440\u0435\u043c\u044f \u043e\u0442\u0432\u0435\u0442\u0430 \u0441\u0440\u0435\u0434.","00:09","white"],["\u0420\u0430\u0437\u0433\u043e\u0432\u043e\u0440 \u0441\u0440\u0435\u0434.","01:10","white",0],["\u041f\u0440\u0438\u043d\u044f\u0442\u044b\u0445","33","white",1],["\u041d\u0435\u043f\u0440\u0438\u043d\u044f\u0442\u044b\u0445","5","white",1],["\u041d\u0435\u043f\u0440\u0438\u043d\u044f\u0442\u044b\u0445 \u0434\u043e \u0432\u0445\u043e\u0434\u0430",0,"white",0],["\u0410\u0432\u0442\u043e\u043e\u0442\u0432\u0435\u0442\u0447\u0438\u043a",0,"white",0],["\u041e\u0442\u0432\u0435\u0447\u0435\u043d\u043e \u0437\u0430 20 \u0441\u0435\u043a.","84.8%","white",0],["\u041e\u043f\u0435\u0440\u0430\u0442\u043e\u0440\u043e\u0432",5,"#99ccff",0],["\u0410\u043a\u0442\u0438\u0432\u043d\u044b",5,"#ccffcc",0],["\u041e\u0442\u043e\u0448\u043b\u0438",0,"#eeeeee",0],["\u0421\u0432\u043e\u0431\u043e\u0434\u043d\u044b\u0445",2,"#ccffcc",0],["\u0424\u0438\u043a\u0441\u044f\u0442",0,"#ffccff",0],["\u0417\u0430\u043d\u044f\u0442\u044b",3,"#ffcccc",0],["\u0412\u0445\u043e\u0434\u044f\u0449\u0438\u0435",3,"#ffcccc",0],["\u0418\u0441\u0445\u043e\u0434\u044f\u0449\u0438\u0435",0,"#ffcccc",0],["\u041d\u0435 \u0432 \u043e\u0447\u0435\u0440\u0435\u0434\u0438",0,"#eeeeee",0],["\u041d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b",0,"#eeeeee",0],["\u0412\u044b\u0437\u043e\u0432\u044b \u0432 \u043e\u0447\u0435\u0440\u0435\u0434\u0438","0","white",1]]},"cache":false}
ENDJSON;

        $aJSON = json_decode($sJSON,true);
        return $this->result($aJSON['result']);
        */

        $this->sMe = __METHOD__;

        $aReturn = array(
            's' => array(
                0 => array(
                    'n' => 'Название',
                    't' => 'Текст'),
                1 => array(
                    'n' => 'Значение',
                    't' => 'Текст'),
                2 => array(
                    'n' => 'color',
                    't' => 'Текст'),
                3 => array(
                    'n' => 'stat',
                    't' => 'Число целое'),
            ),
            'd' => array()
        );

        if (!isset($aParams['Фильтр']['d'][0])) {
            return $this->error('Не указана Очередь!', $aParams);
        } else {
            $iQueue = intval($aParams['Фильтр']['d'][0]);
        }

        if ($iQueue == 0) {
            $aError = $this->error('Не указана Очередь!', $aParams);
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        }

        $oMemcached = TOOLS_Cache::getInstance();
        $sMemKey = __CLASS__ . '/' . __METHOD__ . '/' . $iQueue;

        $mReturn = $oMemcached->getData($sMemKey);

        if ($mReturn !== false) {
            $mReturn['cache'] = true;
            return $mReturn;
        }

        $oRPC = new NET_RPC();

        $sMemKeyQueue = __METHOD__ . '/Queue/' . $iQueue;
        $aQueue = $oMemcached->getData($sMemKeyQueue);

        if ($aQueue === false) {
            $aQueue = $oRPC->getQueue($iQueue);
            if ($aQueue === false) {
                return $this->error('Не получить очередь!', $aParams);
            }
            $oMemcached->setData($sMemKeyQueue, $aQueue, rand(590, 610));
        }

        $iATC = $aQueue['АТС'];
        $iQueue = $aQueue['Номер'];

        $aATC = $oRPC->getATC($iATC);

        if ($aATC === false) {
            $aError = $this->error('Не возможно получить АТС [' . $iATC . ']');
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        } else {
            $sATCName = $aATC['Имя'];
            $aServer = array(
                'server' => $aATC['AMIСервер'],
                'port' => $aATC['AMIПорт'],
                'user' => $aATC['AMIПользователь'],
                'pass' => $aATC['AMIПароль']
            );
            //$this->talk('Получены данные на АТС [' . $sATCName . ']', $aATC);
        }


        $aTmp = preg_split("/[ ,;]+/", trim($aATC['AMIСервер'], " \r\n;,"));
        $aServers = array();
        while (list($i, $v) = each($aTmp)) {
            $aServers[] = array(
                'server' => $v,
                'port' => $aATC['AMIПорт'],
                'user' => $aATC['AMIПользователь'],
                'pass' => $aATC['AMIПароль']
            );;
        }


        try {
            //$oAMI = new Net_AsteriskManager($aServer);
            $oAMIs = array();
            while (list($iS, $aS) = each($aServers)) {
                $oAMIs[] = new Net_AsteriskManager($aS);
            }
        } catch (PEAR_Exception $e) {
            $aError = $this->error('AMI [' . $sATCName . ']: ' . $e->getMessage() . '', $aATC['AMIСервер']);
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        }

        $sMemGetQueueStatusArray = __METHOD__ . '/getQueueStatusArray/' . $iATC;
        $aQueues = $oMemcached->getData($sMemGetQueueStatusArray);
        if ($aQueues === false) {
            reset($oAMIs);
            $aTmp = array();
            while (list($iA, $oA) = each($oAMIs)) {
                // сливаем данные
                $aTmp = $this->MergeData($aTmp, $oA->getQueueStatusArray());
            }
            $aQueues = $aTmp;
            $oMemcached->setData($sMemGetQueueStatusArray, $aQueues, 5);
        }

        //return $this->error("[$iATC][$iQueue]", $aQueues);

        if (!isset($aQueues[$iQueue])) {
            $aError = $this->error('Нет такой очереди [' . ($iQueue) . '] на АТС [' . $sATCName . ']!', $aQueues);
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        }

        $aQueue = $aQueues[$iQueue];

        $sMemKeyStat = __CLASS__ . '/stats/' . $iQueue;
        $aStat = $oMemcached->getData($sMemKeyStat);

        if ($aStat === false) {
            return $aResult = $this->result($aReturn);
        }

        $aRecords = array();

        /*
        $aRecords[] = array(
            'Очередь',
            $iQueue,
            '#ffff99',
            0
        );

        $aRecords[] = array(
            'Стратегия',
            $aQueue['Strategy'],
            '#ffff99',
            0
        );
        */
        $aRecords[] = array(
            'Время ответа сред.',
            $this->TM2($aQueue['Holdtime']),
            'white'
        );
        $aRecords[] = array(
            'Разговор сред.',
            $this->TM2($aQueue['TalkTime']),
            'white',
            0
        );
        $aRecords[] = array(
            'Принятых',
            $aQueue['Completed'],
            'white',
            1
        );
        $aRecords[] = array(
            'Непринятых',
            $aQueue['Abandoned'],
            'white',
            1
        );
        $aRecords[] = array(
            'Непринятых до входа',
            0,
            'white',
            0
        );
        $aRecords[] = array(
            'Автоответчик',
            0,
            'white',
            0
        );
        $aRecords[] = array(
            'Отвечено за ' . $aQueue['ServiceLevel'] . ' сек.',
            $aQueue['ServicelevelPerf'] . '%',
            'white',
            0
        );
        $aRecords[] = array(
            'Операторов',
            $aStat['opers'],
            '#99ccff',
            0
        );
        $aRecords[] = array(
            'Активны',
            $aStat['activ'],
            '#ccffcc',
            0
        );
        $aRecords[] = array(
            'Отошли',
            $aStat['away'],
            '#eeeeee',
            0
        );
        $aRecords[] = array(
            'Свободных',
            $aStat['free'],
            '#ccffcc',
            0
        );
        $aRecords[] = array(
            'Фиксят',
            $aStat['fix'],
            '#ffccff',
            0
        );
        $aRecords[] = array(
            'Заняты',
            $aStat['busy'],
            '#ffcccc',
            0
        );
        $aRecords[] = array(
            'Входящие',
            $aStat['in'],
            '#ffcccc',
            0
        );
        $aRecords[] = array(
            'Исходящие',
            $aStat['out'],
            '#ffcccc',
            0
        );
        /*
        $aRecords[] = array(
            'Не в очереди',
            $aStat['notinqueue'],
            '#eeeeee',
            0
        );
        */
        $aRecords[] = array(
            'Недоступны',
            $aStat['unknown'],
            '#eeeeee',
            0
        );
        $aRecords[] = array(
            'Вызовы в очереди',
            $aQueue['Calls'],
            'white',
            1
        );

        $aReturn['d'] = $aRecords;

        //$aError = $this->error('Очередь', $aQueue);
        $mReturn = $this->result($aReturn);
        $oMemcached->setData($sMemKey, $mReturn, rand(55, 65));
        $mReturn['cache'] = false;
        return $mReturn;

    }


    public
    function QueueCalls($aParams)
    {


        /*
        $sJSON = <<< ENDJSON
{"jsonrpc":"2.0","method":"EXT.QueueCalls","id":1,"protocol":2,"result":{"s":[{"n":"@\u0410\u0433\u0435\u043d\u0442","t":"\u0418\u0434\u0435\u043d\u0442\u0438\u0444\u0438\u043a\u0430\u0442\u043e\u0440"},{"n":"\u0418\u043c\u044f","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u041d\u043e\u043c\u0435\u0440","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u041e\u0442\u0432\u0435\u0442\u043e\u0432","t":"\u0427\u0438\u0441\u043b\u043e \u0446\u0435\u043b\u043e\u0435"},{"n":"\u0412\u0441\u0435\u0433\u043e","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u0421\u0440\u0435\u0434\u043d\u0435\u0435","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0439","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u041a\u0443\u0434\u0430","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u0412\u0440\u0435\u043c\u044f","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u0421\u043a\u0435\u043c","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u0421\u0442\u0430\u0442\u0443\u0441","t":"\u0427\u0438\u0441\u043b\u043e \u0446\u0435\u043b\u043e\u0435"},{"n":"\u0420\u0430\u0437\u0434\u0435\u043b","t":{"n":"\u0418\u0435\u0440\u0430\u0440\u0445\u0438\u044f","b":true,"f":"\u0418\u043c\u044f"}}],"d":[[5728,"\u041f\u044b\u0448\u043a\u0438\u043d\u0430 \u041d\u0430\u0442\u0430\u043b\u0438\u044f","1922",0," "," "," ","","","",0,[[null],true,null]],[5729,"\u0411\u0430\u0440\u0430\u0431\u0430\u043d\u043e\u0432\u0430 \u0421\u0432\u0435\u0442\u043b\u0430\u043d\u0430","1953",0," "," "," ",1,"00:00:03","\"unknown>",0,[[null],null,null]],[5730,"\u0411\u0430\u0447\u0435\u0440\u0438\u043a\u043e\u0432\u0430 \u041e\u043b\u044c\u0433\u0430","1948",0," "," "," ","","","",0,[[null],null,null]],[5731,"\u0411\u0435\u043a\u0435\u0442\u043e\u0432\u0430 \u0415\u043a\u0430\u0442\u0435\u0440\u0438\u043d\u0430","1934",0," "," "," ","","","",0,[[null],null,null]],[5732,"\u0411\u0435\u043b\u043e\u0446\u0435\u0440\u043a\u043e\u0432\u0435\u0446 \u041c\u0430\u0440\u0438\u044f","1960","0"," "," "," ","","","","5",[[null],null,null]],[5733,"\u0411\u0435\u043b\u044f\u043a\u043e\u0432\u0430 \u0410\u043d\u043d\u0430","1938",0," "," "," ","","","",0,[[null],null,null]],[5734,"\u0411\u0440\u0430\u0433\u0438\u043d\u0430 \u0410\u043d\u0430\u0441\u0442\u0430\u0441\u0438\u044f","1957","34"," "," "," ",2,"","1953","6",[[null],null,null]],[5735,"\u0415\u0433\u043e\u0440\u044b\u0447\u0435\u0432\u0430 \u0422\u0430\u0442\u044c\u044f\u043d\u0430","1937","7"," "," ","01:45:28","","","",999,[[null],null,null]],[5736,"\u0415\u0440\u043c\u043e\u043b\u0435\u043d\u043a\u043e \u041b\u044e\u0431\u043e\u0432\u044c","1952","41"," "," ","00:38:36","","","",999,[[null],null,null]],[5737,"\u0418\u0432\u0430\u043d\u043e\u0432\u0430 \u041b\u044e\u0434\u043c\u0438\u043b\u0430","1946",0," "," "," ","","","",0,[[null],null,null]],[5738,"\u041a\u043e\u043d\u0442\u043e\u0440\u0438\u043d\u0430 \u041c\u0430\u0440\u0433\u0430\u0440\u0438\u0442\u0430","1951",0," "," "," ",1,"03:32:24","<unknown>",0,[[null],null,null]],[5740,"\u041b\u0430\u0431\u0443\u0442\u043a\u0438\u043d\u0430 \u042e\u043b\u0438\u044f","1935",0," "," "," ",2,"00:00:13","74852402542",0,[[null],null,null]],[5744,"\u041b\u044b\u043a\u043e\u0432\u0430 \u0418\u0440\u0438\u043d\u0430","1958",0," "," "," ","","","",0,[[null],null,null]],[5741,"\u041c\u0430\u0441\u043b\u043e\u0432\u0430 \u0415\u043b\u0435\u043d\u0430","1956",0," "," "," ","","","",0,[[null],null,null]],[5742,"\u041c\u0430\u0445\u0430\u043d\u043e\u0432\u0430 \u041d\u0430\u0442\u0430\u043b\u044c\u044f","1942",0," "," "," ",2,"00:04:19","1930",0,[[null],null,null]],[5743,"\u041c\u0438\u0445\u0430\u0439\u043b\u043e\u0432\u0441\u043a\u0430\u044f \u0410\u043d\u0430\u0441\u0442\u0430\u0441\u0438\u044f","1943",0," "," "," ","","","",0,[[null],null,null]],[5745,"\u041f\u0438\u0440\u043e\u0433\u043e\u0432\u0430 \u0422\u0430\u0442\u044c\u044f\u043d\u0430","1950",0," "," "," ","","","",0,[[null],null,null]],[5746,"\u041f\u043e\u043b\u043a\u0430\u043d\u043e\u0432\u0430 \u041d\u0430\u0442\u0430\u043b\u0438\u044f","1959","44"," "," "," ",2,"00:01:45","79859982510","2",[[null],null,null]],[5747,"\u041f\u043e\u043b\u044f\u043d\u0441\u043a\u0430\u044f \u041d\u0430\u0442\u0430\u043b\u0438\u044f","1947",0," "," "," ",1,"00:00:02","<unknown>",0,[[null],null,null]],[5739,"\u0420\u0430\u0435\u0432\u0430 \u0415\u043b\u0435\u043d\u0430","1961","0"," "," "," ","","","",999,[[null],null,null]],[5748,"\u0421\u0435\u043a\u0440\u0435\u0442\u0430\u0440\u0435\u0432\u0430 \u0410\u043d\u043d\u0430","1945",0," "," "," ","","","",0,[[null],null,null]],[5749,"\u0421\u0435\u043b\u0435\u0434\u0446\u043e\u0432\u0430 \u041e\u043b\u044c\u0433\u0430","1588",0," "," "," ",1,"00:02:36","2328",0,[[null],null,null]],[5750,"\u0421\u043c\u0438\u0440\u043d\u043e\u0432\u0430 \u0415\u043a\u0430\u0442\u0435\u0440\u0438\u043d\u0430","1955","0"," "," "," ","","","","5",[[null],null,null]],[5751,"\u0422\u0438\u0445\u043e\u043d\u043e\u0432\u0430 \u0422\u0430\u0442\u044c\u044f\u043d\u0430","1954","3"," "," "," ",1,"00:00:33","088432289970","2",[[null],null,null]],[5753,"\u0428\u0430\u0431\u0430\u043b\u0438\u043d\u0430 \u0415\u043b\u0435\u043d\u0430","1963",0," "," "," ","","","",0,[[null],null,null]],[5754,"\u0428\u0435\u0438\u043d\u0430 \u041a\u0441\u0435\u043d\u0438\u044f","1936",0," "," "," ","","","",0,[[null],null,null]],[5752,"\u042f\u0441\u043d\u0438\u043a\u043e\u0432\u0430 \u041e\u043b\u044c\u0433\u0430","1944",0," "," "," ","","","",0,[[null],null,null]],[0,"(1937)","1937","7"," "," ","01:45:28","","","",999,[[null],null,null]]]},"cache":false,"status":0,"count":28}
ENDJSON;
        $aJSON = json_decode($sJSON,true);
        return $this->result($aJSON['result']);
        */


        $this->sMe = __METHOD__;

        $aReturn = array(
            's' => array(
                0 => array(
                    'n' => '@Агент',
                    't' => 'Идентификатор'),
                1 => array(
                    'n' => 'Имя',
                    't' => 'Текст'),
                2 => array(
                    'n' => 'Номер',
                    't' => 'Текст'),
                3 => array(
                    'n' => 'Ответов',
                    't' => 'Число целое'),
                4 => array(
                    'n' => 'Всего',
                    't' => 'Текст'),
                5 => array(
                    'n' => 'Среднее',
                    't' => 'Текст'),
                6 => array(
                    'n' => 'Последний',
                    't' => 'Текст'),
                7 => array(
                    'n' => 'Куда',
                    't' => 'Текст'),
                8 => array(
                    'n' => 'Время',
                    't' => 'Текст'),
                9 => array(
                    'n' => 'Скем',
                    't' => 'Текст'),
                10 => array(
                    'n' => 'Статус',
                    't' => 'Число целое'),
                11 => array(
                    'n' => 'Раздел',
                    's' => 'Иерархия',
                    't' => 'Идентификатор',
                ),
                12 => array(
                    'n' => 'Раздел@',
                    's' => 'Иерархия',
                    't' => 'Логическое',
                ),
                13 => array(
                    'n' => 'Раздел$',
                    's' => 'Иерархия',
                    't' => 'Логическое',
                ),
            ),
            'd' => array()
        );

        if (!isset($aParams['Фильтр']['d'][0])) {
            return $this->error('Не указана Очередь!', $aParams);
        } else {
            $iQueue = intval($aParams['Фильтр']['d'][0]);
        }

        if (isset($aParams['Фильтр']['d'][1])) {
            $this->iStatus = intval($aParams['Фильтр']['d'][1]);
        }

        if ($iQueue == 0) {
            $aError = $this->error('Не указана Очередь!', $aParams);
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        }

        $oMemcached = TOOLS_Cache::getInstance();

        $sMemKey = __METHOD__ . '/' . $iQueue . '/' . $this->iStatus;

        $mReturn = $oMemcached->getData($sMemKey);

        ////
        $mReturn = false;

        if ($mReturn !== false) {
            $mReturn['cache'] = true;
            return $mReturn;
        }

        $this->iDeadline = mktime(0, 0, 0, date('m'), date('d'), date('Y'));

        $oRPC = new NET_RPC();

        $iQueueID = $iQueue;

        $sMemKeyQueue = __METHOD__ . '/Queue/' . $iQueue;
        $aQueue = $oMemcached->getData($sMemKeyQueue);
        if ($aQueue === false) {
            $aQueue = $oRPC->getQueue($iQueue);
            if ($aQueue === false) {
                return $this->error('Не получить очередь!', $aParams);
            }
            $oMemcached->setData($sMemKeyQueue, $aQueue, rand(590, 610));
        }

        $iATC = $aQueue['АТС'];
        $iQueue = $aQueue['Номер'];
        // время обработки состояния "фиксед"
        $iTimeFixed = intval($aQueue['ВремяОбработки'] / 1000);

        $sMemKeyATC = __METHOD__ . '/ATC/' . $iQueue . '/' . $iATC;
        $aATC = $oMemcached->getData($sMemKeyATC);
        ////
        //$aATC = false;
        if ($aATC === false) {
            $aATC = $oRPC->getATC($iATC);
            if ($aATC === false) {
                $aError = $this->error('Не возможно получить АТС [' . $iATC . ']');
                $aResult = $this->result($aReturn);
                return array_merge($aResult, $aError);
            }
        }

        $sATCName = $aATC['Имя'];

        ////
        // tel-pbx15-callcenter.unix.tensor.ru
        //tel-pbx16-callcenter.unix.tensor.ru
        //$aATC['AMIСервер'] = 'tel-pbx15-callcenter.unix.tensor.ru, tel-pbx16-callcenter.unix.tensor.ru';
        $aTmp = preg_split("/[ ,;]+/", trim($aATC['AMIСервер'], " \r\n;,"));
        $aServers = array();
        while (list($i, $v) = each($aTmp)) {
            $aServers[] = array(
                'server' => $v,
                'port' => $aATC['AMIПорт'],
                'user' => $aATC['AMIПользователь'],
                'pass' => $aATC['AMIПароль']
            );;
        }

        //$this->talk('Получены данные на АТС [' . $sATCName . ']', $aATC);

        $aDb = array(
            'host' => $aATC['DBСервер'],
            'dbdb' => $aATC['DBБаза'],
            'user' => $aATC['DBПользователь'],
            'pass' => $aATC['DBПароль']
        );

        $this->oDb = new NET_DB($aDb);

        $oMemcached->setData($sMemKeyATC, $aATC, rand(590, 610));
        try {
            $oAMIs = array();
            while (list($iS, $aS) = each($aServers)) {
                $oAMIs[] = new Net_AsteriskManager($aS);
            }

        } catch (PEAR_Exception $e) {
            $aError = $this->error('AMI! [' . $sATCName . ']: ' . $e->getMessage() . '', $aATC['AMIСервер']);
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        }

        $sMemGetStatusArray = __METHOD__ . '/getStatusArray/' . $iATC;
        $this->aStatus = $oMemcached->getData($sMemGetStatusArray);

        if ($this->aStatus === false) {
            reset($oAMIs);
            while (list($iA, $oA) = each($oAMIs)) {
                $this->aStatus[$iA] = $oA->getStatusArray();
            }
            $oMemcached->setData($sMemGetStatusArray, $this->aStatus, 5);
        }

        /*
        ob_start();
        print_r($this->aStatus);
        $buf = ob_get_contents();
        ob_end_clean();
        file_put_contents('channels.txt',$buf);
        */
        //return $this->error('Статус',$aStatus);

        $sMemGetQueueStatusArray = __METHOD__ . '/getQueueStatusArray/' . $iATC;
        $aQueues = $oMemcached->getData($sMemGetQueueStatusArray);
        if ($aQueues === false) {
            reset($oAMIs);
            $aTmp = array();
            while (list($iA, $oA) = each($oAMIs)) {
                // сливаем данные
                $aTmp = $this->MergeData($aTmp, $oA->getQueueStatusArray());
            }
            $aQueues = $aTmp;
            $oMemcached->setData($sMemGetQueueStatusArray, $aQueues, 5);
        }

        //return $this->error('Данные очереди ['.($iQueue).']',$aQueues);
        ////
        //$iQueue = 2698;

        if (!isset($aQueues[$iQueue])) {
            $aError = $this->error('Нет такой очереди [' . ($iQueue) . '] на АТС [' . $sATCName . ']!', $aQueues);
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        }

        $aQueue = $aQueues[$iQueue];

        //print_r($aQueues);
        //exit();

        $this->aMembers = $aQueue['_members'];
        //return $this->error('Очередь!', $aQueue);

        $sMemKeyAgentsInQueue = __METHOD__ . '/AgentsInQueue/' . $iQueue . '/' . $iATC;
        $aAgents = $oMemcached->getData($sMemKeyAgentsInQueue);
        if ($aAgents === false) {
            $aAgents = $oRPC->getUsersInQueue($iQueueID, true);
            $oMemcached->setData($sMemKeyAgentsInQueue, $aAgents, rand(590, 610));
        }

        //return $this->error('Агенты!', $aAgents);

        $iName = -1;
        $iNumber = -1;
        $iRazdel = -1;
        $iAgent = -1;
        while ((list($iK, $aV) = each($aAgents['s'])) !== false) {
            if ($aV['n'] == 'Агент.Имя')
                $iName = $iK;
            if ($aV['n'] == 'Агент.Номер')
                $iNumber = $iK;
            if ($aV['n'] == 'Агент.Раздел')
                $iRazdel = $iK;
            if ($aV['n'] == 'Агент')
                $iAgent = $iK;
        }

        //print("[$iName][$iNumber]");
        //exit();

        $aRecords = array();
        $aMembers = $this->aMembers;

        $this->aAgents = $this->resort($aAgents['d'], $iName);
        reset($this->aAgents);

        //return $this->error('Агенты!', $_SERVER );

        $aTmp = $this->aAgents;
        while ((list($iK, $aAgent) = each($this->aAgents)) !== false) {
            $bBoss = $aAgent[$iRazdel][1];
            if (!$bBoss) {
                continue;
            }
            $iAg = $aAgent[$iAgent];
            $sName = $aAgent[$iName];
            $iNum = $aAgent[$iNumber];
            $iCallsTaken = 0;
            $sTotal = '';
            $sMiddle = '';
            $sLast = '';
            $sDirection = '';
            $sTime = '';
            $sWho = '';
            $iStatus = 0;
            $iBoss = $aAgent[$iRazdel][0][0];
            $aRecords[] = $this->makeRow($iAg, $sName, $iNum, $iCallsTaken, $sTotal, $sMiddle, $sLast, $sDirection, $sTime, $sWho, $iStatus, $iBoss, $bBoss, $iTimeFixed);

            unset($aMembers['SIP/' . $iNum]);

            reset($aTmp);
            while ((list($iK2, $aAgent2) = each($aTmp)) !== false) {
                //continue;
                if ($aAgent2[$iRazdel][0][0] == $aAgent[$iAgent]) {
                    $iAg = $aAgent2[$iAgent];
                    $sName = '' . $aAgent2[$iName];
                    $iNum = $aAgent2[$iNumber];
                    $iCallsTaken = 0;
                    $sTotal = '';
                    $sMiddle = '';
                    $sLast = '';
                    $sDirection = '';
                    $sTime = '';
                    $sWho = '';
                    $iStatus = 0;
                    $bBoss = false;
                    $iBoss = $aAgent2[$iRazdel][0][0];
                    $aRecords[] = $this->makeRow($iAg, $sName, $iNum, $iCallsTaken, $sTotal, $sMiddle, $sLast, $sDirection, $sTime, $sWho, $iStatus, $iBoss, $bBoss, $iTimeFixed);
                    unset($aMembers['SIP/' . $iNum]);
                    unset($this->aAgents[$iK2]);
                }
            }
            unset($this->aAgents[$iK]);
        }

        reset($this->aAgents);
        while ((list($iK, $aAgent) = each($this->aAgents)) !== false) {
            $iAg = $aAgent[$iAgent];
            $sName = $aAgent[$iName];
            $iNum = $aAgent[$iNumber];
            $iCallsTaken = 0;
            $sTotal = '';
            $sMiddle = '';
            $sLast = '';
            $sDirection = '';
            $sTime = '';
            $sWho = '';
            $iStatus = 0;
            $bBoss = null;
            $iBoss = null;
            $aRecords[] = $this->makeRow($iAg, $sName, $iNum, $iCallsTaken, $sTotal, $sMiddle, $sLast, $sDirection, $sTime, $sWho, $iStatus, $iBoss, $bBoss, $iTimeFixed);
            unset($aMembers['SIP/' . $iNum]);
        }

        while ((list($iK, $aAgent) = each($aMembers)) !== false) {
            $iAg = 0;
            $sName = '(' . $aAgent['Name'] . ')';
            $iNum = $aAgent['Name'];
            $iCallsTaken = 0;
            $sTotal = '';
            $sMiddle = '';
            $sLast = '';
            $sDirection = '';
            $sTime = '';
            $sWho = '';
            $iStatus = 0;
            $bBoss = null;
            $iBoss = null;
            $aRecords[] = $this->makeRow($iAg, $sName, $iNum, $iCallsTaken, $sTotal, $sMiddle, $sLast, $sDirection, $sTime, $sWho, $iStatus, $iBoss, $bBoss, $iTimeFixed);
            unset($aMembers['SIP/' . $iNum]);
        }


        $aR = array();
        reset($aRecords);
        while ((list($iCnt, $mVal) = each($aRecords)) !== false) {
            if ($mVal === false)
                continue;
            $aR[] = $mVal;
        }
        $aReturn['d'] = $aR;

        //$aError = $this->error('Агенты', $aTmp);
        $aError = array();
        $mReturn = $this->result(array_merge($aReturn, $aError));
        $mReturn['timefixed'] = $iTimeFixed;
        $oMemcached->setData($sMemKey, $mReturn, rand(13, 17));

        $mReturn['cache'] = false;
        $mReturn['status'] = $this->iStatus;
        $mReturn['count'] = count($aRecords);

        /*

            private $iFree = 0;
            private $iFix = 0;
            private $iBusy = 0;
            private $iIn = 0;
            private $iOut = 0;
            private $iNotInQuete = 0;
            private $iUnknown = 0;



        */
        $aStat = array();
        $aStat['opers'] = $this->iOpers;
        $aStat['activ'] = $this->iActiv;
        $aStat['away'] = $this->iAway;
        $aStat['free'] = $this->iFree;
        $aStat['fix'] = $this->iFix;
        $aStat['busy'] = $this->iBusy;
        $aStat['in'] = $this->iIn;
        $aStat['out'] = $this->iOut;
        $aStat['notinqueue'] = $this->iNotInQuete;
        $aStat['unknown'] = $this->iUnknown;

        $sMemKeyStat = __CLASS__ . '/stats/' . $iQueue;
        $oMemcached->setData($sMemKeyStat, $aStat);

        $mReturn['queue'] = $iQueue;

        return $mReturn;

    }

    private function resort($aArr, $sName)
    {

        reset($aArr);
        $aResort = array();
        $iCnt = 0;
        while ((list($mKey, $mVal) = each($aArr)) !== false) {
            $mVal[self::Resort] = $mKey;
            if (isset($mVal[$sName]))
                $aResort[$mVal[$sName] . ($iCnt++)] = $mVal;
            else
                $aResort[$mVal[$sName]] = $mVal;
        }


        ksort($aResort);
        reset($aResort);
        $aArr = array();
        while ((list($mKey, $mVal) = each($aResort)) !== false) {
            $mOldKey = $mVal[self::Resort];
            unset($mVal[self::Resort]);
            $aArr[$mOldKey] = $mVal;
        }
        return $aArr;
    }

    public
    function StatCalls($aParams)
    {

        $this->sMe = __METHOD__;

        if (!isset($aParams['Фильтр']['d'][0])) {
            return $this->error('Не указана АТС!', $aParams);
        } else {
            $iATC = intval($aParams['Фильтр']['d'][0]);
        }

        $oRPC = new NET_RPC();

        $aATC = $oRPC->getATC($iATC);

        if ($aATC === false) {
            return $this->error('Не возможно получить АТС [' . $iATC . ']');
        } else {
            $sATCName = $aATC['Имя'];
            $aServer = array(
                'server' => $aATC['AMIСервер'],
                'port' => $aATC['AMIПорт'],
                'user' => $aATC['AMIПользователь'],
                'pass' => $aATC['AMIПароль']
            );
            $aDb = array(
                'host' => $aATC['DBСервер'],
                'port' => $aATC['DBПорт'],
                'dbdb' => $aATC['DBБаза'],
                'user' => $aATC['DBПользователь'],
                'pass' => $aATC['DBПароль']

            );
            $this->talk('Получены данные на АТС [' . $sATCName . ']', $aDb);
        }

        //print(1);

        $oDb = new NET_DB($aDb);


        //print(2) ;

        $aCalls = $oDb->queryObjects("
            SELECT
                *
            FROM
                `cdr`
            WHERE
                SUBSTRING(`dst`,1,1) != '*'
            ORDER BY
                `calldate` DESC
            LIMIT
               50
        ");


        $oRecords = new NET_RECORDS();
        $oRecords->addColumn('Дата');
        $oRecords->addColumn('Кто');
        $oRecords->addColumn('Направление');
        $oRecords->addColumn('Куда');
        $oRecords->addColumn('Всего');
        $oRecords->addColumn('Ожидание');
        $oRecords->addColumn('Разговор');

        while ((list($iCall, $aCall) = each($aCalls)) !== false) {

            $aRow = array();
            $aRow['Дата'] = $aCall->calldate;
            $aRow['Кто'] = $aCall->src;
            $aRow['Куда'] = $aCall->dst;

            $aRow['Направление'] = '→';

            $aRow['Всего'] = $this->dt($aCall->duration);
            $aRow['Ожидание'] = $this->dt($aCall->duration - $aCall->billsec);
            $aRow['Разговор'] = $this->dt($aCall->billsec);

            $oRecords->addRow($aRow);
        }

        $aRecords = $oRecords->getJSON();

        return $this->result($aRecords);

    }

    public
    function QueueIncomings($aParams)
    {

        /*
        $sJSON = <<< ENDJSON
{"jsonrpc":"2.0","method":"EXT.QueueIncomings","id":1,"protocol":2,"result":{"s":[{"n":"\u041d\u043e\u043c\u0435\u0440","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u041e\u0436\u0438\u0434\u0430\u043d\u0438\u0435","t":"\u0422\u0435\u043a\u0441\u0442"},{"n":"\u041f\u043e\u0437\u0438\u0446\u0438\u044f","t":"\u0427\u0438\u0441\u043b\u043e \u0446\u0435\u043b\u043e\u0435"}],"d":[]},"cache":false}
ENDJSON;

        $aJSON = json_decode($sJSON,true);
        return $this->result($aJSON['result']);
        */

        $this->sMe = __METHOD__;

        $aReturn = array(
            's' => array(
                0 => array(
                    'n' => 'Номер',
                    't' => 'Текст'),
                1 => array(
                    'n' => 'Ожидание',
                    't' => 'Текст'),
                2 => array(
                    'n' => 'Позиция',
                    't' => 'Число целое'),
            ),
            'd' => array()
        );

        if (!isset($aParams['Фильтр']['d'][0])) {
            return $this->error('Не указана Очередь!', $aParams);
        } else {
            $iQueue = intval($aParams['Фильтр']['d'][0]);
        }

        if ($iQueue == 0) {
            $aError = $this->error('Не указана Очередь!', $aParams);
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        }

        $oMemcached = TOOLS_Cache::getInstance();
        $sMemKey = __METHOD__ . '/' . $iQueue;

        $mReturn = $oMemcached->getData($sMemKey);
        if ($mReturn !== false) {
            $mReturn['cache'] = true;
            return $mReturn;
        }

        $oRPC = new NET_RPC();

        $iQueueID = $iQueue;
        $aQueue = $oRPC->getQueue($iQueue);
        if ($aQueue === false) {
            $aError = $this->error('Не получить очередь!', $aParams);
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        }

        //return $this->error('Очередь!', $aQueue);
        $iATC = $aQueue['АТС'];
        $iQueue = $aQueue['Номер'];

        $aATC = $oRPC->getATC($iATC);

        if ($aATC === false) {
            $aError = $this->error('Не возможно получить АТС [' . $iATC . ']');
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        } else {
            $sATCName = $aATC['Имя'];
            $aServer = array(
                'server' => $aATC['AMIСервер'],
                'port' => $aATC['AMIПорт'],
                'user' => $aATC['AMIПользователь'],
                'pass' => $aATC['AMIПароль']
            );
            //$this->talk('Получены данные на АТС [' . $sATCName . ']', $aATC);
        }

        $aTmp = preg_split("/[ ,;]+/", trim($aATC['AMIСервер'], " \r\n;,"));
        $aServers = array();
        while (list($i, $v) = each($aTmp)) {
            $aServers[] = array(
                'server' => $v,
                'port' => $aATC['AMIПорт'],
                'user' => $aATC['AMIПользователь'],
                'pass' => $aATC['AMIПароль']
            );;
        }

        try {
            //$oAMI = new Net_AsteriskManager($aServer);
            $oAMIs = array();
            while (list($iS, $aS) = each($aServers)) {
                $oAMIs[] = new Net_AsteriskManager($aS);
            }
        } catch (PEAR_Exception $e) {
            // Server error
            header('HTTP/1.1 500 Internal Server Error');
            $aError = $this->error('AMI [' . $sATCName . ']: ' . $e->getMessage() . '', $aATC['AMIСервер']);
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        }

        //$aQueues = $oAMI->getQueueStatusArray();
        $sMemGetQueueStatusArray = __METHOD__ . '/getQueueStatusArray/' . $iATC;
        $aQueues = $oMemcached->getData($sMemGetQueueStatusArray);
        if ($aQueues === false) {
            reset($oAMIs);
            $aTmp = array();
            while (list($iA, $oA) = each($oAMIs)) {
                // сливаем данные
                $aTmp = $this->MergeData($aTmp, $oA->getQueueStatusArray());
            }
            $aQueues = $aTmp;
            $oMemcached->setData($sMemGetQueueStatusArray, $aQueues, 5);
        }

        if (!isset($aQueues[$iQueue])) {
            $aError = $this->error('Нет такой очереди [' . ($iQueue) . '] на АТС [' . $sATCName . ']!', $aQueues);
            $aResult = $this->result($aReturn);
            return array_merge($aResult, $aError);
        }

        $aQueue = $aQueues[$iQueue];

        $aRecords = array();

        $iNum = 1;
        while ((list($iE, $aE) = each($aQueue['_entrys'])) !== false) {
            $aRecords[] = array(
                $aE['CallerIDNum'],
                $this->TM2($aE['Wait'], true),
                $aE['Position']
            );
        }

        $aReturn['d'] = $aRecords;

        $mReturn = $this->result($aReturn);
        $oMemcached->setData($sMemKey, $mReturn, rand(25, 35));
        $mReturn['cache'] = false;
        return $mReturn;

    }


    private
    function dt($iTime)
    {

        $iNow = mktime(0, 0, 0, date('m'), date('d'), date('Y'));

        return date('H:i:s', ($iNow + $iTime));

    }

    private function MergeMembers($aS, $aM)
    {

        $aResult = $aS;
        while (list($k, $v) = each($aM)) {
            switch ($k) {
                case 'CallsTaken':
                    $aResult[$k] = $aS[$k] + $aM[$k];
                    break;
                case 'LastCall':
                    $aResult[$k] = max($aS[$k],$aM[$k]);
                    break;
                default:
                    if (!isset($aResult[$k]))
                        $aResult[$k] = $v;
                    else {
                        $aU = $aResult[$k];
                        if ($aM['Status'] != 5) {
                            $aResult[$k] = $aM['Status'];
                            if($aM['Paused']) {
                                $aResult[$k] = $aM['Paused'];
                            }
                        } else {
                            $aResult[$k] = $aS['Status'];
                        }
                    }
                    break;
            }
        }
        return $aResult;

    }

    private function MergeQueue($aS, $aM)
    {

        //print("1================================\n");
        $aResult = array();
        while (list($k, $v) = each($aM)) {
            switch ($k) {
                case 'Calls':
                case 'Completed':
                case 'Abandoned':
                    if (isset($aS[$k]))
                        $aResult[$k] = $aS[$k] + $aM[$k];
                    else
                        $aResult[$k] = $aM[$k];
                    break;
                case 'Holdtime':
                    $aResult[$k] = max($aS[$k], $aM[$k]);
                    break;
                case 'TalkTime':
                    $aResult[$k] = ($aS[$k] + $aM[$k]) / 2;
                    break;
                case '_members':
                    if (isset($aS[$k])) {
                        $aResult[$k] = $this->MergeMembers($aS[$k], $v);
                    } else {
                        $aResult[$k] = $v;
                    }
                    break;
                case '_entrys':
                    $aResult[$k] = array_merge($aS[$k], $aM[$k]);
                    break;
                default:
                    $aResult[$k] = $v;
                    break;
            }
        }

        //print("1================================\n");
        return $aResult;

    }

    private function MergeData($aSource, $aMerge)
    {
        $aResult = array();

        //print("2================================\n");

        reset($aMerge);
        while (list($iQ, $aQ) = each($aMerge)) {
            if (!isset($aSource[$iQ])) {
                $aResult[$iQ] = $aQ;
            } else {
                $aResult[$iQ] = $this->MergeQueue($aSource[$iQ], $aQ);
            }
        }

        //print("2================================\n");
        return $aResult;

    }


}