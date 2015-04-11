(ns crawler.model
  (:require [clojurewerkz.elastisch.rest :as es]
            [clojurewerkz.elastisch.rest.document :as esd]
            [clojurewerkz.elastisch.rest.index :as esi]
            [clojurewerkz.elastisch.query :as q]))

(defonce elastic-url "http://127.0.0.1:9200")
(defonce elastic-index "river_flow")

(defonce mapping-types
  {"stream" {:properties
             {:geo-loc      {:type "geo_point" :store "yes"}
              :date-time    {:type "date"      :store "yes"}
              :name         {:type "string"    :store "yes"}
              :value        {:type "double"    :store "yes"}
              :loc-id       {:type "string"    :store "yes"}
              :unit         {:type "string"    :store "yes"}
              :activity-id  {:type "string"    :store "yes"}}}})

(def ^:dynamic *connection* nil)

(defmacro with-elastic [& body]
  `(binding [*connection* (es/connect elastic-url)]
     ~@body))

(defn init-index []
  (when-not (esi/exists? *connection* elastic-index)
    (esi/create *connection* elastic-index :mappings mapping-types)))

(defn- insert-document [mapping doc]
  (esd/create *connection* elastic-index mapping doc))

(def insert-waterquality-data (partial insert-document "stream"))
