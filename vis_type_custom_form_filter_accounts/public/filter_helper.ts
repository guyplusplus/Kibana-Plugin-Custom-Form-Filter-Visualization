import { FilterManager } from '../../../src/plugins/data/public';

/* remove all filters matching controlledBy */
export function removeFiltersByControlledBy(filterManager: FilterManager, controlledBy: string) {
  const allFilters = filterManager.getFilters();
  for(var i = allFilters.length -1; i>= 0; i--) {
    const ctrl = allFilters[i].meta.controlledBy;
    if(ctrl && ctrl === controlledBy)
    filterManager.removeFilter(allFilters[i]);
  }
};

/* return null if it is not a number */
function filterOutNonNumber(s: string) {
  if(s == null)
    return null;
  if(!isFinite(s))
    return null;
  return s;
}

export function stringToInt(s: string) {
  const s2 = filterOutNonNumber(s);
  if(!s2)
    return null;
  const n = parseInt(s2);
  if(isNaN(n))
    return null;
  return n;
}


export function stringToFloat(s: string) {
  const s2 = filterOutNonNumber(s);
  if(!s2)
    return null;
  const n = parseFloat(s2);
  if(isNaN(n))
    return null;
  return n;
}