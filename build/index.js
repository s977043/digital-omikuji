var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// app/routes/remix.config.js
var require_remix_config = __commonJS({
  "app/routes/remix.config.js"() {
    "use strict";
  }
});

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_react = require("@remix-run/react"), import_server = require("react-dom/server"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, { context: remixContext, url: request.url }, void 0, !1, {
      fileName: "app/entry.server.tsx",
      lineNumber: 12,
      columnNumber: 5
    }, this)
  );
  return responseHeaders.set("Content-Type", "text/html"), new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links
});
var import_react2 = require("@remix-run/react");

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-WPVFOXOY.css";

// app/root.tsx
var import_jsx_dev_runtime2 = require("react/jsx-dev-runtime");
function links() {
  return [{ rel: "stylesheet", href: tailwind_default }];
}
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("html", { lang: "ja", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("meta", { charSet: "utf-8" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 19,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 20,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("meta", { name: "description", content: "\u30C7\u30B8\u30BF\u30EB\u304A\u307F\u304F\u3058\u30A2\u30D7\u30EA - \u3044\u3064\u3067\u3082\u3069\u3053\u3067\u3082\u304A\u307F\u304F\u3058\u3092\u5F15\u3051\u307E\u3059" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 21,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 22,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 23,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 18,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("body", { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 26,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 27,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 28,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_react2.LiveReload, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 29,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 25,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 17,
    columnNumber: 5
  }, this);
}

// server-entry-module:@remix-run/dev/server-build
var route1 = __toESM(require_remix_config());

// app/routes/index.test.tsx
var index_test_exports = {}, import_react4 = require("@testing-library/react");

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_react3 = require("react"), import_jsx_dev_runtime3 = require("react/jsx-dev-runtime"), results = [
  { result: "\u5927\u5409", weight: 1 },
  { result: "\u4E2D\u5409", weight: 3 },
  { result: "\u5C0F\u5409", weight: 5 },
  { result: "\u51F6", weight: 1 }
];
function getRandomOmikuji() {
  let totalWeight = results.reduce((sum, { weight }) => sum + weight, 0), randomNumber = Math.floor(Math.random() * totalWeight);
  for (let { result, weight } of results) {
    if (randomNumber < weight)
      return result;
    randomNumber -= weight;
  }
}
function Index() {
  let [omikuji, setOmikuji] = (0, import_react3.useState)("");
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "flex flex-col items-center justify-center min-h-screen py-2", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h1", { className: "text-4xl font-bold mb-8", children: "\u304A\u307F\u304F\u3058" }, void 0, !1, {
      fileName: "app/routes/index.tsx",
      lineNumber: 31,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(
      "button",
      {
        onClick: () => {
          setOmikuji(getRandomOmikuji());
        },
        className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
        children: "\u304A\u307F\u304F\u3058\u3092\u5F15\u304F"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/index.tsx",
        lineNumber: 32,
        columnNumber: 7
      },
      this
    ),
    omikuji && /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { className: "text-2xl mt-8", children: omikuji }, void 0, !1, {
      fileName: "app/routes/index.tsx",
      lineNumber: 38,
      columnNumber: 19
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/index.tsx",
    lineNumber: 30,
    columnNumber: 5
  }, this);
}

// app/routes/index.test.tsx
var import_jsx_dev_runtime4 = require("react/jsx-dev-runtime");
describe("Index", () => {
  it("renders a heading and a button", () => {
    (0, import_react4.render)(/* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Index, {}, void 0, !1, {
      fileName: "app/routes/index.test.tsx",
      lineNumber: 6,
      columnNumber: 12
    }, this)), expect(import_react4.screen.getByRole("heading", { level: 1 })).toHaveTextContent("\u304A\u307F\u304F\u3058"), expect(import_react4.screen.getByRole("button", { name: /おみくじを引く/i })).toBeInTheDocument();
  }), it("displays the omikuji result when the button is clicked", async () => {
    (0, import_react4.render)(/* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Index, {}, void 0, !1, {
      fileName: "app/routes/index.test.tsx",
      lineNumber: 12,
      columnNumber: 12
    }, this));
    let button = import_react4.screen.getByRole("button", { name: /おみくじを引く/i });
    import_react4.fireEvent.click(button);
    let omikujiResult = await import_react4.screen.findByText(/大吉|中吉|小吉|凶/i);
    expect(omikujiResult).toBeVisible();
  });
});

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-IQ4OJSZJ.js", imports: ["/build/_shared/chunk-N2QXMGOI.js", "/build/_shared/chunk-S4ZNHW4H.js", "/build/_shared/chunk-IU43IUTG.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-WWHRW2JI.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: "index", index: void 0, caseSensitive: void 0, module: "/build/routes/index-ZROZO2LQ.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index.test": { id: "routes/index.test", parentId: "routes/index", path: "test", index: void 0, caseSensitive: void 0, module: "/build/routes/index.test-G6L2DHZN.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/remix.config": { id: "routes/remix.config", parentId: "root", path: "remix/config", index: void 0, caseSensitive: void 0, module: "/build/routes/remix.config-E2KZA7Y2.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, version: "f73eb081", hmr: void 0, url: "/build/manifest-F73EB081.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", future = { v2_dev: !1, unstable_postcss: !1, unstable_tailwind: !1, v2_errorBoundary: !0, v2_headers: !1, v2_meta: !0, v2_normalizeFormMethod: !0, v2_routeConvention: !0 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/remix.config": {
    id: "routes/remix.config",
    parentId: "root",
    path: "remix/config",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/index.test": {
    id: "routes/index.test",
    parentId: "routes/index",
    path: "test",
    index: void 0,
    caseSensitive: void 0,
    module: index_test_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: "index",
    index: void 0,
    caseSensitive: void 0,
    module: routes_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  future,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
