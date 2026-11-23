# Vendored browser libraries

These files are checked in so `index.html` works offline and from `file://`.

| Path | Library | Version | License |
|---|---|---|---|
| `bootstrap/` | Bootstrap (CSS + JS bundle) | 5.3.3 | MIT |
| `bootstrap-icons/` | Bootstrap Icons (CSS + fonts) | 1.11.3 | MIT |
| `ace/` | Ace editor core, modes and themes | 1.36.5 | BSD-3-Clause |

All were downloaded from jsDelivr (`https://cdn.jsdelivr.net/npm/...`). Ace modes and
themes are loaded as ordinary scripts in `index.html` so Ace never needs to fetch
them over XHR, which browsers block on `file://` pages.
