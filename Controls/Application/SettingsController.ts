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
    if (settingsController) {
        return settingsController.getSettings(ids);
    }
    return Promise.resolve();
}

export function setSettings(config: unknown): void {
    if (settingsController) {
        settingsController.setSettings(config);
    }
}
