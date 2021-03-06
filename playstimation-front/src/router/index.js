import Vue from "vue";
import VueRouter from "vue-router";
import HelloWorld from "../components/HelloWorld";
import GameInfo from "../components/GameInfo";
import NotFound from "../components/NotFound";
import AuthForm from "../components/AuthForm";
import WishList from "../components/WishList";
import store from "../store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/wishlist",
    name: "Wishlist",
    component: WishList,
    props: { isSignInPage: true },
  },
  {
    path: "/game/:game",
    name: "Search",
    component: GameInfo,
  },
  {
    path: "/NotFound",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/login",
    name: "LogIn",
    component: AuthForm,
    props: { isSignInPage: true },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: AuthForm,
    props: { isSignInPage: false },
  },
  {
    path: "/",
    name: "Home",
    component: HelloWorld,
  },
  {
    path: "/WishList",
    name: "WishList",
    component: WishList,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if ((to.name === "LogIn" || to.name === "SignUp") && store.state.token) {
    next({ name: from.name });
    console.log("Already log in");
  } else next();
});
export default router;
