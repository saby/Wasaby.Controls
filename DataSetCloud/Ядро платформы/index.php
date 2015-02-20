<?php

/**
 *
 * Хендлер для обработки PHP вызовов RPC
 */

/*

На вход получаем JSON методом POST и контенттайп json

{"jsonrpc":"2.0","method":"ATC.testMethod","params":{"a":"c"},"id":1}

интересует метод, который будет транслироваться в класс и метод и параметры, которые туда передадуться
метод должен вернуть массив с определенныи ключем result или error

на выходе JSON ответ

{"jsonrpc":"2.0","result":{},"id":1}

*/

set_time_limit(0);

define('PHPRPC', true);

$sRoot = dirname(__FILE__);

require_once $sRoot.'/NET/asteriskmanager.php';
require_once $sRoot.'/NET/asteriskmanagerexception.php';

require_once $sRoot.'/REDIS/Rediska.php';

require_once 'loader.php';

$sID = 1;
$sMethod = 'undefined';
$aReturn = array();


if ($_SERVER['REQUEST_METHOD'] != 'POST' OR
    !stristr($_SERVER['CONTENT_TYPE'], 'application/json; charset=utf-8')
) {
    $aResponse = array(
        'error' => 'Bad request',
//        'server' => $_SERVER,
    );

    if ($_SERVER['REQUEST_METHOD'] == 'POST' AND
        strstr($_SERVER['CONTENT_TYPE'], 'multipart/form-data;') AND
            count($_FILES)
    ) {

        $sJSON = $_POST['Запрос'];
        $aJSON = json_decode($sJSON, true);

        $sJSONRPC = $sJSON['jsonrpc'];
        $sMethod = $aJSON['method'];
        $aParams = $aJSON['params'];

        list($sClass, $sCall) = explode('.', $sMethod);
        $sClass = 'RPC_' . $sClass;

        $oClass = new $sClass();
        try {
            $aResponse = $oClass->$sCall($aParams);
        } catch (Exception $e) {
            $aResponse ['error']['message'] = $e->getMessage();
        }
    }
    header('Content-Type: text/html; charset=utf-8');
} else {

    $sJSON = file_get_contents("php://input");
    $aJSON = json_decode($sJSON, true);

    $sJSONRPC = $sJSON['jsonrpc'];
    $sMethod = $aJSON['method'];
    $aParams = $aJSON['params'];
    $sID = $aJSON['id'];


    list($sClass, $sCall) = explode('.', $sMethod);
    $sClass = 'RPC_' . $sClass;

    $oClass = new $sClass();
    try {
        $aResponse = $oClass->$sCall($aParams);
    } catch (Exception $e) {
        $aResponse ['error']['message'] = $e->getMessage();
        $aResponse ['error']['trace'] = $e->getTrace();
    }
    header('Content-Type: application/json; charset=utf-8');
}

$aJSON = array(
    'jsonrpc' => '2.0',
    'method' => $sMethod,
    'id' => $sID,
    'protocol' => 2
);

$aReturn = array();
while ((list($sKey, $sVal) = each($aJSON)) !== false) {
    $aReturn[$sKey] = $sVal;
}
while ((list($sKey, $sVal) = each($aResponse)) !== false) {
    $aReturn[$sKey] = $sVal;
}

//print(json_encode($aReturn, JSON_FORCE_OBJECT));

print(json_encode($aReturn));