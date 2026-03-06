(function () {
  function getFileName() {
    return location.pathname.split("/").pop() || "webli1.html";
  }

  function postToParent(payload) {
    if (window.top !== window.self) {
      try {
        window.top.postMessage(payload, "*");
      } catch (e) {}
    }
  }

  // Tell parent which page is currently loaded
  function syncCurrentPage() {
    postToParent({
      type: "sync-page",
      page: getFileName()
    });
  }

  // Catch internal link clicks before browser navigates
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;

    var href = a.getAttribute("href");
    if (!href) return;

    // ignore anchors, mailto, tel, external links, javascript links
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

    // only handle html files in same folder
    if (/\.html?($|[?#])/.test(href)) {
      postToParent({
        type: "navigate-page",
        page: href.split("#")[0].split("?")[0]
      });
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncCurrentPage);
  } else {
    syncCurrentPage();
  }
})();
