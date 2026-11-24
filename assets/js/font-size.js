/*
 * font-size.js
 * Floating "A A A" control: small / normal / large text.
 * Sets data-fs="small|normal|large" on <html>; CSS does the scaling.
 * (head_custom.html applies the saved choice early to avoid a size flash.)
 */
(function () {
  'use strict';

  var KEY = 'fs-level';
  var LEVELS = [
    { id: 'small',  label: 'Small text',  size: '12px' },
    { id: 'normal', label: 'Normal text', size: '16px' },
    { id: 'large',  label: 'Large text',  size: '21px' }
  ];

  function current() {
    return document.documentElement.getAttribute('data-fs') || 'normal';
  }

  function set(id) {
    document.documentElement.setAttribute('data-fs', id);
    try { localStorage.setItem(KEY, id); } catch (e) { /* ignore */ }
    var buttons = document.querySelectorAll('.fs-control button');
    Array.prototype.forEach.call(buttons, function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-level') === id));
    });
  }

  function init() {
    var box = document.createElement('div');
    box.className = 'fs-control';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Text size');

    LEVELS.forEach(function (lvl) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'A';
      btn.style.fontSize = lvl.size;
      btn.setAttribute('data-level', lvl.id);
      btn.setAttribute('aria-label', lvl.label);
      btn.setAttribute('aria-pressed', String(current() === lvl.id));
      btn.addEventListener('click', function () { set(lvl.id); });
      box.appendChild(btn);
    });

    document.body.appendChild(box);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();