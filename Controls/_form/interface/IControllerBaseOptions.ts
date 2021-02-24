import {IControlOptions} from 'UI/Base';
import {Record} from 'Types/entity';

export interface IControllerBaseOptions extends IControlOptions {
    record: Record;
    confirmationShowingCallback?: Function;
    keyProperty?: string;
}