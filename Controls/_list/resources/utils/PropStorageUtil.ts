import {setSettings, getSettings} from 'Controls/Application/SettingsController';
import cClone = require('Core/core-clone');
import Deferred = require('Core/Deferred');

var PropStorageUtil = {

    loadSavedConfig(propStorageId: string, propNames: string[]): Deffered {
        const defResult =  new Deferred();
        if (propStorageId) {
            let loadedCfg = {};
            getSettings([propStorageId]).then((storage) => {
                if (storage && storage[propStorageId]) {
                    if (propNames) {
                        propNames.forEach((prop) => {
                            if (storage[propStorageId].hasOwnProperty(prop)) {
                                loadedCfg[prop] = storage[propStorageId][prop];
                            }
                        });
                    } else {
                        loadedCfg = cClone(storage[propStorageId]);
                    }
                }
                defResult.callback(loadedCfg);
            });
        } else {
            defResult.callback(null);
        }
        return defResult;
    },
    saveConfig(propStorageId: string, propNames: string[], cfg): void {
        if (propStorageId) {
            let configToSave = {};
            if (propNames) {
                propNames.forEach((prop) => {
                    if (cfg.hasOwnProperty(prop)) {
                        configToSave[prop] = cfg[prop];
                    }
                });
                setSettings({[propStorageId]: configToSave});
            }
        }
    }
};
export = PropStorageUtil;
