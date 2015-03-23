# [![CLEVER Logo](https://raw.githubusercontent.com/imperodesign/skeleton/master/app/assets/src/img/skeleton-logo.png?raw=true)](http://cleverframework.io/) Clever Framework's CLI

The web's scaffolded tool for "Clever" webapps. The cli provides a lot of useful functionality, such as scaffolding options to create new packages, assign roles to users, check the mongo status, add/remove packages and list currently installed packages.

## The repository contains
* The bin file used for cli operations.
* Core functionality for managing clever packages.

## Basic Usage

  Install Package:

    $ [sudo] npm install -g clever-cli

  Explore CLI functionality:

    $ clever --help

  Create a new clever app:

    $ clever init <MyApp>

  Install Dependencies:

    $ cd <MyApp> && npm install

  Create a sample clever package:

    $ clever package <NameOfYourPackage>

  Run your app:

    $ gulp
