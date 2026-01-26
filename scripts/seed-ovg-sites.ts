// Seed script for OVG venues
// Run with: npx tsx scripts/seed-ovg-sites.ts

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sql = neon(process.env.DATABASE_URL!);

interface OVGSite {
  name: string;
  venueType: string;
  address?: string;
  city: string;
  state: string;
  zip?: string;
  country?: string;
  latitude: number;
  longitude: number;
  status: 'contracted' | 'engaged' | 'prospect';
  notes?: string;
}

// Major OVG venues with coordinates
// Status can be updated via API or database
const ovgVenues: OVGSite[] = [
  // ARENAS
  { name: 'Climate Pledge Arena', venueType: 'Arena', city: 'Seattle', state: 'WA', latitude: 47.6221, longitude: -122.3540, status: 'prospect', notes: 'NHL Seattle Kraken, first carbon zero arena' },
  { name: 'UBS Arena', venueType: 'Arena', city: 'Elmont', state: 'NY', latitude: 40.7200, longitude: -73.7200, status: 'prospect', notes: 'NHL NY Islanders home' },
  { name: 'Acrisure Arena', venueType: 'Arena', city: 'Palm Desert', state: 'CA', latitude: 33.7230, longitude: -116.3770, status: 'prospect', notes: 'AHL Coachella Valley Firebirds' },
  { name: 'Moody Center', venueType: 'Arena', city: 'Austin', state: 'TX', latitude: 30.2820, longitude: -97.7310, status: 'prospect', notes: 'University of Texas' },
  { name: 'CFG Bank Arena', venueType: 'Arena', city: 'Baltimore', state: 'MD', latitude: 39.2800, longitude: -76.6220, status: 'prospect' },
  { name: 'Addition Financial Arena', venueType: 'Arena', city: 'Orlando', state: 'FL', latitude: 28.6050, longitude: -81.2000, status: 'prospect', notes: 'UCF Knights' },
  { name: 'Alerus Center', venueType: 'Arena', city: 'Grand Forks', state: 'ND', latitude: 47.9180, longitude: -97.0350, status: 'prospect' },
  { name: 'American Bank Center', venueType: 'Arena', city: 'Corpus Christi', state: 'TX', latitude: 27.7980, longitude: -97.3970, status: 'prospect' },
  { name: 'Amica Mutual Pavilion', venueType: 'Arena', city: 'Providence', state: 'RI', latitude: 41.8300, longitude: -71.4150, status: 'prospect', notes: 'AHL Providence Bruins' },
  { name: 'Angel of the Winds Arena', venueType: 'Arena', city: 'Everett', state: 'WA', latitude: 47.9790, longitude: -122.1890, status: 'prospect' },
  { name: 'Blue Arena', venueType: 'Arena', city: 'Loveland', state: 'CO', latitude: 40.4400, longitude: -105.0150, status: 'prospect', notes: 'ECHL Colorado Eagles' },
  { name: 'BOK Center', venueType: 'Arena', city: 'Tulsa', state: 'OK', latitude: 36.1550, longitude: -95.9930, status: 'prospect', notes: 'ECHL Tulsa Oilers' },
  { name: 'Boss Ice Arena', venueType: 'Arena', city: 'Warwick', state: 'RI', latitude: 41.7140, longitude: -71.4320, status: 'prospect' },
  { name: 'Cable Dahmer Arena', venueType: 'Arena', city: 'Independence', state: 'MO', latitude: 39.0810, longitude: -94.3570, status: 'prospect', notes: 'ECHL Kansas City Mavericks' },
  { name: 'Enmarket Arena', venueType: 'Arena', city: 'Savannah', state: 'GA', latitude: 32.0490, longitude: -81.1040, status: 'prospect', notes: 'ECHL Savannah Ghost Pirates' },
  { name: 'Rupp Arena', venueType: 'Arena', city: 'Lexington', state: 'KY', latitude: 38.0440, longitude: -84.5000, status: 'prospect', notes: 'Kentucky Wildcats basketball' },
  { name: 'UPMC Events Center', venueType: 'Arena', city: 'Moon Township', state: 'PA', latitude: 40.5100, longitude: -80.2280, status: 'prospect', notes: 'Robert Morris University' },
  { name: 'Tyson Events Center', venueType: 'Arena', city: 'Sioux City', state: 'IA', latitude: 42.4880, longitude: -96.4000, status: 'prospect', notes: 'USHL Sioux City Musketeers' },
  
  // STADIUMS
  { name: 'Snapdragon Stadium', venueType: 'Stadium', city: 'San Diego', state: 'CA', latitude: 32.7810, longitude: -117.1190, status: 'prospect', notes: 'San Diego State Aztecs' },
  { name: 'Bell Bank Park', venueType: 'Stadium', city: 'Mesa', state: 'AZ', latitude: 33.4260, longitude: -111.8120, status: 'prospect', notes: 'Multi-sport complex' },
  { name: 'State Farm Arena', venueType: 'Stadium', city: 'Champaign', state: 'IL', latitude: 40.0990, longitude: -88.2360, status: 'prospect', notes: 'Illinois Fighting Illini' },
  { name: 'SeatGeek Stadium', venueType: 'Stadium', city: 'Bridgeview', state: 'IL', latitude: 41.7680, longitude: -87.8100, status: 'prospect' },
  
  // CONVENTION CENTERS
  { name: 'McCormick Place Convention Center', venueType: 'Convention Center', city: 'Chicago', state: 'IL', latitude: 41.8510, longitude: -87.6150, status: 'prospect', notes: 'Largest convention center in North America' },
  { name: 'Miami Beach Convention Center', venueType: 'Convention Center', city: 'Miami Beach', state: 'FL', latitude: 25.7930, longitude: -80.1330, status: 'prospect' },
  { name: 'Arvest Convention Center', venueType: 'Convention Center', city: 'Grand Junction', state: 'CO', latitude: 39.0660, longitude: -108.5510, status: 'prospect' },
  { name: 'Arthur R. Outlaw Mobile Convention Center', venueType: 'Convention Center', city: 'Mobile', state: 'AL', latitude: 30.6930, longitude: -88.0430, status: 'prospect' },
  { name: 'Wintrust Arena', venueType: 'Convention Center', city: 'Chicago', state: 'IL', latitude: 41.8570, longitude: -87.6170, status: 'prospect' },
  { name: 'Two Rivers Convention Center', venueType: 'Convention Center', city: 'Grand Junction', state: 'CO', latitude: 39.0660, longitude: -108.5510, status: 'prospect' },
  
  // PERFORMING ARTS / THEATERS
  { name: 'Arie Crown Theater', venueType: 'Theater', city: 'Chicago', state: 'IL', latitude: 41.8510, longitude: -87.6150, status: 'prospect' },
  { name: 'NOW Arena', venueType: 'Arena', city: 'Hoffman Estates', state: 'IL', latitude: 42.0520, longitude: -88.1190, status: 'prospect' },
  
  // FAIRGROUNDS
  { name: 'Iowa State Fairgrounds', venueType: 'Fairgrounds', city: 'Des Moines', state: 'IA', latitude: 41.5980, longitude: -93.5680, status: 'prospect' },
  { name: 'Minnesota State Fairgrounds', venueType: 'Fairgrounds', city: 'Saint Paul', state: 'MN', latitude: 44.9830, longitude: -93.1670, status: 'prospect' },
  { name: 'Wisconsin State Fair Park', venueType: 'Fairgrounds', city: 'West Allis', state: 'WI', latitude: 43.0130, longitude: -88.0290, status: 'prospect' },
  { name: 'Arizona State Fairgrounds', venueType: 'Fairgrounds', city: 'Phoenix', state: 'AZ', latitude: 33.4710, longitude: -112.0910, status: 'prospect' },
  
  // HOSPITALITY VENUES (Food Service)
  { name: 'Navy Pier', venueType: 'Entertainment Complex', city: 'Chicago', state: 'IL', latitude: 41.8920, longitude: -87.6050, status: 'prospect', notes: 'Major Chicago attraction' },
  { name: 'PHX Arena', venueType: 'Arena', city: 'Phoenix', state: 'AZ', latitude: 33.4460, longitude: -112.0710, status: 'prospect', notes: 'Phoenix Suns, Phoenix Mercury' },
  
  // MORE ARENAS
  { name: 'TD Garden', venueType: 'Arena', city: 'Boston', state: 'MA', latitude: 42.3660, longitude: -71.0620, status: 'prospect', notes: 'Boston Bruins, Boston Celtics' },
  { name: 'Madison Square Garden', venueType: 'Arena', city: 'New York', state: 'NY', latitude: 40.7505, longitude: -73.9934, status: 'prospect', notes: 'NY Rangers, NY Knicks' },
  { name: 'Crypto.com Arena', venueType: 'Arena', city: 'Los Angeles', state: 'CA', latitude: 34.0430, longitude: -118.2670, status: 'prospect', notes: 'LA Lakers, LA Kings, LA Clippers' },
  { name: 'United Center', venueType: 'Arena', city: 'Chicago', state: 'IL', latitude: 41.8807, longitude: -87.6742, status: 'prospect', notes: 'Chicago Bulls, Chicago Blackhawks' },
  { name: 'Chase Center', venueType: 'Arena', city: 'San Francisco', state: 'CA', latitude: 37.7680, longitude: -122.3870, status: 'prospect', notes: 'Golden State Warriors' },
  { name: 'Ball Arena', venueType: 'Arena', city: 'Denver', state: 'CO', latitude: 39.7490, longitude: -105.0077, status: 'prospect', notes: 'Denver Nuggets, Colorado Avalanche' },
  { name: 'Enterprise Center', venueType: 'Arena', city: 'St. Louis', state: 'MO', latitude: 38.6260, longitude: -90.2020, status: 'prospect', notes: 'St. Louis Blues' },
  { name: 'T-Mobile Arena', venueType: 'Arena', city: 'Las Vegas', state: 'NV', latitude: 36.1029, longitude: -115.1783, status: 'prospect', notes: 'Vegas Golden Knights' },
  { name: 'PPG Paints Arena', venueType: 'Arena', city: 'Pittsburgh', state: 'PA', latitude: 40.4395, longitude: -79.9890, status: 'prospect', notes: 'Pittsburgh Penguins' },
  { name: 'Little Caesars Arena', venueType: 'Arena', city: 'Detroit', state: 'MI', latitude: 42.3410, longitude: -83.0555, status: 'prospect', notes: 'Detroit Red Wings, Detroit Pistons' },
  { name: 'Bridgestone Arena', venueType: 'Arena', city: 'Nashville', state: 'TN', latitude: 36.1592, longitude: -86.7785, status: 'prospect', notes: 'Nashville Predators' },
  { name: 'Nationwide Arena', venueType: 'Arena', city: 'Columbus', state: 'OH', latitude: 39.9692, longitude: -83.0060, status: 'prospect', notes: 'Columbus Blue Jackets' },
  { name: 'PNC Arena', venueType: 'Arena', city: 'Raleigh', state: 'NC', latitude: 35.8034, longitude: -78.7220, status: 'prospect', notes: 'Carolina Hurricanes' },
  { name: 'Amalie Arena', venueType: 'Arena', city: 'Tampa', state: 'FL', latitude: 27.9427, longitude: -82.4519, status: 'prospect', notes: 'Tampa Bay Lightning' },
  { name: 'FLA Live Arena', venueType: 'Arena', city: 'Sunrise', state: 'FL', latitude: 26.1585, longitude: -80.3260, status: 'prospect', notes: 'Florida Panthers' },
  { name: 'Amerant Bank Arena', venueType: 'Arena', city: 'Sunrise', state: 'FL', latitude: 26.1585, longitude: -80.3260, status: 'prospect' },
  { name: 'Prudential Center', venueType: 'Arena', city: 'Newark', state: 'NJ', latitude: 40.7334, longitude: -74.1712, status: 'prospect', notes: 'New Jersey Devils' },
  { name: 'Wells Fargo Center', venueType: 'Arena', city: 'Philadelphia', state: 'PA', latitude: 39.9012, longitude: -75.1720, status: 'prospect', notes: 'Philadelphia Flyers, 76ers' },
  { name: 'Capital One Arena', venueType: 'Arena', city: 'Washington', state: 'DC', latitude: 38.8981, longitude: -77.0209, status: 'prospect', notes: 'Washington Capitals, Wizards' },
  
  // SPECIALTY VENUES
  { name: 'Barclays Center', venueType: 'Arena', city: 'Brooklyn', state: 'NY', latitude: 40.6826, longitude: -73.9754, status: 'prospect', notes: 'Brooklyn Nets' },
  { name: 'Fiserv Forum', venueType: 'Arena', city: 'Milwaukee', state: 'WI', latitude: 43.0450, longitude: -87.9181, status: 'prospect', notes: 'Milwaukee Bucks' },
  { name: 'Target Center', venueType: 'Arena', city: 'Minneapolis', state: 'MN', latitude: 44.9795, longitude: -93.2761, status: 'prospect', notes: 'Minnesota Timberwolves' },
  { name: 'Kia Center', venueType: 'Arena', city: 'Orlando', state: 'FL', latitude: 28.5392, longitude: -81.3839, status: 'prospect', notes: 'Orlando Magic' },
  { name: 'Smoothie King Center', venueType: 'Arena', city: 'New Orleans', state: 'LA', latitude: 29.9490, longitude: -90.0821, status: 'prospect', notes: 'New Orleans Pelicans' },
  { name: 'Toyota Center', venueType: 'Arena', city: 'Houston', state: 'TX', latitude: 29.7508, longitude: -95.3621, status: 'prospect', notes: 'Houston Rockets' },
  { name: 'American Airlines Center', venueType: 'Arena', city: 'Dallas', state: 'TX', latitude: 32.7905, longitude: -96.8103, status: 'prospect', notes: 'Dallas Mavericks, Dallas Stars' },
  { name: 'Paycom Center', venueType: 'Arena', city: 'Oklahoma City', state: 'OK', latitude: 35.4634, longitude: -97.5151, status: 'prospect', notes: 'Oklahoma City Thunder' },
  { name: 'Vivint Arena', venueType: 'Arena', city: 'Salt Lake City', state: 'UT', latitude: 40.7683, longitude: -111.9011, status: 'prospect', notes: 'Utah Jazz' },
  { name: 'Footprint Center', venueType: 'Arena', city: 'Phoenix', state: 'AZ', latitude: 33.4457, longitude: -112.0712, status: 'prospect', notes: 'Phoenix Suns' },
  { name: 'Honda Center', venueType: 'Arena', city: 'Anaheim', state: 'CA', latitude: 33.8078, longitude: -117.8765, status: 'prospect', notes: 'Anaheim Ducks' },
  { name: 'SAP Center', venueType: 'Arena', city: 'San Jose', state: 'CA', latitude: 37.3327, longitude: -121.9012, status: 'prospect', notes: 'San Jose Sharks' },
  { name: 'Climate Pledge Arena', venueType: 'Arena', city: 'Seattle', state: 'WA', latitude: 47.6221, longitude: -122.3540, status: 'prospect', notes: 'Seattle Kraken' },
  { name: 'Rogers Arena', venueType: 'Arena', city: 'Vancouver', state: 'BC', country: 'Canada', latitude: 49.2778, longitude: -123.1089, status: 'prospect', notes: 'Vancouver Canucks' },
  { name: 'Rogers Place', venueType: 'Arena', city: 'Edmonton', state: 'AB', country: 'Canada', latitude: 53.5469, longitude: -113.4979, status: 'prospect', notes: 'Edmonton Oilers' },
  { name: 'Scotiabank Saddledome', venueType: 'Arena', city: 'Calgary', state: 'AB', country: 'Canada', latitude: 51.0374, longitude: -114.0519, status: 'prospect', notes: 'Calgary Flames' },
  { name: 'Canada Life Centre', venueType: 'Arena', city: 'Winnipeg', state: 'MB', country: 'Canada', latitude: 49.8928, longitude: -97.1439, status: 'prospect', notes: 'Winnipeg Jets' },
  { name: 'Canadian Tire Centre', venueType: 'Arena', city: 'Ottawa', state: 'ON', country: 'Canada', latitude: 45.2969, longitude: -75.9273, status: 'prospect', notes: 'Ottawa Senators' },
  { name: 'Bell Centre', venueType: 'Arena', city: 'Montreal', state: 'QC', country: 'Canada', latitude: 45.4961, longitude: -73.5693, status: 'prospect', notes: 'Montreal Canadiens' },
  { name: 'Scotiabank Arena', venueType: 'Arena', city: 'Toronto', state: 'ON', country: 'Canada', latitude: 43.6435, longitude: -79.3791, status: 'prospect', notes: 'Toronto Maple Leafs, Raptors' },
  { name: 'TD Coliseum', venueType: 'Arena', city: 'Hamilton', state: 'ON', country: 'Canada', latitude: 43.2557, longitude: -79.8711, status: 'prospect', notes: 'Newly renovated 2025' },
];

async function initializeOVGTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS ovg_sites (
      id SERIAL PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      venue_type VARCHAR(100),
      address VARCHAR(500),
      city VARCHAR(255),
      state VARCHAR(100),
      zip VARCHAR(20),
      country VARCHAR(100) DEFAULT 'USA',
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      status VARCHAR(50) DEFAULT 'prospect',
      notes TEXT,
      contact_name VARCHAR(255),
      contact_email VARCHAR(255),
      contact_phone VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ovg_page_analytics (
      id SERIAL PRIMARY KEY,
      visitor_ip VARCHAR(45),
      visitor_city VARCHAR(255),
      visitor_region VARCHAR(255),
      visitor_country VARCHAR(100),
      visitor_latitude DECIMAL(10, 8),
      visitor_longitude DECIMAL(11, 8),
      user_agent TEXT,
      referrer TEXT,
      password_used VARCHAR(100),
      session_id VARCHAR(100),
      page_path VARCHAR(255) DEFAULT '/ovg-map',
      time_on_page INTEGER,
      viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_ovg_sites_status ON ovg_sites(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ovg_sites_state ON ovg_sites(state)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_ovg_analytics_viewed ON ovg_page_analytics(viewed_at DESC)`;
}

async function seedOVGSites() {
  console.log('Initializing OVG tables...');
  await initializeOVGTables();
  
  console.log(`Seeding ${ovgVenues.length} OVG venues...`);
  
  let inserted = 0;
  let skipped = 0;
  
  for (const venue of ovgVenues) {
    try {
      // Check if venue already exists
      const existing = await sql`
        SELECT id FROM ovg_sites WHERE name = ${venue.name} AND city = ${venue.city}
      `;
      
      if (existing.length > 0) {
        skipped++;
        continue;
      }
      
      await sql`
        INSERT INTO ovg_sites (
          name, venue_type, city, state, country,
          latitude, longitude, status, notes
        )
        VALUES (
          ${venue.name}, ${venue.venueType}, ${venue.city}, ${venue.state}, 
          ${venue.country || 'USA'}, ${venue.latitude}, ${venue.longitude}, 
          ${venue.status}, ${venue.notes || null}
        )
      `;
      inserted++;
    } catch (error) {
      console.error(`Error inserting ${venue.name}:`, error);
    }
  }
  
  console.log(`Done! Inserted: ${inserted}, Skipped (existing): ${skipped}`);
  
  // Show counts by status
  const counts = await sql`
    SELECT status, COUNT(*) as count FROM ovg_sites GROUP BY status
  `;
  console.log('\nVenues by status:');
  counts.forEach((c) => {
    console.log(`  ${c.status}: ${c.count}`);
  });
}

seedOVGSites()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
