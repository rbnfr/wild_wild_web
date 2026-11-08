import { defaultLocale, locales, LOCALE_STORAGE_KEY } from "./config";

// Runs inline on "/" before anything renders: a saved choice wins, then the
// browser languages in order of preference, then the default language.
// Plain ES5 so it needs no bundling; the static export hashes it into the CSP.
export const localeRedirectScript = `(function(){var s=${JSON.stringify(locales)},l;try{l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}if(s.indexOf(l)<0){var p=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];l=${JSON.stringify(defaultLocale)};for(var i=0;i<p.length;i++){var c=String(p[i]||"").slice(0,2).toLowerCase();if(s.indexOf(c)>=0){l=c;break}}}location.replace("/"+l+"/"+location.search+location.hash)})()`;
