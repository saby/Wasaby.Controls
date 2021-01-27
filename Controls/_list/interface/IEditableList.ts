import {Model} from 'Types/entity';

export interface IEditableListOption {
    editingConfig?: {
        initialAdd?: boolean;
        editOnClick?: boolean;
        sequentialEditing?: boolean;
        addPosition?: 'top' | 'bottom';
        item?: Model;
        autoAdd?: boolean;
        autoAddByApplyButton?: boolean;
        toolbarVisibility?: boolean;
        backgroundStyle?: string;
    };
}
