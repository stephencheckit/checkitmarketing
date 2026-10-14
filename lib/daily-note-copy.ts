export interface NoteCopy {
  title: string;
  excerpt: string;
  openings: [string, string, string, string];
  body: string;
}

export const NOTE_LIBRARY: NoteCopy[] = [
  {
    title: 'The first ten minutes after a cooler alert',
    excerpt: 'The sensor has already done its job by the time the alert reaches someone. What happens next is a food decision, and it needs to be written down.',
    openings: [
      'The walk-in alerted in the middle of the rush, just after a delivery had been walked in with the door held open. Nobody was surprised. The door had been open a long time. The question was what, inside, had actually warmed up.',
      'The alert had been waiting since 2 a.m. The opener was the first person to see it, standing in the dark kitchen with a phone and a cooler full of food that service was about to depend on.',
      'Two units alerted at once. The team went to the prep fridge, because that was the one in front of them, and left the other one for later. Later did not come until the lunch was already plated.',
      'By the time anyone looked, the alert had cleared itself. The cooler felt cold again. The history still showed forty minutes above the line, which is the part that does not go away when the air feels fine.',
    ],
    body: `A Checkit alert means the sensor has already left its range and the reading is stored. The next ten minutes are not for silencing the phone. They are for deciding what happened to the food. Probe what sits nearest the door, the thin pans and the dairy, not the air in the middle of the box. If the unit is still warm and the trace is longer than a door that was opened and shut, move that food into a unit that is holding.

Then write the action down before going back to the line: what moved, what was discarded, and who decided. Clearing the notification leaves a temperature history with no response attached. That is the version an inspector reads later, and it is a weaker story than a short note made while the door was still open.

The sensor cannot tell you whether the soup is still usable. Someone on the shift has to, and Checkit is where that decision should live.`,
  },
  {
    title: 'The temperature log that ends when the lights go off',
    excerpt: 'A number written at the end of the shift is a picture of a busy kitchen. It says nothing about the six hours when the building was empty.',
    openings: [
      'The closer wrote 38°F on the sheet at ten, locked the office, and went home. At six the next morning the case was warm, and the sheet from the night before was no help at all.',
      'Someone copied the afternoon reading onto the night row because the kitchen was already dark and the walk to the cooler felt pointless. The sheet looked complete. The night was not on it.',
      'The paper log for the month had a number in every box. The sensor, which nobody had looked at, showed the unit failing on a Sunday while the log said everything was fine.',
      'A gasket tore after close. The closing check, taken while people were still in the building, was a perfectly ordinary temperature. The failure happened in the hours the clipboard does not cover.',
    ],
    body: `An end-of-shift check is worth doing. It is also the easy part of the day, because someone is there to take it. Overnight is when doors stay shut, defrost cycles run, and a compressor that has been struggling finally shows itself. A sheet filled in before the lights go off cannot see any of that.

That is what the sensor is for. Put it where the food actually sits, and let it watch the building after everyone has left. In the morning, the trace comes before the prep list. If the unit stayed in range, the food can be used. If it did not, the food decision comes first, and it gets written on the alert rather than discovered halfway through portioning.

Paper is a reasonable backup for a check someone is standing there to make. It is the wrong tool for a closed kitchen. Checkit covers the hours the log pretends did not happen.`,
  },
  {
    title: 'Take the temperature before the delivery hits the shelf',
    excerpt: 'A receiving check only counts if it is the food, it happens before the product is put away, and the number is somewhere other people can find it.',
    openings: [
      'The poultry came off a truck that had sat on the dock with the door open. The boxes were sweating. They were also already on a speed rack by the time anyone thought about a thermometer.',
      'The invoice was signed at the desk, and the temperature was written afterward from memory. It matched what the driver had said. It did not match the case of milk.',
      'The driver was in a hurry, the walk-in was two turns away, and the delivery went straight onto the shelf. The check became something the team meant to do.',
      'The box felt cold, which is what boxes feel like when they have been in a truck. Nobody opened it. The product inside had a different opinion.',
    ],
    body: `Probe the food, not the air in the truck and not the outside of the carton. Refrigerated product should be at 41°F or below before it joins food you already trust. With a Checkit probe the reading uploads as it is taken, so the accept-or-reject decision sits with the delivery instead of on the back of an invoice purchasing will never open.

If it is warm, do not slide it into the cooler to see if it comes down. A warm case pulls the unit out of range and warms what was already stored. Refuse it, or quarantine it, and write the reason in a sentence a buyer can understand next week.

The person who signs for the delivery should be the person who took the temperature. Those two jobs drift apart easily, and the record gets worse every time they do.`,
  },
  {
    title: 'When the hot hold quietly gives up',
    excerpt: 'Below 135°F, the pan is no longer being held. It is waiting for someone to reheat it or throw it out, and the sensor is how you find that moment.',
    openings: [
      'The steam well had been switched on late, loaded anyway, and the sensor never reached a holding temperature. Service started on food that had not actually gotten hot.',
      'Dinner ran long. The last pan sat, unstirred, while the line dealt with the board. By the time anyone looked, it had slipped under the line it was supposed to hold.',
      'A holding cabinet door stayed open between tickets. The food had gone in hot. It did not stay that way, and the first plates were already going out.',
      'Someone refilled a pan by pouring fresh food on top of food that had already cooled. The top looked fine. The bottom was the problem, and it was about to be served.',
    ],
    body: `Hot food has to stay at 135°F or above. A number in the 120s is not close enough for the rest of service. Stir, take the temperature in the center of the food, and if it is under the line, reheat it to 165°F before it goes back to holding, or discard it. Do not rescue a cool pan by topping it up.

A Checkit sensor on the well or the cabinet is there so this is found before the pass, not after a complaint. The reading still needs a decision next to it: which pan, what you did, and who did it. If the same well alerts twice in a week, the history is telling you the equipment is the problem. Another reminder to "keep an eye on it" will not fix a well that cannot hold.

Check it before the first ticket. A cabinet that is merely switched on is not the same thing as a cabinet that is hot.`,
  },
  {
    title: 'Cooling fails in the gap after the pan leaves the stove',
    excerpt: 'The walk-in being cold does not mean the soup in the middle of a deep pan cooled on time. That clock is a separate record, and it is the one teams lose.',
    openings: [
      'The stockpot went into the walk-in with the lid on, still deep and hot. The room sensor barely moved. The soup in the center was another matter, and nobody was timing it.',
      'Cooling started properly, and then the cook got pulled to the line. The pan sat. The two-hour mark passed while everyone was busy doing the job they had been pulled to do.',
      'The shallow pans were in the dish pit, so the chili went into a deep hotel pan because that was what was clean. It looked handled. It was not cooling.',
      'The morning crew found a pot from the night before and had to decide whether to hope. The task that should have closed the question had never been finished.',
    ],
    body: `Under the FDA Food Code, food has to get from 135°F to 70°F within two hours, and from there to 41°F within four more. The first stage is the one that disappears, because once a pan leaves the burner it feels like someone has dealt with it. A walk-in sensor will confirm the room is cold. It will not confirm the center of the pan is.

Spread the food thin, leave it uncovered, and take a temperature at the start and again before the two hours are gone. Log those times. If it is still above 70°F when the first window closes, reheat it to 165°F and begin again, or throw it out. Giving it "a little longer" in a deep pot is how a whole batch gets kept on a wish.

Checkit can hold the clock if someone starts it. A cooling record with no start time is just a pot in a fridge.`,
  },
  {
    title: 'Check the thermometer before you trust the rest of the day',
    excerpt: 'Every temperature taken on the line depends on the probe being honest. An ice bath takes a minute, and it belongs in the record before service starts.',
    openings: [
      'The probe lived in a sanitizer bucket between uses, and nobody had checked it that week. It was the thermometer the whole line was using anyway.',
      'Two thermometers on the same station disagreed by four degrees. Both had been used that morning. Only one of them had any business being in a pan.',
      'A new opener picked up a dial thermometer that had been in the drawer since training. It looked official. It had never been checked on that shift.',
      'The only ice-bath check anyone could remember was from orientation. Since then the probes had been dropped, borrowed, and put back, and the record had not noticed.',
    ],
    body: `Fill a cup with ice and add just enough water to fill the gaps. The tip sits in the ice water, not on the bottom of the cup and not in your hand. A working thermometer reads 32°F, give or take a degree. If it does not, adjust it or take it off the line before it records a shift's worth of confident, slightly wrong numbers.

Do this before the board fills up, and log it in Checkit: which probe, what it read, and whether it stayed in use. If two probes disagree, trust the one that just passed and tag the other so the next person does not pick it up.

It is a small task. It is also the reason a later reading of 140°F means 140°F, which is the entire point of writing temperatures down.`,
  },
  {
    title: 'The air in the fridge and the food are different stories',
    excerpt: 'A display that says 36°F can sit next to a pan of turkey that is already too warm. The continuous record and the spot check answer different questions.',
    openings: [
      'The display said 36°F. A tray of sliced turkey by the door probed at 47°F. Both numbers were real, and only one of them was about the food.',
      'The sensor hung in front of the fan, in the coldest air in the box. It had been reporting a flattering temperature for months while the door shelf did something else.',
      'The team logged the digital readout every afternoon and never put a probe in a product. The log was immaculate. It was a log of the machine talking about itself.',
      'After a big delivery the sensor recovered in a few minutes. The food that had been sitting in the open door had not, and nobody checked it because the unit "was back."',
    ],
    body: `A Checkit sensor is the story of the unit across the day and the night. A probe is the food in front of you. They come apart after a delivery, a long prep, or a stack of hot pans, and an inspector who asks about the product is not asking about the air.

Put the sensor where the food actually sits, not in the blast from the fan, and use the probe for the spot check so that reading uploads next to the trace. Cold food still has to be at 41°F or below. If you only keep the sensor, you know the machine. If you only keep a clipboard number, you know one moment and you cannot prove the rest.

The useful record is both, in the same place, so a warm pan is not hiding behind a healthy-looking display.`,
  },
  {
    title: 'Write the corrective action the way you would want to read it',
    excerpt: 'The sensor already has the temperature and the time. The note is the decision. "Checked" is not a decision, and it ages badly.',
    openings: [
      'The log said OK next to a unit that had been alerting through breakfast. The temperature was in the history. The response was a word that could have meant anything.',
      'Someone wrote "adjusted" and went home. The next shift could see that something had happened. They could not see what had been moved, or whether it was safe to move it back.',
      'Three discards in a week had alerts and no product names. The food was gone. The reason was a rumor by the time the manager asked.',
      'The comment was a paragraph long and still left out the only fact that mattered, which the sensor had already captured and the note had managed to avoid.',
    ],
    body: `Checkit stores the degrees and the clock. What it needs from a person is shorter than people think: which food or which unit, what you did, and your name. "Moved the soup to the other walk-in and discarded the sliced turkey" is a note. "Checked fridge" is a shrug that will still be attached to a 52°F trace six months from now.

Write it during service, while you remember which pan. If the same unit collects the same sentence three times, stop polishing the comment and call someone about the machine. The history is already the case for that call.

A note that would confuse a stranger is not finished. The stranger, later, might be an inspector, or it might just be you on a Monday.`,
  },
  {
    title: 'Do not leave a warm unit as a rumor for the next shift',
    excerpt: 'Saying "the prep fridge was weird" on the way out is not a handoff. The next cook needs the reading, the food, and what is still unfinished.',
    openings: [
      'The afternoon lead mentioned, on the way to the car, that the prep fridge had been acting up. The alert was still open. The evening crew found it the way you find most rumors, which is too late.',
      'Food had been moved out of a warm unit. The incoming cook saw an empty shelf, assumed it was a mistake, and put the food back before anyone explained why the shelf was empty.',
      'Service had been "called." There was no ticket number on the action, and by the next morning nobody could say which company, or whether anyone was actually coming.',
      'The sensor was falling back toward range at shift change, so both crews decided it was handled. It started climbing again after the handoff conversation was over.',
    ],
    body: `If a unit ran warm on your shift, the handoff is part of the corrective action. Leave the current reading, what you moved or threw out, and whether a technician has actually been called. Leave it in Checkit. A sentence in the doorway will not survive the first hour of the next service.

Do not put food back because the air feels colder than it did. Probe it. Cold food is at 41°F or below, and if the sensor is still rising, that food stays in a unit that is holding. The next person should be able to open the alert and know what they inherited without calling you on your night off.

A handoff that depends on memory is how the same cooler becomes a surprise twice in one day.`,
  },
  {
    title: 'An open door will warm a reach-in faster than the team expects',
    excerpt: 'The food at the front moves first. A temperature sensor and a door sensor together tell you whether you have a habit or a failing compressor.',
    openings: [
      'Someone wedged the reach-in with a sheet pan so they could portion without using a hand on the door. An hour later the sensor had a story, and the pans at the front had a temperature.',
      'The door did not quite latch. The gap was small enough to ignore if you were busy, which everyone was. The contact sensor did not ignore it.',
      'On the line, the reach-in was opened for every ticket and not always closed between them. Each opening was "just a second." The seconds added up in the food.',
      'The gasket was split along the handle side. The door looked closed. It was not sealed, and the overnight trace had started to show the difference.',
    ],
    body: `A small reach-in dumps its cold air quickly, and the items in front, especially in shallow pans, are the ones that cross 41°F. Checkit can show the temperature climb next to the door. A sensor on the back wall can still look reasonable while that happens. If you also have a door contact, the two traces together are the explanation: a long open followed by a recovery is a door, and a climb with the door shut is a machine.

Close it between pulls. If prep needs the door open, take what you need and get out, then probe the food in front before you trust it. Food that has gone warm gets moved or discarded, and that action goes on the alert. A door that will not latch is not a quirk. It is a temperature problem you can see, and once the team knows the open door is recorded, the sheet-pan habit tends to end on its own.`,
  },
  {
    title: 'Some freezer alerts are defrost, and some are not',
    excerpt: 'A freezer is supposed to warm up on a schedule. The useful question is whether this spike looks like the ones before it, or whether it has started to last longer.',
    openings: [
      'The same freezer alerted every night around one, and it was back in range by three. The night lead had started clearing them in a stack, without opening a single trace.',
      'Everyone knew that unit "always did that." The phrase had been true for a year. It was also how a new, longer spike got the same shrug as the old ones.',
      'Defrost used to last twenty minutes. The history from the last two weeks showed it taking more than an hour to come back, and the food nearest the coil was soft.',
      'Product had been pushed against the evaporator. A cycle that used to pass unnoticed was now warming the boxes stacked in the airflow.',
    ],
    body: `Learn the shape of a normal night for that sensor. If Checkit shows the same rise and the same return, note it once so the next person does not treat a known defrost as an emergency. Do not clear a week of them without looking at how long they lasted. Length is the difference between a cycle and a failure.

When the spike runs long, or the product itself is soft, it is no longer routine. Check the coil for ice, make sure boxes are not blocking the air, and send the trace with the service call. A technician can debate a story. The graph is harder to wave off.

An alert people have decided to ignore will still be ignored on the night it is telling the truth. The habit is the risk, not the defrost.`,
  },
  {
    title: 'A min/max thermometer forgets the night you needed',
    excerpt: 'The needle can tell you an extreme happened. It cannot tell you when, or for how long, or what anyone did. Resetting it throws away the only clue.',
    openings: [
      'Every morning someone reset the min/max before writing anything down. The clinic fridge always looked fine at the start of the day. The night was erased with the needle.',
      'The minimum showed 1°C. That could have been ten minutes or ten hours, and the difference was the entire question about whether the vaccines were still usable.',
      'Staff wrote the current temperature twice a day, which was usually a comfortable 5°C, and never looked at the minimum sitting underneath it.',
      'The night shift cleared the thermometer so the day shift would not walk into an alarm. They succeeded. The day shift walked into a fridge with no memory.',
    ],
    body: `Vaccine and medication refrigerators are generally kept between 2°C and 8°C. A min/max thermometer can show that the range was broken. It cannot show the shape of the break, and the moment someone resets it, even that clue is gone.

A sensor keeps the overnight trace and can alert a person before the morning routine wipes the slate. If all you have today is the needle, write the minimum and maximum down before anyone touches them, then quarantine the product. Whether it can be used is a clinical decision. It is not a decision a cleared dial gets to make.

A reading of 5°C at 8 a.m. does not repair the night. Checkit is how that night stays visible long enough for the right person to see it.`,
  },
  {
    title: 'Put the sensor where the fridge is actually warm',
    excerpt: 'The coldest air in a unit is a flattering place to measure. The warm spot is usually the door, the top shelf, or the front of a fridge someone has packed full.',
    openings: [
      'The probe had been hanging in front of the fan since installation. It reported a beautiful temperature. The milk, which lived on the door, did not.',
      'The top shelf was packed to the ceiling and almost never opened. Nothing was measuring it. That was also where the oldest product had ended up.',
      'Vaccines sat in the door rack because it was easy to reach. The sensor was on the back wall, in the part of the fridge nobody was using.',
      'When the new unit arrived, the magnet went wherever it stuck. Nobody compared it to a probe in the food. The alert was honest about the wrong spot.',
    ],
    body: `Every fridge has a place that runs warmer than the rest. That is where a Checkit sensor earns its keep. Compare it, for a day, to a probe in the food at that spot. If they disagree, believe the food and move the sensor. A reading taken in the discharge air tells you the compressor is trying. It does not tell you the product is safe.

Do not let the next delivery bury it. If the shelving changes, or something more sensitive moves to a new place, look at the placement again. An alert is only as good as the air it is sitting in.

Cold food still has to hold at 41°F or below in the warm spot, not in the most generous corner of the box.`,
  },
  {
    title: 'If the food is being held on time, the time has to be real',
    excerpt: 'Time instead of temperature only works when the start and the discard are written down and then obeyed. A whiteboard that gets wiped is not that system.',
    openings: [
      'Pizza sat on the screen through a slow hour with nothing on it to say when it had landed there. It looked like it belonged. The clock did not exist.',
      'A catering tray left the kitchen hot, and the start time stayed on a whiteboard in the pass. By the time the tray was on the buffet, the whiteboard had been erased for the next ticket.',
      'The pan had a time on it. Then someone topped it up from a fresh batch and left the old time in place, which now described food that had not been there.',
      'Trays came back from an event and went into the walk-in because they still looked all right. Nobody could say how long they had been between temperatures.',
    ],
    body: `Holding food on time, rather than on temperature, is a specific method with a written procedure. It is not a name for food that happens to be sitting out. The pan needs the moment it left cold holding, at 41°F or below, or hot holding, at 135°F or above, and it needs the time it has to be gone. When that time arrives, the food goes. It does not get slid into a monitored cooler and saved.

Put the clock in Checkit so it travels with the food and so a fresh batch cannot inherit an old one. Topping up a pan resets nothing. It contaminates the only record you had.

The sensors in the kitchen will not cover a buffet or a pass. If the time is not written down, you are not using time as a control. You are hoping.`,
  },
  {
    title: 'Look at the night before you start the prep',
    excerpt: 'The overnight trace decides whether yesterday\'s food is still an ingredient. Starting the list before anyone opens it means the menu is already a bet.',
    openings: [
      'The prep cook was portioning before the manager had finished unlocking the office. The overnight alerts were still sitting, unread, on a phone in a jacket.',
      'A unit had alerted at three in the morning. The first recipe of the day used food from that unit, because the recipe was at the top of the list and the alert was not.',
      'Yesterday\'s soup came out for service while the sensor history was still unopened. It might have been fine. Nobody had checked the only record that knew.',
      'On the opening list, "start prep" came before "check the coolers." The order was a small thing. It was also why the check kept happening after the food had already been handled.',
    ],
    body: `Open Checkit before anything moves. The sensors either stayed in range or they did not. If they did, probe what you plan to use and get on with the work. If a unit left its range, that food is not automatically an ingredient. Decide, write the action, and only then start portioning. Once it is mixed into something else, a discard becomes a much larger mess than it needed to be.

Put the sensor review first on the opening list, ahead of the recipes. A check that happens after twenty pans are done is a record of a decision you already missed, which is not really a check.

If the same unit is warm at the start of the day more than once, the list is no longer the remedy. The history is a reason to call for service.`,
  },
  {
    title: 'Have the last two weeks ready before anyone asks',
    excerpt: 'Inspectors start with temperatures, what you did about the bad ones, and whether the story makes sense. A complete binder full of identical numbers often does not.',
    openings: [
      'The binder was full. Every line said roughly the same temperature, written in the same hand. The sensor in the same cooler told a less tidy story, and that was the one with the variation.',
      'An inspector pointed at a walk-in and asked for the last two weeks. The team knew the records existed. Finding them took long enough to feel like they did not.',
      'Something had been thrown out on a Thursday. The alert was there. The reason was not, so the discard looked, on paper, like it had never been decided by anyone.',
      'Today was easy to open in the app. Last Tuesday took a search. Inspections have a way of being about last Tuesday.',
    ],
    body: `What you want within reach is recent sensor history and the actions that followed it. Cold food at 41°F or below, hot food at 135°F or above, and a plain account of what happened when a number was off. An inspector is looking for a pattern that a person could believe. Missing days, and comments that say nothing, are patterns too.

Checkit should show who was alerted, when the unit left range, and what was done. If a technician came, that note belongs on the same unit, because it is the explanation for the spike. The last few weeks matter more than a perfect archive from last year.

Pull them once, before you need them, and see whether the story holds. If it does not hold for you, it will not hold for anyone else.`,
  },
  {
    title: 'When the power returns, the food does not reset with it',
    excerpt: 'The lights coming back on are not a decision. The trace tells you how long the unit was out, which is the fact you need before anything goes back into service.',
    openings: [
      'The power had been off overnight and the walk-in door had stayed shut, which felt reassuring and was not, by itself, an answer about the food.',
      'A short outage hit during service. Pans stayed on the line because restarting the kitchen felt more urgent than measuring anything.',
      'The generator covered the dining room. It did not cover the walk-in, and for a while nobody realized those were different buildings, electrically speaking.',
      'A freezer had partially thawed. Staff closed it again and meant to refreeze whatever still looked frozen, which is a guess about ice crystals they had not actually checked.',
    ],
    body: `Leave the door shut until you are ready to look. Then read the Checkit trace for when the gap started and when it ended, and probe the food rather than the air. Refrigerated food above 41°F has to be judged by how long it sat there and what it is. Frozen food that still has ice crystals, and that stayed at or below 41°F, can often go back. Food you cannot time should not return to service because everyone is tired and the dining room is full.

Write the window, the temperatures, and what you discarded on that alert. The sensor is what turns "it was off for a bit" into a start and an end.

Do not solve a warm case by wedging a fresh delivery in front of the old product and calling the morning recovered.`,
  },
  {
    title: 'A thermometer you skipped will be wrong with confidence',
    excerpt: 'Once service starts, every probe reading inherits the calibration you did not do. The task takes a minute. The shift it protects is the rest of the day.',
    openings: [
      'The ice was gone by the time the first ticket printed, so the calibration task was skipped with the intention of doing it at a lull that never arrived.',
      'A thermometer hit the floor, got rinsed, and went straight back into a pot of soup. The drop was the moment it should have been checked, and it was the moment nobody had time.',
      'Closing was supposed to have calibrated the probes. Opening assumed that had happened. The app, which had the task still open, was not consulted by either shift.',
      'Three probes were on the line. One of them had a passing check sometime in the last month. The other two were just thermometers people liked.',
    ],
    body: `Keep ice at the station, or make the ice bath the first thing in Checkit before the board fills. Tip in the ice water, looking for 32°F, and record which probe passed. If service is already moving and a thermometer was just dropped, or it disagrees with another, stop using it. A bad probe does not announce itself. It quietly shifts every hot-holding and cooling decision on that station by a few degrees, and the record looks normal while it happens.

If you have more thermometers than anyone can check, you have too many on the line. A probe that will not calibrate is broken. Log that, so it does not wander back into a drawer and out again tomorrow as if it were new.`,
  },
  {
    title: 'The weekend is when a small cooler problem becomes a Monday one',
    excerpt: 'Friday is the last time the usual person looks. If the alert has nowhere to go after that, Sunday happens without anyone, and Monday inherits the food.',
    openings: [
      'Friday\'s list was skipped because the closer was short. The sensor alerted into a phone that was in a jacket, in a car, on the way home.',
      'The unit had been a degree warmer every afternoon for two weeks. Each day still passed. Nobody opened the week view, so the slope was invisible one reading at a time.',
      'Saturday\'s crew knew the cooler. They did not know who was supposed to get the alert, or what they were allowed to throw out if it fired.',
      'Monday prep started on food that had sat through an unwatched Sunday. The sheet from Friday was the newest piece of paper in the building.',
    ],
    body: `Before you leave on Friday, look at the week, not only at the last number. A sensor creeping up every afternoon is a gasket, a coil, or a door that gets propped when the kitchen is busy. Leave a named person on the weekend alert, and leave the service number on the unit in Checkit rather than in a contact list on one manager\'s phone.

Monday begins with that weekend history, then a probe of anything you mean to prep. Cold food is still 41°F or below. If there is no weekend data, treat the food with less confidence, not more. A skipped Friday is a decision to be surprised on Monday, and the alert routing is the part you can still fix before the door locks.`,
  },
  {
    title: 'The kitchen you did not walk is the one that needs the dashboard',
    excerpt: 'Multi-site problems rarely show up in the building you visited yesterday. They show up as a site that has gone quiet.',
    openings: [
      'Five sites sent in their checks. One of them had been writing the same temperature for two weeks, and the sensor in that fridge did not agree with a single one of those numbers.',
      'There was a café fridge inside a larger building that had never been given a sensor, because it did not feel like a real site until the day it was the problem.',
      'The site manager went on leave. The checklists stopped the same day, which told you more about the system than a month of perfect scores had.',
      'An alert at a distant site went to a mailbox. On Sunday the mailbox was closed, and so, effectively, was the response.',
    ],
    body: `Open the dashboard and look for the site you have not heard from. A missing day is more informative than a column of identical 38°F readings. Someone should be able to see every monitored unit without waiting for a photo of a clipboard to arrive by email.

Send alerts to a person who is actually working at that site that day, and to someone else who will notice if the first person does not act. When the same site keeps missing tasks, the remedy is coverage and a sensor, not a firmer message. Messages are how headquarters stays comfortable.

The warm fridge will be at the location the report has been quiet about. Checkit is only useful there if someone is willing to look at the quiet sites first.`,
  },
  {
    title: 'The alerts people have learned to clear without reading',
    excerpt: 'A notification that cries wolf every night will be swiped away. The night it is right, it gets the same swipe, because that is what the team has been trained to do.',
    openings: [
      'The freezer alerted on every defrost, and the night lead had started clearing them in bulk at the end of the shift. Opening the trace was no longer part of the gesture.',
      'The threshold was tighter than the unit could hold on a delivery day. By the third week, "it always does this on Tuesdays" had become the official interpretation.',
      'Ten people received every alert. Each of them assumed one of the other nine had it, which meant the alert was everybody\'s and therefore nobody\'s.',
      'The sound in the office had been turned down because it interrupted meetings. The meetings continued. So did the cooler.',
    ],
    body: `An alert that people ignore is not a safety system, however many sensors are behind it. Set the threshold so it means food moving out of range, not a door that was open for a minute you already understand. A known defrost can stay visible in the history without paging the entire company.

One person should own the response, with a backup if they do not act. Once a week, look at which units alerted and which of those were real. Retire the noisy rule or repair the equipment. Adding another name to a tired list does not create a reader.

If clearing the notification is easier than understanding it, the setup has already failed, and Checkit is recording the habit along with the temperatures.`,
  },
  {
    title: 'Someone has to get the alert when the manager is off',
    excerpt: 'A phone that belongs to one person is a plan for the days that person is working. Nights and weekends need a second name, and a definition of what answering means.',
    openings: [
      'The manager\'s phone was off for the weekend, which was a reasonable way to spend a weekend. The walk-in alerted at midnight anyway, to a phone that was not going to move.',
      'The alert went to a group. Everyone saw that everyone else had seen it. Nobody drove in, because the presence of the group felt like coverage.',
      'A supervisor had left two months ago. The alert still knew their number. The person who had replaced them had never been added, and did not know they were supposed to be.',
      'Escalation was an email to a shared inbox. The inbox was read on weekday mornings. The compressor did not keep weekday hours.',
    ],
    body: `Name two people on the Checkit alert, and decide what counts as an answer. Opening the notification is not it. An answer is a check, food moved or discarded, or a real call for service, written on the alert so the next person can see it happened.

If the first person does not act, the second should hear about it without anyone having to forward a text. Review the list when shifts change. A number for someone who no longer works there is a common reason a freezer runs until morning.

Test the path on a quiet afternoon. You would rather find the gap then, with the kitchen still calm, than on the night a compressor stops and the only phone that knows is face down in another town.`,
  },
  {
    title: 'Check the bucket while you are already checking the coolers',
    excerpt: 'Sanitizer and temperature fail in the same window, at the start of service, when both are easy to mean to do. Put them on the same walk or one of them will be skipped.',
    openings: [
      'The sensors had been reviewed and the sheet felt done. The sanitizer bucket had been mixed by eye, which is a method that works until the day someone tests it.',
      'The strips were in a drawer the morning crew did not open. The task asked for a photo. The photo never happened, and the bucket went to the line anyway.',
      'One bucket sat through a whole service and was never changed. It had been correct at ten. By two it was water with a memory of being correct.',
      'The number written down was the concentration someone had intended to mix. The strip, which was still in the packet, had not been invited to the record.',
    ],
    body: `Do the sanitizer test on the same Checkit round as the sensors, while you are already walking. The strip tells you whether the bucket is in the range printed on the bottle, not whether the pour looked right. If it is weak or too strong, remake it and record the new reading. A bucket left out all service will not stay at the strength it had at the start of the day.

A check that requires a separate trip to the office will happen when an inspector is in the building and not on an ordinary Tuesday. Keep the strips at the station.

The sensors will not notice a weak bucket. The task will, if it is standing in the same path as the thing the team already refuses to skip.`,
  },
  {
    title: 'A cold pan can still be too old to use',
    excerpt: 'The sensor can tell you the food is cold. It cannot tell you the food should still be there. The labels are the other half of the walk.',
    openings: [
      'Pans went into the walk-in without dates because the cook was coming straight back for them. Then the cook did not come straight back, and the pans became anonymous.',
      'Two half-pans were combined to save a shelf, and a fresh label went over the old one. The date now described the newer food. The older food was still in the pan.',
      'Prep from two different days ended up in one container with today\'s sticker, which is an honest-looking way to lose track of the clock.',
      'The sensor was comfortably in range. Half the pans were past the day the site uses. Cold, and done.',
    ],
    body: `When you walk a cooler, read the labels in the same look as the temperature. Food at 41°F or below can still be old. The label should say what it is and when it was made or opened, in a form the next shift does not have to decode.

Do not put today\'s date on a pan you combined with yesterday\'s. The older food sets the time. If a pan has no label at all, the walk is not finished until it has one or it has been thrown out, and the discard is written down so the missing pan has an explanation.

A sensor will never catch an unlabeled container. A person walking the shelves will, which is why the Checkit task has to include the shelves and not only the number on the screen.`,
  },
  {
    title: 'Ice in the well is not the same thing as cold food',
    excerpt: 'A pan can sit in a cold well and still be warm at the top. The fridge sensors do not measure the line. A probe during service does.',
    openings: [
      'By noon the salad-bar ice had melted to the rim and the pans were standing in water. They looked seated in the well. The food at the surface was the temperature of the room.',
      'Pans were nested up above the ice line so more items would fit. The bottoms were cold. The tops, which are the part people eat, were not.',
      'A backup pan waited on the counter because the well was full. It waited through the rush, which is a long time to be a backup.',
      'Someone packed fresh ice around a pan that was already warm and left it there, as if ice were a corrective action rather than a prop.',
    ],
    body: `Cold holding on ice still means the food itself is at 41°F or below. Checkit sensors on the fridges do not reach a pan on the pass. Probe the top of the food while service is running, and log it. A well that looks busy can be a warm well with ice somewhere near it.

Refresh the ice before the rush, not after the tomatoes have spent an hour in meltwater. If a pan is over 41°F, replace it from a unit that is in range and record the swap. Do not ice a warm pan and walk away.

The spare pan belongs in a monitored refrigerator until the moment it takes the place of the one on the line. "Backup" is not a holding method.`,
  },
  {
    title: 'A walk-in will cool food only if you let it',
    excerpt: 'The room being cold is not the same as the pan cooling on time. Without a blast chiller, the method is shallow pans, no lids, and a clock someone actually starts.',
    openings: [
      'A deep pan of chili went onto a speed rack with the lid on, because that was how it had left the stove. The walk-in was 38°F. The chili was not in any hurry.',
      'Hot stock was parked next to raw chicken "just until it cooled," inside a unit the sensor was watching. The sensor watched the room get worse.',
      'Three pots went in at the end of the night. The walk-in trace started to climb, and everything that had been fine an hour earlier was now sharing a box with a lot of heat.',
      'The blast chiller had been the thing that used to record cooling. It was gone. The habit of writing a start time had left with it.',
    ],
    body: `Cooling still has a clock: 135°F down to 70°F in two hours, then to 41°F in four more. Spread the food in shallow pans, leave the lids off, and give it shelf space so air can move. Probe the center and write the times down. A sensor reading of 38°F is news about the room. The pan can be hot in a cold room for a long time.

Watch the unit while you do it. Enough hot food will pull the walk-in out of range and warm what was already stored, which is a second problem created by trying to solve the first. If the trace starts rising, there is too much heat in a box Checkit is there to protect.

Start the task even when the process feels informal. Informal is how the two-hour mark passes without anyone noticing it was a deadline.`,
  },
  {
    title: 'A cold cooler can still be stored dangerously',
    excerpt: 'Temperature and storage order fail independently. The door is already open for the sensor check. That is the moment to see what is sitting above what.',
    openings: [
      'Raw chicken was on the shelf above the prepared salads. The sensor was happy. Gravity was not interested in the sensor.',
      'A delivery had been pushed onto the nearest rack during the unload and never moved again. The nearest rack was the wrong one, and it stayed wrong for the rest of the week.',
      'Ready-to-eat pans shared a speed rack with meat that was thawing. Both were cold. That was the only thing they should have had in common.',
      'The cooler was reorganized the week of an inspection and cluttered again by Thursday. The task did not ask anyone to look up, so nobody did.',
    ],
    body: `While the door is open, look at the shelves and not only at the reading. Raw food goes below food that will not be cooked again, so nothing drips onto something you will serve as it is. A temperature of 38°F does not catch a drip. Checkit will report a safe sensor on an unsafe shelf unless a person is asked to see the shelf.

Move it then, and note it the way you would note a warm pan. If the rack is too full to see the order, it is too full to be safe, and it is probably blocking the air the sensor depends on. Those two problems travel together more often than people admit.

The sensor covers the temperature. The task covers everything the sensor is not built to see.`,
  },
  {
    title: 'One good afternoon reading can hide a bad week',
    excerpt: 'A single in-range check can be a healthy fridge or a fridge that spends every night too warm. The shape of the week is the record that tells them apart.',
    openings: [
      'Every afternoon check passed. Every overnight trace did not. The daily sheet, which was the only thing anyone read, described a unit that did not exist at 3 a.m.',
      'After catering weekends the reach-in ran a little closer to the limit. Each week the change was small enough to shrug at. The month was not small.',
      'On the day a manager visited, the fridge looked fine, because that was a Tuesday afternoon. The other six days were in the history, unopened.',
      'A gasket was replaced on a Thursday. Nobody looked at Friday night or Saturday night to see whether the spike had actually stopped.',
    ],
    body: `Read the week in Checkit, not only today\'s number. A flat line inside the range is a unit doing its job. A line that touches the limit every afternoon, or jumps every night, is a unit on the way out. One passing probe will not show the slope, which is why a daily sheet can stay cheerful while the equipment declines.

After a repair, look at the next two nights on that sensor. The work is done if the spike is gone, not if the technician said it was. Cold food still has to be able to stay at 41°F or below at three in the morning, which is a stricter test than a reading taken while the kitchen is staffed.

If you only keep the daily number, you have built a record that hides the failure the sensor was installed to catch.`,
  },
  {
    title: 'The first check of the day is the one that counts',
    excerpt: 'Overnight alerts are the permission to cook. Food pulled for prep before anyone reads them is a bet the sensor may already have lost.',
    openings: [
      'The first person in turned on the ovens and pulled proteins in the same minute. The app was still in a coat pocket. The proteins were already on a board.',
      'A sensor had gone offline overnight. Prep started because the food felt cold to a hand, which is not a thermometer and has never been one.',
      'The alerts were on a phone, and the phone was on a desk in the office, and the office was not where the food was.',
      'Someone did complete the review. They did it upstairs, after the downstairs team had already started the list the review was supposed to authorize.',
    ],
    body: `Walk the sensors before the food moves. Each unit either came through the night or it did not. At or below 41°F, what you probe can go into prep. Above that, stop before it is portioned, sauced, or folded into a recipe you can no longer throw away cleanly. A blank sensor is a failed check, not a pass you are allowed to assume.

This is slower than starting straight in on the list, by about ten minutes. It is faster than a wasted prep, and the alerts are already sitting there. Someone has to read them while the decision is still cheap.

If the team treats the opening review as paperwork that follows the cooking, the review will always be late, and Checkit will have a perfect record of warnings nobody used.`,
  },
  {
    title: 'Closing checks describe the easy part of the night',
    excerpt: 'A completed closing list proves someone was careful while the kitchen was still staffed. It does not prove the food stayed cold after the door locked.',
    openings: [
      'The closer probed every unit, submitted the list, and locked up. The door contact on the walk-in showed it had not latched behind them.',
      'Hot pans went into the walk-in after the closing temperatures had already been sent. The list was accurate about a moment that was already over.',
      'Closing was finished at eight because that was when the list was due. The last event in the building ended at eleven, and the cooler was opened again after the record had closed.',
      'The closing checklist was perfect. At 1 a.m. the sensor alerted, which made the checklist a description of a different night than the one the food had.',
    ],
    body: `Take the closing readings. Then assume they have already expired. Doors get reopened for a late pan, seals fail when the building goes quiet, and hot food has a way of arriving after the list is done. If you add anything to a cooler after the check, that check is over for that unit.

You will not stay to watch the night. The sensor will. Looking at the trace in the morning is the real end of the previous day, and it belongs at the top of the opening work rather than as an afterthought once prep is underway.

A finished checklist is evidence of care at ten o\'clock. The Checkit history is evidence of what the food did after that, which is the question the food itself cares about.`,
  },
  {
    title: 'Delivery day is harder on a cooler than the cooler admits',
    excerpt: 'The door is open longer, the dock is warm, and a new stack of product can hide the sensor. The afternoon spike on those days is a pattern, not a personality.',
    openings: [
      'Three vendors arrived in the same hour. The walk-in door barely had time to close, and the temperature trace spent the afternoon recovering from a visit it had not been designed to enjoy.',
      'A pallet sat on the dock while the invoice was checked in the office. The dock was warm. The invoice was not the thing that needed a thermometer.',
      'The new delivery was stacked in front of the sensor, which then spent the week measuring cardboard. The food behind the cardboard was on its own.',
      'Every Tuesday ran warmer than every other day, and the team had started to expect it. Tuesday was delivery day. Expecting it had become a substitute for changing it.',
    ],
    body: `Bring product in so the door is open in short stretches, not as a standing invitation. Probe it before it goes onto the shelf, at 41°F or below if it is refrigerated, and log the reading. Do not leave it on a hot dock while someone looks for a pen.

After the load is in, look at the sensor rather than only at the paperwork. Give the unit time to come back, and check that the food which was already there did not get pulled warm along the way. If the stack buried the sensor, move the sensor back to the warm spot. A probe behind boxes is not monitoring the fridge.

If one day a week is always the warm one, that is a door-open problem you can schedule differently. Checkit will show you the day. It will not rearrange the vendors.`,
  },
  {
    title: 'A new fridge has to earn the setting on its dial',
    excerpt: 'New equipment does not get a pass for being new. The first week is when you learn where it runs warm, and you set the alert from the food rather than from the brochure.',
    openings: [
      'The display was set to 34°F on the day it was plugged in. Nobody had probed the food. The number on the panel was treated as a promise.',
      'The unit was filled to the ceiling before anyone knew whether air could move. The sensor ended up describing a wall of product rather than a working fridge.',
      'The sensor was still in the box. The team ran a paper log "until it was installed," and the until lasted longer than the first warm night.',
      'The alert limits were copied from an older model that ran colder. The new fridge tripped them on an ordinary afternoon and taught the team, immediately, to distrust the alert.',
    ],
    body: `For the first week, probe the door, the top shelf, and the middle of a normal load, and compare those readings with the Checkit sensor. You want the warm one at or below 41°F after the door has been shut for a while. Set the alert from what you measured, not from the figure on the sales sheet.

Do not pack it solid until you know the air moves. Install the sensor before the food depends on it. A few days of paper as a backup is reasonable. Skipping the overnight record because the install is "almost" done is how the first failure happens off camera.

If it cannot hold through a normal service, that conversation is with the warranty. The decision about the food, written on the alert, is a separate conversation and it should not wait for the other one.`,
  },
  {
    title: 'The temperature round has to survive a sick day',
    excerpt: 'If only one person knows how the checks work, then on their day off the checks do not exist. The list and the alert names are what make the round real.',
    openings: [
      'The opener called in sick, and the sensor review became something for the afternoon, which is a polite way of saying it belonged to no one.',
      'The real instructions lived in a notebook in a locker. The task in the app said "check temps," which a new person can read and still not know which door to open.',
      'A temporary cook could see a list of units. The names did not match anything written on the fridges, so the list and the kitchen were two different buildings.',
      'The alert still went to the person who was not in the building. The person who was in the building did not know an alert had been sent.',
    ],
    body: `The round should be a Checkit list of units a stranger can find, with the same names that are on the doors. It should say what good looks like: cold food at 41°F or below, hot food at 135°F or above, and who to call if a sensor is out. Alerts go to the person actually working, and to a backup who will notice silence.

If you want to know whether this is true, ask someone who does not usually open to walk it once. Every unit they cannot find is a unit that will be skipped the next time the usual person is out. A checklist with a single owner is a single point of failure that happens to have a login.

The sensor will still record the night. The point of the task is that a person who was not there yesterday can still do something about it today.`,
  },
  {
    title: 'Say what happened to the food',
    excerpt: 'The sensor has the temperature. The corrective action is a verb: moved, discarded, reheated, called. "Monitored" is not one of those verbs.',
    openings: [
      'Rice had been found at 50°F. The comment said it was being kept an eye on, which meant it was still in the pan and the eye had moved on to something else.',
      'The walk-in had left its range and the note said the problem was handled. Handled did not say whether the milk was in another fridge or in a bin.',
      'Food had been thrown out. Purchasing saw a short count at the end of the week and had no alert, and no product name, to explain it.',
      'The same comment was copied forward for seven days on the same sensor. It had stopped being a decision and become a signature.',
    ],
    body: `Write the sentence you would want if you were reading it next month. Moved the soup to the other walk-in. Discarded the sliced turkey. Called service and kept the ticket number. Checkit already knows the degrees and the time. You are adding the fate of the product, which is the part a sensor cannot see.

"Monitored," "aware," and "adjusted" do not say whether anyone can eat the food. If you cannot say what happened to it, the action is not done, however closed the notification looks.

When the same verb lands on the same unit all week, the comment is no longer the work. The machine is. The history is the reason the call gets made, and it is a better reason than another Monday of the same sentence.`,
  },
  {
    title: 'A door that was open for a minute is not a ruined fridge',
    excerpt: 'Air temperature jumps the moment a door opens. Food follows only if the opening was long. The length of the spike is the fact worth acting on.',
    openings: [
      'Someone probed the air the second the delivery door shut and wrote down 55°F, ready to empty the shelf. The sensor was already on its way back down.',
      'A brief spike cleared in three minutes. A well-meaning closer discarded a shelf of food that had never left a safe temperature, because the alert had been loud and the trace had not been opened.',
      'Stocking took half an hour with the door open, and it was described afterward as "just a door." The duration, which was sitting in the history, was not "just" anything.',
      'The air sensor recovered. The milk in the door rack did not, and because nobody probed the door rack, the recovery on the screen was treated as the recovery of the product.',
    ],
    body: `Separate a short open from a real warm-up. If the Checkit trace blips and returns, and the door contact agrees the opening was brief, you do not need a dramatic discard. If the door was open for a delivery or a long prep, probe the food in the warm spot and write down what you find. Cold food above 41°F needs a decision. Cold air that comes back in a minute does not.

Write which of the two you had, so the next person does not throw out a fridge over a ten-second spike or ignore a twenty-minute one because the last alert was a false drama. The history already has the length. The note should match it.

The beep is only the invitation to look. The graph is the look.`,
  },
  {
    title: 'If you threw it out, write down what it was',
    excerpt: 'Food that disappears after a warm morning looks like waste, or worse, if nobody attaches the discard to the alert. The sensor already has the temperature. It needs the product.',
    openings: [
      'A case of cream was thrown out after a warm morning. The alert was cleared. The invoice still said the cream had been received, and nothing in the record explained the gap.',
      'The cook discarded a pan and the manager heard about it from the dishwasher, which is a long way around for a fact that should have been on the alert.',
      'The production sheet said the product had been used. It had been dumped. The two stories were the same number of portions and completely different events.',
      'Nobody wrote it down because a discard felt like something they would be blamed for. The sensor history ended in a cleared notification and an unexplained hole in the count.',
    ],
    body: `When food goes out because a unit left its range, the note should answer the next question without a meeting. What was it, roughly how much, and who decided. Checkit already has the temperature and the time. Purchasing, or the person who does the weekly order, should be able to see the discard without launching an investigation.

People skip this when throwing food away feels like a personal failure. Often it is a door, a gasket, or a compressor, and that pattern stays invisible if the product simply vanishes and the alert is closed with nothing on it.

A short line on the alert is also what you will want when someone asks why the cooler was short. The alternative is a story nobody can reconstruct by Friday.`,
  },
  {
    title: 'On the line, the temperature that matters is in the food',
    excerpt: 'The pan is hot. The well is hot. The edge of the soup is hot. None of those is the center, and the center is the number you are allowed to trust.',
    openings: [
      'A cook passed a thermometer over the top of a pan and called it 150°F. The gesture looked like a check. The tip had not been in the food.',
      'The probe touched the bottom of a metal pan and reported the well, faithfully. The food above that metal was cooler than the number that got written down.',
      'A thick soup was checked at the edge, next to the element, where soup is always warmest. The middle of the pan was the part that would actually be served.',
      'The line check happened before anyone stirred. The uploaded reading was the hot skin on top of a cooler center, and it looked like a pass.',
    ],
    body: `Put the tip in the center, stir first if the pan has a hot edge and a cool middle, and let the Checkit probe upload the reading so it does not have to be copied onto a sheet that will disagree with it later. Hot food needs to be at 135°F or above in that center. Cold food on a line needs to be at 41°F or below at the top of the pan, not only where it touches the ice.

Do not take the number off the metal. The pan is not the product. If the center fails, reheat to 165°F and bring it back, or replace the pan, and name the pan in the action. "The line" is not a place anyone can audit.

A check that never touches food is a walk past the station. It produces a feeling of having looked, which is not a temperature.`,
  },
  {
    title: 'A holding cabinet can be switched on and still be cold',
    excerpt: 'The light means the cabinet has power. The sensor means the food is hot. Those are different facts, and service should not start on the first one.',
    openings: [
      'The cabinet was turned on ten minutes before service and loaded immediately, because the light was on and the light had always been treated as ready.',
      'During cleaning, a dial had been bumped to a lower setting. The sensor knew before anyone tasted the food. The dial did not announce itself.',
      'Food went in genuinely hot. The cabinet could not keep it there, and the drop happened slowly enough that the first hour of service felt normal.',
      'One cabinet alerted almost every service. The team had started using it for the items they could most afford to lose, which is a repair strategy with no repair in it.',
    ],
    body: `Heat the cabinet before you ask it to hold anything, and trust the Checkit sensor rather than the switch. Then probe the food. Under 135°F, it is not being held. Reheat it to 165°F before it goes back in, or send something else, and write down which. Finding this before the first ticket is a much smaller problem than finding it at the pass.

If the same cabinet alerts every day, stop routing the most fragile items into it and get it fixed. Working around a sensor you have decided not to believe means you have accepted a cold pan as part of the menu. The pre-service reading should be a task someone has to complete, not a glow someone has to notice.

Power is not temperature. The rest of the kitchen already knows that about ovens. Holding cabinets deserve the same suspicion.`,
  },
  {
    title: 'Saturday does not suspend the refrigerators',
    excerpt: 'A weekend crew can run service without a manager in the building. They cannot run it without knowing who answers if a sensor leaves its range.',
    openings: [
      'The banquet kitchen ran Saturday with a crew that had never opened an alert. The alerts did not know that, and they fired anyway.',
      'The notification went to a phone that was in an empty office, on a desk, under a folder. The office was the wrong building for a Saturday.',
      'Sunday prep used food from Saturday, and nobody had opened the trace, so Sunday inherited whatever Saturday had decided not to look at.',
      'The emergency number for service was in a binder in a locked desk. The crew on the floor had the app. They did not have the desk.',
    ],
    body: `Before Friday ends, the weekend team should know which sensors are watched, what an out-of-range reading means for the food they will touch, and who answers if one fires. That second person does not have to be on site. They do have to pick up, and they need the authority to say the food moves or the food goes.

Put the service number on the unit in Checkit, which is the screen the crew already has open. A failure that waits for Monday office hours is a discarded walk-in with several extra steps and a worse smell.

On Monday, look at Saturday and Sunday on purpose, including the weekends when everyone says the building seemed fine. "Seemed" is what you say when nobody opened the history.`,
  },
  {
    title: 'The third alert on the same unit is a repair',
    excerpt: 'A repeat notification is not a request for a better reminder. It is the equipment saying the last reset did not fix anything.',
    openings: [
      'The same reach-in had alerted four mornings. Each morning someone adjusted a dial, cleared the notification, and felt that the day had been managed.',
      'A technician recharged the unit on a Wednesday. By the following Wednesday the overnight spike was back, and the closed work order was still closed.',
      'The team knew which fridge not to trust. They kept the less important food in it, which filled the good fridge and left the bad one in service indefinitely.',
      'The work order was closed because the temperature was fine while the technician was standing there, at 2 p.m. The failure had always been at 2 a.m.',
    ],
    body: `Count the alerts on that sensor. Three separate days out of range is no longer a surprise, and it should stop being treated as one. Call for service, and keep the food decision separate: anything above 41°F that you cannot account for does not stay in that box while you wait.

When the repair is finished, watch the next nights in Checkit. A reading taken while a technician is on site does not prove the overnight cycle is gone. If the spike returns, reopen the ticket and attach the trace. Moving the sensitive food into a different monitored fridge is a fair bridge. It is not a repair, and it fills the good unit faster than the week\'s plan assumed.

The history is the work order. Writing another "adjusted" on it is how a failing compressor gets a diary instead of a technician.`,
  },
  {
    title: 'Walk a new opener through the round once, at the units',
    excerpt: 'A new person cannot spot a drifting fridge from a screenshot. They need to see the sensor, the warm shelf, and the kind of note they are expected to write.',
    openings: [
      'On day one, a new hire was told to do the temps in the app. They submitted the sensor value for every unit, carefully, and never put a probe in anything.',
      'They cleared an alert because the button was there and the alert felt like something that needed to be gone. They did not know what the comment was for.',
      'Training had included a slide of the dashboard. It had not included a walk to the door where the warm milk actually lives.',
      'The task names and the labels on the fridges were close, but not the same. The new opener checked the units they could identify and skipped the ones they could not, quietly.',
    ],
    body: `Walk the round with them once, in the kitchen, with Checkit open. Show the warm spot, the difference between the sensor and a probe in the food, and a note that would be acceptable if the reading were bad. Cold food at 41°F or below. Hot food at 135°F or above. If they find something else, they need to know they are allowed to stop prep. That permission is the part of training people forget, and it is the part that matters.

Have them write one practice action while you are standing there. "Soup at 52°F, moved to the other walk-in at 6:05" is the whole lesson. A policy document is not.

A week later, read the actions they actually submitted. Training that never appears in the record did not take, however well the shift shadowing seemed to go.`,
  },
  {
    title: 'A fridge with two teams and no owner will not be watched',
    excerpt: 'When dietary and the kitchen share a cooler, each side assumes the other answered the alert. One name has to be on the sensor.',
    openings: [
      'The medication fridge also held staff food. Both groups believed the other group was responsible for it, which meant the sensor was admired by no one.',
      'Two departments shared a walk-in and each kept a partial list. Together the lists almost covered the unit. Separately, each looked like someone else\'s job.',
      'The alert went to a manager who did not work in that building. It was technically delivered. It was not practically received.',
      'Someone unplugged the unit to free an outlet and plugged it back in after lunch. The offline stretch was nobody\'s task, because the unit itself was everybody\'s.',
    ],
    body: `Put one name on the unit in Checkit. That person owns the check and the alert, even if other teams store things there. Other people can be backups. "Also kind of responsible" is the arrangement in which a sensor goes unanswered and both teams feel the other one failed.

Be clear about what the fridge is for. A medication refrigerator between 2°C and 8°C is not a place for unlabeled lunches, and a food walk-in is not a place for product that needs a different range. Two ranges in one box means one of them is wrong, and the sensor can only be set for one truth.

If two checklists exist, close one of them. Two partial records are harder to defend than a single history with a person\'s name on the alert.`,
  },
  {
    title: 'The sensor in the kitchen cannot see the buffet',
    excerpt: 'Food leaves the monitored building in a van, then sits on a table. Checkit only knows about that gap if someone records the temperature when it leaves and when it is served.',
    openings: [
      'Pans left a kitchen full of sensors, hot and accounted for, and then sat in a van with no cabinet and no one assigned to write anything down.',
      'The buffet was set early so photographs could be taken. The hold time started when the pans hit the table, which was not when anyone thought the event had started.',
      'Leftovers came back and went into the walk-in. The walk-in sensor looked fine, which said nothing about the hours the food had spent in between.',
      'The event lead thought the kitchen had logged the holding temperature. The kitchen thought the event lead had. The app contained neither.',
    ],
    body: `Record the temperature in Checkit when the food leaves and again when it is served. Hot food should still be at 135°F or above at the moment it is eaten. If the trip is long enough that you are using time instead of temperature, the start time has to travel with the pans as a task, and the discard time has to be a real time rather than a feeling that the event is over.

Do not bring warm leftovers back into a monitored cooler and treat the sensor there as absolution. If nobody knows how long the food was in the middle, the cleaner record is a discard with a reason. Name one person at the event who owns those readings.

A kitchen full of sensors is a good kitchen. It is not a record of a ballroom.`,
  },
  {
    title: 'A bad night in the fridge is a decision about the product',
    excerpt: 'Clearing the alert makes the dashboard look calm. It does not decide whether the vaccines, the samples, or the food can still be used.',
    openings: [
      'A clinic fridge spent the night at 10°C and was back at 5°C by the time anyone arrived. The morning reading was comforting. It was not the night.',
      'Samples sat in a unit that alerted while a door was being repaired. The repair got a work order. The samples did not get a decision.',
      'The food was kept because replacing it would have wrecked the week\'s food cost. The alert was cleared so the decision would not have to be looked at again.',
      'Someone cleared the notification before a visit so the dashboard would look quiet. The visit went well. The product question was still open, and now it was also hidden.',
    ],
    body: `Quarantine first. Leave the product where it is, or move it to a unit you have checked, and stop using it until someone with the authority to release or discard it has looked at the trace. For a vaccine refrigerator the range is generally 2°C to 8°C, and a morning reading back inside that range does not erase the excursion. For food, cold holding is 41°F or below, and the same principle applies.

Write what was inside and what was decided, on the alert. Checkit already has the start and the end if the sensor was running. "Cleared" is a description of a screen. It is not a description of the product.

If you do not know how long it was out, say so. An honest gap is a better record than a time somebody guessed in order to make the form look finished.`,
  },
  {
    title: 'Sometimes the compressor is fine and the door is not',
    excerpt: 'A fridge that holds all day and climbs all night is often a seal or a hinge. It looks, on a single afternoon reading, exactly like a machine that cannot keep up.',
    openings: [
      'A delivery cart caught the walk-in hinge, and the door has not sat right since. It still closes if you hip it. During service the temperature looks ordinary. After the building goes quiet, it does not.',
      'You could see a line of light through the seal if you stood in the right place. The overnight trace had started to agree with the light.',
      'Ice was building on one side of a freezer door the team had been complaining about without quite complaining. The sensor had been complaining more precisely.',
      'The unit held whenever people were around to shove the door, and it climbed after the last shove of the evening. That is a seal problem wearing the costume of a failing compressor.',
    ],
    body: `Before you condemn the machine, close the door on a strip of paper and pull. If the paper slides out along the seal, the gasket is not doing the job. Look for tears, flattened spots, and a hinge that lets the door sag. Those are cheaper failures than a compressor, and on a Checkit trace they look like a fridge that cannot keep up: in range while the kitchen is staffed, out of range once everyone has gone home.

Until it is fixed, probe the food near the door and do not keep the most sensitive product there. After the gasket or the hinge is replaced, look at the next two nights. The repair worked if the spike is gone. If the spike is still there, then you are looking at the machine, and you will know it with a trace rather than a theory.

A door that needs a hip to close is already a temperature incident. It is simply waiting for a quiet night to prove it.`,
  },
  {
    title: 'The number on the dial is not the safe range',
    excerpt: 'Setting a fridge to 35°F does not mean the food is at 35°F. Widening the alert until the phone goes quiet does not make a warmer fridge acceptable.',
    openings: [
      'The dial said 2. Nobody in the kitchen could say what temperature that was supposed to be, including the person who had set it.',
      'The alert was widened because the unit "ran a little high" on delivery day. The phone got quieter. The food did not get colder.',
      'A freezer setpoint was raised to save energy. The sensor showed the product softening over the following weeks, which is an expensive way to save on the electric bill.',
      'The display matched the setpoint exactly. The door shelf, which had no sensor on it, did not match either number.',
    ],
    body: `The setpoint is the instruction you gave the machine. The safe range is the limit for the product, and it is the thing a Checkit alert should protect. Cold food is 41°F or below. Hot food is 135°F or above. A typical vaccine refrigerator is 2°C to 8°C. A unit can be obedient about its own air and still miss those numbers in the food.

Set the alert inside the safe range, with enough room that a real drift reaches someone before the product is lost, and not so tight that every ordinary door opening becomes a page. If the only way to stop the noise is to widen the alert until it matches a weak fridge, the fridge is the problem. Moving the goalposts so the record looks calm is how the record stops being true.

Write the range on the unit, in degrees. A dial with no units is not a control, and it is not what the sensor is measuring.`,
  },
  {
    title: 'Write the note you would want to find in six months',
    excerpt: 'A graph shows that something happened. A sentence says what you did about it. Without the sentence, the graph is a picture of a problem and not a record of a response.',
    openings: [
      'The comment said "see me." The person who wrote it had moved to another station by the time anyone needed to see them, and the comment had become a dead end.',
      'The abbreviations made sense to the crew that invented them. They did not make sense to the inspector, who was reading Checkit without the benefit of that crew\'s dialect.',
      'The alert comment was blank because the real note had been written on paper, in a binder, in an office. The two halves of the record had never been introduced.',
      'The spike was obvious on the graph. The comment said "false alarm" and stopped there, which is what a shrug looks like when it is typed.',
    ],
    body: `Write for someone who was not on the shift. Use the unit\'s name as it appears in Checkit, and say what was decided in plain language. "Walk-in 2 reached 47°F at 1:12 a.m. The door was found ajar at 6:05. The milk and the cut melon were discarded. The gasket is torn on the hinge side. Service was called, ticket 4412." The sensor already drew the graph. The sentence is the response.

"False alarm" needs a reason: a known defrost, back in range within ten minutes, food probed at 39°F. Without the reason, it reads as indifference sitting next to a spike, and indifference is a hard thing to defend later.

Use the comment field. A beautiful trace with nothing written on it is half a record. Checkit can keep the temperatures forever. It cannot invent the decision you did not write down.`,
  },
  {
    title: 'The fridge usually warns you before it fails',
    excerpt: 'Units rarely go from fine to ruined in a single night. They run a degree warmer each week while every daily check still passes. The trend is the maintenance call.',
    openings: [
      'A fridge that used to sit at 35°F had settled at 40°F. Every daily task still passed. The pass line was 41°F, which meant the unit was one bad afternoon away from being the day\'s emergency.',
      'Defrost recovery had started taking longer than it did a month ago. Nobody had changed a setting. The machine was asking for help in the only language it has, which is time.',
      'On warm afternoons the compressor almost never rested, and the sensor showed the unit working harder for a worse result. The noise had become part of the kitchen.',
      'The cooks had started probing that fridge first, because they did not trust it. Nobody had written the distrust down, so it existed as a folk habit rather than a work order.',
    ],
    body: `Compare this week with last month, not only with the limit. A unit living at 40°F is not a unit with margin. Clean the coil, look at the gasket, and schedule service while the food is still safe. Waiting for the alert means waiting until the product is already the incident. The alert is the last notice, not the first.

How long defrost takes to recover tells the same story as a rising average. Write the drift down when you notice it. A work order is easier to justify with three weeks of a climbing Checkit line than with a single ruined morning and a theory about why it happened.

The sensor was put there to see this early. It will keep seeing it whether or not anyone opens the trend. The maintenance call still requires a person who is willing to look at last month before this morning becomes the story.`,
  },
];
