import {IResource} from "File/IResource";
import Model = require("WS.Data/Entity/Model");

export type IFileModel = Model & {
    getOrigin(): IResource;
    getName(): string;
}
