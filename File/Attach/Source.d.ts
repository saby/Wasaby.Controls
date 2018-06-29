import ISource = require('WS.Data/Source/ISource');
import {IFileModel as Model} from 'File/Attach/IModel';
import {IResource} from "File/IResource";

export type Source = ISource & {
    create(meta: object, resource: IResource): Model;
}
