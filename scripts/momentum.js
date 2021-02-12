var m = (window.m = window.m || {});
(m.globals = m.globals || {}),
  (m.utils = m.utils || {}),
  (m.settingsUtils = m.settingsUtils || {}),
  (m.globals.version = "2.1.21"),
  (m.globals.platform = "Chrome"),
  (m.globals.isProduction = !0),
  (m.globals.gaCode = "UA-44319322-10"),
  (m.globals.gaCodePlus = "UA-44319322-13"),
  (m.globals.urlRoot = "https://api.momentumdash.com/"),
  (m.globals.urlRootApi = "https://api.momentumdash.com/"),
  (m.globals.urlRootLogin = "https://login.momentumdash.com/"),
  (m.globals.urlRootAccount = "https://account.momentumdash.com/"),
  (m.globals.urlRootStats = "https://stats.momentumdash.com/"),
  (m.globals.urlRootIntegration = "https://integration.momentumdash.com/"),
  (m.globals.liveApi = !0),
  (m.utils.parseJwt = function (e) {
    try {
      var t = e.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
        n = decodeURIComponent(
          atob(t)
            .split("")
            .map(function (e) {
              return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
      return JSON.parse(n);
    } catch (e) {
      return null;
    }
  }),
  (m.utils.oneTimeLogin = function (t) {
    return new Promise(function (n, o) {
      try {
        var e = new Date().getTime();
        if (
          m.globals.oneTimeLoginStarted &&
          m.globals.oneTimeLoginStarted > e - 1e4
        )
          return void o("Another login is currently being processed.");
        (m.globals.oneTimeLoginStarted = e),
          (function (e, t, n, o) {
            var a = t,
              r = localStorage.getItem("pendingLoginState");
            if (r) {
              var i = JSON.parse(r);
              if (!i.state)
                return o("state passed in but no state in pendingLoginState");
              a.pendingState = i;
            }
            fetch(e, {
              method: "post",
              headers: { "Content-type": "application/json; charset=UTF-8" },
              body: JSON.stringify(a),
            })
              .then(s)
              .then(function (e) {
                n(e);
              })
              .catch(function (e) {
                o(e);
              });
          })(
            m.globals.urlRootApi + "user/authenticate",
            t,
            function (t) {
              if (!t || !t.token)
                return (m.globals.oneTimeLoginStarted = !1), void o();
              if (
                !(
                  (function () {
                    var e = localStorage.getItem("user_uuid");
                    if (e) return e;
                    var t = localStorage.getItem("token");
                    if (!t) return null;
                    var n = m.utils.parseJwt(t);
                    return n && (e = n.user_uuid || n.user_guid)
                      ? e.toLowerCase()
                      : null;
                  })() !== t.user_uuid
                )
              )
                return a(t), (m.globals.oneTimeLoginStarted = !1), void n();
              m.backupDB
                .newBackup(
                  localStorage.getItem("client_uuid") || new Date().getTime()
                )
                .then(function () {
                  var e = localStorage.getItem("api");
                  localStorage.clear(),
                    localStorage.clear(),
                    e && localStorage.setItem("api", e),
                    a(t),
                    (m.globals.oneTimeLoginStarted = !1),
                    n();
                });
            },
            function () {
              (m.globals.oneTimeLoginStarted = !1),
                o("error processing login info");
            }
          );
      } catch (e) {
        (m.globals.oneTimeLoginStarted = !1), o();
      }
    });
    function a(e) {
      localStorage.setItem("token", e.token),
        e.token_uuid && localStorage.setItem("token_uuid", e.token_uuid),
        e.user_uuid && localStorage.setItem("user_uuid", e.user_uuid),
        e.features && localStorage.setItem("f3t6b23d", e.features),
        localStorage.setItem("processNewLogin", !0);
    }
    function s(e) {
      return 200 == e.status ? e.json() : null;
    }
  }),
  (window.m.backupDB = (function () {
    var o,
      r,
      a = null,
      e = !1;
    function n() {
      if (!e) {
        e = !0;
        try {
          (window.indexedDB =
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB),
            (window.IDBTransaction =
              window.IDBTransaction ||
              window.webkitIDBTransaction ||
              window.msIDBTransaction),
            (window.IDBKeyRange =
              window.IDBKeyRange ||
              window.webkitIDBKeyRange ||
              window.msIDBKeyRange),
            (dbVersion = 1);
          var n = indexedDB.open("backup-db", 1);
          (n.onsuccess = function () {
            a = n.result;
          }),
            (n.onerror = function () {}),
            (n.onupgradeneeded = function (e) {
              var t = n.result;
              !(function (e, t) {
                try {
                  e.oncomplete = function () {
                    a = t;
                  };
                } catch (e) {}
              })(e.target.transaction, n.result),
                t
                  .createObjectStore("backup", { keyPath: "id" })
                  .createIndex("client", ["clientUuid"]);
            });
        } catch (e) {}
      }
    }
    function s() {
      return new Promise(function (t) {
        try {
          a
            ? t(a)
            : (n(),
              setTimeout(function () {
                s().then(function (e) {
                  t(e);
                });
              }, 10));
        } catch (e) {}
      });
    }
    function u(e, t, n) {
      var a = {};
      return (
        (a.clientUuid = n),
        (a.key = e),
        (a.value = t),
        (a.backupDate = r),
        (a.id = n + "-" + e + "-" + o),
        new Promise(function (n, o) {
          s().then(function (e) {
            try {
              var t = e.transaction(["backup"], "readwrite");
              (t.oncomplete = function (e) {
                n(e);
              }),
                (t.onerror = function (e) {
                  o(e);
                }),
                t.objectStore("backup").put(a);
            } catch (e) {
              o(e);
            }
          });
        })
      );
    }
    return {
      newBackup: function (i) {
        return (
          (r = new Date()),
          (o = r.getTime()),
          (r = r.toISOString()),
          new Promise(function (r, t) {
            try {
              s().then(function () {
                var e,
                  t,
                  n = Object.keys(localStorage),
                  o = n.length,
                  a = 0;
                for (0 <= n.indexOf("token") && o--, e = 0; e < n.length; e++)
                  "token" !== (t = n[e]) &&
                    u(t, localStorage.getItem(t), i).then(function () {
                      ++a === o && r();
                    });
              });
            } catch (e) {
              t();
            }
          })
        );
      },
    };
  })()),
  chrome &&
    chrome.runtime &&
    chrome.runtime.setUninstallURL &&
    chrome.runtime.setUninstallURL("https://momentumdash.com/uninstall"),
  chrome.runtime.onInstalled.addListener(function (e) {
    e &&
      e.reason &&
      "install" === e.reason &&
      chrome.tabs.create({ url: "dashboard.html" });
  }),
  chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: "dashboard.html" });
  }),
  chrome.runtime.onMessage.addListener(function (t, n, o) {
    if (n.tab && "oneTimeLogin" === t.type)
      return (
        m.utils
          .oneTimeLogin(t)
          .then(function () {
            if (t.openNewTab) chrome.tabs.create({ url: "dashboard.html" });
            else if (t.updateSenderTab) {
              var e = n.tab.id;
              chrome.tabs.update(e, { url: "dashboard.html" });
            }
            o({ success: !0 });
          })
          .catch(function (e) {
            o({ success: !1, errorMessage: e });
          }),
        !0
      );
    if ("momentum:authState" === t.type) {
      if (!t.data || !t.data.userId) return;
      var e = "login-state-" + t.data.src;
      t.data.loginState
        ? localStorage.setItem(e, t.data.userId)
        : localStorage.removeItem(e);
    } else if ("checkUserId" === t.type) {
      if (!t.payload || !t.payload.userUuid) return;
      var a = localStorage.getItem("userId");
      o(
        a
          ? { isSameAccount: t.payload.userUuid === a, isLoggedIn: !0 }
          : { isLoggedIn: !1 }
      );
    } else
      "momentum:openNew" === t.type &&
        chrome.tabs.create({ url: "dashboard.html" });
  });
