const assert = require("node:assert/strict");
const path = require("node:path");
const Module = require("node:module");
const test = require("node:test");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const root = path.resolve(__dirname, "..");
let account;
let pathname;
let logoutEvents;
class RedirectResult extends Error {
  constructor(destination) {
    super("NEXT_REDIRECT");
    this.destination = destination;
  }
}
const originalLoad = Module._load;
const originalResolve = Module._resolveFilename;
Module._load = function (request, parent, isMain) {
  if (request === "@/lib/store") return { useDemo: () => account };
  if (request === "next/navigation") return { redirect(destination) { throw new RedirectResult(destination); }, useRouter: () => ({ push() {}, replace(path) { logoutEvents.push(["replace", path]); } }), usePathname: () => pathname };
  return originalLoad.call(this, request, parent, isMain);
};
Module._resolveFilename = function (request, ...args) {
  return originalResolve.call(this, request.startsWith("@/") ? path.join(root, request.slice(2)) : request, ...args);
};
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const { outputText } = ts.transpileModule(require("node:fs").readFileSync(filename, "utf8"), {
      fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    });
    module._compile(outputText, filename);
  };
}
function setup(role = "no-socio") {
  const nonMember = role === "no-socio";
  logoutEvents = [];
  account = {
    logout: () => logoutEvents.push(["logout"]),
    ready: true, persona: nonMember ? { nombre: "Mateo", apellido: "Álvarez", dni: "40765892" } : { nombre: "Lucía", apellido: "Fernández", dni: "38456123", nro: 1247 },
    basePath: nonMember ? "/no-socio" : "/socio",
    state: { rol: role, cuotas: [], pagos: [], reservas: [], padelMios: [], padelNoSocioMios: [] },
    cuotas: [], pagos: [], padelMios: [], precioPadel: 16000,
  };
  pathname = account.basePath + "/carnet";
}
function page(relative) {
  const Component = require(path.join(root, relative)).default;
  return renderToStaticMarkup(React.createElement(Component));
}
function shell(role) {
  const { SocioShell } = require("../components/Shells.tsx");
  return renderToStaticMarkup(React.createElement(SocioShell, { rol: role }, React.createElement("p", null, "Private view")));
}
test("role-specific navigation retains matching links, icons and active states without nonmember fees", () => {
  const links = (markup) => markup.match(/<nav class="botnav"[\s\S]*?<\/nav>/)[0].match(/<a\b[\s\S]*?<\/a>/g);
  const expected = {
    "no-socio": [["carnet", "Inicio"], ["reservas", "Salones"], ["padel", "Pádel"]],
    socio: [["carnet", "Inicio"], ["cuotas", "Cuotas"], ["reservas", "Salones"], ["padel", "Pádel"]],
  };
  const rendered = {};
  for (const role of ["no-socio", "socio"]) {
    setup(role);
    rendered[role] = links(shell(role));
    assert.deepEqual(rendered[role].map((link) => [link.match(/href="([^"]+)"/)[1], link.match(/<\/svg>([^<]+)<\/a>/)[1]]), expected[role].map(([section, label]) => [`/${role}/${section}`, label]));
    for (const [section] of expected[role]) {
      pathname = `/${role}/${section}`;
      const active = links(shell(role)).filter((link) => link.includes('aria-current="page"'));
      assert.equal(active.length, 1);
      assert.ok(active[0].includes(`href="${pathname}"`));
    }
  }
  assert.deepEqual(rendered["no-socio"].map((link) => link.replaceAll("/no-socio/", "/socio/")), rendered.socio.filter((link) => !link.includes('href="/socio/cuotas"')));
});
test("Inicio uses the same house icon for members and nonmembers", () => {
  for (const role of ["socio", "no-socio"]) {
    setup(role);
    const home = shell(role).match(/<a\b[^>]*href="\/(?:socio|no-socio)\/carnet"[^>]*>[\s\S]*?<\/a>/)?.[0];
    assert.ok(home, role);
    assert.match(home, /<path d="m3 10 9-7 9 7"/);
    assert.match(home, /<path d="M5 9v12h14V9M9 21v-8h6v8"/);
    assert.match(home, /width="28" height="28"/);
    assert.match(home, /stroke="currentColor"/);
    assert.match(home, /aria-hidden="true"/);
    assert.match(home, /<\/svg>Inicio<\/a>/);
    assert.doesNotMatch(home, /<circle|<rect/);
  }
});
for (const role of ["socio", "no-socio"]) {
  test(`${role} home page is headed Inicio at its existing carnet route`, () => {
    setup(role);
    const html = page(`app/${role}/carnet/page.tsx`);
    assert.match(html, /<h1>Inicio<\/h1>/);
    assert.doesNotMatch(html, /<h1>Mi carnet<\/h1>/);
    const header = html.match(/<header[^>]*>[\s\S]*?<\/header>/)?.[0];
    assert.match(header, /<p>Tu lugar en el club<\/p>/);
    assert.doesNotMatch(header, /Mostralo en la puerta o en el buffet/);
  });
}
test("nonmember navigation evenly spans three columns while member navigation keeps four", () => {
  const css = require("node:fs").readFileSync(path.join(root, "app/globals.css"), "utf8");
  assert.match(css.match(/\.botnav\s*\{([^}]+)\}/)?.[1] || "", /grid-template-columns:\s*repeat\(4, 1fr\)/);
  assert.match(css.match(/\.no-socio-app \.botnav\s*\{([^}]+)\}/)?.[1] || "", /grid-template-columns:\s*repeat\(3, 1fr\)/);
});
test("nonmember invitation replaces the card with the supplied image and retains the WhatsApp CTA", () => {
  setup();
  const html = page("app/no-socio/carnet/page.tsx");
  assert.match(html, /<img[^>]+asociate_img\.png/);
  assert.match(html, /alt="Hacete socio del Club Atlético Independiente de Lobería"/);
  assert.match(html, /width:100%/);
  assert.match(html, /height:auto/);
  assert.match(html, /Quiero asociarme/);
  assert.match(html, /<h1>Inicio<\/h1>/);
  assert.doesNotMatch(html, /class="carnet"|carnet-top|carnet-banda|carnet-pie|Tu próximo carnet/);
  assert.doesNotMatch(html, /membership-hero|membership-benefit|Aranceles preferenciales/);
  const link = html.match(/href="(https:\/\/wa\.me\/[^"]*)"/)?.[1];
  assert.ok(link, "opens WhatsApp rather than submitting membership automatically");
  assert.ok(decodeURIComponent(link).includes("Mateo Álvarez"));
  assert.doesNotMatch(decodeURIComponent(link), /40765892/);
  assert.doesNotMatch(html, /Socia Nº|Lucía|no socia/i);
});
test("nonmember Inicio greets the signed-in person by full name above the photo", () => {
  setup();
  const html = page("app/no-socio/carnet/page.tsx");
  assert.match(html, /<h2[^>]*>Hola, Mateo Álvarez<\/h2><img[^>]*src="\/asociate_img\.png"/);
  const greeting = html.match(/<h2[^>]*>Hola, Mateo Álvarez<\/h2>/)?.[0];
  assert.match(greeting, /text-align:left/);
  assert.match(greeting, /font-size:26px/);
  assert.match(greeting, /width:100%;max-width:400px/);
  assert.match(greeting, /margin:0 auto 16px/);
});
test("invitation photo has a pronounced static two-layer neutral shadow", () => {
  setup();
  const html = page("app/no-socio/carnet/page.tsx");
  const image = html.match(/<img[^>]+src="\/asociate_img\.png"[^>]*>/)?.[0];
  assert.ok(image);
  assert.match(image, /box-shadow:0 16px 32px rgba\(17,17,17,0\.35\), 0 4px 12px rgba\(17,17,17,0\.25\)/);
  assert.match(image, /width="1122" height="1402"/);
  assert.match(image, /height:auto/);
  assert.match(image, /border-radius:6px/);
  assert.doesNotMatch(image, /(?:animation|transition|transform|border):/);
});
test("membership CTA matches the image width and stays centered", () => {
  setup();
  const html = page("app/no-socio/carnet/page.tsx");
  const image = html.match(/<img[^>]+src="\/asociate_img\.png"[^>]*>/)?.[0];
  const button = html.match(/<a[^>]+href="https:\/\/wa\.me\/[^>]*>/)?.[0];
  assert.ok(image);
  assert.ok(button);
  assert.match(image, /width:100%/);
  const imageMaxWidth = image.match(/max-width:([^;"\s]+)/)?.[1];
  assert.equal(imageMaxWidth, "400px");
  assert.ok(button.includes(`max-width:${imageMaxWidth}`));
  assert.match(button, /class="btn block"/);
  assert.match(button, /display:flex/);
  assert.match(button, /margin:20px auto 0/);
});
test("only the invitation centers its image and CTA in a growing, navigation-safe viewport", () => {
  setup();
  const html = page("app/no-socio/carnet/page.tsx");
  assert.match(html, /<div class="no-socio-invitacion"><header class="enc">[\s\S]*?<\/header><div class="wrap"><h2[^>]*>Hola, Mateo Álvarez<\/h2><img/);
  assert.match(html.match(/<img[^>]+src="\/asociate_img\.png"[^>]*>/)?.[0] || "", /margin:0 auto/);
  const css = require("node:fs").readFileSync(path.join(root, "app/globals.css"), "utf8");
  const layout = css.match(/\.no-socio-invitacion\s*\{([^}]+)\}/)?.[1];
  const content = css.match(/\.no-socio-invitacion > \.wrap\s*\{([^}]+)\}/)?.[1];
  const children = css.match(/\.no-socio-invitacion > \.wrap > \*\s*\{([^}]+)\}/)?.[1];
  assert.ok(layout);
  assert.match(layout, /min-height:\s*100svh/);
  assert.match(layout, /display:\s*flex/);
  assert.match(layout, /flex-direction:\s*column/);
  assert.ok(content);
  for (const rule of [/flex:\s*1\s*;/, /width:\s*100%/, /display:\s*flex/, /flex-direction:\s*column/, /justify-content:\s*center/, /padding-top:\s*16px/]) assert.match(content, rule);
  assert.match(children || "", /flex-shrink:\s*0/);
  assert.doesNotMatch(layout + content, /(?:^|;)\s*height\s*:|overflow\s*:\s*hidden|padding-bottom\s*:/);
  for (const section of ["reservas", "padel"]) assert.doesNotMatch(page(`app/no-socio/${section}/page.tsx`), /no-socio-invitacion/);
});
for (const role of ["socio", "no-socio"]) {
  test(`${role} logout appears once in every page header and not below the content`, () => {
    setup(role);
    const sections = role === "socio" ? ["carnet", "cuotas", "reservas", "padel"] : ["carnet", "reservas", "padel"];
    for (const section of sections) {
      const html = page(`app/${role}/${section}/page.tsx`);
      const header = html.match(/<header[^>]*>[\s\S]*?<\/header>/)?.[0];
      assert.ok(header, section);
      assert.match(header, /<button type="button" class="salir-enc">Salir<\/button>/);
      assert.equal((html.match(/>Salir<\/button>/g) || []).length, 1);
    }
    const html = shell(role);
    assert.doesNotMatch(html, />Salir<\/button>|padding-top:0/);
    assert.match(html, /<main class="socio-main"><p>Private view<\/p><\/main>/);
  });
  test(`${role} header logout clears the session exactly once before returning to login`, () => {
    setup(role);
    const { Encabezado } = require("../components/ui.tsx");
    const header = Encabezado({ titulo: "Inicio", escudo: false });
    const buttons = React.Children.toArray(header.props.children).filter((child) => child.type === "button");
    assert.equal(buttons.length, 1);
    assert.deepEqual(logoutEvents, []);
    buttons[0].props.onClick();
    assert.deepEqual(logoutEvents, [["logout"], ["replace", "/"]]);
  });
}
test("member shell no longer renders the bottom logout wrapper", () => {
  setup("socio");
  assert.match(shell("socio"), /<main class="socio-main"><p>Private view<\/p><\/main>/);
  assert.doesNotMatch(shell("socio"), />Salir<\/button>|padding-top:0/);
});
test("nonmember footer spacing reserves only the navigation height, safe area and a small gap", () => {
  setup();
  assert.match(shell("no-socio"), /class="socio-app no-socio-app"/);
  const css = require("node:fs").readFileSync(path.join(root, "app/globals.css"), "utf8");
  const spacing = css.match(/\.no-socio-app \.wrap\s*\{([^}]+)\}/)?.[1];
  assert.ok(spacing);
  assert.match(spacing, /padding-bottom:\s*calc\(89px \+ env\(safe-area-inset-bottom, 0px\)\)/);
  assert.match(css, /\.wrap\s*\{[^}]*padding: 8px 20px 120px/);
});
test("staff headers and StaffShell retain their content and sole topbar logout", () => {
  const { Encabezado } = require("../components/ui.tsx");
  const { StaffShell } = require("../components/Shells.tsx");
  for (const role of ["secretaria", "comision", "dt"]) {
    setup(role);
    const header = React.createElement(Encabezado, { titulo: "Existing title", sub: "Existing subtitle", escudo: false });
    assert.equal(renderToStaticMarkup(header), '<header class="enc"><div><h1>Existing title</h1><p>Existing subtitle</p></div></header>');
    const props = { rol: role, etiqueta: role, items: [{ href: pathname, label: "Existing link" }], children: header };
    const html = renderToStaticMarkup(React.createElement(StaffShell, props));
    assert.match(html, /<div class="topbar"><div class="marca"><img[^>]*height="40"/);
    assert.ok(html.includes(`<small>${role}</small>`));
    const link = html.match(/<a\b[^>]*>Existing link<\/a>/)?.[0];
    assert.ok(link?.includes(`href="${pathname}"`));
    assert.match(link, /aria-current="page"/);
    assert.match(html, /<button class="salir">Salir<\/button><\/div><main><header/);
    assert.equal((html.match(/>Salir<\/button>/g) || []).length, 1);
    assert.doesNotMatch(html, /salir-enc/);
    const originalEffect = React.useEffect;
    let tree;
    try {
      React.useEffect = () => {};
      tree = StaffShell(props);
    } finally {
      React.useEffect = originalEffect;
    }
    const topbar = React.Children.toArray(tree.props.children)[0];
    const button = React.Children.toArray(topbar.props.children).find((child) => child.type === "button");
    assert.deepEqual(logoutEvents, []);
    button.props.onClick();
    assert.deepEqual(logoutEvents, [["logout"], ["replace", "/"]]);
  }
});
test("only member Inicio centers its card and payment group with navigation-safe scrolling", () => {
  setup("socio");
  account.state.cuotas = [{ estado: "vencida" }];
  const html = page("app/socio/carnet/page.tsx");
  assert.match(html, /<div style="min-height:100svh;display:flex;flex-direction:column"><header class="enc">/);
  assert.match(html, /<\/header><div class="wrap" style="flex:1;width:100%;display:flex;flex-direction:column;justify-content:center;padding-top:16px;padding-bottom:calc\(89px \+ env\(safe-area-inset-bottom, 0px\)\)"><div style="width:100%;max-width:400px;margin:0 auto;flex-shrink:0"><article class="carnet"/);
  assert.match(html, /<\/article><a[^>]*href="\/socio\/cuotas"[^>]*>Pagar cuota<\/a><\/div><\/div><\/div>$/);
  const layout = html.split('<article class="carnet"')[0];
  assert.doesNotMatch(layout, /(?:"|;)height:|overflow:hidden/);
  account.state.cuotas = [];
  const paid = page("app/socio/carnet/page.tsx");
  assert.match(paid, /max-width:400px;margin:0 auto;flex-shrink:0/);
  assert.doesNotMatch(paid, /Pagar cuota/);
  for (const section of ["cuotas", "reservas", "padel"]) {
    assert.doesNotMatch(page(`app/socio/${section}/page.tsx`), /min-height:100svh|justify-content:center|padding-bottom:calc\(89px/);
  }
});
test("member card retains its identity, QR and overdue payment action", () => {
  setup("socio");
  account.state.cuotas = [{ estado: "vencida" }];
  const html = page("app/socio/carnet/page.tsx");
  assert.match(html, /Lucía<br\/>Fernández/);
  assert.match(html, /Socia Nº 1247/);
  assert.match(html, /class="qr"><svg/);
  assert.match(html, /Debés 1 cuota/);
  assert.match(html, /href="\/socio\/cuotas"/);
  assert.match(html, /Pagar cuota/);
  assert.doesNotMatch(html, /asociate_img|Quiero asociarme/);
});
test("old nonmember fees route redirects to Inicio without altering account data", () => {
  setup();
  account.state.cuotas = [{ id: "saved", estado: "vencida" }];
  account.state.pagos = [{ id: "previous" }];
  const before = JSON.stringify(account);
  const Page = require("../app/no-socio/cuotas/page.tsx").default;
  assert.throws(() => renderToStaticMarkup(React.createElement(Page)), (result) => result instanceof RedirectResult && result.destination === "/no-socio/carnet");
  assert.equal(JSON.stringify(account), before);
  assert.deepEqual(logoutEvents, []);
});
test("nonmember hall requests show only their own requests, retaining shared availability", () => {
  setup();
  account.state.reservas = [
    { id: "own", espacio: "quinta", dia: 11, turno: "mediodia", quien: "Mateo Álvarez", estado: "pendiente", evento: "Fiesta" },
    { id: "other", espacio: "quinta", dia: 13, turno: "noche", quien: "Lucía Fernández", estado: "aprobada", evento: "Cena" },
  ];
  const html = page("app/no-socio/reservas/page.tsx");
  assert.match(html, /aria-label="13 de noviembre, queda un turno"/);
  const mine = html.split("Mis pedidos")[1];
  assert.ok(mine);
  assert.match(mine, /11 de noviembre/);
  assert.doesNotMatch(mine, /13 de noviembre/);
});
test("nonmember padel reuses the existing booking interface", () => {
  setup();
  const html = page("app/no-socio/padel/page.tsx");
  assert.match(html, /pádel/i);
  assert.match(html, /16:00/);
  assert.doesNotMatch(html, /Lucía|no socia/i);
});
test("member navigation retains its four routes and fees retain member identity and history", () => {
  setup("socio");
  const html = shell("socio");
  for (const section of ["carnet", "cuotas", "reservas", "padel"]) assert.ok(html.includes('href="/socio/' + section + '"'));
  assert.match(html, />Inicio<\/a>/);
  assert.doesNotMatch(html, /href="\/no-socio/);
  const fees = page("app/socio/cuotas/page.tsx");
  assert.match(fees, /Lucía Fernández · Socia Nº 1247/);
  assert.match(fees, /<h1>Mis cuotas<\/h1>/);
  assert.match(fees, /Pagos anteriores/);
});
test("nonmembers cannot render member or staff shells", () => {
  setup();
  assert.equal(shell("socio"), '<div class="cargando">Cargando…</div>');
  const { StaffShell } = require("../components/Shells.tsx");
  for (const rol of ["secretaria", "comision", "dt"]) {
    const html = renderToStaticMarkup(React.createElement(StaffShell, { rol, etiqueta: rol, items: [] }, "Restricted data"));
    assert.equal(html, '<div class="cargando">Cargando…</div>');
  }
});
