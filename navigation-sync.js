(function () {
  function getFileName() {
    return location.pathname.split("/").pop() || "webli1.html";
  }

  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  function postToParent(payload) {
    if (!inIframe()) return false;
    try {
      window.top.postMessage(payload, "*");
      return true;
    } catch (e) {
      return false;
    }
  }

  function syncCurrentPage() {
    if (!inIframe()) return;
    postToParent({
      type: "sync-page",
      page: getFileName()
    });
  }

  document.addEventListener("click", function (e) {
    const a = e.target.closest("a");
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href) return;

    // leave these alone
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

    // only handle html links, and only inside iframe
    if (/\.html?($|[?#])/.test(href) && inIframe()) {
      e.preventDefault();
      e.stopPropagation();

      const page = href.split("#")[0].split("?")[0];
      const hash = href.includes("#") ? "#" + href.split("#").slice(1).join("#") : "";

      postToParent({
        type: "navigate-page",
        page: page,
        hash: hash
      });
    }
  }, false);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncCurrentPage);
  } else {
    syncCurrentPage();
  }
})();
