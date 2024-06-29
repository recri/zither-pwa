
/**
 ** Code to implement parameters from url
 ** or from persistent local storage.
 */

// default values for props, used when nothing stored in localStorage.
let defaults: {[key: string]: string} = {};

// clear all localStorage values.
export const resetProps = () =>
  window.localStorage.clear();

// is there a property with the given name
export const hasProp = (name: string): boolean =>
  window.localStorage.getItem(name) !== null;

export const getProp = (name: string): string =>
  hasProp(name) ? window.localStorage.getItem(name)! : defaults[name];

export const putProp = (name: string, value: string) =>
  window.localStorage.setItem(name, value);

export const getIntProp = (name: string): number =>
  parseInt(getProp(name)!, 10);

export const putIntProp = (name: string, value: number) =>
  putProp(name, `${value}`);

export const getFloatProp = (name: string): number =>
  parseFloat(getProp(name)!);

export const putFloatProp = (name: string, value: number) =>
  putProp(name, `${value}`);

export const getBoolProp = (name: string): boolean =>
  getProp(name) === 'true';

export const putBoolProp = (name: string, value: boolean) =>
  putProp(name, `${value}`);

export const observeUrl = (defaultValues: {[key: string]: string}) => {
  defaults = defaultValues;
  let oldHref = document.location.href;
  const update = () => {
    oldHref = document.location.href;
    for (const [key, value] of new URL(oldHref).searchParams.entries()) {
      if (key === 'reset')
	resetProps();
      else 
	putProp(key, value);
    }
  }
  update();
  const body = document.querySelector("body");
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) update();
  });
  observer.observe(body!, { childList: true, subtree: true });
};

export const exportProps = (reset: boolean) => {
  const items = [];
  if (reset) items.push('reset')
  Object.keys(defaults).forEach(key => {
    if (hasProp(key) && getProp(key) !== defaults[key])
      items.push(`${key}=${getProp(key)}`);
  });

  const location = `${window.location.protocol}//${window.location.host}/?${items.join('&')}`;
  // console.log(`exportProps(${reset}) returns ${location}`);
  return location;
}
    
