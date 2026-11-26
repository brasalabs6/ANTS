import ts from "typescript";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve, relative, isAbsolute } from "node:path";

export function domainViolations(source: string, filename: string, root: string): string[] {
  const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  const violations: string[] = [];
  function check(specifier: string): void {
    const target = resolve(dirname(filename), specifier);
    const rel = relative(root, target);
    if (!specifier.startsWith("./") && !specifier.startsWith("../") ||
        rel === ".." || rel.startsWith("../") || isAbsolute(rel)) {
      violations.push(specifier);
    }
  }
  function visit(node: ts.Node): void {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      check(node.moduleSpecifier.text);
    } else if (ts.isImportEqualsDeclaration(node)) {
      violations.push("import equals");
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
      check(node.argument.literal.text);
    } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
      violations.push("dynamic import/require");
    } else if (ts.isIdentifier(node) && ["Bun", "process", "require"].includes(node.text)) {
      violations.push(node.text);
    }
    ts.forEachChild(node, visit);
  }
  for (const ref of [...tree.referencedFiles, ...tree.typeReferenceDirectives]) violations.push(ref.fileName);
  visit(tree);
  return violations;
}

function scan(root: string, dir = root): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return scan(root, path);
    if (entry.isSymbolicLink()) return [path + ": symlink forbidden"];
    if (!/\.[cm]?tsx?$/.test(path)) return [];
    return domainViolations(readFileSync(path, "utf8"), path, root).map((item) => path + ": " + item);
  });
}

if (import.meta.main) {
  const violations = scan(resolve("packages/domain/src"));
  if (violations.length) {
    console.error(violations.join("\n"));
    process.exitCode = 1;
  } else console.log("Domain dependency boundary passed");
}
