CDPM - CLI (v0.0.1)
===================

*Table Of contents*

<!-- TOC -->

- [0.1. Active Features](#01-active-features)
    - [0.1.1. dyn-py-ls](#011-dyn-py-ls)
- [0.2. Roadmap](#02-roadmap)

<!-- /TOC -->
A Computational Design Package Manager for developing in dynamo, grasshopper, python, and other AEC related software environments. 
First step is creating a CLI tool for developers.

## 0.1. Active Features

Current features supported.

``` sh
cdpm -V                                     output Version
cdpm -h                                     output usage information
cdpm dyn-py-ls <file>                       Lists all the python nodes in file and their pack, enabled status
cdpm dyn-find-nodeId <file> <nodeId>        Find node by node id. ex: `9d5edce5bbad41ff96a0dca1b9bdd8de`
cdpm dyn-find-nodeTypes <file> <nodeType>   Find node by type. ex: `PythonScriptNode`
```

### 0.1.1. dyn-py-ls

List our dynamo python nodes for quickly checking unbundling/bundling status + other userful information.

 Generally for tool making, we use dynamo as a means to access the API via python. The problem occurs during deployment, as we want to share our *.dyn file but during development we want to use an IDE/Code Editor of choice, having our .py file in an external file. The goal here is to **unpack (unbundle)** scripts when we want to edit it (developer mode), and **pack (bundle)**  for distribution.

**180917_pyDynBundler.dyn**

Here we have 1 of 6 dynamo python nodes in the file `180917_pyDynBundler.dyn`.

![Typical Py Dyn Setup](https://i.imgur.com/vbA5Rir.png)

**example of dyn-py-ls**

We can run this cli command to query all of the nodes and see their status.

``` sh

$>  cdpm dyn-py-ls .\180917_pyDynBundler.dyn
```

This will result in:

![dyn-py-ls console output](https://i.imgur.com/2fr4tszg.png)

## 0.2. Roadmap

Below is road map of other features planned


- cdpm-cli 
    bundler specific
    -----------------
        - bundle [folder] - moves to dist folder

    dynamo specific
    ---------------
        - 'dyn py-ls' - list python files, if they are packable .. pack status
        - 'dyn visualize'
        - 'dyn py-pack [file]' - packs a node up with its source files
        - 'dyn-py-unpack [file]' - unpack a node into its source files

    repo specific
    --------------
        - 'repo add [name] [url]' - adds a repo
        - 'repo push [name] [folder] -v=1.0' - pushes folder to named repo
        - 'repo pushAll [folder] -v=1.0' - pushes folder to all repo

    button specific
    ---------------
        - 'init [name]' - init a new folder
        - 'install [name]' - installs a button (looks at all repos)
        - 'search [name]' - searches for a button (look at all repos)
        - 'uninstall [name]' - uninstalls a button
        - 'update [name]' - updates a button
        - 'list' - lists installed buttons!

