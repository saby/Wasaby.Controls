<?php
/**
 * RPC обслуживания PHP
 *
 * @version $Id$
 */


/**
 * RPC обслуживания PHP
 */
class RPC_PHP extends RPC_RPC
{

    public function LoadAbonents($aParams)
    {

        //sleep(5);

        if (!isset($aParams['Файл']['Данные']['href'])) {
            return $this->error('Не указан файл!', $aParams);
        } else {
            $sFile = $aParams['Файл']['Данные']['href'];
        }

        if (!isset($_FILES[$sFile])) {
            return $this->error('Не передан файл!', $_FILES);
        } else {
            $aFile = $_FILES[$sFile];
            $aLines = file($aFile['tmp_name']);
            $this->talk('Загружено [' . count($aLines) . '] строк');

            $aReplace = array();
            while ((list($iK, $sLine) = each($aLines)) !== false) {

                $sLine = trim($sLine, "\t\r\n ");

                if (empty($sLine))
                    continue;

                $aData = preg_split("/[;\t]+/i", $sLine);
                switch (count($aData)) {
                    case 2:
                        $iNumber = intval($aData[1]);
                        $sName = trim($aData[0], " \r\n");

                        $aName = preg_split('/[ ]+/ie', $sName);

                        if (isset($aName[0]) AND isset($aName[1])) {
                            $sName = $aName[0] . ' ' . $aName[1];
                        } else {
                            continue;
                        }

                        if ($iNumber > 0)
                            $aReplace[$iNumber] = $sName;
                        break;
                    default:
                        break;
                }
            }

            $this->talk('Загружено [' . count($aReplace) . '] номеров', $aReplace);
        }

        if (count($aReplace)) {

            $oRPC = new NET_RPC();

            $aTmp = $oRPC->getUsersAll(true);
            $aUsers = $aTmp['d'];
            $aNames = $aTmp['s'];

            //$this->talk('Получено [' . count($aUsers) . '] агентов', $aTmp);
            if ($aUsers === false) {
                return $this->error('Не возможно получить список агентов');
            } else {

                $iNumber = -1;
                $iATC = -1;
                $iBoss = -1;
                while ((list($iKey, $aVal) = each($aNames)) !== false) {
                    if ($aVal['n'] == 'Номер') {
                        $iNumber = $iKey;
                    }
                    if ($aVal['n'] == 'АТС') {
                        $iATC = $iKey;
                    }
                    if ($aVal['n'] == 'Раздел') {
                        $iBoss = $iKey;
                    }
                }

                $aTmp = array();
                while ((list($iKey, $aUser) = each($aUsers)) !== false) {
                    $aTmp[intval($aUser[$iNumber])] = $aUser;

                }
                $aUsers = $aTmp;

                $this->talk('Загружено [' . count($aUsers) . '] абонентов', $aUsers);
            }

            //return $this->message($this->getMsgs(), $this->getData());

            $iUpd = 0;
            while ((list($iNumber, $sName) = each($aReplace)) !== false) {
                if (isset($aUsers[$iNumber])) {


                    $aUser = $aUsers[$iNumber];
                    //print_r($aUser);
                    //exit();

                    $oRPC->ClientUpdate($aUser[0][0], $iNumber, $sName, $aUser[$iATC], $aUser[$iBoss][0][0], $aUser[$iBoss][1]);

                    //$this->talk('Обновлен [' . $sName . ']', $aUser);

                    $iUpd++;
                }
            }
            $this->talk('Обновлено [' . $iUpd . '] абонентов', $aUsers);
        }

        return $this->message($this->getMsgs(), $this->getData());

    }

    public function LoadRegions($aParams)
    {

        //sleep(5);

        if (!isset($aParams['Файл']['Данные']['href'])) {
            return $this->error('Не указан файл!', $aParams);
        } else {
            $sFile = $aParams['Файл']['Данные']['href'];
        }

        if (!isset($_FILES[$sFile])) {
            return $this->error('Не передан файл!', $_FILES);
        } else {
            $aFile = $_FILES[$sFile];
            $aLines = file($aFile['tmp_name']);
            $this->talk('Загружено [' . count($aLines) . '] строк', $sFile);

            $aRegions = array();
            while ((list($iK, $sLine) = each($aLines)) !== false) {

                $sLine = trim($sLine, "\t\r\n ");

                if (empty($sLine))
                    continue;

                $aData = preg_split("/[;\t]+/i", $sLine);
                switch (count($aData)) {
                    case 2:
                        $sNumber = trim($aData[0], " \r\n");
                        $sName = trim($aData[1], " \r\n");
                        $aRegions[$sNumber] = $sName;
                        break;
                    default:
                        break;
                }
            }

            $this->talk('Загружено [' . count($aRegions) . '] регионов', $aRegions);
        }

        if (count($aRegions)) {

            $oRPC = new NET_RPC();

            $iUpd = 0;
            while ((list($sNumber, $sName) = each($aRegions)) !== false) {
                $oRPC->RegionUpdate($oRPC->RegionCreate(), $sNumber, $sName);
                $iUpd++;
            }
            $this->talk('Добавлено [' . $iUpd . '] регионов');

        }

        return $this->message($this->getMsgs(), $this->getData());

    }

    public function LoadPoints($aParams)
    {

        //sleep(5);

        if (!isset($aParams['Файл']['Данные']['href'])) {
            return $this->error('Не указан файл!', $aParams);
        } else {
            $sFile = $aParams['Файл']['Данные']['href'];
        }

        if (!isset($_FILES[$sFile])) {
            return $this->error('Не передан файл!', $_FILES);
        } else {
            $aFile = $_FILES[$sFile];
            $aLines = file($aFile['tmp_name']);
            $this->talk('Загружено [' . count($aLines) . '] строк', $sFile);

            $aPoints = array();
            while ((list($iK, $sLine) = each($aLines)) !== false) {

                $sLine = trim($sLine, "\t\r\n ");

                if (empty($sLine))
                    continue;

                $aData = preg_split("/[;\t]+/i", $sLine);
                switch (count($aData)) {
                    case 4:
                        $sReg = trim($aData[0], " \r\n");
                        $sKod = trim($aData[1], " \r\n");
                        $sCity = trim($aData[2], " \r\n");
                        $sName = trim($aData[3], " \r\n");
                        $aPoints[] = array(
                            $sReg,
                            $sKod,
                            $sCity,
                            $sName
                        );
                        break;
                    default:
                        break;
                }
            }

            $this->talk('Загружено [' . count($aPoints) . '] регионов', $aPoints);
        }

        if (count($aPoints)) {

            $oRPC = new NET_RPC();

            $aTmp = $oRPC->getRegions();
            $aRegs = $aTmp['d'];
            $aNames = $aTmp['s'];
            $this->talk('Получено [' . count($aRegs) . '] регионов', $aTmp);

            if ($aRegs === false) {
                return $this->error('Не возможно получить список регионов');
            } else {

                $iKod = -1;
                $iRegion = -1;
                while ((list($iKey, $aVal) = each($aNames)) !== false) {
                    if ($aVal['n'] == 'Код') {
                        $iKod = $iKey;
                    }
                    if ($aVal['n'] == '@Регион') {
                        $iRegion = $iKey;
                    }
                }

                $aTmp = array();
                while ((list($iKey, $aReg) = each($aRegs)) !== false) {
                    $aTmp[$aReg[$iKod]] = $aReg[$iRegion];

                }
                $aR2I = $aTmp;

                $this->talk('Загружено [' . count($aR2I) . '] регионов', $aR2I);
            }

            $iUpd = 0;
            while ((list($iCnt, $aPoint) = each($aPoints)) !== false) {
                $sReg = $aPoint[0];
                $iReg = $aR2I[$sReg];
                $sKod = $aPoint[1];
                $sCity = $aPoint[2];
                $sName = $aPoint[3];
                $sFull = "$sName, $sCity";
                $oRPC->PointUpdate($oRPC->PointCreate(), $iReg, $sKod, $sFull);
                $iUpd++;
            }
            $this->talk('Добавлено [' . $iUpd . '] точек');

        }

        return $this->message($this->getMsgs(), $this->getData());

    }

}
