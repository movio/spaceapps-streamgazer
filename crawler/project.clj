(defproject crawler "0.1.0-SNAPSHOT"
  :description "River flow data crawler"
  :url "https://github.com/movio/spaceapps-streamgazer"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [clojurewerkz/elastisch "2.1.0"]]
  :main ^:skip-aot crawler.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
