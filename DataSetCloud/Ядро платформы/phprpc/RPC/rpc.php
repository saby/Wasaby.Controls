<?php


class RPC_RPC
{

    protected $sMe;
    private $aTalk = array();
    private $aData = array();

    public function __call($sName, $mParams)
    {
        return $this->error("Метод [$sName] не определен");

    }

    public function error($sMsg, $mData = null)
    {
        header('HTTP/1.1 200 OK');
        return array(
            'error' => array(
                'code' => -32000,
                'message' => $this->sMe.':'.$sMsg,
                'details' => $this->sMe.':'.$sMsg,
                'data' => $mData,
                'me' => $this->sMe
            )
        );
    }

    public function message($sMsg, $mData = null)
    {
        return array(
            'result' => array(
                'message' => $sMsg,
                'data' => $mData
            )
        );
    }

    public function result($mResult)
    {
        return array(
            'result' => $mResult
        );
    }


    protected function talk($sTalk, $aData = null)
    {

        $this->aTalk[] = $sTalk;
        $this->aData[] = $aData;

    }

    protected function getTalk($sBR = '<br />', $sB = '', $sE = '')
    {

        return $sB . join($sBR, $this->aTalk) . $sE;
    }

    protected function getMsgs()
    {

        return $this->aTalk;
    }

    protected function getData()
    {

        return $this->aData;
    }

    /**
     * Тестовый метож
     *
     * @param $aParams
     * @return array
     */
    public function test($aParams)
    {
        return array(
            'result' => $aParams
        );
    }

    public function TM($iTime, $bZero = false)
    {

        static $iNow = 0;

        if ($iTime == 0 AND !$bZero)
            return ' ';

        if ($iNow == 0)
            $iNow = mktime(0, 0, 0, date('m'), date('d'), date('Y'));

        return date('H:i:s', ($iNow + $iTime));

    }

    public function TM2($iTime, $bZero = false)
    {

        static $iNow = 0;

        if ($iTime == 0 AND !$bZero)
            return ' ';

        if ($iNow == 0)
            $iNow = mktime(0, 0, 0, date('m'), date('d'), date('Y'));

        return date('i:s', ($iNow + $iTime));

    }

    public function Work($iTime)
    {

        $iH = 0;
        $iM = 0;
        $iS = 0;

        $iH = intval($iTime / (60 * 60));
        if ($iH) {
            $iTime = $iTime - ($iH * (60 * 60));
        }
        $iM = intval($iTime / (60));
        if ($iM) {
            $iTime = $iTime - ($iM * (60));
        }
        $iS = $iTime;

        return sprintf("%02d:%02d:%02d",$iH,$iM,$iS);
    }

}