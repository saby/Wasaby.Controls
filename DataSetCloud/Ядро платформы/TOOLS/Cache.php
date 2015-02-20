<?php

require_once dirname(__FILE__) . '/../REDIS/Rediska.php';

class TOOLS_Cache
{

    const PREFIX_KEY = 'atc.';
    const CHECK_KEY = 'atc.check.key';

    const TIME_ALL = 0;

    private $oRedis = null;

    public static function getInstance()
    {
        static $oHandler = null;
        if (is_null($oHandler)) {
            $oHandler = new TOOLS_Cache();
        }
        return $oHandler;
    }


    /**
     * Конструктор класса
     *
     * @param array $aHosts Массив серверов мемкешей
     * @return void
     */
    public function __construct()
    {

        try {
            // создаем екземпляр
            $this->oRedis = new Rediska();
            // перебираем все хосты и коннектимся
            $oKey = new Rediska_Key(self::CHECK_KEY);
            // пробуем установить ключ, т.к. коннект к серверам
            // проходит только при операциях
            $bRc = $oKey->setValue(true);
            if ($bRc === false
            )
                // хрен. неподконнектились. работаем автономно
                $this->oRedis = null;

        } catch (Exception $e) {
            $this->oRedis = null;
        }
    }

    /**
     * Установить значение ключа
     *
     * @param  $sKey Ключ
     * @param  $mValue значение
     * @param int $iTime на какой период
     * @return bool
     */
    public function setData($sKey, $mValue, $iTime = self::TIME_ALL)
    {

        if (is_null($this->oRedis))
            return false;

        $mValue = serialize($mValue);
        $oKey = new Rediska_Key(self::PREFIX_KEY . $sKey);
        $oKey->setValue($mValue);
        if ($iTime > 0)
            $oKey->expire($iTime);
        else {
            $oKey->expire((60*60*24));
        }

        return true;

    }

    /**
     * Получить данные по ключу
     * @param  $sKey
     * @return bool
     */
    public function getData($sKey)
    {

        if (is_null($this->oRedis))
            return false;

        $oKey = new Rediska_Key(self::PREFIX_KEY . $sKey);

        if (is_null($oKey->getLifetime())) {
            return false;
        }

        $mValue = $oKey->getValue();
        if (is_null($mValue))
            $mValue = false;

        return $mValue;
    }

}