(ns web.routes.services
  (:require [ring.util.http-response :refer :all]
            [compojure.api.sweet :refer :all]
            [schema.core :as s]
            [clojurewerkz.elastisch.rest :as es]
            [clojurewerkz.elastisch.rest.document :as esd]
            [clojurewerkz.elastisch.rest.response :as esrsp]))


(defonce elastic-url "http://107.170.217.185:9200")
(defonce elastic-index "river_flow")

(defn gen-query [name w s e n year]
  {:filtered
   {:query {:match {:name name}}
    :filter {:and [{:range
                    {:date-time {:gte (str year "-01-01")
                                 :lte (str year "-12-31")}}}
                   {:geo_bounding_box
                    {:geo-loc {:top_left {:lat n :lon w}
                               :bottom_right {:lat s :lon e}}}}]}}})

(def aggregation-clause
  {:geo-loc {:terms {:script "doc['geo-loc'].value.toString()"}
             :aggs {:avg_value {:avg {:field "value"}}}}})

(defn water-quality-search [name w s e n year]
  (let [conn (es/connect elastic-url)
        q (gen-query name w s e n year)]
    (esd/search conn elastic-index "stream"
                :query q
                :aggs aggregation-clause
                :from 0
                :size 2000)))

(defn bucket->feature [name unit bucket]
  (let [point (read-string (:key bucket))
        value (get-in bucket [:avg_value :value])]
    {:type "Feature"
     :geometry {:type "Point"
                :coordinates point}
     :properties {:name name
                  :unit unit
                  :value value}}))

(s/defschema GeoJSON
  {:type String
   :features [{:type String
               :geometry {:type String
                          :coordinates [Double]}
               :properties {:name String
                            :unit String
                            :value Double}}]})

(defn to-geo-json [resp]
  (let [aggs (esrsp/aggregations-from resp)
        first-hit (first (esrsp/hits-from resp))
        unit (get-in first-hit [:_source :unit])
        name (get-in first-hit [:_source :name])
        features (map (partial bucket->feature name unit)
                      (get-in aggs [:geo-loc :buckets]))]
    {:type "FeatureCollection"
     :features features}))

(defapi service-routes
  (ring.swagger.ui/swagger-ui
   "/swagger-ui"
   :api-url "/swagger-docs")
  (swagger-docs
   :title "Sample api")
  (swaggered "waterquality"
   :description "Water quality data search API"
   (context "/api" []

    (GET* "/search" []
          :return       GeoJSON
          :query-params [name :- String
                         w :- Double
                         s :- Double
                         e :- Double
                         n :- Double
                         year :- String]
          :summary      "Query water quality data of given year within a bound box range"
          (to-geo-json (water-quality-search name w s e n year))))))
