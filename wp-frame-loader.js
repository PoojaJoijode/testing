window.addEventListener("DOMContentLoaded", function () {
  const BASE = "https://poojajoijode.github.io/testing/";
  const DEFAULT = "webli1.html";
  const frame = document.getElementById("pubFrame");
  let suppressSync = false;

  if (!frame) return;

  function currentFile() {
    return new URLSearchParams(window.location.search).get("page") || DEFAULT;
  }

  function frameSrc(file) {
    return BASE + file;
  }

  function scrollTopNow() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function updateUrl(file, mode) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", file);

    if (mode === "push") {
      history.pushState(null, "", url);
    } else {
      history.replaceState(null, "", url);
    }
  }

  function loadFromUrl() {
    const file = currentFile();
    const src = frameSrc(file);

    suppressSync = true;
    if (frame.getAttribute("src") !== src) {
      frame.setAttribute("src", src);
    }
    scrollTopNow();

    setTimeout(function () {
      suppressSync = false;
    }, 300);
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  loadFromUrl();

  iFrameResize(
    {
      heightCalculationMethod: "documentElementOffset",
      checkOrigin: ["https://poojajoijode.github.io"],
      tolerance: 0
    },
    "#pubFrame"
  );

  window.addEventListener("popstate", loadFromUrl);

  window.addEventListener("message", function (event) {
    if (event.origin !== "https://poojajoijode.github.io") return;
    if (!event.data || !event.data.type) return;

    const file = event.data.page || DEFAULT;

    if (event.data.type === "sync-page") {
      if (!suppressSync && currentFile() !== file) {
        updateUrl(file, "replace");
      }
      scrollTopNow();
      return;
    }

    if (event.data.type === "navigate-page") {
      if (currentFile() !== file) {
        updateUrl(file, "push");
      }

      const src = frameSrc(file);
      if (frame.getAttribute("src") !== src) {
        frame.setAttribute("src", src);
      }

      scrollTopNow();
    }
  });
});
