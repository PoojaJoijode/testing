(function () {
  const BASE = "https://poojajoijode.github.io/testing/";
  const DEFAULT = "webli1.html";
  const frame = document.getElementById("pubFrame");

  if (!frame) return;

  function currentFile() {
    const p = new URLSearchParams(window.location.search).get("page");
    return p || DEFAULT;
  }

  function setFrameSrc() {
    const file = currentFile();
    const src = BASE + file;

    if (frame.getAttribute("src") !== src) {
      frame.setAttribute("src", src);
    }

    window.scrollTo(0, 0);
  }

  setFrameSrc();

  iFrameResize(
    {
      heightCalculationMethod: "documentElementOffset",
      checkOrigin: ["https://poojajoijode.github.io"],
      tolerance: 0
    },
    "#pubFrame"
  );

  window.addEventListener("message", function (event) {
    if (event.origin !== "https://poojajoijode.github.io") return;
    if (!event.data || event.data.type !== "inner-page-changed") return;

    const file = event.data.page || DEFAULT;
    const url = new URL(window.location.href);
    url.searchParams.set("page", file);
    history.pushState(null, "", url);

    if (frame.getAttribute("src") !== BASE + file) {
      frame.setAttribute("src", BASE + file);
    }

    window.scrollTo(0, 0);
  });

  window.addEventListener("popstate", function () {
    setFrameSrc();
  });
})();
