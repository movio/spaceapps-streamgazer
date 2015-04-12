(ns web.routes.services
  (:require [compojure.core :refer :all]
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

(defn gen-small-polygon [point]
  (let [[lat lon] point
        sz 0.5]
    [[[(- lon sz) (- lat sz)]
       [(- lon sz) (+ lat sz)]
       [(+ lon sz) (+ lat sz)]
       [(+ lon sz) (- lat sz)]
       [(- lon sz) (- lat sz)]]]))

(defn bucket->feature [name unit bucket]
  (let [point (read-string (:key bucket))
        value (get-in bucket [:avg_value :value])]
    {:type "Feature"
     :geometry {:type "Polygon"
                :coordinates (gen-small-polygon point)}
     :properties {:name name
                  :unit unit
                  :value value}}))

(defn to-geo-json [resp]
  (let [aggs (esrsp/aggregations-from resp)
        first-hit (first (esrsp/hits-from resp))
        unit (get-in first-hit [:_source :unit])
        name (get-in first-hit [:_source :name])
        features (map (partial bucket->feature name unit)
                      (get-in aggs [:geo-loc :buckets]))]
    {:type "FeatureCollection"
     :features features}))

(defroutes service-routes
  (GET "/api/search" [name w s e n year]
       {:status 200
        :body (to-geo-json (water-quality-search name
                                                 (Double/parseDouble w)
                                                 (Double/parseDouble s)
                                                 (Double/parseDouble e)
                                                 (Double/parseDouble n)
                                                 year))}))
