# ngx-countries-dropdown — Improvement Plan

A consolidated backlog of bugs, improvements, and new features. Grouped by area,
prioritized, and sized so you can plan releases/sprints. Checkboxes let you track progress.

Legend — **Priority:** 🔴 High · 🟡 Medium · 🟢 Low  ·  **Effort:** S (small) · M (medium) · L (large)  ·  **Breaking:** ⚠️ = API/data breaking change

---

## 1. Data-quality bugs (country data)

| # | Item | Priority | Effort | Breaking |
|---|------|----------|--------|----------|
| 1.1 | ✅ Fix inconsistent `region` values — 2 entries use `'Americas'` (constants.ts L1481 Haiti, L2161) instead of `'NA'` | 🔴 | S | — |
| 1.2 | ✅ Introduce `Continent` union type (`'AF' \| 'AS' \| 'EU' \| 'NA' \| 'SA' \| 'OC' \| 'AN'`) and type `ICountry.region` with it | 🔴 | S | ⚠️ (type-only) |
| 1.3 | ✅ Normalize case handling across helpers — `getAllowedCountries` uses `.toLowerCase()` while `getCountryByCodes` uses `.toUpperCase()`; standardize to case-insensitive matching | 🔴 | S | — |
| 1.4 | ✅ Add data-integrity unit test: unique `code`, valid `region`, `isoCode` format, required non-empty fields (would have caught 1.1) | 🔴 | M | — |
| 1.5 | Audit full dataset for missing/placeholder currency, language, capital values | 🟡 | M | — |

**Acceptance:** all countries pass the integrity spec; `region` typed and compiles clean.

---

## 2. Country data model — new fields

| # | Item | Priority | Effort | Breaking |
|---|------|----------|--------|----------|
| 2.1 | Add **ISO alpha-3 code** (`alpha3`, e.g. `AFG`, `USA`) to `ICountry` + populate all entries | 🔴 | L | ⚠️ additive |
| 2.2 | Add **flag emoji** — derive from alpha-2 at build/runtime (regional-indicator chars), expose `flagEmoji` | 🟡 | M | additive |
| 2.3 | Split **native name** into its own field — extract from `name` (`Afghanistan (‫افغانستان‬‎)` → `name` + `nativeName`) | 🟡 | L | ⚠️ changes `name` values |
| 2.4 | Support **multiple languages** — add `languages: ILanguage[]` (keep `language` for back-compat) | 🟡 | L | additive |
| 2.5 | Support **multiple currencies** — add `currencies: ICurrency[]` (keep `currency` for back-compat) | 🟢 | L | additive |
| 2.6 | Populate/expose **`demonym`** (already optional in model, currently unused) | 🟢 | M | additive |
| 2.7 | Normalize `ICurrency`/`ILanguage` optionality (mixed `?` vs `string \| null`) | 🟢 | S | ⚠️ type-only |

**Note:** 2.1 / 2.3 touch all ~230 entries → do as scripted passes, ship in a minor/major.

---

## 3. Country-centric features & helpers

| # | Item | Priority | Effort | Breaking |
|---|------|----------|--------|----------|
| 3.1 | ✅ New helper `getCountriesByRegion(region)` | 🔴 | S | — |
| 3.2 | ✅ New input `allowedRegions` (`Continent[]`) filters the list by region | 🟡 | M | — |
| 3.3 | Grouped rendering with region headers in the dropdown | 🟡 | L | — |
| 3.4 | ✅ New helpers: `getCountryByDialCode`, `getCountriesByDialCode` | 🟡 | S | — |
| 3.5 | ✅ New helpers: `getCountriesByCurrency(code)`, `getCountriesByLanguage(code)` | 🟡 | S | — |
| 3.6 | ✅ `sortBy` input (`name` \| `code` \| `dialCode`) — dataset is fixed-order today | 🟡 | M | — |
| 3.7 | ✅ Extend search to match capital, currency, language, ISO codes (configurable `searchFields`) | 🟡 | M | — |
| 3.8 | ✅ Export new helpers from `public_api.ts` | 🔴 | S | — |

---

## 4. Component bugs (correctness)

| # | Item | Priority | Effort | Breaking |
|---|------|----------|--------|----------|
| 4.1 | ✅ Keyboard nav divide-by-zero — empty search list makes `focusedIndex % 0 = NaN` (ArrowUp/Down break) | 🔴 | S | — |
| 4.2 | ✅ Search uses `(change)` (fires on blur) not `(input)` — `focusedIndex` not reset live while typing → stale highlight | 🔴 | S | — |
| 4.3 | ✅ `setFocusedIndex` can set `-1` when `value()` not in visible list | 🟡 | S | — |
| 4.4 | ✅ `onKeydown` Enter can call `changeCountry(undefined)` when index out of range (follows 4.1/4.3) | 🔴 | S | — |
| 4.5 | ✅ Global `document:click` closes all instances — use `HostListener` + `ElementRef.contains` for outside-click | 🟡 | M | — |

---

## 5. Accessibility

| # | Item | Priority | Effort | Breaking |
|---|------|----------|--------|----------|
| 5.1 | ✅ Add ARIA wiring: `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-selected` on options | 🔴 | M | — |
| 5.2 | ✅ Add `Escape` key to close dropdown | 🟡 | S | — |
| 5.3 | ✅ Replace `setTimeout(…, 10)` focus hack with `afterNextRender` / `afterRenderEffect` | 🟡 | S | — |

---

## 6. Architecture & API

| # | Item | Priority | Effort | Breaking |
|---|------|----------|--------|----------|
| 6.1 | ✅ Replace `toSignal`/`toObservable`/`merge` for `selectedCountry` with a pure `computed()` | 🟡 | M | — |
| 6.2 | ✅ Clarify precedence of `selectedCountryCode` (input) vs `value` (model) — two sources of truth (`value` wins, falls back to `selectedCountryCode`) | 🟡 | S | — |
| 6.3 | Document removal timeline for deprecated `NgxCountriesDropdownModule` | 🟢 | S | — |
| 6.4 | Allow configurable display order of fields in `IConfig` (currently fixed) | 🟢 | M | — |

---

## 7. Template & performance

| # | Item | Priority | Effort | Breaking |
|---|------|----------|--------|----------|
| 7.1 | ✅ Extract duplicated preferred/standard `<li>` blocks (~40 lines each) into shared `ng-template` | 🟡 | M | — |
| 7.2 | ✅ Lowercase `searchText` once outside `.filter()` in `getCountriesBasedOnSearch` (currently per-country) | 🟡 | S | — |
| 7.3 | ✅ Move inline `style="padding-right:10px"` to SCSS | 🟢 | S | — |
| 7.4 | ✅ Remove redundant optional chaining (`prefCountry?.code`) and helper non-null assertion (`x.code?.toLowerCase()!`) | 🟢 | S | — |
| 7.5 | ✅ `preferredCountryList` runs its own search pass separate from `filteredCountries` — now share `getCountriesBasedOnSearch` early-return + single lowercase | 🟡 | S | — |
| 7.6 | Template accesses `currency.*` / `language.*` sub-fields without guards — add null-safety once multi/optional fields land (ties to 2.4/2.5/2.7) | 🟢 | S | — |

---

## Suggested rollout

### Release A — Patch (no breaking changes)
- 1.1, 1.3, 1.4 (data bugs + integrity test)
- 4.1, 4.2, 4.3, 4.4 (keyboard/search correctness)
- 7.2, 7.3, 7.4, 7.5 (perf/cleanup)

### Release B — Minor (additive)
- 1.2 (Continent type), 3.1, 3.4, 3.5, 3.8 (new helpers)
- 5.1, 5.2, 5.3 (a11y)
- 6.1 (computed refactor), 4.5 (outside-click)

### Release C — Minor/Major (data-heavy, additive)
- 2.1 (alpha-3), 2.2 (flag emoji), 2.4 (multi-language)
- 3.2, 3.3, 3.6, 3.7 (region filter/grouping, sort, extended search)

### Release D — Major (breaking cleanups)
- 2.3 (native-name split), 2.5, 2.6, 2.7
- 6.2, 6.4, 7.1

---

## Open decisions for you
- [ ] Keep back-compat singular `language`/`currency` alongside new plural fields, or migrate fully?
- [ ] Native-name split (2.3) — worth the breaking change, or add `nativeName` and keep `name` as-is?
- [ ] Flag emoji derivation — precompute into data, or compute at runtime?
- [ ] Region grouping (3.3) — separate input flag, or infer when `regionCountryCodes` used?
