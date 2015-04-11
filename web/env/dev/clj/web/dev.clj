(ns web.dev
  (:require [cemerick.piggieback :as piggieback]
            [weasel.repl.websocket :as weasel]
            [leiningen.core.main :as lein]))

(defn browser-repl []
  (piggieback/cljs-repl :repl-env (weasel/repl-env :ip "127.0.0.1" :port 9001)))

(defn start-figwheel []
  (future
    (print "Starting figwheel.\n")
    (lein/-main ["figwheel"])))
