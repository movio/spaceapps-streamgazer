(ns crawler.model
  (:require [clojurewerkz.elastisch.rest :as es]
            [clojurewerkz.elastisch.rest.document :as esd]
            [clojurewerkz.elastisch.rest.index :as esi]
            [clojurewerkz.elastisch.query :as q]))

(defonce elastic-url "http://127.0.0.1:9200")
(defonce elastic-index "river_flow")

(defonce mapping-types {"river" {:properties {:loc          {:type "geo_point" :store "yes"}
                                              :date         {:type "date"      :store "yes"}
                                              :water-depth  {:type "integer"   :store "yes"}}}})

(def ^:dynamic *connection* nil)

(defn init-index []
  (with-elastic
    (esi/create *connection* elastic-index :mappings mapping-types)))

(defmacro with-elastic [& body]
  `(binding [*connection* (es/connect elastic-url)]
     ~@body))

(defn- insert-document [mapping doc]
  (esd/create *connection* elastic-index mapping doc))
