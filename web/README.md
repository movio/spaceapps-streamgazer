# web

Web client for NASA stream gazer challenge project.

## Prerequisites

You will need [Leiningen][1] 2.0 or above installed.

[1]: https://github.com/technomancy/leiningen

## ES6/7 vs ClojureScript

For implementation of the client-side this project includes support for
ClojureScript, but all the functionality is currently written in ES6/7.

The compatibility wrappers of libraries such as [D3](http://d3js.org/) and
[Leaflet](http://leafletjs.com/) for ClojureScript that we found appear to be
out-of-date, and as we initially have only 2 days to write code for the
SpaceApps challenge we have focused on functionality instead of getting these
compatibility layers working. In future the ES6/7 might be ported to
ClojureScript.

## Running

To start a web server for the application, run:

    lein ring server

To automatically compile [ES6/7](https://babeljs.io/) changes to JavaScript, run:

    lein auto babel
    
To automatically compile [SASS](http://sass-lang.com/) changes to CSS, run:

    lein auto compile

And Figwheel will automatically push and reload CSS changes to the client. It
will also compile and push [ClojureScript](https://github.com/clojure/clojurescript)
code changes to the client if there is ClojureScript to push, run: 

    lein figwheel



## License

Copyright © 2015 Movio Ltd. All rights reserved.

The use and distribution terms for this software are covered by the
Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
which can be found in the file epl-v10.html at the root of this distribution.
By using this software in any fashion, you are agreeing to be bound by
the terms of this license.
You must not remove this notice, or any other, from this software.
