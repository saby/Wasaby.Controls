<?php

//51ac865029b0d481

class NET_RECORDS
{

    private $iName = 0;
    private $aName = array();
    private $aType = array();
    private $aName2Id = array();
    private $iRow = 0;
    private $aRows = array();

    public function addColumn($sName,$sType='Текст')
    {

        $this->aName[$this->iName] = $sName;
        $this->aType[$this->iName] = $sType;
        $this->aName2Id[$sName] = $this->iName;

        $this->iName++;

    }

    public function addRow($aRow)
    {

        reset($this->aName);
        while ((list($sKey, $sVal) = each($this->aName)) !== false) {
            $iKey = $this->aName2Id[$sVal];
            $this->aRows[$this->iRow][$iKey] = '';
        }

        reset($aRow);
        while ((list($sKey, $sVal) = each($aRow)) !== false) {

            $iKey = $this->aName2Id[$sKey];

            $this->aRows[$this->iRow][$iKey] = $sVal;

        }
        $this->iRow++;

    }

    public function getRows()
    {
        return $this->aRows;
    }

    public function getJSON()
    {
        $s = array();
        reset($this->aName);
        while ((list($sKey, $sVal) = each($this->aName)) !== false) {
            $s[] = array(
                'n' => $sVal,
                't' => $this->aType[$sKey]
            );
        }
        $d = $this->getRows();

        $aJSON = array('s' => $s, 'd' => $d);

        return $aJSON;

    }

}