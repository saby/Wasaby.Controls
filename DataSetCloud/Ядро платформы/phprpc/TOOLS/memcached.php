<?php


class TOOLS_MEMCACHED
{
    const CHECK_KEY = '__CHECK__';
    /**
     * Время хранения ключа 1 минута
     */
    const TIME_MIN = 60;
    /**
     * Время жизни ключа - пожизненно
     */
    const TIME_ALL = 0;
    /**
     * Ссылка на объект мемкеша
     * @var Memcache
     */
    private $oMemcache = null;

    public function Mem() {
        return $this->oMemcache;
    }

    public static function getInstance()
    {
        static $oHandler = null;
        if (is_null($oHandler)) {
            $oHandler = new TOOLS_MEMCACHED();
        }
        return $oHandler;
    }


    /**
     * Конструктор класса
     *
     * @param array $aHosts Массив серверов мемкешей
     * @return void
     */
    public function __construct($aHosts = array(array('127.0.0.1', 11211)))
    {
        // создаем екземпляр
        $this->oMemcache = new Memcache;
        // перебираем все хосты и коннектимся
        $bResult = false;
        // регистрируем сервера
        while ((list($iCnt, $aHost) = each($aHosts)) !== false) {
            list($sHost, $iPort) = $aHost;
            $bRc = @$this->oMemcache->addServer($sHost, $iPort);
            if ($bRc AND !$bResult)
                $bResult = true;
        }
        if (!$bResult)
            $this->oMemcache = null;

        return;

        // пробуем установить ключ, т.к. коннект к серверам
        // проходит только при операциях
        $bRc = @$this->oMemcache->set(self::CHECK_KEY, true, MEMCACHE_COMPRESSED);
        if ($bRc === false)
            // хрен. неподконнектились. работаем автономно
            $this->oMemcache = null;
    }

    /**
     * Добавить значение ключа
     *
     * @param  $sKey Ключ
     * @param  $mValue Значение
     * @param int $iTime Время жизни
     * @return bool
     */
    public function addData($sKey, $mValue, $iTime = self::TIME_ALL)
    {

        if (is_null($this->oMemcache))
            return false;

        return @$this->oMemcache->add($sKey, $mValue, MEMCACHE_COMPRESSED, $iTime);

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

        if (is_null($this->oMemcache))
            return false;

        return @$this->oMemcache->set($sKey, $mValue, MEMCACHE_COMPRESSED, $iTime);

    }

    /**
     * Получить данные по ключу
     * @param  $sKey
     * @return mixed
     */
    public function getData($sKey)
    {

        if (is_null($this->oMemcache))
            return false;

        return @$this->oMemcache->get($sKey);

    }

    /**
     * Удалить ключ
     * @param  $sKey
     * @return bool
     */
    public function delData($sKey)
    {

        if (is_null($this->oMemcache))
            return false;

        return @$this->oMemcache->delete($sKey);

    }

    /*********************************************************************************************/

    /**
     * Установить лок на ключ
     * @param  $sKey
     * @return bool
     */
    public function getLock($sKey)
    {

        if (is_null($this->oMemcache))
            return false;

        // пытаемся добавить ключ лока. если ключ есть, вернет FALSE
        while ($this->addData(BALANSER_KEY_LOCK . $sKey, true) === false) {
            // кто-то ужо вставил. ждем освобождения
            usleep(rand(100, 200));
        }
        return true;
    }

    /**
     * Удалить лок для ключа
     * @param  $sKey
     * @return bool
     */
    public function delLock($sKey)
    {

        if (is_null($this->oMemcache))
            return false;

        return $this->delData(BALANSER_KEY_LOCK . $sKey);

    }

    /*********************************************************************************************/

    public function getStat()
    {
        if (is_null($this->oMemcache))
            return false;
        return @$this->oMemcache->getExtendedStats();
    }

    /*********************************************************************************************/

    public function Inc($sKey, $iCnt = 1)
    {
        if (is_null($this->oMemcache))
            return false;

        $this->oMemcache->increment($sKey, $iCnt);
        return true;
    }

    public function Dec($sKey, $iCnt = 1)
    {
        if (is_null($this->oMemcache))
            return false;

        $this->oMemcache->decrement($sKey, $iCnt);
        return true;
    }

    /**
     * Деструктор объекта. Закрываем соединения
     * @return bool
     */
    public function __destruct()
    {
        if (is_null($this->oMemcache))
            return false;

        @$this->oMemcache->close();
        return true;
    }

}