(ns web.core
  (:require [reagent.core :as reagent :refer [atom]]
            [secretary.core :as secretary]
            [reagent.session :as session]
            [reagent-forms.core :refer [bind-fields]]
            [ajax.core :refer [GET POST]]
            [mrhyde.mrhyde :refer [hyde? has-cache? from-cache]]
            [myhyde.core :refer [bootstrap]]
            [mrhyde.extend-js :refer [assoc-in! update-in!]]
            [mrhyde.typepatcher :refer [recurse-from-hyde-cache
                                        patch-known-sequential-types]]
            [mrhyde.funpatcher :refer [patch-return-value-to-clj
                                       patch-args-keyword-to-fn
                                       patch-args-clj-to-js]])
  (:require-macros [secretary.core :refer [defroute]]))

(def d3 (this-as ct (aget ct "d3")))

(defn navbar []
      [:div.navbar.navbar-inverse.navbar-fixed-top
       [:div.container
        [:div.navbar-header
         [:a.navbar-brand {:href "#/"} "web"]]
        [:div.navbar-collapse.collapse
         [:ul.nav.navbar-nav
          [:li {:class (when (= :home (session/get :page)) "active")}
           [:a {:on-click #(secretary/dispatch! "#/")} "Home"]]
          [:li {:class (when (= :map (session/get :page)) "active")}
           [:a {:on-click #(secretary/dispatch! "#/map")} "Map"]]
          [:li {:class (when (= :about (session/get :page)) "active")}
           [:a {:on-click #(secretary/dispatch! "#/about")} "About"]]]]]])

(defn about-page []
  [:div "this is the story of web... work in progress"])

(defn map-page []
  [:div
   [:h2 "Welcome to the map!"]])

(defn home-page []
  [:div
   [:h2 "Welcome to ClojureScript"]])

(def pages
  {:home home-page
   :map map-page
   :about about-page})

(defn page []
  [(pages (session/get :page))])

(defroute "/" [] (session/put! :page :home))
(defroute "/map" [] (session/put! :page :map))
(defroute "/about" [] (session/put! :page :about))

(defn mount-components []
  (reagent/render-component [navbar] (.getElementById js/document "navbar"))
  (reagent/render-component [page] (.getElementById js/document "app")))

(defn init! []
  (secretary/set-config! :prefix "#")
  (session/put! :page :home)
  (mount-components))


