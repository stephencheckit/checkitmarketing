export interface NoteCopy {
  title: string;
  excerpt: string;
  openings: [string, string, string, string];
  body: string;
}

// Short notes for /resources. Voice matches the Checkit platform: plain, specific,
// about the monitored asset, the alert, the response, and the record.
// Topics rotate through food service, pharmacy, pathology, blood and plasma,
// senior living, and multi-site operations.
export const NOTE_LIBRARY: NoteCopy[] = [
  {
    title: 'The first ten minutes after a cooler alert',
    excerpt: 'The sensor has already stored the excursion. The next ten minutes are for the food, and for writing down what was decided.',
    openings: [
      'A walk-in alerted during service, just after a delivery had been walked in with the door held open. The question was which food had actually warmed up.',
      'The alert had been waiting since 2 a.m. The opener was the first person to see it, with a service about to depend on that cooler.',
      'Two units alerted at once. The team dealt with the one in front of them and left the other until after lunch.',
      'By the time anyone looked, the air felt cold again. The history still showed forty minutes above the line.',
    ],
    body: `A Checkit alert means a monitored unit has left its range and the reading is already stored. The next ten minutes are for the food. Probe what sits nearest the door, then move or discard what is no longer safe, and write that decision on the alert before going back to the line.

Clearing the notification leaves a temperature history with no response. That is a weaker record than a short note made while the door was still open: what moved, what was discarded, and who decided.

The sensor cannot say whether the soup is still usable. Someone on the shift has to, and Checkit is where that decision should live.`,
  },
  {
    title: 'A vaccine fridge that was back in range by morning',
    excerpt: 'A morning reading inside 2°C to 8°C does not erase the night. The stock stays quarantined until someone decides, against the trace.',
    openings: [
      'The clinic fridge spent the night at 10°C and was back at 5°C when the pharmacy opened. The morning reading was comforting. It was not the night.',
      'A ward fridge alerted at 11 p.m. The night team acknowledged it and left the decision for pharmacy in the morning.',
      'The display said 6°C at the start of clinic. The history showed a door that had not latched after the last collection.',
      'Staff were ready to use the morning vaccines because the fridge felt cold. The alert from 3 a.m. was still open.',
    ],
    body: `For a vaccine fridge the safe range is generally 2°C to 8°C. A reading back inside that range by the time people arrive does not close the excursion. Quarantine the stock, keep it in a unit you have checked, and do not issue it until someone with the authority to release or discard it has looked at the trace.

Checkit already has the start, the peak, and the recovery if the sensor was running. What it needs from the team is the decision: which batches, what was done with them, and who signed it.

If the length of the excursion is unclear, write that down too. An honest gap is a better record than a time somebody guessed to make the morning look tidy.`,
  },
  {
    title: 'A reagent fridge and a food fridge are not the same risk',
    excerpt: 'Both can alert on temperature. The product, the range, and the person who may release it are different, and the record has to say which is which.',
    openings: [
      'The lab and the staff kitchen sat on the same corridor. Overnight, both fridges alerted. Only one of them held reagents that could not be replaced that week.',
      'A new sensor was named "Fridge 2." Nobody opening the alert could tell whether that was histology or the pantry.',
      'The food team cleared an alert that belonged to the reagent fridge, because the notification looked like every other cooler on the account.',
      'Pathology came in to a quiet dashboard. The reagent fridge had recovered, and nobody had written down what was inside it.',
    ],
    body: `Name the asset the way the people who respond will recognise it: site, room, and what it protects. A reagent fridge, a vaccine fridge, and a kitchen walk-in can all leave range. They do not share a safe limit, and they should not share a vague name in Checkit.

When the alert fires, the response is about that product. Quarantine it, record what was in the unit, and leave the release to the person who is allowed to make it. A cleared alarm on the wrong asset is how a lab problem gets treated like a kitchen one.

The trace is only useful if the next person can tell, from the asset name alone, what was at risk.`,
  },
  {
    title: 'A plasma freezer does not get a casual morning',
    excerpt: 'High-value stock needs a named response. A recovered display is not a decision about the plasma.',
    openings: [
      'Plasma freezer 2 alerted just after midnight. By the time the blood bank opened, the air temperature looked ordinary and the alarm was still unanswered.',
      'An engineer had the door open for a repair. The work order was raised. The plasma in that freezer was not mentioned on it.',
      'The unit climbed during a defrost and did not come back on its usual curve. The morning check was a glance at the display.',
      'Two freezers alerted. The team checked the one they walk past. The plasma freezer is at the end of the room.',
    ],
    body: `Blood and plasma are not stock you discover a problem with halfway through issuing it. If the freezer leaves its range, quarantine first and keep the product unused until the person responsible has read the trace and recorded the decision.

Checkit holds the temperatures and the times. The note has to hold the rest: which freezer, what was stored there, whether it was moved, and who released or discarded it. "Back in range" describes the air. It does not describe the inventory.

If the same freezer is slow to recover after defrost, that history is the maintenance case. Write it on the alert while the curve is still this week's curve, not last quarter's rumour.`,
  },
  {
    title: 'A care home still has a night, even when the office is shut',
    excerpt: 'Medication fridges and dining-room chillers do not pause because the manager has gone home. The alert has to reach someone who is still in the building.',
    openings: [
      'The medication fridge alerted at 1 a.m. The escalation path ended at a manager who was not on shift and not near the home.',
      'Night staff knew the dining-room chiller had been temperamental. They did not know the alert was also theirs to acknowledge.',
      'By morning the fridge was cold again. The night shift had left a note in the office diary, and the alert in Checkit was still blank.',
      'Two homes share an account. The alert for the smaller one went to the team at the larger one, who assumed someone on site had it.',
    ],
    body: `Senior living runs on more than one kind of cold storage: medication, supplements, and the food for the next service. Each needs a range, a sensor, and a person on duty who can see the alert.

Put the night escalation on people who are actually in the building, or on call for it. An acknowledgement from someone who cannot walk to the fridge is not a response. The action, when they do get there, still has to say what happened to the medication or the food.

A paper note in the office and a blank alert in Checkit are two halves of a record. The half an inspector will trust is the one attached to the temperature.`,
  },
  {
    title: 'The site you cannot walk is the one the dashboard is for',
    excerpt: 'A facilities or multi-site lead cannot stand in every kitchen and every clinic. The account is how those rooms stay visible overnight.',
    openings: [
      'Four sites, one manager, and a Monday that started with three open alerts. Two of them were from the site nobody had visited that week.',
      'The flagship kitchen was checked every afternoon. The smaller production unit alerted on Sunday and waited until someone thought to look.',
      'A contract catering account covered a venue that only operates on event days. The cooler did not know the venue was dark.',
      'Region reviews were still being built from exported spreadsheets. The alerts, meanwhile, had already named the site.',
    ],
    body: `Checkit is the view across sites you will not walk today: which assets are in alarm, which alerts are still open, and which sites keep repeating. That is the list to work from, not the site that happens to be nearest the office.

Open alerts need an owner at that site, and a path that moves on if they do not respond. A dashboard full of alarms nobody has acknowledged is a list of rooms where the product decision has not been made.

When the same site appears every week, the next step is maintenance or a reset of who is on the escalation, not another reminder to be more careful.`,
  },
  {
    title: 'The temperature log that stops when the kitchen closes',
    excerpt: 'A number written at the end of the shift says the kitchen was busy. It says nothing about the hours the building was empty.',
    openings: [
      'The closer wrote the walk-in down at ten and went home. At six the case was warm, and the closing sheet could not explain the night.',
      'Someone copied the afternoon reading into the night row because the kitchen was already dark. The sheet looked complete.',
      'The paper log had a number in every box. The sensor showed the unit failing on Sunday while the log said it was fine.',
      'A gasket tore after close. The closing check, taken while people were still there, was an ordinary temperature.',
    ],
    body: `An end-of-shift check is worth doing. It is also the easy part of the day, because someone is standing there. Overnight is when a compressor that has been struggling finally shows itself. A sheet filled in before the lights go off cannot see that.

The sensor is there for the closed building. In the morning, read the trace before the prep list. If the unit stayed in range, the food can be used. If it did not, the food decision comes first, and it gets written on the alert.

Paper is a fair backup for a check someone is present to make. It is the wrong tool for a kitchen that is empty. Checkit covers the hours the log leaves blank.`,
  },
  {
    title: 'Who gets the alert when the pharmacy is closed',
    excerpt: 'An alarm that rings in an empty department is a missed excursion. Escalation has to name the person who is actually on duty.',
    openings: [
      'The pharmacy alarm panel sounded in a room that had been locked since six. The on-call phone did not ring.',
      'A nurse on the ward acknowledged a fridge alert because the notification reached the ward group. She could not say whether the vaccines were still issuable.',
      'The escalation list still included a pharmacist who had left the trust in the spring. The alert stopped with them.',
      'Weekend cover was a different team. The weekday escalation path did not know that.',
    ],
    body: `Mobile alerting only works if the path matches the rota. The first person should be someone who can reach the fridge. If they do not acknowledge, Checkit should move the alert to the next person on the path, including the people who cover nights and weekends.

Acknowledgement is not the decision about the medicines. It is the proof that a person saw it. The decision, quarantine or release, still has to be recorded by someone allowed to make it.

Review the path when staff change. An escalation list that ends at a leaver is a fridge with nobody watching it.`,
  },
  {
    title: 'Who owns the alarm between shifts in the lab',
    excerpt: 'A sample fridge that alerts at handover is easy for both shifts to treat as the other shift\'s problem.',
    openings: [
      'The late shift saw the reagent fridge climbing and left it for the early shift, because handover was in twenty minutes.',
      'The early shift found an acknowledged alert and assumed the samples had already been checked. The note was empty.',
      'A door sensor and a temperature sensor fired together at 7 a.m., in the gap between the two teams.',
      'The lab manager asked who had cleared the overnight alarm. Both shifts were sure it was the other one.',
    ],
    body: `Handover is part of the response. If a unit is out of range at the change of shift, the leaving team records the current reading, what was moved, and what is still open. The incoming team should be able to read that on the alert without a conversation in the corridor.

Do not put samples back because the air feels colder than it did. The range for that fridge is the limit, and if the sensor is still rising, the product stays quarantined.

A handoff that lives in memory is how the same fridge becomes a surprise twice in one day. Checkit is the place the unfinished action is written down.`,
  },
  {
    title: 'The blood bank alarm people have learned to clear',
    excerpt: 'If the same freezer is acknowledged and dismissed every week, the team has stopped treating the alert as information.',
    openings: [
      'The night alarm for freezer 2 was cleared before anyone opened the door. It had been doing that on Tuesdays for a month.',
      'A defrost spike and a failing compressor had started to look the same on the phone, so both got the same swipe.',
      'The acknowledgement comment had become a full stop. There was no note, because everyone already "knew" that freezer.',
      'An audit asked for the last ten alarms on the plasma freezer. Nine were cleared in under a minute, with nothing written.',
    ],
    body: `An alert that is always cleared is an alert the team has decided not to trust. Sometimes that is a defrost curve everyone recognises. Sometimes it is a freezer that is actually getting worse, hiding inside the habit.

If it is defrost, write that, and write that the product was still in range when it recovered. If it is not back on the usual curve, leave the alert open and call it maintenance. Checkit can show the repeat. It cannot decide that this one was different from last Tuesday unless someone says so.

The record of a cleared alarm with no reason is the record of a team that stopped looking.`,
  },
  {
    title: 'Medication storage is not the dining-room fridge',
    excerpt: 'A care home often has both. They need different ranges, different responders, and names that do not collapse into "upstairs fridge."',
    openings: [
      'The upstairs fridge alerted. Night staff checked the dining room, because that was the fridge they knew.',
      'Medication and leftover desserts had, at one point, shared a chill. The sensor was still named for the food.',
      'A temperature excursion on the medication fridge was written up in the kitchen diary. Pharmacy never saw it.',
      'The safe range on the medication fridge had been copied from the kitchen walk-in, because both were "just fridges."',
    ],
    body: `Set the range for the product, not for the nearest similar appliance. Medication that must stay within a tight band should not inherit the limit from a kitchen chiller, and the alert should go to the people who handle medication, not only to the kitchen team.

In Checkit, the asset name should say medication, the room, and the home. The action on the alert should say whether doses were quarantined and who was told. A kitchen corrective-action habit does not cover a medicine fridge.

If both fridges alert and only one is checked, the record will show which one. That is the point of naming them properly before the night you need to.`,
  },
  {
    title: 'Repeat alarms are how you decide where to send an engineer',
    excerpt: 'A single excursion can be a door. The same asset, week after week, is a maintenance job with a history attached.',
    openings: [
      'One kitchen had six alerts. Five were the same prep fridge, each one closed with "door left open."',
      'A clinic fridge had been "a bit warm on delivery day" for a quarter. The deliveries were not the thing that had changed.',
      'The engineer was sent to the site that shouted loudest. The site with the repeating overnight spike had not shouted at all. It had only alerted.',
      'Three homes. One of them accounted for most of the month\'s alarms, all on two medication fridges.',
    ],
    body: `Sort the open and recent alerts by asset, not by the morning they happened to be noticed. A door left open once is a coaching note. The same sensor crossing the line every night is a gasket, a hinge, or a compressor, and the trace is the reason to book the work.

Checkit already has the repeats. The useful habit is to look at them before writing another identical corrective action. Put the work-order number on the latest alert so the next person can see the response was maintenance, not another reminder.

The site that alarms the most is the site that should be first on the engineer\'s list, even if nobody has phoned about it.`,
  },
  {
    title: 'Take the temperature before the delivery is put away',
    excerpt: 'A receiving check counts when it is the food, it happens before the product joins stock you already trust, and the number is on the delivery.',
    openings: [
      'The poultry came off a truck that had sat with the door open. The boxes were on a rack before anyone reached for a probe.',
      'The invoice was signed at the desk. The temperature was written afterwards, from what the driver had said.',
      'The driver was in a hurry. The delivery went straight into the walk-in, and the check became something the team meant to do.',
      'The box felt cold. Nobody opened it. The product inside was a different temperature from the carton.',
    ],
    body: `Probe the food, not the air in the truck and not the outside of the box. With a Checkit probe the reading stays on the delivery, so the accept-or-reject decision is not living on the back of an invoice.

If it is warm, do not slide it into a monitored cooler to see if it comes down. A warm case pulls the unit out of range and warms what was already stored. Refuse it or quarantine it, and write the reason where purchasing can find it later.

The person who signs for the delivery should be the person who took the temperature. When those jobs split, the record gets worse every time.`,
  },
  {
    title: 'The range on a medicine fridge is the limit, not the dial',
    excerpt: 'A setpoint the fridge likes and a range the medicines require are different numbers. Widening the alert until the phone goes quiet does not make the stock safer.',
    openings: [
      'The alert limit had been widened because the fridge "ran a little high" after the morning clinic. The stock did not get colder. The phone got quieter.',
      'The dial said 4. The sensor, in the middle of the stock, said something else on warm afternoons.',
      'A fridge was set colder to be safe, then alarmed all night because the lower limit had been left at a kitchen setting.',
      'The display matched the setpoint. The top shelf, where the vaccines actually sat, did not.',
    ],
    body: `The setpoint is the instruction to the machine. The alert range is the limit for the product. For vaccines that is generally 2°C to 8°C. Set the Checkit alert inside that range, with enough room that a real drift reaches someone before the stock is lost, and not so tight that every ordinary door opening becomes a page.

If the only way to stop the noise is to widen the alert until it matches a weak fridge, the fridge is the problem. Moving the limit so the record looks calm is how the record stops being true.

Write the range on the asset in degrees. A dial with no units is not what the sensor is measuring.`,
  },
  {
    title: 'A door left open in the lab is a product decision',
    excerpt: 'The temperature sensor says the air moved. Someone still has to say what happened to the samples that were in it.',
    openings: [
      'A reagent fridge door did not latch after a busy run. The contact sensor had been unhappy for forty minutes before anyone noticed the air temperature.',
      'The samples nearest the door were the ones people reach for. They were also the ones that warmed first.',
      'An engineer left the freezer ajar and assumed the lab would see it. The lab was in a meeting.',
      'The door alarm cleared when the door was shut. The samples were put straight back into use.',
    ],
    body: `A door alarm and a temperature alarm answer different questions. The door says it was open. The temperature says for how long the product was exposed, and how far it went. Both belong on the same asset in Checkit, and the note has to cover the samples, not just the fact that someone shut the door.

Quarantine what sat in the open door until the person responsible has looked at the trace. Shutting the door ends the excursion. It does not release the stock.

If the latch is the thing that fails, say so on the alert. The next repeat will then read as a repair, not as another careless close.`,
  },
  {
    title: 'High-value stock needs a named response',
    excerpt: 'Plasma, blood, and irreplaceable samples need a person on the alert path who is allowed to decide, not a shared inbox that everyone assumes someone else is watching.',
    openings: [
      'The freezer alert went to a group. Everyone in the group saw it. Nobody in the group was sure it was theirs.',
      'The scientific lead was the only person who could release the samples. They were not on the escalation path.',
      'A night alarm was acknowledged by security, which proved someone had seen a phone, and nothing about the inventory.',
      'The asset was called "Freezer." It held a week of plasma collections. The name did not say so.',
    ],
    body: `Put a named role on the path for assets that hold blood, plasma, or samples you cannot reorder in the morning. Acknowledgement should come from someone who can stand in front of the unit or who is explicitly handing that job to someone who can.

Then record the decision in Checkit against the alarm: moved, quarantined, released, or discarded, with the name of the person who decided. A group chat beside an empty alert is not an audit trail.

Name the asset for the inventory it protects. "Freezer" is not a record. "Plasma freezer 2, blood bank" is.`,
  },
  {
    title: 'The night shift cannot be the only copy of what happened',
    excerpt: 'If the excursion is explained at handover and nowhere else, the morning team inherits a story. The record should already contain the decision.',
    openings: [
      'Night staff moved the medication to another fridge and said so at 7 a.m. By 9 a.m. the day team had moved it back.',
      'The verbal handover included a fridge that "had been odd." The alert comment was blank.',
      'A senior carer wrote the temperatures in the communication book. Checkit still showed an open alarm with no action.',
      'The manager asked, two days later, which doses had been quarantined. The night shift was off, and the book did not name them.',
    ],
    body: `Say what was moved, what was left, and what is still waiting, on the alert, before the shift ends. The next team should learn it from Checkit, not from a conversation that disappears once the office gets busy.

Name the medication or the food. "Checked fridge" does not tell the day shift whether breakfast can be served or whether doses must stay quarantined.

A handover that depends on who is in the room is how the same excursion gets discovered twice.`,
  },
  {
    title: 'Escalation is the plan for when the first person is busy',
    excerpt: 'The first alert often finds someone in the middle of service, a round, or a clinic. The path behind them is what keeps the stock from waiting.',
    openings: [
      'The head chef was on the pass. The cooler alert sat on their phone for twenty minutes, unacknowledged, while the food sat in the walk-in.',
      'The pharmacist was with a patient. There was no second person on the vaccine fridge path.',
      'An alert reached the facilities desk. The desk was covered. The kitchen at the other site did not know.',
      'The on-call phone was in a drawer on silent. The escalation never left that phone.',
    ],
    body: `Set the acknowledgement window for the reality of the shift, then move the alert if it is missed. Checkit escalation is how a busy first responder does not become a single point of failure.

The second person needs to be able to act, or to reach someone who can. A path that climbs into a mailbox nobody watches at night is the same as no path.

Test it on a quiet afternoon: trigger a check, or watch the next real alarm, and see who actually answers. A path that looks right on a screen and fails on a Saturday night is not finished.`,
  },
  {
    title: 'When the hot hold quietly slips',
    excerpt: 'Below the holding line, the pan is no longer being held. The sensor is how that moment shows up before the food goes out.',
    openings: [
      'The well was switched on late and loaded anyway. Service started on food that had not reached a holding temperature.',
      'The last pan sat unstirred while the line cleared the board. It slipped under the line it was supposed to hold.',
      'A cabinet door stayed open between tickets. The first plates were already going out.',
      'Fresh food was poured onto food that had already cooled. The top looked fine. The bottom was about to be served.',
    ],
    body: `Hot food has to stay at 135°F or above. A number in the 120s is not close enough for the rest of service. If a Checkit sensor on the well or the cabinet shows it under the line, reheat it properly before it goes back, or discard it. Do not rescue a cool pan by topping it up.

Write which pan and what you did. If the same well alerts twice in a week, the history is pointing at the equipment. Another note that says "keep an eye on it" will not fix a well that cannot hold.

Check the cabinet before the first ticket. Switched on is not the same thing as hot.`,
  },
  {
    title: 'Quarantine the medicines before the clinic starts',
    excerpt: 'The safest morning habit is to treat an overnight alert as a hold on the stock, and to lift that hold only with a recorded decision.',
    openings: [
      'Clinic was due to start at nine. The vaccine fridge had an open alert from 4 a.m., and the first patient was already booked.',
      'A nurse took a box from the top shelf because the fridge door felt cold. The alert was still red on the phone in the office.',
      'The locum pharmacist did not know the local rule for who may release stock after an excursion.',
      'Yesterday\'s alert had been acknowledged and never resolved. This morning\'s team treated the fridge as clear.',
    ],
    body: `If the alert is open, the stock is on hold. That is the order of the morning: quarantine, read the trace, then let the authorised person release or discard, and record the outcome on the alarm before anyone issues a dose.

Checkit can show that the acknowledgement happened and that the resolution happened, and who did each. A fridge that was "probably fine" is not one of those states.

Close the alert only when the decision is written. An acknowledgement with no resolution is an excursion that is still open, even if the air is cold again.`,
  },
  {
    title: 'What to write when the samples cannot be replaced',
    excerpt: 'Some excursions end in a scientific decision, not a kitchen one. The monitoring record still has to show what was decided and by whom.',
    openings: [
      'A research freezer drifted overnight. The samples were the product of a month of work, and the alert comment said "ok now."',
      'The lab kept the samples because throwing them out felt worse than explaining them. The explanation was never written down.',
      'A principal investigator released the box in conversation. Checkit still showed the alarm as cleared by a technician at 7:12.',
      'The logger file was exported to email. The action in the platform was empty, so the audit trail and the science lived in different places.',
    ],
    body: `The sensor cannot judge a sample. It can show how warm it got and for how long. The person who owns the work has to release or discard it, and that decision belongs on the alert: which boxes, what was decided, and their name.

"OK now" is a description of the freezer after the door was shut. It is not a description of the samples. If the decision is to keep them with a caveat, write the caveat. Future you, and anyone who asks, will not remember the conversation.

Keep the record in Checkit even when a longer scientific note also exists. The temperature and the decision should be in the same place.`,
  },
  {
    title: 'The trace is the evidence. The note is the decision.',
    excerpt: 'A graph shows that the freezer moved. It does not show whether the plasma was issued afterwards. That sentence has to be written.',
    openings: [
      'The curve was obvious. The comment said "false alarm" and stopped, which left the plasma question unanswered.',
      'An auditor asked what happened to the units in freezer 2 on the night of the spike. The graph was easy. The outcome took an afternoon to reconstruct.',
      'Someone exported the chart and pasted it into a report. The actions taken were still only in a shift book.',
      'The alarm was resolved in four minutes. The resolution text was a single word: done.',
    ],
    body: `Checkit stores the degrees and the clock. The note is shorter than people fear, and it has to contain the decision: which stock, what you did, and your name. "Plasma moved to freezer 1. Freezer 2 left out of service. Engineer called, job 4412." That is a record. "Done" is not.

"False alarm" needs a reason: a known defrost, back in range, product still within limit when checked. Without the reason, it reads as a spike nobody was willing to own.

Use the comment on the alert. A clean trace with nothing written on it is half a record.`,
  },
  {
    title: 'One manager, several dining rooms',
    excerpt: 'Senior living catering often means more than one servery. The record has to show which room, which service, and who responded.',
    openings: [
      'Lunch went out from three serveries. The hot hold in the smallest one slipped, and the alert went to a chef who was plating in the main kitchen.',
      'A satellite dining room was checked "when someone was over that way." The sensor had been out of range through the service.',
      'The corrective action said "servery." The home has four.',
      'Weekend cover ran two dining rooms with one cook. The escalation path still assumed a full weekday brigade.',
    ],
    body: `Name each servery, trolley, and holding cabinet for the room it serves. An alert that says "hot hold" will be answered in the room the chef is already standing in, which may not be the room that alarmed.

The response is the same shape as anywhere else in Checkit: acknowledge, deal with the food, write down which service and what was done. If weekend staffing cannot meet the weekday path, change the path, do not hope the weekday names will pick up.

A group of dining rooms is a small multi-site problem. Treat it like one.`,
  },
  {
    title: 'A cleared notification is not a completed response',
    excerpt: 'Acknowledgement proves the alert was seen. Resolution proves someone decided what happened to the stock.',
    openings: [
      'The phone was swiped clear on the way into the building. The fridge was not opened for another hour.',
      'An alert showed as acknowledged by a manager who was off site. The local team had not started the quarantine.',
      'The dashboard looked calm by 8 a.m. Three alerts had been cleared overnight with no action text.',
      'A supervisor asked for proof of the response. The system had a timestamp for "seen" and nothing after it.',
    ],
    body: `Treat acknowledgement and resolution as different steps, because they are. The first is the person. The second is the product: quarantined, moved, discarded, released, or passed back into service, with enough detail that a stranger could follow it.

Do not resolve an alert to make a dashboard look ready for a visit. The visit, or the audit after it, will ask what was decided. Checkit can show the time you resolved it. It cannot improve a sentence you did not write.

If the action is still in progress, leave the alert open. An open alert is an honest status. A closed one with an empty note is a gap.`,
  },
  {
    title: 'Cooling is a clock someone has to start',
    excerpt: 'A cold walk-in does not prove a deep pan of soup cooled on time. That clock is its own record.',
    openings: [
      'The stockpot went into the walk-in with the lid on. The room sensor barely moved. Nobody was timing the soup.',
      'Cooling started, and then the cook was pulled to the line. The two-hour mark passed while they were gone.',
      'The shallow pans were in the pot wash, so the chili went into a deep pan because that was what was clean.',
      'The morning crew found a pot from the night before and had to guess whether the clock had ever been started.',
    ],
    body: `Food has to get from 135°F to 70°F within two hours, and from there to 41°F within four more. A walk-in sensor confirms the room. It does not confirm the centre of the pan. Spread the food thin, leave it uncovered, and record a temperature at the start and again before the first window closes.

If it misses the window, reheat it and start again, or discard it. Checkit can hold those times if someone starts the record. A cooling note with no start time is just a pot in a fridge.

Write the batch down. "Soup, Tuesday night" is a record. "Cooling done" is not.`,
  },
  {
    title: 'Write the medicine decision the way an auditor will read it',
    excerpt: 'The sensor already has the degrees and the time. The note needs the batches and the outcome, in words a stranger can follow.',
    openings: [
      'The comment said "see fridge log." The fridge log was a clipboard that had not been updated since March.',
      'Batch numbers were in the pharmacy system. The alert comment said "vaccines checked," which did not say which ones.',
      'An inspector asked for the overnight excursion on the 4th. The graph was there. The outcome took a search through email.',
      'The locum wrote "as per protocol." The protocol was not attached, and the protocol did not name the stock.',
    ],
    body: `Write for someone who was not on the shift and does not know the local shorthand. Use the asset name as it appears in Checkit. Say what the product was, what the trace showed in plain language, and what was decided.

"Fridge 3 reached 9.4°C at 01:12 and recovered at 06:05. Vaccines on the top shelf quarantined. Superintendent released batches A and B at 09:40. Batch C discarded." The sensor drew the graph. The sentence is the response.

Abbreviations that only this team understands will not survive the person who asks in six months.`,
  },
  {
    title: 'A lab freezer that is starting to struggle',
    excerpt: 'Units rarely fail in a single night. They run warmer, or take longer to recover, while every spot check still passes.',
    openings: [
      'A freezer that used to sit comfortably inside its range had spent a week living near the top of it. Every morning check still passed.',
      'Defrost recovery was taking longer than it had a month ago. Nobody had changed a setting.',
      'The compressor almost never rested on warm afternoons. The sensor showed more work for a worse result.',
      'The scientists had started moving the irreplaceable boxes to the other freezer. Nobody had raised a job, because nothing had actually alarmed that day.',
    ],
    body: `Compare this week with last month, not only with the limit. A unit living against its upper line does not have margin. Clean the coil, look at the seal, and schedule service while the samples are still safe. Waiting for the alert means waiting until the product is already the incident.

How long a defrost takes to recover tells the same story. Write the drift down when you notice it. A work order is easier to justify with three weeks of a climbing line in Checkit than with a ruined morning and a theory.

The sensor was put there to see this early. Someone still has to look at last month before this morning becomes the story.`,
  },
  {
    title: 'After the repair, look at the next night',
    excerpt: 'A work order closes the job in someone\'s system. The freezer either recovered overnight or it did not, and the trace is the check.',
    openings: [
      'The engineer replaced a gasket at 4 p.m. and marked the job complete. Nobody looked at the freezer again until the next alarm.',
      'Plasma freezer 2 had a new fan. The following night still showed the same slow recovery after defrost.',
      'The kitchen walk-in was "fixed" on a Friday. Saturday\'s trace looked like Friday\'s.',
      'The job sheet said the setpoint was adjusted. The alert range in Checkit had not been, so the fridge alarmed all weekend for a different reason.',
    ],
    body: `When the engineer leaves, watch the next quiet period on that asset. The repair worked if the overnight spike, or the slow recovery, is gone. If the curve is unchanged, the unit is not finished, and you know it from the sensor rather than from a callback next month.

Write the job number on the alert that caused the visit, and note what you see the next morning. That ties the maintenance history to the temperatures.

If the visit changed the setpoint, change the alert range only if the product limit changed. A new setpoint is not a new safe range.`,
  },
  {
    title: 'A missed check should look like a gap',
    excerpt: 'Copying yesterday\'s temperature into today\'s row makes a missed round invisible. A missing check in the record is easier to manage than a invented one.',
    openings: [
      'The evening medication round was skipped and filled in the next morning from memory. The fridge had alerted in between.',
      'A paper sheet had a number in every box for a week the sensor showed was not that tidy.',
      'The new starter copied the previous reading because the probe was missing and the sheet could not be handed over with a blank.',
      'An inspector compared the clipboard with the history. The clipboard was perfect. The history was not.',
    ],
    body: `If a check did not happen, leave the gap and record why. Inventing a temperature to keep a sheet tidy is how a real excursion gets buried under a number nobody measured.

Checkit is already measuring the asset overnight. Use that history when a round is missed, and write the corrective action for the gap: who noticed, what the trace showed, and what happened to the stock. Do not backfill a temperature you did not take.

A blank that is explained is a managed miss. A full sheet that disagrees with the sensor is a different kind of finding.`,
  },
  {
    title: 'Name the asset the way it appears on the door',
    excerpt: 'An alert that says "Sensor 14" will be answered slowly, or in the wrong room. The name is part of the response.',
    openings: [
      'The notification said "RF-14." The person on call did not know which building that was.',
      'Two "main fridges" existed, one in pharmacy and one in the kitchen, because each team had named theirs first.',
      'A replaced sensor kept the old name of a unit that had been removed. Alerts for the new freezer looked like a ghost.',
      'The site code in Checkit did not match the site code on the work-order system, so jobs were raised against the wrong address.',
    ],
    body: `Use the name on the door, plus the site: "Ward 4 vaccine fridge," "Blood bank plasma freezer 2," "Servery B hot hold." The person receiving the alert on their phone may not be the person who installed the sensor.

When a unit is replaced, rename the asset or retire it. A history that belongs to a fridge you scrapped will be blamed on the fridge that took its place.

Align the name with the maintenance system if you can. The alert and the job should be obviously about the same machine.`,
  },
  {
    title: 'An open door and a failing compressor look different overnight',
    excerpt: 'A unit that holds all day and climbs all night is often a seal. On a single afternoon reading it looks like a machine that cannot keep up.',
    openings: [
      'A trolley caught the walk-in hinge. The door still closed if you pushed it. After the building went quiet, the temperature did not hold.',
      'You could see light through the seal. The overnight trace had started to agree.',
      'The unit held while people were around to shut it, and climbed after the last close of the evening.',
      'Ice built along one side of a freezer door the team had been complaining about without writing it down.',
    ],
    body: `Before you condemn the machine, look at when it drifts. In range during a staffed day and out of range once everyone leaves is often a gasket, a latch, or a hinge. Those are smaller jobs than a compressor, and on a Checkit trace they have a shape.

Until it is fixed, keep the most sensitive product off the door side and probe it. After the repair, look at the next two nights. The spike should be gone. If it is still there, then you are looking at the machine.

A door that needs a hip to close is already a temperature incident. It is waiting for a quiet night to prove it.`,
  },
  {
    title: 'Weekend cover for a vaccine fridge',
    excerpt: 'The weekday pharmacy path is not a weekend plan. Someone who is in the building, or truly on call, has to be named.',
    openings: [
      'Saturday\'s alert went to the weekday pharmacist. They saw it on Monday.',
      'The hospital switchboard had a number for pharmacy that was not the number in the escalation path.',
      'A bank nurse acknowledged the fridge alert and did not know the quarantine rule.',
      'The fridge was fine all week and warm on Sunday, which is the day the path was thinnest.',
    ],
    body: `Build a weekend and night path on purpose. The person on it should know the range, where the fridge is, and that an open alert means the stock is quarantined until pharmacy releases it.

Checkit will follow the path you configured. It will not invent a pharmacist who is not on the list. If weekend clinical staff are the first responders, tell them what they are allowed to do, and who they escalate the decision to.

Review it before a bank-holiday weekend, not after the first excursion of the year that landed on one.`,
  },
  {
    title: 'Have the lab record ready before anyone asks',
    excerpt: 'The excursion, the acknowledgement, and the decision should already be one history, not a search through inboxes on the day of the visit.',
    openings: [
      'A collaborator asked which samples had seen the overnight spike. The answer existed, split between the sensor portal and a lab book.',
      'The quality visit was on Thursday. The only copy of last month\'s alarms was a spreadsheet someone had meant to update.',
      'A freezer failure from March was remembered clearly and documented vaguely.',
      'Two systems had two different recovery times for the same incident, because one of them had been typed from memory.',
    ],
    body: `Keep the response on the alert as it happens. When someone asks, Checkit should be able to show the asset, the curve, who acknowledged, and what was decided, without reconstructing the week from chat.

Exporting a chart is useful. It is not a substitute for the note that says whether the samples were kept. If those live in different places, they will disagree the first time someone is in a hurry.

A record you can open in a minute is the point of monitoring. A record you build the night before a visit is a different, weaker thing.`,
  },
  {
    title: 'Defrost is a pattern. A failure is a pattern that changed.',
    excerpt: 'Freezers warm up on a schedule you can learn. The alert that matters is the one that does not come back the way it did last month.',
    openings: [
      'Every night at 2 a.m. the freezer rose and recovered within the hour. Everyone had stopped reading that alert.',
      'Last Tuesday the recovery took three hours. It was cleared with the same comment as the one-hour nights.',
      'A new freezer did not have a known defrost curve yet, so every spike was being treated as familiar.',
      'The blood-bank team could describe the pattern out loud. The comments on the alerts did not mention defrost at all.',
    ],
    body: `Learn the defrost shape for each freezer and write it down once, on the asset, so the team knows what "normal recovery" means. When an alert matches that shape and the product stays in range, say so in the comment. When recovery is slower, or the peak is higher, treat it as a different event.

Checkit will keep showing both. The comments are how a later reader tells the routine nights from the night the fan started to fail.

Do not use one saved phrase for every spike. The phrase will still be there when the pattern has changed, and it will be wrong.`,
  },
  {
    title: 'Families and inspectors ask the same question',
    excerpt: 'What happened to the food, or the medication, and what did you do? The answer should already be on the alert.',
    openings: [
      'A relative asked why lunch was late. The real reason was a hot hold that had been out of range, and the note did not say the food was replaced.',
      'The local inspector asked for the last excursion on the medication fridge. The temperatures were in Checkit. The action was in a diary in the manager\'s office.',
      'Night staff had done the right thing and told the morning lead. Neither of them had written it where the record lives.',
      'A complaint arrived a week later. The people who remembered the shift were on leave.',
    ],
    body: `Write the outcome in ordinary language on the alert: the food was discarded and the service was replaced, or the medication was quarantined and the GP was told. That sentence is what a manager needs when someone asks, and it is what an inspector will compare with the trace.

Checkit already has the time and the temperature. The missing piece is almost always the human decision, made once, in the moment, and not reconstructed later.

If you would be unwilling to read the note aloud to a family, it is not finished.`,
  },
  {
    title: 'The weekend is when a small drift becomes Monday',
    excerpt: 'A fridge that is slightly warm on Friday afternoon has two unsupervised nights ahead of it. Monday morning is a late time to notice.',
    openings: [
      'Friday\'s check passed. The sensor spent Saturday night against the top of the range and Sunday night above it.',
      'The only person who looked at alerts on weekends was whoever happened to have notifications on.',
      'A venue kitchen was dark from Sunday to Wednesday. The cooler was not.',
      'Monday prep started before anyone opened the overnight history. The food was already on the bench.',
    ],
    body: `Before the last shift of the week, look at units that have been living near their limit, not only at units in alarm. A Friday reading inside the line can still be a unit with no margin for a warm weekend.

Someone has to be on the weekend path, and Monday\'s first job on that site is the trace, before food is prepped or stock is issued. Checkit will have the two nights. It will not interrupt prep on its own.

If a site is closed for days at a time, the escalation for that site has to reach a person, not a kitchen that is empty.`,
  },
  {
    title: 'Say what happened to the food',
    excerpt: 'The alert knows the cooler left range. It does not know whether the dairy was discarded, moved, or served.',
    openings: [
      'The log said OK next to a unit that had been alerting through breakfast.',
      'Someone wrote "adjusted" and went home. The next shift could not tell what had been moved.',
      'Three discards in a week had alerts and no product names.',
      'The comment was long and still left out the only fact that mattered, which was what happened to the food.',
    ],
    body: `Write which food, what you did, and your name. "Moved the soup to the other walk-in and discarded the sliced turkey" is a note. "Checked fridge" will still be attached to a warm trace in six months, and it will not help.

Do it during service, while you remember which pan. If the same unit collects the same sentence three times, stop rewriting the comment and raise a repair. The history is already the case for that call.

A note that would confuse a stranger is not finished. The stranger may be an inspector, or the other shift.`,
  },
  {
    title: 'Power comes back. The stock does not reset.',
    excerpt: 'When the supply returns, every monitored unit needs its own trace read before anyone uses what was in it.',
    openings: [
      'The site lost power at midnight and came back at 4 a.m. The team checked the lights and started the day.',
      'One fridge recovered in twenty minutes. The freezer next to it did not, and it was the one nobody opened.',
      'A generator covered the lab and not the pharmacy. Both were on the same account, and only one had a normal night.',
      'The outage was written in the estates log. The product decisions were not written on the alerts.',
    ],
    body: `After a power cut, open the history for each asset before you open the stock. Recovery time will differ. A vaccine fridge, a plasma freezer, and a kitchen walk-in do not get a single blanket "power was restored."

Quarantine where the trace left the range, and record the decision per asset in Checkit. Estates can own the generator. They cannot own the release of the medicines.

If you do not know how long a unit was off, say so, and hold the stock until someone who is allowed to release it has looked.`,
  },
  {
    title: 'The sensor watches the unit. The probe checks the product.',
    excerpt: 'A display at 36°F can sit next to food that is already too warm. The continuous record and the spot check answer different questions.',
    openings: [
      'The display said 36°F. Sliced turkey by the door probed at 47°F. Both numbers were real.',
      'The sensor hung in front of the fan, in the coldest air in the cabinet. The door shelf was a different story.',
      'The team logged the readout every afternoon and never probed a product. The log was a diary of the machine talking about itself.',
      'After a delivery the sensor recovered in a few minutes. The food that had been in the open door had not.',
    ],
    body: `A Checkit sensor is the story of the unit across the day and the night. A probe is the food or the stock in front of you. They come apart after a delivery, a long prep, or a stack of warm pans.

Put the sensor where the product actually sits, not in the blast from the fan, and file the probe reading with the delivery or the corrective action so both live together. Cold food still has to be at 41°F or below. A vaccine fridge still has to sit between 2°C and 8°C. The air being healthy does not answer either question on its own.

The useful record is both, in the same place.`,
  },
  {
    title: 'Do not widen the alarm to silence a weak fridge',
    excerpt: 'If the only way to get a quiet phone is to move the limit, the fridge is no longer being monitored against the product.',
    openings: [
      'The vaccine fridge alarmed most afternoons. The limit was moved to 10°C so clinic could get through the week.',
      'A kitchen walk-in "always ran high" on delivery day, so delivery day was effectively unmonitored.',
      'The team was proud of a week with no alerts. The range had been edited on Monday.',
      'An auditor asked when the limit changed. The answer was in the configuration history, and it did not match the SOP on the wall.',
    ],
    body: `Change an alert range when the product requirement changes, or when a sensor has been moved onto a different asset. Do not change it because a struggling unit is noisy. The noise is the monitoring working.

If a fridge cannot stay inside the real limit, repair or replace it, and quarantine product when it leaves range. Checkit will keep the history of the excursions either way. A wider limit only stops you being told.

Write down why a range was changed, in the same way you would write a corrective action. A silent edit is hard to defend later.`,
  },
  {
    title: 'Between shifts, the unfinished alarm has to be visible',
    excerpt: 'An acknowledged alert with no outcome is still open work. The next shift should see it without being told.',
    openings: [
      'The late shift acknowledged the reagent fridge and went home. The early shift started work as if the night had been quiet.',
      'A handover email mentioned "fridge issues." Three assets had open alerts. The email did not name them.',
      'The status in Checkit said acknowledged. Everyone read that as finished.',
      'A sample set was used at 8 a.m. from a fridge that still had an unresolved overnight alarm.',
    ],
    body: `Leave the alert unresolved until the product decision is made. Acknowledgement tells the next person that someone saw it. It should not tell them the samples are fine.

The incoming shift starts from the open alerts, not from the assumption that a quiet corridor means a quiet night. If they need to add the outcome, they add it on the same alarm, so the night and the morning are one record.

Checkit is the handover for the fridges. Anything that matters about them and lives only in an email will be the thing that gets missed.`,
  },
  {
    title: 'One view before you issue blood or plasma',
    excerpt: 'The freezer can look normal at the moment of issue and still have spent the night out of range. Check the open alerts first.',
    openings: [
      'Issue started at 7 a.m. from a freezer that had an unacknowledged alarm at 2 a.m.',
      'The display was in range. The history showed a door alarm through the previous evening.',
      'A locum on the bench did not know there was a monitoring record to check before release.',
      'The night team had quarantined one shelf and told the morning team verbally. The other shelf was issued as normal, which happened to be right, and was not written down.',
    ],
    body: `Before issue, look at open alerts on that asset, not only at the current temperature. If the night left the range, the stock stays held until the named person has recorded a release.

Make that check part of the bench routine, the same way identity checks already are. Checkit is there so the night is visible at the moment someone is about to use the product, not afterwards in a report.

If the night team already decided, the morning team should be able to read the decision on the alert and not have to remake it from memory.`,
  },
  {
    title: 'A new starter needs the assets, not a tour of the binder',
    excerpt: 'The first shift should include which fridge is which, who the alert goes to, and what they are allowed to do about it.',
    openings: [
      'A new carer acknowledged a medication-fridge alert and then asked a colleague what acknowledgement meant.',
      'The kitchen induction covered the paper log. The sensor, which had replaced most of that log, was mentioned as "the app."',
      'A new pharmacist inherited an escalation path that still named their predecessor.',
      'The first real alarm of their first week was the training. It arrived at 6 a.m.',
    ],
    body: `Show the assets in the rooms, under the names they have in Checkit. Show what an alert looks like on the phone, what acknowledgement does, and what they must not do, which is release quarantined stock or close an alert with nothing written.

Update the escalation path as part of the starter process, not as a later tidy-up. A path that still rings a leaver is a gap on day one.

The binder can explain the policy. The first week should be spent on the fridges the policy is about.`,
  },
  {
    title: 'The account should match the sites you actually operate',
    excerpt: 'A closed kitchen that still alerts, or a new clinic that is not on the account, both mean the view is wrong.',
    openings: [
      'A servery had been converted into a store six months ago. Its sensor still alerted, and people still drove across to check it.',
      'A new clinic opened with a vaccine fridge and a paper thermometer, because nobody had added it to the account.',
      'Two sites had been merged. Alerts still used the old names, and jobs went to the old address.',
      'A pop-up kitchen for a season was never given an owner. Its cooler alerted into a path that no longer existed.',
    ],
    body: `When a site opens, closes, or changes use, change the account in the same week. Retire assets that are gone. Add the fridge that is now holding medicines or food, with a range and a person on the path, before it has its first night.

Checkit can only show the assets it has. A new vaccine fridge on a min/max thermometer is invisible until someone puts a sensor on it and names an owner.

Old names that outlive the building will keep generating responses to rooms that are empty, and they train the team to ignore alarms.`,
  },
  {
    title: 'Look at the night before you start the prep',
    excerpt: 'The first useful check of the day is the trace, before food is portioned or stock is issued from a unit that alarmed at 3 a.m.',
    openings: [
      'Prep started at six. The walk-in alert from 3 a.m. was opened at ten, when someone finally looked at their phone.',
      'The morning chef trusted the closing sheet from the night before. The sensor had a different account of the night.',
      'Breakfast service used milk from a fridge that had spent two hours above range.',
      'The night was fine, and nobody recorded that either. The absence of an alert was the information, and it was never glanced at.',
    ],
    body: `Open the overnight alerts before you open the prep list or the clinic list. If a unit left range, the food or the stock in it is the first job, not the second. If nothing alerted, you have learned that too, in a few seconds.

Write the outcome on any alert you touch, even when the outcome is "probed at 39°F, food kept, door latch repaired." A morning that only clears notifications is a morning that threw away the reason the sensor was there.

Checkit has already watched the night. The shift still has to read it.`,
  },
  {
    title: 'The comment on a medicine fridge will be read by someone outside the team',
    excerpt: 'Pharmacy, nursing, and quality do not share a shorthand. The note has to carry the batches and the decision without a translator.',
    openings: [
      'The comment said "per JP." JP was on leave, and quality wanted the batch numbers.',
      'Nursing had quarantined the drawer. Pharmacy released "the fridge" without saying they had seen that note.',
      'A shared abbreviation for discarded doses meant something else on the ward.',
      'The best sentence in the record was in a WhatsApp group that quality could not log into.',
    ],
    body: `Write the note so a quality lead and a nurse can both follow it. Name the fridge, the time it was out, the batches or the drawer, and the decision. If pharmacy released the stock, pharmacy\'s name should be on that line, not inferred from who usually does it.

Keep side conversations if you need them. Copy the decision into Checkit, because that is the record tied to the temperatures. A conclusion that exists only in a chat will not be the one that turns up in the audit.

Short is fine. Coded is not.`,
  },
  {
    title: 'A freezer full of samples needs an owner in the path',
    excerpt: 'Shared lab freezers become everybody\'s and nobody\'s. The alert needs a named owner even when the boxes inside belong to several people.',
    openings: [
      'Four research groups used one freezer. The alert went to a mailbox none of them watched daily.',
      'The technician who set the sensor up had left. Alerts still arrived in their name.',
      'Everyone assumed the group with the most boxes would respond. That group was at a conference.',
      'The excursion affected one shelf. The note did not say which, so every group spent a day checking.',
    ],
    body: `Give the asset an owner who is responsible for the first response, even if they do not own every sample inside it. Their job is to quarantine, to tell the groups affected, and to record which shelves were involved.

Checkit cannot route an alert to "whoever cares about these boxes." Put a name on the path, and a second name for when they are away. Update it when people leave.

The note should say which shelf or which labelled inventory was at risk. A freezer-level "all OK" helps nobody who had samples on the door.`,
  },
  {
    title: 'Issue only from a freezer that was watched',
    excerpt: 'If a unit dropped off monitoring, the gap is the event. Stock from a blind period needs the same quarantine as stock from an alarm.',
    openings: [
      'The sensor battery died on Friday. The freezer looked fine on Monday, with no history in between.',
      'A gateway offline alert was cleared as an IT issue. The blood fridge on that gateway had no readings for six hours.',
      'Someone unplugged a logger to borrow the socket. The asset showed a flat line that nobody opened.',
      'The weekend data never arrived, and issue went ahead because the display on the door said the right number.',
    ],
    body: `A gap in the trace is not a quiet night. If Checkit stopped hearing from a sensor, treat the stock the way you would treat an excursion until you know why, and write that the data was missing.

A door display is a comfort, not a history. It cannot show you the six hours the gateway was down. Get the monitoring back, then decide about the product with whatever readings you do have, and record the gap honestly.

Clearing an offline alert without saying which assets went blind is how a missing night disappears.`,
  },
  {
    title: 'The dining room and the medication room need different paths',
    excerpt: 'One care home, two kinds of cold storage, two kinds of harm. Sending both alerts to the kitchen means one of them is late.',
    openings: [
      'The medication fridge alerted the chef, because the chef was the named user on the account.',
      'Kitchen alerts woke the nurse on call, who had no reason to be in the kitchen at midnight.',
      'A single group called "Home" received every alarm. The group had forty people and no rota.',
      'The manager was on both paths and was the only person on both paths. They were on holiday.',
    ],
    body: `Split the paths. Food alerts go to the catering team on duty. Medication alerts go to the people responsible for medicines, with a manager behind them if nobody acknowledges. Being on one path does not qualify someone for the other.

Checkit can run both in the same home without pretending they are the same asset. The names, the ranges, and the responders should all say which is which.

If one person is the only name on every path, the home does not have cover. Add the second person before the holiday, not during the excursion.`,
  },
  {
    title: 'Read the repeats before you buy another fridge',
    excerpt: 'A fleet decision is easier when you can see which assets alarm, which sites, and whether the response is keeping up.',
    openings: [
      'Capital was requested for six new fridges. The history showed two of them produced almost all of the alarms.',
      'A site with new equipment still alarmed nightly, and the comments all described a door that did not latch.',
      'The quiet sites never came up in meetings. The loud site did, even though its alarms were acknowledged in minutes.',
      'Replacement was justified by a feeling that "they\'re all old." The traces were not equally bad.',
    ],
    body: `Use the last quarter of alerts, not the last anecdote. Assets that alarm because they are failing belong on a replacement or repair list. Assets that alarm because of doors, loading, or a path that nobody answers need a different fix, and new equipment will not provide it.

Checkit can show where the repeats sit across the estate. Pair that with whether those alerts were actually resolved. A site that alarms and responds is a different problem from a site that alarms into silence.

Spend the money on the units the history indicts, and spend the training on the ones the comments indict.`,
  },
  {
    title: 'The third alert on the same unit is a repair',
    excerpt: 'The first alert can be a one-off. By the third, the corrective action should be a job raised, not another reminder to watch it.',
    openings: [
      'The prep fridge had three alerts in ten days, each closed with "will monitor."',
      'A ward fridge alarmed on the same shelf every Monday after the vaccine delivery. Nobody had looked at the seal.',
      'The comments were getting longer. The fridge was not getting colder.',
      'An engineer was finally called after a loss. The previous three alerts would have been enough.',
    ],
    body: `Count recent alerts on that asset before you write the same action again. On the third, raise the job and put the number on the alert. Monitoring a unit that cannot hold its range is not a corrective action. It is a delay.

Checkit has the three dates. The person closing the latest one is in the best position to connect them, instead of treating today as a fresh incident.

"Will monitor" on a repeating asset means the sensor is doing its job and the follow-up is not.`,
  },
  {
    title: 'A clinic fridge after a busy vaccination session',
    excerpt: 'A door that was open for an hour of appointments can leave stock warm after the queue has gone. The end-of-clinic glance at the display will miss it.',
    openings: [
      'Vaccination clinic ran all afternoon with the fridge opened for every patient. The sensor peaked after the last appointment, when nobody was looking.',
      'Staff checked the fridge at lunch, before the busy session, and not again.',
      'The outreach fridge came back to base warm. The paper sheet had been filled in before the team left.',
      'Stock was restocked on top of stock that had sat in an open door all afternoon.',
    ],
    body: `A vaccination session is a long door-open event. Read the trace at the end of the clinic, not only the temperature once the door has been shut for a minute. If the stock left range, quarantine it and let the authorised person decide before the next session uses it.

Write the session on the alert: which clinic, how long the door was working, and what happened to the remaining stock. Checkit will show the curve. The note should show that someone acted on it.

Restocking a warm fridge with fresh stock does not cool what was already in there, and it puts the new stock at risk too.`,
  },
  {
    title: 'Move the sensitive samples off a unit that is drifting',
    excerpt: 'While you wait for a repair, the monitoring has already told you which freezer not to trust with work you cannot repeat.',
    openings: [
      'The freezer was booked for a service next week. The most fragile boxes were still on the shelf that ran warmest.',
      'A spare freezer had capacity. Nobody moved anything, because the alarm had not quite become a failure.',
      'The drift was known to the lab manager and not to the students loading new samples into that unit.',
      'After the loss, the spare freezer turned out to have been empty.',
    ],
    body: `If an asset is repeating or living on its limit, stop loading the irreplaceable stock into it before the repair date. Move those samples to a unit whose trace is dull, and record the move on the alert so everyone loading the lab knows.

Checkit is the reason you can do this early. The alarm does not have to end in a loss to be a reason to change where the boxes sit.

Tell the people who use the freezer, in the place they will see it, which is the asset record, not only a conversation with the manager.`,
  },
  {
    title: 'A quiet blood fridge is a fridge someone checked',
    excerpt: 'No alarm overnight is meaningful only if the sensor was reporting. The morning issue round should know the difference.',
    openings: [
      'The fridge had no alerts, and the gateway had been offline from midnight to five.',
      'The night looked quiet because the alert limits had been widened after the last false scare.',
      'Issue went ahead on the strength of a green dashboard that nobody had actually opened.',
      'The sensor was reporting the whole night, in range, and that fact was never glanced at because nothing had buzzed.',
    ],
    body: `A morning with no alarms is a result, if the sensor was online and the range is still the real range for that product. Glance at the asset anyway before issue: last reading, no gap, no open alert. It takes less time than explaining a guess later.

If there is a gap or a limit that was recently widened, you do not have a quiet night. You have a hole. Hold the stock and write why.

Checkit\'s job overnight is to watch. The bench\'s job in the morning is to confirm that the watch held, and then issue.`,
  },
  {
    title: 'Write the care note where the temperature already is',
    excerpt: 'The diary, the communication book, and the alert should not be three competing versions of one night.',
    openings: [
      'The communication book said the medication fridge was checked. Checkit said it was out of range for two hours with no acknowledgement.',
      'A carer wrote a careful note in the diary and a blank resolution on the phone, because the phone felt like admin.',
      'The manager reviewed books on Mondays and alerts only when something buzzed during the day.',
      'Two versions of the same night disagreed about whether doses were discarded.',
    ],
    body: `Put the decision on the alert, then point the diary at it if the home also keeps a book. One version has to win, and it should be the version sitting next to the temperatures.

Train the night team to write the sentence in Checkit first. A beautiful diary entry about a fridge, beside an empty alert, will lose an argument with the sensor.

If the book and the alert disagree, correct the record the same day and say which one was wrong. Waiting until an inspection finds the contradiction is how small nights become findings.`,
  },
  {
    title: 'What good looks like on a monitored estate',
    excerpt: 'The aim is not zero alerts. It is alerts that reach a person, a decision written down, and repeats that turn into maintenance.',
    openings: [
      'A regional review celebrated a site with no alarms. That site\'s sensors had been offline for nine days.',
      'Another site had dozens of alarms, all acknowledged, all with a food or stock decision, and a short list of assets waiting on an engineer.',
      'The leadership pack counted alerts. It did not count unresolved ones.',
      'A quiet month followed a range change. The pack called it improvement.',
    ],
    body: `Judge a site on whether monitoring is alive, whether alerts reach someone who answers, and whether the note says what happened to the product. A site with no alarms and no readings is not a calm site. A site with alarms, fast acknowledgements, and real resolutions is doing the work.

Use Checkit to see the unresolved alerts and the assets that repeat. Those two lists are the operating review. A count of alarms on its own will reward the team that widened the limits.

The record you want, later, is a dull trace or a trace with a decision attached. Anything else is unfinished.`,
  },
];
