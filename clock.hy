(import [flask [Flask render_template]])
(require horn.flask)

(setv *app* (Flask "__main__"))

(endpoint "/" "clock.html")
