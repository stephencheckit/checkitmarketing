"""
Classify the UK healthcare Apollo accounts (the uk-healthcare lists in
lib/gtm-markets.ts) for the NHS / UK healthcare target map, and write an
Apollo plan for apply-list-plan.ts plus a workbook.

    python3 scripts/build-uk-healthcare-plan.py

Prospects go to "NHS & UK Healthcare targets"; customers go to the UK
expansion list. Mental health, community and ambulance trusts, care homes,
duplicates and non-healthcare records stay off the list but are kept on a
workbook tab for reference.
"""

import collections as C
import json
import os
import re
import sys

from target_rules import RULES, customer_reason, load_customers, too_small
from xlsx_writer import write_xlsx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, '.sdr-data')
STAMP = '2026-10'
TARGET_LIST = f'NHS & UK Healthcare targets · {STAMP}'
EXPANSION_LIST = f'Expansion · Customers · UK · {STAMP}'

# Order matters: the first matching rule wins.
KIND_RULES = [
    ('Exclude: duplicate record', r'do not use|duplicate'),
    ('Exclude: not a healthcare operator', r'microsoft|shred-?it|care quality commission|nmc-uk|^website$|siemens healthcare'),
    ('Exclude: care homes (UK food service)', r'care uk|barchester|hc-one|avery healthcare|voyage|priory|elysium|craegmoor|partnerships in care|methodist homes|\bmha\b|care homes|lifeways|caremark|helping hands|county healthcare|achieve together|creative support|cygnet|home care'),
    ('Exclude: ambulance', r'ambulance'),
    ('Exclude: mental health & community', r'mental|community health|community healthcare|partnership nhs|care partnership|psychiatr|learning disab|community hospital'),
    ('Health boards (Scotland, Wales, NI)', r'health board|health and social care|hscni|nhs (lothian|greater glasgow|grampian|tayside|fife|highland|lanarkshire|ayrshire|borders|dumfries|forth valley|orkney|shetland|western isles)|velindre|public health wales'),
    ('Pathology networks & national bodies', r'pathology|synnovis|blood and transplant|nhsbt|ukhsa|health security|supply chain|specialist pharmacy|nhs england|education for scotland|health education|integrated care board|\bicb\b|genomics service'),
    ('Independent labs & diagnostics', r'laborator|\blabs?\b|diagnostic|synlab|randox|lumiradx|inhealth'),
    ('Pharmacy groups & distribution', r'pharmacy|pharmacist|alloga|medicines'),
    ('Private hospitals', r'spire|nuffield|circle health|circle bath|ramsey health|\bbmi\b|\bhca\b|ramsay|bupa|british united provident|london clinic|cromwell|king edward|practice plus|benenden|aspen|one healthcare|horder|private hospital|parkside hospital|highgate|the holly'),
    ('NHS acute trusts', r'^(uhbw|uhsm|sath|chsft|lhch)$|nhs|foundation trust|university hospital|teaching hospital|children.?s hospital|hospitals? trust'),
    ('NHS hospital sites', r'hospital|infirmary|medical centre'),
]
INDUSTRY_KINDS = {
    'pharmaceuticals': 'Life sciences (pharma, biotech, devices)',
    'biotechnology': 'Life sciences (pharma, biotech, devices)',
    'medical devices': 'Life sciences (pharma, biotech, devices)',
    'research': 'Universities & research labs',
    'higher education': 'Universities & research labs',
}


def kind(name, industry):
    n = (name or '').lower()
    for label, rx in KIND_RULES:
        if re.search(rx, n):
            return label
    return INDUSTRY_KINDS.get((industry or '').lower(), 'Exclude: unclassified')


def main():
    targets = json.load(open(os.path.join(DATA, 'target_accounts.json')))
    stages = {s['id']: (s.get('display_name') or s['name']) for s in json.load(open(os.path.join(DATA, 'account_stages.json')))}
    users = {u['id']: (u['name'] or u['email']) for u in json.load(open(os.path.join(DATA, 'users.json')))}
    customers = load_customers(DATA)

    accounts = {}
    for r in targets:
        if r.get('market') != 'uk-healthcare':
            continue
        # Regions are never mixed: UK lists hold UK accounts only.
        if r.get('country') not in ('United Kingdom', None) or (r.get('domain') or '').endswith('.ie'):
            continue
        key = (r.get('domain') or r.get('name') or '').lower()
        if key in accounts:
            accounts[key]['lists'].add(r['list'])
            continue
        accounts[key] = {**r, 'lists': {r['list']}}

    rows = []
    for a in accounts.values():
        stage = stages.get(a.get('stage'), '')
        k = kind(a.get('name'), a.get('industry'))
        cust = customer_reason(a.get('name'), a.get('domain'), stage, customers)
        if cust:
            status = 'Customer'
        elif k.startswith('Exclude'):
            status = 'Excluded'
        elif too_small(a.get('employees')):
            status = f"Excluded: under {RULES['minEmployees']} staff"
        else:
            status = 'Target'
        rows.append({
            'Account': a.get('name'),
            'Type': k,
            'Status': status,
            'Customer match': cust or '',
            'Employees': a.get('employees'),
            'Industry': a.get('industry'),
            'City': a.get('city'),
            'Region': a.get('state'),
            'Domain': a.get('domain'),
            'Apollo stage': stage,
            'Owner': users.get(a.get('owner'), ''),
            'Contacts in Apollo': a.get('contacts'),
            'Last activity': (a.get('last_activity') or '')[:10],
            'Source lists': '; '.join(sorted(a['lists'])),
            'Apollo account ID': a['id'],
        })

    order = [label for label, _ in KIND_RULES if not label.startswith('Exclude')] + sorted(set(INDUSTRY_KINDS.values()))
    rows.sort(key=lambda x: (order.index(x['Type']) if x['Type'] in order else 99, -(x['Employees'] or 0)))
    tgt = [x for x in rows if x['Status'] == 'Target']
    cus = [x for x in rows if x['Status'] == 'Customer']
    exc = [x for x in rows if x['Status'].startswith('Excluded')]

    summary = []
    for t in order:
        summary.append({
            'Type': t,
            'Targets': sum(1 for x in tgt if x['Type'] == t),
            'Customers': sum(1 for x in cus if x['Type'] == t),
            'Customer share': f"{round(100 * sum(1 for x in cus if x['Type'] == t) / max(1, sum(1 for x in tgt + cus if x['Type'] == t)))}%",
            'Largest targets': ', '.join(x['Account'] for x in sorted((x for x in tgt if x['Type'] == t), key=lambda x: -(x['Employees'] or 0))[:4]),
        })
    summary.append({'Type': 'Total', 'Targets': len(tgt), 'Customers': len(cus), 'Customer share': f"{round(100 * len(cus) / max(1, len(tgt) + len(cus)))}%", 'Largest targets': f'{len(exc)} records excluded (see tab)'})

    os.makedirs(os.path.join(DATA, 'plans'), exist_ok=True)
    json.dump({
        'region': 'UK',
        'lists': [
            {'name': TARGET_LIST, 'add': [x['Apollo account ID'] for x in tgt]},
            {'name': EXPANSION_LIST, 'add': [x['Apollo account ID'] for x in cus]},
        ],
    }, open(os.path.join(DATA, 'plans', 'uk-healthcare.json'), 'w'), indent=1)

    out = os.path.join(DATA, 'exports', 'Checkit - NHS & UK Healthcare target map.xlsx')
    write_xlsx(out, {'Summary': summary, 'Targets (white space)': tgt, 'Existing customers': cus, 'Excluded': exc})

    snapshot = {
        'list': TARGET_LIST,
        'targets': len(tgt),
        'customers': len(cus),
        'excluded': len(exc),
        'types': [
            {
                'type': s['Type'],
                'targets': s['Targets'],
                'customers': s['Customers'],
                'largest': s['Largest targets'],
                'enterprise': sum(1 for x in tgt if x['Type'] == s['Type'] and (x['Employees'] or 0) >= 1000),
                'examples': [x['Account'] for x in sorted((x for x in tgt if x['Type'] == s['Type']), key=lambda x: -(x['Employees'] or 0))[:4]],
            }
            for s in summary[:-1]
            if s['Targets'] or s['Customers']
        ],
        'excludedBy': dict(C.Counter(x['Type'] if x['Type'].startswith('Exclude') else x['Status'] for x in exc).most_common()),
        'regions': [{'region': r, 'targets': n} for r, n in C.Counter(x['Region'] for x in tgt if x['Region']).most_common(5)],
    }
    json.dump(snapshot, open(os.path.join(DATA, 'uk_healthcare_snapshot.json'), 'w'), indent=1)
    print(out)
    for s in summary:
        print(s)
    print('excluded by:', snapshot['excludedBy'])


if __name__ == '__main__':
    sys.exit(main())
