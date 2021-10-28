import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import My from "../views/My.vue";
import AddingLot from "../views/seller/AddingLot.vue";
import Category from "../views/Category.vue";
import Product from "../views/Product.vue";
import PasswordReset from "../views/PasswordReset.vue";
import Login from "../views/Login.vue";
import socialAuth from "../views/SocialAuth.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/my/:tab",
    name: "my",
    component: My,
    meta: { requiresAuth: true },
  },
  {
    path: "/my/lots/add",
    name: "addLot",
    component: AddingLot,
  },
  {
    path: "/category/:slug",
    name: "category",
    component: Category,
  },
  {
    path: "/p/:slug",
    name: "product",
    component: Product,
  },
  {
    path: "/password/reset",
    name: "password-reset",
    component: PasswordReset,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/api/auth/google/callback",
    name: "google-auth-api",
    component: socialAuth,
  },
  {
    path: "/api/auth/facebook/callback",
    name: "facebook-auth-api",
    component: socialAuth,
  },

  {
    path: "/redirect-payment-added",
    name: "redirect-payment-added",
    component: () =>
      import(/* webpackPrefetch: true */ "../views/redirect-card-add.vue"),
  },
  {
    path: "/page/:slug",
    name: "page",
    component: () => import(/* webpackPrefetch: true */ "../views/Page.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
