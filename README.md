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
Here is the current progress:

| Target                   | Import       | Export       |
| ------------------------ | ------------ | ------------ |
| [amscd][amscd-url]       | `▓▓▓▓▓▓▓▓▓░` | `▓▓▓▓▓▓▓▓▓░` |
| [amscdx][amscdx-url]     | `▓▓▓▓░░░░░░` | `░░░░░░░░░░` |
| [CoDi][codi-url]         | `░░░░░░░░░░` | `░░░░░░░░░░` |
| [DOT][dot-url]           | `░░░░░░░░░░` | `░░░░░░░░░░` |
| [quiver][quiver-url]     | `▓▓▓▓▓▓▓▓░░` | `░░░░░░░░░░` |
| [tikz-cd][codi-url]      | `░░░░░░░░░░` | `░░░░░░░░░░` |
| [xymatrix][xymatrix-url] | `▓▓░░░░░░░░` | `░░░░░░░░░░` |
| ...                      |              |              |

[amscd-url]: https://ctan.org/pkg/amscd
[amscdx-url]: https://ctan.org/pkg/amscdx
[codi-url]: https://github.com/paolobrasolin/commutative-diagrams/
[dot-url]: https://en.wikipedia.org/wiki/DOT_(graph_description_language)
[quiver-url]: https://github.com/varkor/quiver
[tikzcd-url]: https://github.com/astoff/tikz-cd
[xymatrix-url]: https://ctan.org/pkg/xymatrix
[other-url]: https://ctan.org/topic/diagram-comm

## Abstract considerations

See https://github.com/paolobrasolin/ouroboros

## Practical considerations

There are many roads to implementation, but we can fix two constraints:

- this must work in a browser
- this must be written in a pleasant language

[TypeScript](typescript-url) is a natural choice and, among the [many JS parsing libraries][js-parsing-url], [nearley.js][nearley-url] seems to be outstanding: low entry point, separate grammar files, modular lexers, unparser, and many other features.

[typescript-url]: https://www.typescriptlang.org/
[js-parsing-url]: https://tomassetti.me/parsing-in-javascript/
[nearley-url]: https://nearley.js.org/

## Architectural guidelines

Each DSL has a dedicated folder containing a few components.

This is also true for our Universal Language, UL from now on.

- **`schema`** describes the AST with some `Struct`s implemented with `superstruct`.

  - It accounts for all optional fragments via `optional`.
    This allows to validating anything which is valid for the original processor, however minimal.
  - It accounts for all implicit defaults via `defaulted`.
    This allows the schema to be the single source of truth about the defaults, and consumers of the AST will trust coercion to make them explicit so they need no knowledge of them.
  - `defaulted`s should be on children `Struct`s, while `optional`s should be on the parent `Struct`s.
    This allows `assert`s to be a simple way (after coercion) to get rid of the `... | undefined` from the signatures of `optional` parts when processing the AST.
  - _This is the only component of the UL._ Right now there's no need for it to be a public API, and we use it just for internal representation.
    TODO: everything is optional apart from topology

- **`grammar`** is an optional `nearley` grammar which might be used by the `parser`.

  - It should not be ambiguous.

- **`parser`** implements a `parse` function to transform sourcecode into an AST.

  - `parse` is responsible to perform any extra necessary decoding/deserialization on the input.
  - `parse` outputs a bona fide object respecting `schema`, meaning that the signatures are correct but no explicit validation (and especially no coercion) is done at this time.
  - `parse` outputs an array to account for ambiguity and simplify testing, but it should only contain a single object as we ban ambiguous grammars.

- **`injector`** implements an `inject` function mapping the DSL AST into the UL AST.

  - `inject` must assume scheme coercion has been done, so it can have no knowledge of the DSL defaults and can simply perform a few `assert`s to check for presence.
  - `inject` must output all and only the characteristics present in the input, regardless of the defaults of the UL schema (if any) -- in other terms, no assumptions on the UL default must be made.
    This allows specific testing and avoids the need for backtracking when adding new features to the UL.

- **`projector`** implements a `project` function mapping the UL AST onto the DSL AST.

  - `project` makes no assumpion about scheme coercion, and it maps only features available in the target DSL.
  - **TODO**: decide a reasonable policy for features which can only be _approximated_.

- **`renderer`** implements a `render` function to transform an AST to sourcecode.

  - **TODO**: perhaps `render` should include a minification process to produce the minimal code leveraging implicit defaults of the DSL.

- **`index`** ties together all the components.
  - It implements `read = inject ∘ coerce ∘ parse`, which translates DSL source into its representation in universal language.
  - It implements `write = render ∘ project ∘ coerce`, which translates a univesal language representation into DSL source.

<!--

TODO: I can think of two general guidelines for the universal schema, but I must decide.

1. Everything except topology is optional.

   - **injector input** needs to be `assert`ed to circumvent `* | undefined` signatures (after the guarantee of external coercion to make defaults explicit)
   - **injectors output** might not be `create`d, as specifying only actively used properties is ok
   - **projectors input** needs to be `assert`ed to circumvent partial signatures (after the guarantee of external coercion to make defaults explicit)

   - coercion can be done automagically after injecting w/ a single create on root

2. Everything is mandatory (w/ reasonable defaults).

   - **injector input** AS ABOVE
   - **injectors output** needs to be `create`d as the injector must not know about defaults and all properties are mandatory (also, to avoid breakages at every schema change)
   - **projectors input** has clear signatures and can be destructured right away while ignoring unsupported features of the target DSL

   - apparently we need no coercion, but it's just buried in injection due to stricter typing

Also in general we need to use toMatchObject to keep tests simple and avoid future breakages when adding properties.

So, apparently, stricter typing on the UL is a good thing!

-->
