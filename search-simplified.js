/* global instantsearch algoliasearch */

app({
  appId: '0918D9U2RE',
  apiKey: 'd25b0c5b30ab02ff3684b21f2b1292fc',
  indexName: 'NGIS',
  searchParameters: {
    hitsPerPage: 10,
  },
});

function app(opts) {
  const search = instantsearch({
    searchClient: algoliasearch(opts.appId, opts.apiKey),
    indexName: opts.indexName,
    routing: true,
    searchFunction: opts.searchFunction,
  });

  search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for products',
    }),
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results'),
      },
    }),
    instantsearch.widgets.stats({
      container: '#stats',
    }),
    instantsearch.widgets.sortBy({
      container: '#sort-by',
      items: [
        {
          value: opts.indexName,
          label: 'Most relevant',
        }
      ],
    }),
    instantsearch.widgets.pagination({
      container: '#pagination',
      scrollTo: '#search-input',
    }),
    instantsearch.widgets.refinementList({
      container: '#category',
      attribute: 'STATE_ALPHA',
      operator: 'or',
      templates: {
        header: getHeader('state'),
      },
    }),
    instantsearch.widgets.refinementList({
      container: '#type',
      attribute: 'COUNTY_NAME',
      operator: 'or',
      templates: {
        header: getHeader('county'),
      },
    }),
  ]);

  search.start();
}

function getTemplate(templateName) {
  return document.querySelector(`#${templateName}-template`).innerHTML;
}

function getHeader(title) {
  return `<h5>${title}</h5>`;
}
