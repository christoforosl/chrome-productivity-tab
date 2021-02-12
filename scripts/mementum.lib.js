try {
    var usageWorker = new SharedWorker("/usage/worker.js");
    usageWorker.port.start(), navigator && navigator.serviceWorker && navigator.serviceWorker.register("image-cache-worker.js", {
        scope: "./"
    }).then(navigator.serviceWorker.ready).then(function(t) {
        var i = !1;

        function e() {
            if (t.active && !i) {
                i = !0;
                var e = new SharedWorker("/usage/worker.js");
                e.port.start(), t.active.postMessage({
                    usageWorkerPort: e.port
                }, [e.port])
            }
        }
        t.active ? e() : t.installing.addEventListener("statechange", e)
    }).catch(console.error)
} catch (e) {
    console.error(e)
}
window.m = _.extend({
    $window: $(window),
    appView: "",
    globals: {},
    models: {},
    collect: {},
    views: {},
    addins: {},
    utils: {},
    settingsUtils: {},
    bootstrappers: {},
    commands: {},
    templates: {},
    widgets: [],
    appsReady: !1,
    appsLoaded: !1,
    console: {
        log: function(e) {
            m.log += e + "\n"
        }
    },
    log: "",
    usageWorker: usageWorker,
    date: function() {
        return new Date
    },
    now: function() {
        return m.date().getTime()
    },
    startTime: 0,
    elapsed: function() {
        return m.now() - m.startTime
    },
    isLoggedIn: function() {
        return localStorage.getItem("token") && !localStorage.getItem("unregistered")
    }
}, Backbone.Events), m.firstLoadEver = !localStorage.getItem("client_uuid"), m.startTime = m.now(), Backbone.View = function(t) {
    return t.extend({
        constructor: function(e) {
            this.options = e || {}, t.apply(this, arguments)
        }
    })
}(Backbone.View);
var backboneSync = Backbone.sync;
Backbone.sync = function(e, t, i) {
    (i = i || {}).beforeSend = function(e) {
        m.utils.setMomentumAuthHeader(e), e.overrideMimeType("application/json")
    }, backboneSync(e, t, i)
}, Backbone.$ = $, Backbone.ajax = $.ajax, Backbone.Model.extend = Backbone.Collection.extend = function(e, t) {
    var i, n = this;
    i = e && _.has(e, "constructor") ? e.constructor : function() {
        return n.apply(this, arguments)
    }, _.extend(i, n, t);

    function a() {
        this.constructor = i
    }
    return a.prototype = n.prototype, i.prototype = new a, e && _.extend(i.prototype, e), Object.defineProperty(i, "__super__", {
        enumerable: !1,
        value: n.prototype
    }), i
}, m.templates = m.templates || {}, m.templates.metric = m.templates.metric || {}, m.templates.metric.widget = Handlebars.template({
    compiler: [6, ">= 2.0.0-beta.1"],
    main: function(e, t, i, n) {
        var a, o = t.helperMissing,
            s = "function",
            r = this.escapeExpression;
        return '<div><span class="metric-stat">' + r(typeof(a = null != (a = t.statvalue || (null != e ? e.statvalue : e)) ? a : o) == s ? a.call(e, {
            name: "statvalue",
            hash: {},
            data: n
        }) : a) + '</span></div><span class="metric-label">' + r(typeof(a = null != (a = t.statlabel || (null != e ? e.statlabel : e)) ? a : o) == s ? a.call(e, {
            name: "statlabel",
            hash: {},
            data: n
        }) : a) + "</span>"
    },
    useData: !0
}), m.templates = m.templates || {}, m.templates.notification = m.templates.notification || {}, m.templates.notification.notification = Handlebars.template({
    1: function(e, t, i, n) {
        return "has-big-icon"
    },
    3: function(e, t, i, n) {
        var a, o;
        return '<div class="notification-title">' + (null != (a = t.if.call(e, null != e ? e.icon_url : e, {
            name: "if",
            hash: {},
            fn: this.program(4, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : "") + this.escapeExpression("function" == typeof(o = null != (o = t.title || (null != e ? e.title : e)) ? o : t.helperMissing) ? o.call(e, {
            name: "title",
            hash: {},
            data: n
        }) : o) + "</div>"
    },
    4: function(e, t, i, n) {
        var a;
        return '<img class="notification-icon" src="' + this.escapeExpression("function" == typeof(a = null != (a = t.icon_url || (null != e ? e.icon_url : e)) ? a : t.helperMissing) ? a.call(e, {
            name: "icon_url",
            hash: {},
            data: n
        }) : a) + '">'
    },
    6: function(e, t, i, n) {
        var a;
        return '\t\t\t\t<button class="button notification-button">' + this.escapeExpression("function" == typeof(a = null != (a = t.cta_text || (null != e ? e.cta_text : e)) ? a : t.helperMissing) ? a.call(e, {
            name: "cta_text",
            hash: {},
            data: n
        }) : a) + "</button>"
    },
    8: function(e, t, i, n) {
        var a;
        return '<span class="button-text secondary-text">' + this.escapeExpression("function" == typeof(a = null != (a = t.secondary_text || (null != e ? e.secondary_text : e)) ? a : t.helperMissing) ? a.call(e, {
            name: "secondary_text",
            hash: {},
            data: n
        }) : a) + "</span>\n"
    },
    compiler: [6, ">= 2.0.0-beta.1"],
    main: function(e, t, i, n) {
        var a, o, s = t.helperMissing,
            r = "function",
            l = this.escapeExpression;
        return '<div class="app-wrapper nipple ' + l(typeof(o = null != (o = t.nippleClass || (null != e ? e.nippleClass : e)) ? o : s) == r ? o.call(e, {
            name: "nippleClass",
            hash: {},
            data: n
        }) : o) + '">\n\t<div class="app notification-app ' + l(typeof(o = null != (o = t.announcementClass || (null != e ? e.announcementClass : e)) ? o : s) == r ? o.call(e, {
            name: "announcementClass",
            hash: {},
            data: n
        }) : o) + " " + (null != (a = t.if.call(e, null != e ? e.has_icon : e, {
            name: "if",
            hash: {},
            fn: this.program(1, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : "") + '" data-test="notification">\n\t\t<div class="notification-content">\n\t\t\t<div class="icon-wrapper notification-hide">' + (null != (a = typeof(o = null != (o = t.iconCancel || (null != e ? e.iconCancel : e)) ? o : s) == r ? o.call(e, {
            name: "iconCancel",
            hash: {},
            data: n
        }) : o) ? a : "") + "</div>\n\t\t\t" + (null != (a = t.if.call(e, null != e ? e.title : e, {
            name: "if",
            hash: {},
            fn: this.program(3, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : "") + '\n\t\t\t<div class="notification-description">' + l(typeof(o = null != (o = t.message || (null != e ? e.message : e)) ? o : s) == r ? o.call(e, {
            name: "message",
            hash: {},
            data: n
        }) : o) + "</div>\n" + (null != (a = t.if.call(e, null != e ? e.cta_cmd : e, {
            name: "if",
            hash: {},
            fn: this.program(6, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : "") + (null != (a = t.if.call(e, null != e ? e.secondary_cmd : e, {
            name: "if",
            hash: {},
            fn: this.program(8, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : "") + '\t\t</div>\n\n\t\t<div class="notification-icon-wrapper">\n\t\t\t<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 74"><path d="M45.275 72a10.712 10.712 0 0 1-4.5-1.491A9.712 9.712 0 0 0 37 69.187a9.708 9.708 0 0 0-3.774 1.323c-1.825.909-3.711 1.848-5.566 1.354-1.931-.517-3.118-2.317-4.266-4.059a9.441 9.441 0 0 0-2.488-2.925 9.566 9.566 0 0 0-3.842-.719c-2.061-.127-4.192-.258-5.579-1.645S9.966 59 9.839 56.938A9.557 9.557 0 0 0 9.12 53.1a9.446 9.446 0 0 0-2.925-2.489c-1.741-1.148-3.542-2.335-4.059-4.266-.5-1.853.445-3.74 1.354-5.565A9.712 9.712 0 0 0 4.813 37a9.708 9.708 0 0 0-1.323-3.774c-.909-1.826-1.85-3.713-1.354-5.566.517-1.931 2.317-3.118 4.059-4.266a9.441 9.441 0 0 0 2.925-2.489 9.566 9.566 0 0 0 .719-3.842c.127-2.061.258-4.192 1.645-5.579S15 9.966 17.062 9.839A9.557 9.557 0 0 0 20.9 9.12a9.446 9.446 0 0 0 2.489-2.925c1.148-1.741 2.335-3.542 4.266-4.059 1.851-.493 3.74.445 5.565 1.354A9.712 9.712 0 0 0 37 4.813a9.708 9.708 0 0 0 3.774-1.323c1.826-.909 3.712-1.847 5.566-1.354 1.931.517 3.118 2.317 4.266 4.059a9.441 9.441 0 0 0 2.489 2.925 9.566 9.566 0 0 0 3.842.719c2.061.127 4.192.258 5.579 1.645s1.518 3.516 1.645 5.578a9.557 9.557 0 0 0 .719 3.838 9.446 9.446 0 0 0 2.925 2.489c1.741 1.148 3.542 2.335 4.059 4.266.5 1.853-.445 3.74-1.354 5.565A9.712 9.712 0 0 0 69.187 37a9.708 9.708 0 0 0 1.323 3.774c.909 1.826 1.85 3.713 1.354 5.566-.517 1.931-2.317 3.118-4.059 4.266a9.441 9.441 0 0 0-2.925 2.488 9.566 9.566 0 0 0-.719 3.842c-.127 2.061-.258 4.192-1.645 5.579S59 64.034 56.938 64.161a9.557 9.557 0 0 0-3.842.719 9.446 9.446 0 0 0-2.489 2.925c-1.148 1.741-2.335 3.542-4.266 4.059a4.121 4.121 0 0 1-1.066.136zM28.729 4a2.113 2.113 0 0 0-.552.069c-1.2.319-2.171 1.8-3.113 3.227a10.7 10.7 0 0 1-3.157 3.556 10.834 10.834 0 0 1-4.721.984c-1.768.109-3.437.212-4.288 1.063s-.954 2.521-1.063 4.288a10.832 10.832 0 0 1-.983 4.721A10.692 10.692 0 0 1 7.3 25.063c-1.43.942-2.908 1.917-3.227 3.113-.3 1.122.435 2.6 1.212 4.157A11 11 0 0 1 6.813 37a11 11 0 0 1-1.533 4.667c-.78 1.561-1.511 3.033-1.212 4.157.319 1.2 1.8 2.171 3.227 3.113a10.7 10.7 0 0 1 3.556 3.157 10.834 10.834 0 0 1 .984 4.721c.109 1.768.212 3.437 1.063 4.288s2.521.954 4.288 1.063a10.832 10.832 0 0 1 4.721.983 10.692 10.692 0 0 1 3.156 3.551c.942 1.43 1.917 2.908 3.113 3.227 1.124.3 2.6-.435 4.157-1.212A11 11 0 0 1 37 67.187a11 11 0 0 1 4.667 1.533c1.562.778 3.037 1.515 4.157 1.212 1.2-.319 2.171-1.8 3.113-3.227a10.7 10.7 0 0 1 3.157-3.556 10.834 10.834 0 0 1 4.721-.984c1.768-.109 3.437-.212 4.288-1.063s.954-2.521 1.063-4.288a10.832 10.832 0 0 1 .983-4.721 10.692 10.692 0 0 1 3.551-3.156c1.43-.942 2.908-1.917 3.227-3.113.3-1.122-.435-2.6-1.212-4.157A11 11 0 0 1 67.187 37a11 11 0 0 1 1.533-4.667c.777-1.562 1.512-3.036 1.212-4.157-.319-1.2-1.8-2.171-3.227-3.113a10.7 10.7 0 0 1-3.556-3.157 10.834 10.834 0 0 1-.984-4.721c-.109-1.768-.212-3.437-1.063-4.288s-2.521-.954-4.288-1.063a10.832 10.832 0 0 1-4.721-.983A10.692 10.692 0 0 1 48.937 7.3c-.942-1.43-1.917-2.908-3.113-3.227-1.121-.3-2.6.435-4.157 1.212A11 11 0 0 1 37 6.813a11 11 0 0 1-4.667-1.533A9.341 9.341 0 0 0 28.729 4z"/><path d="M37 61a24 24 0 1 1 24-24 24.027 24.027 0 0 1-24 24zm0-46a22 22 0 1 0 22 22 22.025 22.025 0 0 0-22-22z"/><path d="M27.334 48.14a1 1 0 0 1-.708-1.707L46.35 26.7a1 1 0 1 1 1.415 1.414L28.042 47.847a1 1 0 0 1-.708.293zM43.417 48.076a4.64 4.64 0 1 1 4.64-4.64 4.645 4.645 0 0 1-4.64 4.64zm0-7.28a2.64 2.64 0 1 0 2.64 2.64 2.643 2.643 0 0 0-2.64-2.636zM30.583 35.14a4.64 4.64 0 1 1 4.64-4.64 4.645 4.645 0 0 1-4.64 4.64zm0-7.28a2.64 2.64 0 1 0 2.64 2.64 2.643 2.643 0 0 0-2.64-2.64z"/></svg>\n\t\t</div>\n\t</div>\n</div>\n'
    },
    useData: !0
}), m.templates = m.templates || {}, m.templates.teamlogo = m.templates.teamlogo || {}, m.templates.teamlogo.teamlogo = Handlebars.template({
    1: function(e, t, i, n) {
        return "is-admin"
    },
    3: function(e, t, i, n) {
        var a;
        return null != (a = t.unless.call(e, null != e ? e.logo : e, {
            name: "unless",
            hash: {},
            fn: this.program(4, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : ""
    },
    4: function(e, t, i, n) {
        return "hide-logo"
    },
    6: function(e, t, i, n) {
        var a, o;
        return '\t\t<img class="logo' + (null != (a = t.if.call(e, null != e ? e.isSVG : e, {
            name: "if",
            hash: {},
            fn: this.program(7, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : "") + '" src="' + this.escapeExpression("function" == typeof(o = null != (o = t.logo || (null != e ? e.logo : e)) ? o : t.helperMissing) ? o.call(e, {
            name: "logo",
            hash: {},
            data: n
        }) : o) + '">\n' + (null != (a = t.if.call(e, null != e ? e.isAdmin : e, {
            name: "if",
            hash: {},
            fn: this.program(9, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : "")
    },
    7: function(e, t, i, n) {
        return " svg"
    },
    9: function(e, t, i, n) {
        return '\t\t\t<span class="team-logo-icon-wrapper">\n\t\t\t\t<i class="icon icon-angle-down"></i>\n\t\t\t</span>\n'
    },
    11: function(e, t, i, n) {
        var a;
        return null != (a = t.if.call(e, null != e ? e.isAdmin : e, {
            name: "if",
            hash: {},
            fn: this.program(12, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : ""
    },
    12: function(e, t, i, n) {
        return "\t\t\tTeam\n"
    },
    14: function(e, t, i, n) {
        return '\t<div class="app-wrapper nipple nipple-top-left">\n\t\t<div class="app team-app">\n\t\t\t<ul class="dropdown-list">\n\t\t\t\t\x3c!--\n\t\t\t\t<li class="settings settings-meta-add">\n\t\t\t\t\t<span class="dropdown-list-icon-wrapper">\n\t\t\t\t\t\t<svg class="icon dropdown-list-icon icon-add" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g fill-rule="nonzero"><path d="M6.75 2a1.25 1.25 0 0 1 2.5 0v12a1.25 1.25 0 0 1-2.5 0V2z"/><path d="M2 9.25a1.25 1.25 0 0 1 0-2.5h12a1.25 1.25 0 0 1 0 2.5H2z"/></g></svg>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class="dropdown-list-label">Add Content</span>\n\t\t\t\t</li>\n\t\t\t\t--\x3e\n\t\t\t\t<li class="settings settings-members">\n\t\t\t\t\t<span class="dropdown-list-icon-wrapper">\n\t\t\t\t\t\t<svg class="icon dropdown-list-icon icon-add-members" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 22"><g fill-rule="nonzero"><path d="M16.5 12v8.25c0 1.333-2 1.333-2 0V12c0-1.333 2-1.333 2 0z"/><path d="M11.25 15.25h8.25c1.333 0 1.333 2 0 2h-8.25c-1.333 0-1.333-2 0-2zM2.75 18.25a1 1 0 0 1-2 0 7.752 7.752 0 0 1 10.792-7.128 1 1 0 1 1-.784 1.84A5.752 5.752 0 0 0 2.75 18.25z"/><path d="M8.5 2.75A3.125 3.125 0 1 0 8.5 9a3.125 3.125 0 0 0 0-6.25zm0-2A5.125 5.125 0 1 1 8.5 11 5.125 5.125 0 0 1 8.5.75z"/></g></svg>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class="dropdown-list-label">Invite Team Members</span>\n\t\t\t\t</li>\n\t\t\t\t<li class="settings settings-general">\n\t\t\t\t\t<span class="dropdown-list-icon-wrapper">\n\t\t\t\t\t\t<svg class="icon dropdown-list-icon icon-settings"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill-rule="nonzero"><path d="M12.083 3.591a1.2 1.2 0 0 0-2.084.862l.083 1.74a3.697 3.697 0 0 1-3.884 3.895l-1.747-.09a1.198 1.198 0 0 0-.861 2.083l1.297 1.179a3.7 3.7 0 0 1 .002 5.493l-1.3 1.174a1.197 1.197 0 0 0 .868 2.083l1.757-.089a3.697 3.697 0 0 1 3.874 3.883l-.09 1.742a1.198 1.198 0 0 0 2.083.864l1.178-1.296a3.699 3.699 0 0 1 5.492-.003l1.17 1.295c.24.262.584.404.939.388a1.197 1.197 0 0 0 1.144-1.243l-.089-1.758a3.697 3.697 0 0 1 3.882-3.874l1.75.089a1.198 1.198 0 0 0 .866-2.086l-1.302-1.174a3.7 3.7 0 0 1-.001-5.494l1.302-1.174a1.199 1.199 0 0 0-.861-2.087l-1.756.09a3.698 3.698 0 0 1-3.87-3.88l.09-1.75a1.198 1.198 0 0 0-2.091-.861l-1.177 1.292a3.696 3.696 0 0 1-5.492.001l-1.172-1.294zm3.026-.383a1.197 1.197 0 0 0 1.785-.002l1.178-1.294a3.698 3.698 0 0 1 6.439 2.668l-.089 1.749a1.197 1.197 0 0 0 1.252 1.256l1.752-.089a3.699 3.699 0 0 1 2.661 6.44l-1.301 1.174a1.201 1.201 0 0 0-.001 1.78l1.303 1.176a3.698 3.698 0 0 1-2.668 6.439l-1.751-.09a1.196 1.196 0 0 0-1.257 1.26l.09 1.757a3.698 3.698 0 0 1-6.43 2.656l-1.176-1.302a1.197 1.197 0 0 0-1.782.003l-1.182 1.302a3.699 3.699 0 0 1-6.43-2.665l.09-1.75a1.196 1.196 0 0 0-1.259-1.258l-1.748.09a3.696 3.696 0 0 1-2.673-6.436l1.3-1.174a1.201 1.201 0 0 0 0-1.784l-1.302-1.18a3.699 3.699 0 0 1 2.665-6.432l1.752.088a1.199 1.199 0 0 0 1.258-1.267l-.084-1.752a3.699 3.699 0 0 1 6.433-2.66l1.175 1.297z"/><path d="M16 11.626a4.375 4.375 0 1 0 0 8.751 4.375 4.375 0 0 0 0-8.75zm0-2.5a6.875 6.875 0 1 1 0 13.751 6.875 6.875 0 0 1 0-13.75z"/></g></svg>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class="dropdown-list-label">Go to Team Admin</span>\n\t\t\t\t</li>\n\t\t\t\t<li class="settings settings-announcements">\n\t\t\t\t\t<span class="dropdown-list-icon-wrapper">\n\t\t\t\t\t\t<svg class="icon dropdown-list-icon icon-settings" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 530 420"><g fill-rule="nonzero"><path d="M425.0500439286232,109.85933957481384 V15.818339574813841 a10.973,10.973 0 0 0 -5.224,-8.882 a13.06,13.06 0 0 0 -9.927,-1.5670000000000002 l-207.412,82.547 h-102.4 a53.293,53.293 0 0 0 -45.976,28.212 l-9.404,3.657 C20.8980439286232,128.03633957481384 4.950043928623199,150.48933957481384 5.001043928623199,175.68733957481385 c-0.1500000000000001,25.109 15.877,47.463 39.706,55.38 l6.269,2.612 a53.812,53.812 0 0 0 26.122,28.735 l27.69,100.31 c7.428,27.284 35.568,43.38 62.852,35.952 a51.197,51.197 0 0 0 27.532,-18.711 a53.81,53.81 0 0 0 8.359,-45.453 l-18.808,-68.963 h17.763 l207.412,84.114 l3.657,1.045 a12.543,12.543 0 0 0 6.269,-1.5670000000000002 a9.926,9.926 0 0 0 5.224,-8.359 v-99.265 c36.356,-0.0010000000000000009 65.828,-29.474 65.827,-65.831 c0,-36.355 -29.47,-65.826 -65.825,-65.827 zM48.8870439286232,210.16933957481385 a35.004,35.004 0 0 1 -21.943,-34.482 A35.004,35.004 0 0 1 48.8870439286232,141.20533957481385 v68.964 zm129.567,156.735 a29.779,29.779 0 0 1 -24.555,12.016 a31.346,31.346 0 0 1 -29.257,-22.988 l-24.555,-90.384 h63.216 l19.853,74.188 a31.347,31.347 0 0 1 -4.702,27.168 zm16.719,-122.254 H100.0870439286232 c-15.846,0.8690000000000004 -29.396,-11.273 -30.265,-27.119 a28.23,28.23 0 0 1 -0.03700000000000001,-2.138 V141.20533957481385 c-0.5860000000000004,-17.302 12.965,-31.804 30.267,-32.391 l0.035,-0.0010000000000000009 h95.086 v135.837 zm208.979,80.458 L216.0700439286232,249.87533957481384 V106.72433957481385 l188.082,-75.233 v293.617 zm20.898,-104.49 v-89.861 c24.815,0.0010000000000000009 44.93,20.118 44.929,44.933 c-0.0020000000000000018,24.812 -20.116,44.927 -44.929,44.928 z" stroke="currentColor" stroke-width="8"/></g></svg>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class="dropdown-list-label">Send Announcement</span>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n'
    },
    compiler: [6, ">= 2.0.0-beta.1"],
    main: function(e, t, i, n) {
        var a;
        return '<div class="app-dash add-shadow toggle ' + (null != (a = t.if.call(e, null != e ? e.isAdmin : e, {
            name: "if",
            hash: {},
            fn: this.program(1, n, 0),
            inverse: this.program(3, n, 0),
            data: n
        })) ? a : "") + '" data-test="team-logo-app-dash">\n' + (null != (a = t.if.call(e, null != e ? e.logo : e, {
            name: "if",
            hash: {},
            fn: this.program(6, n, 0),
            inverse: this.program(11, n, 0),
            data: n
        })) ? a : "") + "</div>\n\n" + (null != (a = t.if.call(e, null != e ? e.isAdmin : e, {
            name: "if",
            hash: {},
            fn: this.program(14, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : "") + "\n"
    },
    useData: !0
}), m.templates = m.templates || {}, m.templates.upsell = m.templates.upsell || {}, m.templates.upsell.appupsell = Handlebars.template({
    compiler: [6, ">= 2.0.0-beta.1"],
    main: function(e, t, i, n) {
        var a, o, s = t.helperMissing,
            r = "function",
            l = this.escapeExpression;
        return '<span class="icon-wrapper hide"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212.982 212.982" class="icon"><path d="M131.804 106.491l75.936-75.936c6.99-6.99 6.99-18.323 0-25.312-6.99-6.99-18.322-6.99-25.312 0L106.491 81.18 30.554 5.242c-6.99-6.99-18.322-6.99-25.312 0-6.989 6.99-6.989 18.323 0 25.312l75.937 75.936-75.937 75.937c-6.989 6.99-6.989 18.323 0 25.312 6.99 6.99 18.322 6.99 25.312 0l75.937-75.937 75.937 75.937c6.989 6.99 18.322 6.99 25.312 0 6.99-6.99 6.99-18.322 0-25.312l-75.936-75.936z"/></svg></span>\n<div class="available">Available on Plus</div>\n<div class="title">' + l(typeof(o = null != (o = t.title || (null != e ? e.title : e)) ? o : s) == r ? o.call(e, {
            name: "title",
            hash: {},
            data: n
        }) : o) + '</div>\n<div class="description">' + (null != (a = typeof(o = null != (o = t.description || (null != e ? e.description : e)) ? o : s) == r ? o.call(e, {
            name: "description",
            hash: {},
            data: n
        }) : o) ? a : "") + '</div>\n<a href="" class="button upsell-action">' + l(typeof(o = null != (o = t.buttonText || (null != e ? e.buttonText : e)) ? o : s) == r ? o.call(e, {
            name: "buttonText",
            hash: {},
            data: n
        }) : o) + "</a>\n"
    },
    useData: !0
}), m.templates = m.templates || {}, m.templates.widgetmanager = m.templates.widgetmanager || {}, m.templates.widgetmanager.dashIcon = Handlebars.template({
    compiler: [6, ">= 2.0.0-beta.1"],
    main: function(e, t, i, n) {
        var a, o = t.helperMissing,
            s = "function",
            r = this.escapeExpression;
        return '<div class="app-wrapper app-placeholder">\n\t<div class="app ' + r(typeof(a = null != (a = t.appClass || (null != e ? e.appClass : e)) ? a : o) == s ? a.call(e, {
            name: "appClass",
            hash: {},
            data: n
        }) : a) + '" style="height:' + r(typeof(a = null != (a = t.height || (null != e ? e.height : e)) ? a : o) == s ? a.call(e, {
            name: "height",
            hash: {},
            data: n
        }) : a) + "; width:" + r(typeof(a = null != (a = t.width || (null != e ? e.width : e)) ? a : o) == s ? a.call(e, {
            name: "width",
            hash: {},
            data: n
        }) : a) + '">\n\t\t<div class="app-placeholder-loading">\n\t\t\t<i class="loading-icon"></i>Loading...\n\t\t</div>\n\t</div>\n</div>\n<div class="app-dash app-dash-icon add-shadow ' + r((t.kebab || e && e.kebab || o).call(e, null != e ? e.label : e, {
            name: "kebab",
            hash: {},
            data: n
        })) + '-toggle toggle" data-test="' + r((t.kebab || e && e.kebab || o).call(e, null != e ? e.label : e, {
            name: "kebab",
            hash: {},
            data: n
        })) + '-app-dash" data-ob="' + r((t.kebab || e && e.kebab || o).call(e, null != e ? e.label : e, {
            name: "kebab",
            hash: {},
            data: n
        })) + '-app-dash">\n\t<span class="app-dash-icon-label">' + r(typeof(a = null != (a = t.label || (null != e ? e.label : e)) ? a : o) == s ? a.call(e, {
            name: "label",
            hash: {},
            data: n
        }) : a) + "</span>\n</div>\n"
    },
    useData: !0
}), m.templates.widgetmanager.metric = Handlebars.template({
    1: function(e, t, i, n) {
        var a;
        return '<span class="metric-stat-unit">' + this.escapeExpression("function" == typeof(a = null != (a = t.metricUnit || (null != e ? e.metricUnit : e)) ? a : t.helperMissing) ? a.call(e, {
            name: "metricUnit",
            hash: {},
            data: n
        }) : a) + "</span>"
    },
    compiler: [6, ">= 2.0.0-beta.1"],
    main: function(e, t, i, n) {
        var a, o, s = t.helperMissing,
            r = "function",
            l = this.escapeExpression;
        return '<div class="view">\n\t<div class="primary">\n\t\t<div class="metric-stat">\n\t\t\t<span class="metric-stat-number">' + l(typeof(o = null != (o = t.metricValue || (null != e ? e.metricValue : e)) ? o : s) == r ? o.call(e, {
            name: "metricValue",
            hash: {},
            data: n
        }) : o) + "</span>" + (null != (a = t.if.call(e, null != e ? e.metricUnit : e, {
            name: "if",
            hash: {},
            fn: this.program(1, n, 0),
            inverse: this.noop,
            data: n
        })) ? a : "") + '\n\t\t</div>\n\t\t<div class="metric-label">\n\t\t\t<span class="metric-label-name">' + l(typeof(o = null != (o = t.metricLabel || (null != e ? e.metricLabel : e)) ? o : s) == r ? o.call(e, {
            name: "metricLabel",
            hash: {},
            data: n
        }) : o) + '</span>\n\t\t</div>\n\t</div>\n\t<span class="metric-message"></span>\n</div>\n'
    },
    useData: !0
}), m.templates.widgetmanager.pane = Handlebars.template({
    compiler: [6, ">= 2.0.0-beta.1"],
    main: function(e, t, i, n) {
        var a, o = t.helperMissing,
            s = "function",
            r = this.escapeExpression;
        return '<div class="app-wrapper app-placeholder nipple">\n\t<div class="app ' + r(typeof(a = null != (a = t.appClass || (null != e ? e.appClass : e)) ? a : o) == s ? a.call(e, {
            name: "appClass",
            hash: {},
            data: n
        }) : a) + '" style="height:' + r(typeof(a = null != (a = t.height || (null != e ? e.height : e)) ? a : o) == s ? a.call(e, {
            name: "height",
            hash: {},
            data: n
        }) : a) + "; width:" + r(typeof(a = null != (a = t.width || (null != e ? e.width : e)) ? a : o) == s ? a.call(e, {
            name: "width",
            hash: {},
            data: n
        }) : a) + '">\n\t\t<div class="app-placeholder-loading">\n\t\t\t<i class="loading-icon"></i>Loading...\n\t\t</div>\n\t</div>\n</div>\n<span class="app-dash toggle ' + r(typeof(a = null != (a = t.label || (null != e ? e.label : e)) ? a : o) == s ? a.call(e, {
            name: "label",
            hash: {},
            data: n
        }) : a) + '-toggle" data-test="' + r((t.kebab || e && e.kebab || o).call(e, null != e ? e.label : e, {
            name: "kebab",
            hash: {},
            data: n
        })) + '-app-dash" data-ob="' + r((t.kebab || e && e.kebab || o).call(e, null != e ? e.label : e, {
            name: "kebab",
            hash: {},
            data: n
        })) + '-app-dash">' + r(typeof(a = null != (a = t.label || (null != e ? e.label : e)) ? a : o) == s ? a.call(e, {
            name: "label",
            hash: {},
            data: n
        }) : a) + "</span>\n"
    },
    useData: !0
});
var momoConstants = {
        classInputLengthError: "invalid-length",
        msPerDay: 864e5,
        msPerHour: 36e5,
        dateRolloverHour: 4,
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        keyEscape: 27,
        keyReturn: 13,
        minMarginSmoothScroll: 50,
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        suggestIntegrationLink: "https://momentum.nolt.io/",
        timeContentItemAnimation: 200,
        timeSettingsFade: 150,
        timeSmoothScroll: 500,
        timeToggleClassTwice: 100
    },
    endPunctuationCharCodes = [33, 34, 40, 41, 46, 63, 91, 93, 96, 123, 125, 8220, 8221, 8230],
    utils = {
        setMomentumAuthHeader: function(e) {
            if (localStorage.token && e.setRequestHeader("Authorization", "Bearer " + localStorage.token), localStorage.client_uuid && e.setRequestHeader("X-Momentum-ClientId", localStorage.client_uuid), e.setRequestHeader("X-Momentum-Version", m.globals.version), e.setRequestHeader("X-Momentum-ClientDate", m.utils.getLocalDateTimeString()), m.conditionalFeatures.featureEnabled("allowoptions")) {
                var t = localStorage.getItem("X-Momentum-Options");
                t && e.setRequestHeader("X-Momentum-Options", t)
            }
            localStorage.activeTags && e.setRequestHeader("X-Momentum-Tags", localStorage.activeTags)
        },
        ensureUrlScheme: function(e) {
            return /^(((f|ht)tps?)|chrome|chrome-extension|chrome-search):\/\//i.test(e) || /^(file:\\|file:\/\/)+/i.test(e) || (e = "http://" + e), e
        },
        mConst: function(e) {
            var t = momoConstants[e];
            return void 0 === t && console.warn("constant not found:", e), t
        },
        hasClass: function(e, t) {
            return e.classList ? e.classList.contains(t) : new RegExp("\\b" + t + "\\b").test(e.className)
        },
        addClass: function(e, t) {
            e.classList ? e.classList.add(t) : m.utils.hasClass(e, t) || (e.className += " " + t)
        },
        removeClass: function(e, t) {
            e.classList ? e.classList.remove(t) : e.className = e.className.replace(new RegExp("\\b" + t + "\\b", "g"), "")
        },
        validateEmail: function(e) {
            return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(e)
        },
        getQueryParameter: function(e) {
            e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var t = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(location.search);
            return null === t ? "" : decodeURIComponent(t[1].replace(/\+/g, " "))
        },
        toggleLocalStorageBool: function(e) {
            var t = "true" === localStorage[e] ? "false" : "true";
            return "true" == (localStorage[e] = t)
        },
        getLocalStorageBool: function(e) {
            return "true" === localStorage[e]
        },
        setEndOfContentEditable: function(e) {
            var t, i;
            document.createRange && ((t = document.createRange()).selectNodeContents(e), t.collapse(!1), (i = window.getSelection()).removeAllRanges(), i.addRange(t))
        },
        getDateString: function(e) {
            return void 0 === e ? e = new Date : e instanceof Date || (e = new Date(e)), e.getHours() < m.utils.mConst("dateRolloverHour") && e.setDate(e.getDate() - 1), e.getFullYear().toString() + "-" + m.utils.twoDigit(e.getMonth() + 1) + "-" + m.utils.twoDigit(e.getDate())
        },
        getLocalDateTimeString: function(e) {
            return void 0 === e ? e = new Date : e instanceof Date || (e = new Date(e)), e.getFullYear().toString() + "-" + m.utils.twoDigit(e.getMonth() + 1) + "-" + m.utils.twoDigit(e.getDate()) + "T" + m.utils.twoDigit(e.getHours()) + ":" + m.utils.twoDigit(e.getMinutes()) + ":" + m.utils.twoDigit(e.getSeconds())
        },
        getDayPart: function(e) {
            var t = e.getHours();
            return t >= m.utils.mConst("dateRolloverHour") && t < 12 ? "morning" : 12 <= t && t < 17 ? "afternoon" : "evening"
        },
        getDayName: function(e, t) {
            return m.utils.mConst("dayNames" + (t ? "Short" : ""))[e.getDay()]
        },
        getMonthName: function(e, t) {
            return m.utils.mConst("monthNames" + (t ? "Short" : ""))[e.getMonth()]
        },
        getDaysInMonth: function(e, t) {
            return new Date(e, parseInt(t) + 1, 0).getDate()
        },
        dateDiffIntegerDays: function(e, t) {
            var i = new Date(e.valueOf());
            return (new Date(t.valueOf()).setHours(0, 0, 0, 0) - i.setHours(0, 0, 0, 0)) / m.utils.mConst("msPerDay")
        },
        dateIsYesterday: function(e) {
            return -1 === m.utils.dateDiffIntegerDays(m.date(), e)
        },
        dateIsToday: function(e) {
            return 0 === m.utils.dateDiffIntegerDays(m.date(), e)
        },
        dateIsTomorrow: function(e) {
            return 1 === m.utils.dateDiffIntegerDays(m.date(), e)
        },
        dateIsInLast7d: function(e) {
            var t = m.utils.dateDiffIntegerDays(m.date(), e);
            return -7 < t && t <= 0
        },
        getFriendlyDate: function(e) {
            var t, i, n = m.date();
            return i = (t = e instanceof Date ? e : m.utils.parseIsoDatetime(e)).getFullYear() === n.getFullYear() ? "" : ", " + t.getFullYear(), m.utils.mConst("monthNamesShort")[t.getMonth()] + " " + t.getDate() + i
        },
        formatYearRelative: function(e) {
            var t = m.date(),
                i = e.getFullYear();
            return i === t.getFullYear() ? "" : ", " + i
        },
        formatMonthDayRelative: function(e, t) {
            return m.utils.dateIsTomorrow(e) ? "Tomorrow" : m.utils.dateIsToday(e) ? "Today" : m.utils.dateIsYesterday(e) ? "Yesterday" : m.utils.getMonthName(e, t) + " " + e.getDate()
        },
        getHoursMinsStr: function(e, t) {
            void 0 === t && (t = m.models.customization.get("hour12clock"));
            var i, n = e.getHours();
            return (t ? (i = " " + (n < 12 ? "AM" : "PM"), 12 < n && (n -= 12), 0 === n && (n = 12), n) : (i = "", m.utils.twoDigit(n))) + ":" + m.utils.twoDigit(e.getMinutes()) + i
        },
        parseIsoDatetime: function(e) {
            var t = e.split(/[: T-]/).map(parseFloat);
            return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0, 0)
        },
        nightsBetween: function(e, t, i) {
            var n = e,
                a = t,
                o = e.valueOf() >= t.valueOf();
            o && (n = t, a = e);
            var s = a.valueOf() - n.valueOf(),
                r = m.utils.calcDayMs(n, i) + s,
                l = Math.floor(r / m.utils.mConst("msPerDay"));
            return 0 !== l && o && (l *= -1), l
        },
        calcDayMs: function(e, t) {
            var i = e - new Date(e).setHours(0, 0, 0, 0) - t * m.utils.mConst("msPerHour");
            return i < 0 && (i += m.utils.mConst("msPerDay")), i
        },
        dateAdd: function(e, t, i) {
            function n() {
                a.getDate() !== e.getDate() && a.setDate(0)
            }
            var a = new Date(e);
            switch (t.toLowerCase()) {
                case "year":
                    a.setFullYear(a.getFullYear() + i), n();
                    break;
                case "quarter":
                    a.setMonth(a.getMonth() + 3 * i), n();
                    break;
                case "month":
                    a.setMonth(a.getMonth() + i), n();
                    break;
                case "week":
                    a.setDate(a.getDate() + 7 * i);
                    break;
                case "day":
                    a.setDate(a.getDate() + i);
                    break;
                case "hour":
                    a.setTime(a.getTime() + 36e5 * i);
                    break;
                case "minute":
                    a.setTime(a.getTime() + 6e4 * i);
                    break;
                case "second":
                    a.setTime(a.getTime() + 1e3 * i);
                    break;
                default:
                    a = void 0
            }
            return a
        },
        isEndPunctuationChar: function(e) {
            return _.contains(endPunctuationCharCodes, e.charCodeAt(0))
        },
        endsWithEndPunctuation: function(e) {
            return !!e && m.utils.isEndPunctuationChar(e.slice(-1))
        },
        getEndPunctuationString: function(e) {
            for (var t, i = "", n = e.length - 1; 0 <= n && (t = e.charAt(n), m.utils.isEndPunctuationChar(t)); n--) i = t + i;
            return i
        },
        capitalizeFirstLetter: function(e) {
            return null == e ? null : e.slice(0, 1).toUpperCase() + e.slice(1)
        },
        capitalizeWords: function(e) {
            var i = e.split(" ");
            return i.forEach(function(e, t) {
                i[t] = e.charAt(0).toUpperCase() + e.slice(1)
            }), i.join(" ")
        },
        removeTags: function(e) {
            for (var t, i = "(?:[^\"'>]|\"[^\"]*\"|'[^']*')*", n = new RegExp("<(?:!--(?:(?:-*[^->])*--+|-?)|script\\b" + i + ">[\\s\\S]*?</script\\s*|style\\b" + i + ">[\\s\\S]*?</style\\s*|/?[a-z]" + i + ")>", "gi");
                (e = (t = e).replace(n, "")) !== t;);
            return e.replace(/</g, "&lt;")
        },
        lineBreakString: function(e, s) {
            function r(e, t, i, n, a, o) {
                var s, r = 0,
                    l = t - 1;
                if (a) s = 0;
                else {
                    s = t - o;
                    var d = e.slice(0, s - 1);
                    i.push(" "), i.push(d), l += r = s - 1
                }
                for (var c = Math.round((e.length - s) / t); 0 <= c; c--) {
                    var m = e.slice(r, l);
                    if (!m) break;
                    a ? a = !1 : (i.push(0 === r ? "<br>" : "-<br>"), n = i.length - 1), i.push(m), r += t - 1, l += t - 1
                }
                return n
            }
            if (e) {
                if (e.length <= s) return e;
                var t = e.split(" "),
                    l = [],
                    d = 0;
                return t.forEach(function(e, t) {
                    var i, n, a, o = (i = l, a = 0, (n = d ? d + 1 : 0) && (i = i.slice(n)), i.forEach(function(e) {
                        a += e.length
                    }), a);
                    t ? e.length + o > s ? e.length > s && !e.includes("-") ? d = r(e, s, l, d, !1, o) : (l.push("<br>"), d = l.length - 1, l.push(e)) : (l.push(" "), l.push(e)) : e.length > s && !e.includes("-") ? d = r(e, s, l, d, !0) : l.push(e)
                }), l.join("")
            }
        },
        twoDigit: function(e) {
            var t = parseInt(e);
            return (10 <= t ? t : "0" + t.toString()).toString()
        },
        getRandomBoolByFrequency: function(e) {
            return Math.random() < e
        },
        getNextIndex: function(e, t) {
            return t === e.length - 1 || m.utils.arrayIndexOutOfBounds(e, t) ? 0 : t + 1
        },
        getPrevIndex: function(e, t) {
            return 0 === t || m.utils.arrayIndexOutOfBounds(e, t) ? e.length - 1 : t - 1
        },
        arrayIndexOutOfBounds: function(e, t) {
            return t < 0 || t >= e.length
        },
        getRandomIntInclusive: function(e, t) {
            return e = Math.ceil(e), t = Math.floor(t), Math.floor(Math.random() * (t - e + 1)) + e
        },
        getRandomItem: function(e) {
            return e[Math.floor(Math.random() * e.length)]
        },
        betweenInclusive: function(e, t, i) {
            return t <= e && e <= i
        },
        rightPosition: function(e) {
            if (void 0 !== e && 0 !== e.length) return e.offset().left + e.width()
        },
        bottomPosition: function(e) {
            if (void 0 !== e && 0 !== e.length) return e.offset().top + e.outerHeight()
        },
        distanceBelow: function(e, t, i) {
            var n = m.utils.bottomPosition(e) - m.utils.bottomPosition(t);
            return i && (n += i), n
        },
        removePulseClass: function(e) {
            "pulse" !== e.originalEvent.animationName && "pulselight" !== e.originalEvent.animationName || $(e.target).removeClass("pulse")
        },
        scrollToBottom: function(e) {
            var t = e[0];
            t.scrollTop = t.scrollHeight
        },
        toggleClassTwice: function(e, t) {
            e.toggleClass(t), setTimeout(function() {
                e.toggleClass(t)
            }, m.utils.mConst("timeToggleClassTwice"))
        },
        isEdge: function() {
            return navigator.userAgent.includes("Edg")
        },
        isChrome: function() {
            return "Chrome" === m.globals.platform
        },
        isChromium: function() {
            return "Chrome" === m.globals.platform || "Edge" === m.globals.platform
        },
        isChromiumExtension: function() {
            return !!m.utils.isChromium() && !!chrome.extension
        },
        getBrowserName: function() {
            return m.globals.platform
        },
        getBrowserVersion: function() {
            return parseInt(navigator.userAgent.match(new RegExp("rv:([0-9]+)"))[1])
        },
        getBrowser: function() {
            return m.utils.isChromium() ? chrome : browser
        },
        getFavIcon: function(e) {
            var t = document.createElement("a");
            t.href = e;
            var i = t.hostname;
            if (!i.startsWith("www.")) {
                var n = i.split(".");
                (n.length < 3 || 3 == n.length && n[1].length < 4) && (i = "www." + i)
            }
            return "https://icons.duckduckgo.com/ip2/" + i + ".ico"
        },
        uuidv4: function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
                var t = 16 * Math.random() | 0;
                return ("x" == e ? t : 3 & t | 8).toString(16)
            })
        },
        shortId: function() {
            var e = 46656 * Math.random() | 0,
                t = 46656 * Math.random() | 0;
            return (e = ("000" + e.toString(36)).slice(-3)) + (t = ("000" + t.toString(36)).slice(-3))
        },
        isTabOrEnter: function(e) {
            var t = e.originalEvent;
            return t.key ? "Enter" === t.key || "Tab" === t.key : t.code ? "Enter" === t.code || "Tab" === t.code || "NumpadEnter" === t.code : 13 === e.keyCode || 9 === e.keyCode
        },
        newTabForFileLink: function(e) {
            m.utils.getBrowser().tabs.create({
                url: e
            })
        },
        isUrlLocalFileLink: function(e) {
            return /^(file:\\|file:\/\/)+/i.test(e)
        },
        captionFormatter: function(e) {
            return e
        },
        mergeObjects: function(e, t, i) {
            for (var n in e = e || {}, t) e[n] = i && e[n] || t[n];
            return e
        },
        toTodaysTime: function(e) {
            var t = m.date(),
                i = e.indexOf(":"),
                n = e.substring(0, i);
            return n = 12 == n ? 0 : n, t.setHours(parseInt(n) + ("p" === e[e.length - 2].toLowerCase() ? 12 : 0)), t.setMinutes(parseInt(e.substring(i + 1, e.length - 2))), t
        },
        isInputOrTextAreaActive: function() {
            return "INPUT" === document.activeElement.tagName || "TEXTAREA" === document.activeElement.tagName || 1 == document.activeElement.isContentEditable
        }
    };
for (var key in utils) m.utils[key] = utils[key];

function addSvgClassList(e, t, i) {
    return e + ("string" == typeof i ? " " + i : "") + t
}
m.utils.parseJwt = function(e) {
    try {
        var t = e.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
            i = decodeURIComponent(atob(t).split("").map(function(e) {
                return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2)
            }).join(""));
        return JSON.parse(i)
    } catch (e) {
        return null
    }
}, m.globals.version = "2.1.21", m.globals.platform = "Chrome", m.globals.isProduction = !0, m.globals.gaCode = "UA-44319322-10", m.globals.gaCodePlus = "UA-44319322-13", m.globals.urlRoot = "https://api.momentumdash.com/", m.globals.urlRootApi = "https://api.momentumdash.com/", m.globals.urlRootLogin = "https://login.momentumdash.com/", m.globals.urlRootAccount = "https://account.momentumdash.com/", m.globals.urlRootStats = "https://stats.momentumdash.com/", m.globals.urlRootIntegration = "https://integration.momentumdash.com/", m.globals.liveApi = !0, Handlebars.registerHelper("lower", function(e) {
    return e && e.toLowerCase()
}), Handlebars.registerHelper("kebab", function(e) {
    return e && e.toLowerCase().trim().split(/[ -_]/).join("-")
}), Handlebars.registerHelper("skipIconPath", function() {
    return '<path d="M291.5,281A22.5,22.5,0,1,1,269,303.5,22.52,22.52,0,0,1,291.5,281m0-1A23.5,23.5,0,1,0,315,303.5,23.5,23.5,0,0,0,291.5,280Z" transform="translate(-176 -194.88)"/><path class="arrow" d="M399,257.5a135.18,135.18,0,0,0-41.16-42.17c-22.7-14.74-49.38-21.92-75.15-20.2a108.71,108.71,0,0,0-65.16,27c-19.91,17.5-33.76,41.79-41.18,72.19a13.52,13.52,0,0,0,9.92,16.32,13.66,13.66,0,0,0,3.21.38,13.51,13.51,0,0,0,13.11-10.3c6.07-24.92,17.1-44.54,32.76-58.31a82,82,0,0,1,49.13-20.32c20-1.33,40.81,4.32,58.65,15.9A108.07,108.07,0,0,1,374,268.51l-30,13.2,72.43,40.36,8.6-76Z" transform="translate(-176 -194.88)"/>'
}), Handlebars.registerHelper("iconEllipsis", function(e) {
    return addSvgClassList('<svg class="icon icon-ellipsis', '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M8 22c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zM52 22c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zM30 22c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8z"/></svg>', e)
}), Handlebars.registerHelper("iconCancel", function(e) {
    return addSvgClassList('<svg class="icon icon-cancel', '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212.982 212.982"><path d="M131.804 106.491l75.936-75.936c6.99-6.99 6.99-18.323 0-25.312-6.99-6.99-18.322-6.99-25.312 0L106.491 81.18 30.554 5.242c-6.99-6.99-18.322-6.99-25.312 0-6.989 6.99-6.989 18.323 0 25.312l75.937 75.936-75.937 75.937c-6.989 6.99-6.989 18.323 0 25.312 6.99 6.99 18.322 6.99 25.312 0l75.937-75.937 75.937 75.937c6.989 6.99 18.322 6.99 25.312 0 6.99-6.99 6.99-18.322 0-25.312l-75.936-75.936z"/></svg>', e)
}), Handlebars.registerHelper("browserName", function() {
    return m.globals.platform
}), Handlebars.registerHelper("browserNameLower", function() {
    return m.globals.platform.toLowerCase()
}), Handlebars.registerHelper("browserIcon", function(e) {
    switch (m.globals.platform) {
        case "Chrome":
            return addSvgClassList('<svg class="icon-chrome-tab', '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 497.401 497.401"><g><path d="M478.742 154.382H320.714c28.366 21.765 47.111 55.717 47.111 94.307 0 30.63-14.345 56.386-30.933 79.445-28.322 39.41-95.817 168.878-95.817 168.878 2.567.043 5.026.388 7.636.388 137.341 0 248.69-111.348 248.69-248.69-.022-33.412-6.709-65.229-18.659-94.328z"/><path d="M248.172 129.619c54.402-.388 217.628-2.049 217.628-2.049C423.24 51.511 342.069 0 248.69 0 170.819 0 101.361 35.829 55.782 91.848l75.972 134.925c10.268-55.113 58.349-96.744 116.418-97.154z"/><path d="M248.668 367.825c-51.964 0-91.568-35.117-111.974-79.855-20.535-45.018-98.061-171.984-98.061-171.984C14.301 154.425 0 199.832 0 248.69c0 124.744 91.935 227.744 211.696 245.648l77.288-134.019c-12.641 4.615-26.101 7.506-40.316 7.506z"/><circle cx="248.668" cy="248.711" r="80.416"/></g></svg>', e);
        case "Edge":
            return addSvgClassList('<svg class="icon-edge-tab', '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4.667 3.764c2.918 0 5.282 1.864 5.325 4.174 0 .013.007.025.007.039V8c0 .029-.014.224-.024.292a1.989 1.989 0 01-.4.932 2.291 2.291 0 01-.165.19v.005a.285.285 0 00-.052.076.343.343 0 00-.046.162.6.6 0 00.295.452 1.425 1.425 0 00.173.109 4.882 4.882 0 002.2.435h.227a3.717 3.717 0 001.891-.524A3.838 3.838 0 0016 6.826a6.13 6.13 0 00-.15-1.338c-.011-.038-.021-.076-.032-.113a8.092 8.092 0 00-.526-1.295A8.016 8.016 0 008 0 8 8 0 00.415 5.467a5.851 5.851 0 014.252-1.703z"/><path d="M4.238 11.022a5.333 5.333 0 012.784-4.765h.007c.049-.027.1-.052.152-.075l.036-.018.048-.018a1.881 1.881 0 01.968-.124A5.294 5.294 0 004.68 4.734C2.107 4.734.013 6.335.013 8.3c0 .051 0 .1.005.153v.013a7.993 7.993 0 005.543 7.15 8.055 8.055 0 001.9.339 5.3 5.3 0 01-3.223-4.933z"/><path d="M4.905 11.022a4.532 4.532 0 004.4 4.645 5.787 5.787 0 001.753-.3 8.007 8.007 0 003.715-3.1.251.251 0 00-.334-.353 5.744 5.744 0 01-.658.294 6.371 6.371 0 01-2.244.4 6.305 6.305 0 01-2.666-.58c-.02-.009-.04-.021-.06-.031a4.68 4.68 0 01-2.79-3.723C6.012 8.169 6 8.065 6 7.959v-.008a4.8 4.8 0 00-1.095 3.071z"/></svg>', e);
        default:
            return
    }
}), Handlebars.registerHelper("isChrome", function(e) {
    return m.utils.isChrome() ? e.fn(this) : e.inverse(this)
}), Handlebars.registerHelper("isChromium", function(e) {
    return m.utils.isChromium() ? e.fn(this) : e.inverse(this)
}), Handlebars.registerHelper("ifnoteq", function(e, t, i) {
    return e !== t ? i.fn(this) : i.inverse(this)
}), m.sendEvent = function(e, t, i, n, a, o, s) {
    if (e) {
        var r = m.conditionalFeatures && m.conditionalFeatures.featureEnabled("plus");
        if ("pageview" !== (n = n || "event")) {
            var l = {
                properties: {
                    component: e,
                    operation: t,
                    details: i,
                    eventType: n
                }
            };
            a && (l.correlationId = a), o && (l.xid = o), s && (l.xvar = s), m.usage.save(l, !0)
        }
        var d = 100;
        if (r || (d = 1), 100 * Math.random() > d) return null;
        var c = r ? m.globals.gaCodePlus : m.globals.gaCode;
        try {
            var u = sessionStorage ? sessionStorage.getItem("ga_sess") : m.utils.uuidv4();
            u || (u = m.utils.uuidv4(), sessionStorage.setItem("ga_sess", u));
            var g = window.navigator.userLanguage || window.navigator.language,
                h = window.screen.availWidth + "x" + window.screen.availHeight,
                f = window.screen.colorDepth,
                p = window.innerWidth + "x" + window.innerHeight,
                v = new XMLHttpRequest,
                b = "v=1&tid=" + c + "&cid=" + u + "&t=" + n + "&sf=" + d + "&ul=" + g + "&sr=" + h + "&vp=" + p + "&de=" + document.characterSet + "&sd=" + f + "&aip=1";
            e && (b += "pageview" === n ? "&dp=" + e : "&ec=" + e), t && (b += "&ea=" + t), i && (b += "&el=" + i), v.open("POST", "https://www.google-analytics.com/collect", !0), v.send(b)
        } catch (e) {}
    }
}, m.models.Manager = Backbone.Model.extend({}), m.collect.Manager = Backbone.Collection.extend({}), m.models.Addin = Backbone.Model.extend({
    defaults: {
        evaluated: !1,
        processed: !1,
        processing: !1,
        lazy: !1
    }
}), m.collect.AddinCollection = Backbone.Collection.extend({
    model: m.models.Addin
}), m.models.AddinManagerBase = Backbone.Model.extend({
    initialize: function() {
        var e = this;
        this.preInitialize && this.preInitialize(), this.addinCollection = new m.collect.AddinCollection, this.loadDependencyMap(), this.listenTo(this.addinCollection, "add change", this.processPending), setTimeout(function() {
            e.loadFromAddinObject(!0)
        }, 50)
    },
    loadEvaluatedAddin: function(e, t) {
        this.addinCollection.add({
            id: e,
            evaluated: !0,
            addInCode: t
        })
    },
    loadAddin: function(e) {
        this.addinCollection.add({
            rawCode: e
        })
    },
    loadFromAddinObject: function(e) {
        var i = this,
            n = !1;
        _.each(m.addins, function(e, t) {
            n = !0, i.addinCollection.findWhere({
                id: t
            }) || i.loadEvaluatedAddin(t, e)
        }), n && e && this.processPending()
    },
    registerAddinLocalSource: function(e, t) {
        this.addinCollection.findWhere({
            id: e
        }) || this.addinCollection.add({
            id: e,
            path: t
        })
    },
    registerAddinFn: function(e, t) {
        var i = this.addinCollection.findWhere({
            id: e
        });
        i ? i.set({
            evaluated: !0,
            addInCode: t
        }) : this.addinCollection.add({
            id: e,
            evaluated: !0,
            addInCode: t
        })
    },
    loadDependencyMap: function() {
        if (!this.localAddins && !this.localLoadFailed) {
            var e = [],
                t = {},
                i = {},
                n = {};
            this.dependencies = n;
            for (var a = 0; a < this.configInfo.length; a++) {
                var o = this.configInfo[a],
                    s = o.addin.toLowerCase();
                s || console.log("addin not found: " + s), e.push(s), t[s] = o.id, i[o.id] = s, o.dependencies && 0 < o.dependencies.length && (n[s] = o.dependencies)
            }
            this.localAddins = {
                addins: e,
                map: t,
                mapNameToId: i
            }
        }
    },
    ensureAddinNameLoaded: function(e, t, i, n) {
        if (this.localAddins) {
            var a = e.toLowerCase(),
                o = this.localAddins.mapNameToId[a];
            o ? this.ensureAddinLoaded(o, t, i, n) : console.log("can't find id for addin name" + a)
        } else console.log("localAddins info not populated in ensureAddinNameLoaded")
    },
    ensureAddinLoaded: function(e, t, i, n) {
        var a = this;
        e = e.toLowerCase();
        var o = this.addinCollection.get(e);
        if (o && o.get("loaded")) t && t(o);
        else if (!o || !o.get("loading")) {
            var s = null;
            if (this.localAddins) {
                var r = e.toLowerCase(),
                    l = this.localAddins.map[r];
                l && (s = "app/" + (m.globals.isProduction ? r : l) + ".js")
            }
            if (i) try {
                i()
            } catch (e) {}
            var d = null;
            if (!o && this.dependencies[e]) {
                var c = this.dependencies[e];
                d = [];
                for (var u = 0; u < c.length; u++) {
                    var g = c[u];
                    (f = this.localAddins.mapNameToId[g]) && d.push(f)
                }
            }
            if ((o = o || this.addinCollection.add({
                    id: e,
                    evaluated: !1,
                    processed: !1,
                    lazy: !1,
                    dependencyIds: d
                })).get("loading")) t && this.listenToOnce(this, "addin:loaded:" + e, function() {
                t()
            });
            else {
                var h = o.get("dependencyIds");
                if (h && 0 < h.length)
                    for (u = 0; u < h.length; u++) {
                        var f = h[u],
                            p = this.addinCollection.get(f);
                        if (p && !p.get("loaded") && !p.get("loading")) return this.listenToOnce(this, "addin:loaded:" + f, function() {
                            a.ensureAddinLoaded(e, t, i, n)
                        }), void a.ensureAddinLoaded(f, function() {
                            a.ensureAddinLoaded(e, t, i, n)
                        }, i, n)
                    }
                o.set({
                    loading: !0
                }), m.console.log(m.elapsed() + ": script added " + s), t && this.listenToOnce(this, "addin:loaded:" + e, function() {
                    t()
                }), this.addScriptToDom(e, s)
            }
        }
    },
    addScriptToDom: function(t, e, i) {
        var n = this.configInfo.find(function(e) {
            return e.addin === t
        });
        if (n && n.vue) m.trigger("loadVueAddin", n.id, t);
        else if (!document.getElementById(t)) {
            var a = document.createElement("script");
            a.type = "text/javascript", a.async = !0, a.src = e, a.id = t, i && (a.onerror = i), document.body.appendChild(a)
        }
    },
    getWidgets: function() {
        return _.filter(this.configInfo, function(e) {
            return !!e.widget
        })
    },
    getCommands: function() {
        var i = [];
        return _.map(this.configInfo, function(e) {
            if (e.commands && 0 < e.commands.length)
                for (var t = 0; t < e.commands.length; t++) i.push({
                    id: e.commands[t],
                    addin: e.addin
                })
        }), i
    },
    getAddinCommands: function(e) {
        return e && this.addinCollection.get(e).instance.commands || {}
    },
    refresh: function() {
        this.loadFromAddinObject(!0)
    },
    processPending: function() {
        var r = this;
        this.evaluatePending(), _.each(this.addinCollection.where({
            evaluated: !0,
            processed: !1,
            processing: !1,
            lazy: !1
        }), function(e) {
            try {
                if (e.get("processing") || e.get("processed")) return;
                var t = e.get("addInCode");
                if (t) {
                    var i = {},
                        n = e.get("dependencyIds");
                    if (n && 0 < n.length)
                        for (var a = 0; a < n.length; a++) {
                            var o = n[a],
                                s = r.addinCollection.get(o);
                            if (!s || !s.get("loaded")) return void r.ensureAddinLoaded(o);
                            i[r.localAddins.map[o]] = s.instance
                        }
                    e.set({
                        processing: !0
                    }), e.instance = t(m, $, i), e.set({
                        evaluated: !0,
                        loading: !1,
                        loaded: !0,
                        processing: !0
                    }), r.trigger("addin:loaded:" + e.id), r.trigger("addin:loaded", e.id)
                }
            } catch (e) {
                console.error(e)
            }
        })
    },
    evaluatePending: function() {}
}), m.models.AddinManager = m.models.AddinManagerBase.extend({}), m.models.AddinManager = m.models.AddinManager.extend({
    configInfo: [{
        id: "base_metric",
        addin: "ce945086-a64d-4b67-b730-9eb7d7b72030"
    }, {
        widget: !0,
        placeholderType: "none",
        id: "bookmarks-primer",
        region: "top-bar",
        autoLoad: !0,
        addin: "1369894c-efef-4d5f-9bd6-3e136e09c5e8"
    }, {
        widget: !0,
        stub: !0,
        autoLoad: !0,
        id: "company_link",
        label: "Company Link",
        region: "top-center",
        requiredFeature: "company_link",
        addin: "dce1a4fc-4d92-41d5-8aaf-329e5f267b70"
    }, {
        widget: !0,
        placeholderType: "metric",
        id: "countdown",
        class: "app-container base-metric metric countdown",
        region: "top-right",
        order: "append",
        addin: "fb230b62-96ce-44b5-87c5-4a563553038b",
        requiredFeature: "countdown",
        visibleSetting: "countdownVisible",
        dependencies: ["base_metric"]
    }, {
        widget: !0,
        placeholderType: "none",
        id: "countdown_detail",
        addin: "5c0e5be2-0c14-4e99-85e4-cdc58f0cdd58",
        dependencies: ["countdown"]
    }, {
        widget: !0,
        placeholderType: "metric",
        id: "dashlinks",
        class: "app-container dashlinks",
        region: "top-left",
        order: "prepend",
        after: ".team-logo",
        addin: "7d9ace94-8620-4bc0-9160-fcc15d4cb578"
    }, {
        widget: !0,
        autoLoad: !0,
        id: "focus_css_override",
        addin: "a98d637b-0035-46f3-96ac-c1bd00c950b1",
        requiredFeature: "noPersonalFocus"
    }, {
        widget: !0,
        id: "quicklinks",
        class: "links",
        dependencies: ["links_common"],
        label: "Links",
        appClass: "links-app",
        region: "top-left",
        order: "prepend",
        width: 260,
        openState: "LinksOpen",
        keepOpenSetting: "linksKeepOpen",
        placeholderType: "pane",
        addin: "ad54d482-248b-4abf-b5b0-a8eaf3e89132",
        requiredFeature: ["!teamLinks"],
        storedHeight: "links-height",
        toggleEvent: "globalEvent:key:L",
        closeOnEsc: "true",
        visibleSetting: "linksVisible"
    }, {
        id: "links_common",
        class: "links",
        appClass: "links-app",
        region: "top-left",
        order: "prepend",
        width: 220,
        addin: "417829ca-7ff0-4089-b265-f775180c843e",
        toggleEvent: "globalEvent:key:L",
        closeOnEsc: "true",
        visibleSetting: "linksVisible"
    }, {
        widget: !0,
        placeholderType: "metric",
        id: "metrics",
        class: "app-container base-metric metric metrics",
        region: "top-right",
        order: "append",
        addin: "2314da1c-0579-4b4b-8dd6-5f89f27e806a",
        requiredFeature: "plus",
        visibleSetting: "metricVisible",
        dependencies: ["base_metric", "settings"]
    }, {
        widget: !0,
        placeholderType: "none",
        id: "metric_new_detail",
        addin: "44bf660b-a47e-4433-87eb-3e31ca7d94c6",
        dependencies: ["metrics"]
    }, {
        widget: !0,
        placeholderType: "metric",
        id: "multiclock",
        class: "app-container base-metric metric multiclock",
        region: "top-right",
        order: "append",
        addin: "4466a63e-7913-445c-b266-1ce6f8e378f3",
        requiredFeature: "countdown",
        visibleSetting: "multiClockVisible",
        dependencies: ["base_metric"]
    }, {
        widget: !0,
        placeholderType: "none",
        id: "multi_clock_detail",
        addin: "a06e4f59-baf4-4fc6-bf71-5b1cd524fe53",
        dependencies: ["multiclock"]
    }, {
        widget: !0,
        id: "notes",
        "data-test": "notes",
        label: "Notes",
        placeholderType: "pane",
        region: "bottom-right",
        order: "prepend",
        storedHeight: "notes-pane-height",
        width: 750,
        height: 520,
        addin: "23c67761-9831-415e-b358-c6844eb6c244",
        requiredFeature: ["notes", "notes-degraded"],
        toggleEvent: "globalEvent:key:N",
        hideEvents: ["globalEvent:toggle:bottom-left", "globalEvent:toggle:bottom-right", "globalEvent:toggle:top-right"],
        visibleSetting: "notesVisible"
    }, {
        widget: !0,
        placeholderType: "none",
        id: "settings",
        dependencies: ["settings_common"],
        addin: "1d872cf4-953a-4743-8f5e-6785bba4bd19",
        commands: ["settings.initialize", "settings.display"],
        elementId: "settings",
        class: "app-container settings",
        label: "Settings",
        appClass: "settings-app",
        region: "bottom-left",
        order: "prepend",
        width: 500,
        height: 400,
        toggleEvent: "globalEvent:key:L",
        closeOnEsc: "true"
    }, {
        addin: "D52F5584-5033-4A16-866F-E97C7D7AC826",
        id: "settings_backgrounds",
        dependencies: ["settings"],
        commands: ["background.custom.uploadfiles", "settings.panels.backgrounds"]
    }, {
        addin: "1e373fa7-a454-4652-8d77-1a4fcc88c069",
        id: "settings_balance",
        dependencies: ["settings"],
        commands: ["settings.panels.balance"]
    }, {
        addin: "e464eb61-05ca-4a56-9c17-6a02673aa136",
        id: "settings_bookmarks",
        dependencies: ["settings"],
        commands: ["settings.panels.bookmarks"]
    }, {
        addin: "9e4cdd4d-8e0d-4b36-a159-fab66de84970",
        id: "settings_common"
    }, {
        addin: "9b62165c-8b05-4f9b-82b3-b093f4e77dc9",
        dependencies: ["settings"],
        commands: ["settings.panels.general"],
        id: "settings_general"
    }, {
        addin: "dd91d97e-fc83-4fca-b5cb-d89eb2e1dd0f",
        id: "settings_mantras",
        dependencies: ["settings"],
        commands: ["settings.panels.mantras"]
    }, {
        addin: "dd106f35-669c-4079-a9e3-82ddc5244d0b",
        id: "settings_quotes",
        dependencies: ["settings"],
        commands: ["settings.panels.quotes"]
    }, {
        addin: "270aaed6-337f-433f-9d02-a471b435eada",
        id: "settings_todo",
        dependencies: ["settings"],
        commands: ["settings.panels.todo"]
    }, {
        addin: "c61b7775-7ab8-443a-a6b7-c8c8de6fc755",
        dependencies: ["settings"],
        id: "settings_trello",
        commands: ["settings.panels.trello.config"]
    }, {
        widget: !0,
        id: "team_links",
        dependencies: ["links_common"],
        class: "app-container links",
        appClass: "links-app",
        region: "top-left",
        order: "prepend",
        after: ".team-logo",
        placeholderType: "metric",
        addin: "a100de17-4975-4dfa-87b2-1576366a3d31",
        requiredFeature: "teamLinks",
        toggleEvent: "globalEvent:key:L",
        closeOnEsc: "true",
        visibleSetting: "linksVisible"
    }, {
        widget: !0,
        placeholderType: "pane",
        label: "Todo",
        id: "todo",
        "data-test": "todo",
        width: "320",
        region: "bottom-right",
        order: "append",
        addin: "6be10923-c6a7-4e5f-b85a-85e6159c3018",
        visibleSetting: "todoVisible",
        openState: "showTodoList",
        keepOpenSetting: "keepTodoState",
        toggleEvent: "globalEvent:key:T",
        appClass: "todo-app",
        storedHeight: "todo-pane-height",
        class: "todo",
        commands: ["settings.panels.todo"]
    }, {
        widget: !0,
        placeholderType: "metric",
        id: "weather",
        class: "app-container weather",
        region: "top-right",
        order: "prepend",
        addin: "d5f1661a-8698-4992-b191-d0833b124f6a",
        toggleEvent: "globalEvent:key:W",
        visibleSetting: "weatherVisible"
    }, {
        widget: !0,
        vue: !0,
        placeholderType: "dashIcon",
        id: "app_launcher",
        label: "Apps",
        requiredFeature: "app_launcher",
        addin: "40203927-6651-4c0f-bc82-b25a8fe83505",
        region: "top-left",
        order: "append",
        openState: "showApps",
        toggleEvent: "globalEvent:key:A",
        keepOpenSetting: "keepAppsState",
        emptyFlag: "appsEmpty",
        "flex-order": 2,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill-rule="nonzero"><path d="M3.825 3.191a.626.626 0 0 0-.625.625v7.5c0 .345.28.625.625.625h7.5c.345 0 .625-.28.625-.625v-7.5a.626.626 0 0 0-.625-.625h-7.5zm0-2.5h7.5c1.725 0 3.125 1.4 3.125 3.125v7.5c0 1.726-1.4 3.125-3.125 3.125h-7.5A3.126 3.126 0 0 1 .7 11.316v-7.5C.7 2.091 2.1.691 3.825.691z"/><path d="M1.95 6.941a1.25 1.25 0 1 1 0-2.5H13.2a1.25 1.25 0 0 1 0 2.5H1.95zM20.7 3.191a.626.626 0 0 0-.625.625v7.5c0 .345.28.625.625.625h7.5c.345 0 .625-.28.625-.625v-7.5a.626.626 0 0 0-.625-.625h-7.5zm0-2.5h7.5c1.725 0 3.125 1.4 3.125 3.125v7.5c0 1.726-1.4 3.125-3.125 3.125h-7.5a3.126 3.126 0 0 1-3.125-3.125v-7.5c0-1.725 1.4-3.125 3.125-3.125z"/><path d="M18.825 6.941a1.25 1.25 0 0 1 0-2.5h11.25a1.25 1.25 0 0 1 0 2.5h-11.25zM3.825 20.066a.626.626 0 0 0-.625.625v7.5c0 .345.28.625.625.625h7.5c.345 0 .625-.28.625-.625v-7.5a.626.626 0 0 0-.625-.625h-7.5zm0-2.5h7.5c1.725 0 3.125 1.4 3.125 3.125v7.5c0 1.726-1.4 3.125-3.125 3.125h-7.5A3.126 3.126 0 0 1 .7 28.191v-7.5c0-1.725 1.4-3.125 3.125-3.125z"/><path d="M1.95 23.816a1.25 1.25 0 0 1 0-2.5H13.2a1.25 1.25 0 0 1 0 2.5H1.95zM20.7 20.066a.626.626 0 0 0-.625.625v7.5c0 .345.28.625.625.625h7.5c.345 0 .625-.28.625-.625v-7.5a.626.626 0 0 0-.625-.625h-7.5zm0-2.5h7.5c1.725 0 3.125 1.4 3.125 3.125v7.5c0 1.726-1.4 3.125-3.125 3.125h-7.5a3.126 3.126 0 0 1-3.125-3.125v-7.5c0-1.725 1.4-3.125 3.125-3.125z"/><path d="M18.825 23.816a1.25 1.25 0 0 1 0-2.5h11.25a1.25 1.25 0 0 1 0 2.5h-11.25z"/></g></svg>'
    }, {
        widget: !0,
        waitFor: !0,
        vue: !0,
        placeholderType: "none",
        id: "background-info",
        addin: "cb39d5ca-eee1-4715-8fd1-62629ade4d59",
        autoLoad: !0
    }, {
        widget: !0,
        placeholderType: "none",
        id: "bookmarks",
        label: "Bookmarks",
        addin: "ace9b8b8-9ae4-4c58-b484-2b177d8830e2",
        autoLoad: !0,
        vue: !0,
        toggleEvent: "globalEvent:key:B",
        visibleSetting: "bookmarksVisible",
        commands: ["settings.enableBookmarks"]
    }, {
        widget: !0,
        vue: !0,
        placeholderType: "none",
        waitFor: !0,
        autoLoad: !0,
        id: "center-region",
        addin: "bdd415e2-b0b7-4cfa-a743-8ad041a99976"
    }, {
        widget: !0,
        vue: !0,
        placeholderType: "none",
        id: "colorPicker",
        addin: "4fc397cd-2ac1-4748-b528-23cdf5b2ee42",
        autoLoad: !1
    }, {
        id: "introduction",
        vue: !0,
        addin: "5965ea88-516a-41cb-a6dc-251a461d9075",
        widget: !0,
        placeholderType: "none",
        immediateLoad: !0,
        region: "full"
    }, {
        widget: !0,
        vue: !0,
        placeholderType: "none",
        id: "modal",
        addin: "5771dc5c-5496-4c0f-98cc-47938b40a1e0"
    }, {
        id: "quote",
        vue: !0,
        addin: "ae9f497d-f448-4f8e-9937-dada4a929b56",
        widget: !0,
        placeholderType: "none",
        autoLoad: !0,
        visibleSetting: "quoteVisible",
        region: "bottom",
        waitFor: !0
    }, {
        widget: !0,
        vue: !0,
        placeholderType: "none",
        id: "region-center-below",
        addin: "e0c8a9f8-d0b1-4cb0-b754-48cb02e21cfe",
        waitFor: !0,
        autoLoad: !0
    }, {
        widget: !0,
        vue: !0,
        waitFor: !0,
        autoLoad: !0,
        id: "search",
        class: "app-container search",
        region: "top-left",
        addin: "162b82d0-f285-427c-8209-924f44ef4d21",
        visibleSetting: "searchVisible"
    }, {
        widget: !0,
        vue: !0,
        placeholderType: "dashIcon",
        id: "topics",
        label: "Topics",
        requiredFeature: "topics",
        addin: "d13fc525-0d8d-4516-910b-063dc88cebd3",
        region: "top-left",
        order: "append",
        openState: "showTopics",
        toggleEvent: "globalEvent:key:P",
        keepOpenSetting: "keepTopicsState",
        emptyFlag: "topicsEmpty",
        "flex-order": 3,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g transform="translate(-1)" fill-rule="nonzero"><path d="M3.578 2.586a.299.299 0 0 0-.078.224v20.903a.28.28 0 0 0 .077.2.273.273 0 0 0 .173.087h2.976a.28.28 0 0 0 .197-.086c.052-.054.08-.127.077-.234V2.785a.28.28 0 0 0-.078-.2.273.273 0 0 0-.172-.085H3.767a.28.28 0 0 0-.19.086zM3.726 0h3.048A2.78 2.78 0 0 1 9.5 2.81v20.837A2.78 2.78 0 0 1 6.75 26.5H3.726a2.78 2.78 0 0 1-1.957-.86A2.76 2.76 0 0 1 1 23.68V2.835A2.78 2.78 0 0 1 3.726 0zM13.578 9.59c-.053.057-.081.132-.078.25v13.861a.29.29 0 0 0 .078.209.285.285 0 0 0 .172.09h2.968a.29.29 0 0 0 .204-.09c.053-.057.081-.132.078-.25V9.799a.29.29 0 0 0-.078-.209.285.285 0 0 0-.172-.09h-2.978a.29.29 0 0 0-.194.09zm.14-2.59h3.064a2.79 2.79 0 0 1 1.958.875c.51.54.784 1.263.76 1.965v13.779a2.79 2.79 0 0 1-.76 2.006c-.51.54-1.215.856-1.99.875h-3.032a2.79 2.79 0 0 1-1.958-.875A2.764 2.764 0 0 1 11 23.66V9.881a2.79 2.79 0 0 1 2.718-2.88zM31.473 22.6a2.84 2.84 0 0 1-.403 2.15 2.865 2.865 0 0 1-1.86 1.234l-2.976.482a2.76 2.76 0 0 1-2.07-.528 2.737 2.737 0 0 1-1.068-1.811L20.02 4.851a2.834 2.834 0 0 1 2.258-3.281l2.978-.536a2.75 2.75 0 0 1 3.131 2.357l3.086 19.208zM25.916 3.767c-.015-.112-.05-.173-.103-.213a.253.253 0 0 0-.151-.055l-2.92.526c-.177.035-.294.205-.258.407L25.57 23.77a.26.26 0 0 0 .1.174c.056.042.127.06.18.052l2.912-.471a.34.34 0 0 0 .217-.147c.05-.076.067-.169.037-.32l-3.1-19.29z"/><rect x="1.05" y="28.75" width="30.5" height="2.5" rx="1.25"/></g></svg>'
    }]
}), m.models.Command = Backbone.Model.extend({
    defaults: {
        id: null
    },
    getId: function() {
        return this.id
    },
    execute: function() {},
    canExecute: function() {
        return !0
    },
    beforeExecute: function() {}
}), m.CommandManager = m.collect.Manager.extend({
    model: m.models.Command,
    initialize: function() {
        var i = this;
        this.commandSources = new Backbone.Collection, m.commands && _.mapObject(m.commands, function(e) {
            i.registerCommandModel(e, !1)
        });
        for (var e = m.addinManager.getCommands(), t = 0; t < e.length; t++) this.registerCommandSource(e[t]);
        this.listenTo(m.addinManager, "addin:loaded", function(e) {
            var t = m.addinManager.getAddinCommands(e);
            t && _.mapObject(t, function(e) {
                i.registerCommandModel(e, !1)
            })
        })
    },
    registerCommandModel: function(e, t) {
        var i = new e;
        if (i && i.id) {
            if (t || !this.get(i.id)) {
                var n = this.get(i.id);
                n && this.remove(n), this.add(i)
            }
            this.trigger("command:loaded:" + i.id)
        }
    },
    registerCommandSources: function(e) {
        e && 0 < e.length && _.each(e, this.registerCommandSource, this)
    },
    registerCommandSource: function(e) {
        if (!e.id) throw new Error("An id property is required in cmdSrc");
        if (!e.addin) throw new Error("An addin property is required in cmdSrc");
        this.commandSources.findWhere({
            id: e.id
        }) || this.commandSources.add({
            id: e.id,
            addin: e.addin
        })
    },
    registerCommand: function(e, t, i, n) {
        var a = {
            defaults: {
                id: e
            },
            execute: t
        };
        i && (a.canExecute = i);
        var o = m.models.Command.extend(a);
        this.registerCommandModel(o, n)
    },
    getCommand: function(e) {
        return e ? this.get(e) : null
    },
    ensureCommandLoaded: function(t, i, n, a) {
        var o = this,
            s = this.get(t);
        if (s) i && i(s);
        else {
            if (n) try {
                n()
            } catch (e) {}
            var r = this.commandSources.get(t);
            if (r) {
                var e = r.get("addin");
                r.get("loading") || (r.set("loading", !0), this.listenToOnce(this, "command:loaded:" + t, function() {
                    r.set("loading", !1), r.set("loaded", !0), i && i()
                }), m.addinManager.ensureAddinLoaded(e, function() {}, n, function(e) {
                    r.set("loading", !1), a && a(e)
                }))
            } else url = m.globals.urlRootApi + "commands/" + encodeURIComponent(t), $.ajax({
                url: url,
                success: function(e) {
                    e && (o.registerCommandSource(e), (r = o.commandSources.get(t)) ? r.get("loading") || (r.set("loading", !0), m.addinManager.ensureAddinLoaded(r.get("addin"), function() {
                        r.set("loading", !1), r.set("loaded", !0), i && i(s)
                    }, n, function(e) {
                        r.set("loading", !1), a && a(e)
                    })) : a && a("no command with that id is registered"))
                },
                error: function() {
                    a && a("no command with that id is registered")
                }
            })
        }
    },
    execute: function(e) {
        var t = this.getCommand(e);
        if (t) return t.execute.apply(t, [].slice.call(arguments, 1))
    },
    executeAsync: function(n) {
        var a = this,
            o = [].slice.call(arguments, 1);
        return new Promise(function(t, i) {
            a.ensureCommandLoaded(n, function() {
                var e = a.getCommand(n);
                e ? t(e.execute.apply(e, o)) : i()
            })
        })
    },
    getCommandAsync: function(n) {
        var a = this;
        return new Promise(function(t, i) {
            a.ensureCommandLoaded(n, function() {
                var e = a.getCommand(n);
                e ? t(e) : i()
            })
        })
    },
    canExecute: function(e) {
        var t = this.getCommand(e);
        return !t || t.canExecute.apply(t, [].slice.call(arguments, 1))
    },
    beforeExecute: function(e) {
        var t = this.getCommand(e);
        if (t) return t.beforeExecute.apply(t, [].slice.call(arguments, 1))
    },
    getProperties: function(e) {
        var t = this.getCommand(e);
        return !t || !t.getProperties || t.getProperties.apply(t, [].slice.call(arguments, 1))
    }
}), m.models.CleanupManager = m.models.Manager.extend({
    initialize: function() {
        var e = this;
        this.frequencyDays = 10, this.load(), m.now() - this.cleanupInfo.lastCleanup > this.frequencyDays * m.utils.mConst("msPerDay") && this.listenTo(m, "appsReady", function() {
            setTimeout(function() {
                e.cleanup()
            }, 1e3)
        })
    },
    registerKey: function(e, t) {
        t && (this.cleanupInfo.cleanupOptions[e] = t), this.cleanupInfo.keys.indexOf(e) < 0 && this.cleanupInfo.keys.push(e), this.save()
    },
    registerKeyPrefix: function(e, t) {
        t && (this.cleanupInfo.cleanupOptions[e] = t), this.cleanupInfo.keyPrefixes.indexOf(e) < 0 && this.cleanupInfo.keyPrefixes.push(e), this.save()
    },
    cleanup: function() {
        var e, t, i, n = [],
            a = Object.keys(localStorage);
        for (e = 0; e < a.length; e++)
            if (i = a[e], 0 <= this.cleanupInfo.keys.indexOf(i)) n.push({
                key: i,
                options: this.cleanupInfo.cleanupOptions[i]
            });
            else
                for (t = 0; t < this.cleanupInfo.keyPrefixes.length; t++) {
                    var o = this.cleanupInfo.keyPrefixes[t],
                        s = this.cleanupInfo.cleanupOptions[o];
                    if (i.startsWith(o)) {
                        if (s && s.ignoreKeys && 0 <= s.ignoreKeys.indexOf(i)) break;
                        if (s && null != s.pastDaysToKeep) {
                            var r = this.parseLocalDate(i.substring(o.length)),
                                l = m.date();
                            r < new Date(l.getFullYear(), l.getMonth(), l.getDate() - s.pastDaysToKeep) && n.push({
                                key: i,
                                options: s
                            });
                            break
                        }
                        n.push({
                            key: i,
                            options: s
                        });
                        break
                    }
                }
        n.map(function(t) {
            t.options && t.options.callbackWidget ? m.widgetManager.getWidgetAsync(t.options.callbackWidget).then(function(e) {
                e[t.options.callbackMethod](t.key)
            }) : localStorage.removeItem(t.key)
        }), this.cleanupInfo.lastCleanup = m.now(), this.save()
    },
    save: function() {
        localStorage.setItem("cleanup-info", JSON.stringify(this.cleanupInfo))
    },
    load: function() {
        this.cleanupInfo = localStorage.getItem("cleanup-info"), this.cleanupInfo ? this.cleanupInfo = JSON.parse(this.cleanupInfo) : this.cleanupInfo = {
            keyPrefixes: [],
            keys: [],
            cleanupOptions: {},
            lastCleanup: 0
        }
    },
    parseLocalDate: function(e) {
        var t = e.split(/\D/);
        return new Date(t[0], t[1] - 1, t[2])
    }
}), m.models.ExperimentManager = m.models.Manager.extend({
    initialize: function() {
        this.experiments = {}, this.isFirefox = "Firefox" === m.utils.getBrowserName(), this.loadExperimentDefinitions(), this.enrollInExperiments()
    },
    loadExperimentDefinitions: function() {
        this.experiments = [{}]
    },
    enrollInExperimentByTitle: function(e, t) {
        return this.enrollInExperiment(this.getExperimentByTitle(e), t)
    },
    enrollInExperiment: function(e, t) {
        var i = "experiment-" + e.id,
            n = localStorage.getObject(i);
        if (n && e.assignOnce && n.correlationId) return e.assignedGroup = n, t && t(n), n;
        var a = 100 * Math.random();
        if (a > e.assignmentPercent) return null;
        var o = e.groups[0];
        if (this.isFirefox) return o = _.findWhere(e.groups, {
            isDefault: !0
        }), t && t(o), o;
        a = 100 * Math.random();
        var s = 0,
            r = 0;
        e.groups.forEach(function(e) {
            r += e.assignmentWeight
        });
        for (var l = 0; l < e.groups.length; l++) {
            var d = e.groups[l],
                c = s + 100 * d.assignmentWeight / r;
            if (a < (s = c)) {
                o = d;
                break
            }
        }
        return o.experimentId = e.id, e.assignedGroup = o, localStorage.getItem("userId") && (localStorage.setObject(i, o), this.enrollServerSide(e.id, o.id).then(function(e) {
            o.correlationId = e, localStorage.setObject(i, o), t && t(o)
        }).catch(function() {
            localStorage.removeItem(i)
        })), o
    },
    enrollServerSide: function(i, n) {
        if (localStorage.getItem("userId")) return new Promise(function(t, e) {
            $.ajax({
                type: "post",
                contentType: "application/json",
                url: m.globals.urlRootStats + "experiment/assign",
                data: JSON.stringify({
                    group_id: n,
                    experiment_id: i
                })
            }).then(function(e) {
                e.correlationId && t(e.correlationId)
            }).catch(function() {
                e()
            })
        })
    },
    enrollInExperiments: function() {
        var t = this;
        this.experiments.forEach(function(e) {
            e.autoAssign && t.enrollInExperiment(e)
        })
    },
    getExperimentByTitle: function(t) {
        return this.experiments.find(function(e) {
            return e.title === t
        })
    },
    getAssignedGroup: function(t) {
        var e = this.experiments.find(function(e) {
            return e.id === t
        });
        return e ? e.assignedGroup : null
    }
}), m.models.ThemeManager = Backbone.Model.extend({
    initialize: function() {},
    defaultFontFamily: '-apple-system, BlinkMacSystemFont, "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
    initializeThemes: function() {
        this.listenTo(m.models.customization, "change:themeColour", this.setThemeColour), this.listenTo(m.models.customization, "change:themeFont", this.setThemeFont), this.listenTo(m, "user:successfulLogin user:successfulLogout", this.onLoginEvent), this.listenTo(m, "background:loadSuccessful", this.backgroundChange), this.listenTo(m, "legacybackgrounds:ready", this.backgroundChange), this.loadAllThemeValues()
    },
    loadAllThemeValues: function() {
        this.loadThemeColour(), this.setThemeColour(), this.setThemeFont()
    },
    setColorValues: function(e, t) {
        this.colors = t, this.setThemeColour()
    },
    saveThemeColour: function() {
        if (this.colors) {
            var e = m.models.customization.get("themeColourCustom"),
                t = this.toRgbA(this.colors);
            if (e === t) return;
            m.models.customization.set("themeColourCustom", t)
        }
    },
    loadThemeColour: function() {
        try {
            if (m.models.customization.has("themeColourCustom")) {
                var e = m.models.customization.get("themeColourCustom");
                e && (this.colors = new Colors({
                    color: e
                }).colors)
            }
        } catch (e) {}
    },
    getThemeColour: function() {
        return this.colors
    },
    getThemeColourRGBA: function() {
        return this.colors ? this.toRgbA(this.colors) : null
    },
    backgroundChange: function() {
        var e = m.models.customization.get("themeColour");
        this.isPlus() && "photo" === e && this.setThemeColour(), $("body").hasClass("light") && "photo" !== e && this.setPhotoAccentButtonColor()
    },
    setThemeColour: function() {
        var e, t = $("body");
        switch (this.clearTheme(), this.clearButtonColor(), this.systemMediaQueryLight && this.systemMediaQueryLight.removeListener(this.systemMediaQueryListener), m.models.customization.get("themeColour")) {
            case "light":
                t.addClass("light"), e = this.setLight();
                break;
            case "dark":
                e = this.setDark();
                break;
            case "system":
                e = this.setSystem(), e += this.setSystemMediaQuery(t);
                break;
            case "photo":
                if (this.isPlus() && m.models.activeBackground) {
                    var i = m.models.activeBackground.getWidgetColor();
                    i ? e = this.setPhotoMatch(t, i) : (e = this.setSystem(), e += this.setSystemMediaQuery(t))
                }
                break;
            case "custom":
                if (this.isPlus() && this.colors) {
                    var n = .5 < this.colors.RGBLuminance,
                        a = this.dropdownPseudoOverlay(this.colors, n);
                    e = this.getCssForCustomColor(this.toRgbA(this.colors), a), t.toggleClass("light", n)
                }
        }
        this.setTheme(e)
    },
    toRgbA: function(e) {
        return "rgba(" + Math.round(255 * e.rgb.r) + "," + Math.round(255 * e.rgb.g) + "," + Math.round(255 * e.rgb.b) + "," + e.alpha + ")"
    },
    composite: function(e, t) {
        var i, n, a, o = t ? 0 : 1;
        return i = .8 * e.rgb.r + .2 * o, n = .8 * e.rgb.g + .2 * o, a = .8 * e.rgb.b + .2 * o, new Colors({
            color: "rgb(" + Math.round(255 * i) + "," + Math.round(255 * n) + "," + Math.round(255 * a) + ")"
        }).colors
    },
    getAvailableFonts: function() {
        return [{
            label: "Classic",
            value: "default"
        }, {
            label: "Modern",
            value: "modern"
        }, {
            label: "Startup",
            value: "startup",
            breakafter: !0
        }, {
            label: "Retro",
            value: "retro"
        }, {
            label: "Warehouse",
            value: "warehouse"
        }, {
            label: "Quirky",
            value: "quirky"
        }]
    },
    setThemeFont: function() {
        var t = this,
            i = m.models.customization.get("themeFont") || "default";
        if (m.conditionalFeatures.featureEnabled("plus")) {
            var n = this.defaultFontFamily;
            if (i && "default" != i) {
                var e = null,
                    a = localStorage.getItem("font-" + i);
                if (a) e = JSON.parse(a), n = this.setFontFromInfo(e) || this.defaultFontFamily, this.setActiveFont(n, i);
                else try {
                    $.ajax({
                        type: "GET",
                        url: m.globals.urlRootApi + "fonts/" + i
                    }).done(function(e) {
                        e && (localStorage.setItem("font-" + i, JSON.stringify(e)), n = t.setFontFromInfo(e) || t.defaultFontFamily)
                    }).always(function() {
                        t.setActiveFont(n, i)
                    })
                } catch (e) {}
            } else this.setActiveFont(n, i)
        } else this.setActiveFont(this.defaultFontFamily, i)
    },
    setFontFromInfo: function(e) {
        var t = null;
        if (e) {
            if (!e.builtin) {
                var i = $("head"),
                    n = i.find("#font-" + e.font).first();
                if (!n || 0 == n.length) {
                    var a = null;
                    e.fontInline ? (a = $('<style type="text/css"></style>')).html(e.fontInline) : e.fontUrl && (a = $('<link rel="stylesheet" type="text/css">')).attr("href", e.fontUrl), a && (a.attr("id", "font-" + e.font), i.append(a))
                }
            }
            t = e.exclude_default ? e.fontFamily : e.fontFamily + "," + this.defaultFontFamily
        }
        return t
    },
    setActiveFont: function(e, t) {
        var i = "body, input, select, textarea, button {font-family: " + e + "; !important}",
            n = document.createElement("style"),
            a = $(n);
        a.attr("type", "text/css"), document.head.appendChild(n), n.sheet.insertRule(i, 0), a.attr("id", "font-override");
        var o = $("body");
        _.each(this.getAvailableFonts(), function(e) {
            e.value === t ? o.addClass("f--" + e.value) : o.removeClass("f--" + e.value)
        }), $user = $(".user"), $user.hasClass("open") || $user.css("transform", "translateY(" + $("user-hidden").height() + "px)")
    },
    onLoginEvent: function() {
        this.listenToOnce(m, "sync:settings:complete", this.loadAllThemeValues)
    },
    setDark: function() {
        return ":root { --app-background: #0f0f0fec; }"
    },
    setLight: function() {
        var e = this.getCssForCustomColor("rgba(255,255,255,0.98)", "#ededed");
        return e += this.setPhotoAccentButtonColor()
    },
    setSystem: function() {
        return "@media (prefers-color-scheme: dark) { :root { --app-background: #0f0f0fec; }} @media (prefers-color-scheme: light) { :root { --app-background: rgba(255,255,255,0.98); }}"
    },
    setPhotoMatch: function(e, t) {
        var i = t.hsla,
            n = !1,
            a = new Colors({
                color: i
            }).colors;
        n = t.bodyTextColor ? !["#ffffff", "#fff"].includes(t.bodyTextColor) : .5 < a.RGBLuminance, e.toggleClass("light", n);
        var o = this.dropdownPseudoOverlay(a, n);
        return this.getCssForCustomColor(i, o)
    },
    getCssForCustomColor: function(e, t) {
        var i = ":root, .dropdown.dash-dropdown { --app-background: " + e + "; }";
        return i = (i = (i = (i = (i = i + ":root { --dropdown-bg: " + t + "; }") + ".nipple-bottom-left:after, .nipple-bottom-right:after, .notch-bottom { border-top-color: " + e + "; }") + ".nipple-top-left:after, .nipple-top-right:after, .bookmarks { border-bottom-color: " + e + "; }") + ".notch-left { border-right-color: " + e + " !important;}") + ".notch-right { border-left-color: " + e + " !important;}"
    },
    clearTheme: function() {
        $("body").removeClass("light"), this.$themeColourCustom && (this.$themeColourCustom.remove(), this.$themeColourCustom = null)
    },
    setTheme: function(e) {
        var t = $("head");
        t.append('<style type="text/css" id="themeColourCustom">' + e + "</style>"), this.$themeColourCustom = t.find("#themeColourCustom").first(), m.trigger("theme:set")
    },
    setSystemMediaQuery: function(e) {
        return this.systemMediaQueryLight = window.matchMedia("(prefers-color-scheme: light)"), this.systemMediaQueryLight.addListener(this.systemMediaQueryListener), this.systemMediaQueryLight.matches ? (e.addClass("light"), this.setLight()) : (e.removeClass("light"), this.setDark())
    },
    systemMediaQueryListener: function(e) {
        var t = m.models.themeManager;
        t.clearTheme();
        var i = $("body"),
            n = t.setSystem();
        e.matches ? (i.addClass("light"), n += t.setLight()) : (i.removeClass("light"), n += t.setDark()), t.setTheme(n)
    },
    isPlus: function() {
        return m.conditionalFeatures.featureEnabled("plus")
    },
    clearButtonColor: function() {
        this.$buttonColourCustom && (this.$buttonColourCustom.remove(), this.$buttonColourCustom = null)
    },
    setPhotoAccentButtonColor: function() {
        var e, t = $("head");
        if (this.clearButtonColor(), m.models.activeBackground) {
            var i = m.models.activeBackground.getWidgetColor();
            if (i) {
                var n = "#fff" === i.bodyTextColor || "#ffffff" === i.bodyTextColor ? "#fff" : "#222",
                    a = this.setOpacityOfHsla(i.hsla, "0.75");
                e = ".light .app .button { background:" + i.hsla + "; color:" + n + "}.light .app .button:not(.disabled):hover { background:" + a + ";}.light .settings-backgrounds .button-add-container:hover .fake-file-input { background:" + a + " !important; }"
            }
        }
        t.append('<style type="text/css" id="buttonColourCustom">' + e + "</style>"), this.$buttonColourCustom = t.find("#buttonColourCustom").first()
    },
    setOpacityOfHsla: function(e, t) {
        return e.replace(/(\d|\.)+(?=\))/, t)
    },
    dropdownPseudoOverlay: function(e, t) {
        return this.toRgbA(this.composite(e, t))
    }
}), m.models.SyncCoordinator = Backbone.Model.extend({
    initialize: function() {
        this.downloading = {}, this.retryAfterKey = "feed-retry-after", this.syncSettingsInProgress = !1, this.listenTo(m, "sync:download", this.doDownload), this.listenTo(m, "skip:download", this.doDownloadAfterSkip), this.listenTo(m, "user:successfulLogin", this.onUserLogin), this.listenTo(m, "user:successfulLogout", this.syncSettings), this.listenTo(m, "sync:downloadIfNeeded", this.doDownloadIfNeeded), this.listenTo(m.models.customization, "change", this.customizationChange), this.listenTo(m, "sync:customization", this.customizationChange), m.models.customization.get("etag") || this.customizationChange(), this.reportFeedItems()
    },
    onUserLogin: function(e) {
        localStorage.removeItem("ts_quotes"), localStorage.removeItem("ts_backgrounds"), localStorage.removeItem("ts_mantras"), this.doDownload(), this.syncSettings(e)
    },
    reportFeedItems: function() {
        var n = this;
        this.canCallServer() && ["quote", "mantra", "bg"].map(function(e) {
            var t = "report-" + e,
                i = localStorage.getItem(t);
            i && $.ajax({
                type: "post",
                contentType: "application/json",
                url: m.globals.urlRootApi + "feed/report",
                data: i
            }).done(function(e) {
                n.checkForBackOff(e.retryAfter), e.success && localStorage.removeItem(t)
            })
        })
    },
    checkForReportTasks: function(e, n) {
        e.map(function(e) {
            if (e.reportUsage) {
                var t = "report-" + n,
                    i = localStorage.getItem(t);
                (i = i ? JSON.parse(i) : []).push({
                    id: e._id,
                    type: n,
                    forDate: e.forDate
                }), localStorage.setItem(t, JSON.stringify(i))
            }
        })
    },
    canCallServer: function() {
        var e = localStorage.getItem(this.retryAfterKey);
        if (e) {
            if (m.date().getTime() < parseInt(e)) return !1;
            localStorage.removeItem(e)
        }
        return !0
    },
    checkForBackOff: function(e) {
        e && (e = parseInt(e), localStorage.setItem(this.retryAfterKey, m.date().getTime() + 1e3 * e))
    },
    doDownloadAfterSkip: function(e) {
        this.doDownload(e, !0)
    },
    doDownload: function(t, e) {
        if (this.canCallServer()) {
            var a = this;
            if (t) {
                if ("string" == typeof t) {
                    var i = {};
                    t.split(/[\s,;]+/).forEach(function(e) {
                        i[e] = !0
                    }), t = i
                }
                if (["quote", "background", "mantra"].map(function(e) {
                        a.downloading[e] && t[e] && delete t[e]
                    }), 0 === Object.keys(t).length) return
            }
            var n = m.collect.mantras.get("pinned");
            this.downloading = {};
            try {
                var o = this,
                    s = "";
                if (m.collect.backgrounds.get(m.utils.getDateString()) && (s += "b"), m.collect.quotes.get(m.utils.getDateString()) && (s += "q"), (m.collect.mantras.get(m.utils.getDateString()) || n) && (s += "m"), !localStorage.client_uuid) return;
                var r = m.globals.urlRootApi + "feed/bulk?syncTypes=";
                if (t) {
                    var l = [];
                    if (t.quote && m.models.customization.get("quoteVisible") && (l[l.length] = "quote", localStorage.removeItem(o.ddlQuoteString()), this.downloading.quote = !0), t.mantra && m.models.customization.get("mantraVisible") && !n && (l[l.length] = "mantra", localStorage.removeItem(o.ddlMantraString()), this.downloading.mantra = !0), t.background && (this.downloading.background = !0, l[l.length] = "background", localStorage.removeItem(o.ddlBackgroundString())), !(0 < l.length)) return;
                    r += l.join(",")
                } else this.downloading.background = !0, this.downloading.quote = !0, n || (this.downloading.mantra = !0), r += "all", localStorage.removeItem(o.ddlBackgroundString()), localStorage.removeItem(o.ddlQuoteString()), localStorage.removeItem(o.ddlMantraString());
                r = r + "&localDate=" + m.utils.getDateString(), 0 < s.length && (r += "&has=" + s);
                var d = m.models.activeBackground.activeBackgroundUuid();
                if (!d) {
                    var c = m.collect.legacyBackgrounds.getCurrentLocalBackground();
                    c && (d = c.backgroundUuid())
                }
                d && !e && (r = r + "&legacyBackground=" + d), $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: r
                }).done(function(t) {
                    a.downloading = {}, ["Quote", "Background", "Mantra"].map(function(e) {
                        t["useCurrent" + e] && localStorage.setItem(o["ddl" + e + "String"](), m.now())
                    }), t.quotes && (0 < t.quotes.length && (m.collect.quotes.reset(t.quotes), a.checkForReportTasks(t.quotes, "quote"), m.collect.quotes.invoke("save"), localStorage.shortquote && localStorage.removeItem("shortquote")), t.ts_quotes && localStorage.setItem("ts_quotes", JSON.stringify(t.ts_quotes)), localStorage.setItem(o.ddlQuoteString(), m.now())), t.mantras && 0 < t.mantras.length && (m.collect.mantras.reset(t.mantras), a.checkForReportTasks(t.mantras, "mantra"), m.collect.mantras.invoke("save"), localStorage.setItem(o.ddlMantraString(), Date.now()), t.ts_mantras && localStorage.setItem("ts_mantras", JSON.stringify(t.ts_mantras))), t.backgrounds && (0 < t.backgrounds.length && (m.collect.backgrounds.reset(t.backgrounds), a.checkForReportTasks(t.backgrounds, "bg"), m.collect.backgrounds.invoke("save"), localStorage.background && (localStorage.removeItem("background"), localStorage.removeItem("backgrounds"))), t.ts_backgrounds && localStorage.setItem("ts_backgrounds", JSON.stringify(t.ts_backgrounds)), localStorage.setItem(o.ddlBackgroundString(), m.now())), a.checkForBackOff(t.retryAfter), localStorage.setItem("firstSynchronized", m.now())
                }).fail(function(e) {
                    if (a.downloading = {}, 0 < e.status) {
                        503 === e.status && a.checkForBackOff(e.getResponseHeader("Retry-After"));
                        var t = m.models.backgroundManager.latestItemDate();
                        t && t > Date.parse(m.utils.getDateString()) && localStorage.setItem(o.ddlBackgroundString(), m.now());
                        var i = m.models.quoteManager.latestItemDate();
                        i && i > Date.parse(m.utils.getDateString()) && localStorage.setItem(o.ddlQuoteString(), m.now());
                        var n = m.models.mantraManager.latestItemDate();
                        n && n > Date.parse(m.utils.getDateString()) && localStorage.setItem(o.ddlMantraString(), Date.now())
                    } else m.trigger("sync:error")
                })
            } catch (e) {
                a.downloading = {}
            }
        }
    },
    doDownloadIfNeeded: function(e) {
        if (localStorage.client_uuid && !localStorage.getItem("registrationStatePending")) {
            var t = !1,
                i = !1,
                n = !1;
            if (e) {
                if (e.ts_backgrounds) {
                    var a = localStorage.getItem("ts_backgrounds");
                    a ? e.ts_backgrounds > JSON.parse(a) && (t = !0) : t = !0
                }
                if (e.ts_quotes) {
                    var o = localStorage.getItem("ts_quotes");
                    o ? e.ts_quotes > JSON.parse(o) && (i = !0) : i = !0
                }
                if (e.ts_mantras) {
                    var s = localStorage.getItem("ts_mantras");
                    s ? e.ts_mantras > JSON.parse(s) && (n = !0) : n = !0
                }
            }
            t || localStorage[this.ddlBackgroundString()] || (t = !0), i || localStorage[this.ddlQuoteString()] || (i = !0), n || localStorage[this.ddlMantraString()] || (n = !0), this.downloading.quote && (i = !1), this.downloading.background && (t = !1), this.downloading.mantra && (n = !1), m.models.customization.get("quoteVisible") || (i = !1), m.models.customization.get("mantraVisible") || (n = !1);
            var r = {};
            t && (r.background = !0), i && (r.quote = !0), n && (r.mantra = !0), 0 < Object.keys(r).length && this.doDownload(r)
        }
    },
    pingApi: function(e, t) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: m.globals.urlRootApi
        }).done(function() {
            e && e()
        }).fail(function() {
            t && t()
        })
    },
    ddlBackgroundString: function() {
        return "ddl-bg-" + m.utils.getDateString()
    },
    ddlQuoteString: function() {
        return "ddl-qt-" + m.utils.getDateString()
    },
    ddlMantraString: function() {
        return "ddl-mantra-" + m.utils.getDateString()
    },
    setSyncSettingsHeaders: function(e) {
        m.utils.setMomentumAuthHeader(e);
        var t = m.models.customization.get("etag");
        m.models.customization.get("displayname") || (t = m.utils.uuidv4()), t && e.setRequestHeader("X-Momentum-Settings-ETag", t)
    },
    customizationChange: function(e, t) {
        if (!(t && t.fromStorage || this.syncSettingsInProgress || m.models.customization.fetching) && localStorage.getItem("token") && m.conditionalFeatures.featureEnabled("serversettings")) {
            if (e) {
                var i = e.changedAttributes();
                if (1 === Object.keys(i).length && _.contains(Object.keys(i), "etag")) return
            } else if (m.models.customization.get("etag")) return;
            $.ajax({
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(m.models.customization.getPersistentSettings()),
                url: m.globals.urlRootApi + "settings"
            }).done(function(e) {
                e.etag && m.models.customization.save({
                    etag: e.etag
                })
            }).fail(function() {}).always(function() {})
        }
    },
    submitFeatureAccessRequest: function(e, t, i) {
        var n = {
            feature: e
        };
        $.ajax({
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(n),
            url: m.globals.urlRootApi + "user/featurerequest"
        }).done(function() {
            t && t()
        }).fail(function() {
            i && i()
        })
    },
    syncSettings: function(e) {
        if ((localStorage.getItem("client_uuid") || localStorage.getItem("token")) && !localStorage.getItem("registrationStatePending")) {
            this.syncSettingsInProgress = !0;
            var t = this;
            $.ajax({
                type: "GET",
                contentType: "application/json",
                beforeSend: this.setSyncSettingsHeaders,
                url: m.globals.urlRootApi + "settings"
            }).done(function(e) {
                t.loadSettings(e)
            }).fail(function() {}).always(function() {
                t.syncSettingsInProgress = !1, m.trigger("sync:settings:complete"), e && e()
            })
        }
    },
    loadSettings: function(e) {
        if (e) {
            if (e.user_id && localStorage.setItem("userId", e.user_id.toLowerCase()), e.token_invalid) return e.token_invalid_reason ? m.commandManager.execute("logout", e, !0) : m.commandManager.execute("logout", null, !0), void(logout = !0);
            if (e.greetings && (localStorage.greetings = e.greetings), e.customization) {
                var t = m.models.customization.get("displayname");
                m.models.customization.save(e.customization), t && 0 != t.length || setTimeout(function() {
                    m.trigger("globalEvent:forceDisplayName")
                }, 25)
            }
            if (e.features && m.conditionalFeatures.setFeatures(e.features, !0), e.team && m.models.teamInfo.save("team", e.team), m.commandManager.execute("addins.load", e.addIns), m.commandManager.registerCommandSources(e.cmd), e.nav, e.download && m.trigger("sync:download", e.download), e.ts_notifications && m.trigger("notifications:timestamp", e.ts_notifications), e.ts_onboarding && "Firefox" !== m.utils.getBrowserName()) {
                var i = parseInt(e.ts_onboarding),
                    n = localStorage.getItem("ts_onboarding");
                (!(n = (n = n && parseInt(n)) || 0) || n < i) && (m.delayOnboardingForIntro || m.widgetManager.loadWidget("modal"), m.onboardingEnabled = !0)
            }
            var a = null;
            e.ts_backgrounds && ((a = a || {}).ts_backgrounds = e.ts_backgrounds), e.ts_quotes && ((a = a || {}).ts_quotes = e.ts_quotes), e.mantras && ((a = a || {}).ts_mantras = e.ts_mantras), a && m.trigger("sync:downloadIfNeeded", a), m.trigger("sync:settings", e)
        }
    }
}), m.collect.Feed = Backbone.Collection.extend({
    initialize: function(e, t) {
        this.model = e, this.itemType = t, this.localStorage = new Backbone.LocalStorage("momentum-" + t)
    },
    getActiveItem: function() {
        if (0 < this.length) {
            var e = m.utils.getDateString();
            return this.get(e)
        }
    },
    empty: function() {
        return 0 === this.models.length
    }
}), m.models.FeedManager = Backbone.Model.extend({
    initialize: function(e, t) {
        this.itemType = t, m.collect[t + "s"] = this.itemCollection = new m.collect.Feed(e, t)
    },
    firstFetch: function() {
        this.itemCollection.fetch({
            reset: !0
        })
    },
    getActiveItem: function() {
        var e = this;
        if (!this.itemCollection) return null;
        var t = this.itemCollection.getActiveItem();
        return t ? (this.currentItem && this.equals(this.currentItem, t) || (this.currentItem = t, setTimeout(function() {
            m.trigger(e.itemType + ":active_changed", e.currentItem.get("_id"))
        }, 50)), t) : null
    },
    equals: function(e, t) {
        var i = {},
            n = {};
        return Object.assign(i, e.attributes), Object.assign(n, t.attributes), delete i.forDate, delete n.forDate, JSON.stringify(i) === JSON.stringify(n)
    },
    skipItem: function(e) {
        e = !!e;
        var a = this,
            t = this.getActiveItem(),
            i = t.get("_id") || t.get("id"),
            o = m.globals.urlRootApi + this.itemType + "s/" + i + "/skip",
            s = {
                is_custom: t.get("is_custom"),
                hard: e
            };
        return new Promise(function(i, t) {
            try {
                if (!(m.isLoggedIn() && m.conditionalFeatures.featureEnabled("plus") || e)) throw "showSkipUpsell";
                $.ajax({
                    type: "PATCH",
                    contentType: "application/json",
                    data: JSON.stringify(s),
                    url: o
                }).done(function(e) {
                    if (e && e.success && m.trigger("skip:download", a.itemType), e && e.notification) {
                        if ("max_skips" === e.notification.type || 0 === e.notification.message.indexOf("Skip ")) {
                            var t = "max" + m.utils.capitalizeFirstLetter(a.itemType) + "Skips";
                            if (localStorage.getItem(t)) return;
                            localStorage.setItem(t, !0), e.notification.display_time || (e.notification.display_time = 5e3), e.notification.viewLimit || (e.notification.viewLimit = 1)
                        }
                        m.commandManager.execute("notification.show.enhanced", e.notification)
                    }
                    i(e)
                }).fail(function() {
                    m.commandManager.execute("notification.show.enhanced", a.skipErrorMessage()), t()
                })
            } catch (e) {
                if ("showSkipUpsell" == e) {
                    if ("mantra" == a.itemType) {
                        var n = {
                            cta_text: "Learn more",
                            cta_cmd: "upsell.upgrade",
                            title: "Skip Mantra",
                            message: "Upgrade to skip through mantras and add your own mantras."
                        };
                        m.commandManager.execute("notification.show.enhanced", n)
                    }
                } else m.commandManager.execute("notification.show.enhanced", a.skipErrorMessage());
                t()
            }
        })
    },
    toggleFavorite: function(e, t) {
        var n = this,
            i = t || this.getActiveItem(),
            a = i.get("_id") || i.get("id"),
            o = m.globals.urlRootApi + this.itemType + "s/" + a + "/favorite",
            s = {
                is_favorite: e,
                is_custom: i.get("is_custom")
            };
        return new Promise(function(t, i) {
            try {
                $.ajax({
                    type: "PATCH",
                    contentType: "application/json",
                    data: JSON.stringify(s),
                    url: o
                }).done(function(e) {
                    e && e.success && (m.trigger("sync:download", n.itemType), m.trigger(n.itemType + ":favorite", {
                        id: a,
                        is_favorite: s.is_favorite
                    })), t(e)
                }).fail(function(e) {
                    m.commandManager.execute("notification.show.enhanced", n.favouriteErrorMessage), i(e)
                })
            } catch (e) {
                m.commandManager.execute("notification.show.enhanced", n.favouriteErrorMessage), i(e)
            }
        })
    },
    latestItemDate: function() {
        var i = null;
        return this.itemCollection.models.forEach(function(e) {
            var t = Date.parse(e.id);
            (!i || i < t) && (i = t)
        }), i
    },
    skipErrorMessage: function() {
        return {
            message: "Oops! We weren't able to get a new " + this.itemType + ". Please check your connection and try again.",
            viewLimit: 1
        }
    },
    favouriteErrorMessage: {
        message: "Oops! We weren't able to save the favorite. Please check your connection and try again.",
        viewLimit: 1
    },
    registerErrorMessage: {
        message: "Please log in or register to enable skipping.",
        display_time: 2500
    }
}), m.models.ConditionalFeatures = Backbone.Model.extend({
    defaults: {
        featureList: []
    },
    initialize: function(e) {
        this.customization = e.customization || m.models.customization;
        try {
            localStorage.f3t6b23d && (this.set({
                featureList: JSON.parse(atob(localStorage.f3t6b23d))
            }), this.checkUnregisteredFlag())
        } catch (e) {
            console.error(e), this.set({
                featureList: []
            })
        }
    },
    featureEnabled: function(e) {
        if ("offlineDataOnly" === e && !m.isLoggedIn()) return !0;
        var t = !0;
        return "!" === e[0] && (e = e.substr(1), t = !1), t === _.contains(this.get("featureList"), e)
    },
    setFeatures: function(e) {
        localStorage.f3t6b23d = e, this.set("featureList", JSON.parse(atob(e))), this.checkUnregisteredFlag(), window.Cypress && $("body").attr("data-test-ready-for-tests", ""), m.trigger("feature:changed")
    },
    checkUnregisteredFlag: function() {
        var e = this.get("featureList");
        e.length && !_.contains(e, "nosync") && localStorage.removeItem("unregistered")
    },
    clearFeatures: function() {
        this.set({
            featureList: []
        }), localStorage.removeItem("f3t6b23d")
    },
    checkFeatureAndMigrateData: function(e, t, i, n, a, o) {
        var s = null,
            r = this;
        if (this.featureEnabled(e)) {
            for (var l = !1, d = 0; d < localStorage.length; d++)
                if (keyName = localStorage.key(d), 0 === keyName.indexOf(i + "-")) {
                    l = !0;
                    break
                } if (l) try {
                var c = m.date(),
                    u = c.getFullYear().toString() + "-" + m.utils.twoDigit(c.getMonth() + 1) + "-" + m.utils.twoDigit(c.getDate()) + "-" + m.utils.twoDigit(c.getHours()) + ":" + m.utils.twoDigit(c.getMinutes()) + ":" + m.utils.twoDigit(c.getSeconds()),
                    g = "migrated-" + i + "-" + u,
                    h = [],
                    f = [];
                for (d = 0; d < localStorage.length; d++)
                    if (keyName = localStorage.key(d), 0 === keyName.indexOf(i + "-")) {
                        f.push(keyName);
                        var p = localStorage.getItem(keyName);
                        if (p) {
                            var v = JSON.parse(p);
                            v.id || (v.id = v.csid), h.push(v)
                        }
                    } var b = {
                        items: h
                    },
                    y = JSON.stringify(b);
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    data: y,
                    url: m.globals.urlRootApi + "migrate/" + i
                }).done(function() {
                    for (var e in localStorage.setItem(g, y), f) localStorage.removeItem(f[e]);
                    localStorage.removeItem(i), m.trigger("sync:customization"), t && !r.customization.getComputedSetting(t) || n()
                }).fail(function() {
                    t && !r.customization.getComputedSetting(t) || a()
                })
            } catch (e) {
                console.error(e)
            } else s = n
        } else s = a;
        s && (!t || this.customization.getComputedSetting(t) ? s() : o ? o(s) : this.setPreferenceChangeListener(t, s))
    },
    setPreferenceChangeListener: function(e, t) {
        var i = this;
        m.listenToOnce(this.customization, "change:" + e, function() {
            i.customization.getComputedSetting(e) ? t() : i.setPreferenceChangeListener(e, t)
        })
    },
    checkPreferenceForRender: function(e, t, i) {
        t && (!e || this.customization.getComputedSetting(e) ? t() : i && i(t))
    }
}), m.models.Widget = Backbone.Model.extend({
    shouldShowPane: function() {
        var e = !0;
        if (this.has("keepOpenSetting") && (e = m.models.customization.get(this.get("keepOpenSetting"))), this.has("openState")) {
            var t = localStorage[this.get("openState")];
            if (t) return JSON.parse(t) && e
        }
        return !1
    }
}), m.collect.Widgets = Backbone.Collection.extend({
    model: m.models.Widget
}), m.views.BasePlaceholder = Backbone.View.extend({
    initialize: function() {
        this.render()
    },
    render: function() {
        var e = this.model.get("region"),
            t = (this.model.get("order") || "append") + "To";
        return this.$el[t]("." + e).mFadeIn().html(this.template(model.toJSON())), this
    },
    attributes: function() {
        return {
            id: this.model.get("elementId") || this.model.get("id"),
            class: this.model.get("class")
        }
    },
    detach: function() {
        this.unbind(), this.stopListening(), this.undelegateEvents()
    }
}), m.views.PanePlaceholder = m.views.BasePlaceholder.extend({
    template: m.templates.widgetmanager.pane,
    open: !1,
    events: {
        "click .toggle": "toggleShow"
    },
    initialize: function() {
        var t = this;
        this.open = !1, this.region = this.model.get("region"), this.openStateKey = this.model.get("openState"), this.render(), this.model.get("toggleEvent") && this.listenTo(m, this.model.get("toggleEvent"), this.toggleShow), this.model.get("hideEvents") && _.each(this.model.get("hideEvents"), function(e) {
            t.listenTo(m, e, t.onHideEvent)
        });
        var e = this.model.get("visibleSetting");
        e && this.listenTo(m.models.customization, "change:" + e, this.visibleChanged), this.model.shouldShowPane() && this.showPane()
    },
    attributes: function() {
        return {
            id: this.model.get("id"),
            class: "app-container " + this.model.get("id"),
            "data-test": this.model.get("data-test")
        }
    },
    render: function() {
        var e = this.model.get("label"),
            t = (this.model.get("order") || "append") + "To";
        if (!this.renderedOnce) {
            var i = this.model.get("width") + "px",
                n = "70px";
            if (this.model.has("height")) n = this.model.get("height") + "px";
            else {
                var a = this.storedPaneHeight();
                a && (n = a + "px")
            }
            this.$el.html(this.template({
                label: e,
                appClass: this.model.get("appClass") || "",
                isTodo: "todo" === this.model.get("id"),
                height: n,
                width: i
            })), this.$app = this.$(".app"), this.$dash = this.$(".app-dash"), this.$el.addClass(this.model.get("class") || ""), 0 === this.region.indexOf("top") && (this.$dash.remove(), s && s.length ? s.after(this.$el) : this.$el.prepend(this.$dash)), this.$(".app-wrapper").addClass("nipple-" + this.region);
            var o = this.model.get("after"),
                s = o && $(o),
                r = this;
            setTimeout(function() {
                s && s.length ? s.after(r.$el) : r.$el[t]("." + r.region), r.$el.mFadeIn(), r.renderedOnce = !0
            })
        }
        return this
    },
    storedPaneHeight: function() {
        if (this.model.has("storedHeight")) {
            var e = this.model.get("storedHeight"),
                t = localStorage[e];
            if (t) return JSON.parse(t)
        }
        return null
    },
    toggleShow: function(e) {
        if (this.realView && this.realView.toggleHandler) return this.open = this.realView.toggleHandler(e), !0;
        e && e.stopPropagation && e.stopPropagation(), e && e.preventDefault && e.preventDefault(), this.open ? this.hidePane() : this.showPane()
    },
    showPane: function() {
        if (!this.open) {
            if (m.sendEvent(m.utils.capitalizeFirstLetter(this.$el[0].id), "Show"), this.open = !0, localStorage.setItem(this.openStateKey, this.open), this.$el.addClass("show").width(), this.$el.addClass("show-fade-in"), this.realView) this.realView.onShowPane && this.realView.onShowPane();
            else {
                if (this.loading) return;
                if (!this.model.has("addin")) return;
                this.loading = !0, m.addinManager.ensureAddinLoaded(this.model.get("addin"))
            }
            m.trigger("globalEvent:toggle:" + this.region, this), m.trigger("globalEvent:toggle", this), this.triggerLoaded()
        }
    },
    hidePane: function() {
        var e = this;
        this.open && (this.open = !1, localStorage.setItem(this.openStateKey, this.open), this.$el.removeClass("show-fade-in"), setTimeout(function() {
            e.$el.hasClass("show-fade-in") || e.$el.removeClass("show")
        }, 300), this.realView && this.realView.onHidePane && this.realView.onHidePane())
    },
    triggerLoaded: function() {
        this.loadTriggered || (m.widgetManager.appReady(this.model.get("id")), this.loadTriggered = !0)
    },
    addRealView: function(e) {
        this.realView = e, this.open && this.realView.onShowPane && this.realView.onShowPane()
    },
    onHideEvent: function(e) {
        e != this && this.hidePane()
    },
    visibleChanged: function() {
        var e = this.model.get("visibleSetting"),
            t = m.models.customization.getComputedSetting(e),
            i = this;
        t ? this.renderedOnce ? (this.$el.addClass("app-container"), setTimeout(function() {
            i.$el.mFadeIn()
        }, 1)) : this.render() : (this.realView && this.realView.tearDown && this.realView.tearDown(), setTimeout(function() {
            i.$el.mFadeOut(null, null, function() {
                i.$el.removeClass("app-container")
            })
        }, 1))
    }
}), m.views.MetricPlaceholder = m.views.BasePlaceholder.extend({
    template: m.templates.widgetmanager.metric,
    initialize: function() {
        var e = this;
        this.render(), setTimeout(function() {
            m.addinManager.ensureAddinLoaded(e.model.get("addin"))
        }, 25), this.model.get("toggleEvent") && this.listenTo(m, this.model.get("toggleEvent"), this.toggleShow)
    },
    render: function() {
        if (!this.renderedOnce) {
            this.renderedOnce = !0;
            var e = {},
                t = this.model.get("cachedKey");
            t && (e = JSON.parse(localStorage.getItem(t)));
            var i = this.model.get("after"),
                n = i && $(i),
                a = this.model.get("region"),
                o = (this.model.get("order") || "append") + "To";
            n && n.length ? n.after(this.$el) : a && this.$el[o]("." + a), this.$el.html(this.template(e)), m.appsLoaded && this.$el.mFadeIn()
        }
        return this
    },
    toggleShow: function(e) {
        if (this.realView && this.realView.toggleHandler) return this.open = this.realView.toggleHandler(e), !0
    },
    addRealView: function(e) {
        this.realView = e
    }
}), m.views.DashIconPlaceholder = m.views.BasePlaceholder.extend({
    template: m.templates.widgetmanager.dashIcon,
    open: !1,
    events: {
        "click .app-dash": "toggleShow"
    },
    initialize: function() {
        var e = m.models.customization.get("appRegionOverrides");
        this.region = e[this.model.get("id")] || this.model.get("region"), this.openStateKey = this.model.get("openState"), this.render(), this.model.get("toggleEvent") && this.listenTo(m, this.model.get("toggleEvent"), this.toggleShow);
        var t = this.model.get("visibleSetting");
        t && this.listenTo(m.models.customization, "change:" + t, this.visibleChanged), this.model.get("toggleEvent") && this.listenTo(m, this.model.get("toggleEvent"), this.toggleShow), this.model.shouldShowPane() && this.showPane()
    },
    attributes: function() {
        return {
            id: this.model.get("id"),
            class: "app-container " + this.model.get("id")
        }
    },
    render: function() {
        var e, t, i = (this.model.get("order") || "append") + "To";
        if (!this.renderedOnce) {
            this.$el.html(this.template({
                label: this.model.get("label"),
                appClass: this.model.get("appClass") || ""
            }));
            var n = this.model.get("flex-order");
            n && this.$el.css("order", n), this.$app = this.$(".app"), this.$dash = this.$(".app-dash");
            var a = this.model.get("icon");
            if (a) {
                var o = (e = a, (t = document.createElement("div")).innerHTML = e.trim(), t.firstChild);
                this.$dash.prepend(o)
            }
            this.$el.addClass(this.model.get("class") || ""), 0 === this.region.indexOf("top") && (this.$dash.remove(), this.$el.prepend(this.$dash));
            var s = this;
            setTimeout(function() {
                s.$el[i]("." + s.region).mFadeIn(), s.renderedOnce = !0
            })
        }
        return this
    },
    toggleShow: function(e) {
        if (this.realView && this.realView.toggleHandler) return this.open = this.realView.toggleHandler(e), !0;
        e && e.preventDefault && e.preventDefault(), this.showPane()
    },
    showPane: function() {
        if (!this.open) {
            if (this.open = !0, localStorage.setItem(this.openStateKey, this.open), this.realView) this.realView.onShowPane && this.realView.onShowPane();
            else {
                if (this.loading) return;
                if (!this.model.has("addin")) return;
                this.loading = !0, m.addinManager.ensureAddinLoaded(this.model.get("addin"))
            }
            m.trigger("globalEvent:toggle:" + this.region, this), m.trigger("globalEvent:toggle", this), this.triggerLoaded()
        }
    },
    triggerLoaded: function() {
        this.loadTriggered || (m.widgetManager.appReady(this.model.get("id")), this.loadTriggered = !0)
    },
    addRealView: function(e) {
        this.realView = e, this.open && this.realView.onShowPane && this.realView.onShowPane()
    },
    visibleChanged: function() {
        var e = this.model.get("visibleSetting"),
            t = m.models.customization.getComputedSetting(e),
            i = this;
        t ? this.renderedOnce ? setTimeout(function() {
            i.$el.mFadeIn()
        }, 1) : this.render() : (this.realView && this.realView.tearDown && this.realView.tearDown(), setTimeout(function() {
            i.$el.mFadeOut()
        }, 1))
    }
}), m.models.WidgetManager = m.models.Manager.extend({
    skippedWidgets: [],
    topCenterHasContent: !1,
    initialize: function() {
        this.regions = {}, this.regions.logo = {
            widgets: [],
            overlappingRegion: "teamlinks"
        }, this.regions["top-left"] = {
            widgets: [{
                el: "links-app",
                view: "teamlinks"
            }],
            overlappingRegion: "bottom-left"
        }, this.regions["top-right"] = {
            widgets: [{
                el: "app-metric",
                view: "metric"
            }, {
                el: "weather-app",
                view: "weather"
            }],
            overlappingRegion: "bottom-right"
        }, this.regions["bottom-right"] = {
            widgets: [{
                el: "todo-app",
                view: "todoPane"
            }, {
                el: "notes-app",
                view: "notes"
            }],
            overlappingRegion: "top-right"
        }, this.regions.bottom = {
            widgets: [{
                el: "quote",
                view: "quote"
            }],
            overlappingRegion: "top-right"
        }, this.waitingFor = ["background"], m.console.log(m.elapsed() + ": initialized widgetManager")
    },
    setupWhenReady: function() {
        var e = this;
        m.models.customization.initialized ? e.setup() : this.listenToOnce(m.models.customization, "initialized", function() {
            e.setup()
        })
    },
    setup: function() {
        this.widgets && this.widgets.each(function(e) {
            e.placeholder && e.placeholder.remove()
        }), this.widgets = m.collect.widgets = new m.collect.Widgets, this.listenTo(this.widgets, "add", this.onAdd), this.listenTo(m, "readyForWidgets", this.onSuccessfulLogin), this.listenTo(m, "feature:changed", this.onSuccessfulLogin), this.populateWidgets()
    },
    checkWidgetTimeout: function() {
        if (!m.appsReady) {
            var e = m.elapsed(),
                t = this;
            if (e < 1500) setTimeout(function() {
                t.checkWidgetTimeout()
            }, 1500 - e);
            else if (this.firstShow(!0), 0 < this.waitingFor.length && "background" !== this.waitingFor[0]) {
                var i = this.waitingFor.toString();
                setTimeout(function() {
                    try {
                        m.usage.saveError({
                            errorType: "widgetTimeout",
                            errorMessage: "Waiting for " + i + " \n" + m.log
                        })
                    } catch (e) {}
                }, 2e3)
            }
        }
    },
    populateWidgets: function() {
        m.console.log(m.elapsed() + ": populating widgets");
        var t = this;
        _.forEach(m.addinManager.getWidgets(), function(e) {
            t.widgets.add(e)
        })
    },
    onAdd: function(e) {
        this.addWidget(e)
    },
    onSuccessfulLogin: function() {
        var t = this,
            e = this.skippedWidgets;
        this.skippedWidgets = [], _.each(e, function(e) {
            t.addWidget(e)
        })
    },
    addWidget: function(t, e) {
        var i = this;
        if (e = e || !1, m.readyForWidgets || t.get("immediateLoad")) {
            var n = !1;
            if (t.has("requiredFeature")) {
                var a = t.get("requiredFeature");
                Array.isArray(a) || (a = [a]);
                for (var o = 0; o < a.length; o++) {
                    var s = a[o];
                    if (m.conditionalFeatures.featureEnabled(s)) {
                        n = !0;
                        break
                    }
                }
                if (!n) return void this.skippedWidgets.push(t)
            }
            var r = m.models.teamInfo.get("team");
            if (!t.has("emptyFlag") || !r || r.userIsAdmin || !r[t.get("emptyFlag")]) {
                if (!e && t.has("visibleSetting")) {
                    var l = t.get("visibleSetting");
                    if (!m.models.customization.getComputedSetting(l)) return void this.listenToOnce(m.models.customization, "change:" + l, function() {
                        var e = !!m.models.customization.getComputedSetting(l);
                        i.addWidget(t, e)
                    })
                }
                if ("metric" === t.get("placeholderType") ? (t.placeholder = new m.views.MetricPlaceholder({
                        model: t
                    }), this.waitFor(t)) : "pane" === t.get("placeholderType") ? (t.shouldShowPane() && this.waitFor(t), t.placeholder = new m.views.PanePlaceholder({
                        model: t
                    })) : "dashIcon" === t.get("placeholderType") ? (t.shouldShowPane() && this.waitFor(t), t.placeholder = new m.views.DashIconPlaceholder({
                        model: t
                    })) : (t.get("autoLoad") || t.shouldShowPane()) && (t.get("waitFor") && this.waitFor(t), m.addinManager.ensureAddinLoaded(t.get("addin"))), !this.topCenterHasContent) "top-center" === (m.models.customization.get("appRegionOverrides")[t.get("id")] || t.get("region")) && (this.topCenterHasContent = !0, $(".top-row").addClass("has-center"))
            }
        } else this.skippedWidgets.push(t)
    },
    waitFor: function(e) {
        this.waitingFor.push(e.id)
    },
    loadWidget: function(e) {
        var n = this.widgets.find({
            id: e
        });
        if (n) return new Promise(function(t, i) {
            m.addinManager.ensureAddinLoaded(n.get("addin"), function(e) {
                t(e)
            }, null, function(e) {
                i(e)
            })
        })
    },
    getWidget: function(e) {
        return this.widgets.find({
            id: e
        }).realview
    },
    getWidgetAsync: function(i) {
        var n = this;
        return new Promise(function(e) {
            var t = n.widgets.find({
                id: i
            });
            t.realview ? e(t.realview) : n.loadWidget(i).then(function() {
                e(t.realview)
            })
        })
    },
    registerWidget: function(e, t) {
        this.widgets.add({
            id: e
        }, {
            silent: !0
        }), this.widgets.find({
            id: e
        }).realview = t
    },
    handover: function(e, t, i) {
        i = i || {};
        var n = this.widgets.find({
            id: e
        });
        if (n) {
            var a = n.placeholder;
            if (a) {
                var o = n.get("placeholderType");
                "pane" === o ? i.el = a.$app : "metric" === o ? i.el = a.el : "dashIcon" === o && (i.el = a.el)
            }
            var s, r = this;
            if (t) return s = new t(i), n.realview = s, n.shouldRender && s.render(), r.updatePlaceHolder(n.placeholder, s, i.el), s;
            i.bootstrap && (n.bootstrap = i.bootstrap, n.bootstrap && m.readyForWidgets && n.bootstrap(i.el, function(e) {
                n.realview = e, n.shouldRender && e.render(), r.updatePlaceHolder(n.placeholder, e, i.el)
            }))
        }
    },
    updatePlaceHolder: function(e, t, i) {
        $(i && i[0]).closest(".app-placeholder").removeClass("app-placeholder"), e && e.addRealView(t)
    },
    refocusOverlap: function(e) {
        $("." + this.regions[e].overlappingRegion).removeClass("unfocus")
    },
    unfocusOverlap: function(r, l) {
        var d = this;
        setTimeout(function() {
            var e = d.regions[r].overlappingRegion,
                t = d.regions[e],
                i = $("." + e);
            if (l) {
                var a = [];
                t.widgets.forEach(function(e) {
                    var t = 0,
                        i = m.views[e.view];
                    if (!i && window.addin && (i = addin.views[e.view]), i && i.getCurrentHeight) t = i.getCurrentHeight();
                    else {
                        var n = $("." + e.el);
                        t = 0 < n.length && n.is(":visible") ? n.height() : 0
                    }
                    a.push(t)
                });
                var n = $("." + r).height() + i.height() + Math.max.apply(null, a),
                    o = $(".bookmarks-wrapper"),
                    s = 0;
                o.css("transform") && (s = parseInt(o.css("height")) - parseInt(o.css("transform").split(",")[5])), $("body").height() - (n + s + 4) < l && i.addClass("unfocus")
            } else i.addClass("unfocus")
        }, 1)
    },
    hideAppsExcept: function(e, t) {
        var i = $(".app-container"),
            n = $(".apps");
        this.timeout && clearTimeout(this.timeout), i.each(function() {
            $(this).css({
                opacity: ""
            })
        });
        var a = $(e);
        a.length && a.each(function() {
            $(this).addClass("show-anyway")
        }), n.addClass("hide-apps"), t ? (n.addClass("hide-apps-visibility"), this.appsHidden = !0) : this.timeout = setTimeout(function() {
            n.addClass("hide-apps-visibility")
        }, 550)
    },
    showApps: function(e) {
        if (e || this.backgroundIsReady) {
            this.timeout && clearTimeout(this.timeout);
            var t = $(".apps");
            e && (t.addClass("u--no-transition"), t.removeClass("show-apps"), setTimeout(function() {
                t.removeClass("u--no-transition"), t.addClass("show-apps")
            }, 10)), t.removeClass("hide-apps hide-apps-visibility");
            var i = $(".apps .show-anyway");
            i.length && i.each(function() {
                $(this).removeClass("show-anyway")
            })
        }
    },
    appReady: function(e) {
        m.console.log(m.elapsed() + ": " + e + " is ready"), this[e + "IsReady"] = !0;
        var t = this.waitingFor.indexOf(e);
        0 <= t && (this.waitingFor.splice(t, 1), this.firstShow())
    },
    firstShow: function(e) {
        var t = this;
        m.appsReady || 0 !== this.waitingFor.length && m.readyForWidgets && !e || (document.getElementById("main-view").style.display = "block", setTimeout(function() {
            m.appsReady || (t.setBottomSideWidth(), $(".apps").addClass("show-apps"), m.appsReady = !0, m.appsReadyAt = m.now(), m.trigger("appsReady"))
        }, 1), setTimeout(function() {
            m.appsLoaded = !0, t.loadImages(), setTimeout(function() {
                m.models.activeBackground.preCacheFutureBackgroundImages(), chrome && chrome.runtime && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(function(e) {
                    "hot-reload" === e.type && window.location.reload()
                })
            }, 50)
        }, 500), setTimeout(function() {
            m.usage.newTabLoaded()
        }, 1e3))
    },
    loadImages: function() {
        for (var e = document.getElementsByTagName("img"), t = 0; t < e.length; t++) e[t].getAttribute("data-src") && e[t].setAttribute("src", e[t].getAttribute("data-src"))
    },
    setBottomSideWidth: function() {
        document.documentElement.style.setProperty("--bottom-side-width", "auto");
        var e = $(".bottom-left").width();
        document.documentElement.style.setProperty("--bottom-side-width", Math.round(e) + "px")
    }
}), window.m.usage = function() {
    try {
        var i = {
                PHOTO: 1,
                QUOTE: 2,
                MANTRA: 3,
                ERROR: 4,
                SEARCH: 5,
                STATS: 6,
                TIMING: 7,
                SYSTEM: 8
            },
            n = {
                IMPRESSION_COUNT: "impressionCount",
                HOVER_COUNT: "hoverCount",
                LOAD_COUNT: "loadCount",
                CLICK_COUNT: "clickCount",
                SECONDARY_CLICK_COUNT: "secondaryClickCount",
                ADMIRE_COUNT: "admireCount",
                STICKY_CLICK_COUNT: "stickyClickCount",
                STICKY_SECONDARY_CLICK_COUNT: "stickySecondaryClickCount",
                STICKY_HOVER_COUNT: "stickyHoverCount"
            };
        return new Proxy({}, {
            get: function(e, t) {
                return "types" === t ? i : "properties" === t ? n : function() {
                    var e = arguments;
                    "itemLoaded" === t && (e = Array.from(arguments)).push(document.hidden),
                        function(e, t) {
                            try {
                                m.usageWorker.port.postMessage({
                                    func: e,
                                    params: Array.from(t || [])
                                })
                            } catch (e) {
                                console.error(e)
                            }
                        }(t, e)
                }
            }
        })
    } catch (e) {
        console.error(e)
    }
}(), m.usage.setup(m.globals.urlRootStats, m.globals.version, localStorage.getItem("client_uuid"), localStorage.getItem("token")), m.models.Image = Backbone.Model.extend({
    loadCompleted: !1,
    loading: !1,
    success: !1,
    failed: !1,
    timeoutId: null,
    initialize: function() {},
    load: function(e) {
        var o = this,
            s = this.get("url"),
            r = this.get("variant"),
            l = this.get("uuid");
        if (this.success) setTimeout(function() {
            m.trigger("image:loaded", l, s)
        }, 5);
        else if (!this.loading && !this.loadCompleted) {
            this.loading = !0;
            var t = document.createElement("img");
            if (t.addEventListener("load", function e() {
                    o._onLoad = e, this.success = !0, o.cleanup();
                    var t = !1,
                        i = o.get("height"),
                        n = o.get("width");
                    i && n ? this.height == i && this.width == n || (t = !0) : o.get("skip_check") || (this.height < 750 || this.width < 1e3) && (t = !0);
                    if (t) {
                        o.failed = !0, localStorage.setItem("failed:" + s, "true");
                        var a = {
                            errorType: "loadError",
                            itemUuid: l,
                            errorMessage: "size mismatch"
                        };
                        return r && (a.variant = r), m.usage.savePhotoError(a), o.loadCompleted = !0, void m.trigger("image:error", l)
                    }
                    o.loadCompleted = !0, o.loading = !1, m.trigger("image:loaded", l, s, r)
                }), t.addEventListener("error", function e(t) {
                    o._onError = e, o.failed = !0, o.loading = !1, o.cleanup();
                    var i = {
                        errorType: "loadError",
                        itemUuid: l
                    };
                    t && (i.errorMessage = JSON.stringify(t)), r && (i.variant = r), m.usage.savePhotoError(i), o.isBackgroundLoaded && m.trigger("image:error", l)
                }), e && (o.timeoutId = setTimeout(function() {
                    this.success || m.trigger("image:timeout", l)
                }, e)), m.utils.isChromium()) s && s.lastIndexOf("momo_cache_bg_uuid") < 0 && (s = s + "?momo_cache_bg_uuid=" + l);
            else if (s && 0 < s.lastIndexOf("momo_cache_bg_uuid")) {
                var i = s.split("?");
                i.pop(), s = i.join("?")
            }
            t.setAttribute("src", s)
        }
    },
    cleanup: function() {
        this.timeoutId && (clearTimeout(this.timeoutId), this.timeoutId = null), this.img && (this.img.removeEventListener("load", this._onLoad), this.img.removeEventListener("error", this._onError), this.img = null)
    }
}), m.models.ImageManager = Backbone.Model.extend({
    images: {},
    initialize: function() {},
    loadImage: function(e, t) {
        var i = null,
            n = e.uuid;
        this.images.hasOwnProperty(n) ? i = this.images[n] : (i = new m.models.Image(e), this.images[n] = i), i.load(t)
    },
    preCacheFutureBackgroundImages: function(e) {
        var t = this;
        if (e && 0 < e.length) {
            var i = e.findWhere({
                cached: !1
            });
            i && (this.listenToOnce(m, "image:loaded", function() {
                t.preCacheFutureBackgroundImages(e)
            }), t.preCacheBackgroundImage(i))
        }
    },
    preCacheBackgroundImage: function(e) {
        if (e) {
            var t = {
                uuid: e.backgroundUuid(),
                url: e.get("filename")
            };
            t.height = e.get("height"), t.width = e.get("width"), t.skip_check = !!e.get("skip_check"), t.variant = e.get("variant"), this.loadImage(t)
        }
    }
}), m.models.BackgroundBase = Backbone.Model.extend({
    defaults: {
        cached: !1
    },
    backgroundUuid: function() {
        var e = this.get("_id");
        if (e) return e;
        var t, i = this.get("filename");
        return 0 === i.indexOf("http") ? null : 2 == (t = i.split("/")).length && 2 == (t = t[1].split(".")).length ? t[0] : null
    }
}), m.models.Background = m.models.BackgroundBase.extend({
    idAttribute: "forDate"
}), m.models.ActiveBackground = Backbone.Model.extend({
    initialize: function(e, t) {
        this.displayLogged = !1, this.backgrounds = t.backgrounds, this.legacyBackgrounds = t.legacyBackgrounds, this.listenTo(this.backgrounds, "reset", this.collectionReady), this.listenTo(this.legacyBackgrounds, "reset", this.legacyCollectionReady), this.listenTo(m, "newDay", this.handleNewDay, this), this.listenTo(m, "waitForPhotoActivation", this.waitForPhotoActivation, this), this.listenTo(this, "background:fallback", this.handleFallback, this)
    },
    handleNewDay: function() {
        var e = this;
        try {
            m.usage.sendStats()
        } catch (e) {}
        e.intervalId = setInterval(function() {
            0 < e.backgrounds.length && (e.checkActiveBackground(), clearInterval(e.intervalId))
        }, 50)
    },
    handleFallback: function() {
        var e = this.fallbackKey(),
            t = localStorage.getItem(e),
            i = null;
        this.legacyBackgrounds.initialized ? t ? ((i = this.legacyBackgrounds.getBackground(t)) || (i = this.legacyBackgrounds.getCurrentLocalBackground()) && localStorage.setItem(e, i.backgroundUuid()), i && (this.usingFallback = !0, this.setActiveBackground(i, !0))) : i || (i = this.legacyBackgrounds.getCurrentLocalBackground()) && (localStorage.setItem(e, i.backgroundUuid()), this.usingFallback = !0, this.setActiveBackground(i, !0)) : this.legacyBackgrounds.waitingForFallback = !0
    },
    waitForPhotoActivation: function(e) {
        this.isWaitingForPhotoActivation = e
    },
    collectionReady: function() {
        this.usingFallback && !this.isWaitingForPhotoActivation || (this.checkActiveBackground(), this.isWaitingForPhotoActivation = !1)
    },
    fallbackKey: function() {
        return "fallback-" + m.utils.getDateString()
    },
    legacyCollectionReady: function() {
        0 < this.backgrounds.length ? this.backgrounds.get(m.utils.getDateString()) || this.checkActiveBackground() : this.checkActiveBackground();
        m.trigger("legacybackgrounds:ready")
    },
    getWidgetColor: function() {
        if (this.isCustom() || !this.backgroundItem) return null;
        var e = this.backgroundItem.get("widgetColor");
        return !e && this.backgroundItem.get("isBuiltIn") && 0 < this.legacyBackgrounds.length && (e = this.legacyBackgrounds.getBackground(this.activeBackgroundUuid()).get("widgetColor")), e
    },
    activeBackgroundUuid: function() {
        return this.backgroundItem ? this.backgroundItem.backgroundUuid() : null
    },
    checkActiveBackground: function() {
        var e = null;
        this.backgrounds && 0 < this.backgrounds.length && (e = this.backgrounds.getActiveItem()) ? this.setActiveBackground(e) : this.trigger("background:fallback")
    },
    successfullyLoaded: function(e) {
        this.backgroundItem.backgroundUuid() == e && this.trigger("background:successfullyLoaded", this.backgroundItem)
    },
    setActiveBackground: function(e, t) {
        this.legacyBackgrounds.waitingForFallback = !1, e && (e.has("_id") && this.lastBgId == e.get("_id") || (this.lastBgId = e.get("_id"), this.backgroundItem && this.backgroundItem.cid == e.cid || (this.displayLogged = !1, this.backgroundItem = e, this.trigger("background:activeChanged", e, !!t))))
    },
    generateUUID: function() {
        var i = m.date().getTime();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
            var t = (i + 16 * Math.random()) % 16 | 0;
            return i = Math.floor(i / 16), ("x" == e ? t : 3 & t | 8).toString(16)
        })
    },
    preCacheFutureBackgroundImages: function() {
        m.models.imageManager.preCacheFutureBackgroundImages(this.backgrounds)
    },
    isCustom: function() {
        if (this.backgroundItem) return this.backgroundItem.get("isCustom")
    }
}), m.models.LegacyBackground = m.models.BackgroundBase.extend({
    parse: function(e) {
        var t, i = e.id;
        i || 2 == (t = e.filename.split("/")).length && 2 == (t = t[1].split(".")).length && (i = t[0]);
        this.set({
            id: i,
            filename: e.filename,
            title: e.title,
            source: e.source,
            sourceUrl: e.sourceUrl,
            widgetColor: e.widgetColor
        })
    }
}), m.collect.Fallbacks = Backbone.Collection.extend({
    model: Backbone.Model,
    beforeDate: function(t) {
        return filtered = this.filter(function(e) {
            return e.get("fallbackDate") < t
        }), new m.collect.Fallbacks(filtered)
    }
}), m.collect.LegacyBackgrounds = Backbone.Collection.extend({
    model: m.models.LegacyBackground,
    url: "app/backgrounds.json",
    parse: function(e) {
        return e.backgrounds
    },
    initialize: function() {
        this.initialized = !1, this.listenTo(this, "reset", function() {
            this.initialized = !0, this.waitingForFallback && m.models.activeBackground.trigger("background:fallback")
        }), localStorage.firstSynchronized || this.listenTo(this, "reset", this.initializeBackground)
    },
    initializeBackground: function() {
        this.getCurrentLocalBackground(), m.trigger("sync:downloadIfNeeded")
    },
    getBackground: function(e) {
        return this.get(e)
    },
    getCurrentLocalBackground: function() {
        if (0 === this.models.length) return null;
        var e = null,
            t = m.models.activeBackground.fallbackKey(),
            i = localStorage.getItem(t);
        if (i && (e = this.get(i)), !e) {
            if (!this.parseRecentFallbacks()) return null;
            var n = Math.floor(.75 * this.models.length),
                a = this.fallbacks.sortBy(function(e) {
                    return -e.get("fallbackDate")
                }),
                o = _.first(a, n),
                s = _.map(o, function(e) {
                    return e.get("backgroundGuid")
                }),
                r = this.pluck("id");
            if (m.collect.backgrounds) {
                var l = m.collect.backgrounds.sortBy(function(e) {
                    return -Date.parse(e.get("forDate"))
                });
                n = Math.floor(.25 * this.models.length);
                var d = _.first(l, n),
                    c = _.map(d, function(e) {
                        return e.get("_id")
                    });
                s = _.union(s, c)
            }
            var u = _.difference(r, s);
            if (0 < u.length) {
                var g = _.sample(u);
                e = this.get(g)
            } else e = this.sample()
        }
        return e
    },
    parseRecentFallbacks: function() {
        if (this.fallbacks) return !0;
        this.fallbacks = new m.collect.Fallbacks;
        var o = this;
        return Object.keys(localStorage).forEach(function(e, t) {
            if (0 === e.indexOf("fallback-")) {
                var i = e.slice(9),
                    n = Date.parse(i),
                    a = new Backbone.Model({
                        fallbackDate: n,
                        backgroundGuid: t
                    });
                o.fallbacks.add(a)
            }
        }), !0
    }
}), m.models.BackgroundManager = m.models.FeedManager.extend({
    initialize: function() {
        m.models.FeedManager.prototype.initialize.call(this, m.models.Background, "background"), m.models.imageManager = new m.models.ImageManager, m.collect.legacyBackgrounds = new m.collect.LegacyBackgrounds, m.models.activeBackground = new m.models.ActiveBackground({}, {
            backgrounds: m.collect.backgrounds,
            legacyBackgrounds: m.collect.legacyBackgrounds
        }), this.listenTo(m, "image:loaded", this.markBackgroundAsCached)
    },
    firstFetch: function() {
        var e = m.collect.backgrounds,
            t = m.collect.legacyBackgrounds;
        m.firstLoadEver && (e = m.collect.legacyBackgrounds, t = m.collect.backgrounds, m.firstLoadEver = !1), e.fetch({
            reset: !0
        }), setTimeout(function() {
            t.fetch({
                reset: !0
            })
        }, 500)
    },
    getActiveItem: function() {
        return m.models.activeBackground.backgroundItem
    },
    markBackgroundAsCached: function(e, t, i) {
        var n = {
            _id: e
        };
        i && (n.variant = i);
        var a = m.collect.backgrounds.findWhere(n);
        a && a.get("testOnly") ? a.destroy() : a && a.save("cached", !0)
    }
}), m.views.Background = Backbone.View.extend({
    tagName: "li",
    attributes: {
        class: "background-item",
        "data-test": "background"
    },
    isBackgroundLoaded: !1,
    initialize: function() {
        this.initialFade = !0, this.model = m.models.backgroundManager, this.listenTo(m.models.activeBackground, "background:activeChanged", this.setBackground), this.listenTo(m, "appsReady", this.fadeBackgroundIn), this.listenTo(m, "topics:open", this.shiftBackground), this.listenTo(m, "topics:closed", this.unShiftBackground)
    },
    render: function() {
        this.model && this.model.backgroundItem && this.setBackground(this.model.backgroundItem)
    },
    setBackground: function(s) {
        var r = this,
            e = !1;
        r.isBackgroundLoaded && (e = !0);
        var l = s.get("variant"),
            d = s.backgroundUuid();
        if (s.get("filename")) {
            var c = s.get("filename");
            if (m.utils.isChromium()) c && c.lastIndexOf("momo_cache_bg_uuid") < 0 && (c = c + "?momo_cache_bg_uuid=" + d);
            else if (c && 0 < c.lastIndexOf("momo_cache_bg_uuid")) {
                var t = c.split("?");
                t.pop(), c = t.join("?")
            }
            var u = (this.options.order || "append") + "To";
            $(".background").css("background-image", $(".background").find("li").css("background-image")), this.lastId = d, this.loadCompleted = !1, "true" == localStorage.getItem("failed:" + c) && (r.loadCompleted = !0, m.models.activeBackground.trigger("background:fallback"));
            var i = $("<img/>");
            i.on("load", function() {
                var e = d,
                    t = !1,
                    i = s.get("height"),
                    n = s.get("width");
                i && n ? this.height == i && this.width == n || (t = !0) : s.get("skip_check") || (this.height < 750 || this.width < 1e3) && (t = !0);
                if (t) {
                    m.models.activeBackground.trigger("background:fallback"), localStorage.setItem("failed:" + c, "true");
                    var a = {
                        errorType: "loadError",
                        itemUuid: e,
                        errorMessage: "size mismatch"
                    };
                    return l && (a.variant = l), m.usage.savePhotoError(a), void(r.loadCompleted = !0)
                }
                r.loadCompleted = !0, m.models.activeBackground.successfullyLoaded(d);
                try {
                    var o = s && (s.get("_id") || s.get("id"));
                    m.usage.itemLoaded(o, m.usage.types.PHOTO)
                } catch (e) {}
                r.isBackgroundLoaded = !0, d === r.lastId && (r.$el[u]("." + r.options.region).css("background-image", "url(" + c + ")"), $(this).remove(), m.appsLoaded && r.fadeBackgroundIn()), m.widgetManager.appReady("background"), setTimeout(function() {
                    m.trigger("background:loadSuccessful", d)
                }, 200), setTimeout(function() {
                    m.widgetManager.checkWidgetTimeout()
                }, 500)
            }).on("error", function() {
                var e = {
                    errorType: "loadError",
                    itemUuid: d
                };
                l && (e.variant = l), m.usage.savePhotoError(e), n()
            }), e || window.setTimeout(function() {
                if (!r.loadCompleted) {
                    var e = {
                        errorType: "timeout",
                        itemUuid: d
                    };
                    l && (e.variant = l), m.usage.savePhotoError(e), r.loadCompleted = !0, m.models.activeBackground.trigger("background:fallback")
                }
            }, 4e3), i.attr("src", c)
        } else n();

        function n() {
            r.loadCompleted = !0, r.isBackgroundLoaded ? m.trigger("background:error", d) : m.models.activeBackground.trigger("background:fallback")
        }
    },
    fadeBackgroundIn: function() {
        var e = this.initialFade ? "fadein" : "fadein-slow";
        this.initialFade = !1, this.$el.addClass(e), setTimeout(function() {
            $(".background-overlay").addClass("show")
        }, 55)
    },
    shiftBackground: function() {
        m.utils.addClass(document.body, "show-full-overlay"), setTimeout(function() {
            m.utils.addClass(document.body, "show-full-overlay-active")
        }, 10)
    },
    unShiftBackground: function() {
        m.utils.removeClass(document.body, "show-full-overlay-active"), setTimeout(function() {
            m.utils.removeClass(document.body, "show-full-overlay")
        }, 500)
    }
}), m.collect.SyncedCollection = Backbone.Collection.extend({
    loadedOnce: !1,
    initialize: function(e, t) {
        this.model = t.model, this.version = 2, this.rate = 0, this.rateLimit = 5, this.sameTimeThreshold = 100, this.backOffTime = 3e3, this.lastCall = 0, this.name = t.name, localStorage.getItem("syncedCollectionVersion-" + this.name) || (this.migrate(), localStorage.setItem("syncedCollectionVersion-" + this.name, this.version)), this.offlineOnly = t.offlineOnly, this.readOnly = t.readOnly, t.onlineOnly ? (this.onlineOnly = !0, this.idAttribute = this.serverIdAttribute = "id") : (this.idAttribute = t.idAttribute || "csid", this.serverIdAttribute = t.serverIdAttribute || "id", this.localStorage = new Backbone.LocalStorage(t.name)), this.apiUrl = t.apiUrl || m.globals.urlRootApi + t.name, this.listenTo(this, "add", this.onAdd), this.listenTo(this, "change", this.onChange), this.listenTo(this, "reset", this.onReset), this.includeArchived = !1, this.transientProps = t.transientProps || [], this.localProps = t.localProps || [], this.sorted = t.sorted, this.parent = t.parent
    },
    everLoaded: function() {
        return this.offlineOnly || this.onlineOnly || !!localStorage.getItem(this.name + "-loaded-once")
    },
    setLoadedOnce: function() {
        this.parent && this.parent.set({
            loadedOnce: !0
        }, {
            silent: !0,
            ignoreRender: !0,
            ignoreSave: !0
        });
        var e = !this.loadedOnce;
        return e && this.trigger("loaded-from-server"), localStorage.setItem(this.name + "-loaded-once", "true"), this.loadedOnce = !0, this.loading = !1, e
    },
    fetch: function(e) {
        var t = this;
        ((e = e || {}).skipLocalFetch || Backbone.Collection.prototype.fetch.call(this, e), this.offlineOnly || e.skipServerFetch || this.isComputed) ? this.setLoadedOnce() && this.trigger("refresh"): !e.skipLocalFetch && e.reset || this.onlineOnly || this.fetchFromServer(e.skipLocalFetch ? function() {
            t.trigger("sync", t, t.models, e), e.success && e.success()
        } : null, e.skipLocalFetch ? e.error : null, e)
    },
    create: function(e, t) {
        if (this.onlineOnly) return Backbone.Collection.prototype.create.call(this, e, t);
        t = t || {}, e[this.idAttribute] || (e[this.idAttribute] = m.utils.uuidv4()), e.serverSetId || (e.serverSetId = !1);
        var i = this.add(e, t);
        return i.id = i.get(this.idAttribute), i.collection = this, i.save({}, {
            silent: !0,
            ignoreSave: !0,
            ignoreRender: !0
        }), t.success && t.success(i), i
    },
    migrate: function() {
        var n = this,
            e = localStorage.getItem(this.name);
        e && 0 !== (e = e.split(",")).length && e.map(function(e) {
            var t = n.name + "-" + e,
                i = localStorage.getItem(t);
            i && ((i = JSON.parse(i))[n.idAttribute] || (i[n.idAttribute] = i.id, i = JSON.stringify(i), localStorage.setItem(t, i)))
        })
    },
    activeItems: function() {
        return this.filter(function(e) {
            return !e.get("deleted")
        })
    },
    onReset: function(e, t) {
        if (!this.onlineOnly) {
            if (this.fetchedOnce = !0, this.offlineOnly) this.setLoadedOnce() && this.trigger("refresh");
            var i = this;
            this.models.forEach(function(t) {
                t.id = t.get(i.idAttribute), i.transientProps && i.transientProps.forEach(function(e) {
                    t.attributes[e] = !1
                }), t.get("serverSetId") || t.set("serverSetId", !1)
            }), this.offlineOnly || this.isDummy || this.syncToServer(function() {
                i.fetchFromServer(null, null, t)
            })
        }
    },
    findHavingAttribute: function(t) {
        return this.filter(function(e) {
            return e.has(t)
        })
    },
    hasAttribute: function(t) {
        return !!this.find(function(e) {
            return e.has(t)
        })
    },
    onAdd: function(n, e, t, i) {
        if ((t = t || {}).ignoreSave || n.get("unsyncable") || n.get("syncing") && n.get("syncing") > m.now() || n.get("serverSetId") || n.get("deleted") || this.readOnly || this.offlineOnly || this.onlineOnly) i && i();
        else if (this.shouldIgnoreSync && this.shouldIgnoreSync(n)) i && i();
        else {
            var a = n.toJSON(),
                o = n.get(this.idAttribute);
            this.transientProps = this.transientProps || [], this.transientProps.push("syncing"), this.transientProps.forEach(function(e) {
                delete a[e]
            }), this.localProps && this.localProps.forEach(function(e) {
                delete a[e]
            }), n.set({
                syncing: m.now() + 1e4
            }, {
                silent: !0
            });
            var s = this;
            this.syncInProgress = !0, s.idAttribute !== s.serverIdAttribute && delete a[s.idAttribute];
            var r = {};
            Object.assign(r, a, t.additionalData);
            var l = n.get("changed_props") && n.get("changed_props").toString();
            r.csid = o, $.ajax({
                url: n.apiUrl || this.apiUrl,
                contentType: "application/json",
                type: "POST",
                data: JSON.stringify(r)
            }).done(function(e) {
                e && e[s.serverIdAttribute] && (a = n.toJSON(), n.get("changed_props") && n.get("changed_props").toString() === l && (a.changed_props = null), a.serverSetId = !0, a.syncing = 0, delete a[s.idAttribute], a[s.serverIdAttribute] = e[s.serverIdAttribute], (n = s.getModel(n, o)) && (n.save(a, {
                    silent: !0
                }), n.saveHandler && n.saveHandler(e))), t.serverSuccess && t.serverSuccess(n)
            }).fail(function(e, t, i) {
                if ("Bad Request" === i) {
                    if (!(n = s.getModel(n, o))) return;
                    n.id = n.get(n.idAttribute), n.destroy({
                        silent: !0
                    })
                }
            }).always(function() {
                (n = s.getModel(n, o)) && n.set({
                    syncing: 0
                }, {
                    silent: !0
                }), s.syncInProgress = !1, s.missedSync && (s.missedSync = !1, s.syncToServer()), i && i()
            })
        }
    },
    getModel: function(e, t) {
        var i = {};
        i[this.idAttribute] = t;
        var n = this.findWhere(i);
        return !n && e && e.mainContent && (n = this.findWhere(e.mainContent())), n
    },
    onChange: function(e, t) {
        if (!(this.readOnly || this.offlineOnly || this.onlineOnly)) {
            var i = this;
            if (!(t = t || {}).ignoreSave) {
                var n = e.changedAttributes();
                if (n && !n[this.idAttribute] && !t.createdNow) {
                    var a, o = null,
                        s = !1;
                    for (a in this.transientProps && this.transientProps.forEach(function(e) {
                            delete n[e]
                        }), this.localProps && this.localProps.forEach(function(e) {
                            delete n[e]
                        }), n) n.hasOwnProperty(a) && "changed_props" !== a && (o = o || (e.get("changed_props") || []), _.contains(o, a) || (a !== i.idAttribute && o.push(a), s = !0));
                    var r = !1;
                    if (!e.get(this.serverIdAttribute) && Object.keys(n).length) {
                        if (!(e.get("syncing") && e.get("syncing") > m.now())) return void this.onAdd(e, this, t);
                        r = !0, setTimeout(function() {
                            i.syncToServer(t.serverSuccess)
                        }, 1e3)
                    }
                    s && o && 0 < o.length && e.save({
                        changed_props: o
                    }, {
                        silent: !0,
                        ignoreSave: !0,
                        ignoreRender: !0,
                        success: function() {
                            t.postponeSync || r || setTimeout(function() {
                                i.syncToServer(t.serverSuccess)
                            }, 50)
                        }
                    })
                }
            }
        }
    },
    syncToServer: function(r) {
        if (this.readOnly || this.offlineOnly || this.onlineOnly) r && r();
        else if (this.syncInProgress) this.missedSync = !0;
        else {
            var l = this;
            this.syncInProgress = !0;
            var e = 0,
                t = this.findHavingAttribute("changed_props"),
                i = this.where({
                    serverSetId: !1
                });
            if (i ? Array.isArray(i) || (i = [i]) : i = [], i.forEach(function(e) {
                    l.onAdd(e, null, null, function() {
                        c()
                    })
                }), t && 0 !== t.length) {
                var d = !1;
                t.forEach(function(i) {
                    if (!d && i.get(l.serverIdAttribute)) {
                        var n = i.get("changed_props"),
                            a = n.toString();
                        if (l.transientProps && l.transientProps.forEach(function(e) {
                                var t = n.indexOf(e);
                                0 <= t && n.splice(t, 1)
                            }), n && 0 !== n.length) {
                            i.syncing = !0;
                            var t = {};
                            if (_.each(n, function(e) {
                                    "changed_props" !== e && e !== l.idAttribute && (t[e] = i.get(e))
                                }), !l.isWithinRateLimit()) return setTimeout(function() {
                                l.syncToServer(r)
                            }, l.backOffTime), l.syncInProgress = !1, void(d = !0);
                            i.getSupplementaryData && Object.assign(t, i.getSupplementaryData());
                            var o = i.get(l.serverIdAttribute),
                                e = (i.apiUrl || l.apiUrl) + "/" + encodeURIComponent(o),
                                s = i.get(l.idAttribute);
                            $.ajax({
                                url: e,
                                contentType: "application/json",
                                type: "PATCH",
                                data: JSON.stringify(t)
                            }).done(function(e, t) {
                                ((i = l.getModel(i, s)) && e && e.success || "success" === t) && (i.collection && i.get("deleted") ? i.destroy({
                                    silent: !0
                                }) : i.get("changed_props") && i.get("changed_props").toString() === a && i.collection && i.save({
                                    changed_props: null
                                }, {
                                    silent: !0
                                }), "T" === o[0] && l.fetch({
                                    reset: !0,
                                    skipLocalFetch: !0
                                }))
                            }).always(function() {
                                c()
                            })
                        } else c()
                    }
                })
            } else 0 === i.length && (this.syncInProgress = !1, r && r())
        }

        function c() {
            ++e === t.length + i.length && (l.syncInProgress = !1, e = 0, l.missedSync && (l.missedSync = !1, l.syncToServer()), r ? r() : l.fetchFromServer(null, null, l.lastFetchOptions))
        }
    },
    isWithinRateLimit: function() {
        var e = m.now();
        if (e < this.lastCall + this.sameTimeThreshold) {
            if (this.lastCall = e, this.rate++, this.rate > this.rateLimit) return !1
        } else this.rate = 0;
        return this.lastCall = e, !0
    },
    fetchFromServer: function(e, t, n) {
        if (n = (this.lastFetchOptions = n) || {}, this.offlineOnly || n.skipServerFetch) e && e();
        else {
            var i = n.data,
                s = this;
            $.ajax({
                url: this.apiUrl + (this.includeArchived ? "?includeArchived=true" : ""),
                contentType: "application/json",
                type: "GET",
                data: i
            }).done(function(e) {
                var a = !1;
                if (e)
                    if ("authRequired" === e.status && s.handleAuthRequired) s.handleAuthRequired(e);
                    else {
                        if (s.parse && (e = s.parse(e)), !Array.isArray(e))
                            for (var t in e) Array.isArray(e[t]) && (e = e[t]);
                        var o = [];
                        _.each(e, function(e) {
                            if (e) {
                                o.push(e[s.serverIdAttribute]);
                                var t = {};
                                t[s.serverIdAttribute] = e[s.serverIdAttribute] + "";
                                var i = s.findWhere(t);
                                if (e.serverSetId = !0, i) {
                                    e[s.idAttribute] || (e[s.idAttribute] = i.get(s.idAttribute));
                                    var n = Math.max(i.get("modifiedServer") && Date.parse(i.get("modifiedServer")) || 0, i.get("modified") || 0);
                                    (s.readOnly || !e.modifiedServer || Date.parse(e.modifiedServer) > n) && i.save(e, {
                                        ignoreSave: !0,
                                        ignoreRender: !0
                                    })
                                } else e[s.idAttribute] || (e[s.idAttribute] = e[s.serverIdAttribute]), s.create(e, {
                                    ignoreSave: !0,
                                    ignoreRender: !0
                                }), e.archived || (a = !0)
                            }
                        });
                        var i = s.models.slice();
                        if (!1 !== n.remove && i.forEach(function(e) {
                                if (e.get("serverSetId") && o.indexOf(e.get(s.serverIdAttribute)) < 0 && !e.get("isDummy") && !e.get("unsyncable")) {
                                    var t = {};
                                    t[s.idAttribute] = e.get([s.idAttribute]) + "";
                                    var i = s.findWhere(t);
                                    i.id = i.get(i.idAttribute), i.destroy({
                                        silent: !0
                                    }), a = !0
                                }
                            }), s.readOnly) return s.set(e, {
                            silent: !0,
                            remove: !0
                        }), s.trigger("refresh"), void s.setLoadedOnce();
                        s.trigger("change", null, {
                            ignoreSave: !0
                        }), (a = s.setLoadedOnce() || a) && s.trigger("refresh"), s.trigger("server-sync"), s.handleOrdering && s.handleOrdering(e)
                    }
            }).fail(function(e) {
                e.responseJSON && "authRequired" === e.responseJSON.status && s.handleAuthRequired ? s.handleAuthRequired(e.responseJSON) : t ? t() : !s.fetchedOnce && n.error && n.error(e)
            }).always(function() {
                e && e()
            })
        }
    }
}), m.models.GenericMetric = Backbone.Model.extend({
    defaults: {
        id: null,
        label: "",
        value: "",
        link: null
    },
    initialize: function() {
        this.listenTo(this, "change:metric", this.metricChanged), this.loadData()
    },
    loadData: function() {
        var l = this;
        this.set("label", "");
        var e = m.globals.urlRootIntegration + "services/random";
        try {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: e
            }).done(function(e) {
                if (e.metricInfo) l.set("id", e.metricInfo.metricId), l.set("value", e.metricInfo.metricValue), l.set("label", e.metricInfo.metricLabel), e.metricInfo.metricLink ? l.set("link", e.metricInfo.metricLink) : l.set("link", null);
                else if (e.status && "authRequired" == e.status && e.authorizationUrl && l.authAttempts < 2) {
                    l.authAttempts++;
                    var t = e.winWidth ? e.winWidth : 600,
                        i = e.winHeight ? e.winHeight : 510,
                        n = e.windowFeatures ? e.windowFeatures : "titlebar,resizable,toolbar,status",
                        a = window.screen.width / 2 - t / 2,
                        o = window.screen.height / 2 - i / 2,
                        s = window.open(e.authorizationUrl, "MomentumAuthWindow", n + ",left=" + a + ",top=" + o + ",width=" + t + ",height=" + i),
                        r = setInterval(function() {
                            s.closed && (clearInterval(r), l.metricChanged())
                        }, 250)
                }
            }).fail(function() {
                console.log("failed")
            })
        } catch (e) {}
    }
}), m.views.GenericMetric = Backbone.View.extend({
    attributes: {
        id: "generic-stats",
        class: "generic-stats metric metric-item app-container app-dash add-shadow"
    },
    template: m.templates.metric.widget,
    events: {
        click: "clickMetric",
        mouseenter: "mouseEnter",
        mouseleave: "mouseLeave"
    },
    initialize: function() {
        this.renderedOnce = !1, this.render(), this.listenTo(this.model, "change:value", this.render), this.listenTo(this.model, "change:label", this.render)
    },
    render: function() {
        var e = this.model.get("label"),
            t = this.model.get("value");
        if (t) {
            var i = {
                statvalue: t,
                statlabel: e
            };
            if (this.renderedOnce) this.$el.html(this.template(i)), this.$time = this.$(".time"), this.$format = this.$(".format");
            else {
                var n = (this.options.order || "append") + "To";
                this.$el[n]("." + this.options.region).mFadeIn().html(this.template(i)), this.$time = this.$(".time"), this.$format = this.$(".format"), this.renderedOnce = !0
            }
        }
    },
    clickMetric: function() {
        this.model.clickMetric()
    }
}), m.models.TeamInfo = Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage("team-info"),
    defaults: {
        team: null,
        id: 1
    },
    initialize: function() {
        this.fetch();
        var e = this;
        m.listenToOnce(m.models.customization, "initialized", function() {
            e.showLogo()
        }), this.listenTo(this, "change", this.showLogo)
    },
    showLogo: function(e) {
        var t = (e = e || this).get("team");
        t && m.conditionalFeatures.featureEnabled("team") && (m.views.teamLogo ? m.views.teamLogo.render() : m.views.teamLogo = new m.views.TeamLogo({
            region: "top-left",
            team: t
        }))
    }
}), m.models.Message = Backbone.Model.extend({
    defaults: function() {
        return {
            title: null,
            message: "",
            priority: 5,
            views: 0,
            viewLimit: 3,
            deleted: !1,
            createdDate: m.now(),
            visible: !1,
            loginOnClick: !1,
            targetArea: null,
            important: !1,
            fromServer: !1
        }
    },
    showMessage: function(e, t, i, n) {
        m.commandManager.execute("notification.show.enhanced", {
            title: e,
            message: t,
            views: 0,
            viewLimit: i,
            visible: !0,
            loginOnClick: n
        })
    },
    showMessageNow: function(e, t, i, n) {
        m.commandManager.execute("notification.show.enhanced", {
            title: e,
            message: t,
            views: 0,
            viewLimit: i,
            visible: !0,
            loginOnClick: n
        })
    },
    isTeamNotification: function() {
        return "team" === this.get("notification_type")
    },
    dismissMessage: function() {
        m.commandManager.execute("notification.dismiss")
    },
    save: function(e, t) {
        if (t = t || {}, (e = e || _.clone(this.attributes)).hasOwnProperty("dismissed") && e.dismissed && (e.deleted = !0), !t.download_save && this.get("fromServer")) try {
            var i = null;
            for (prop in e) e.hasOwnProperty(prop) && "changed_props" != prop && "sync_success" != prop && (i = i || (this.get("changed_props") || []), _.contains(i, prop) || i.push(prop));
            i && (e.changed_props = i, e.sync_success = !1, t.silent = !1)
        } catch (e) {}
        return Backbone.Model.prototype.save.call(this, e, t)
    }
}), m.collect.Messages = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("momentum-messages"),
    model: m.models.Message,
    cleaned: !1,
    initialize: function() {
        this.listenTo(this, "reset", this.cleanupMessagesIfRequired)
    },
    cleanupMessagesIfRequired: function() {
        if (!this.cleaned) {
            this.cleaned = !0;
            var i = [];
            this.each(function(e) {
                if (e.get("deleted") || e.get("expiry") && !(Date.parse(e.get("expiry")) > m.now())) e.get("fromServer") && e.get("sync_success") && !e.get("changed_props") && i.push(e);
                else {
                    var t = e.get("filter");
                    t && m.conditionalFeatures.featureEnabled(t) ? e.save({
                        deleted: !0,
                        filtered: !0
                    }) : 5 == e.get("priority") ? e.get("fromServer") ? e.save({
                        deleted: !0
                    }) : i.push(e) : e.get("visible") || e.save({
                        deleted: !0
                    })
                }
            }), 0 < i.length && _.each(i, function(e) {
                e.destroy()
            })
        }
    }
}), m.models.NotificationSync = Backbone.Model.extend({
    baseUrl: m.globals.urlRootApi + "notifications",
    initialize: function(e) {
        this.collection = e.collection, this.listenTo(this.collection, "change:changed_props", this.onChange), this.listenTo(this.collection, "reset", this.onReset)
    },
    findHavingAttribute: function(e, t) {
        return e.filter(function(e) {
            return e.has(t)
        })
    },
    hasAttribute: function(e, t) {
        return !!e.find(function(e) {
            return e.has(t)
        })
    },
    onReset: function() {
        this.syncToServer()
    },
    onChange: function(e, t) {
        if (!t.ignoreSave) {
            var i = e.changedAttributes();
            i && i.hasOwnProperty("changed_props") && i.changed_props && this.syncToServer()
        }
    },
    syncToServer: function(e) {
        var a = this,
            t = this.findHavingAttribute(this.collection, "changed_props");
        Promise.all(t.map(function(t) {
            if (t.get("fromServer")) {
                var e = t.get("changed_props");
                if (!e || 0 == e.length) return Promise.resolve();
                var i = {};
                if (_.each(e, function(e) {
                        "changed_props" != e && "sync_success" != e && (i[e] = t.get(e))
                    }), 1 == Object.keys(i).length && i.hasOwnProperty("views")) return Promise.resolve();
                var n = a.baseUrl + "/" + encodeURIComponent(t.id);
                return new Promise(function(e) {
                    $.ajax({
                        url: n,
                        contentType: "application/json",
                        type: "PATCH",
                        data: JSON.stringify(i)
                    }).done(function(e) {
                        e && e.success && t.save({
                            changed_props: null,
                            sync_success: !0
                        }, {
                            silent: !0
                        })
                    }).fail(function() {
                        t.save({
                            sync_success: !1
                        }, {
                            silent: !0
                        })
                    }).always(e)
                })
            }
        })).then(function() {
            e && e()
        })
    }
}), m.models.NotificationManager = Backbone.Model.extend({
    backgroundLoaded: !1,
    _notificationView: null,
    settingsVisible: !1,
    initialize: function() {
        this.displayed = [], this.collection = new m.collect.Messages, m.models.message = new m.models.Message, this.listenTo(this.collection, "add reset", this.displayPendingMessages), this.listenToOnce(m, "background:loadSuccessful", this.onBackgroundLoaded), this.listenTo(m, "settings:hidden", this.settingsHidden), this.listenTo(m, "settings:visible", this.onSettingsVisible), this.listenTo(m, "notifications:timestamp", this.onAvailableTimestamp), this.listenTo(m, "appsReady", this.displayPendingMessages), m.conditionalFeatures.featureEnabled("notifySyncOff") || (this.notifySync = new m.models.NotificationSync({
            collection: this.collection
        })), this.collection.fetch({
            reset: !0
        })
    },
    onBackgroundLoaded: function() {
        this.backgroundLoaded || (this.backgroundLoaded = !0, this.displayPendingMessages(), m.commandManager.execute("clean.localstorage"))
    },
    displayPendingMessages: function() {
        var i = this;
        if (this.collection.cleanupMessagesIfRequired(), m.appsReady && !this.settingsVisible) {
            var e = this.notificationView();
            if (e && !e.notifying) {
                var t = _.chain(this.collection.where({
                    deleted: !1,
                    visible: !0
                })).reject(function(e) {
                    var t = e.get("filter");
                    return !(!t || !m.conditionalFeatures.featureEnabled(t)) || (!!(e.get("expiry") && Date.parse(e.get("expiry")) < m.now()) || _.contains(i.displayed, e))
                }).sortBy("priority").sortBy("createdDate").value();
                if (t && 0 !== t.length) {
                    var n = t[0];
                    this.displayed.push(n), e.showMessage(n)
                }
            }
        }
    },
    onAvailableTimestamp: function(e) {
        if (e) {
            var t = localStorage.getItem("ts_notifications");
            (!t || t < e) && this.downloadNotifications()
        }
    },
    downloadNotifications: function() {
        var t = this,
            e = localStorage.getItem("ts_notifications"),
            i = m.globals.urlRootApi + "notifications";
        e && (e = parseInt(e, 10), Number.isInteger(e) && (i = i + "?ts=" + e));
        try {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: i
            }).done(function(e) {
                e && e.timestamp && (e.notifications && 0 < e.notifications.length && (t.collection.reset(e.notifications), t.collection.invoke("save", null, {
                    download_save: !0
                })), localStorage.setItem("ts_notifications", e.timestamp))
            })
        } catch (e) {}
    },
    showMessage: function(e, t, i, n) {
        var a = {
            title: e,
            message: t,
            visible: !0
        };
        void 0 !== i && (a.viewLimit = i), void 0 !== n && (a.loginOnClick = n), this.collection.create(a)
    },
    showMessageEnhanced: function(e, t, i) {
        e.hasOwnProperty("visible") || (e.visible = !0);
        var n = {};
        t && (n.success = t), i && (n.silent = !0), this.collection.create(e, n)
    },
    dismissMessage: function() {
        this._notificationView && this.notificationView().hideNotification()
    },
    settingsHidden: function() {
        this.settingsVisible = !1, this.displayPendingMessages()
    },
    onSettingsVisible: function() {
        this.settingsVisible = !0
    },
    notificationView: function() {
        return this._notificationView || (this._notificationView = new m.views.Notification), this._notificationView
    }
}), m.views.Notification = Backbone.View.extend({
    attributes: {
        class: "notification"
    },
    template: m.templates.notification.notification,
    notifying: !1,
    timeoutId: null,
    areaMap: {
        centerNav: {
            selector: '[data-ob="center-nav"]',
            targetDistance: 15,
            position: "bottom-right",
            customCss: '[data-ob="center-nav"] > .icon { opacity: 1; } [data-ob="center-nav"]:after { background: rgba(255,255,255,0.2); }',
            areaAvailableCommand: "check.clock.active"
        }
    },
    events: {
        "click .notification-hide": "hideNotificationClicked",
        "click .notification-button": "ctaButtonClicked",
        "click .secondary-text": "secondaryTextClicked"
    },
    initialize: function() {
        this.renderedOnce = !1, this.listenTo(m, "notification:hide", this.forceHideNotification)
    },
    showMessage: function(e) {
        if (!this.model || this.model.cid != e.cid) {
            this.model = e;
            var i = this;
            ["cta_cmd", "secondary_cmd"].forEach(function(e) {
                var t = i.model.get(e);
                t && m.commandManager.beforeExecute(t)
            }), this.render()
        }
    },
    render: function() {
        var e = this;
        this.notifying = !0, this.incrementViews();
        var t = this.model.get("targetArea"),
            i = this.areaMap[t];
        if (this.showRegionalNotification = !1, i) {
            var n = $(i.selector);
            this.showRegionalNotification = (!i.areaAvailableCommand || m.commandManager.execute(i.areaAvailableCommand)) && !!n && !!n.length
        }
        if (this.showRegionalNotification) {
            var a = {
                id: this.model.get("id"),
                headerText: this.model.get("title"),
                bodyText: this.model.get("message"),
                position: i.position,
                targetDistance: i.targetDistance,
                targetElementSelector: i.selector,
                ctaText: this.model.get("cta_text"),
                ctaCallback: this.ctaButtonClicked.bind(this),
                secondaryText: this.model.get("secondary_text"),
                secondaryCallback: this.secondaryTextClicked.bind(this),
                hideCallback: this.hideNotificationClicked.bind(this),
                customCss: i.customCss,
                pulseAnimation: this.model.get("important"),
                hideSkip: !0,
                hideNext: !0
            };
            m.cmd("modal.open", a)
        } else {
            var o = this.model.isTeamNotification(),
                s = this.model.toJSON();
            s.nippleClass = o ? "nipple-top-left" : "nipple-bottom-left", s.announcementClass = o ? "announcement" : "", this.$el.html(this.template(s)), this.$el.toggleClass("no-title", null === this.model.get("title"));
            var r = o ? $("#team-logo") : $("#settings");
            if (!r.length) return;
            r[o ? "append" : "prepend"](this.$el), this.showNotification(), this.$message = this.$(".notification-description"), this.model.has("message_html") && this.$message.html(this.model.get("message_html"))
        }
        var l = this.model.get("display_time");
        !l || l <= 0 || (this.timeoutId = setTimeout(function() {
            e.hideNotification()
        }, l))
    },
    incrementViews: function() {
        var e = this.model.get("views") + 1;
        this.setModelCollection(), e >= this.model.get("viewLimit") ? this.model.save({
            visible: !1,
            views: e
        }) : this.model.save({
            views: e
        }, {
            silent: !0
        })
    },
    forceHideNotification: function() {
        this.hideNotification(!0, !0)
    },
    showNotification: function() {
        this.$el.addClass("show").width(), this.$el.addClass("show-fade-in")
    },
    hideNotification: function(t) {
        if (clearTimeout(this.timeoutId), this.showRegionalNotification) m.trigger("modal:close");
        else {
            var i = this;
            this.$el.hasClass("show") && this.$el.removeClass("show-fade-in").on("transitionend webkitTransitionEnd", function e() {
                i.$el.hasClass("show-fade-in") || (i.$el.removeClass("show"), t || m.models.notificationManager.displayPendingMessages(), i.$el.off("transitionend webkitTransitionEnd", e))
            })
        }
        this.notifying && (this.notifying = !1)
    },
    hideNotificationClicked: function(e) {
        e && e.stopPropagation(), this.showRegionalNotification || this.hideNotification(), this.setModelCollection(), this.model.save({
            dismissed: !0,
            visible: !1
        }, {
            silent: !0
        })
    },
    ctaButtonClicked: function(e) {
        e && e.stopPropagation(), this.notifying = !1;
        var t = this.model.get("cta_cmd"),
            i = this.model.get("cta_options");
        t && 0 < t.length && (this.setModelCollection(), this.forceHideNotification(), this.model.save({
            ctaClicked: m.now(),
            dismissed: !0,
            visible: !1
        }, {
            silent: !0
        }), m.commandManager.execute(t, null, i))
    },
    secondaryTextClicked: function(e) {
        e && e.stopPropagation(), this.model.get("secondary_hide") && (this.notifying = !1);
        var t = this.model.get("secondary_cmd"),
            i = this.model.get("secondary_options");
        t && 0 < t.length && (this.setModelCollection(), this.model.save({
            secondaryClicked: m.now()
        }, {
            silent: !0
        }), m.commandManager.execute(t, null, i))
    },
    setModelCollection: function() {
        this.model.collection || (this.model.collection = m.models.notificationManager.collection)
    }
}), m.commands.NotificationShow = m.models.Command.extend({
    defaults: {
        id: "notification.show"
    },
    execute: function(e, t) {
        setTimeout(function() {
            m.models.notificationManager && m.models.notificationManager.showMessage(e, t)
        }, 10)
    }
}), m.commands.NotificationShowEnhanced = m.models.Command.extend({
    defaults: {
        id: "notification.show.enhanced"
    },
    execute: function(e, t, i) {
        setTimeout(function() {
            m.models.notificationManager && m.models.notificationManager.showMessageEnhanced(e, t, i)
        }, 10)
    }
}), m.commands.NotificationDismiss = m.models.Command.extend({
    defaults: {
        id: "notification.dismiss"
    },
    execute: function() {
        setTimeout(function() {
            m.models.notificationManager && m.models.notificationManager.dismissMessage()
        }, 5)
    }
}), m.commands.CheckClockActive = m.models.Command.extend({
    defaults: {
        id: "check.clock.active"
    },
    execute: function() {
        return !(localStorage.getItem("pomodoro-showing") && "false" !== localStorage.getItem("pomodoro-showing") || m.models.customization.balanceMode.get("active"))
    }
}), m.commands.StartExperiment = m.models.Command.extend({
    defaults: {
        id: "experiment.start"
    },
    execute: function(e, t) {
        t.xid && m.experimentManager.enrollServerSide(t.xid, t.xvar), t.cmd && m.commandManager.execute(t.cmd, null, t.opt)
    }
});
var settingsUtils = {
    flashInputLengthError: function(e) {
        m.utils.toggleClassTwice(e, m.utils.mConst("classInputLengthError"))
    },
    checkForInputMaxLengthError: function(e) {
        e.is("input") && e.val().length >= e.attr("maxlength") && m.settingsUtils.flashInputLengthError(e)
    },
    updateCharCount: function(e, t, i, n) {
        var a = $(e.delegatedTarget.form);
        n = n || a.find("input");
        var o = a.find(".char-count"),
            s = n.val().length,
            r = t.inputLengthMaxDatabase - s;
        o.text(r).removeClass("warn over"), o.mToggle("inline", s >= t.inputLengthShow), n.removeClass("over"), s > t.inputLengthMaxDatabase ? (o.addClass("over"), n.addClass("over")) : s >= t.inputLengthWarn && o.addClass("warn"), i && i(a, s, r)
    },
    moveCursorToEndOfInput: function(e) {
        var t = e[0];
        t.selectionStart = t.selectionEnd = t.value.length
    },
    scrollToEndOfInput: function(e, t) {
        void 0 === t && (t = 0);
        var i = e[0];
        i.scrollWidth > i.clientWidth && (0 !== e.scrollLeft() && e.scrollLeft(0), e.animate({
            scrollLeft: i.scrollWidth - i.clientWidth
        }, t))
    },
    toggleAdvanced: function(e) {
        var t = e.$(".wrapper-advanced"),
            i = e.$(".smooth-height-content");
        e.resizeSensorSet || (this.initializeResizeSensor(e, i, e.$(".smooth-height-wrapper")), e.resizeSensorSet = !0), i.toggleClass("active"), !e.wrapperAdvancedIsInFlow && i.hasClass("active") && (e.wrapperAdvancedIsInFlow = !0, t.css("display", "block"))
    },
    initializeResizeSensor: function(e, t, i) {
        e.resizeSensor && e.resizeSensor.detach(), i.css("height", t.height()), e.resizeSensor = new ResizeSensor(t, function() {
            t.hasClass("active") ? i.css("height", t.height()) : i.css("height", 0)
        })
    },
    sendEventToggleFeed: function(e, t, i) {
        m.sendEvent(e, t, "turned " + (i ? "on" : "off"))
    },
    getInitialFeedSettings: function(e) {
        var t = !0,
            i = !1;
        return "false" === localStorage.getItem(e.feedMomentumName) && (t = !1), "true" === localStorage.getItem(e.feedCustomName) && (i = !0), {
            feedMomentumClass: t ? "on" : "",
            feedCustomClass: i ? "on" : ""
        }
    },
    setFeedVars: function(e) {
        e.$feedMomentumSlider = e.$("#feed-momentum-slider"), e.$feedCustomSlider = e.$("#feed-custom-slider")
    },
    updateFeedSettings: function(e) {
        var t = e.settings.get(e.manager.feedMomentumName),
            i = e.settings.get(e.manager.feedCustomName);
        e.$("#feed-momentum-slider").toggleClass("on", t), e.$("#feed-custom-slider").toggleClass("on", i), localStorage.setItem(e.manager.feedMomentumName, t), localStorage.setItem(e.manager.feedCustomName, i)
    },
    subnavAddAll: function(t, i, e, n, a) {
        _.each(t.subViews, function(e) {
            e.destroy()
        }), t.subViews = [], t.collection.each(function(e) {
            t.addOne(e, i)
        }), t.$empty.removeClass("loading"), t.handleCollectionUpdate(), void 0 !== n && n(t), e.removeClass("hidden"), void 0 !== a && a()
    },
    subnavAddOne: function(e, t, i, n, a) {
        var o = t.render().$el;
        e.subViews.push(t), n ? i.prepend(o) : i.append(o), a && o.addClass("animate-item"), setTimeout(function() {
            o.removeClass("animate-item")
        }, 300)
    },
    renderSubnav: function(e, t, i) {
        e.$(".list-body").hide(), t.render(), e.$(".subnav-titles").find("h4").removeClass("active").siblings("." + i).addClass("active"), t.$el.css("display", "block"), e.subnav = i
    },
    updateEmptyState: function(e) {
        e.$empty.mToggle("block", 0 === e.collection.length)
    },
    subnavHistoryLoadMore: function(e, t, i) {
        e.stopPropagation(), i.LoadMoreHistory(), m.settingsUtils.subnavHistoryUpdateLoadMore(t)
    },
    subnavHistoryUpdateLoadMore: function(e) {
        void 0 === e && (e = this), e.$(".load-more").mToggle("inline-block", !!e.collection.load_more)
    },
    handleCollectionUpdateCustom: function(e, t, i) {
        e.deletingFinalItem ? setTimeout(function() {
            e.deletingFinalItem = !1, e.cancelAdd(), m.settingsUtils.displayEmptyStateAndAddForm(e, t, i)
        }, m.utils.mConst("timeContentItemAnimation")) : m.settingsUtils.displayEmptyStateAndAddForm(e, t, i)
    },
    displayEmptyStateAndAddForm: function(e, t, i) {
        t.mToggle("block", i), m.settingsUtils.updateAddFormBorder(e.$addForm, i)
    },
    updateAddFormBorder: function(e, t) {
        e.toggleClass("no-top-border", t)
    },
    cancelAddGeneral: function(e, t) {
        t && t.preventDefault(), e.$addForm.is(":visible") && (e.resetAdd(!0), e.toggleAddForm())
    },
    changeToEditMode: function(e, t) {
        m.settingsUtils.triggerItemEditing(e), e.$el.addClass("editing"), t.trigger("focus"), m.settingsUtils.moveCursorToEndOfInput(t), m.settingsUtils.scrollToEndOfInput(t, m.utils.mConst("timeSmoothScroll"))
    },
    handleKeypressEnter: function(e, t, i) {
        13 === e.keyCode ? (e.preventDefault(), e.shiftKey || e.ctrlKey || e.metaKey || e.altKey || t()) : void 0 !== i && m.settingsUtils.checkForInputMaxLengthError(i)
    },
    handleKeyupEsc: function(e, t) {
        27 === e.keyCode && (e.stopPropagation(), t())
    },
    triggerItemEditing: function(e) {
        e.main.itemEditingId = e.model.id, e.manager.trigger("item-editing")
    },
    preventMultipleEdits: function(e) {
        void 0 === e && (e = this), e.model.id !== e.main.itemEditingId && m.settingsUtils.returnToViewMode(e)
    },
    getOutOfEditMode: function(e) {
        e.$el.removeClass("editing"), e.updateTooltip && e.updateTooltip()
    },
    returnToViewMode: function(e) {
        void 0 === e && (e = this), e.$el.hasClass("editing") && e.processEditForm(), e.$(".delete-group").is(":visible") && e.toggleDeleteConf()
    },
    onDestroyModel: function() {
        if (1 === this.main.collection.length) this.main.deletingFinalItem = !0, _.bind(this.destroy, this)();
        else {
            this.$el.addClass("animate-item reverse");
            var e = this;
            setTimeout(function() {
                _.bind(e.destroy, e)(), e.main.syncHelper && e.main.syncHelper()
            }, 300)
        }
    },
    toggleDeleteConf: function(e) {
        var t = e.$(".controls"),
            i = e.$(".controls > .control"),
            n = e.$(".delete-group");
        n.css("display", n.is(":visible") ? "none" : "flex"), n.is(":visible") && m.settingsUtils.triggerItemEditing(e), t.toggleClass("delete-clicked"), i.mToggle("inline-flex")
    },
    processEditFormBasic: function(e, t) {
        var i = t ? "set" : "save",
            n = e.$input.val().trim();
        m.utils.betweenInclusive(n.length, 1, e.main.inputLengthMaxDatabase) ? (e.model[i]({
            body: n
        }, {
            wait: !0,
            patch: !0,
            success: function() {
                m.settingsUtils.getOutOfEditMode(e), e.manager.handleItemEdit(e.model)
            },
            error: function() {
                console.error("edit content item error for view:", e)
            }
        }), m.sendEvent(e.main.panelTitle, "Edit")) : m.settingsUtils.flashInputLengthError(e.$input)
    },
    abortEditBasic: function(e) {
        e.$input.val(e.model.get("body")), m.settingsUtils.getOutOfEditMode(e)
    }
};
for (var key in settingsUtils) m.settingsUtils[key] = settingsUtils[key];

function sendUpsellClickEvent(e, t) {
    (t = t || {}).source && (m.sendEvent("Upsell click", t.source), t.url && (t.url += "&utm_campaign=" + encodeURIComponent(t.source)));
    var i = localStorage.getItem("offered-plan");
    t.url && i && m.conditionalFeatures.featureEnabled("notes-degraded") && (t.url += "&resubscribe=" + i), e && e.experiment && m.sendEvent("Settings", "Upgrade", null, null, e.experiment.correlationId, e.experiment.experimentId, e.experiment.id)
}

function buildAccountLinkPathFromParameter(e) {
    if (!e) return null;
    var t = null;
    return "string" == typeof e ? t = e : "object" == typeof e && e.path && (t = e.path), t ? (t.startsWith("/") && (t = t.substring(1)), t) : null
}

function sendUpsellClickEvent(e, t) {
    (t = t || {}).source && (m.sendEvent("Upsell click", t.source), t.url && (t.url += "&utm_campaign=" + encodeURIComponent(t.source)));
    var i = localStorage.getItem("offered-plan");
    t.url && i && m.conditionalFeatures.featureEnabled("notes-degraded") && (t.url += "&resubscribe=" + i), e && e.experiment && m.sendEvent("Settings", "Upgrade", null, null, e.experiment.correlationId, e.experiment.experimentId, e.experiment.id)
}
m.models.PersistentSettings = Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage("momentum-customization"),
    defaultForTeamIfNotSet: {
        themeColour: "system"
    },
    defaultIfNotSet: {
        mantraVisible: !1,
        quoteVisible: !0,
        bookmarksVisible: !1,
        linksVisible: !0,
        focusVisible: !0,
        todoVisible: !0,
        metricVisible: !0,
        weatherVisible: !0,
        searchVisible: !0,
        requestSync: !1,
        keepTodoState: !0,
        countdownVisible: !0,
        notesVisible: !0,
        percentClock: !1,
        multiClockVisible: !0,
        linksKeepOpen: !1,
        themeColour: "system",
        autoFocus: !0,
        balanceModeStr: "",
        mantraSettingsStr: "",
        bookmarksSettingsStr: "",
        weatherDetail: !0,
        weatherHourly: !0,
        searchProvider: m.utils.isEdge() ? "bing" : "google",
        appRegionOverrides: {},
        hour12clock: "M" === (new Date).toLocaleString(window.navigator.userLanguage || window.navigator.language || "en-US").substr(-1),
        pomodoroSettingsStr: '{"autoplay":false,"hideSeconds":false,"focusDuration":25,"restDuration":5}'
    },
    initialize: function() {
        var t = this;
        t.fetching = !1, window.addEventListener("storage", function(e) {
            e.key && 0 === e.key.indexOf("momentum-customization-1") && (t.fetching = !0, t.fetch({
                success: function() {
                    t.fetching = !1
                },
                error: function() {
                    t.fetching = !1
                },
                reset: !0,
                fromStorage: !0
            }))
        })
    },
    get: function(e) {
        var t = this.constructor.__super__.get.apply(this, arguments);
        if (null == t) {
            var i = this.defaultIfNotSet.hasOwnProperty(e),
                n = m.conditionalFeatures.featureEnabled("team") && this.defaultForTeamIfNotSet.hasOwnProperty(e);
            if (!i && !n) return t;
            n && (t = this.defaultForTeamIfNotSet[e] instanceof Function ? this.defaultForTeamIfNotSet[e]() : this.defaultForTeamIfNotSet[e]), null == t && i && (t = this.defaultIfNotSet[e] instanceof Function ? this.defaultIfNotSet[e]() : this.defaultIfNotSet[e])
        }
        return t
    },
    save: function() {
        for (var e = !1, t = 0; t++;) {
            var i = arguments[t];
            i && i.fromStorage && (e = !0)
        }
        e || Backbone.Model.prototype.save.apply(this, arguments)
    }
}), m.models.MantraManager = m.models.FeedManager.extend({
    activatingFirstMantra: !1,
    dateInitialized: null,
    defaults: {
        momo: !0,
        custom: !1
    },
    durationGreetingFirstTabOfDay: 4e3,
    frequencyData: {
        durationGreeting: 6e4,
        durationMantra: 3e4,
        tabFrequency: 2
    },
    frequencyLevels: [{
        level: 0,
        label: "Rarely",
        durationGreeting: 18e4,
        durationMantra: 2e4,
        tabFrequency: 8
    }, {
        level: 2,
        label: "Often",
        durationGreeting: 45e3,
        durationMantra: 3e4,
        tabFrequency: 2
    }, {
        level: 3,
        label: "Always",
        durationGreeting: null,
        durationMantra: null,
        tabFrequency: null
    }],
    frequencyVariation: .25,
    keyHasSeenGreetingPrefix: "momentum-mantra-has-seen-greeting-",
    keyTabCountLegacy: "momentum-mantra-tab-count",
    keyTabCountPrefix: "momentum-mantra-tab-count-",
    showNameFrequency: .3,
    stringsThatPrecludeNames: [" I ", " ME ", " MINE ", " MY ", ". ", ", ", "; "],
    initialize: function() {
        m.models.FeedManager.prototype.initialize.call(this, m.models.Mantra, "mantra"), this.firstFetch(), this.settings = m.models.mantraSettings = new m.models.MantraSettings({
            id: 1
        }), this.initializeMantraDailyData(), this.randomizeFrequency(), this.listenTo(this.itemCollection, "reset", this.onItemCollectionReset), this.listenTo(this, "mantra:deleted", this.handleMantraDelete), this.listenTo(m, "readyForWidgets", this.onSuccessfulLogin), this.listenTo(m, "newDay", this.onNewDayMantras), this.listenTo(m.models.mantraSettings, "change:frequency", this.onChangeFrequency), this.listenTo(m.models.customization, "change:mantraVisible", this.onChangeMantraVisible)
    },
    onItemCollectionReset: function() {
        this.trigger("mantra-active-change")
    },
    isEnabled: function() {
        return m.models.customization.get("mantraVisible")
    },
    toggleEnabled: function() {
        m.models.customization.toggle("mantraVisible")
    },
    hasSeenGreetingToday: function() {
        return JSON.parse(localStorage.getItem(this.keyHasSeenGreetingToday))
    },
    markGreetingAsSeenToday: function() {
        localStorage.setItem(this.keyHasSeenGreetingToday, "true")
    },
    isInAlternatingMode: function() {
        return !this.isFrequencyAlways() && !this.isMantraPinned()
    },
    isFrequencyAlways: function() {
        return this.settings.getFrequency() === this.settings.frequencies.always
    },
    isMantraPinned: function() {
        return !!this.getPinnedMantra()
    },
    activeFeedsEmpty: function() {
        return this.itemCollection.empty()
    },
    updateInFeed: function(e) {
        var t = this.itemCollection.findWhere({
            _id: e.get("_id") || e.get("id")
        });
        t && (t.save({
            is_favorite: e.get("is_favorite"),
            body: e.get("body")
        }), t.get("_id") === this.getActiveItem().get("_id") && (this.getActiveItem().isPinned() && this.savePinnedVars(t), this.trigger("mantra-active-edit")))
    },
    setActive: function(n) {
        this.unpinMantra();
        var e = m.globals.urlRootApi + "settings/mantra/active",
            a = n.get("_id") || n.get("id"),
            o = this;
        return new Promise(function(t, i) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    mantra_id: a
                }),
                url: e
            }).done(function(e) {
                e && e.success ? (o.getActiveItem().set({
                    body: n.get("body"),
                    _id: a,
                    is_custom: n.get("is_custom"),
                    is_favorite: n.get("is_favorite")
                }), m.trigger("sync:download", "mantra"), t(n)) : i(n)
            }).fail(function() {
                i(n)
            })
        })
    },
    onChangeMantraVisible: function() {
        if (this.activeFeedsEmpty()) return this.trigger("wait-for-mantra"), void this.getActiveItem();
        if (this.isEnabled()) this.randomizeFrequency();
        else {
            if (!0 === this.mantraDisablingInProgress) return;
            this.mantraDisablingInProgress = !0, this.unpinMantra(), this.mantraDisablingInProgress = !1, this.trigger("mantra-active-change")
        }
    },
    getDuration: function(e) {
        return "greeting" === e ? this.frequencyData.durationGreeting : "mantra" === e ? this.frequencyData.durationMantra : void 0
    },
    getDurationTotal: function() {
        return this.frequencyData.durationGreeting + this.frequencyData.durationMantra
    },
    checkIfMantraShouldBeShown: function() {
        return !!localStorage.getItem("mantra:force") || !localStorage.getItem("greeting:force") && (!(!this.mantrasEnabledAndAvailable() || !this.hasSeenGreetingToday()) && (this.activatingFirstMantra ? !(this.activatingFirstMantra = !1) : !this.isInAlternatingMode() || this.checkMantraTabFrequency()))
    },
    shouldShowMantraAfterGreetingFirstTabOfDay: function() {
        return this.mantrasEnabledAndAvailable() && !this.hasSeenGreetingToday() && !this.isInAlternatingMode()
    },
    mantrasEnabledAndAvailable: function() {
        return this.getActiveItem() && this.isEnabled()
    },
    checkMantraTabFrequency: function() {
        var e = localStorage.getItem(this.keyTabCountToday) >= this.frequencyData.tabFrequency;
        return e && this.resetTabCount(), e
    },
    onChangeFrequency: function() {
        this.resetAndRandomize(), this.isMantraPinned() && this.unpinMantra(!0)
    },
    randomizeFrequency: function() {
        var e = this.lookupFrequencyBaseline();
        if (this.isFrequencyAlways()) this.frequencyData.tabFrequency = e.tabFrequency, this.frequencyData.durationGreeting = e.durationGreeting, this.frequencyData.durationMantra = e.durationMantra;
        else {
            var t = 1 - this.frequencyVariation,
                i = 1 + this.frequencyVariation;
            this.frequencyData.tabFrequency = this.randomizeTabFrequency(e.tabFrequency), this.frequencyData.durationGreeting = m.utils.getRandomIntInclusive(t * e.durationGreeting, i * e.durationGreeting), this.frequencyData.durationMantra = m.utils.getRandomIntInclusive(t * e.durationMantra, i * e.durationMantra)
        }
    },
    lookupFrequencyBaseline: function() {
        return _.where(this.frequencyLevels, {
            level: this.settings.getFrequency()
        })[0]
    },
    randomizeTabFrequency: function(e) {
        var t = e * (1 - this.frequencyVariation),
            i = e * (1 + this.frequencyVariation);
        return i - t < 2 && (t = 2 === e ? 2 : e - 1, i = e + 1), m.utils.getRandomIntInclusive(t, i)
    },
    initializeMantraDailyData: function() {
        m.models.cleanupManager.registerKey(this.keyTabCountLegacy), m.models.cleanupManager.registerKeyPrefix(this.keyTabCountPrefix, {
            pastDaysToKeep: 0
        }), m.models.cleanupManager.registerKeyPrefix(this.keyHasSeenGreetingPrefix, {
            pastDaysToKeep: 0
        });
        var e = m.utils.getDateString();
        this.dateInitialized = e, this.keyTabCountToday = this.keyTabCountPrefix + e, this.keyHasSeenGreetingToday = this.keyHasSeenGreetingPrefix + e;
        var t, i = parseInt(localStorage.getItem(this.keyTabCountToday));
        isNaN(i) ? (t = 1, localStorage.setItem(this.keyHasSeenGreetingToday, "false")) : t = i + 1, localStorage.setItem(this.keyTabCountToday, t)
    },
    resetTabCount: function() {
        localStorage.setItem(this.keyTabCountToday, "0")
    },
    resetAndRandomize: function() {
        this.resetTabCount(), this.randomizeFrequency()
    },
    onNewDayMantras: function() {
        this.tabWasLeftOvernight() && (this.initializeMantraDailyData(), this.trigger("show-greeting"))
    },
    tabWasLeftOvernight: function() {
        return this.dateInitialized !== m.utils.getDateString()
    },
    getActiveItem: function() {
        var e, t = this,
            i = this.getPinnedMantra();
        if (i) return (e = this.itemCollection.findWhere({
            forDate: "pinned"
        })) && e.get("_id") === i.id ? e : this.itemCollection.create({
            forDate: "pinned",
            _id: i.id,
            body: i.body,
            is_custom: i.isCustom,
            is_favorite: i.isFavorite
        });
        if (m.collect.mantras && this.isEnabled()) {
            if (!(e = m.collect.mantras.getActiveItem())) return m.trigger("sync:download", "mantra"), null;
            if (e.get("hardSkip")) return this.noMantra = !0, null;
            var n = !1;
            return this.currentMantra && this.currentMantra.get("_id") === e.get("_id") ? this.currentMantra.get("body") !== e.get("body") && (this.currentMantra = e, n = !0) : (this.currentMantra = e, n = !0), n && setTimeout(function() {
                m.trigger("mantra:active_changed", t.currentMantra.get("_id"))
            }, 50), e
        }
        return null
    },
    activateFirstMantra: function() {
        m.models.customization.save("mantraVisible", !0), this.settings.save({
            firstMantraActivated: !0
        }), this.getActiveItem(), this.activatingFirstMantra = !0, this.trigger("wait-for-mantra")
    },
    getPinnedMantra: function() {
        return this.settings ? this.settings.get("pinnedMantra") : null
    },
    pinMantra: function(e, t) {
        var i = this.getPinnedMantra(),
            n = e.get("_id") || e.get("id");
        i && n === i.id ? (this.unpinMantra(!0), this.resetAndRandomize()) : (this.savePinnedVars(e, t), this.trigger("mantra-pin"))
    },
    unpinMantra: function(e) {
        this.isMantraPinned() && this.settings.save({
            pinnedMantra: null
        });
        var t = m.collect.mantras.get("pinned");
        t && t.destroy(), e && this.trigger("mantra-un-pin")
    },
    savePinnedVars: function(e, t) {
        var i = this.settings.get("pinnedMantra");
        i && (t = t || i.showName), this.settings.save({
            pinnedMantra: {
                id: e.get("_id") || e.get("id"),
                body: e.get("body"),
                isFavorite: e.get("is_favorite"),
                isCustom: e.get("is_custom"),
                showName: t
            }
        })
    },
    toggleFav: function(e) {
        var t = e.get("id") || e.get("_id");
        return this.feedContains(t) ? this.toggleFavFeedItem(t) : this.toggleFavorite(e.get("is_favorite"), e)
    },
    toggleFavFeedItem: function(i) {
        var n = this,
            a = this.itemCollection.where({
                _id: i
            }),
            o = a[0].get("is_favorite"),
            s = !o,
            r = this.getPinnedMantra(),
            l = this.getActiveItem();
        return a.map(function(e) {
            e.save({
                is_favorite: s
            })
        }), r && i === r.id && this.setPinnedProperty("isFavorite", s), l && i === l.get("_id") && this.trigger("mantra-active-fav"), new Promise(function(e, t) {
            n.toggleFavorite(s, a[0]).then(function() {
                e()
            }).catch(function() {
                a.map(function(e) {
                    e.save({
                        is_favorite: o
                    })
                }), r && i === r.id && n.setPinnedProperty("isFavorite", o), l && i === l.get("_id") && n.trigger("mantra-active-fav"), t()
            })
        })
    },
    setPinnedProperty: function(e, t) {
        var i = Object.assign({}, this.settings.get("pinnedMantra"));
        i[e] = t, this.settings.save({
            pinnedMantra: i
        })
    },
    feedContains: function(e) {
        return !!this.itemCollection.findWhere({
            _id: e
        })
    },
    handleMantraDelete: function(e) {
        var t = this.getActiveItem();
        t && t.get("_id") === e && (t.isPinned() && this.unpinMantra(), this.trigger("showGreeting"), m.trigger("sync:download", "mantra"))
    },
    getMantraForDisplay: function(e, t) {
        return e ? (void 0 !== this.showName && t || (this.isMantraPinned() ? this.showName = this.getPinnedMantra().showName : this.showName = m.utils.getRandomBoolByFrequency(this.showNameFrequency)), localStorage.getItem("mantra:forceName") && (this.showName = "true" === localStorage.getItem("mantra:forceName")), this.formatMantraForDisplay(e.get("body"), this.showName)) : null
    },
    formatMantraForDisplay: function(e, t) {
        e = e.trim();
        var i = m.utils.getEndPunctuationString(e),
            n = e.slice(0, e.length - i.length),
            a = "";
        return t && this.mantraWorksWithName(n) && (n += ", ", a = m.models.customization.get("displayname"), m.utils.endsWithEndPunctuation(a) && (i = "")), {
            bodyFormatted: n + a + i,
            start: n,
            name: a,
            end: i
        }
    },
    mantraWorksWithName: function(e) {
        var t, i = !0,
            n = m.models.customization.get("displayname").toUpperCase();
        if (!n) return !1;
        e = e.toUpperCase();
        for (var a = 0; a < this.stringsThatPrecludeNames.length; a++)
            if (t = this.stringsThatPrecludeNames[a], -1 !== e.indexOf(n) || -1 !== e.indexOf(t) || e.startsWith(t.trim() + " ") || e.endsWith(" " + t.trim())) {
                i = !1;
                break
            } return i
    },
    skipItem: function(e) {
        return e && !m.conditionalFeatures.featureEnabled("plus") && (this.noMantra = !0), this.isMantraPinned() && this.unpinMantra(), m.models.FeedManager.prototype.skipItem.apply(this, arguments)
    }
}), m.models.MantraSettings = Backbone.Model.extend({
    defaults: {
        pinnedMantra: null,
        firstMantraActivated: !1,
        frequency: 2
    },
    frequencies: {
        low: 0,
        medium: 2,
        high: 2,
        always: 3
    },
    initialize: function() {
        this.listenTo(m.models.customization, "change:mantraSettingsStr", this.customizationChanged), m.models.customization.initialized ? this.customizationChanged() : this.listenTo(m.models.customization, "initialized", this.customizationChanged)
    },
    customizationChanged: function(e, t) {
        if (!t || !t.savingMantraSettings) {
            var i = m.models.customization.get("mantraSettingsStr");
            i && i !== this.mantraSettingsStr && 0 < i.length && this.reset()
        }
    },
    getFrequency: function() {
        var t, e = this.get("frequency");
        return t = "string" == typeof e && isNaN(+e) ? this.frequencies[e] : "string" != typeof e || isNaN(+e) ? e : parseInt(e), void 0 === _.find(this.frequencies, function(e) {
            return e === t
        }) && (t = this.defaults.frequency), t
    },
    reset: function() {
        this.mantraSettingsStr = m.models.customization.get("mantraSettingsStr");
        if (this.mantraSettingsStr && 0 < this.mantraSettingsStr.length) {
            var t = JSON.parse(this.mantraSettingsStr),
                i = this;
            ["pinnedMantra", "firstMantraActivated", "frequency"].forEach(function(e) {
                i.set(e, void 0 === t[e] ? i.defaults[e] : t[e])
            })
        }
    },
    save: function() {
        Backbone.Model.prototype.set.apply(this, arguments), m.models.customization.initialized && m.models.customization.save({
            mantraSettingsStr: JSON.stringify(this.attributes)
        }, {
            savingMantraSettings: !0
        })
    }
}), m.models.Settings = Backbone.Model.extend({
    defaults: {},
    initialize: function() {}
}), m.models.GenericSettings = Backbone.Model.extend({
    initialize: function(e) {
        this.feedType = e, this.urlPath = "settings/" + e, this.url = m.globals.urlRoot + this.urlPath;
        var t = localStorage.getItem("cached-" + this.urlPath);
        t && this.set(JSON.parse(t)), this.listenTo(this, "sync", this.saveLocal)
    },
    saveLocal: function() {
        localStorage.setItem("cached-" + this.urlPath, JSON.stringify(this.attributes))
    },
    save: function(e, t) {
        (t = t || {}).patch = !0;
        var n = this,
            a = t.success;
        t.success = function(e, t, i) {
            n.saveLocal(), a && a(e, t, i)
        }, m.isLoggedIn() ? Backbone.Model.prototype.save.call(this, e, t) : Backbone.Model.prototype.set.call(this, e, t), n.saveLocal()
    },
    toggle: function(e) {
        var t = {};
        this.has(e) ? t[e] = !this.get(e) : t[e] = !0;
        var i = {},
            n = this;
        0 <= e.indexOf("feed") && (i.success = function() {
            m.trigger("sync:download", n.feedType)
        }), this.save(t, i)
    }
}), m.models.BalanceMode = Backbone.Model.extend({
    defaults: {
        enabled: !1,
        active: !1,
        balanceClock: !1,
        balanceTodo: !1,
        balancePercentClock: !1,
        balanceFocus: !0,
        balanceNotes: !1,
        customTime: !1,
        customDays: !1,
        start: {
            hour: 9,
            minute: "00",
            noon: "AM"
        },
        end: {
            hour: 5,
            minute: "00",
            noon: "PM"
        },
        startCustom: {
            hour: 9,
            minute: "00",
            noon: "AM"
        },
        endCustom: {
            hour: 5,
            minute: "00",
            noon: "PM"
        },
        days: [!1, !0, !0, !0, !0, !0, !1],
        daysCustom: [!1, !0, !0, !0, !0, !0, !1],
        percent: ""
    },
    initialize: function(e, t) {
        this.customization = t.customization || m.models.customization, this.updatePercent(), this.listenTo(this.customization, "change:balanceModeStr", this.customizationChanged), this.listenTo(this, "change:enabled", this.balanceChanged), this.listenTo(m.models.date, "change:date", this.checkBalance)
    },
    checkBalance: function() {
        var e = m.date(),
            t = this.getStart(),
            i = this.getEnd(),
            n = this.getDays(),
            a = t.hour + ":" + t.minute + t.noon,
            o = i.hour + ":" + i.minute + i.noon,
            s = this.get("active"),
            r = m.utils.toTodaysTime(o),
            l = m.utils.toTodaysTime(a),
            d = new Date(l.getTime());
        d.setDate(l.getDate() - 1);
        var c = new Date(r.getTime());
        c.setDate(r.getDate() + 1), this.set("active", this.get("enabled") && (!n[e.getDay()] || r.getTime() > l.getTime() && (l.getTime() > e.getTime() || e.getTime() > r.getTime()) || r.getTime() < l.getTime() && !(d.getTime() < e.getTime() && e.getTime() < r.getTime() || l.getTime() < e.getTime() && e.getTime() < c.getTime()))), s !== this.get("active") && this.balanceChanged(), this.updatePercent()
    },
    customizationChanged: function() {
        var e = this.customization.get("balanceModeStr");
        e && e !== this.balanceModeStr && 0 < e.length && this.resetBalanceMode()
    },
    resetBalanceMode: function() {
        if (this.balanceModeStr = this.customization.get("balanceModeStr"), this.balanceModeStr && 0 < this.balanceModeStr.length) {
            var e = JSON.parse(this.balanceModeStr);
            this.set("enabled", void 0 === e.enabled ? this.defaults.enabled : e.enabled), this.set("start", e.start || this.defaults.start), this.set("end", e.end || this.defaults.end), this.set("days", e.days || this.defaults.days), this.set("customDays", void 0 === e.customDays ? this.defaults.customDays : e.customDays), this.set("customTime", void 0 === e.customTime ? this.defaults.customTime : e.customTime), this.set("startCustom", e.startCustom || this.defaults.startCustom), this.set("endCustom", e.endCustom || this.defaults.endCustom), this.set("daysCustom", e.daysCustom || this.defaults.daysCustom), this.set("balanceClock", void 0 === e.balanceClock ? this.defaults.balanceClock : e.balanceClock), this.set("balanceFocus", void 0 === e.balanceFocus ? this.defaults.balanceFocus : e.balanceFocus), this.set("balanceTodo", void 0 === e.balanceTodo ? this.defaults.balanceTodo : e.balanceTodo), this.set("balancePercentClock", void 0 === e.balancePercentClock ? this.defaults.balancePercentClock : e.balancePercentClock), this.set("balanceNotes", void 0 === e.balanceNotes ? this.defaults.balanceNotes : e.balanceNotes), this.initCompleted = !0, this.checkBalance()
        }
    },
    getDays: function() {
        return this.get("customDays") ? this.get("daysCustom") : this.get("days")
    },
    getStart: function() {
        return this.get("customTime") ? this.get("startCustom") : this.get("start")
    },
    getEnd: function() {
        return this.get("customTime") ? this.get("endCustom") : this.get("end")
    },
    get: function(e) {
        return !!("customDays" !== e && "customTime" !== e || m.conditionalFeatures.featureEnabled("plus")) && Backbone.Model.prototype.get.call(this, e)
    },
    balanceChanged: function() {
        this.initCompleted && this.customization.save({
            balanceModeStr: JSON.stringify(this.attributes)
        })
    },
    updatePercent: function() {
        var e = this.getStart(),
            t = this.getEnd(),
            i = parseInt(e.hour);
        12 === i && (i = 0);
        var n = parseInt(t.hour);
        12 === n && (n = 0);
        var a = i + ("PM" === e.noon ? 12 : 0),
            o = parseInt(e.minute),
            s = n + ("PM" === t.noon ? 12 : 0),
            r = parseInt(t.minute) - 1;
        24 < s - a && (s -= 24);
        var l = m.date(),
            d = m.date();
        d.setHours(a, o, 0, 0);
        var c = m.date();
        c.setHours(s, r, 0, 0), d.getTime() > c.getTime() && (l.getTime() <= c.getTime() ? a -= 24 : s += 24), d.setHours(a, o, 0, 0), c.setHours(s, r, 0, 0);
        var u = 60 * (s + r / 60 - (a + o / 60)) * 60,
            g = (l.getTime() - d.getTime()) / 1e3,
            h = Math.floor(g / u * 100);
        100 < h && (h = "+" + (h - 100)), this.set("percent", h)
    }
}), m.models.BookmarksSettings = Backbone.Model.extend({
    defaults: {
        guided: !1,
        iconsOnly: !1,
        openInNewTab: !1,
        appsLocation: "links",
        includeBookmarks: !1,
        includeOtherBookmarks: !1,
        defaultMostVisited: !1,
        includeMostVisited: !0,
        chromeTabLocation: "links"
    },
    initialize: function() {
        this.listenTo(m.models.customization, "change:bookmarksSettingsStr", this.customizationChanged), this.permissions = {
            permissions: ["bookmarks", "topSites"]
        }, m.utils.isChrome() && (this.permissions.origins = ["chrome://favicon/"])
    },
    customizationChanged: function() {
        var e = m.models.customization.get("bookmarksSettingsStr");
        e && e != this.bookmarksSettingsStr && 0 < e.length && this.reset()
    },
    reset: function() {
        this.bookmarksSettingsStr = m.models.customization.get("bookmarksSettingsStr");
        if (this.bookmarksSettingsStr && 0 < this.bookmarksSettingsStr.length) {
            var t = JSON.parse(this.bookmarksSettingsStr),
                i = this;
            ["iconsOnly", "openInNewTab", "appsLocation", "includeBookmarks", "includeOtherBookmarks", "defaultMostVisited", "includeMostVisited", "chromeTabLocation", "guided"].forEach(function(e) {
                i.set(e, null == t[e] ? i.defaults[e] : t[e])
            }), localStorage.setItem("bookmarksEnabled", m.models.customization.get("bookmarksVisible"))
        }
    },
    optionsChanged: function() {
        m.models.customization.save({
            bookmarksSettingsStr: JSON.stringify(this.attributes)
        })
    }
}), m.models.ComputedSettings = Backbone.Model.extend({
    defaults: {
        percentClock: !1,
        todoVisible: !1,
        focusVisible: !1,
        autoFocus: !1,
        clockVisible: !1,
        notesVisible: !1
    },
    settingOverriders: {
        TEAM: 0,
        BALANCE: 1
    },
    overrides: {},
    initializeSettings: function() {
        var t = this;
        this.persistentSettings = new m.models.PersistentSettings({
            id: 1
        }), this.listenTo(this.persistentSettings, "change", this.computeProperties), this.listenTo(this.persistentSettings, "sync", function() {
            var e = t.persistentSettings.get("balanceModeStr");
            e && 0 < e.length && (m.models.balanceMode.resetBalanceMode(), t.computeProperties()), t.initialized || (t.initialized = !0, t.updateSearchSettings(), t.trigger("initialized"))
        }), m.conditionalFeatures = new m.models.ConditionalFeatures({
            customization: this
        }), m.models.balanceMode = this.balanceMode = new m.models.BalanceMode({
            id: 1
        }, {
            customization: this
        }), m.models.bookmarksSettings = new m.models.BookmarksSettings({
            id: 1
        }), this.persistentSettings.fetch({
            error: function(e, t) {
                "Record Not Found" == t && e.save()
            }
        })
    },
    updateSearchSettings: function() {
        if (!m.isLoggedIn()) {
            var e = localStorage.getItem("client_uuid");
            if (e && 0 !== e.length && ("0" === (e = e.toLowerCase())[0] || "1" === e[0])) {
                if (this.persistentSettings.get("searchUpdated")) return;
                var t = {
                        searchUpdated: !0,
                        searchVisible: null
                    },
                    i = this.persistentSettings.get("searchProvider");
                "google" !== i && "bing" !== i && (t.searchProvider = null), this.persistentSettings.save(t), m.usage.save({
                    type: m.usage.types.SYSTEM,
                    action: "client-search-update",
                    provider: i || null
                }, !0, !0)
            }
        }
    },
    checkBalanceMode: function(e, t, i) {
        var n = this.attributes[e],
            a = !!i || (!this.persistentSettings.has(e) || this.persistentSettings.get(e));
        this.attributes[e] = a && !(m.models.balanceMode.get("active") && m.models.balanceMode.get(t)), this.persistentSettings.get(e) !== this.attributes[e] && (this.overrides[e] = this.settingOverriders.BALANCE), n !== this.attributes[e] && this.trigger("change:" + e)
    },
    checkTeamOverride: function(e, t) {
        var i = m.models.teamInfo.get("team");
        if (i) {
            var n = this.attributes[e],
                a = this.persistentSettings.get(e);
            this.attributes[e] = a || !i[t], a !== this.attributes[e] && (this.overrides[e] = this.settingOverriders.TEAM), n !== this.attributes[e] && this.trigger("change:" + e)
        }
    },
    checkAutoFocus: function() {
        var e = "autoFocus",
            t = this.attributes[e];
        return this.attributes[e] = this.persistentSettings.get(e) && this.persistentSettings.get("todoVisible") && m.conditionalFeatures.featureEnabled("plus"), t != this.attributes[e]
    },
    computeProperties: function(t, i, n) {
        var a = this;
        this.checkBalanceMode("todoVisible", "balanceTodo"), this.checkBalanceMode("percentClock", "balancePercentClock"), this.checkBalanceMode("clockVisible", "balanceClock", !0), this.checkBalanceMode("focusVisible", "balanceFocus"), this.checkBalanceMode("notesVisible", "balanceNotes"), this.checkTeamOverride("focusVisible", "focusEmpty"), this.checkTeamOverride("multiClockVisible", "clocksEmpty"), this.checkTeamOverride("countdownVisible", "countdownsEmpty");
        var e = this.persistentSettings.changedAttributes();
        e = e || {}, this.checkAutoFocus() && !e.autoFocus && (e.autoFocus = this.attributes.autoFocus), _.keys(e).forEach(function(e) {
            a.trigger("change:" + e, t, i, n)
        }), this.trigger("change", t, i, n)
    },
    get: function(e) {
        return this.persistentSettings.get(e)
    },
    getPersistentSettings: function() {
        return this.persistentSettings
    },
    getComputedSetting: function(e) {
        return null != this.attributes[e] ? Backbone.Model.prototype.get.call(this, e) : this.persistentSettings.get(e)
    },
    set: function() {
        arguments[0].id ? Backbone.Model.prototype.set.apply(this, arguments) : this.persistentSettings.set.apply(this.persistentSettings, arguments)
    },
    save: function() {
        this.persistentSettings.save.apply(this.persistentSettings, arguments)
    },
    fetch: function() {
        this.persistentSettings.fetch.apply(this.persistentSettings, arguments)
    },
    toggle: function(e) {
        if (e) {
            var t = !this.get(e),
                i = {};
            i[e] = t, this.save(i)
        }
    }
}), m.collect.Mantras = Backbone.Collection.extend({
    loadedOnce: !1,
    initialize: function() {
        this.model = m.models.Mantra, this.collectionName = "momentum-mantra", this.localStorage = new Backbone.LocalStorage(this.collectionName), this.listenToOnce(this, "reset", this.onReset)
    },
    getActiveItem: function() {
        if (0 < this.length) {
            var e = m.utils.getDateString();
            return this.get(e)
        }
    },
    onReset: function() {
        this.loadedOnce = !0
    },
    empty: function() {
        return 0 === this.models.length
    }
}), m.collect.Settings = Backbone.Collection.extend({
    saveOptions: {
        patch: !0
    },
    initialize: function() {
        this.model = m.models.Settings
    }
}), m.views.settings = m.views.settings || {}, m.views.settings.SettingsPane = Backbone.View.extend({
    attributes: {
        id: "settings",
        class: "app-container settings",
        "data-test": "settings"
    },
    renderedOnce: !1,
    events: {
        "click .toggle": "toggleShow"
    },
    libraryLoadStarted: !1,
    initialize: function() {
        this.subViews = [], this.render(), this.listenTo(m, "globalEvent:esc globalEvent:toggle", this.hideSettings), this.listenTo(m, "globalEvent:toggleSettings", this.toggleShow), this.listenTo(m, "settings:visible", this.settingsVisible), this.listenTo(m, "settings:hidden", this.settingsHidden), this.visible = !1, this.$el.clickOutside(this, this.hideSettings)
    },
    render: function() {
        if (!this.renderedOnce) {
            var e = (this.options.order || "append") + "To";
            this.$el[e]("." + this.options.region).html('<span class="app-dash toggle" data-test="settings-toggle" data-ob="settings-toggle"><svg class="toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340.274 340.274"><path d="M293.629 127.806l-5.795-13.739c19.846-44.856 18.53-46.189 14.676-50.08l-25.353-24.77-2.516-2.12h-2.937c-1.549 0-6.173 0-44.712 17.48l-14.184-5.719c-18.332-45.444-20.212-45.444-25.58-45.444h-35.765c-5.362 0-7.446-.006-24.448 45.606l-14.123 5.734C86.848 43.757 71.574 38.19 67.452 38.19l-3.381.105-27.27 26.737c-4.138 3.891-5.582 5.263 15.402 49.425l-5.774 13.691C0 146.097 0 147.838 0 153.33v35.068c0 5.501 0 7.44 46.585 24.127l5.773 13.667c-19.843 44.832-18.51 46.178-14.655 50.032l25.353 24.8 2.522 2.168h2.951c1.525 0 6.092 0 44.685-17.516l14.159 5.758c18.335 45.438 20.218 45.427 25.598 45.427h35.771c5.47 0 7.41 0 24.463-45.589l14.195-5.74c26.014 11 41.253 16.585 45.349 16.585l3.404-.096 27.479-26.901c3.909-3.945 5.278-5.309-15.589-49.288l5.734-13.702c46.496-17.967 46.496-19.853 46.496-25.221V151.88c-.005-5.519-.005-7.446-46.644-24.074zM170.128 228.474c-32.798 0-59.504-26.187-59.504-58.364 0-32.153 26.707-58.315 59.504-58.315 32.78 0 59.43 26.168 59.43 58.315-.006 32.177-26.656 58.364-59.43 58.364z" fill="#FFF"/></svg></span>'), this.renderedOnce = !0
        }
        return this
    },
    toggleShow: function(e) {
        e && (e.preventDefault(), e.stopPropagation()), m.trigger("globalEvent:click", this), this.visible ? m.commandManager.execute("settings.toggle") : (this.initializeSettings().then(function() {
            m.commandManager.execute("settings.toggle")
        }), m.sendEvent("Settings", "Show"))
    },
    initializeSettings: function() {
        var t = this;
        return new Promise(function(e) {
            t.initialized ? e() : (this.initialized = !0, m.commandManager.ensureCommandLoaded("settings.initialize", function() {
                t.mainSettings = m.commandManager.execute("settings.initialize", t.$el), setTimeout(function() {
                    e()
                }, 50)
            }))
        })
    },
    hideSettings: function(e) {
        e != this && (e && e.originalEvent && "click" === e.type && e.target && this.mainSettings && $.contains(this.mainSettings.el, e.target) || (m.commandManager.execute("settings.hide"), this.visible = !1))
    },
    settingsVisible: function() {
        this.$el.addClass("show").width(), this.$el.addClass("show-fade-in"), this.visible = !0
    },
    settingsHidden: function(e) {
        if (e && e.preventDefault(), this.$el.hasClass("show")) {
            this.visible = !1;
            var t = this;
            this.$el.removeClass("show-fade-in").on("transitionend webkitTransitionEnd", function e() {
                t.$el.removeClass("show"), t.$el.off("transitionend webkitTransitionEnd", e)
            })
        }
    }
}), m.views.upsell = m.views.upsell || {}, m.views.upsell.Message = Backbone.View.extend({
    showing: !1,
    events: {
        "click .hide": "hideUpsell",
        "click .upsell-action": "clickButton"
    },
    initialize: function(e) {
        this.template = e.template, this.options = e, this.listenTo(m, "globalEvent:click", this.handleClick)
    },
    render: function() {
        return this.options.class = (this.options.class ? this.options.class + " " : "") + this.options.targetRegion + "-upsell", this.$el.attr("data-test", this.options.targetRegion + "-upsell"), this.$el.html(this.template(this.options)), this.$el.addClass("overlay upsell"), this.$el.addClass(this.options.class), this
    },
    show: function() {
        var e = this,
            t = this.$el.height(),
            i = this.$el.width();
        this.$el.addClass("show"), this.showing = !0, "greeting" === this.options.targetRegion && this.$el.parent().find(".dropdown-list").css("opacity", 0), setTimeout(function() {
            e.parentMinHeight = e.$el.parent().css("min-height"), e.parentMinWidth = e.$el.parent().css("min-width"), e.$el.parent().css({
                "min-height": Math.max(t, e.$el.parent().height()),
                "min-width": Math.max(i, e.$el.parent().width())
            }), e.$el.addClass("show-fade-in")
        }, 10)
    },
    hideUpsell: function(e) {
        e && e.stopPropagation(), this.$el.removeClass("show-fade-in"), this.showing = !1;
        var t = this;
        setTimeout(function() {
            "greeting" === t.options.targetRegion && t.$el.parent().find(".dropdown-list").css("opacity", 1), t.$el.parent().css({
                "min-height": t.parentMinHeight ? t.parentMinHeight : 0,
                "min-width": t.parentMinWidth ? t.parentMinWidth : 0
            }), t.$el.removeClass("show")
        }, 100)
    },
    handleClick: function(e) {
        this.$el[0] === e.target || $.contains(this.$el[0], e.target) || 1 !== this.$el.css("opacity") || this.hideUpsell()
    },
    clickButton: function(e) {
        e.preventDefault(), e.stopPropagation(), m.commandManager.execute("upsell.upgrade", null, {
            source: this.options.sourceEvent
        })
    }
}), m.commands.UpsellMessage = m.models.Command.extend({
    defaults: {
        id: "upsell.message"
    },
    execute: function(e) {
        return void 0 === m.inExtensionUpgrade && m.commandManager.execute("upsell.setUpgradePath"), m.sendEvent("Upsell show", e.targetRegion, e.title), m.widgetManager.getWidget(e.targetRegion).showUpsell(e)
    }
}), m.commands.UpsellWebsite = m.models.Command.extend({
    defaults: {
        id: "upsell.website"
    },
    execute: function(e, t) {
        (t = t || (e && e.source ? e : {})).url = "https://momentumdash.com/plus?utm_source=extension&utm_medium=organic", sendUpsellClickEvent(e, t), m.commandManager.execute("window.open", null, {
            url: t.url
        })
    }
}), m.commands.UpsellModal = m.models.Command.extend({
    defaults: {
        id: "upsell.modal"
    },
    execute: function(e, t) {
        sendUpsellClickEvent(e, t), t && t.skipPlusFeatures ? m.cmd("modal.open", "UPGRADE") : m.cmd("modal.open", "PLUS_GATE")
    }
}), m.commands.UpsellUpgrade = m.models.Command.extend({
    defaults: {
        id: "upsell.upgrade"
    },
    execute: function(e, t) {
        m.inExtensionUpgrade && "Firefox" !== m.utils.getBrowserName() ? m.commandManager.execute("upsell.modal", e, t) : m.commandManager.execute("upsell.website", e, t)
    },
    beforeExecute: function() {
        void 0 === m.inExtensionUpgrade && m.commandManager.execute("upsell.setUpgradePath")
    }
}), m.commands.setUpgradePath = m.models.Command.extend({
    defaults: {
        id: "upsell.setUpgradePath"
    },
    execute: function(e) {
        function t(e) {
            e && e.length && e.some(function(e) {
                if ("introduction:free" === e.pathName) return m.inExtensionUpgrade = "upgrade:extension" === e.pathVariantName, !0
            })
        }
        e ? t(e) : $.ajax({
            beforeSend: m.utils.setMomentumAuthHeader,
            url: m.globals.urlRootApi + "onboarding/paths?all=true",
            success: t,
            error: console.error
        })
    }
}), m.models.Mantra = Backbone.Model.extend({
    idAttribute: "forDate",
    defaults: function() {
        return {
            body: "New Mantra",
            type: "mantra",
            is_favorite: !1
        }
    },
    save: function(e, t) {
        (t = t || {}).update = !0, Backbone.Model.prototype.save.call(this, e, t)
    },
    isPinned: function() {
        var e = m.models.mantraManager.getPinnedMantra();
        return !!e && this.get("_id") === e.id
    }
}), m.commands.AuthConnect = m.models.Command.extend({
    defaults: {
        id: "auth.connect"
    },
    execute: function(e) {
        m.commandManager.execute("auth.connect.provider", e.actionParameter, function() {
            m.trigger("todoListManager:fetch")
        })
    }
}), m.commands.AuthConnectProvider = m.models.Command.extend({
    defaults: {
        id: "auth.connect.provider"
    },
    execute: function(e, t, i) {
        if (e && e.status && "authRequired" === e.status && e.authorizationUrl) {
            function n() {
                d.closed || setTimeout(function() {
                    d.closed || d.close()
                }, 1e3), t && t()
            }
            var a = e.winWidth ? e.winWidth : 600,
                o = e.winHeight ? e.winHeight : 510,
                s = e.windowFeatures ? e.windowFeatures : "titlebar,resizable,status",
                r = window.screen.width / 2 - a / 2,
                l = window.screen.height / 2 - o / 2,
                d = window.open(e.authorizationUrl, "MomentumAuthWindow", s + ",left=" + r + ",top=" + l + ",width=" + a + ",height=" + o),
                c = e.authorizationUrl.split("/"),
                u = "";
            1 < c.length && (u = c[c.length - 1]);
            var g = m.globals.urlRootApi + "user/auth/status/" + u,
                h = 0,
                f = 1e3,
                p = function() {
                    d.closed ? n() : 100 < ++h || (h % 30 && (f += 1e3), $.ajax({
                        type: "GET",
                        contentType: "application/json",
                        url: g
                    }).done(function(e) {
                        e && e.token_obtained ? n() : setTimeout(function() {
                            p()
                        }, f)
                    }).fail(function() {
                        setTimeout(function() {
                            p()
                        }, f)
                    }))
                };
            p()
        } else i && i()
    }
}), m.commands.CleanLocalStorage = m.models.Command.extend({
    defaults: {
        id: "clean.localstorage"
    },
    initialize: function() {
        this.twoDaysAgo = m.now() - 1728e5
    },
    execute: function() {
        var a = this;
        if (!(localStorage.getItem("last_cleanup") > this.twoDaysAgo)) var o = setTimeout(function() {
            try {
                if (!m || !m.collect || !m.collect.backgrounds) return;
                clearTimeout(o);
                for (var e = [], t = !1, i = null, n = 0; n < localStorage.length; n++) t = !1, "archived-" == (i = localStorage.key(n)).substring(0, 9) && (t = !0), "fallback-" == i.substring(0, 9) && (t = !0), "image_displayed-" == i.substring(0, 16) && (t = !0), "weather-loc-" == i.substring(0, 12) ? t = !0 : "ddl-bg-" == i.substring(0, 7) ? localStorage.getItem(i) < a.twoDaysAgo && (t = !0) : "ddl-qt-" == i.substring(0, 7) && localStorage.getItem(i) < a.twoDaysAgo && (t = !0), t && e.push(i);
                for (n = 0; n < e.length; n++) localStorage.removeItem(e[n]);
                m.commandManager.execute("clean.localstorage.addin"), localStorage.setItem("last_cleanup", m.now())
            } catch (e) {}
        }, 500)
    },
    collectionCleaner: function(e, i) {
        var n = this;
        if (e) {
            i = i || "forDate", entriesToClean = [], e.each(function(e) {
                var t = e.get(i);
                Date.parse(t) < n.twoDaysAgo && entriesToClean.push(t)
            });
            for (var t = 0; t < entriesToClean.length; t++) {
                e.get(entriesToClean[t]).destroy()
            }
            return entriesToClean.length
        }
        return 0
    }
}), m.commands.CleanupUserData = m.models.Command.extend({
    defaults: {
        id: "user.cleanup"
    },
    execute: function(e, t) {
        e && e.type && ("notifications" == e.type ? this.cleanNotifications() : "all" == e.type && (this.cleanUserData(), this.managerCleanup(m), this.managerCleanup(m.models))), t && t()
    },
    managerCleanup: function(e) {
        var t = Object.keys(e);
        for (i in t) {
            var n = t[i];
            if (m.hasOwnProperty(n)) {
                var a = m[n];
                (a instanceof m.models.Manager || a instanceof m.collect.Manager) && a.cleanup && a.cleanup()
            }
        }
    },
    cleanNotifications: function() {
        for (var e = [], t = !1, i = null, n = 0; n < localStorage.length; n++) t = !1, (i = localStorage.key(n)).startsWith("momentum-messages") ? t = !0 : "ts_notifications" == i && (t = !0), t && e.push(i);
        for (n = 0; n < e.length; n++) localStorage.removeItem(e[n])
    },
    cleanUserData: function() {
        for (var e = [], t = !1, i = null, n = 0; n < localStorage.length; n++) t = !1, "notes" == (i = localStorage.key(n)) || i.endsWith("-loaded-once") || i.startsWith("teamFocus") || i.startsWith("team-info") || i.startsWith("cached-steam") || i.startsWith("no-background") || i.startsWith("no-quote") || i.startsWith("no-mantra") || i.startsWith("quicklinks") || i.startsWith("teamlinks") || i.startsWith("todo") || i.startsWith("focus") || i.startsWith("countdown") || i.startsWith("clock") || i.startsWith("metrics") || i.startsWith("momentum-messages") || i.startsWith("momentum-mantra") || i.startsWith("momentum-quote") || i.startsWith("momentum-background") || i.startsWith("momentum-pinned") || i.startsWith("ddl-") || i.startsWith("cached-settings") || i.startsWith("activeTodo") || i.startsWith("cached-team") || i.startsWith("listCache") || "notes-" == i.substring(0, 6) || "cachedTodoProviders" == i || "cachedFocus" == i || "f3t6b23d" == i || "current-countdown" == i || "loginParams" == i || "pendingLoginState" == i || "clocks" == i || "clocks-" == i.substring(0, 7) || "activeTodoProvider" == i || "activeTodoListId-" == i.substring(0, 17) || "font-" == i.substring(0, 5) || "listCache-" == i.substring(0, 10) || "projectCache-" == i.substring(0, 13) || "tsCachedTodoProviders" == i || "ts_notifications" == i || "todos-updated" == i || i.includes("activeTodo") ? t = !0 : "showTodoList" === i && (t = !0), t && e.push(i);
        var a = JSON.parse(localStorage.getItem("momentum-customization-1"));
        delete a.etag, localStorage.setItem("momentum-customization-1", JSON.stringify(a));
        for (n = 0; n < e.length; n++) localStorage.removeItem(e[n])
    }
}), m.commands.LoadAddins = m.models.Command.extend({
    defaults: {
        id: "addins.load"
    },
    execute: function(e) {
        if (e) {
            if (!this.addInsLoaded)
                for (this.addInsLoaded = !0, i = 0; i < e.length; i++) {
                    var t = e[i];
                    t && m.addinManager.loadAddin(t)
                }
            m.trigger("processAddIns")
        }
    }
}), m.commands.AccountLogin = m.models.Command.extend({
    defaults: {
        id: "account.login"
    },
    execute: function() {
        m.isLoggedIn() ? m.commandManager.execute("notification.show.enhanced", {
            message: "You are already logged in.",
            display_time: 5e3,
            viewLimit: 1,
            priority: 2
        }) : (m.commandManager.execute("user.cleanup", {
            type: "notifications"
        }), localStorage.doLoginOnNextLoad = !0, window.location.reload())
    }
}), m.commands.Logout = m.models.Command.extend({
    defaults: {
        id: "logout"
    },
    execute: function(i) {
        if (localStorage.token && localStorage.token_uuid) {
            var e = {
                token: localStorage.token,
                token_uuid: localStorage.token_uuid
            };
            $.ajax({
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(e),
                url: m.globals.urlRootLogin + "user/logout"
            }).always(function() {
                if (i && i.keepData) localStorage.removeItem("token"), localStorage.removeItem("token_uuid"), localStorage.removeItem("userId"), m.conditionalFeatures.clearFeatures(),
                    function(e) {
                        localStorage.setItem("loggedOut", m.now());
                        var t = e || "You have been logged out.";
                        m.commandManager.execute("notification.show.enhanced", {
                            message: t,
                            display_time: 5e3,
                            viewLimit: 1,
                            priority: 2
                        }, function() {
                            window.location.reload()
                        }, !0)
                    }(i && i.token_invalid_reason);
                else {
                    var e = localStorage.getItem("api"),
                        t = localStorage.getItem("client_uuid");
                    localStorage.clear(), t && localStorage.setItem("client_uuid", t), e && localStorage.setItem("api", e), window.location.reload()
                }
            })
        }
    }
}), m.commands.openModal = m.models.Command.extend({
    defaults: {
        id: "modal.open"
    },
    execute: function(t, i) {
        function e() {
            var e = "object" == typeof t ? t : m.modals.definitions[m.modals.stepsEnum[t]];
            e ? m.trigger("modal:forceStep", e, i) : console.warn("No step: " + t + " found in onboarding definitions")
        }
        m.modals ? e() : (m.listenTo(m, "modalManagerCreated", e), m.widgetManager.loadWidget("modal"))
    }
}), m.commands.SyncEnable = m.models.Command.extend({
    defaults: {
        id: "sync.enable"
    },
    execute: function() {
        m.conditionalFeatures.featureEnabled("serverfocus") || m.conditionalFeatures.featureEnabled("servertodos") || m.conditionalFeatures.featureEnabled("serverlinks") || m.isLoggedIn() && m.syncCoordinator.submitFeatureAccessRequest("sync-early-access", function() {
            window.location.reload()
        }, function() {
            m.commandManager.execute("notification.show.enhanced", {
                message: "Unable to enable account sync. Reload the tab and try again, or check our help site.",
                viewLimit: 1,
                priority: 2
            })
        })
    }
}), m.commands.ThirdPartyAuthConnect = m.models.Command.extend({
    defaults: {
        id: "auth.thirdparty"
    },
    execute: function(e, t) {
        this.initiateThirdPartyLogin(e, t)
    },
    initiateThirdPartyLogin: function(e, t) {
        e = localStorage.email;
        var i, n = m.utils.getBrowserName(),
            a = "chrome-extension";
        "Chrome" === n && (i = chrome.runtime.getURL("/login.html")), "Firefox" === n && (a = "firefox-extension", i = browser.runtime.getURL("/login.html")), this.loading || (this.loading = !0, $.ajax({
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                email: e,
                medium: a,
                mediumURL: i
            }),
            url: m.globals.urlRootLogin + "login/sso"
        }).done(function(e) {
            if (e) {
                if (localStorage.setItem("pendingLoginState", JSON.stringify(e)), e.redirectUrl) return void(window.location.href = e.redirectUrl)
            } else t && t()
        }).fail(function() {
            t && t()
        }))
    }
}), m.commands.WindowNavigate = m.models.Command.extend({
    defaults: {
        id: "window.navigate"
    },
    execute: function(e, t) {
        if (t) {
            var i = null;
            t.url && (i = t.url), e && t.urlField && (i = e.get(t.urlField)), i && (window.location.href = i)
        }
    }
}), m.commands.WindowOpen = m.models.Command.extend({
    defaults: {
        id: "window.open"
    },
    execute: function(e, t) {
        if (t) {
            var i = null;
            t.url && (i = t.url), e && t.urlField && (i = e.get(t.urlField)), i && window.open(i, t.windowName || "_blank")
        }
    }
}), m.commands.WindowAccountOpen = m.models.Command.extend({
    defaults: {
        id: "window.account.open"
    },
    execute: function(e) {
        var t, i = buildAccountLinkPathFromParameter(e, !1),
            n = e.windowName || "_blank";
        if (null != i) return t = m.globals.urlRootAccount + i, void window.open(t, n)
    }
}), m.commands.WindowAccountOpenLogin = m.models.Command.extend({
    defaults: {
        id: "window.account.open.login"
    },
    execute: function(e) {
        var i = buildAccountLinkPathFromParameter(e, !1),
            n = e.windowName || "_blank";
        if (null != i) {
            var t = localStorage.getItem("userId");
            if (t && localStorage.getItem("login-state-account") !== t) {
                var a = localStorage.getItem("unregistered");
                $.ajax({
                    type: "POST",
                    beforeSend: m.utils.setMomentumAuthHeader,
                    data: JSON.stringify({
                        medium: "account"
                    }),
                    url: m.globals.urlRootApi + "login/onetime"
                }).done(function(e) {
                    if (e && e.otp) {
                        var t = m.globals.urlRootAccount + (a ? "onetime?uuid=" + localStorage.getItem("userId") : "onetime?email=" + encodeURIComponent(e.email)) + "&otp=" + encodeURIComponent(e.otp) + "&redirect=" + i;
                        window.open(t, n)
                    }
                }).fail(function() {
                    o()
                })
            } else o()
        }

        function o() {
            var e = m.globals.urlRootAccount + i;
            window.open(e, n)
        }
    }
}), m.commands.NotificationShow = m.models.Command.extend({
    defaults: {
        id: "notification.show"
    },
    execute: function(e, t) {
        setTimeout(function() {
            m.models.notificationManager && m.models.notificationManager.showMessage(e, t)
        }, 10)
    }
}), m.commands.NotificationShowEnhanced = m.models.Command.extend({
    defaults: {
        id: "notification.show.enhanced"
    },
    execute: function(e, t, i) {
        setTimeout(function() {
            m.models.notificationManager && m.models.notificationManager.showMessageEnhanced(e, t, i)
        }, 10)
    }
}), m.commands.NotificationDismiss = m.models.Command.extend({
    defaults: {
        id: "notification.dismiss"
    },
    execute: function() {
        setTimeout(function() {
            m.models.notificationManager && m.models.notificationManager.dismissMessage()
        }, 5)
    }
}), m.commands.CheckClockActive = m.models.Command.extend({
    defaults: {
        id: "check.clock.active"
    },
    execute: function() {
        return !(localStorage.getItem("pomodoro-showing") && "false" !== localStorage.getItem("pomodoro-showing") || m.models.customization.balanceMode.get("active"))
    }
}), m.commands.StartExperiment = m.models.Command.extend({
    defaults: {
        id: "experiment.start"
    },
    execute: function(e, t) {
        t.xid && m.experimentManager.enrollServerSide(t.xid, t.xvar), t.cmd && m.commandManager.execute(t.cmd, null, t.opt)
    }
}), m.commands.UpsellMessage = m.models.Command.extend({
    defaults: {
        id: "upsell.message"
    },
    execute: function(e) {
        return void 0 === m.inExtensionUpgrade && m.commandManager.execute("upsell.setUpgradePath"), m.sendEvent("Upsell show", e.targetRegion, e.title), m.widgetManager.getWidget(e.targetRegion).showUpsell(e)
    }
}), m.commands.UpsellWebsite = m.models.Command.extend({
    defaults: {
        id: "upsell.website"
    },
    execute: function(e, t) {
        (t = t || (e && e.source ? e : {})).url = "https://momentumdash.com/plus?utm_source=extension&utm_medium=organic", sendUpsellClickEvent(e, t), m.commandManager.execute("window.open", null, {
            url: t.url
        })
    }
}), m.commands.UpsellModal = m.models.Command.extend({
    defaults: {
        id: "upsell.modal"
    },
    execute: function(e, t) {
        sendUpsellClickEvent(e, t), t && t.skipPlusFeatures ? m.cmd("modal.open", "UPGRADE") : m.cmd("modal.open", "PLUS_GATE")
    }
}), m.commands.UpsellUpgrade = m.models.Command.extend({
    defaults: {
        id: "upsell.upgrade"
    },
    execute: function(e, t) {
        m.inExtensionUpgrade && "Firefox" !== m.utils.getBrowserName() ? m.commandManager.execute("upsell.modal", e, t) : m.commandManager.execute("upsell.website", e, t)
    },
    beforeExecute: function() {
        void 0 === m.inExtensionUpgrade && m.commandManager.execute("upsell.setUpgradePath")
    }
}), m.commands.setUpgradePath = m.models.Command.extend({
    defaults: {
        id: "upsell.setUpgradePath"
    },
    execute: function(e) {
        function t(e) {
            e && e.length && e.some(function(e) {
                if ("introduction:free" === e.pathName) return m.inExtensionUpgrade = "upgrade:extension" === e.pathVariantName, !0
            })
        }
        e ? t(e) : $.ajax({
            beforeSend: m.utils.setMomentumAuthHeader,
            url: m.globals.urlRootApi + "onboarding/paths?all=true",
            success: t,
            error: console.error
        })
    }
}), m.views.TeamLogo = Backbone.View.extend({
    attributes: {
        id: "team-logo",
        class: "app-container team-logo",
        "data-test": "team-logo"
    },
    template: m.templates.teamlogo.teamlogo,
    events: {
        "click .app-dash": "toggleTeamMenu",
        "click .settings-members": "goToTeamMembers",
        "click .settings-general": "goToTeamSite",
        "click .settings-announcements": "goToTeamSiteAnnouncements"
    },
    initialize: function() {
        localStorage.removeItem("cached-team-logo-url"), localStorage.removeItem("cached-team-logo-blob"), this.team = this.options.team, this.isAdmin = this.team.userIsAdmin, this.isOpen = !1, this.listenTo(m, "globalEvent:click", this.handleClickOutside), this.render()
    },
    render: function() {
        var e = (this.options.order || "prepend") + "To",
            t = {
                logo: this.team.teamLogoUrl || null,
                isSVG: "SVG" === this.team.teamLogoFileType,
                isAdmin: this.isAdmin,
                showTeamDropdown: this.team.teamLogoUrl || this.isAdmin
            },
            i = this.$(".notification");
        i.detach(), this.$el[e]("." + this.options.region).html(this.template(t)), i.length && this.$el.append(i), this.team.teamLogoUrl ? this.$el.closest(".top-left").addClass("has-logo") : this.team && (this.isAdmin ? this.$el.closest(".top-left").addClass("has-logo-placeholder") : this.$el.closest(".top-left").addClass("has-no-logo"))
    },
    toggleTeamMenu: function() {
        this.isAdmin && (this.isOpen ? this.hidePopup(!0) : this.showPopup(!0))
    },
    showPopup: function() {
        this.afterFadeOut || (this.afterFadeOut = function() {
            this.$el.removeClass("show")
        }.bind(this)), m.trigger("notification:hide"), m.widgetManager.unfocusOverlap("logo"), this.$el.off("transitionend webkitTransitionEnd", this.afterFadeOut), this.isOpen = !0, this.$el.closest(".top-left").addClass("team-dropdown-open"), this.$el.addClass("show").width(), this.$el.addClass("show-fade-in")
    },
    hidePopup: function() {
        m.widgetManager.refocusOverlap("logo"), this.isOpen = !1, this.$el.closest(".top-left").removeClass("team-dropdown-open"), this.$el.removeClass("show-fade-in").once("transitionend webkitTransitionEnd", this.afterFadeOut)
    },
    handleClickOutside: function(e) {
        $.contains(this.$el[0], e.target) || this.hidePopup()
    },
    goToTeamMembers: function() {
        m.commandManager.execute("window.account.open", "/team/members?add")
    },
    goToTeamSite: function() {
        m.commandManager.execute("window.account.open", "/")
    },
    goToTeamSiteAnnouncements: function() {
        m.commandManager.execute("window.account.open", "/team/announcements")
    }
}), Storage.prototype.setObject = function(e, t) {
    this.setItem(e, JSON.stringify(t))
}, Storage.prototype.getObject = function(e) {
    var t = this.getItem(e);
    return t && JSON.parse(t)
}, m.models.Date = Backbone.Model.extend({
    defaults: function() {
        return {
            date: m.date()
        }
    },
    initialize: function() {
        this.listenTo(this, "change:date", this.updateTime, this), this.listenTo(m, "globalEvent:pageShown", this.onPageShown)
    },
    setUpdateTimer: function() {
        var e = this,
            t = 6e4,
            i = m.date();
        t = t - 1e3 * i.getSeconds() - i.getMilliseconds(), this.dateTimeoutId = setTimeout(function() {
            e.set("date", m.date()), e.setUpdateTimer()
        }, t)
    },
    getTimeString: function(e) {
        var t = m.models.customization.get("hour12clock"),
            i = (e = e || this.get("date")).getHours(),
            n = e.getMinutes();
        return 1 == t && (i = (i + 11) % 12 + 1), i < 10 && !t && (i = "0" + i), n < 10 && (n = "0" + n), i + ":" + n
    },
    getTimePeriod: function() {
        return 12 <= this.get("date").getHours() ? "PM" : "AM"
    },
    updateTime: function() {
        var e = this.getTimeString();
        this.get("time") !== e && this.set("time", e)
    },
    onPageShown: function() {
        var e = this.get("time"),
            t = this.getTimeString(new Date);
        void 0 !== e && e !== t && this.set("date", m.date())
    }
}), m.views.Dashboard = Backbone.View.extend({
    initialize: function() {
        this.$loading = $('<span class="message-fill"><i class="loading-icon"></i> Loading...</span>'), m.console.log(m.elapsed() + ": Dashboard Init"), m.models.themeManager = new m.models.ThemeManager, m.models.customization.fetch({
            error: function() {
                m.models.customization.save(), m.models.themeManager.initializeThemes()
            },
            success: function() {
                m.models.themeManager.initializeThemes()
            }
        }), this.listenTo(m, "processAddIns", this.processAddIns), m.models.backgroundManager = new m.models.BackgroundManager, m.conditionalFeatures.featureEnabled("team") && $("body").addClass("has-team"), m.views.background = new m.views.Background({
            region: "background"
        }), m.models.backgroundManager.firstFetch(), m.models.notificationManager = new m.models.NotificationManager, m.models.date && m.models.date.setUpdateTimer(), this.trackPageVisibility(), this.newDayIntervalId = setInterval(function() {
            if (window.Cypress && document.body.setAttribute("data-test-new-day-interval-check-has-run", ""), localStorage.activeDate) {
                if (localStorage.activeDate != m.utils.getDateString()) {
                    var e = 9e3 * Math.random() + 1e3;
                    setTimeout(function() {
                        localStorage.activeDate = m.utils.getDateString(), m.trigger("newDay")
                    }, e)
                }
            } else localStorage.activeDate = m.utils.getDateString()
        }, 1e4), localStorage.getItem("processNewLogin") ? (m.listenToOnce(m.models.customization, "initialized", onSettingsInitialized), m.trigger("user:successfulLogin"), localStorage.removeItem("processNewLogin"), localStorage.setItem("loggedIn", m.now()), localStorage.removeItem("onetimeSent"), m.readyForWidgets = !0, m.trigger("readyForWidgets"), this.render(!0, function() {
            m.widgetManager.showApps(!0), m.trigger("weather:reset")
        })) : !m.models.customization.get("displayname") && !m.isLoggedIn() || localStorage.getItem("doLoginOnNextLoad") || localStorage.getItem("registrationStatePending") || localStorage.getItem("loginParams") || localStorage.getItem("pendingLoginState") || localStorage.getItem("tokenNeeded") && !localStorage.getItem("token") ? (m.readyForWidgets = !1, m.widgetManager.loadWidget("introduction"), m.listenToOnce(m.models.customization, "initialized", onSettingsInitialized)) : (m.readyForWidgets = !0, m.trigger("readyForWidgets"), this.render());
        var e = m.utils.getBrowserName();
        document.body.classList.add(e), "Firefox" === e && m.utils.getBrowserVersion() < 57 && document.body.classList.add("oldFireFox"), this.initializeCompleted = !0
    },
    trackPageVisibility: function() {
        var e, t;
        void 0 !== document.hidden ? (e = "hidden", t = "visibilitychange") : void 0 !== document.webkitHidden && (e = "webkitHidden", t = "webkitvisibilitychange"), void 0 !== e && this.addEventHandler(document, t, function() {
            m.trigger(document[e] ? "globalEvent:pageHidden" : "globalEvent:pageShown")
        })
    },
    addEventHandler: function(e, t, i) {
        e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent ? e.attachEvent("on" + t, i) : e["on" + t] = i
    },
    processAddIns: function() {
        var e = this;
        e.processAddInsIntervalId = setInterval(function() {
            e.initializeCompleted && (clearInterval(e.processAddInsIntervalId), m.addinManager.processPending())
        }, 50)
    },
    render: function(e, t) {
        this.renderedOnce || (this.renderedOnce = !0, m.views.backgroundInfo && m.widgets.push(m.views.backgroundInfo), m.views.settingsPane = new m.views.settings.SettingsPane({
            region: "bottom-left",
            order: "prepend"
        }), m.widgets.push(m.views.settingsPane), m.trigger("main-render-complete"), t && t())
    },
    getViewById: function(t) {
        var i = null;
        return _.each(m.widgets, function(e) {
            e.el.id === t && (i = e)
        }), i
    },
    removeView: function(t) {
        _.each(m.widgets, function(e) {
            e.el.id === t && e.$el.fadeTo(500, 0, function() {
                e.remove(), m.widgets.splice(m.widgets.indexOf(e), 1)
            })
        })
    },
    removeAllViews: function(e) {
        _.each(m.widgets, function(e) {
            e && e.$el.fadeTo(500, 0, function() {
                e.remove()
            })
        }), m.widgets = [], _.delay(e, 475)
    }
});
var bootstrap = function() {
    if (setTimeout(function() {
            try {
                var e = "";
                for (o = 0; o < 100; o++) e += "aaaaaaaaaa";
                localStorage.setItem("capacityTest", e), localStorage.removeItem("capacityTest")
            } catch (e) {
                try {
                    localStorage.removeItem("capacityTest");
                    for (var t = m.now() - 1728e5, i = [], n = !1, a = null, o = 0; o < localStorage.length; o++) n = !1, "no-mantra" == (a = localStorage.key(o)).substring(0, 9) && (n = !0), "no-quote" == a.substring(0, 8) && (n = !0), "no-background" == a.substring(0, 13) && (n = !0), "last_cleanup" == a.substring(0, 12) && (n = !0), "archived-" == a.substring(0, 9) && (n = !0), "fallback-" == a.substring(0, 9) && (n = !0), "listCache-" == a.substring(0, 10) && (n = !0), "font-" == a.substring(0, 5) && (n = !0), "image_displayed-" == a.substring(0, 16) && (n = !0), "weather" == a.substring(0, 7) && (n = !0), "bookmarks" == a.substring(0, 9) ? n = !0 : "ddl-bg-" == a.substring(0, 7) ? localStorage.getItem(a) < t && (n = !0) : "ddl-qt-" == a.substring(0, 7) && localStorage.getItem(a) < t && (n = !0), n && i.push(a);
                    for (o = 0; o < i.length; o++) localStorage.removeItem(i[o])
                } catch (e) {}
            }
        }, 3e3), m.isLoggedIn()) {
        if (!localStorage.getItem("user_uuid")) {
            var e = localStorage.getItem("token"),
                t = m.utils.parseJwt(e);
            if (t) {
                var i = t.user_uuid || t.user_guid;
                i && localStorage.setItem("user_uuid", i.toLowerCase())
            }
        }
        localStorage.removeItem("pendingLoginState")
    }
    m.models.date = new m.models.Date, m.models.customization = new m.models.ComputedSettings({
        id: 1
    }), m.listenToOnce(m.models.customization, "initialized", onSettingsInitialized), m.console.log(m.elapsed() + ": Settings requested"), m.models.teamInfo = new m.models.TeamInfo, m.models.customization.initializeSettings()
};

function domReady(e) {
    "complete" === document.readyState || "interactive" === document.readyState ? setTimeout(e, 1) : document.addEventListener("DOMContentLoaded", e)
}
try {
    window.browser ? browser.windows.getLastFocused().then(function(e) {
        e.incognito ? $("body").html("") : domReady(bootstrap)
    }) : domReady(bootstrap)
} catch (e) {
    domReady(bootstrap)
}
var onSettingsInitialized = function() {
    m.console.log(m.elapsed() + ": Settings initialized"), m.sendEvent("/dashboard.html?v=" + m.globals.version, null, null, "pageview");
    var e = "installed-" + m.globals.version;
    localStorage.getItem(e) || localStorage.setItem(e, !0), 
			m.models.cleanupManager = new m.models.CleanupManager, 
			m.addinManager = new m.models.AddinManager, 
			m.experimentManager = new m.models.ExperimentManager, 
			m.commandManager = new m.CommandManager, 
			m.cmd = m.commandManager.execute.bind(m.commandManager),
			 (m.models.customization.get("displayname") || m.isLoggedIn()) && !localStorage.doLoginOnNextLoad || 
			 (m.prelogin = !0), m.models.mantraManager = new m.models.MantraManager, 
			 m.widgetManager = new m.models.WidgetManager, m.widgetManager.setupWhenReady(), 
			 m.appView = new m.views.Dashboard, !localStorage.getItem("offered-plan") && m.conditionalFeatures.featureEnabled("notes-degraded") && $.ajax({
        type: "GET",
        contentType: "application/json",
        url: m.globals.urlRootLogin + "account/history"
    }).done(function(e) {
        e.offeredPlan && localStorage.setItem("offered-plan", e.offeredPlan)
    }), localStorage.client_uuid ? window.Cypress && $("body").attr("data-test-ready-for-tests", "") : $.ajax({
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            action: "registerClient"
        }),
        url: m.globals.urlRootLogin + "user/client"
    }).done(function(e) {
        e.client_uuid && localStorage.client_uuid !== e.client_uuid && (localStorage.getItem("token") || localStorage.setItem("registrationStatePending", !0), localStorage.client_uuid = e.client_uuid, window.Cypress && $("body").attr("data-test-ready-for-tests", ""))
    }), m.syncCoordinator = new m.models.SyncCoordinator, localStorage.firstSynchronized && m.trigger("sync:downloadIfNeeded"), m.syncCoordinator.syncSettings(), m.appView.listenToOnce(m, "appsReady", registerDeferredListeners), m.appView.listenTo(m, "appsReady", registerCustomBackgroundListeners)
};

function registerDeferredListeners() {
    m.listenersRegistered || (window.addEventListener("storage", function(e) {
        if ("activeDate" == e.key && e.oldValue != e.newValue) {
            var t = 9e3 * Math.random() + 1e3;
            setTimeout(function() {
                m.trigger("newDay")
            }, t)
        }
    }), $(window).on("resize", function() {
        m.trigger("globalEvent:window:resize")
    }), window.onblur = function() {
        m.trigger("globalEvent:windowBlur")
    }, $(document).on("click", function(e) {
        m.trigger("globalEvent:click", e)
    }), $(document).on("keyup", function(e) {
        if (27 == e.keyCode && m.trigger("globalEvent:esc", e), 32 == e.keyCode) {
            var t = m.widgetManager.getWidget("todo");
            if (t && t.isHovered) return;
            if (m.utils.isInputOrTextAreaActive()) return;
            m.trigger("pomodoro:togglePlay", e), e.stopPropagation(), e.preventDefault()
        }
        "Alt" == e.key && m.trigger("globalEvent:altUp", e)
    }), $(document).on("keydown", function(e) {
        if (9 === e.keyCode && (m.trigger("globalEvent:key:tab"), "BODY" === document.activeElement.tagName)) {
            e.preventDefault();
            var t = $("#search-input");
            if (t.length) t.trigger("focus");
            else {
                var i = $("#focuses").find("input");
                i.length ? i.trigger("focus") : $("a").filter(":visible").first().trigger("focus")
            }
        }
        if (8 == e.keyCode && e.shiftKey && e.metaKey && m.trigger("globalEvent:metaBackspace", e), 13 == e.keyCode && e.metaKey && m.trigger("globalEvent:metaEnter", e), 219 == e.keyCode && e.metaKey && m.trigger("globalEvent:metaBracketLeft", e), 221 == e.keyCode && e.metaKey && m.trigger("globalEvent:metaBracketRight", e), 78 == e.keyCode && e.ctrlKey && m.trigger("globalEvent:ctrlN", e), 70 == e.keyCode && e.altKey && m.trigger("globalEvent:altF", e), 76 == e.keyCode && e.altKey && m.trigger("globalEvent:altL", e), e.altKey && 38 == e.keyCode && m.trigger("globalEvent:altArrowUp", e), e.altKey && 40 == e.keyCode && m.trigger("globalEvent:altArrowDown", e), !e.ctrlKey && !e.metaKey && !(e.altKey && 78 != e.keyCode || m.utils.isInputOrTextAreaActive())) {
            var n;
            if (76 == e.keyCode) m.trigger("globalEvent:key:L", e);
            else if (70 == e.keyCode) n = "Focus";
            else if (84 == e.keyCode) m.trigger("globalEvent:key:T", e);
            else if (83 == e.keyCode) n = "Search";
            else if (188 == e.keyCode) {
                if (e.metaKey) return;
                n = "Settings"
            } else {
                if (67 == e.keyCode && m.utils.isChromium()) return m.sendEvent("New Tab", "Hotkey"), void m.utils.getBrowser().tabs.update({
                    url: "chrome-search://local-ntp/local-ntp.html"
                });
                if (8 == e.keyCode) m.trigger("globalEvent:key:backspace", e);
                else if (13 == e.keyCode) m.trigger("globalEvent:key:enter", e);
                else if (32 == e.keyCode) m.trigger("globalEvent:spacebar", e);
                else if (38 == e.keyCode) m.trigger("globalEvent:arrowUp", e);
                else if (40 == e.keyCode) m.trigger("globalEvent:arrowDown", e);
                else if (37 == e.keyCode) m.trigger("globalEvent:arrowLeft", e);
                else if (39 == e.keyCode) m.trigger("globalEvent:arrowRight", e);
                else if (65 == e.keyCode) m.trigger("globalEvent:key:A", e);
                else if (78 == e.keyCode && e.shiftKey) m.trigger("globalEvent:key:shiftN", e);
                else if (78 != e.keyCode || e.shiftKey)
                    if (80 == e.keyCode) m.trigger("globalEvent:key:P", e);
                    else if (86 == e.keyCode) m.trigger("globalEvent:key:V", e);
                else if (87 == e.keyCode) m.trigger("globalEvent:key:W", e);
                else if (66 == e.keyCode) {
                    if (void 0 !== m.utils.getBrowser().topSites) {
                        m.views.bookmarks || (m.widgetManager.loadWidget("bookmarks-primer"), m.widgetManager.loadWidget("bookmarks"));
                        var a = !m.models.customization.get("bookmarksVisible");
                        m.models.customization.save("bookmarksVisible", a)
                    }
                } else e.shiftKey && 191 == e.keyCode ? m.commandManager.execute("settings.toggle", null, {
                    section: "help"
                }) : 192 === e.keyCode && m.trigger("globalEvent:key:backtick", e);
                else m.trigger("globalEvent:key:N", e)
            }
            n && (m.trigger("globalEvent:toggle" + n.replace(/\s+/g, "")), m.sendEvent(n, "Toggle Show", "Hotkey"), e.preventDefault())
        }
    }), "Safari" == m.globals.platform && $("a").on("click", function() {
        safari.self.tab.dispatchMessage("sendClick", {
            link: this.href,
            time: (new Date).getTime()
        })
    }), m.listenTo(m, "user:successfulLogout", function() {
        m.appView.removeAllViews(function() {
            m.appView = new m.views.Dashboard
        })
    }), m.listenersRegistered = !0)
}

function registerCustomBackgroundListeners() {
    if (!m.customBackgroundListenersRegistered) {
        var i = $("body");
        m.conditionalFeatures.featureEnabled("custom-bg") && !m.models.customization.get("disableDrop") && (m.appView.addEventHandler(document.body, "dragover", function(e) {
            e.stopPropagation(), e.preventDefault(), _.contains(e.dataTransfer.types, "Files") ? e.dataTransfer.dropEffect = "copy" : e.dataTransfer.dropEffect = "none"
        }), window.addEventListener("dragenter", function(e) {
            _.contains(e.dataTransfer.types, "Files") && (m.appView.lastTarget = e.target, i.addClass("blur show-drop"))
        }), window.addEventListener("dragleave", function(e) {
            e.preventDefault(), e.target !== document && e.target !== m.appView.lastTarget || i.removeClass("blur show-drop")
        }, !1), window.addEventListener("dragover", function(e) {
            e.preventDefault()
        }), m.appView.addEventHandler(document.body, "drop", function(e) {
            if (e && e.dataTransfer.files.length && Array.prototype.some.call(e.dataTransfer.files, function(e) {
                    return e && e.name.match(/\.(gif|jpg|jpeg|tiff|png)$/i)
                })) {
                if (e.stopPropagation(), e.preventDefault(), i.removeClass("blur show-drop"), !_.contains(e.dataTransfer.types, "Files")) return;
                if (!m.conditionalFeatures.featureEnabled("custom-bg")) {
                    return void m.commandManager.execute("upsell.message", {
                        targetRegion: "settings",
                        sourceEvent: "customBackgrounds-dropFiles",
                        buttonText: "Learn more",
                        title: "Custom Backgrounds",
                        description: "Add your own backgrounds with Plus"
                    })
                }
                var t = e.dataTransfer.files;
                t && 0 < t.length && m.commandManager.ensureCommandLoaded("background.custom.uploadfiles", function() {
                    m.commandManager.execute("background.custom.uploadfiles", t)
                }, null, function() {})
            } else i.removeClass("blur show-drop")
        }), m.customBackgroundListenersRegistered = !0)
    }
}