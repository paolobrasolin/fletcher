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

The aim is being able to translate _from and to_ any of the following formats:

- [quiver][quiver-url] internal representation (crucial: the best editor)
- [DOT][dot-url] graph description language (simple grammar)
- [CoDi][codi-url] based TikZ picture (crucial: mine!)
- [tikz-cd][tikzcd-url] based TikZ picture (crucial: gaining traction)
- [xymatrix][xymatrix-url] based XY-pic picture (to save people)
- [amscd][amscd-url] figure (to save people)
- [other][other-url] LaTeX packages
- ...

[quiver-url]: https://github.com/varkor/quiver
[codi-url]: https://github.com/paolobrasolin/commutative-diagrams/
[tikzcd-url]: https://github.com/astoff/tikz-cd
[xymatrix-url]: https://ctan.org/pkg/xymatrix
[amscd-url]: https://ctan.org/pkg/amscd
[dot-url]: https://en.wikipedia.org/wiki/DOT_(graph_description_language)
[other-url]: https://ctan.org/topic/diagram-comm

## Implementation progress

| Target                   | Import  | Export  |
| ------------------------ | ------- | ------- |
| [quiver][quiver-url]     | `▓▓▓▓░` | `░░░░░` |
| [tikz-cd][codi-url]      | `░░░░░` | `░░░░░` |
| [CoDi][codi-url]         | `░░░░░` | `░░░░░` |
| [xymatrix][xymatrix-url] | `▓░░░░` | `░░░░░` |
| [amscd][amscd-url]       | `░░░░░` | `░░░░░` |

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
