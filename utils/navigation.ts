type RouterLike = {
  back: () => void;
  replace: (href: string) => void;
  canGoBack?: () => boolean;
};

export function navigateBackOrReplace(router: RouterLike, fallbackHref = "/") {
  if (typeof router.canGoBack === "function" && router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallbackHref);
}
