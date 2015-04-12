(ns crawler.core
  (:require [crawler.model :as m]
            [crawler.webservice :as s]
            [clojure.java.io :as io]
            [clj-time.core :as t]
            [clj-time.periodic :as p]
            [clojure.string :as str])
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
          (catch Exception e
            (println "Doc: " doc)
            (println "Error inserting doc" e)))))))

(def rand (java.util.Random.))

(defn fake-data
  [points-file start-year]
  (let [points (map #(str/split % #"\s+") (line-seq (io/reader points-file)))
        days (take-while
              (partial t/after? (t/now))
              (p/periodic-seq (t/date-time start-year) (t/days 1)))]
    (m/with-elastic
      (m/init-index)
      (doseq [[point initial-val] points
              :let [initial-val (Double/parseDouble initial-val)]]
        (doseq [day days]
          (doseq [name s/characteristics
                  :let [diff (- 10 (.nextInt rand 20))]]
            (m/insert-waterquality-data {:name name
                                         :value (+ initial-val diff)
                                         :geo-loc point
                                         :loc-id (str "foo-" point)
                                         :activity-id "foo"
                                         :unit "m"})))))))

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (if (< (count args) 6)
    (println "Usage: java crawler.jar west-lon south-lat east-lon north-lat start-date end-date")
    (crawl-data args)))
