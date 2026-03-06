(function () {
  const BASE = "https://poojajoijode.github.io/testing/";
  const DEFAULT = "webli1.html";
  const frame = document.getElementById("pubFrame");

  if (!frame) return;

  function currentFile() {
    const h = (window.location.hash || "").replace(/^#/, "").trim();
    return h || DEFAULT;
  }

  function scrollTopNow() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function setFrameSrc() {
    const file = currentFile();
    const newSrc = BASE + file;

    if (frame.getAttribute("src") !== newSrc) {
      frame.setAttribute("src", newSrc);
    }

    scrollTopNow();
    setTimeout(scrollTopNow, 100);
    setTimeout(scrollTopNow, 300);
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  setFrameSrc();

  frame.addEventListener("load", function () {
    scrollTopNow();
    setTimeout(scrollTopNow, 100);
  });

  iFrameResize(
    {
      heightCalculationMethod: "documentElementOffset",
      checkOrigin: ["https://poojajoijode.github.io"],
      tolerance: 0
    },
    "#pubFrame"
  );

  window.addEventListener("hashchange", setFrameSrc);
  window.addEventListener("popstate", setFrameSrc);

  window.addEventListener("message", function (event) {
    if (event.origin !== "https://poojajoijode.github.io") return;

    if (event.data && event.data.type === "inner-page-changed") {
      const file = event.data.page || DEFAULT;

      if (window.location.hash !== "#" + file) {
        history.pushState(null, "", "#" + file);
      }

      scrollTopNow();
      setTimeout(scrollTopNow, 100);
      setTimeout(scrollTopNow, 300);
    }
  });
})();
