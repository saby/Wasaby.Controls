<?php
/**
 * Автозагрузчик классов
 *
 * @version $Id: loader.php 97 2011-09-22 10:18:30Z golubevaf $
 *
 */

if (!defined('PHPRPC'))
    return;

function autoload($sClassName)
{

    static $sPath = null;

    if (is_null($sPath)) {
        $sPath = realpath(dirname(__FILE__)) . DIRECTORY_SEPARATOR;
    }

    if(strstr($sClassName,'Rediska') !== false) {
        //print("\nAUTO: [".$sClassName."] - false");
        return false;
    }

    list($sDir, $sClass) = explode('_', $sClassName);

    $sFileClass = strtolower($sClass);

    $sFileName = $sPath . $sDir . DIRECTORY_SEPARATOR . $sFileClass . '.php';

    if (file_exists($sFileName)) {

        //print("\nAUTO: [".$sClassName."] - ok");

        return include $sFileName;
    } else {
        $aJSON = array(
            'jsonrpc' => '2.0',
            'error' => array(
                'message' => "Can't load class [$sClass] from [$sFileName]"
            )
        );

        header('Content-Type: application/json; charset=utf-8');
        print(json_encode($aJSON, JSON_FORCE_OBJECT));
        exit();
    }

}

spl_autoload_register('autoload');

