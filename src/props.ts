
/**
 ** Code to implement parameters from url
 ** or from persistent local storage.
 ** store prop 'name' as 'prop:name'
 ** store pref 'name' as 'pref:name'
 */

const resetPrefixed = (prefix: string) => {
  const store = window.localStorage;
  for (let i = store.length; --i >= 0; )
    if (store.key(i) !== null && store.key(i)!.startsWith(prefix))
      store.removeItem(store.key(i)!);
}

const hasPrefixed = (prefix: string, name: string): boolean =>
  window.localStorage.getItem(`${prefix}${name}`) !== null;

const getPrefixed = (prefix: string, name: string): string =>
  window.localStorage.getItem(`${prefix}${name}`) || '';

const putPrefixed = (prefix: string, name: string, value: string) =>
  window.localStorage.setItem(`${prefix}${name}`, value);

export const findPrefixed = (prefix: string): string[] => {
  const presets: Array<string> = [];
  for (let i = 0; i < window.localStorage.length; i += 1)
    if (window.localStorage.key(i) !== null && window.localStorage.key(i)!.startsWith(prefix))
      presets.push(window.localStorage.key(i)!.slice(prefix.length));
  return presets;
}

// default values for props, used when nothing stored in localStorage.
let defaults: {[key: string]: string} = {};

// props prefix
const propsPrefix = 'prop:';

// clear all props
export const resetProps = () =>
  resetPrefixed(propsPrefix);

// is there a property with the given name
export const hasProp = (name: string): boolean =>
  hasPrefixed(propsPrefix, name);

export const getProp = (name: string): string =>
    hasProp(name) ? getPrefixed(propsPrefix, name) : defaults[name];

export const putProp = (name: string, value: string) =>
  putPrefixed(propsPrefix, name, value);

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
    if (getProp(key) && getProp(key) !== defaults[key])
      items.push(`${key}=${getProp(key)}`);
  });

  const location = `${window.location.protocol}//${window.location.host}/?${items.join('&')}`;
  // console.log(`exportProps(${reset}) returns ${location}`);
  return location;
}

// preset prefix
const presetPrefix = 'preset:';

// get the preset names as an array
export const findPreset = (): string[] =>
  findPrefixed(presetPrefix);

// clear all presets
export const resetPreset = () =>
  resetPrefixed(presetPrefix);

// is there a preset
export const hasPreset = (name: string): boolean =>
  hasPrefixed(presetPrefix, name);

export const getPreset = (name: string): string =>
  hasPrefixed(presetPrefix, name) ? getPrefixed(presetPrefix, name) : window.location.origin;

export const putPreset = (name: string, value: string) =>
  putPrefixed(presetPrefix, name, value);

