(ns web.core
  (:require [reagent.core :as reagent :refer [atom]]
            [ajax.core :refer [GET POST]]))

(defn home []
  [:div#map])

(defn home-did-mount []
  (let [map (.setView (.map js/L "map") #js [51.505 -0.09] 13)]
    (.addTo (.tileLayer js/L "http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        (clj->js {:attribution "Map data &copy; [isac.]"
                                  :maxZoom 18}))
            map)))

(defn home-component []
  (reagent/create-class {:reagent-render home
                         :component-did-mount home-did-mount}))

(defn mount-components []
  (reagent/render-component [home-component]
                            (.getElementById js/document "app")))

(defn init! []
  (mount-components))


