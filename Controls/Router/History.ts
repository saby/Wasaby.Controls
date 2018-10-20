/// <amd-module name="Controls/Router/History" />
import RouterHelper from 'Controls/Router/Helper';

let localHistory = [];
let currentPosition = 0;

/*
* Code is relevant only oin browser,
* because in browser we can navigate through history
* */
if (typeof window !== 'undefined') {
   let state = {id: 0, url: RouterHelper.getRelativeUrl(), prettyUrl: RouterHelper.getRelativeUrl()};
   localHistory.push(state);
}

function getCurrentState():object {
   return localHistory[currentPosition];
}

function getPrevState():object {
   return localHistory[currentPosition-1];
}

function getNextState():object {
   return localHistory[currentPosition+1];
}

function back(): void {
   currentPosition--;
   RouterHelper.setRelativeUrl(localHistory[currentPosition].url);
}

function forward(): void {
   currentPosition++;
   RouterHelper.setRelativeUrl(localHistory[currentPosition].url);
}

function push(newUrl: string, prettyUrl: string): void {
   currentPosition++;
   localHistory.splice(currentPosition);

   let state = {
      id: currentPosition,
      url: newUrl,
      prettyUrl: prettyUrl
   };
   RouterHelper.setRelativeUrl(newUrl);
   window.history.pushState(state, prettyUrl, prettyUrl);
   localHistory.push(state);
}

export default {
   getCurrentState: getCurrentState,
   getPrevState: getPrevState,
   getNextState: getNextState,
   back: back,
   forward: forward,
   push: push
}