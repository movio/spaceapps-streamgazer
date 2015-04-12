(ns crawler.webservice
  (:require [clojure.data.csv :as csv]
            [clj-http.client :as http]
            [clojure.java.io :as io]))

(def station-search-url "http://www.waterqualitydata.us/Station/search")
(def result-search-url "http://www.waterqualitydata.us/Result/search")

(defn read-csv-as-map [input]
  (let [data (csv/read-csv input)
        column-names (first data)
        data (rest data)]
    (map #(zipmap column-names %) data)))


(defn- params [geo-loc start-date end-date]
  {"bBox" (apply str (interpose "," geo-loc))
   "startDateLo" start-date
   "startDateHi" end-date
   "mimeType" "csv"})


(defn search-sites [geo-loc start-date end-date]
  (let [q (params geo-loc start-date end-date)
        resp (http/get station-search-url {:query-params q
                                           :as :stream})
        reader (io/reader (:body resp))]
    ;(println (dissoc resp :body))
    (->> reader
         read-csv-as-map
         (map (fn [m]
                [(get m "MonitoringLocationIdentifier")
                 (select-keys m ["LatitudeMeasure" "LongitudeMeasure"])]))
         (into {}))))

(def characteristics
  ["Depth"
   "Current speed"
   "Temperature, water"
   "Stream width measure"
   "Stream flow, mean. daily"
   "Stream velocity"])

(def result-columns
  [[["ActivityIdentifier"]
    (fn [v] [:activity-id v])]
   [["MonitoringLocationIdentifier"]
    (fn [v] [:loc-id v])]
   [["CharacteristicName"]
    (fn [v] [:name v])]
   [["ResultMeasureValue"]
    (fn [v] [:value v])]
   [["ResultMeasure/MeasureUnitCode"]
    (fn [v] [:unit v])]
   [["ActivityStartDate"
     "ActivityStartTime/Time"]
    (fn [date time] [:date-time (str date "T" time)])]
   [["LatitudeMeasure"
     "LongitudeMeasure"]
    (fn [lat lon] [:geo-loc (str lat "," lon)])]])


(defn transform-item [m]
  (->> result-columns
       (map (fn [[cols f]]
              (->> (map #(get m %) cols)
                   (apply f))))
       (into {})))

(defn search-results [geo-loc start-date end-date]
  (let [sites (future (search-sites geo-loc start-date end-date))
        q (assoc (params geo-loc start-date end-date)
                 "characteristicName"
                 (apply str (interpose ";" characteristics)))
        resp (http/get result-search-url {:query-params q
                                          :as :stream})
        reader (io/reader (:body resp))]
    (->> reader
         read-csv-as-map
         (map (fn [m]
                (let [m (select-keys m (mapcat first result-columns))
                      site-id (get m "MonitoringLocationIdentifier")]
                  (if-let [loc (get @sites site-id)]
                    (->> loc
                         (into m)
                         transform-item))))))))
