/* Start page app filter. The cards are static HTML; this only adds the
   filter chips. To add an app, add an <li class="card"> with data-category
   and data-status in index.html and sv/index.html. */
(function () {
  var sv = document.documentElement.lang === 'sv';
  var CATEGORIES = [
    { id: 'all',    label: sv ? 'Alla' : 'All' },
    { id: 'money',  label: sv ? 'Pengar & vardag' : 'Money & everyday' },
    { id: 'travel', label: sv ? 'Resor' : 'Travel' },
    { id: 'work',   label: sv ? 'Team & jobb' : 'Teams & work' },
    { id: 'soon',   label: sv ? 'Kommer snart' : 'Coming soon' } // virtual: data-status="soon"
  ];

  var grid = document.getElementById('grid');
  var filters = document.getElementById('filters');
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));

  function matches(card, cat) {
    return cat === 'all' || (cat === 'soon' ? card.dataset.status === 'soon' : card.dataset.category === cat);
  }
  function count(cat) {
    return cards.filter(function (c) { return matches(c, cat); }).length;
  }

  CATEGORIES.forEach(function (c) {
    var n = count(c.id);
    if (c.id !== 'all' && n === 0) return; // hide empty categories
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.cat = c.id;
    b.setAttribute('aria-pressed', 'false');
    b.textContent = c.label;
    var span = document.createElement('span');
    span.className = 'count';
    span.textContent = n;
    b.appendChild(span);
    filters.appendChild(b);
  });

  function apply(cat, updateUrl) {
    var shown = 0;
    cards.forEach(function (el) {
      var ok = matches(el, cat);
      el.hidden = !ok;
      if (ok) shown++;
    });
    filters.querySelectorAll('.chip').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.cat === cat));
    });
    document.getElementById('empty').hidden = shown > 0;
    var label = CATEGORIES.filter(function (c) { return c.id === cat; })[0].label;
    document.getElementById('filter-status').textContent =
      label + ': ' + shown + ' ' + (sv ? (shown === 1 ? 'app' : 'appar') : (shown === 1 ? 'app' : 'apps'));
    if (updateUrl) {
      var url = new URL(location.href);
      if (cat === 'all') url.searchParams.delete('cat'); else url.searchParams.set('cat', cat);
      history.replaceState(null, '', url);
    }
  }

  filters.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (b) apply(b.dataset.cat, true);
  });

  var initial = new URLSearchParams(location.search).get('cat');
  var valid = filters.querySelector('.chip[data-cat="' + initial + '"]');
  apply(valid ? initial : 'all', false);
})();
