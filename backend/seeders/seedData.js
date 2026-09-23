const Event = require('../models/Event');

const initialEvents = [
  {
    name: 'Global AI & Machine Learning Summit 2026',
    description: 'The premier global gathering of AI researchers, machine learning engineers, enterprise leaders, and startup founders exploring generative AI, multimodal agents, robotics, and next-gen deep learning systems.',
    category: 'Conference',
    industry: 'Artificial Intelligence',
    startDate: new Date('2026-10-15T09:00:00.000Z'),
    endDate: new Date('2026-10-17T18:00:00.000Z'),
    venue: 'Moscone Center, South Hall',
    city: 'San Francisco',
    country: 'United States',
    organizer: 'AI Innovations Global',
    website: 'https://global-ai-summit2026.example.com',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'NextGen FinTech & Decentralized Finance Expo',
    description: 'Connecting top banking executives, DeFi builders, algorithmic traders, payments innovators, and global regulators to shape the next decade of decentralized finance, embedded banking, and digital currencies.',
    category: 'Expo',
    industry: 'Financial Technology',
    startDate: new Date('2026-11-04T08:30:00.000Z'),
    endDate: new Date('2026-11-06T17:30:00.000Z'),
    venue: 'ExCeL London International Exhibition Centre',
    city: 'London',
    country: 'United Kingdom',
    organizer: 'World FinTech Alliance',
    website: 'https://nextgen-fintech-expo.example.com',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=1200&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'BioMed & HealthTech Horizons Forum 2026',
    description: 'An international summit showcasing breakthrough advancements in genomic medicine, AI-driven drug discovery, surgical robotics, and scalable digital therapeutics.',
    category: 'Summit',
    industry: 'Healthcare & Biotechnology',
    startDate: new Date('2026-11-20T09:00:00.000Z'),
    endDate: new Date('2026-11-22T17:00:00.000Z'),
    venue: 'Boston Convention and Exhibition Center',
    city: 'Boston',
    country: 'United States',
    organizer: 'Global HealthTech Consortium',
    website: 'https://biomed-horizons2026.example.com',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'CleanEnergy & Sustainable Mobility World Congress',
    description: 'Europe\'s flagship exhibition and policy forum dedicated to grid modernization, next-generation solid-state batteries, commercial EV infrastructure, and green hydrogen power.',
    category: 'Trade Show',
    industry: 'Clean Energy & Sustainability',
    startDate: new Date('2026-12-02T09:00:00.000Z'),
    endDate: new Date('2026-12-04T18:00:00.000Z'),
    venue: 'Messe Berlin Expo Grounds',
    city: 'Berlin',
    country: 'Germany',
    organizer: 'EuroClean Energy Forum',
    website: 'https://cleanenergy-congress.example.com',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'CyberShield International Defense & Security Expo',
    description: 'Bringing together over 8,000 cybersecurity architects, ethical hackers, cloud defense specialists, and CISOs to confront critical infrastructure threats, zero-trust paradigms, and post-quantum encryption.',
    category: 'Conference',
    industry: 'Cybersecurity',
    startDate: new Date('2026-12-10T09:00:00.000Z'),
    endDate: new Date('2026-12-12T17:00:00.000Z'),
    venue: 'Marina Bay Sands Expo & Convention Centre',
    city: 'Singapore',
    country: 'Singapore',
    organizer: 'CyberShield International',
    website: 'https://cybershield-expo.example.com',
    image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80',
    status: 'UPCOMING',
  },
  {
    name: 'Smart Industry & Industrial IoT World Congress',
    description: 'Asia\'s premier showcase of smart factory automation, edge computing architectures, digital twins, and autonomous supply chain logistics for Industry 4.0.',
    category: 'Trade Show',
    industry: 'IoT & Smart Manufacturing',
    startDate: new Date('2026-10-28T09:30:00.000Z'),
    endDate: new Date('2026-10-30T17:00:00.000Z'),
    venue: 'Tokyo Big Sight International Exhibition Center',
    city: 'Tokyo',
    country: 'Japan',
    organizer: 'Asia IoT & Robotics Alliance',
    website: 'https://iot-world-congress2026.example.com',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    status: 'UPCOMING',
  },
];

const seedDatabase = async () => {
  try {
    const count = await Event.count();
    if (count === 0) {
      console.log('Events table is empty. Seeding initial trade show and tech conference records...');
      await Event.bulkCreate(initialEvents);
      console.log(`Successfully seeded ${initialEvents.length} events into the database.`);
    } else {
      console.log(`Database already contains ${count} event(s). Skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = { seedDatabase, initialEvents };
