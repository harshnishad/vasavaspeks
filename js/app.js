(function () {
  var ICONS = {
    focus:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
    repeat:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
    leaf:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/></svg>'
  };
  var ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var SHARE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function asset(src) {
    if (!src) return "";
    if (/^https?:\/\//i.test(src) || src.indexOf("//") === 0 || src.indexOf("data:") === 0) return src;
    return src.replace(/^\.\//, "");
  }

  function postUrl(id) {
    return "post.html?id=" + encodeURIComponent(id);
  }

  function formatDate(iso, long) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: long ? "long" : "short",
      year: "numeric"
    });
  }

  function sortedPosts(data) {
    return (data.posts || []).slice().sort(function (a, b) {
      if (a.date === b.date) return 0;
      return a.date < b.date ? 1 : -1;
    });
  }

  function featuredPost(posts) {
    return posts.find(function (p) { return p.featured; }) || posts[1] || posts[0];
  }

  function headerHtml(data, page) {
    var s = data.site;
    function nav(href, key, label) {
      var current = page === key ? ' aria-current="page"' : "";
      return '<a href="' + href + '"' + current + ">" + label + "</a>";
    }
    return (
      '<a class="skip" href="#content">Skip to content</a>' +
      (page === "post" ? '<div class="progress" aria-hidden="true"></div>' : "") +
      '<header class="site-header"><div class="container header-inner">' +
      '<a class="brand" href="index.html"><span class="brand-mark">V</span><span>' +
      s.nameHtml +
      "</span></a>" +
      '<nav class="nav" aria-label="Primary">' +
      nav("index.html", "home", "Home") +
      nav("writing.html", "writing", "Writing") +
      nav("about.html", "about", "About") +
      "</nav>" +
      '<button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode">' +
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
      "</button></div></header>"
    );
  }

  function footerHtml(data) {
    var s = data.site;
    var posts = sortedPosts(data).slice(0, 4);
    var recent = posts
      .map(function (p) {
        return "<li><a href=\"" + postUrl(p.id) + "\">" + esc(p.title) + "</a></li>";
      })
      .join("");
    return (
      '<footer class="site-footer"><div class="container"><div class="footer-top"><div>' +
      '<a class="brand" href="index.html"><span class="brand-mark">V</span><span>' +
      s.nameHtml +
      "</span></a>" +
      "<p>" +
      esc(s.tagline) +
      " Writing on clarity, habits, and mindful living.</p></div>" +
      '<div class="footer-links"><div><h4>Explore</h4><ul>' +
      '<li><a href="index.html">Home</a></li>' +
      '<li><a href="writing.html">Writing</a></li>' +
      '<li><a href="about.html">About</a></li>' +
      "</ul></div><div><h4>Recent</h4><ul>" +
      recent +
      "</ul></div></div></div>" +
      '<div class="footer-bottom"><span>© ' +
      esc(s.year) +
      " " +
      esc(s.name) +
      "</span><span>" +
      esc(s.footerNote) +
      "</span></div></div></footer>"
    );
  }

  function cardHtml(post, extraClass) {
    return (
      '<a class="card ' +
      (extraClass || "") +
      '" href="' +
      postUrl(post.id) +
      '" data-category="' +
      esc(post.category) +
      '">' +
      '<div class="card-media"><img src="' +
      esc(asset(post.photo)) +
      '" alt="' +
      esc(post.photoAlt) +
      '" width="1024" height="768" loading="lazy"></div>' +
      '<div class="card-body"><div class="card-meta"><span class="tag">' +
      esc(post.categoryLabel) +
      "</span><time datetime=\"" +
      esc(post.date) +
      '">' +
      esc(formatDate(post.date)) +
      "</time></div><h3>" +
      esc(post.title) +
      "</h3><p>" +
      esc(post.excerpt) +
      '</p><span class="card-foot">' +
      esc(post.readTime) +
      ' <span class="arrow" aria-hidden="true">→</span></span></div></a>'
    );
  }

  function themesHtml(data) {
    return (
      '<ul class="themes">' +
      data.themes
        .map(function (t) {
          return (
            '<li class="reveal"><a class="theme" href="' +
            postUrl(t.postId) +
            '"><span class="theme-icon">' +
            (ICONS[t.icon] || ICONS.focus) +
            "</span><h3>" +
            esc(t.title) +
            "</h3><p>" +
            esc(t.text) +
            "</p></a></li>"
          );
        })
        .join("") +
      "</ul>"
    );
  }

  function renderHome(data) {
    var posts = sortedPosts(data);
    var featured = featuredPost(posts);
    var latest = posts[0];
    var grid = posts.filter(function (p) { return p.id !== featured.id; }).slice(0, 3);
    var hero = data.images.hero;
    var aboutImg = data.images.about;
    return (
      '<main id="content">' +
      '<section class="container hero"><div><p class="eyebrow">' +
      esc(data.home.eyebrow) +
      "</p><h1>" +
      data.home.titleHtml +
      '</h1><p class="lede">' +
      esc(data.home.lede) +
      '</p><div class="actions">' +
      '<a class="btn btn-primary" href="writing.html">Start reading ' +
      ARROW +
      '</a><a class="btn btn-ghost" href="about.html">About me</a></div></div>' +
      '<div class="hero-media"><img src="' +
      esc(asset(hero.src)) +
      '" alt="' +
      esc(hero.alt) +
      '" width="1024" height="576">' +
      (latest
        ? '<a class="float-card" href="' +
          postUrl(latest.id) +
          '"><img src="' +
          esc(asset(latest.photo)) +
          '" alt="" width="1024" height="768"><span><small>Latest post</small><strong>' +
          esc(latest.title) +
          "</strong></span></a>"
        : "") +
      "</div></section>" +
      (featured
        ? '<section class="container section flush" aria-labelledby="featured-heading"><div class="section-head"><div><p class="eyebrow">Featured</p><h2 id="featured-heading">From the journal</h2></div></div>' +
          '<a class="featured reveal" href="' +
          postUrl(featured.id) +
          '"><div class="featured-media"><img src="' +
          esc(asset(featured.photo)) +
          '" alt="' +
          esc(featured.photoAlt) +
          '" width="1024" height="768" loading="lazy"></div><div class="featured-body"><div class="card-meta"><span class="tag">' +
          esc(featured.categoryLabel) +
          '</span><time datetime="' +
          esc(featured.date) +
          '">' +
          esc(formatDate(featured.date)) +
          '</time><span class="dot"></span><span>' +
          esc(featured.readTime) +
          "</span></div><h3>" +
          esc(featured.title) +
          "</h3><p>" +
          esc(featured.excerpt) +
          '</p><span class="link-arrow">Continue reading</span></div></a></section>'
        : "") +
      '<section class="container section flush" aria-labelledby="recent-heading"><div class="section-head"><div><p class="eyebrow">Recent posts</p><h2 id="recent-heading">Read, reflect, grow</h2><p>Read about clarity, habits, and mindful living.</p></div><a class="link-arrow" href="writing.html">All posts</a></div>' +
      '<div class="grid">' +
      grid.map(function (p) { return cardHtml(p, "reveal"); }).join("") +
      "</div></section>" +
      '<section class="container section flush" aria-labelledby="find-heading"><div class="section-head"><div><p class="eyebrow">What you’ll find here</p><h2 id="find-heading">Three quiet themes</h2></div></div>' +
      themesHtml(data) +
      "</section>" +
      '<section class="container section flush" aria-labelledby="about-heading"><div class="about-band reveal"><img src="' +
      esc(asset(aboutImg.src)) +
      '" alt="' +
      esc(aboutImg.alt) +
      '" width="1024" height="1024" loading="lazy"><div class="about-text"><p class="eyebrow">About me</p><h2 id="about-heading">' +
      data.about.headingHtml +
      "</h2><p>" +
      esc(data.about.lede) +
      "</p><p>" +
      esc(data.about.paragraphs[0] || "") +
      '</p><div class="actions"><a class="btn btn-primary" href="about.html">More about me</a></div></div></div></section>' +
      '<section class="container" aria-label="Share"><div class="cta reveal"><blockquote>' +
      esc(data.home.cta) +
      '</blockquote><div class="actions"><button class="btn btn-primary" type="button" data-share data-share-status="#share-status">' +
      SHARE +
      " Share " +
      esc(data.site.name) +
      '</button><a class="btn btn-ghost" href="writing.html">Browse all posts</a></div><p class="share-status" id="share-status" role="status"></p></div></section></main>'
    );
  }

  function renderWriting(data) {
    var posts = sortedPosts(data);
    var cats = [];
    posts.forEach(function (p) {
      if (!cats.some(function (c) { return c.id === p.category; })) {
        cats.push({ id: p.category, label: p.categoryLabel });
      }
    });
    return (
      '<main id="content" class="container"><header class="page-hero"><p class="eyebrow">Writing</p><h1>All posts</h1><p class="lede">Read about clarity, habits, and mindful living. Take your time — read, reflect, and share a page with someone who may need clarity.</p></header>' +
      '<div class="filters" role="group" aria-label="Filter posts by topic">' +
      '<button class="chip" type="button" data-filter="all" aria-pressed="true">All</button>' +
      cats
        .map(function (c) {
          return (
            '<button class="chip" type="button" data-filter="' +
            esc(c.id) +
            '" aria-pressed="false">' +
            esc(c.label) +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="grid">' +
      posts.map(function (p) { return cardHtml(p, "reveal"); }).join("") +
      "</div></main>"
    );
  }

  function renderAbout(data) {
    var img = data.images.about;
    var paras = (data.about.paragraphs || [])
      .map(function (p) { return "<p>" + esc(p) + "</p>"; })
      .join("");
    return (
      '<main id="content"><section class="container about-hero"><div class="about-copy"><p class="eyebrow">About me</p><h1>' +
      esc(data.about.heading) +
      '</h1><p class="lede">' +
      esc(data.about.lede) +
      "</p>" +
      paras +
      '<p class="signature">' +
      esc(data.about.signature) +
      '</p></div><img src="' +
      esc(asset(img.src)) +
      '" alt="' +
      esc(img.alt) +
      '" width="1024" height="1024"></section>' +
      '<section class="container section flush" aria-labelledby="find-heading"><div class="section-head"><div><p class="eyebrow">What you’ll find here</p><h2 id="find-heading">Three quiet themes</h2></div></div>' +
      themesHtml(data) +
      '</section><section class="container" aria-label="Share"><div class="cta reveal"><blockquote>' +
      esc(data.home.cta) +
      '</blockquote><div class="actions"><a class="btn btn-primary" href="writing.html">Browse all posts ' +
      ARROW +
      "</a></div></div></section></main>"
    );
  }

  function renderBody(blocks) {
    return (blocks || [])
      .map(function (b) {
        if (b.type === "h2") return "<h2>" + esc(b.text) + "</h2>";
        if (b.type === "quote") {
          return (
            "<blockquote>" +
            (b.lines || [b.text])
              .map(function (line) { return "<p>" + esc(line) + "</p>"; })
              .join("") +
            "</blockquote>"
          );
        }
        if (b.type === "ul") {
          return (
            "<ul>" +
            (b.items || []).map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("") +
            "</ul>"
          );
        }
        return "<p>" + esc(b.text) + "</p>";
      })
      .join("");
  }

  function renderPost(data) {
    var id = new URLSearchParams(location.search).get("id");
    var posts = sortedPosts(data);
    var post = posts.find(function (p) { return p.id === id; }) || posts[0];
    if (!post) {
      return '<main id="content" class="container"><p class="lede">No posts yet. Add one in data/site.json.</p></main>';
    }
    var index = posts.findIndex(function (p) { return p.id === post.id; });
    var newer = index > 0 ? posts[index - 1] : null;
    var older = index < posts.length - 1 ? posts[index + 1] : null;
    var more = posts.filter(function (p) { return p.id !== post.id; }).slice(0, 2);
    document.title = post.title + " · " + data.site.name;
    setMeta("description", post.excerpt);
    setMeta("og:title", post.title, true);
    setMeta("og:description", post.excerpt, true);
    setMeta("og:image", asset(post.photo), true);

    var pager = '<nav class="pager" aria-label="Post navigation">';
    if (newer) {
      pager +=
        '<a href="' +
        postUrl(newer.id) +
        '" rel="prev"><span>← Newer</span><strong>' +
        esc(newer.title) +
        "</strong></a>";
    }
    if (older) {
      pager +=
        '<a class="next" href="' +
        postUrl(older.id) +
        '" rel="next"><span>Older →</span><strong>' +
        esc(older.title) +
        "</strong></a>";
    }
    pager += "</nav>";

    return (
      '<main id="content"><article><header class="container post-hero"><a class="back-link" href="writing.html">← All posts</a><div><span class="eyebrow">' +
      esc(post.categoryLabel) +
      "</span></div><h1>" +
      esc(post.title) +
      '</h1><div class="card-meta"><span>By ' +
      esc(data.site.author) +
      '</span><span class="dot"></span><time datetime="' +
      esc(post.date) +
      '">' +
      esc(formatDate(post.date, true)) +
      '</time><span class="dot"></span><span>' +
      esc(post.readTime) +
      "</span></div></header>" +
      '<figure class="post-cover"><img src="' +
      esc(asset(post.photo)) +
      '" alt="' +
      esc(post.photoAlt) +
      '" width="1024" height="768"></figure>' +
      '<div class="prose">' +
      renderBody(post.body) +
      "</div>" +
      '<div class="post-share"><p>Found this useful? Share it with someone who may need clarity.</p>' +
      '<button class="btn btn-ghost" type="button" data-share data-share-status="#share-status">' +
      SHARE +
      ' Share</button><p class="share-status" id="share-status" role="status"></p></div>' +
      pager +
      "</article>" +
      (more.length
        ? '<section class="more" aria-labelledby="more-heading"><div class="container"><div class="section-head"><h2 id="more-heading">Keep reading</h2><a class="link-arrow" href="writing.html">All posts</a></div><div class="grid">' +
          more.map(function (p) { return cardHtml(p); }).join("") +
          "</div></div></section>"
        : "") +
      "</main>"
    );
  }

  function setMeta(name, content, property) {
    if (!content) return;
    var sel = property ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
    var el = document.querySelector(sel);
    if (!el) {
      el = document.createElement("meta");
      if (property) el.setAttribute("property", name);
      else el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function bindUi() {
    var root = document.documentElement;
    var toggle = document.querySelector("[data-theme-toggle]");
    function syncToggleLabel() {
      if (!toggle) return;
      toggle.setAttribute(
        "aria-label",
        root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
    syncToggleLabel();
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch (e) {}
        syncToggleLabel();
      });
    }

    var header = document.querySelector(".site-header");
    var progress = document.querySelector(".progress");
    function onScroll() {
      var y = window.scrollY;
      if (header) header.classList.toggle("is-scrolled", y > 8);
      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }

    var chips = document.querySelectorAll("[data-filter]");
    var filterable = document.querySelectorAll("[data-category]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var value = chip.getAttribute("data-filter");
        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === chip));
        });
        filterable.forEach(function (card) {
          card.hidden = value !== "all" && card.getAttribute("data-category") !== value;
          if (!card.hidden) card.classList.add("is-visible");
        });
      });
    });

    document.querySelectorAll("[data-share]").forEach(function (button) {
      var status = document.querySelector(button.getAttribute("data-share-status"));
      button.addEventListener("click", function () {
        var shareData = { title: document.title, url: window.location.href };
        if (navigator.share) {
          navigator.share(shareData).catch(function () {});
          return;
        }
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareData.url).then(
            function () {
              if (status) status.textContent = "Link copied. Thank you for sharing.";
            },
            function () {
              if (status) status.textContent = shareData.url;
            }
          );
        } else if (status) {
          status.textContent = shareData.url;
        }
      });
    });
  }

  function jsonUrl() {
    var script = document.querySelector('script[src*="app.js"]');
    return new URL("../data/site.json", script.src).href;
  }

  function fail(message) {
    document.body.innerHTML =
      '<main class="container" style="padding:4rem 0"><h1>Could not load the blog</h1><p class="lede">' +
      esc(message) +
      "</p><p>Open the site through a local server (not by double-clicking the HTML file), then edit <code>data/site.json</code> and refresh.</p></main>";
  }

  var page = document.body.getAttribute("data-page") || "home";

  fetch(jsonUrl())
    .then(function (res) {
      if (!res.ok) throw new Error("Could not read data/site.json");
      return res.json();
    })
    .then(function (data) {
      if (page === "home") {
        document.title = data.site.name + " — " + data.site.tagline;
        setMeta("description", data.home.lede);
        setMeta("og:image", asset(data.images.hero.src), true);
      } else if (page === "about") {
        document.title = "About · " + data.site.name;
        setMeta("description", data.about.lede);
        setMeta("og:image", asset(data.images.about.src), true);
      } else if (page === "writing") {
        document.title = "Writing · " + data.site.name;
      }

      var mainHtml =
        page === "writing"
          ? renderWriting(data)
          : page === "about"
            ? renderAbout(data)
            : page === "post"
              ? renderPost(data)
              : renderHome(data);

      document.body.innerHTML = headerHtml(data, page === "post" ? "writing" : page) + mainHtml + footerHtml(data);
      bindUi();
    })
    .catch(function (err) {
      fail(err.message || String(err));
    });
})();
