<?php

require_once 'PEAR.php';

/**
 * This package is capable of interfacing with the open source Asterisk PBX via
 * its built in Manager API.  This will allow you to execute manager commands
 * for administration and maintenance of the server.
 *
 * Copyright (c) 2008, Doug Bromley <doug.bromley@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * - Neither the name of the author nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.

 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * PHP version 5
 *
 * @category  Net
 * @package   Net_AsteriskManager
 * @author    Doug Bromley <doug.bromley@gmail.com>
 * @copyright 2008 Doug Bromley
 * @license   http://www.debian.org/misc/bsd.license New BSD License
 * @link      http://pear.php.net/pepr/pepr-proposal-show.php?id=543
 */

/**
 * Including the libraries exception class which extends PEAR_Exception
 */
require 'asteriskmanagerexception.php';

/**
 * Class for accessing the Asterisk Manager interface
 * {@link http://www.voip-info.org/wiki/view/Asterisk+manager+API}
 *
 * @category Net
 * @package  Net_AsteriskManager
 * @author   Doug Bromley <doug.bromley@gmail.com>
 * @license  http://www.debian.org/misc/bsd.license New BSD License
 * @link     http://pear.php.net/pepr/pepr-proposal-show.php?id=543
 */
class Net_AsteriskManager
{
    /**
     * The Asterisk server which will recieve the manager commands
     * @access public
     * @var string
     */
    public $server;

    /**
     * The port to use when connecting to the Asterisk server
     * @access public
     * @var integer
     */
    public $port = 5038;

    /**
     * The opened socket to the Asterisk server
     * @access private
     * @var object
     */
    private $_socket;

    private $_user = 'admin';
    private $_pass = 'admin';

    private $_auto_connect = true;

    private $_timeout = 5;

    /**
     * Class constructor
     *
     * @param array $params Array of the parameters used to connect to the server
     * <code>
     * array(
     *       'server' => '127.0.0.1'    // The server to connect to
     *       'port' => '5038',          // Port of manager API
     *       'auto_connect' => true     // Autoconnect on construction?
     *      );
     * </code>
     *
     * @uses AsteriskManager::$server
     * @uses AsteriskManager::$port
     * @uses AsteriskManager::$_socket
     */
    public function __construct($params = array())
    {
        if (!isset($params['server'])) {
            throw new Net_AsteriskManagerException(
                Net_AsteriskManagerException::NOSERVER
            );
        }
        $this->server = $params['server'];

        if (isset($params['port'])) {
            $this->port = $params['port'];
        }

        if (isset($params['user'])) {
            $this->_user = $params['user'];
        }

        if (isset($params['pass'])) {
            $this->_pass = $params['pass'];
        }

        if (isset($params['auto_connect'])) {
            $this->_auto_connect = $params['auto_connect'];
        }

        if ($this->_auto_connect) {
            $this->connect();
            $this->login($this->_user,$this->_pass);
        }
    }

    /**
     * Private method for checking there is a socket open to the Asterisk
     * server.
     *
     * @return null
     */
    private function _checkSocket()
    {
        if (!$this->_socket) {
            throw new Net_AsteriskManagerException(
                Net_AsteriskManagerException::NOSOCKET
            );
        }
    }

    /**
     * Consolidated method for sending the given command to the server and returning
     * its reponse. Any failure in writing or reading will raise an exception.
     *
     * @param string $command The command to send
     *
     * @return string
     */
    private function _sendCommand($command, $sEnd )
    {
        if (!fwrite($this->_socket, $command)) {
            throw new Net_AsteriskManagerException(
                Net_AsteriskManagerException::CMDSENDERR
            );
        }

        $sContents = '';
        while (!feof($this->_socket)) {

            $sContents .= fread($this->_socket, 8192);

            if (strpos($sContents, "\r\n\r\n\r\n") !== false)
                break;

            if(strpos($sContents,"Response: Error") !== false) {
                throw new Net_AsteriskManagerException(
                    Net_AsteriskManagerException::RESPERR
                );
            }

            if(strpos($sContents,"Response: Success") !== false) {
                if (strpos($sContents, $sEnd) !== false)
                    break;
            }

            if(strpos($sContents,"Response: Follows") !== false) {
                if (strpos($sContents, $sEnd) !== false)
                    break;
            }
        }

        return $sContents;

    }

    /**
     * If not already connected then connect to the Asterisk server
     * otherwise close active connection and reconnect
     *
     * @return bool
     */
    public
    function connect()
    {
        if ($this->_socket) {
            $this->close();
        }

        if ($this->_socket = @fsockopen($this->server, $this->port, $errno, $errstr, $this->_timeout)) {
            stream_set_blocking($this->_socket, TRUE);
            stream_set_timeout($this->_socket, $this->_timeout);
            return true;
        }

        throw new Net_AsteriskManagerException (
            Net_AsteriskManagerException::CONNECTFAILED
        );
    }

    /**
     * Login into Asterisk Manager interface given the user credentials
     *
     * @param string $username The username to access the interface
     * @param string $password The password defined in manager interface of server
     * @param string $authtype Enabling the ability to handle encrypted connections
     *
     * @return bool
     */
    public
    function login($username, $password, $authtype = null)
    {
        $this->_checkSocket();

        $sCMD = "Action: login\r\n"
                . "Username: {$username}\r\n"
                . "Secret: {$password}\r\n"
                . "Events: off\r\n\r\n";

        $response = $this->_sendCommand($sCMD,"Message: Authentication accepted");

        return $response;

    }

    /**
     * Logout of the current manager session attached to $this::socket
     *
     * @return bool
     */
    public
    function logout()
    {
        $this->_checkSocket();

        $this->_sendCommand("Action: Logoff\r\n\r\n","");

        return true;
    }

    /**
     * Close the connection
     *
     * @return bool
     */
    public
    function close()
    {
        $this->_checkSocket();

        return fclose($this->_socket);
    }


/******************************************************************************************************************/

    public
    function getQueueStatus()
    {
        $this->_checkSocket();

        $response = $this->_sendCommand("Action: QueueStatus\r\n\r\n","Event: QueueStatusComplete");

        return $response;
    }

    public
    function getQueueStatusArray($mQueue = null)
    {
        $sQueue = $this->getQueueStatus();

        $sQueueParams = "Event: (.*)\r\n(.*)\r\n\r\n";

        $aParams = array();
        $aMembers = array();
        $aEntrys = array();

        if (preg_match_all("/" . $sQueueParams . "/Umsi", $sQueue, $aMatches)) {
            foreach ($aMatches[1] as $mKey => $mVal) {
                switch ($mVal) {
                    case 'QueueParams':
                        $aParams[] = $aMatches[2][$mKey] . "\r\n";
                        break;
                    case 'QueueMember':
                        $aMembers[] = $aMatches[2][$mKey] . "\r\n";
                        break;
                    case 'QueueEntry':
                        $aEntrys[] = $aMatches[2][$mKey] . "\r\n";
                        break;
                }
            }

        }

        $sFields = "(\w+): (.*)\r\n";

        $aQueue = array();

        foreach ($aParams as $iKey => $aParam) {
            if (preg_match_all("/" . $sFields . "/Umsi", $aParam, $aMatches)) {
                foreach ($aMatches[1] as $mKey => $mVal) {
                    $aQueue[$iKey][$mVal] = $aMatches[2][$mKey];
                }
            }
        }

        //print('<pre>');
        //print_r($aQueue);
        //exit();

        $aQueueArray = array();
        while (list($iKey, $aQ) = each($aQueue)) {
            $aQueueArray[$aQ['Queue']] = $aQ;
        }

        $aQueueMembers = array();
        foreach ($aMembers as $iKey => $sMember) {
            if (preg_match_all("/" . $sFields . "/Umsi", $sMember, $aMatches)) {
                foreach ($aMatches[1] as $mKey => $mVal) {
                    $aQueueMembers[$iKey][$mVal] = $aMatches[2][$mKey];
                }

            }
        }

        //print('<pre>');
        //print_r($aQueueMembers);
        //exit();

        //ksort($aQueueMembers);
        while (list($iKey, $aQM) = each($aQueueMembers)) {
            $aQueueArray[$aQM['Queue']]['_members'][$aQM['Location']] = $aQM;
        }


        //print('<pre>');
        while (list($iKey, $aQM) = each($aQueueArray)) {
            @ksort($aQueueArray[$iKey]['_members']);
            //print('<hr>');
            //print_r($aQueueArray[$iKey]['_members']);
        }

        //print('<hr><pre>');
        //print_r($aQueueArray);
        //exit();

        $aQueueEntrys = array();
        foreach ($aEntrys as $iKey => $sEntry) {
            if (preg_match_all("/" . $sFields . "/Umsi", $sEntry, $aMatches)) {
                foreach ($aMatches[1] as $mKey => $mVal) {
                    $aQueueEntrys[$iKey][$mVal] = $aMatches[2][$mKey];
                }
            }
        }
        while (list($iKey, $aQE) = each($aQueueEntrys)) {
            $aQueueArray[$aQE['Queue']]['_entrys'][] = $aQE;
        }

        //print('<hr><pre>');
        //print_r($aQueueArray);
        //exit();

        reset($aQueueArray);
        while(list($iQ,$aQ) = each($aQueueArray)) {
            //print('<hr><pre>');
            //print_r($iQ);
            //print_r($aQ);
            if (!isset($aQueueArray[$iQ]['_entrys']))
                $aQueueArray[$iQ]['_entrys'] = array();
            if (!isset($aQueueArray[$iQ]['_members']))
                $aQueueArray[$iQ]['_members'] = array();
        }


        ksort($aQueueArray);
        //exit();
        return $aQueueArray;
    }

    public
    function getStatus()
    {
        $this->_checkSocket();

        $response = $this->_sendCommand("Action: Status\r\n\r\n", "Event: StatusComplete");
        return $response;
    }

    public
    function getStatusArray()
    {
        $response = $this->getStatus();


        $sQueueParams = "Event: (.*)\r\n(.*)\r\n\r\n";

        $aCheck = array();

        if (preg_match_all("/" . $sQueueParams . "/Umsi", $response, $aMatches)) {

            foreach ($aMatches[1] as $mKey => $mVal) {
                switch ($mVal) {
                    case 'Status':
                        $aCheck[] = $aMatches[2][$mKey] . "\r\n";
                        break;
                }
            }

        }

        $sFields = "(\w+): (.*)\r\n";

        $aStatus = array();


        foreach ($aCheck as $iKey => $aParam) {
            if (preg_match_all("/" . $sFields . "/Umsi", $aParam, $aMatches)) {
                foreach ($aMatches[1] as $mKey => $mVal) {
                    $aStatus[$aMatches[2][1]][$mVal] = $aMatches[2][$mKey];
                }
            }
        }

        return $aStatus;
    }

    public
    function SIPShowPeer($peer)
    {
        $this->_checkSocket();

        $response = $this->_sendCommand("Action: SIPShowPeer\r\nPeer: $peer\r\n\r\n", "Event:");
        return $response;
    }

    public function    SIPShowPeerArray($peer) {

        $aParam = $this->SIPShowPeer($peer);

        $aPeers = array();

        $sFields = "(\w+): (.*)\r\n";

        if (preg_match_all("/" . $sFields . "/Umsi", $aParam, $aMatches)) {

            //print_r($aMatches);
            //exit();

            foreach ($aMatches[1] as $mKey => $mVal) {
                $aPeers[$aMatches[2][2]][$mVal] = $aMatches[2][$mKey];
            }
        }

        ksort($aPeers);

        return $aPeers;


    }

    public
    function getClients() {

        $this->_checkSocket();

        $response = $this->_sendCommand("Action: SIPPeers\r\n\r\n", "Event: PeerlistComplete");
        return $response;
    }

    public
    function getClientsArray() {

        $response = $this->getClients();

        $sEventParams = "Event: (.*)\r\n(.*)\r\n\r\n";

        $aPeers = array();

        if (preg_match_all("/" . $sEventParams . "/Umsi", $response, $aMatches)) {

            foreach ($aMatches[1] as $mKey => $mVal) {
                switch ($mVal) {
                    case 'PeerEntry':
                        $aPeers[] = $aMatches[2][$mKey] . "\r\n";
                        break;
                }
            }

        }

        $sFields = "(\w+): (.*)\r\n";

        $aCleints = array();

        foreach ($aPeers as $iKey => $aParam) {
            if (preg_match_all("/" . $sFields . "/Umsi", $aParam, $aMatches)) {
                foreach ($aMatches[1] as $mKey => $mVal) {
                    $aCleints[$aMatches[2][1]][$mVal] = $aMatches[2][$mKey];
                }
            }
        }

        ksort($aCleints);

        return $aCleints;

    }


    public
    function Command($sCommand)
    {
        $this->_checkSocket();

        $response = $this->_sendCommand("Action: Command\r\nCommand: $sCommand\r\n\r\n", "--END COMMAND--");

        return $response;
    }


}

?>
