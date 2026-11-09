const assert = require("node:assert/strict");
const path = require("node:path");
const Module = require("node:module");
const test = require("node:test");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const root = path.resolve(__dirname, "..");
const originalLoad = Module._load;
const originalResolve = Module._resolveFilename;

// Render the public page components without starting Next's router or a browser.
Module._load = function (request, parent, isMain) {
  if (request === "next/navigation") {
    return { useRouter: () => ({ push() {}, replace() {} }), usePathname: () => "/" };
  }
  return originalLoad.call(this, request, parent, isMain);
};
Module._resolveFilename = function (request, ...args) {
  return originalResolve.call(this, request.startsWith("@/") ? path.join(root, request.slice(2)) : request, ...args);
};
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const source = require("node:fs").readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    });
    module._compile(outputText, filename);
  };
}

const { DemoProvider } = require("../lib/store.tsx");
function renderPage(relativePath) {
  const Page = require(path.join(root, relativePath)).default;
  return renderToStaticMarkup(React.createElement(DemoProvider, null, React.createElement(Page)));
}

const login = () => renderPage("app/page.tsx");

test("login uses a general sign-in button without adding a tagline", () => {
  const html = login();
  assert.match(html, /<button[^>]*type="submit"[^>]*>Ingresar<\/button>/);
  assert.doesNotMatch(html, /Ver mi carnet|Tus actividades, cuotas y reservas en un solo lugar/);
});

test("password visibility is an accessible eye button inside its field", () => {
  const html = login();
  assert.match(html, /<div class="password-field"><input[^>]*id="password"[^>]*type="password"/);
  assert.match(html, /<button[^>]*type="button"[^>]*class="password-toggle"[^>]*aria-label="Mostrar contraseña"[^>]*aria-pressed="false"[^>]*aria-controls="password"[^>]*><svg/);
  assert.doesNotMatch(html, />Ver contraseña</);
});

test("password recovery is a separate email form explicitly marked as a simulation", () => {
  const html = login();
  assert.match(html, /<a[^>]*href="\/recuperar-contrasena"[^>]*>¿Olvidaste tu contraseña\?<\/a>/);
  assert.doesNotMatch(html, /Te la mandamos por WhatsApp o email/);
  const recovery = renderPage("app/recuperar-contrasena/page.tsx");
  assert.match(recovery, /Recuperar contraseña/);
  assert.match(recovery, /<input[^>]*type="email"[^>]*required=""/);
  assert.match(recovery, /Enviar enlace de recuperación/);
  assert.match(recovery, /No se enviarán correos/);
  assert.match(recovery, /<a[^>]*href="\/"/);
});

test("the non-member example has distinct credentials in the existing member box", () => {
  const html = login();
  const example = html.match(/<div class="demo-box"[^>]*><strong>Demo · socio de ejemplo<\/strong>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(example, "the existing member example box remains present");
  assert.match(example, /Entrar directo como socia/);
  assert.match(example, /Entrar directo como no socio/);
  assert.doesNotMatch(html, /no socia/i);
  const credentials = [...example.matchAll(/DNI <b>(\d+)<\/b> · contraseña <b>([^<]+)<\/b>/g)];
  assert.equal(credentials.length, 2);
  assert.notEqual(credentials[0][1], credentials[1][1]);
  assert.notEqual(credentials[0][2], credentials[1][2]);
});

test("existing member and staff demo entries remain available", () => {
  const html = login();
  for (const label of ["Entrar directo como socia", "Secretaria", "Comisión directiva", "Profesor / DT", "Reiniciar la demo (borra lo que hiciste)"]) {
    assert.ok(html.includes(label), label);
  }
  assert.match(html, /DNI <b>38456123<\/b> · contraseña <b>1234<\/b>/);
  assert.match(html, /Tu DNI/);
  assert.match(html, /Tu contraseña/);
});
