// Contacts and opportunity context for the Quick Send tool.
// Sourced from the SN contacts list + open opportunities sheet (May 2026).

export type Contact = {
  id: string; // stable id (email)
  company: string;
  email: string;
};

export type Opportunity = {
  company: string;
  oppName: string;
  notes: string;
  owner: string;
  amountGbp: number;
  stage: string;
};

export const CONTACTS: Contact[] = [
  { id: 'adam.schlueter@commonwealthsl.com', company: 'Commonwealth Senior Living', email: 'adam.schlueter@commonwealthsl.com' },
  { id: 'rebecca.sturtz@commonwealthsl.com', company: 'Commonwealth Senior Living', email: 'rebecca.sturtz@commonwealthsl.com' },
  { id: 'ellen.byrne@commonwealthsl.com', company: 'Commonwealth Senior Living', email: 'ellen.byrne@commonwealthsl.com' },
  { id: 'mark.kane@commonwealthsl.com', company: 'Commonwealth Senior Living', email: 'mark.kane@commonwealthsl.com' },
  { id: 'brandie.french@commonwealthsl.com', company: 'Commonwealth Senior Living', email: 'brandie.french@commonwealthsl.com' },
  { id: 'joshua.rivera@commonwealthsl.com', company: 'Commonwealth Senior Living', email: 'joshua.rivera@commonwealthsl.com' },
  { id: 'julie.mancuso@curahospitality.com', company: 'CURA Hospitality', email: 'julie.mancuso@curahospitality.com' },
  { id: 'john.cramutola@curahospitality.com', company: 'CURA Hospitality', email: 'john.cramutola@curahospitality.com' },
  { id: 'deborah.denham@gardant.com', company: 'Gardant Management Solutions', email: 'deborah.denham@gardant.com' },
  { id: 'tim.renner@gardant.com', company: 'Gardant Management Solutions', email: 'tim.renner@gardant.com' },
  { id: 'mstevenson@hdgi1.com', company: 'Health Dimensions Group', email: 'mstevenson@hdgi1.com' },
  { id: 'hguthrie@hdgi1.com', company: 'Health Dimensions Group', email: 'hguthrie@hdgi1.com' },
  { id: 'hhaberhern@hdgi1.com', company: 'Health Dimensions Group', email: 'hhaberhern@hdgi1.com' },
  { id: 'sthole@hdgi1.com', company: 'Health Dimensions Group', email: 'sthole@hdgi1.com' },
  { id: 'petem@hpsionline.com', company: 'HPSI / Avendra', email: 'petem@hpsionline.com' },
  { id: 'sjelinek@jaybirdsl.com', company: 'Jaybird Senior Living', email: 'sjelinek@jaybirdsl.com' },
  { id: 'kelkjer@jaybirdsl.com', company: 'Jaybird Senior Living', email: 'kelkjer@jaybirdsl.com' },
  { id: 'mark.maclaine@oakmontmg.com', company: 'Oakmont Senior Living', email: 'mark.maclaine@oakmontmg.com' },
  { id: 'selrabaa@oakmontmg.com', company: 'Oakmont Senior Living', email: 'selrabaa@oakmontmg.com' },
  { id: 'ken.garnett@oakmontmg.com', company: 'Oakmont Senior Living', email: 'ken.garnett@oakmontmg.com' },
  { id: 'scott.carlson@oakmontmg.com', company: 'Oakmont Senior Living', email: 'scott.carlson@oakmontmg.com' },
  { id: 'charles.moret@oakmontmg.com', company: 'Oakmont Senior Living', email: 'charles.moret@oakmontmg.com' },
  { id: 'rina.younan@oakmontmg.com', company: 'Oakmont Senior Living', email: 'rina.younan@oakmontmg.com' },
  { id: 'terry.ervin@oakmontmg.com', company: 'Oakmont Senior Living', email: 'terry.ervin@oakmontmg.com' },
  { id: 'debi.witt@oakmontmg.com', company: 'Oakmont Senior Living', email: 'debi.witt@oakmontmg.com' },
  { id: 'debbie.infield@oakmontmg.com', company: 'Oakmont Senior Living', email: 'debbie.infield@oakmontmg.com' },
  { id: 'jrusso@oakmontmg.com', company: 'Oakmont Senior Living', email: 'jrusso@oakmontmg.com' },
  { id: 'phardesty@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'phardesty@pegasusseniorliving.com' },
  { id: 'leslie.araiza@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'leslie.araiza@pegasusseniorliving.com' },
  { id: 'eogle@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'eogle@pegasusseniorliving.com' },
  { id: 'cedwards@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'cedwards@pegasusseniorliving.com' },
  { id: 'taylormorrell@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'taylormorrell@pegasusseniorliving.com' },
  { id: 'cbaker@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'cbaker@pegasusseniorliving.com' },
  { id: 'lcraunlugar@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'lcraunlugar@pegasusseniorliving.com' },
  { id: 'llondon@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'llondon@pegasusseniorliving.com' },
  { id: 'tsaxon@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'tsaxon@pegasusseniorliving.com' },
  { id: 'joseph.floyd@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'joseph.floyd@pegasusseniorliving.com' },
  { id: 'erica.clement@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'erica.clement@pegasusseniorliving.com' },
  { id: 'eface@pegasusseniorliving.com', company: 'Pegasus Senior Living', email: 'eface@pegasusseniorliving.com' },
  { id: 'adaughters@primroseretirement.com', company: 'Primrose Retirement Communities', email: 'adaughters@primroseretirement.com' },
  { id: 'dkloster@prioritylc.com', company: 'Priority Life Care', email: 'dkloster@prioritylc.com' },
  { id: 'jruble@prioritylc.com', company: 'Priority Life Care', email: 'jruble@prioritylc.com' },
  { id: 'dpetras@prioritylc.com', company: 'Priority Life Care', email: 'dpetras@prioritylc.com' },
  { id: 'ccain@prioritylc.com', company: 'Priority Life Care', email: 'ccain@prioritylc.com' },
  { id: 'mstarks@prioritylc.com', company: 'Priority Life Care', email: 'mstarks@prioritylc.com' },
  { id: 'hroberson@prioritylc.com', company: 'Priority Life Care', email: 'hroberson@prioritylc.com' },
  { id: 'aciak@prioritylc.com', company: 'Priority Life Care', email: 'aciak@prioritylc.com' },
  { id: 'tjent@prioritylc.com', company: 'Priority Life Care', email: 'tjent@prioritylc.com' },
  { id: 'bgallo@prioritylc.com', company: 'Priority Life Care', email: 'bgallo@prioritylc.com' },
  { id: 'donna.brown@sonidaliving.com', company: 'Sonida Senior Living', email: 'donna.brown@sonidaliving.com' },
  { id: 'khutchison@capitalseniorliving.net', company: 'Sonida Senior Living', email: 'khutchison@capitalseniorliving.net' },
  { id: 'cburnell@capitalseniorliving.net', company: 'Sonida Senior Living', email: 'cburnell@capitalseniorliving.net' },
  { id: 'jason.engelhorn@sunriseseniorliving.com', company: 'Sunrise Senior Living', email: 'jason.engelhorn@sunriseseniorliving.com' },
  { id: 'marty.damian@sunriseseniorliving.com', company: 'Sunrise Senior Living', email: 'marty.damian@sunriseseniorliving.com' },
  { id: 'ccolarossi@taylors-international.com', company: 'Taylors International USA', email: 'ccolarossi@taylors-international.com' },
  { id: 'njemming@thespringsliving.com', company: 'The Springs Living', email: 'njemming@thespringsliving.com' },
  { id: 'abrown@thespringsliving.com', company: 'The Springs Living', email: 'abrown@thespringsliving.com' },
  { id: 'mfortune@thespringsliving.com', company: 'The Springs Living', email: 'mfortune@thespringsliving.com' },
];

export const OPPORTUNITIES: Opportunity[] = [
  { company: 'Commonwealth Senior Living', oppName: 'Commonwealth SL - DT/CWM - 33 sites', notes: 'Two Tree intro. Intro to VP Culinary but needs work to develop.', owner: 'Stephen', amountGbp: 54098, stage: 'Awareness' },
  { company: 'CURA Hospitality', oppName: 'Cura HG - 160 sites - DT/CWM', notes: 'Part of Elior (senior living division). Weekly audits done in SmartSheets. Call scheduled to reconnect. Core requirement is a challenge — manager oriented/reporting up. Competition is from myfield audit. June target to reconnect and hard qualify in/out.', owner: 'Stephen', amountGbp: 262295, stage: 'Discovery' },
  { company: 'Gardant Management Solutions', oppName: 'Gardant SL - CAM/CWM/DT - 80 sites', notes: 'Ran process. Deemed too expensive. Sensor only deal and need to reengage in June (20th) to get locked into budget.', owner: 'Stephen', amountGbp: 105511, stage: 'Custom Demo' },
  { company: 'Health Dimensions Group', oppName: 'HDG - DT/CWM - 52 sites', notes: 'Call to reengage VP Culinary and VP procurement scheduled. Potential for fall out from Atria relationship so needs careful management.', owner: 'Stephen', amountGbp: 55707, stage: 'Proposal' },
  { company: 'HPSI / Avendra', oppName: 'HPSI GPO - Partnership - 19000 care homes', notes: 'Large purchasing group (HDG). Needs engagement and win strategy.', owner: 'Stephen', amountGbp: 245902, stage: 'Discovery' },
  { company: 'Jaybird Senior Living', oppName: 'Partnership Opp - 59 sites - DT/CWM', notes: 'Suspect. Via Two Tree. Need intros and nurture.', owner: 'Stephen', amountGbp: 120902, stage: 'Awareness' },
  { company: 'Oakmont Senior Living', oppName: 'Oakmont - DT/CWM - 111 sites', notes: 'Morning Star takeover one site. Have had demo. Lettie dealing with contract. Need to engage and progress as currently no action/next step in place.', owner: 'Stephen', amountGbp: 245902, stage: 'Discovery' },
  { company: 'Pegasus Senior Living', oppName: 'TwoTree - Pegasus', notes: 'Two Tree. Sprint budget process last year. Needs better engagement this year to prep for season.', owner: 'Stephen', amountGbp: 81135, stage: 'Economic Buyer' },
  { company: 'Primrose Retirement Communities', oppName: 'Primrose RC - DT/CWM - 40 locations', notes: 'Champion EVP Ops, VP Culinary. Reconvene on pilot. Bake off vs US Foods solution. Risk is US Foods will undercut. Call planned for May 28. June to move forward so Q3 more likely. Drive to standardise before head chef leaves at end of the year.', owner: 'Stephen', amountGbp: 61794, stage: 'Discovery' },
  { company: 'Priority Life Care', oppName: 'Priority LC - 80 sites - DT/CWM', notes: 'Champion moved (to L&D) but still supportive. Need intro and then to Chief Investment Officer for budget approval.', owner: 'Stephen', amountGbp: 132171, stage: 'Economic Buyer' },
  { company: 'Sonida Senior Living', oppName: 'Partnership opp - 96 sites - DT/CWM', notes: 'Presentations and budget two years ago. Still interested but needs reinvigorating.', owner: 'Stephen', amountGbp: 196721, stage: 'Awareness' },
  { company: 'Sunrise Senior Living', oppName: 'Sunrise SL - CAM/DT/CWM - 270 sites', notes: 'Slow progress. More likely FY28 but huge potential. Needs shaping and nurturing now.', owner: 'Stephen', amountGbp: 430328, stage: 'Awareness' },
  { company: 'Taylors International USA', oppName: 'Taylors USA - 500 sites - CAM/CWM/DT', notes: 'Inbound via website. Large opportunity in stadium/large-venue food service. Discovery in progress.', owner: 'Stephen', amountGbp: 245902, stage: 'Discovery' },
  { company: 'The Springs Living', oppName: 'Springs Living - DT/CWM - 23 sites', notes: 'Morning Star takeover one site. VP Culinary expressed interest but early stage. Goal is to retain existing site, use for 30 day proof of value. Go/no-go.', owner: 'Stephen', amountGbp: 56557, stage: 'Awareness' },
];

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function findOpportunityForCompany(company: string): Opportunity | undefined {
  const target = normalize(company);
  // Try exact normalized match first
  const exact = OPPORTUNITIES.find((o) => normalize(o.company) === target);
  if (exact) return exact;
  // Fall back to substring either way
  return OPPORTUNITIES.find((o) => {
    const oc = normalize(o.company);
    return oc.includes(target) || target.includes(oc);
  });
}

export function deriveFirstName(email: string): string | null {
  const local = email.split('@')[0] || '';
  // pattern: first.last or first_last → take first chunk
  const firstChunk = local.split(/[._-]/)[0] || '';
  // skip if too short or looks like an initial+lastname (e.g. "mstevenson")
  if (firstChunk.length < 3) return null;
  // skip if no separator AND it doesn't look like a standalone first name
  // (we accept any 3+ char first chunk when a separator exists)
  if (!local.includes('.') && !local.includes('_') && !local.includes('-')) {
    // Common solo first names? Without a dictionary we can't tell; be conservative.
    return null;
  }
  return firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1).toLowerCase();
}

export function getContactsGroupedByCompany() {
  const map = new Map<string, Contact[]>();
  for (const c of CONTACTS) {
    const arr = map.get(c.company) || [];
    arr.push(c);
    map.set(c.company, arr);
  }
  return Array.from(map.entries())
    .map(([company, contacts]) => ({ company, contacts }))
    .sort((a, b) => a.company.localeCompare(b.company));
}
