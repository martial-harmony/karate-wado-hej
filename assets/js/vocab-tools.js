/*
 * vocab-tools.js
 * Adds a "Show languages" toolbar to the vocabulary tables so readers can
 * pick which columns to see. The choice is remembered between pages/visits.
 * Tables are recognised by their header cells (Romaji, English, Svenska,
 * 日本語, 中文), so it works even where the column order differs.
 */
(function () {
  'use strict';

  var LANGS = ['Romaji', 'English', 'Svenska', '日本語', '中文'];
  var MOBILE_DEFAULT = ['Romaji', 'English'];
  var KEY = 'vocab-langs-v1';

  function isMobile() {
    return window.matchMedia('(max-width: 600px)').matches;
  }

  function loadChoice() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (e) { /* storage unavailable: fall through */ }
    return isMobile() ? MOBILE_DEFAULT.slice() : LANGS.slice();
  }

  function saveChoice(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }

  function headerTexts(table) {
    var row = table.tHead ? table.tHead.rows[0] : table.rows[0];
    if (!row) return [];
    return Array.prototype.map.call(row.cells, function (c) {
      return c.textContent.trim();
    });
  }

  function findVocabTables() {
    var all = document.querySelectorAll('.main-content table');
    return Array.prototype.filter.call(all, function (t) {
      var heads = headerTexts(t);
      var hits = heads.filter(function (h) { return LANGS.indexOf(h) > -1; });
      var hasRows = t.tBodies.length && t.tBodies[0].rows.length > 0;
      return hits.length >= 4 && hasRows;
    });
  }

  function prepareTable(table) {
    var heads = headerTexts(table);
    table.classList.add('vocab-table');
    Array.prototype.forEach.call(table.tBodies[0].rows, function (row) {
      Array.prototype.forEach.call(row.cells, function (cell, i) {
        cell.setAttribute('data-label', heads[i] || '');
      });
    });
  }

  function applyChoice(tables, chosen) {
    tables.forEach(function (table) {
      var heads = headerTexts(table);
      var firstVisibleSet = false;

      // header row
      var headRow = table.tHead ? table.tHead.rows[0] : table.rows[0];
      Array.prototype.forEach.call(headRow.cells, function (cell, i) {
        var show = chosen.indexOf(heads[i]) > -1;
        cell.classList.toggle('vocab-hidden', !show);
      });

      // body rows
      Array.prototype.forEach.call(table.tBodies[0].rows, function (row) {
        firstVisibleSet = false;
        Array.prototype.forEach.call(row.cells, function (cell, i) {
          var show = chosen.indexOf(heads[i]) > -1;
          cell.classList.toggle('vocab-hidden', !show);
          cell.classList.remove('vocab-first');
          if (show && !firstVisibleSet) {
            cell.classList.add('vocab-first');
            firstVisibleSet = true;
          }
        });
      });
    });
  }

  function buildToolbar(tables, chosen) {
    var bar = document.createElement('div');
    bar.className = 'vocab-toolbar';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Choose which languages to show');

    var title = document.createElement('span');
    title.className = 'vocab-toolbar__title';
    title.textContent = 'Show:';
    bar.appendChild(title);

    LANGS.forEach(function (lang) {
      var label = document.createElement('label');
      label.className = 'vocab-toolbar__option';

      var box = document.createElement('input');
      box.type = 'checkbox';
      box.value = lang;
      box.checked = chosen.indexOf(lang) > -1;

      box.addEventListener('change', function () {
        var now = LANGS.filter(function (l) {
          var el = bar.querySelector('input[value="' + l + '"]');
          return el && el.checked;
        });
        if (!now.length) {          // never allow an empty table
          box.checked = true;
          return;
        }
        saveChoice(now);
        applyChoice(tables, now);
      });

      label.appendChild(box);
      label.appendChild(document.createTextNode(' ' + lang));
      bar.appendChild(label);
    });

    return bar;
  }

  function init() {
    var tables = findVocabTables();
    if (!tables.length) return;

    tables.forEach(prepareTable);
    var chosen = loadChoice();

    var anchor = tables[0].closest('.table-wrapper') || tables[0];
    anchor.parentNode.insertBefore(buildToolbar(tables, chosen), anchor);

    applyChoice(tables, chosen);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
