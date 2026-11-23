---
title: Home
layout: home
nav_order: 1
description: "気合"
permalink: /
---

# Welcome

This site collects basic vocabulary for Karate (Wadō-ryū) beginners.

## Sections

<!-- Auto-generated from every page under docs/: top-level pages, then their children, ordered by nav_order. -->
{% assign doc_pages = site.pages | where_exp: "p", "p.path contains 'docs/'" %}
{% assign top_pages = doc_pages | where_exp: "p", "p.parent == nil" | sort: "nav_order", "last" %}
<ul>
{%- for top in top_pages %}
  <li><a href="{{ top.url | relative_url }}">{{ top.title }}</a>
  {%- if top.has_children %}
  {%- assign children = doc_pages | where: "parent", top.title | sort: "nav_order", "last" %}
    <ul>
    {%- for child in children %}
      <li><a href="{{ child.url | relative_url }}">{{ child.title }}</a></li>
    {%- endfor %}
    </ul>
  {%- endif %}
  </li>
{%- endfor %}
</ul>

## Contributing

New articles go under `docs/<section>/`. See `README.md` in the repository for the front matter conventions.
