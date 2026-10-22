"""
Define the food-service target market by subgroup and region, and write an
Apollo plan plus workbook.

"Facilities management" overstated what we sell into: the buyer is the food
operation (catering, concessions, dining in care and venues), not the
building. Accounts are grouped into food-service subgroups, and US and UK are
always separate lists.

Sources: the FM, Food Service & Venues lists (US, UK), the US senior living
lists, and UK care home groups found in the UK healthcare lists.

    python3 scripts/build-food-service-plan.py
"""

import collections as C
import json
import os
import re

from target_rules import RULES, customer_reason, load_customers, too_small
from xlsx_writer import write_xlsx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, '.sdr-data')
STAMP = '2026-10'
LISTS = {
    'US': f'FM, Food Service & Venues · US · {STAMP}',
    'UK': f'FM, Food Service & Venues · UK · {STAMP}',
}
SENIOR_LISTS = {'senior living upload', 'Lookalike · Senior living · 2026-09'}
UK_CARE = r'^care uk|barchester|hc-one|avery healthcare|methodist homes|\bmha\b|care homes|orchard care|anchor hanover|four seasons health'

SUBGROUPS = [
    'Contract catering & food service',
    'Facilities services',
    'Venues, stadiums & live events',
    'Senior living & care',
    'Leisure, attractions & hospitality',
]


def subgroup(name, industry, source):
    n, i = (name or '').lower(), (industry or '').lower()
    if source == 'senior' or re.search(r'senior|assisted living|retirement|care home|nursing|memory care|' + UK_CARE, n):
        return 'Senior living & care'
    if re.search(r'stadium|arena|\bfc\b|football|soccer|cricket|rugby|club\b|live nation|\baeg\b|legends|convention|amphitheat|coliseum|ballpark|\bnec\b|sports|racecourse|speedway|anschutz', n) or i in ('sports', 'events services'):
        return 'Venues, stadiums & live events'
    if re.search(r'cater|dining|food ?service|concession|restaurant associates|hmshost|\bssp\b|elior|baxterstorey|aramark|delaware north|sodexo|levy|vending|canteen|kitchen|ch&co|thomas franks|\bwsh\b|bartlett mitchell|vacherin|lexington|gather|healthcare services group|avi foodsystems|holroyd howe|taylor shaw', n) or i in ('food & beverages', 'restaurants'):
        return 'Contract catering & food service'
    if i in ('recreational facilities', 'entertainment', 'museums & institutions', 'hospitality', 'leisure, travel & tourism', 'gambling & casinos') or re.search(r'casino|resort|hotel|bowl|topgolf|theme park|seaworld|zoo|museum|cinema|attraction', n):
        return 'Leisure, attractions & hospitality'
    return 'Facilities services'


def main():
    targets = json.load(open(os.path.join(DATA, 'target_accounts.json')))
    stages = {s['id']: (s.get('display_name') or s['name']) for s in json.load(open(os.path.join(DATA, 'account_stages.json')))}
    customers = load_customers(DATA)

    pools = {'US': {}, 'UK': {}}
    for r in targets:
        region, source = None, 'fm'
        if r['list'] == LISTS['US']:
            region = 'US'
        elif r['list'] == LISTS['UK']:
            region = 'UK'
        elif r['list'] in SENIOR_LISTS and r.get('country') in ('United States', None):
            region, source = 'US', 'senior'
        elif r.get('market') == 'uk-healthcare' and re.search(UK_CARE, (r.get('name') or '').lower()) and r.get('country') in ('United Kingdom', None):
            region, source = 'UK', 'senior'
        if not region:
            continue
        key = (r.get('domain') or r.get('name') or '').lower()
        if key in pools[region]:
            continue
        pools[region][key] = {**r, 'source': source}

    sheets, plan_lists, snapshot = {}, [], {'regions': []}
    for region, pool in pools.items():
        rows = []
        for a in pool.values():
            stage = stages.get(a.get('stage'), '')
            cust = customer_reason(a.get('name'), a.get('domain'), stage, customers)
            status = 'Customer' if cust else (f"Excluded: under {RULES['minEmployees']} staff" if too_small(a.get('employees')) else 'Target')
            rows.append({
                'Account': a.get('name'),
                'Subgroup': subgroup(a.get('name'), a.get('industry'), a['source']),
                'Status': status,
                'Customer match': cust or '',
                'Employees': a.get('employees'),
                'Industry': a.get('industry'),
                'City': a.get('city'),
                'State / region': a.get('state'),
                'Domain': a.get('domain'),
                'Apollo stage': stage,
                'Contacts in Apollo': a.get('contacts'),
                'Source list': a['list'],
                'Apollo account ID': a['id'],
            })
        rows.sort(key=lambda x: (SUBGROUPS.index(x['Subgroup']), -(x['Employees'] or 0)))
        tgt = [x for x in rows if x['Status'] == 'Target']
        sheets[f'{region} targets'] = tgt
        sheets[f'{region} customers & excluded'] = [x for x in rows if x['Status'] != 'Target']
        new_ids = [x['Apollo account ID'] for x in tgt if x['Source list'] != LISTS[region]]
        plan_lists.append({'name': LISTS[region], 'add': new_ids})
        plan_lists.append({'name': RULES['expansionLists'][region], 'add': [x['Apollo account ID'] for x in rows if x['Status'] == 'Customer' and x['Source list'] != LISTS[region]]})
        snapshot['regions'].append({
            'region': region,
            'targets': len(tgt),
            'subgroups': [
                {
                    'subgroup': g,
                    'targets': sum(1 for x in tgt if x['Subgroup'] == g),
                    'enterprise': sum(1 for x in tgt if x['Subgroup'] == g and (x['Employees'] or 0) >= 1000),
                    'examples': [x['Account'] for x in tgt if x['Subgroup'] == g][:4],
                }
                for g in SUBGROUPS
            ],
        })
        print(region, len(tgt), 'targets;', len(new_ids), 'to add to the list')
        for g in SUBGROUPS:
            ex = [x['Account'] for x in tgt if x['Subgroup'] == g]
            print(f'   {g}: {len(ex)}  e.g. {", ".join(ex[:6])}')

    json.dump({'lists': plan_lists}, open(os.path.join(DATA, 'plans', 'food-service.json'), 'w'), indent=1)
    json.dump(snapshot, open(os.path.join(DATA, 'food_service_snapshot.json'), 'w'), indent=1)
    write_xlsx(os.path.join(DATA, 'exports', 'Checkit - Food service target map (US and UK).xlsx'), sheets)


if __name__ == '__main__':
    main()
