/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* return true if at least 1 filter was found matching controlledBy */
function isFilterControlledByExist(vis, controlledBy) {
  return vis.queryFilter.getFilters().filter((kbnFilter) => {
    return(kbnFilter.meta.controlledBy === controlledBy);
  }).length > 0;
};


/* return array of filters matching controlledBy starts with controlledByPrefix */
function findFiltersByControlledByPrefix(vis, controlledByPrefix) {
  return vis.queryFilter.getFilters().filter((kbnFilter) => {
    return(kbnFilter.meta.controlledBy.startsWith(controlledByPrefix));
  });
};


/* remove all filters where controlledBy start by controlledByPrefix */
function removeFiltersByControlledByPrefix(vis, controlledByPrefix) {
  const myFilters = findFiltersByControlledByPrefix(vis, controlledByPrefix);
  if (myFilters.length > 0) {
    myFilters.forEach(vis.queryFilter.removeFilter);
    return true;
  }
  return false;
};


export const customFormFilterAccountsVisRequestHandler = async (vis) => {

  const controlledById = 'accountFilter' + ':';
  
  var ageFilter = null;
  if(vis.visParams.age != null)
    ageFilter = {
      meta: {
        controlledBy: controlledById + vis.visParams.filterCounter,
        alias: 'Age: '.concat(vis.visParams.age)
      },
      query: {
        match_phrase: {
          age: String(vis.visParams.age)
        }
      }
    };

  var minimumBalanceFilter = null;
  if(vis.visParams.minimumBalance != null)
    minimumBalanceFilter = {
      meta: {
        controlledBy: controlledById + vis.visParams.filterCounter,
        alias: 'Min. Bal.: '.concat(vis.visParams.minimumBalance)
      },
      "range": {
        "balance": {
          "gte": parseFloat(vis.visParams.minimumBalance),
          "lt": vis.visParams.maximumBalance
        }
      }
    };


  if(vis.visParams.filterCounter === -1 ||
    (ageFilter == null && minimumBalanceFilter == null)) {
    vis.visParams.filterCounter = 0;
    removeFiltersByControlledByPrefix(vis, controlledById);
  }
  else if(vis.visParams.filterCounter > 0) {
    if(!isFilterControlledByExist(vis, controlledById + vis.visParams.filterCounter)) {
      removeFiltersByControlledByPrefix(vis, controlledById);
      if(ageFilter != null)
        vis.queryFilter.addFilters(ageFilter); 
      if(minimumBalanceFilter != null)
        vis.queryFilter.addFilters(minimumBalanceFilter);
    }
  }

  return Promise.resolve({});
};
