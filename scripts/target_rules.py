"""Target-list rules shared by the Excel exports; reads target-list-rules.json and .sdr-data/customers.json."""

import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
RULES = json.load(open(os.path.join(HERE, 'target-list-rules.json')))
GROUPS = [(g, re.compile(rx, re.I)) for g, rx in RULES['customerGroups'].items()]


def _norm(s):
    s = re.sub(r'[^a-z0-9 ]', ' ', (s or '').lower())
    s = re.sub(r'\b(inc|llc|ltd|limited|plc|co|corp|corporation|group|the)\b', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def load_customers(data_dir):
    path = os.path.join(data_dir, 'customers.json')
    rows = json.load(open(path)) if os.path.exists(path) else []
    rows = [c for c in rows if (c.get('status') or '') != 'churned']
    names = {_norm(c.get('company_name')) for c in rows if len(_norm(c.get('company_name'))) > 3}
    domains = {str(d).lower() for c in rows for d in (c.get('domain'), c.get('match_domain')) if d}
    return names, domains


def customer_reason(name, domain, stage_name, customers):
    names, domains = customers
    if stage_name == 'Current Client':
        return 'Apollo stage: Current Client'
    if domain and domain.lower() in domains:
        return 'Customer domain'
    if _norm(name) in names:
        return 'Customer name'
    for group, rx in GROUPS:
        if rx.search(name or ''):
            return f'{group} group'
    return None


def too_small(employees):
    if not employees:
        return RULES['dropUnknownSize']
    return employees < RULES['minEmployees']
