(function () {
  function getFileName() {
    return location.pathname.split("/").pop() || "webli1.html";
  }

  function postToParent(payload) {
    if (window.top !== window.self) {
      try {
        window.top.postMessage(payload, "*");
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  function syncCurrentPage() {
    postToParent({
      type: "sync-page",
      page: getFileName()
    });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;

    var href = a.getAttribute("href");
    if (!href) return;

    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      href.startsWith("http://") ||
      href.startsWith("https://")
    ) {
      return;
    }

    if (/\.html?($|[?#])/.test(href)) {
      var page = href.split("#")[0].split("?")[0];
      var hash = href.includes("#") ? "#" + href.split("#").slice(1).join("#") : "";

      // Only intercept when page is inside iframe
      if (window.top !== window.self) {
        e.preventDefault();
        e.stopPropagation();

        postToParent({
          type: "navigate-page",
          page: page,
          hash: hash
        });
      }
      // Otherwise do nothing and let browser navigate normally
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncCurrentPage);
  } else {
    syncCurrentPage();
  }
})();
