<?php


class NET_DB {

    private $oConn = null;

    public function __construct($aConf) {


        $this->oConn = @mysql_connect($aConf['host'], $aConf['user'], $aConf['pass']);
        if ($this->oConn) {
            @mysql_select_db($aConf['dbdb'], $this->oConn) or die('MYSQL: Cant select DB ['.$aConf['dbdb'].']');
            @mysql_query('SET NAMES UTF-8');
        } else {
            throw new Exception('MYSQL: Не возможно подключиться к серверу ['.$aConf['host'].'].<br />Ошибка: '.iconv('cp1251','utf-8',mysql_error()));
        }

    }

    public function query($sql) {

        $result = @mysql_query($sql);
        if ($result === false) {
            throw new Exception("\nSQL Error: " . mysql_error() . "\n<pre>$sql</pre>");
        }
        return $result;

    }

    public function queryObject($sql) {

        $result = $this->query($sql);
        $object = mysql_fetch_object($result);
        @mysql_free_result($result);
        return $object;

    }

    public function queryObjects($sql) {

        $result = $this->query($sql);
        $objects = array();
        while ($object = mysql_fetch_object($result)) {
            $objects[] = $object;
        }
        @mysql_free_result($result);
        return $objects;

    }

    public function getLastInsertId() {
        return mysql_insert_id($this->oConn);
    }

    public function escape($mVal) {
        return mysql_real_escape_string($mVal);
    }

    public function __destruct() {

        if ($this->oConn)
            @mysql_close($this->oConn);

    }

}