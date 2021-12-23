# fletcher

[![CI tests status badge][build-shield]][build-url]
[![Latest release badge][rubygems-shield]][rubygems-url]
[![License badge][license-shield]][license-url]
[![Maintainability badge][cc-maintainability-shield]][cc-maintainability-url]
[![Test coverage badge][cc-coverage-shield]][cc-coverage-url]

[build-shield]: https://img.shields.io/github/workflow/status/paolobrasolin/fletcher/CI/main?label=tests&logo=github
[build-url]: https://github.com/paolobrasolin/fletcher/actions/workflows/main.yml "CI tests status"
[rubygems-shield]: https://img.shields.io/npm/v/TODO?logo=npm
[rubygems-url]: https://rubygems.org/gems/fletcher "Latest release"
[license-shield]: https://img.shields.io/github/license/paolobrasolin/fletcher
[license-url]: https://github.com/paolobrasolin/fletcher/blob/main/LICENSE "License"
[cc-maintainability-shield]: https://img.shields.io/codeclimate/maintainability/paolobrasolin/fletcher?logo=codeclimate
[cc-maintainability-url]: https://codeclimate.com/github/paolobrasolin/fletcher "Maintainability"
[cc-coverage-shield]: https://img.shields.io/codeclimate/coverage/paolobrasolin/fletcher?logo=codeclimate&label=test%20coverage
[cc-coverage-url]: https://codeclimate.com/github/paolobrasolin/fletcher/coverage "Test coverage"

<img align="right" width="192px" alt="Victorian illustration of a boy drawing a bow." src="https://github.com/paolobrasolin/fletcher/raw/main/boy.png">

This project is a sourcecode transpiler for commutative diagrams.

The aim is being able to translate from and to **any** format, most of which are LaTeX DSLs.

Here is the progress on the planned ones:

| Target                   | Import       | Export       |
| ------------------------ | ------------ | ------------ |
| [amscd][amscd-url]       | `██████████` | `██████████` |
| [amscdx][amscdx-url]     | `██████░░░░` | `███████░░░` |
| [CoDi][codi-url]         | `░░░░░░░░░░` | `░░░░░░░░░░` |
| [quiver][quiver-url]     | `████████░░` | `███████░░░` |
| [tikz-cd][tikzcd-url]    | `░░░░░░░░░░` | `░░░░░░░░░░` |
| [xymatrix][xymatrix-url] | `██░░░░░░░░` | `░░░░░░░░░░` |
| ...                      |              |              |

[amscd-url]: https://ctan.org/pkg/amscd
[amscdx-url]: https://ctan.org/pkg/amscdx
[codi-url]: https://github.com/paolobrasolin/commutative-diagrams/
[quiver-url]: https://github.com/varkor/quiver
[tikzcd-url]: https://github.com/astoff/tikz-cd
[xymatrix-url]: https://ctan.org/pkg/xymatrix
[other-url]: https://ctan.org/topic/diagram-comm

## Abstract nonsense

Private repo: https://github.com/paolobrasolin/ouroboros

## Practical considerations

A transpiler like this could be realized with many technologies.
I have a few end goals:

- integrating this in [quiver][quiver-url];
- creating a conversion service with no backend infrastructure;
- using a pleasant language, with good libraries;
- learning something new.

[TypeScript](typescript-url) therefore looks like the best choice.
On top of it, two outstanding libraries that trivialize a lot of groundwork are [nearley.js][nearley-url] for grammar-based parsing and [Superstruct][superstruct-url] for data validation and coercion.

[typescript-url]: https://www.typescriptlang.org/
[nearley-url]: https://nearley.js.org/
[superstruct-url]: https://docs.superstructjs.org/

## Architectural guidelines

Freely transpiling among many DSLs requires a transpilation procedure for each ordered source/target language pair we want to connect.

How many transpilers do we need in total?

- If we connect `n` DSLs directly, then we need two times `n(n-1)/2` (i.e. twice the number of edges of a [`Kₙ graph`][complete-graph-url]).
- If we connect `n` DSLs through an artificial Universal Language, then we need two times `n` (i.e. twice the number of edges of the [`Sₙ graph`](star-graph-url)).

[star-graph-url]: https://en.wikipedia.org/wiki/Star_(graph_theory)
[complete-graph-url]: https://en.wikipedia.org/wiki/Complete_graph

Implementing an Universal Language (UL for short) clearly is the winning strategy.

Each DSL will have a dedicated folder
It will contain a some components allowing it to be transpiled back and forth from the UL.

- **`schema`** describes the AST with `superstruct` structures.

  - Optional fragments of the DSL are accounted for by using `optional`.
    Anything which is valid for the original processor must `validate`.
  - Implicit defaults of the DSL are accounted for by using `defaulted`.
    The schema must be the single source of truth for about the DSL defaults: consumers of the AST must simply trust coercion (e.g. via `create`) to make them defaults explicit.
  - In nested objects `defaulted`s must be on children `Struct`s, while `optional`s should be on the parent `Struct`s.
    This allows `assert`s to be a simple way (after coercion) to get rid of the `... | undefined` from the signatures of `optional` parts when processing the AST.

- **`grammar`** describes the DSL with a `nearley` grammar.

  - It is an optional component which might be used by the `parser`.
  - It must not be ambiguous.

- **`parser`** implements a `parse` function to transform sourcecode into an AST.

  - `parse` is responsible to perform any extra necessary decoding/deserialization on the input.
  - `parse` outputs a bona fide object respecting `schema`, meaning that the signatures are correct but no explicit validation (and especially no coercion) is done at this time.
  - `parse` may output an array to account for ambiguity and simplify testing, but it should only contain a single object as we ban ambiguous grammars.

- **`injector`** implements an `inject` function mapping the DSL AST into the UL AST.

  - `inject` must assume scheme coercion has been done, so it can have no knowledge of the DSL defaults and can simply perform a few `assert`s to check for presence and cirvumvent the inconvenient `* | undefined` signatures.
  - `inject` must `create` its output, so it can avoid reasoning only about the features being actively used.
    This allows targeted testing with `toMatchObject` and avoids the need for backtracking when adding new features to the UL, all while keeping the UL fully explicit.

- **`projector`** implements a `project` function mapping the UL AST onto the DSL AST.

  - `project` maps only features available in the target DSL.
  - **TODO**: a policy for approximating missing features and collecting waringns for unsupported ones must be estabilished.

- **`renderer`** implements a `render` function to transform an AST to sourcecode.

  - **TODO**: perhaps `render` should include a minification process to produce the minimal code leveraging implicit defaults of the DSL.
    Maybe avoiding coercion is enough, but I haven't made up my mind yet.

- **`index`** ties together all components into a simple API.
  - It implements `read = inject ∘ coerce ∘ parse`, which translates DSL source into its representation in universal language.
  - It implements `write = render ∘ project ∘ coerce`, which translates a univesal language representation into DSL source.
    (**NOTE:** coercion here can be omitted as long as we keep the UL completely explicit.)

The UL will also have its own folder.
It will contain much less than other DSLs, since it's used only for internal representation.

- **`schema`** describes the AST with `superstruct` structures.

  - This is the only component of the UL and is used only for internal representation.

A few more words should be spent about the design of the UL, as two very different approaches can be followed for the usage of `optional` structures.

1. Everything is optional (except topology).

   - **PRO**: _injectors output_ can be limited to the used attributes
   - **CON**: _projectors input_ needs to be `assert`ed to circumvent partial signatures (after the input has been coerced externally, of course)

2. Everything is mandatory (and has reasonable defaults).

   - **CON**: _injectors output_ must be `create`d as the injector must not know about defaults and all properties are mandatory; this also avoids breakage on UL extensions
   - **PRO**: _projectors input_ has simple signatures (no `* | undefined`) and can be destructured right away while simply ignoring unsupported features of the target DSL

It's a matter of balance, but ultimately the latter alternative has slightly better ergonomics, and a fully explicit UL schema should be simpler to reason about.
