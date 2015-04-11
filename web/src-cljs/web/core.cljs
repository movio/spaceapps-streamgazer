(ns web.core
  (:require [reagent.core :as reagent :refer [atom]]
            [ajax.core :refer [GET POST]]))

(defn home []
  [:div#map])

(defn home-did-mount []
  (let [d3Layer (js/L.GeoJSON.d3. (clj->js {:type "Feature"
                                            :geometry {
                                                       :type "Point"
                                                       :coordinates [125.6 10.1]
                                                       }
                                            :properties {
                                                         :name "Isaac!"
                                                         }}))
        map (.setView (.map js/L "map") #js [125.6 10.1] 13)]


    (.log js/console d3Layer)

    (.addTo (.tileLayer js/L "http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        (clj->js {:attribution "Map data &copy; [isac.]"
                                  :maxZoom 18}))
            map)

    (.addLayer map d3Layer)))

(defn home-component []
  (reagent/create-class {:reagent-render home
                         :component-did-mount home-did-mount}))

(defn mount-components []
  (reagent/render-component [home-component]
                            (.getElementById js/document "app")))

(defn init! []
  (mount-components))


