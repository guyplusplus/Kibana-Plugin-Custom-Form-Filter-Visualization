/*

Source code based on:

https://github.com/elastic/kibana/blob/v7.8.0/src/plugins/input_control_vis/public/control/list_control_factory.ts
https://github.com/elastic/kibana/blob/v7.8.0/src/plugins/input_control_vis/public/control/create_search_source.ts

*/


import {
  IFieldType,
  TimefilterContract,
  SearchSourceFields,
  DataPublicPluginStart,
} from '../../../src/plugins/data/public';
import { CoreSetup } from '../../../src/core/public';


function getEscapedQuery(query = '') {
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#_standard_operators
  return query.replace(/[.?+*|{}[\]()"\\#@&<>~]/g, (match) => `\\${match}`);
}

interface TermsAggArgs {
  field?: IFieldType;
  size: number | null;
  direction: string;
  query?: string;
}

const termsAgg = ({ field, size, direction, query }: TermsAggArgs) => {
  const terms: any = {
    order: {
      _count: direction,
    },
  };

  if (size) {
    terms.size = size < 1 ? 1 : size;
  }

  if (field?.scripted) {
    terms.script = {
      source: field.script,
      lang: field.lang,
    };
    terms.value_type = field.type === 'number' ? 'float' : field.type;
  } else {
    terms.field = field?.name;
  }

  if (query) {
    terms.include = `.*${getEscapedQuery(query)}.*`;
  }

  return {
    termsAgg: {
      terms,
    },
  };
};

export async function fetchData(core: CoreSetup, indexName, fieldName) {
  const [, { data: dataPluginStart }] = await core.getStartServices();
  //search for indexes matching the name
  const indexPatternsCache = await dataPluginStart.indexPatterns.getCache();
  const indexPatternAtributes = indexPatternsCache.find(pattern => pattern.attributes.title === indexName);
  //get all information about this index
  const indexPattern = await dataPluginStart.indexPatterns.get(indexPatternAtributes.id);
  const field = indexPattern.fields.find(({ name }) => name === fieldName);
  const initialSearchSourceState: SearchSourceFields = {
    timeout: "1000ms",
    terminate_after: 100000, //from elastic_search, per shard
  };
  const query = null;
  const aggs = termsAgg({
    field: indexPattern.fields.getByName("state.keyword"),
    size: 100, //if set to null, returns only top 10 states
    direction: 'desc',
    query,
  });
  const create = dataPluginStart.search.searchSource.create;
  const searchSource = create(initialSearchSourceState);
  searchSource.setParent(undefined);
  const filters = [];
  /* a filter could be
    {
      meta: {
        controlledBy: "1593926398196",
        index: 'acf225f0-b369-11ea-8a24-979c290ba95f',
        key: 'balance',
      },
      "range": {
        "balance": {
          "gte": 10000,
          "lte": 20000,
        }
      }
    }
  */
  const useTimeFilter = false;
  const timefilter = null;
  searchSource.setField('filter', () => {
    const activeFilters = [...filters];
    if (useTimeFilter) {
      const filter = timefilter.createFilter(indexPattern);
      if (filter) {
        activeFilters.push(filter);
      }
    }
    return activeFilters;
  });
  searchSource.setField('size', 0);
  searchSource.setField('index', indexPattern);
  searchSource.setField('aggs', aggs);
  const abortController = new AbortController();
  const abortSignal = abortController.signal;
  let resp;
  try {
    resp = await searchSource.fetch(abortSignal);
  } catch (error) {
    // If the fetch was aborted then no need to surface this error in the UI
    if (error.name === 'AbortError')
      return;
    //this.disable('Unable to fetch terms, error: {error.message}'); //TODO
    return;
  }
  const selectOptions = _.get(resp, 'aggregations.termsAgg.buckets', []).map((bucket: any) => {
    return bucket?.key;
  });

  if (selectOptions.length === 0) {
    //this.disable('No value to display'); //TODO noValuesDisableMsg(fieldName, indexPattern.title));
    return;
  }

  return selectOptions;
}

