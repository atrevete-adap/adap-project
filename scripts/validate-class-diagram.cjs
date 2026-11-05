#!/usr/bin/env node
'use strict';

// Read-only consistency check of the class diagram source. It complements, and does
// not replace, rendering with PlantUML: it does not prove the file parses.
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--root')) {
  console.error('Usage: node scripts/validate-class-diagram.cjs [--root repository]');
  process.exit(2);
}
const root = args.length ? path.resolve(args[1]) : path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };

const source = read('doc/src/class-diagram.pu');
const domainSource = read('doc/src/domain-model.pu');
const trace = read('doc/src/class-diagram-traceability.md');

// Keep identifiers as declared; drop annotations that are not part of the type.
const cleanType = text => text.replace(/\{readOnly\}/g, '').replace(/\[[^\]]*\]/g, '').trim();
const typeNames = text => text.match(/[A-Za-z_][A-Za-z0-9_]*/g) || [];

function parseClasses(text) {
  const classes = new Map();
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const head = lines[i].match(/^\s*(class|interface|enum)\s+([A-Za-z_][A-Za-z0-9_]*)\b(.*)$/);
    if (!head) continue;
    const [, kind, name, rest] = head;
    const entry = { kind, name, attributes: new Map(), operations: new Map(), literals: [], tags: rest.match(/\$[a-z]+/g) || [] };
    check(!classes.has(name), `class-diagram.pu: ${name} is defined more than once.`);
    if (rest.trim().endsWith('{')) {
      for (i += 1; i < lines.length && !/^\s*\}\s*$/.test(lines[i]); i++) {
        const member = lines[i].trim();
        if (!member || member.startsWith("'")) continue;
        const parsed = member.match(/^([-+#~])\s*(\{static\}\s*)?([A-Za-z_][A-Za-z0-9_]*)(\(.*\))?\s*(?::\s*(.+))?$/);
        if (!parsed) { entry.literals.push(member); continue; }
        const [, visibility, , memberName, params, type] = parsed;
        if (params !== undefined) {
          check(type !== undefined, `${name}.${memberName}: operation without a return type.`);
          entry.operations.set(memberName, { visibility, params: params.slice(1, -1), type: type || '' });
        } else {
          check(type !== undefined, `${name}.${memberName}: attribute without a type.`);
          entry.attributes.set(memberName, { visibility, type: type || '' });
        }
      }
    }
    classes.set(name, entry);
  }
  return classes;
}

const classes = parseClasses(source);
const builtin = new Set(['String', 'Integer', 'Boolean', 'Decimal', 'Binary', 'Date', 'DateTime', 'YearMonth',
  'CurrencyCode', 'CountryCode', 'LanguageCode', 'List', 'Set', 'Map', 'void']);
const known = name => builtin.has(name) || classes.has(name);

// Every attribute, parameter and return type must be declared.
for (const entry of classes.values()) {
  for (const [name, attribute] of entry.attributes) {
    for (const ref of typeNames(cleanType(attribute.type))) check(known(ref), `${entry.name}.${name}: unknown type ${ref}.`);
  }
  for (const [name, operation] of entry.operations) {
    for (const ref of typeNames(cleanType(operation.type))) check(known(ref), `${entry.name}.${name}: unknown return type ${ref}.`);
    const params = operation.params.replace(/<[^>]*>/g, m => m.replace(/,/g, ';'));
    for (const param of params.split(',').map(p => p.trim()).filter(Boolean)) {
      const match = param.match(/^[A-Za-z_][A-Za-z0-9_]*:\s*(.+)$/);
      check(!!match, `${entry.name}.${name}: parameter "${param}" has no name and type.`);
      if (match) for (const ref of typeNames(cleanType(match[1]))) check(known(ref), `${entry.name}.${name}: unknown parameter type ${ref}.`);
    }
  }
  if (entry.kind === 'enum') check(entry.literals.length > 0, `${entry.name}: enumeration without literals.`);
}

// Amounts use decimals: binary floating point types are never valid here.
check(!/:\s*(Float|Double|Real)\b/i.test(source), 'class-diagram.pu: amounts must use Decimal, not floating point.');

// Layering: only the application layer knows controllers and the execution context.
const applicationNames = new Set([...source.matchAll(/^\s*class\s+(\w+)\s+<<control>>/gm)].map(match => match[1]));
for (const entry of classes.values()) {
  if (applicationNames.has(entry.name)) continue;
  for (const [name, operation] of entry.operations) {
    for (const ref of typeNames(operation.params + ' ' + operation.type)) {
      check(!applicationNames.has(ref), `${entry.name}.${name}: domain or port depends on application class ${ref}.`);
    }
  }
}

// The approved domain model: same concepts, attribute names and multiplicities.
const domain = new Map();
for (const match of domainSource.matchAll(/^class\s+(\w+)\s*\{\n([\s\S]*?)^\}/gm)) {
  domain.set(match[1], match[2].split('\n').map(line => line.trim()).filter(Boolean));
}
check(domain.size > 0, 'domain-model.pu: no concepts found.');
for (const [concept, attributes] of domain) {
  const entry = classes.get(concept);
  check(!!entry, `Domain concept ${concept} is missing from the class diagram.`);
  if (entry) for (const attribute of attributes) check(entry.attributes.has(attribute), `${concept}: domain attribute ${attribute} is missing.`);
}
const assocPattern = /^(\w+)\s+"([^"]+)"\s+(\*?--\*?)\s+"([^"]+)"\s+(\w+)(?:\s*:\s*(.+))?$/;
const parseAssociations = text => text.split('\n').map(line => line.trim().match(assocPattern)).filter(Boolean)
  .map(m => ({ left: m[1], leftMult: m[2], kind: m[3], rightMult: m[4], right: m[5], label: m[6] || '' }));
const domainAssociations = parseAssociations(domainSource);
const diagramAssociations = parseAssociations(source);
check(domainAssociations.length > 0, 'domain-model.pu: no associations found.');
const refined = new Set(['Invoice|Payment']);
for (const assoc of domainAssociations) {
  if (refined.has(`${assoc.left}|${assoc.right}`)) continue;
  const found = diagramAssociations.some(other => other.left === assoc.left && other.right === assoc.right
    && other.leftMult === assoc.leftMult && other.rightMult === assoc.rightMult && other.kind === assoc.kind && other.label === assoc.label);
  check(found, `Domain association differs or is missing: ${assoc.left} "${assoc.leftMult}" ${assoc.kind} "${assoc.rightMult}" ${assoc.right} : ${assoc.label}.`);
}
for (const assoc of diagramAssociations) {
  check(classes.has(assoc.left) && classes.has(assoc.right), `Association between undeclared classes: ${assoc.left}, ${assoc.right}.`);
}
check(diagramAssociations.some(a => a.left === 'Invoice' && a.right === 'Reconciliation'), 'Reconciliation is not linked to Invoice.');
check(diagramAssociations.some(a => a.left === 'Reconciliation' && a.right === 'Payment'), 'Reconciliation is not linked to Payment.');
for (const relation of source.matchAll(/^(\w+)\s+\.\.(?:\|)?>\s+(\w+)/gm)) {
  check(classes.has(relation[1]) && classes.has(relation[2]), `Dependency between undeclared classes: ${relation[1]}, ${relation[2]}.`);
}

// Rules that must stay expressible in the model.
const ops = name => classes.get(name)?.operations || new Map();
for (const port of ['PaymentGateway', 'CommunicationService', 'DocumentStorage', 'PdfRenderer']) {
  check(classes.get(port)?.kind === 'interface', `${port}: published port must be an interface.`);
}
check(classes.has('Scheduler') && !/^\s*actor\s+/m.test(source), 'Scheduler must be an internal class and the diagram has no actors.');
check([...ops('AuditRepository').keys()].every(name => ['append', 'search'].includes(name)), 'AuditRepository must stay append-only.');
check(ops('Invoice').has('issue'), 'Invoice.issue is required.');
for (const name of ['prepareDraft', 'issueInvoice', 'sendInvoice']) check(ops('InvoicingController').has(name), `InvoicingController.${name} is required.`);
check(!diagramAssociations.some(a => [a.left, a.right].includes('Cancellation') && [a.left, a.right].includes('Invoice')), 'Cancellation must stay independent of Invoice.');
check(/^!\$VIEW = "all"$/m.test(source), 'class-diagram.pu must be committed with the complete view selected.');

// Comments and attachments: exactly one target, reached only through the shared contract.
const targets = ['Customer', 'Invoice', 'BillingIssue'];
for (const target of targets) {
  check(new RegExp(`^${target} \\.\\.\\|> AnnotationTarget$`, 'm').test(source), `${target} must realise AnnotationTarget.`);
}
for (const item of ['Comment', 'Attachment']) {
  check(diagramAssociations.some(a => a.left === item && a.right === 'AnnotationTarget' && a.rightMult === '1'), `${item} must have exactly one AnnotationTarget.`);
  check(!diagramAssociations.some(a => [a.left, a.right].includes(item) && targets.some(t => [a.left, a.right].includes(t))), `${item} must not link directly to a target class.`);
  for (const [name, operation] of ops('CommunicationService')) {
    check(!typeNames(operation.params).includes(item), `CommunicationService.${name} must not send a ${item}.`);
  }
}
for (const name of ['addComment', 'addAttachment']) {
  check(/target: AnnotationTarget/.test(ops('CollectionsController').get(name)?.params || ''), `CollectionsController.${name} must take an AnnotationTarget.`);
}
check(diagramAssociations.some(a => a.left === 'Comment' && a.right === 'User' && a.label === 'mentions'), 'Comment must keep its mentions.');

// Delivery results: only verified evidence can change an attempt.
for (const [name, operation] of ops('InvoicingController')) {
  check(!typeNames(operation.params).includes('DeliveryStatus'), `InvoicingController.${name} must not accept a delivery status.`);
}
check(/evidence: DeliveryEvidence/.test(ops('DeliveryAttempt').get('recordObservedResult')?.params || ''), 'DeliveryAttempt.recordObservedResult must take DeliveryEvidence.');
check(/DeliveryEvidence/.test(ops('CommunicationService').get('verifyDeliveryReport')?.type || ''), 'CommunicationService.verifyDeliveryReport must return DeliveryEvidence.');
check(ops('InvoicingController').has('receiveDeliveryReport'), 'InvoicingController.receiveDeliveryReport is required.');

// Balances: the operations the design note relies on, and no invented cash movement.
for (const name of ['adjustedTotal', 'allocatedAmount', 'outstandingBalance', 'excessAmount']) {
  check(ops('Invoice').get(name)?.type === 'Money', `Invoice.${name} must return Money.`);
}
check(ops('Invoice').get('createCorrection')?.type === 'Invoice', 'Invoice.createCorrection must return a new Invoice.');
for (const field of ['outstandingByCurrency', 'overdueByCurrency']) {
  check(classes.get('DebtSnapshot')?.attributes.get(field)?.type === 'List<Money>', `DebtSnapshot.${field} must stay a list per currency.`);
}
for (const entry of classes.values()) {
  for (const name of entry.operations.keys()) check(!/refund/i.test(name), `${entry.name}.${name}: no refund operation is in scope.`);
}

// Functions that the traceability file reports as represented.
for (const [owner, name] of [['ReportingOperationsController', 'saveNamedView'], ['ReportingOperationsController', 'listQuickAccess'],
  ['ReportingOperationsController', 'setNotificationPreference'], ['ReportingOperationsController', 'saveAlertRule'], ['User', 'recordOpened'], ['User', 'channelFor']]) {
  check(ops(owner).has(name), `${owner}.${name} is required.`);
}
check(/\[0\.\.10\]/.test(classes.get('User')?.attributes.get('recentCustomers')?.type || ''), 'User.recentCustomers must be limited to 10.');
check(classes.get('AlertCondition')?.kind === 'enum', 'AlertCondition must be a closed enumeration.');

// Views: each one is named in the header and has its image; core labels name real operations.
const header = source.match(/set \$VIEW below to: (.+)/);
const views = header ? header[1].split('|').map(view => view.trim()) : [];
check(views.includes('core'), 'The core view must be listed in the file header.');
for (const view of views) {
  const file = view === 'all' ? 'class-diagram.png' : `class-diagram-${view}.png`;
  check(fs.existsSync(path.join(root, 'doc/src/img', file)), `View ${view}: image ${file} is missing.`);
  check(trace.includes(`img/${file}`), `View ${view}: image ${file} is not linked from the traceability file.`);
}
check([...classes.values()].some(entry => entry.tags.includes('$core')), 'No class carries the $core tag.');
const coreBlock = source.match(/^!if \(\$VIEW == "core"\)\nhide members\n([\s\S]*?)^!endif/m);
check(!!coreBlock, 'The core view block is missing.');
let coreLabels = 0;
if (coreBlock) {
  for (const link of coreBlock[1].matchAll(/^(\w+) \.\.> (\w+) : (.+)$/gm)) {
    for (const op of link[3].split(',').map(name => name.trim())) {
      coreLabels += 1;
      check(ops(link[1]).has(op) || ops(link[2]).has(op), `Core view label ${op} is not an operation of ${link[1]} or ${link[2]}.`);
    }
  }
}

// Traceability: one row per contract, and every cited operation must exist.
const contracts = fs.readdirSync(path.join(root, 'doc/src/use-cases')).filter(name => /^UC-\d{2}\.md$/.test(name)).map(name => name.slice(0, -3)).sort();
const rows = trace.split('\n').filter(line => /^\| UC-\d{2} \|/.test(line));
const rowIds = rows.map(row => row.match(/UC-\d{2}/)[0]);
check(JSON.stringify(rowIds) === JSON.stringify(contracts), `Traceability rows differ from contracts: ${rowIds.join(', ')}.`);
let cited = 0;
for (const reference of trace.matchAll(/`([A-Z][A-Za-z0-9]*)\.([a-z][A-Za-z0-9]*)`/g)) {
  cited += 1;
  check(ops(reference[1]).has(reference[2]), `Traceability cites ${reference[1]}.${reference[2]}, which is not in the diagram.`);
}
for (const row of rows) {
  check(/`\w+\.\w+`/.test(row.split('|')[2]), `${row.match(/UC-\d{2}/)[0]}: no controller operation cited.`);
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}
const count = kind => [...classes.values()].filter(entry => entry.kind === kind).length;
console.log(`PASS: ${count('class')} classes, ${count('interface')} interfaces and ${count('enum')} enumerations; each defined once, with every type declared.`);
console.log(`PASS: ${domain.size} domain concepts keep their attributes; ${domainAssociations.length - 1} domain associations keep their multiplicities; Invoice-Payment is refined through Reconciliation.`);
console.log(`PASS: ${rows.length} contracts traced; all ${cited} cited operations exist with the same name.`);
console.log(`PASS: annotation targets, delivery evidence, balance operations and ${views.length} views have the expected structure; ${coreLabels} core view labels name real operations.`);
console.log('NOTE: this checks consistency only. It does not prove the design is functionally correct, and PlantUML syntax and layout need a real render.');
