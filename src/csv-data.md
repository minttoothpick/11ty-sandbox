---
layout: layouts/base.njk
title: Test CSV Data..
---
# {{ title }}

## Books Reading from Snippet
{% set noSubtitle = "true" %}
{% include "snippets/books-reading-list.njk" %}

## Books I'm Reading
{% for book in collections.booksReading %}
- *{{ book.title | removeSubtitle }}* by {{ book.author | formatAuthor }}
{%- endfor %}

## Books I've Finished
{% for book in collections.booksFinished %}
- *{{ book.title }}* by {{ book.author | formatAuthor }}
{%- endfor %}