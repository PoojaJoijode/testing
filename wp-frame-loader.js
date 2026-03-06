(function () {
  const BASE = "https://poojajoijode.github.io/testing/";
  const DEFAULT = "webli1.html";
  const frame = document.getElementById("pubFrame");
  let suppressSync = false;

  if (!frame) return;

  const currentFile = () =>
    new URLSearchParams(window.location.search).get("page") || DEFAULT;

  const frameSrc = (file) => BASE + file;

  const scrollTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const updateUrl = (file, mode) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", file);
    history[mode === "push" ? "pushState" : "replaceState"](null, "", url);
  };

  const loadFromUrl = () => {
    const file = currentFile();
    const src = frameSrc(file);

    suppressSync = true;
    if (frame.getAttribute("src") !== src) frame.setAttribute("src", src);
    scrollTop();

    setTimeout(() => {
      suppressSync = false;
    }, 300);
  };

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
      if (!suppressSync && currentFile() !== file) updateUrl(file, "replace");
      scrollTop();
      return;
    }

    if (event.data.type === "navigate-page") {
      if (currentFile() !== file) updateUrl(file, "push");

      const src = frameSrc(file);
      if (frame.getAttribute("src") !== src) frame.setAttribute("src", src);

      scrollTop();
    }
  });
})();
