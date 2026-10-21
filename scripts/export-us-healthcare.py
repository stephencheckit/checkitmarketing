"""
Export the consolidated "US Healthcare targets" Apollo list (built by
build-us-healthcare-list.ts) as a workbook: one row per account with a
segment, plus customers and sub-threshold accounts from the source lists on
their own tabs for reference.

    python3 scripts/export-us-healthcare.py

Reads the pulls in .sdr-data/ (run sdr-baseline-pull.ts and
sdr-target-accounts-pull.ts first).
"""

import collections as C
import json
import os
import re

from target_rules import RULES, customer_reason, load_customers, too_small
from xlsx_writer import write_xlsx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, '.sdr-data')
TARGET_LIST = 'US Healthcare targets · 2026-10'
OUT = os.path.join(DATA, 'exports', 'Checkit - US Healthcare target accounts (consolidated).xlsx')


def load(name):
    with open(os.path.join(DATA, name)) as f:
        return json.load(f)


def segment(name, industry):
    n, i = (name or '').lower(), (industry or '').lower()
    if re.search(r'plasma|blood|tissue|biobank|bio bank|donor|cord|transfusion', n):
        return 'Plasma, blood & tissue'
    if re.search(r'\blab|diagnostic|patholog|reference', n):
        return 'Labs & diagnostics'
    if i in ('pharmaceuticals', 'biotechnology'):
        return 'Pharma & biotech'
    if i == 'research':
        return 'Research & life sciences'
    if i == 'medical devices':
        return 'Medical devices'
    if i == 'hospital & health care':
        return 'Hospitals & health systems'
    if i == 'medical practice':
        return 'Clinics & medical practices'
    return 'Other'


users = {u['id']: (u['name'] or u['email'].split('@')[0].replace('.', ' ').title()) for u in load('users.json')}
stages = {s['id']: (s.get('display_name') or s['name']) for s in load('account_stages.json')}
SDR_IDS = {uid for uid, n in users.items() if n in ('Jordan Ernest', 'Tom Flaskett', 'Bryan Blitman')}

emails = load('emails.json')
calls = load('calls.json')
acct_domain = {}
for e in emails:
    if e['account_id'] and e['to_domain']:
        acct_domain.setdefault(e['account_id'], C.Counter())[e['to_domain']] += 1
acct_domain = {a: c.most_common(1)[0][0] for a, c in acct_domain.items()}
worked = {e['to_domain'] for e in emails if e['status'] == 'completed' and e['user_id'] in SDR_IDS and e['to_domain']}
worked |= {acct_domain[c['account_id']] for c in calls if c['user_id'] in SDR_IDS and c['account_id'] in acct_domain}

accounts = {}
for r in load('target_accounts.json'):
    if r.get('market') != 'us-medical':
        continue
    r = {**r, 'in_target': r['list'] == TARGET_LIST}
    key = (r.get('domain') or r.get('name') or '').lower()
    if key in accounts:
        accounts[key]['lists'].add(r['list'])
        accounts[key]['in_target'] = accounts[key]['in_target'] or r['in_target']
        continue
    accounts[key] = {**r, 'lists': {r['list']}}

rows = []
for r in accounts.values():
    stage = stages.get(r.get('stage'), 'Unknown')
    rows.append({
        'Account': r.get('name'),
        'Segment': segment(r.get('name'), r.get('industry')),
        'Industry': r.get('industry'),
        'Employees': r.get('employees'),
        'Revenue': r.get('revenue'),
        'City': r.get('city'),
        'State': r.get('state'),
        'Country': r.get('country'),
        'Apollo stage': stage,
        'Owner': users.get(r.get('owner'), ''),
        'Contacts in Apollo': r.get('contacts'),
        'SDR outreach to date': 'Yes' if r.get('domain') in worked else 'No',
        'Last activity': (r.get('last_activity') or '')[:10],
        'In lists': len(r['lists']),
        'Source lists': '; '.join(sorted(r['lists'])),
        'Domain': r.get('domain'),
        'LinkedIn': r.get('linkedin'),
        'Apollo account': f"https://app.apollo.io/#/accounts/{r['id']}",
        '_in_target': r['in_target'],
    })

rows.sort(key=lambda x: (x['Segment'], -(x['Employees'] or 0)))
customer_data = load_customers(DATA)
for x in rows:
    x['Customer match'] = customer_reason(x['Account'], x['Domain'], x['Apollo stage'], customer_data) or ''
customers = [x for x in rows if x['Customer match']]
small = [x for x in rows if not x['Customer match'] and not x['_in_target'] and too_small(x['Employees'])]
prospects = [x for x in rows if x['_in_target'] and not x['Customer match']]
for x in rows:
    x.pop('_in_target')
    x['Source lists'] = x['Source lists'].replace(TARGET_LIST + '; ', '').replace('; ' + TARGET_LIST, '').replace(TARGET_LIST, 'Apollo search (new)')

summary = []
for seg, n in C.Counter(x['Segment'] for x in prospects).most_common():
    seg_rows = [x for x in prospects if x['Segment'] == seg]
    summary.append({
        'Segment': seg,
        'Accounts': n,
        '1,000+ employees': sum(1 for x in seg_rows if (x['Employees'] or 0) >= 1000),
        'With contacts in Apollo': sum(1 for x in seg_rows if (x['Contacts in Apollo'] or 0) > 0),
        'SDR outreach to date': sum(1 for x in seg_rows if x['SDR outreach to date'] == 'Yes'),
        'Largest accounts': ', '.join(x['Account'] for x in sorted(seg_rows, key=lambda x: -(x['Employees'] or 0))[:5]),
    })
summary.append({
    'Segment': 'Total',
    'Accounts': len(prospects),
    '1,000+ employees': sum(s['1,000+ employees'] for s in summary),
    'With contacts in Apollo': sum(s['With contacts in Apollo'] for s in summary),
    'SDR outreach to date': sum(s['SDR outreach to date'] for s in summary),
    'Largest accounts': f"Apollo list: US Healthcare targets · 2026-10; {len(customers)} customers and {len(small)} accounts under {RULES['minEmployees']} staff moved to their own tabs",
})

sheets = {'Summary': summary, 'US Healthcare targets': prospects}
if customers:
    sheets['Existing customers'] = customers
if small:
    sheets[f"Under {RULES['minEmployees']} staff (excluded)"] = small
os.makedirs(os.path.dirname(OUT), exist_ok=True)
write_xlsx(OUT, sheets)
print(OUT)
print(json.dumps(summary, indent=1))
