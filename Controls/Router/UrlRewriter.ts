/// <amd-module name="Controls/Router/UrlRewriter" />
"use strict";

const mapUrls = [];

const rewriter = {
   push(maskFrom: string, maskTo: string): void {
      mapUrls.push([maskFrom, maskTo]);
   },

   getPrettyUrl(URL: string): string {
      const finded = mapUrls.find((value) => {
         return !!URL.match(value[0]) || URL === value[0];
      }) || [];

      return finded[1] || URL;
   },

   getUrlBack(maskTo: string): string {

   }
};

export default rewriter;