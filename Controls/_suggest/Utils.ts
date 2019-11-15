import {descriptor} from 'Types/entity';

export function getOptionTypes() {
   return {
      displayProperty: descriptor(String).required(),
      suggestTemplate: descriptor(Object).required(),
      searchParam: descriptor(String).required()
   };
};
