# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.2.0] - 2023-05-27

### Changed

- `dbkex`, `errors`, `lib` and `trace` modules moved to `/core` folder
- All `/routes` modules now use functions defined in `/controllers/{entity}Controller` modules
- New `/controllers/{entity}Controller` modules use functions defined in `/queries/{entity}Queries` modules
- New `/queries/{entity}Queries` modules define and return SQL queries either as string or knex object

## [2.1.0] - 2022-12-28

### Changed

- New errors.js module with enhanced error & exception handling
- Sends a JSON response with { "error": "... Message ..." }

---

## [2.0.0] - 2022-06-11

### Changed

- Now using [KnexJS](http://knexjs.org/) for all database access
- Removed package config and use only dotenv and environment variables for db access

---

## [1.2.0] - 2022-05-08

### Added

- Added support for CO Galactiques
- COG hidden until official release of the game

---

## [1.1.0] - 2021-03-02

### Changed

- Code reorganization

---

## [1.0.0] - 2020-05-13

### Release

- Official release of comob-api v1.0.0 with full support for

---

## [0.3.0] - 2020-02-26

### Added

- Added routes for equipment

---

## [0.2.0] - 2019-07-30

### Added

- Added support for CO Contemporain dataset

---

## [0.1.0] - 2019-07-30

### Added

- Added english route names

---

## [0.0.1] - 2019-07-04

### Initial commit
