(function () {
  // Safely compute full document height (TeX4ht pages can be tricky)
  function getDocHeight() {
    const b = document.body;
    const e = document.documentElement;
    return Math.max(
      b.scrollHeight, e.scrollHeight,
      b.offsetHeight, e.offsetHeight,
      b.clientHeight, e.clientHeight
    );
  }

  function postHeight() {
    parent.postMessage(
      {
        type: "IFRAME_HEIGHT",
        height: getDocHeight(),
        href: location.href
      },
      "*"
    );
  }

  // 1) Initial sends
  window.addEventListener("load", postHeight);
  window.addEventListener("resize", postHeight);

  // 2) Keep sending while fonts/CSS settle (common with TeX4ht)
  let n = 0;
  const interval = setInterval(() => {
    postHeight();
    if (++n > 30) clearInterval(interval); // ~15 seconds
  }, 500);

  // 3) Auto-send whenever page layout changes (best fix for "cutting")
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => postHeight());
    ro.observe(document.documentElement);
    if (document.body) ro.observe(document.body);
  }

  // 4) Parent can explicitly ask for height (great for accordions)
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "REQUEST_IFRAME_HEIGHT") {
      postHeight();
    }
  });
})();
