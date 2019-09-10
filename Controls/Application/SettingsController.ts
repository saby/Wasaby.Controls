/**
 * Created by as.krasilnikov on 02.04.2018.
 */
interface IPopupSettingsController {
    getPanelSettings: Function;
    setPanelSettings: Function;
}

let settingsController;

export function setController(controller: IPopupSettingsController): void {
    settingsController = controller;
}

export function getSettings(ids: string[]): Promise<number|void> {
    if (settingsController && settingsController.getSettings) {
        const settings = settingsController.getSettings(ids);
        // protect against wrong api
        if (settings instanceof Promise) {
            return settings;
        }
        return Promise.resolve(settings);
    }
    return Promise.resolve();
}

export function setSettings(config: unknown): void {
    if (settingsController && settingsController.setSettings) {
        settingsController.setSettings(config);
    }
}
