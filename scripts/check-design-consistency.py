import re, sys, os, glob
# Design consistency check (#51): class diagram vs domain model, component
# diagram, sequence diagrams and (when present) the ER diagram.
# Usage: python3 scripts/check-design-consistency.py
root = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = os.path.join(root, 'doc', 'src')
cd = open(os.path.join(src, 'class-diagram.pu')).read()

# --- parse class diagram types and operations
types = {}   # name -> {'kind','ops':{name:[nparams...]}, 'attrs':set, 'stereo'}
cur = None
for line in cd.splitlines():
    m = re.match(r'\s*(abstract\s+)?(class|interface|enum)\s+(\w+)\s*(<<(\w+)>>)?[^{]*\{', line)
    if m:
        cur = m.group(3); types[cur] = {'kind': m.group(2), 'ops': {}, 'attrs': set(), 'stereo': m.group(5), 'values': set()}
        continue
    if cur and re.match(r'\s*\}', line):
        cur = None; continue
    if cur:
        om = re.match(r'\s*[+\-#~]\s*(\{static\}\s*|\{abstract\}\s*)?(\w+)\((.*)\)', line)
        if om:
            params = om.group(3).strip()
            plist = [p for p in re.split(r',(?![^<]*>)', params) if p.strip()] if params else []
            req = len([p for p in plist if '[0..1]' not in p])
            types[cur]['ops'].setdefault(om.group(2), []).extend(range(req, len(plist) + 1))
            continue
        am = re.match(r'\s*[+\-#~]\s*(\w+)\s*:', line)
        if am:
            types[cur]['attrs'].add(am.group(1)); continue
        vm = re.match(r'\s*([A-Z][A-Z0-9_]+)\s*$', line)
        if vm and types[cur]['kind'] == 'enum':
            types[cur]['values'].add(vm.group(1))

print(f"class diagram: {len(types)} types, {sum(len(t['ops']) for t in types.values())} distinct operation names")
problems = []

# --- domain model concepts present
dm = open(os.path.join(src, 'domain-model.pu')).read()
for c in re.findall(r'^\s*class\s+(\w+)', dm, re.M):
    if c not in types: problems.append(f"[domain] concept {c} missing in class diagram")

# --- component names (a sequence lifeline may be a component of #46)
comp_names = set(re.findall(r'^\s*component\s+"([^"]+)"', open(os.path.join(src, 'component-diagram.pu')).read(), re.M))

# --- sequence diagrams
def split_args(s):
    s = s.strip()
    if not s: return []
    out, depth, buf = [], 0, ''
    for ch in s:
        if ch in '(<[': depth += 1
        if ch in ')>]': depth -= 1
        if ch == ',' and depth == 0: out.append(buf); buf = ''
        else: buf += ch
    out.append(buf)
    return [a for a in out if a.strip()]

for f in sorted(glob.glob(os.path.join(src, 'sequence-*.pu'))):
    name = os.path.basename(f)
    txt = open(f).read()
    parts = {}
    for m in re.finditer(r'^\s*(participant|actor|boundary|control|entity|database|collections)\s+(\w+)\s+as\s+"([^"]+)"', txt, re.M):
        alias, label = m.group(2), m.group(3)
        typ = label.split(':')[-1].strip() if ':' in label else label.strip()
        parts[alias] = typ
    for m in re.finditer(r'^\s*(participant|actor)\s+"([^"]+)"\s+as\s+(\w+)', txt, re.M):
        label = m.group(2); parts[m.group(3)] = label.split(':')[-1].strip()
    actors = set(re.findall(r'^\s*actor\s+(\w+)', txt, re.M))
    for a, t in parts.items():
        if a in actors or t in comp_names: continue
        if t not in types and not t.endswith('(User)'):
            problems.append(f"[{name}] lifeline {a} : {t} is not a class/interface in the class diagram")
    for ln, line in enumerate(txt.splitlines(), 1):
        m = re.match(r'\s*\[?(\w*)\s*-+>\s*(\w+)\s*:\s*(<<create>>\s*)?(\w+)\((.*)\)\s*$', line)
        if not m: continue
        tgt, op, args = m.group(2), m.group(4), m.group(5)
        t = parts.get(tgt)
        if t is None or t not in types: continue
        ops = types[t]['ops']
        if op == t:
            continue  # constructor
        if op not in ops:
            problems.append(f"[{name}:{ln}] {t}.{op} does not exist in the class diagram")
        elif len(split_args(args)) not in ops[op]:
            problems.append(f"[{name}:{ln}] {t}.{op} called with {len(split_args(args))} args, class diagram has {ops[op]}")
        for v in re.findall(r'\b([A-Z][A-Z0-9]*_[A-Z0-9_]+|[A-Z]{4,})\b', args):
            if not any(v in tt['values'] for tt in types.values() if tt['kind']=='enum'):
                problems.append(f"[{name}:{ln}] value {v} is not an enum value in the class diagram")

# --- component diagram names vs class diagram
comp = open(os.path.join(src, 'component-diagram.pu')).read()
for i in re.findall(r'^interface\s+"(\w+)"', comp, re.M):
    if i in ('Repositories','JobTrigger','SQL','PaymentsAPI','SendEmail','SendMessage') or i.endswith('API') or i.endswith('Model'):
        continue
    if i not in types: problems.append(f"[component] port {i} not in class diagram")
ports_cd = sorted(t for t, v in types.items() if v['stereo']=='port' and not t.endswith('Repository'))
ports_comp = set(re.findall(r'^interface\s+"(\w+)"', comp, re.M))
for p in ports_cd:
    if p not in ports_comp: problems.append(f"[component] class-diagram port {p} missing in component diagram")

# controller -> port deps
cdeps = set(re.findall(r'^(\w+Controller)\s+\.\.>\s+(\w+)\s*$', cd, re.M))
alias = {'AccessCtrl':'AccessController','CustomerCtrl':'CustomerSubscriptionController','InvoicingCtrl':'InvoicingController',
 'CollectionsCtrl':'CollectionsController','ApprovalCtrl':'ApprovalController','ReportingCtrl':'ReportingOperationsController',
 'ConfigCtrl':'ConfigurationController','AuditCtrl':'AuditBackupController'}
ialias = dict(re.findall(r'^interface\s+"(\w+)"\s+as\s+(\w+)', comp, re.M)); ialias = {v:k for k,v in ialias.items()}
compdeps = set()
for a,b in re.findall(r'^(\w+Ctrl)\s+\.\.>\s+(\w+)', comp, re.M):
    if a in alias and b in ialias: compdeps.add((alias[a], ialias[b]))
for c,p in sorted(cdeps):
    if p in ports_cd and (c,p) not in compdeps:
        problems.append(f"[component] {c} -> {p} is in the class diagram but not in the component diagram")
for c,p in sorted(compdeps):
    if p in ports_cd and (c,p) not in cdeps:
        problems.append(f"[component] {c} -> {p} is in the component diagram but not in the class diagram")

# --- ER diagram (if present)
for f in glob.glob(os.path.join(src, 'er-diagram*.pu')):
    print('ER diagram found:', os.path.basename(f), '(check tables against classes manually)')


# --- controller -> port/repository calls in sequences must be declared dependencies in the class diagram
alldeps = set(re.findall(r'^(\w+)\s+\.\.>\s+(\w+)', cd, re.M))
for f in sorted(glob.glob(os.path.join(src, 'sequence-*.pu'))):
    txt = open(f).read(); name = os.path.basename(f)
    parts = {a: l.split(':')[-1].strip() for a, l in re.findall(r'^\s*participant\s+(\w+)\s+as\s+"([^"]+)"', txt, re.M)}
    seen = set()
    for a, b in re.findall(r'^\s*(\w+)\s+-+>\s+(\w+)\s*:', txt, re.M):
        ta, tb = parts.get(a), parts.get(b)
        if ta and tb and ta.endswith('Controller') and types.get(tb, {}).get('stereo') == 'port' and (ta, tb) not in alldeps and (ta, tb) not in seen:
            seen.add((ta, tb)); problems.append(f"[{name}] {ta} calls {tb} but the class diagram has no {ta} ..> {tb}")
# adapters per port
real = set(re.findall(r'^(\w+)\s+\.\.\|>\s+(\w+)', cd, re.M))
for p in ports_cd:
    if not any(b == p for a, b in real): problems.append(f"[class] port {p} has no adapter realising it")

print(f"\n{len(problems)} problems")
for p in problems: print(' -', p)
sys.exit(1 if problems else 0)
