"""
Turn an Apollo accounts CSV export into a clean workbook: the useful columns,
a segment per account, and a flag on accounts Apollo marks Active
Opportunity so they are checked before cold outreach.

    python3 scripts/export-from-apollo-csv.py <export.csv> "<output name>" [--exclude <apolloId> ...]
"""

import collections as C
import csv
import os
import sys

from target_rules import segment
from xlsx_writer import write_xlsx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

src, name = sys.argv[1], sys.argv[2]
exclude = set(sys.argv[sys.argv.index('--exclude') + 1:]) if '--exclude' in sys.argv else set()

rows = []
for r in csv.DictReader(open(src, encoding='utf-8-sig')):
    if r['Apollo Account Id'] in exclude:
        continue
    emp = r['# Employees'].strip()
    rows.append({
        'Account': r['Company Name'],
        'Segment': segment(r['Company Name'], r['Industry']),
        'Industry': r['Industry'],
        'Employees': int(emp) if emp.isdigit() else None,
        'Annual revenue': r['Annual Revenue'],
        'City': r['Company City'],
        'State': r['Company State'],
        'Country': r['Company Country'],
        'Website': r['Website'],
        'LinkedIn': r['Company Linkedin Url'],
        'Phone': r['Company Phone'],
        'Apollo stage': r['Account Stage'],
        'Check before outreach': 'Yes: marked Active Opportunity' if r['Account Stage'] == 'Active Opportunity' else '',
        'Account owner': r['Account Owner'],
        'Parent company': r['Ultimate Parent Company Name'] or r['Parent company (Apollo data)'],
        'Description': r['Short Description'],
        'Apollo account ID': r['Apollo Account Id'],
    })
rows.sort(key=lambda x: (x['Segment'], -(x['Employees'] or 0)))

summary = [
    {'Segment': seg, 'Accounts': n, 'Marked Active Opportunity': sum(1 for x in rows if x['Segment'] == seg and x['Check before outreach'])}
    for seg, n in C.Counter(x['Segment'] for x in rows).most_common()
]
summary.append({'Segment': 'Total', 'Accounts': len(rows), 'Marked Active Opportunity': sum(1 for x in rows if x['Check before outreach'])})

out = os.path.join(ROOT, '.sdr-data', 'exports', f'{name}.xlsx')
write_xlsx(out, {'Summary': summary, 'Accounts': rows})
print(out, len(rows))
for s in summary:
    print(s)
