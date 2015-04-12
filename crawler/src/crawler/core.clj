(ns crawler.core
  (:require [crawler.model :as m]
            [crawler.webservice :as s]
            [clojure.java.io :as io])
  (:gen-class))

(defn crawl-data
  [args]
  (let [geo-loc (map #(Double/parseDouble %) (take 4 args))
        start-date (nth args 4)
        end-date (nth args 5)]
    (m/with-elastic
      (m/init-index)
      (doseq [doc (s/search-results geo-loc start-date end-date)]
        (try
          (m/insert-waterquality-data doc)
          (catch e (println "Error inserting doc" e)))))))



(defn fake-data
  [points-file start-year end-year]
  (let [rdr (io/reader points-file)
        lines (line-seq rdr)]))

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (if (< (count args) 6)
    (println "Usage: java crawler.jar west-lon south-lat east-lon north-lat start-date end-date")
    (crawl-data args)))
