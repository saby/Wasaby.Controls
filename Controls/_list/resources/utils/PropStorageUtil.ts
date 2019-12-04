import {setSettings, getSettings} from 'Controls/Application/SettingsController';
import cClone = require('Core/core-clone');

export default {
    loadSavedConfig(propStorageId: string, propNames: string[]): Promise {
        return new Promise((resolve) => {
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
                    resolve(loadedCfg);
                });
            } else {
                resolve(null);
            }
        });
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
}
