
/**
 ** Code to implement parameters from url
 ** and from local storage.
 */

export const hasProp = (name: string): boolean =>
  window.localStorage.getItem(name) !== null;

export const getProp = (name: string): string =>
  window.localStorage.getItem(name)!;

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
  let oldHref = document.location.href;
  const update = () => {
    oldHref = document.location.href;
    const params = new URL(oldHref).searchParams;
    Object.keys(defaultValues).forEach(key => {
      if (params.has(key)) 
	putProp(key, params.get(key)!);
      else if (window.localStorage.getItem(key) !== null)
        putProp(key, defaultValues[key]);
    });
  }
  update();
  const body = document.querySelector("body");
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) update();
  });
  observer.observe(body!, { childList: true, subtree: true });
};

