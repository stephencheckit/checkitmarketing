"""
Aggregate the raw Apollo / HubSpot pulls in .sdr-data/ into the snapshot the
SDR baseline deck renders (app/sdr-baseline/data.ts), and write the target
account workbook (.sdr-data/exports/).

    python3 scripts/sdr-baseline-build.py

Run the three pull scripts first (sdr-baseline-pull.ts, sdr-hubspot-pull.ts,
sdr-target-accounts-pull.ts).
"""

import collections as C
import json
import os
import re
from datetime import datetime, timezone

from target_rules import RULES, customer_reason, load_customers, too_small
from xlsx_writer import write_xlsx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, '.sdr-data')
OUT_TS = os.path.join(ROOT, 'app', 'sdr-baseline', 'data.ts')
EXPORTS = os.path.join(DATA, 'exports')


def load(name):
    with open(os.path.join(DATA, name)) as f:
        return json.load(f)


def dt(s):
    return datetime.fromisoformat(s.replace('Z', '+00:00')) if s else None


def quarter(s):
    d = dt(s)
    return f"{d.year} Q{(d.month - 1) // 3 + 1}" if d else None


users = {u['id']: (u['name'] or u['email'].split('@')[0].replace('.', ' ').title()) for u in load('users.json')}
SDRS = ['Jordan Ernest', 'Tom Flaskett', 'Bryan Blitman']
REGION = {'Jordan Ernest': 'US', 'Tom Flaskett': 'UK & Europe', 'Bryan Blitman': 'US'}

calls = load('calls.json')
emails = load('emails.json')
sequences = load('sequences.json')
stage_names = {s['id']: s['name'] for s in load('contact_stages.json')}
stage_contacts = load('stage_contacts.json')
meetings = load('hs_meetings.json')
meeting_contacts = {c['id']: c for c in load('hs_meeting_contacts.json')}
lifecycle = load('hs_lifecycle_counts.json')
tasks = load('tasks.json')

# Apollo exposes outcome ids only. Labels inferred from call duration and the
# rep's notes on each outcome; "Meeting booked" notes read like "booked 5/6 11am".
OUTCOMES = {
    '68012bf43390d00019eb9226': 'No answer',
    '68012bf43390d00019eb9227': 'Left voicemail',
    '68012bf43390d00019eb922c': 'Meeting booked',
    '68012bf43390d00019eb922d': 'Gatekeeper / referral',
    '68012bf43390d00019eb922e': 'Not interested',
    '68012bf43390d00019eb922a': 'Wrong number',
    '68012bf43390d00019eb9229': 'No longer there',
    '68012bf43390d00019eb9228': 'Hung up / busy',
    '68012bf43390d00019eb922b': 'Other',
}
MEETING_BOOKED = '68012bf43390d00019eb922c'
CONVERSATION_SECONDS = 60


def duration(c):
    s, e = dt(c['start']), dt(c['end'])
    return (e - s).total_seconds() if s and e else 0


def campaign_market(name):
    n = (name or '').lower()
    if re.search(r'pharm|patholog|nhs|health|hospital|children|lab|clinic', n):
        return 'Healthcare (NHS / labs)'
    if re.search(r'\bfm\b|facilit', n):
        return 'Facilities management'
    if re.search(r'forecourt|petrol', n):
        return 'Forecourts'
    if re.search(r'food|coffee|costa|caffe|nero|pub|dinning|dining|hospitality|hotel', n):
        return 'Food service & hospitality'
    if re.search(r'ferry|heritage|ikea', n):
        return 'Leisure & retail'
    if re.search(r'water', n):
        return 'Water (dropped)'
    if re.search(r'inbound', n):
        return 'Inbound follow-up'
    return 'Other / unlabelled'


def org_market(org):
    o = (org or '').lower()
    if re.search(r'oak view|ovg|spectra|bank center', o):
        return 'Venues (OVG estate)'
    if re.search(r'levy|delaware|thompson|quest food|sage dining|american dining|aramark', o):
        return 'Contract catering'
    if re.search(r'wood ranch|primrose|cedarhurst|rosewater|senior|retirement|memory', o):
        return 'Senior living'
    if re.search(r'lab|medical|tricore', o):
        return 'Medical / labs'
    return 'Other'


# --- Activity by rep and quarter -------------------------------------------
activity = C.defaultdict(lambda: C.Counter())
monthly = C.defaultdict(lambda: C.Counter())
for c in calls:
    rep = users.get(c['user_id'])
    if rep not in SDRS or not c['start']:
        continue
    q, m = quarter(c['start']), c['start'][:7]
    if c['dialer']:
        activity[(rep, q)]['dials'] += 1
        monthly[(rep, m)]['dials'] += 1
        if duration(c) >= CONVERSATION_SECONDS:
            activity[(rep, q)]['conversations'] += 1
    else:
        activity[(rep, q)]['loggedCalls'] += 1
        monthly[(rep, m)]['loggedCalls'] += 1
    if c['outcome'] == MEETING_BOOKED:
        activity[(rep, q)]['meetingsBooked'] += 1

POSITIVE_REPLIES = {'willing_to_meet', 'follow_up_question', 'person_referral'}
for e in emails:
    rep = users.get(e['user_id'])
    if rep not in SDRS or e['status'] != 'completed':
        continue
    when = e['completed_at'] or e['due_at']
    q, m = quarter(when), when[:7]
    activity[(rep, q)]['emails'] += 1
    monthly[(rep, m)]['emails'] += 1
    if e['replied']:
        activity[(rep, q)]['replies'] += 1
    if e['reply_class'] == 'willing_to_meet':
        activity[(rep, q)]['willingToMeet'] += 1
    if e['reply_class'] in POSITIVE_REPLIES:
        activity[(rep, q)]['positiveReplies'] += 1

hs_owner_jordan = '490468131'
for mt in meetings:
    if mt.get('hubspot_owner_id') == hs_owner_jordan and mt.get('hs_meeting_start_time'):
        activity[('Jordan Ernest', quarter(mt['hs_meeting_start_time']))]['meetingsInHubspot'] += 1

quarters = sorted({q for (_, q) in activity if q and q >= '2025 Q3'})
activity_rows = []
for rep in SDRS:
    for q in quarters:
        a = activity.get((rep, q))
        if a and sum(a.values()):
            activity_rows.append({'rep': rep, 'region': REGION[rep], 'quarter': q, **{k: a[k] for k in [
                'dials', 'conversations', 'loggedCalls', 'meetingsBooked', 'emails', 'replies',
                'positiveReplies', 'willingToMeet', 'meetingsInHubspot']}})

months = sorted({m for (_, m) in monthly if m >= '2025-07'})
monthly_rows = [
    {'month': m, **{f"{rep.split()[0].lower()}{k[0].upper()}{k[1:]}": monthly[(rep, m)][k]
                    for rep in SDRS for k in ['dials', 'loggedCalls', 'emails']}}
    for m in months
]

# --- Totals ----------------------------------------------------------------
def total(rep, key):
    return sum(r[key] for r in activity_rows if r['rep'] == rep)


rep_totals = []
for rep in SDRS:
    rep_calls = [c for c in calls if users.get(c['user_id']) == rep and c['start']]
    rep_emails = [e for e in emails if users.get(e['user_id']) == rep and e['status'] == 'completed']
    starts = sorted([c['start'] for c in rep_calls] + [(e['completed_at'] or e['due_at']) for e in rep_emails])
    rep_totals.append({
        'rep': rep,
        'region': REGION[rep],
        'firstActivity': starts[0][:10] if starts else None,
        'lastActivity': starts[-1][:10] if starts else None,
        'lastDial': max((c['start'] for c in rep_calls if c['dialer']), default='')[:10] or None,
        **{k: total(rep, k) for k in ['dials', 'conversations', 'loggedCalls', 'meetingsBooked', 'emails',
                                      'replies', 'positiveReplies', 'willingToMeet', 'meetingsInHubspot']},
        'interestedContacts': sum(1 for c in stage_contacts
                                  if users.get(c['owner']) == rep and stage_names.get(c['stage']) == 'Interested'),
        'queuedManualEmails': sum(1 for t in tasks if users.get(t['user_id']) == rep
                                  and t['type'] == 'outreach_manual_email' and t['status'] == 'scheduled'),
        'outcomes': dict(C.Counter(OUTCOMES.get(c['outcome'], 'Not dispositioned')
                                   for c in rep_calls).most_common()),
    })

# --- Where the effort went ---------------------------------------------------
tom_markets = C.defaultdict(C.Counter)
for e in emails:
    if users.get(e['user_id']) == 'Tom Flaskett' and e['status'] == 'completed':
        mk = campaign_market(e.get('campaign_name'))
        tom_markets[mk]['emails'] += 1
        if e['replied']:
            tom_markets[mk]['replies'] += 1
        if e['reply_class'] in POSITIVE_REPLIES:
            tom_markets[mk]['positive'] += 1
tom_market_rows = sorted(
    [{'market': k, **{x: v[x] for x in ['emails', 'replies', 'positive']}} for k, v in tom_markets.items()],
    key=lambda r: -r['emails'])

booked = sorted([c for c in calls if c['outcome'] == MEETING_BOOKED and users.get(c['user_id']) in SDRS],
                key=lambda c: c['start'] or '')
booked_markets = C.Counter(org_market(c['org']) for c in booked)
booked_rows = [{
    'date': (c['start'] or '')[:10],
    'rep': users.get(c['user_id']),
    'org': c['org'],
    'title': c['title'],
    'market': org_market(c['org']),
} for c in booked]

sequence_rows = sorted([{
    'name': s['name'].strip(),
    'owner': users.get(s['user_id'], 'Unknown'),
    'created': s['created_at'][:10],
    'active': s['active'],
    'delivered': s.get('unique_delivered') if isinstance(s.get('unique_delivered'), int) else 0,
    'replied': s.get('unique_replied') if isinstance(s.get('unique_replied'), int) else 0,
    'bounced': s.get('unique_bounced') if isinstance(s.get('unique_bounced'), int) else 0,
} for s in sequences if users.get(s['user_id']) in SDRS], key=lambda r: -r['delivered'])

# --- Meetings: SDR-touched vs not -------------------------------------------
acct_domain = {}
for e in emails:
    if e['account_id'] and e['to_domain']:
        acct_domain.setdefault(e['account_id'], C.Counter())[e['to_domain']] += 1
acct_domain = {a: cnt.most_common(1)[0][0] for a, cnt in acct_domain.items()}
touches = C.defaultdict(list)
for e in emails:
    if e['status'] == 'completed' and users.get(e['user_id']) in SDRS and e['to_domain']:
        touches[e['to_domain']].append(((e['completed_at'] or '')[:10], users[e['user_id']]))
for c in calls:
    if users.get(c['user_id']) in SDRS and c['account_id'] in acct_domain:
        touches[acct_domain[c['account_id']]].append(((c['start'] or '')[:10], users[c['user_id']]))

# Domains shared by many unrelated organisations (every NHS trust can use
# nhs.net), so a touch on the domain says nothing about the meeting's account.
SHARED_DOMAINS = {'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'nhs.net'}

HS_OWNERS = {'126025631': 'US AE (recorded calls)', '750790827': 'Inbound (Calendly)', hs_owner_jordan: 'Jordan (SDR)'}
since = '2025-07-01'
recent_meetings = [m for m in meetings if (m.get('hs_meeting_start_time') or '') >= since]
meeting_accounts = []
seen = set()
for m in sorted(recent_meetings, key=lambda m: m['hs_meeting_start_time']):
    d = m['hs_meeting_start_time'][:10]
    for cid in m['contact_ids']:
        dom = (meeting_contacts.get(cid, {}).get('email') or '').split('@')[-1]
        if not dom or dom in SHARED_DOMAINS or dom in seen:
            continue
        seen.add(dom)
        prior = [t for t in touches.get(dom, []) if t[0] and t[0] <= d]
        meeting_accounts.append({
            'date': d,
            'domain': dom,
            'owner': HS_OWNERS.get(m.get('hubspot_owner_id'), 'Other'),
            'source': meeting_contacts.get(cid, {}).get('hs_analytics_source'),
            'sdrTouches': len(prior),
            'firstTouch': min(prior)[0] if prior else None,
            'sdr': C.Counter(t[1] for t in prior).most_common(1)[0][0] if prior else None,
        })

hs_monthly = C.Counter((m.get('hs_meeting_start_time') or '')[:7] for m in meetings)
hs_meetings_by_month = [{'month': k, 'count': hs_monthly.get(k, 0)} for k in months]

# --- Data quality signals ----------------------------------------------------
apollo_accounts_active_opp = None
for row in load('account_stage_counts.json'):
    if row['stage'] == 'Active Opportunity':
        apollo_accounts_active_opp = row['count']
data_quality = {
    'apolloContactsWithSalesforceId': sum(1 for c in stage_contacts if c.get('sf')),
    'apolloContactsChecked': len(stage_contacts),
    'apolloOpportunities': 0,
    'apolloActiveOppAccounts': apollo_accounts_active_opp,
    'hubspotLifecycle': lifecycle,
    'hubspotMeetingsTotal': len(meetings),
    'hubspotMeetingsSince': len(recent_meetings),
    'emailsFailed': sum(1 for e in emails if users.get(e['user_id']) in SDRS and e['status'] == 'failed'),
    'emailsFailedStageSafeguard': sum(1 for e in emails if users.get(e['user_id']) in SDRS
                                      and e['not_sent_reason'] == 'account_stage_safeguard'),
    'tomLoggedWithoutDialer': next(r['loggedCalls'] for r in rep_totals if r['rep'] == 'Tom Flaskett'),
    'jordanMeetingsBookedCalls': next(r['meetingsBooked'] for r in rep_totals if r['rep'] == 'Jordan Ernest'),
    'jordanMeetingsInHubspot': next(r['meetingsInHubspot'] for r in rep_totals if r['rep'] == 'Jordan Ernest'),
}

# --- Target accounts ---------------------------------------------------------
acct_stage = {s['id']: (s.get('display_name') or s['name']) for s in load('account_stages.json')}
targets = load('target_accounts.json')
worked_domains = set(touches)
EXPORT_SETS = {
    'US Healthcare': lambda r: r['market'] == 'us-medical',
    'FM, food service & venues - US': lambda r: r['list'] == 'FM, Food Service & Venues · US · 2026-10',
    'FM, food service & venues - UK': lambda r: r['list'] == 'FM, Food Service & Venues · UK · 2026-10',
}
customer_data = load_customers(DATA)
export_rows = {}
excluded_rows = []
target_summary = []
for label, pick in EXPORT_SETS.items():
    by_domain = {}
    for r in targets:
        if not pick(r):
            continue
        key = r.get('domain') or r.get('name')
        if key in by_domain:
            by_domain[key]['lists'].add(r['list'])
            continue
        by_domain[key] = {**r, 'lists': {r['list']}}
    rows = []
    for r in by_domain.values():
        stage = acct_stage.get(r.get('stage'), 'Unknown')
        rows.append({
            'Account': r.get('name'),
            'Domain': r.get('domain'),
            'Industry': r.get('industry'),
            'Employees': r.get('employees'),
            'Revenue': r.get('revenue'),
            'City': r.get('city'),
            'State / region': r.get('state'),
            'Country': r.get('country'),
            'Apollo stage': stage,
            'Customer match': customer_reason(r.get('name'), r.get('domain'), stage, customer_data) or '',
            'Owner': users.get(r.get('owner'), ''),
            'Contacts in Apollo': r.get('contacts'),
            'SDR outreach to date': 'Yes' if r.get('domain') in worked_domains else 'No',
            'Last activity': (r.get('last_activity') or '')[:10],
            'Source lists': '; '.join(sorted(r['lists'])),
            'LinkedIn': r.get('linkedin'),
        })
    rows.sort(key=lambda x: -(x['Employees'] or 0))
    prospects = [x for x in rows if not x['Customer match'] and not too_small(x['Employees'])]
    export_rows[label] = prospects
    for x in rows:
        if x['Customer match']:
            excluded_rows.append({'List': label, 'Reason': x['Customer match'], **x})
        elif too_small(x['Employees']):
            excluded_rows.append({'List': label, 'Reason': f"Under {RULES['minEmployees']} staff", **x})
    target_summary.append({
        'list': label,
        'accounts': len(prospects),
        'customersFlagged': sum(1 for x in rows if x['Customer match']),
        'smallExcluded': sum(1 for x in rows if not x['Customer match'] and too_small(x['Employees'])),
        'worked': sum(1 for x in prospects if x['SDR outreach to date'] == 'Yes'),
        'withContacts': sum(1 for x in prospects if (x['Contacts in Apollo'] or 0) > 0),
        'enterprise': sum(1 for x in prospects if (x['Employees'] or 0) >= 1000),
        'topIndustries': [k for k, _ in C.Counter(x['Industry'] for x in prospects if x['Industry']).most_common(4)],
        'topAccounts': [x['Account'] for x in prospects[:8]],
    })


# --- HubSpot inbound (contacts created since 2025) ---------------------------
def form_kind(name):
    n = (name or '').lower()
    if not n:
        return None
    if 'support' in n:
        return 'support'
    if 'app account' in n or 'app request' in n:
        return 'appRequest'
    if re.search(r'demo|quote|contact us|try checkit|monitoring system form|sensor experts|typeform', n):
        return 'demand'
    return 'content'


def is_scanner_junk(c):
    return any('nessus' in (c.get(k) or '').lower() for k in ('jobtitle', 'company', 'domain'))


def norm_country(c):
    v = (c.get('country') or '').strip().lower()
    if v in ('united kingdom', 'uk', 'gb', 'england', 'scotland', 'wales'):
        return 'UK'
    if v in ('united states', 'usa', 'us'):
        return 'US'
    return 'Other' if v else 'Unknown'


inbound = None
if os.path.exists(os.path.join(DATA, 'hs_contacts_2025.json')):
    hs_contacts = load('hs_contacts_2025.json')
    by_q = C.defaultdict(C.Counter)
    for c in hs_contacts:
        q = quarter(c['createdate'])
        kind = form_kind(c.get('first_conversion_event_name'))
        if is_scanner_junk(c):
            by_q[q]['junk'] += 1
        elif kind:
            by_q[q][kind] += 1
        by_q[q]['created'] += 1
        if c.get('hs_analytics_source') == 'OFFLINE':
            by_q[q]['importedOrSynced'] += 1
    demand = [c for c in hs_contacts if form_kind(c.get('first_conversion_event_name')) == 'demand' and not is_scanner_junk(c)]
    inbound = {
        'since': '2025-01',
        'contactsCreated': len(hs_contacts),
        'importedOrSynced': sum(1 for c in hs_contacts if c.get('hs_analytics_source') == 'OFFLINE'),
        'fromSalesforceSync': sum(1 for c in hs_contacts if c.get('hs_analytics_source_data_1') == 'SALESFORCE'),
        'demandForms': len(demand),
        'scannerJunk': sum(1 for c in hs_contacts if is_scanner_junk(c)),
        'scannerJunkMarkedMql': sum(1 for c in hs_contacts if is_scanner_junk(c) and c.get('lifecyclestage') == 'marketingqualifiedlead'),
        'demandByCountry': dict(C.Counter(norm_country(c) for c in demand).most_common()),
        'demandBySource': dict(C.Counter(c.get('hs_analytics_source') or 'Unknown' for c in demand).most_common()),
        'byQuarter': [{'quarter': q, **{k: by_q[q][k] for k in ['created', 'importedOrSynced', 'demand', 'support', 'appRequest', 'content', 'junk']}}
                      for q in sorted(by_q)],
    }

os.makedirs(EXPORTS, exist_ok=True)
write_xlsx(os.path.join(EXPORTS, 'Checkit target accounts - US Healthcare and FM.xlsx'), {**export_rows, 'Customers and small (excluded)': excluded_rows})
write_xlsx(os.path.join(EXPORTS, 'SDR baseline - raw tables.xlsx'), {
    'Activity by quarter': activity_rows,
    'Meetings booked (calls)': booked_rows,
    'HubSpot meetings vs SDR': meeting_accounts,
    'Tom effort by market': tom_market_rows,
    'Sequences': sequence_rows,
    **({'HubSpot inbound by quarter': inbound['byQuarter']} if inbound else {}),
})

snapshot = {
    'meta': {
        'pulledAt': datetime.now(timezone.utc).isoformat(timespec='minutes'),
        'window': f'{months[0]} to {months[-1]}',
        'sources': [
            'Apollo: calls, sequence emails, sequences, contact stages, tasks',
            'HubSpot: meetings and their contacts (deals, companies and owners are not readable with the current token)',
            'Salesforce: not connected',
        ],
        'quarters': 'Calendar quarters',
        'conversationSeconds': CONVERSATION_SECONDS,
    },
    'repTotals': rep_totals,
    'activity': activity_rows,
    'monthly': monthly_rows,
    'tomMarkets': tom_market_rows,
    'bookedMarkets': dict(booked_markets.most_common()),
    'booked': booked_rows,
    'sequences': sequence_rows[:12],
    'meetingAccounts': meeting_accounts,
    'hubspotMeetingsByMonth': hs_meetings_by_month,
    'dataQuality': data_quality,
    'targets': target_summary,
    'inbound': inbound,
}

os.makedirs(os.path.dirname(OUT_TS), exist_ok=True)
with open(OUT_TS, 'w') as f:
    f.write('// Generated by scripts/sdr-baseline-build.py from the Apollo / HubSpot pulls in\n')
    f.write('// .sdr-data/. Do not edit by hand; re-run the pulls and the build to refresh.\n\n')
    f.write('export const snapshot = ')
    f.write(json.dumps(snapshot, indent=2, ensure_ascii=False))
    f.write(' as const;\n')

print('wrote', OUT_TS)
print(json.dumps({k: snapshot[k] for k in ['repTotals', 'bookedMarkets', 'targets', 'dataQuality']}, indent=1)[:6000])
print(json.dumps(snapshot['activity'], indent=0)[:3000])
print(json.dumps(snapshot['tomMarkets']))
print(json.dumps([m for m in meeting_accounts if m['sdrTouches']]))
