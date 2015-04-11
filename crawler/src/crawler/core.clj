(ns crawler.core
  (:require [crawler.model :as m]
            [crawler.webservice :as s])
  (:gen-class))

(defn crawl-data
  [args]
  (let [geo-loc (map #(Double/parseDouble %) (take 4 args))
        start-date (nth args 4)
        end-date (nth args 5)]
    (m/with-elastic
      (m/init-index)
      (doseq [doc (s/search-results geo-loc start-date end-date)]
        (m/insert-waterquality-data doc)))))

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (if (< (count args) 6)
    (println "Usage: java crawler.jar west-lon south-lat east-lon north-lat start-date end-date")
    (crawl-data args)))
