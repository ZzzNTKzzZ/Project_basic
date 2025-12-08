import express from "express";
import routerProduct from "./products.js";
import routerOrder from "./order.js"
import routerUser from "./user.js";
import routerCategory from "./category.js"
import routerCart from "./cart.js"

export default function routes(app) {
    app.get("/", (req, res) => {
        res.render("home")
    })
    app.use("/products", routerProduct)
    app.use("/order", routerOrder)
    app.use("/user", routerUser)
    app.use("/category", routerCategory)
    app.use("/cart", routerCart)
} 