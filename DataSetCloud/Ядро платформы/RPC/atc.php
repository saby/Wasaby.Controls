<?php
/**
 * RPC обслуживания АТС
 *
 * @version $Id: atc.php 105 2011-09-27 14:01:23Z golubevaf $
 */


/**
 * RPC обслуживания АТС
 */
class RPC_ATC extends RPC_RPC
{

    public function getNumbersFromATC($aParams)
    {

        if (!isset($aParams['atc'])) {
            return $this->error('Не указана АТС!', $aParams);
        } else {
            $iATC = intval($aParams['atc']);
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
            $this->talk('Получены данные на АТС [' . $sATCName . ']', $aATC);
        }

        $aTmp = $oRPC->getUsers($iATC, true);
        $aNames = $aTmp['s'];
        $aUsers = $aTmp['d'];

        if ($aUsers === false) {
            return $this->error('Не возможно получить список абонентов для АТС [' . $sATCName . ']');
        } else {

            $iNumber = -1;
            while ((list($iKey, $aVal) = each($aNames)) !== false) {
                if ($aVal['n'] == 'Номер') {
                    $iNumber = $iKey;
                }
            }

            $aTmp = array();
            while ((list($iKey, $aUser) = each($aUsers)) !== false) {
                $aTmp[intval($aUser[$iNumber])] = $aUser;

            }
            $aUsers = $aTmp;

            $this->talk('Загружено [' . count($aUsers) . '] абонентов АТС', $aUsers);
        }

        $oAMI = new Net_AsteriskManager($aServer);

        $aAMIUsers = $oAMI->getClientsArray();

        $this->talk('Загружено [' . count($aAMIUsers) . '] абонентов AMI', $aAMIUsers);


        $iCnt = 0;
        $iNum = 0;
        while ((list($iNumber, $aUser) = each($aAMIUsers)) !== false) {

            if (is_numeric($iNumber) AND ($iNumber < 7000 OR $iNumber > 7099)) {
                if (!isset($aUsers[$iNumber])) {
                    $iCnt++;

                    $iClient = $oRPC->ClientCreate($iATC);

                    if ($iClient === false) {
                        return $this->error('Не возможно создать Абонента');
                    }

                    $oRPC->ClientUpdate($iClient, $iNumber, '[' . $iNumber . ']', $iATC);

                }
            } else {
                $iNum++;
            }
        }
        $this->talk('Не номера [' . $iNum . ']', $iCnt);
        $this->talk('Добавлено [' . $iCnt . '] абонентов', $iCnt);

        return $this->message($this->getTalk('; '), $this->getData());

    }

    public function getQueuesFromATC($aParams)
    {

        if (!isset($aParams['atc'])) {
            return $this->error('Не указана АТС!', $aParams);
        } else {
            $iATC = intval($aParams['atc']);
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
            $this->talk('Получены данные на АТС [' . $sATCName . ']', $aATC);
        }

        $aTmp = $oRPC->getUsers($iATC, true);
        $aNames = $aTmp['s'];
        $aUsers = $aTmp['d'];

        if ($aUsers === false) {
            return $this->error('Не возможно получить список абонентов для АТС [' . $sATCName . ']');
        } else {

            $iNumber = -1;
            while ((list($iKey, $aVal) = each($aNames)) !== false) {
                if ($aVal['n'] == 'Номер') {
                    $iNumber = $iKey;
                }
            }
            $aTmp = array();
            while ((list($iKey, $aUser) = each($aUsers)) !== false) {
                $aTmp[intval($aUser[$iNumber])] = $aUser;

            }
            $aUsers = $aTmp;

            $this->talk('Загружено [' . count($aUsers) . '] абонентов АТС', $aUsers);
        }

        $aQueues = $oRPC->getQueues($iATC);

        /*

         [0] => Array
                (
                    [0] => 2218
                    [1] => Менеджеры
                    [2] => 9027
                    [3] => 2163
                    [4] => 2
                )

        */
        if ($aQueues === false) {
            return $this->error('Не возможно получить список очередей для АТС [' . $sATCName . ']');
        } else {

            $aTmp = array();
            while ((list($iKey, $aQueue) = each($aQueues)) !== false) {
                $aTmp[intval($aQueue[2])] = $aQueue;
            }
            $aQueues = $aTmp;

            $this->talk('Загружено [' . count($aQueues) . '] очередей АТС', $aQueues);
        }

        $oAMI = new Net_AsteriskManager($aServer);

        $aAMIQueues = $oAMI->getQueueStatusArray();

        $this->talk('Загружено [' . count($aAMIQueues) . '] очередей AMI', $aAMIQueues);

        $iCnt = 0;
        $iNum = 0;
        while ((list($iNumber, $aQueue) = each($aAMIQueues)) !== false) {

            if (is_numeric($iNumber)) {
                if (!isset($aQueues[$iNumber])) {
                    $iCnt++;

                    $iQueue = $oRPC->QueueCreate($iATC);

                    if ($iQueue === false) {
                        return $this->error('Не возможно создать очередь [' . $iNumber . ']');
                    }

                    $oRPC->QueueUpdate($iQueue, $iNumber, '[' . $iNumber . ']', $iATC);

                }
            } else {
                $iNum++;
            }
        }
        $this->talk('Не номера [' . $iNum . ']', $iCnt);
        $this->talk('Добавлено [' . $iCnt . '] очередей', $iCnt);

        /// Абоненты в очеердях...

        $aTmp = $oRPC->getUsersAll(true);
        $aUsers = $aTmp['d'];
        $aNames = $aTmp['s'];

        if ($aUsers === false) {
            return $this->error('Не возможно получить список абонентов для АТС [' . $sATCName . ']');
        } else {
            $xNumber = -1;
            $xKey = -1;
            while ((list($iKey, $aVal) = each($aNames)) !== false) {
                if ($aVal['n'] == '@Агент') {
                    $xKey = $iKey;
                }
                if ($aVal['n'] == 'Номер') {
                    $xNumber = $iKey;
                }
            }
            $aTmp = array();
            while ((list($iKey, $aUser) = each($aUsers)) !== false) {
                $aTmp[intval($aUser[$xNumber])] = $aUser[$xKey][0];
            }
            $aUsers = $aTmp;
            $this->talk('Загружено [' . count($aUsers) . '] абонентов АТС', $aUsers);
        }

        $aTmp = $oRPC->getQueues($iATC, true);

        $aNames = $aTmp['s'];
        $aQueues = $aTmp['d'];

        if ($aQueues === false) {
            return $this->error('Не возможно получить список очередей для АТС [' . $sATCName . ']');
        } else {
            $xNumber = -1;
            $xKey = -1;
            while ((list($iKey, $aVal) = each($aNames)) !== false) {
                if ($aVal['n'] == '@Очередь') {
                    $xKey = $iKey;
                }
                if ($aVal['n'] == 'Номер') {
                    $xNumber = $iKey;
                }
            }
            $aTmp = array();
            while ((list($iKey, $aQueue) = each($aQueues)) !== false) {
                $aTmp[intval($aQueue[$xNumber])] = $aQueue[$xKey][0];
            }
            $aQueues = $aTmp;

            $this->talk('Загружено [' . count($aQueues) . '] очередей АТС', $aQueues);
        }

        $aAbonentInQueue = array();

        while ((list($iQueue, $iQueueId) = each($aQueues)) !== false) {

            $aTmp = $oRPC->getUsersInQueue($iQueueId, true);
            //$this->talk('Загружено [' . count($aTmp) . ']', $aTmp);
            $aNames = $aTmp['s'];
            $aA2Q = $aTmp['d'];
            $xAgent = -1;
            while ((list($iKey, $aVal) = each($aNames)) !== false) {
                if ($aVal['n'] == 'Агент.Номер') {
                    $xAgent = $iKey;
                }
            }

            //$this->talk('Загружено [' . count($aA2Q) . ']', $aA2Q);
            while ((list($iAbonent, $aAbonent) = each($aA2Q)) !== false) {
                $aAbonentInQueue[intval($aAbonent[$xAgent])][] = $iQueue;
            }

        }

        //$this->talk('Связь', $aAbonentInQueue);

        reset($aAMIQueues);
        $iAdd = 0;
        $iOld = 0;
        while ((list($iQueue, $aQueue) = each($aAMIQueues)) !== false) {
            while ((list($sSIP, $aMember) = each($aQueue['_members'])) !== false) {
                $iNum = $aMember['Name'];
                $bDo = true;
                if (isset($aAbonentInQueue[$iNum])) {
                    foreach ($aAbonentInQueue[$iNum] as $iQ) {
                        if ($iQ == $iQueue) {
                            $bDo = false;
                            break;
                        }
                    }
                }
                if ($bDo) {
                    if (!isset($aUsers[$iNum])) {
                        return $this->message('Не все абоненты импортированы. Перед операцией выполните/проверьте импорт аонентов АТС!');
                    }
                    if (is_numeric($iQueue)) {
                        $oRPC->AbonentInQueueCreate($aUsers[$iNum], $aQueues[$iQueue]);
                        //$this->talk('Вставить ['.$aUsers[$iNum].'] в ['.$aQueues[$iQueue].']');
                        $iAdd++;
                    }
                } else {
                    // уже вставлен!
                    $iOld++;
                }
            }
        }
        $this->talk('Добавлено/состоят [' . $iAdd . ']/[' . $iOld . ']');

        return $this->message($this->getTalk('; '), $this->getData());

    }


    public function setActiveClients    ($aParams)
    {

        if (!isset($aParams['atc'])) {
            return $this->error('Не указана АТС!', $aParams);
        } else {
            $iATC = intval($aParams['atc']);
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
            $this->talk('Получены данные на АТС [' . $sATCName . ']', $aATC);
        }

        $aTmp = $oRPC->getUsers($iATC, true);
        $aNames = $aTmp['s'];
        $aUsers = $aTmp['d'];
        //$this->talk('Получено [' . count($aTmp) . '] абонентов АТС', $aTmp);

        if ($aUsers === false) {
            return $this->error('Не возможно получить список абонентов для АТС [' . $sATCName . ']');
        } else {

            $iNumber = -1;
            $iAgent = -1;
            $iName = -1;
            while ((list($iKey, $aVal) = each($aNames)) !== false) {
                if ($aVal['n'] == '@Агент') {
                    $iAgent = $iKey;
                }
                if ($aVal['n'] == 'Номер') {
                    $iNumber = $iKey;
                }
                if ($aVal['n'] == 'Имя') {
                    $iName = $iKey;
                }
            }

            while ((list($iKey, $aUser) = each($aUsers)) !== false) {
                $iClient = $aUser[$iAgent];
                $sNumber = $aUser[$iNumber];
                $sName = $aUser[$iName];
                $oRPC->ClientUpdate($iClient, $sNumber, $sName, $iATC);
            }
            $this->talk('Обработано [' . count($aUsers) . '] абонентов.', $aUsers);
        }

        return $this->message($this->getTalk('; '), $this->getData());


        $oAMI = new Net_AsteriskManager($aServer);

        $aAMIUsers = $oAMI->getClientsArray();

        $this->talk('Загружено [' . count($aAMIUsers) . '] абонентов AMI', $aAMIUsers);


        $iCnt = 0;
        $iNum = 0;
        while ((list($iNumber, $aUser) = each($aAMIUsers)) !== false) {

            if (is_numeric($iNumber) AND ($iNumber < 7000 OR $iNumber > 7099)) {
                if (!isset($aUsers[$iNumber])) {
                    $iCnt++;

                    $iClient = $oRPC->ClientCreate($iATC);

                    if ($iClient === false) {
                        return $this->error('Не возможно создать Абонента');
                    }

                    $oRPC->ClientUpdate($iClient, $iNumber, '[' . $iNumber . ']', $iATC);

                }
            } else {
                $iNum++;
            }
        }
        $this->talk('Не номера [' . $iNum . ']', $iCnt);
        $this->talk('Добавлено [' . $iCnt . '] абонентов', $iCnt);

        return $this->message($this->getTalk('; '), $this->getData());

    }
}
