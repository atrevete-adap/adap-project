#!/usr/bin/env node
'use strict';

// Read-only validation of the active textual contracts. No dependency or fixed FR counts.
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--root')) {
  console.error('Usage: node scripts/validate-use-cases.cjs [--root repository]');
  process.exit(2);
}
const root = args.length ? path.resolve(args[1]) : path.resolve(__dirname, '..');
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const unique = values => [...new Set(values)];
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
const frRefs = text => unique(text.match(/(?<![A-Za-z0-9])FR\d+(?:\.\d+)*/g) || []);
const ucRefs = text => unique(text.match(/\bUC-\d{2}\b/g) || []);
const field = (text, name) => text.match(new RegExp('^\\* \\*\\*' + name + ':\\*\\* (.+)$', 'm'))?.[1];
const section = (text, heading) => {
  const tail = text.slice(text.indexOf(heading) + heading.length);
  return tail.split('\n## ')[0];
};
const rows = text => text.split('\n').filter(line => /^\| /.test(line)).map(line => line.split('|').slice(1, -1).map(cell => cell.trim()));

const requirements = read('doc/src/requirements.md');
const definitions = [...requirements.matchAll(/^( *)- \*\*(FR\d+(?:\.\d+)*)\.\*\*/gm)]
  .map(m => ({ id: m[2], child: !!m[1] }));
const defined = new Map(definitions.map(def => [def.id, def]));
const parents = definitions.filter(def => !def.child);
const children = definitions.filter(def => def.child);
check(definitions.length > 0, 'No FR definitions found; check requirement syntax.');
check(defined.size === definitions.length, 'Duplicate FR definitions in requirements.md.');
const parentOf = id => id.slice(0, id.lastIndexOf('.'));
for (const child of children) {
  check(defined.has(parentOf(child.id)), `${child.id}: defining parent is missing.`);
}
const otherDefinitions = new Set([...requirements.matchAll(/^- ((?:BR|UR|NFR)-\d+):/gm)].map(m => m[1]));
const directory = 'doc/src/use-cases';
const names = fs.readdirSync(path.join(root, directory));
check(names.every(name => name === 'README.md' || /^UC-\d{2}\.md$/.test(name)), 'Unexpected file in use-cases directory.');
const contracts = names.filter(name => /^UC-\d{2}\.md$/.test(name)).sort().map(name => {
  const file = `${directory}/${name}`;
  const text = read(file);
  return { id: name.slice(0, -3), file, text, related: frRefs(field(text, 'Related requirements') || '') };
});
check(contracts.length > 0, 'No contracts found.');
const ids = new Set(contracts.map(uc => uc.id));
const index = read(`${directory}/README.md`);
const inventory = rows(section(index, '## 2. Inventory')).filter(row => /^\[UC-/.test(row[0]));
check(same(inventory.flatMap(row => ucRefs(row[0])), ids), 'Inventory IDs differ from contract filenames.');
check(inventory.length === contracts.length, 'Inventory has duplicate or missing rows.');
const active = [
  ['README.md', read('README.md')],
  ['doc/src/use-case-specification.md', read('doc/src/use-case-specification.md')],
  [`${directory}/README.md`, index],
  ['notes/delivery2-use-case-handoff.md', read('notes/delivery2-use-case-handoff.md')],
  ...contracts.map(uc => [uc.file, uc.text])
];
for (const [file, text] of active) {
  for (const ref of frRefs(text)) check(defined.has(ref), `${file}: nonexistent requirement ${ref}.`);
  for (const ref of unique(text.match(/\b(?:BR|UR|NFR)-\d+\b/g) || [])) {
    check(otherDefinitions.has(ref), `${file}: nonexistent requirement ${ref}.`);
  }
  for (const match of text.matchAll(/\[[^\]\n]*\]\(([^)]+)\)/g)) {
    const href = match[1];
    if (/^(https?:|mailto:)/.test(href)) continue;
    const [target, fragment] = href.split('#');
    const resolved = target ? path.resolve(root, path.dirname(file), decodeURIComponent(target)) : path.join(root, file);
    check(fs.existsSync(resolved), `${file}: broken local link ${href}.`);
    if (fragment && fs.existsSync(resolved) && /\.md$/i.test(resolved)) {
      const headings = fs.readFileSync(resolved, 'utf8').split(/\r?\n/).filter(line => /^#{1,6} /.test(line))
        .map(line => line.replace(/^#+ /, '').toLowerCase().replace(/[^\p{L}\p{N}_\- ]/gu, '').replace(/ /g, '-'));
      check(headings.includes(fragment), `${file}: broken fragment ${href}.`);
    }
  }
  check(!/^\|\s*(?:Time|Scheduler)\s*\|/m.test(text), `${file}: invalid actor in table.`);
}
for (const uc of contracts) {
  check(uc.text.startsWith(`## ${uc.id}\n`), `${uc.id}: heading and filename differ.`);
  check(field(uc.text, 'ID / Code') === uc.id, `${uc.id}: ID field and filename differ.`);
  for (const key of ['Use Case Name', 'Description', 'Primary Actor', 'Supporting Actors', 'Scope', 'Level', 'Related requirements', 'Source', 'Preconditions', 'Postconditions', 'Success Guarantee', 'Minimal Guarantee', 'Trigger']) {
    check(!!field(uc.text, key), `${uc.id}: missing ${key}.`);
  }
  check(!/\b(Time|Scheduler)\b/.test(field(uc.text, 'Primary Actor') || ''), `${uc.id}: invalid primary actor.`);
  check(!/\b(Time|Scheduler)\b/.test(field(uc.text, 'Supporting Actors') || ''), `${uc.id}: invalid supporting actor.`);
  for (const ref of ucRefs(uc.text)) check(ids.has(ref), `${uc.id}: reference to absent/retired ${ref}.`);
  const inventoryRow = inventory.find(row => ucRefs(row[0])[0] === uc.id);
  if (inventoryRow) {
    check(inventoryRow[1] === field(uc.text, 'Use Case Name'), `${uc.id}: inventory title differs.`);
    check(same(frRefs(inventoryRow[2]), uc.related), `${uc.id}: inventory FR references differ.`);
  }
  const scenario = uc.text.split('* **Main Success Scenario:**\n')[1]?.split('* **Extensions:**')[0] || '';
  const steps = [...scenario.matchAll(/^(\d+)\. (.+)$/gm)];
  check(steps.length > 0, `${uc.id}: no main steps.`);
  steps.forEach((m, i) => {
    check(Number(m[1]) === i + 1, `${uc.id}: nonconsecutive main step ${m[1]}.`);
    check(/^The (system|Operational User|Administrator|Super Administrator) |^(Communication Service|External Application) /.test(m[2]), `${uc.id} step ${m[1]}: acting party not explicit.`);
    check(!/; (?:the (?:system|user)|Communication Service)/i.test(m[2]), `${uc.id} step ${m[1]}: combined acting parties.`);
  });
  const labels = [...uc.text.matchAll(/^  \* \*\*(\d+)([a-z])\.\*\* (.+):$/gm)];
  check(labels.length > 0, `${uc.id}: no labelled extensions.`);
  check(labels.length === (uc.extensions || uc.text.split('* **Extensions:**')[1] || '').split('\n').filter(line => /^  \* /.test(line)).length, `${uc.id}: malformed extension label or condition.`);
  check(unique(labels.map(m => m[1] + m[2])).length === labels.length, `${uc.id}: duplicate extension labels.`);
  for (const label of labels) check(Number(label[1]) >= 1 && Number(label[1]) <= steps.length, `${uc.id}: extension ${label[1]}${label[2]} targets a missing step.`);
  for (const jump of uc.text.matchAll(/\bstep (\d+)\b/gi)) check(Number(jump[1]) >= 1 && Number(jump[1]) <= steps.length, `${uc.id}: jump to missing step ${jump[1]}.`);
  uc.scenario = scenario;
  uc.extensions = uc.text.split('* **Extensions:**')[1] || '';
  for (const branch of uc.extensions.split(/^  \* /m).slice(1)) {
    const actions = [...branch.matchAll(/^    (\d+)\. (.+)$/gm)];
    check(actions.length > 0, `${uc.id}: extension without numbered actions.`);
    actions.forEach((action, i) => {
      check(Number(action[1]) === i + 1, `${uc.id}: nonconsecutive extension substep ${action[1]}.`);
      check(/^(The (?:system|Operational User|Administrator|Super Administrator|authorised account administrator|account administrator|authorised Administrator|authorised template editor|staff template editor|flow)|Communication Service|External Application) /.test(action[2]), `${uc.id}: extension action lacks an explicit acting party or flow destination: ${action[2]}`);
    });
  }
}

// Every defined parent must be cited explicitly. Textual FR prefixes do not make
// FR1 a substitute for independent defined parents such as FR1.1 or FR1.3.
const explicitlyMapped = new Set(contracts.flatMap(uc => uc.related));
for (const parent of parents) check(explicitlyMapped.has(parent.id), `${parent.id}: no explicit parent coverage.`);
const covered = new Set(explicitlyMapped);
for (const child of children) {
  let ancestor = parentOf(child.id);
  while (ancestor && !covered.has(ancestor)) ancestor = ancestor.includes('.') ? parentOf(ancestor) : '';
  if (ancestor) covered.add(child.id);
  check(covered.has(child.id), `${child.id}: no direct or inherited coverage.`);
}
const matrix = rows(section(index, '## 5. Functional requirement traceability')).filter(row => /^FR\d/.test(row[0]));
check(same(matrix.map(row => row[0]), parents.map(parent => parent.id)), 'Traceability parent rows differ from current definitions.');
check(matrix.length === parents.length, 'Duplicate or missing traceability parent rows.');
for (const parent of parents) {
  const row = matrix.find(row => row[0] === parent.id);
  if (!row) continue;
  const owners = contracts.filter(uc => uc.related.includes(parent.id)).map(uc => uc.id);
  check(same(ucRefs(row[1]), owners), `${parent.id}: traceability contract owners differ.`);
  const descendants = children.filter(child => parentOf(child.id) === parent.id).map(child => child.id);
  check(same(frRefs(row[2]), descendants), `${parent.id}: traceability child definitions differ.`);
}
const correspondence = rows(section(index, '## 3. Single ID correspondence')).filter(row => /^UC-/.test(row[0]));
check(unique(correspondence.map(row => row[0])).length === correspondence.length, 'Duplicate source ID in correspondence table.');
check(same(correspondence.flatMap(row => ucRefs(row[2])), ids), 'Correspondence targets differ from active contract IDs.');
check(correspondence.flatMap(row => ucRefs(row[2])).length === ids.size, 'Active contract mapped more than once.');
const relations = rows(section(index, '## 4. Contract relationships')).filter(row => /^\[UC-/.test(row[0]));
const included = new Map();
for (const row of relations) {
  const from = ucRefs(row[0])[0];
  const to = ucRefs(row[2])[0];
  check(ids.has(from) && ids.has(to), `Relationship ${from} -> ${to}: missing contract.`);
  check(['include', 'extend', 'workflow handoff'].includes(row[1]), `Unknown relationship kind ${row[1]}.`);
  const caller = contracts.find(uc => uc.id === from);
  const target = contracts.find(uc => uc.id === to);
  if (!caller || !target) continue;
  if (row[1] === 'include') {
    check(ucRefs(caller.scenario).includes(to), `${from} includes ${to}, but invocation is absent from main steps.`);
    const point = row[3].match(/^Step (\d+):/);
    if (point) {
      const step = caller.scenario.match(new RegExp('^' + point[1] + '\\. (.+)$', 'm'))?.[1] || '';
      check(ucRefs(step).includes(to), `${from}: relationship table points to the wrong include step ${point[1]}.`);
    }
    included.set(from, [...(included.get(from) || []), to]);
  } else if (row[1] === 'extend') {
    check(ucRefs(target.extensions).includes(from), `${from} extends ${to}, but the base extensions do not invoke it.`);
  } else {
    check(ucRefs(caller.scenario + caller.extensions).includes(to), `${from} handoff to ${to} missing from steps/extensions.`);
  }
  const anchorContract = row[1] === 'extend' ? target : caller;
  for (const point of row[3].matchAll(/\b(\d+[a-z])\b/g)) {
    check(anchorContract.extensions.includes(`**${point[1]}.**`), `${anchorContract.id}: relationship table references missing extension ${point[1]}.`);
  }
}
function visit(id, trail = []) {
  if (trail.includes(id)) { errors.push(`Include cycle: ${[...trail, id].join(' -> ')}`); return; }
  for (const next of included.get(id) || []) visit(next, [...trail, id]);
}
for (const id of included.keys()) visit(id);

// Report pre-existing source defects separately: this task must not edit requirements.
const sourceUnknown = frRefs(requirements).filter(ref => !defined.has(ref));
if (sourceUnknown.length) console.warn(`SOURCE NOTICE (requirements.md, outside edited contracts): undefined references ${sourceUnknown.join(', ')}.`);
if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}
const enumeratedChildren = children.filter(child => active.some(([, text]) => frRefs(text).includes(child.id)));
const explicitRelatedChildren = children.filter(child => explicitlyMapped.has(child.id));
const proseChildren = children.filter(child => active.some(([, text]) => frRefs(text.replace(/\|[^\n]*\|/g, '')).includes(child.id)));
console.log(`PASS: ${contracts.length} individual contracts; IDs, fields, inventory, correspondence, local links, extension anchors and relationship invocations are coherent.`);
console.log(`PASS: ${parents.length} defined parent FR explicitly mapped; ${children.length} defined sub-requirements covered through their defining parents; ${defined.size} current FR definitions covered; no undefined requirements in active documentation.`);
console.log(`INFO: ${enumeratedChildren.length} child IDs enumerated in active documentation (including traceability); ${explicitRelatedChildren.length} explicitly mapped in Related requirements; ${proseChildren.length} cited in prose outside tables. These counts have different meanings.`);
console.log('PASS: no Time or Scheduler actors in active textual contracts. Diagram and PDF synchronisation remain outside this validator.');
