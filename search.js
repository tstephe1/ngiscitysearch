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
  // ---------------------
  //
  //  Init
  //
  // ---------------------
  const search = instantsearch({
    searchClient: algoliasearch(opts.appId, opts.apiKey),
    indexName: opts.indexName,
    routing: true,
    searchFunction: opts.searchFunction,
  });

  // ---------------------
  //
  //  Default widgets
  //
  // ---------------------
  search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for anything',
    }),
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results'),
      },
      transformItems(items) {
        return items.map(item => {
          /* eslint-disable no-param-reassign */
          item.starsLayout = getStarsHTML(item.rating);
          item.categories = getCategoryBreadcrumb(item);
          return item;
        });
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
        },
        {
          value: `${opts.indexName}_price_asc`,
          label: 'Lowest price',
        },
        {
          value: `${opts.indexName}_price_desc`,
          label: 'Highest price',
        },
      ],
    }),
    instantsearch.widgets.pagination({
      container: '#pagination',
      scrollTo: '#search-input',
    }),

    // ---------------------
    //
    //  Filtering widgets
    //
    // ---------------------
    instantsearch.widgets.panel({
      templates: {
        header: getHeaderTemplate('State (or)'),
      },
    })(instantsearch.widgets.refinementList)({
      container: '#state',
      attribute: 'STATE_ALPHA',
      limit: 5,
      showMore: true,
      showMoreLimit: 10,
      searchable: true,
      searchablePlaceholder: 'Search for State',
      templates: {
        searchableNoResults:
          '<div class="sffv_no-results">No matching brands.</div>',
        showMoreText: `
          {{#isShowingMore}}
            <span class="isShowingLess"></span>
            Show less
          {{/isShowingMore}}
          {{^isShowingMore}}
            <span class="isShowingMore"></span>
            Show more
          {{/isShowingMore}}
        `,
      },
    }),
    instantsearch.widgets.panel({
      templates: {
        header: getHeaderTemplate('County (or)'),
      },
    })(instantsearch.widgets.refinementList)({
      container: '#county',
      attribute: 'COUNTY_NAME',
      limit: 5,
      showMore: true,
      showMoreLimit: 10,
      searchable: true,
      searchablePlaceholder: 'Search for County',
      templates: {
        searchableNoResults:
          '<div class="sffv_no-results">No matching brands.</div>',
        showMoreText: `
          {{#isShowingMore}}
            <span class="isShowingLess"></span>
            Show less
          {{/isShowingMore}}
          {{^isShowingMore}}
            <span class="isShowingMore"></span>
            Show more
          {{/isShowingMore}}
        `,
      },
    }),    
 ]);

  search.start();
}

// ---------------------
//
//  Helper functions
//
// ---------------------
function getTemplate(templateName) {
  return document.querySelector(`#${templateName}-template`).innerHTML;
}

function getHeaderTemplate(name) {
  return `<div class="ais-header"><h5>${name}</h5></div>`;
}

function getCategoryBreadcrumb(item) {
  const highlightValues = item._highlightResult.categories || [];
  return highlightValues.map(category => category.value).join(' > ');
}

function getStarsHTML(rating, maxRating) {
  let html = '';
  const newRating = maxRating || 5;

  for (let i = 0; i < newRating; ++i) {
    html += `<span class="ais-star-rating--star${
      i < rating ? '' : '__empty'
    }"></span>`;
  }

  return html;
}
