import { v4 as uuidv4 } from 'uuid';

export const STATUS_OPTIONS = [
  { value: 'Applied', label: 'Applied', color: 'blue' },
  { value: 'Interviewing', label: 'Interviewing', color: 'amber' },
  { value: 'Offer', label: 'Offer Received', color: 'green' },
  { value: 'Rejected', label: 'Rejected', color: 'red' },
];

export const PLATFORM_OPTIONS = [
  'LinkedIn', 'Indeed', 'Glassdoor', 'Company Website', 'Referral',
  'AngelList', 'Wellfound', 'Naukri', 'Instahyre', 'Other'
];

export const LOCATION_OPTIONS = [
  'Remote', 'On-site', 'Hybrid'
];

export const SORT_OPTIONS = [
  { value: 'appliedDate_desc', label: 'Newest First' },
  { value: 'appliedDate_asc', label: 'Oldest First' },
  { value: 'salary_desc', label: 'Highest Salary' },
  { value: 'salary_asc', label: 'Lowest Salary' },
  { value: 'company_asc', label: 'Company A–Z' },
  { value: 'company_desc', label: 'Company Z–A' },
];

export const SEED_APPLICATIONS = [
  {
    id: uuidv4(), company: 'Google', role: 'Senior Frontend Engineer', location: 'Remote',
    salary: 180000, platform: 'LinkedIn', status: 'Interviewing',
    appliedDate: '2024-03-01', interviewDate: '2024-03-15',
    notes: 'Technical round scheduled. Need to prep DSA and system design.',
    bookmarked: true,
  },
  {
    id: uuidv4(), company: 'Stripe', role: 'Software Engineer', location: 'Hybrid',
    salary: 165000, platform: 'Company Website', status: 'Applied',
    appliedDate: '2024-03-05', interviewDate: '',
    notes: 'Applied through their careers page. Referral from ex-colleague.',
    bookmarked: false,
  },
  {
    id: uuidv4(), company: 'Vercel', role: 'Developer Advocate', location: 'Remote',
    salary: 130000, platform: 'AngelList', status: 'Offer',
    appliedDate: '2024-02-15', interviewDate: '2024-03-01',
    notes: 'Offer received! Need to negotiate equity and signing bonus.',
    bookmarked: true,
  },
  {
    id: uuidv4(), company: 'Meta', role: 'React Native Engineer', location: 'On-site',
    salary: 200000, platform: 'Referral', status: 'Rejected',
    appliedDate: '2024-02-10', interviewDate: '2024-02-25',
    notes: 'Failed final round. Feedback: improve system design skills.',
    bookmarked: false,
  },
  {
    id: uuidv4(), company: 'Notion', role: 'Full Stack Engineer', location: 'Remote',
    salary: 155000, platform: 'LinkedIn', status: 'Interviewing',
    appliedDate: '2024-03-08', interviewDate: '2024-03-20',
    notes: 'Cultural fit interview next week.',
    bookmarked: true,
  },
  {
    id: uuidv4(), company: 'Linear', role: 'Product Engineer', location: 'Remote',
    salary: 145000, platform: 'Company Website', status: 'Applied',
    appliedDate: '2024-03-10', interviewDate: '',
    notes: 'Dream company. Fingers crossed!',
    bookmarked: true,
  },
  {
    id: uuidv4(), company: 'Figma', role: 'Frontend Engineer', location: 'Hybrid',
    salary: 160000, platform: 'Glassdoor', status: 'Applied',
    appliedDate: '2024-02-28', interviewDate: '',
    notes: 'Strong company culture. Pinged on LinkedIn too.',
    bookmarked: false,
  },
  {
    id: uuidv4(), company: 'Shopify', role: 'Senior Engineer', location: 'Remote',
    salary: 150000, platform: 'Indeed', status: 'Rejected',
    appliedDate: '2024-02-05', interviewDate: '2024-02-18',
    notes: 'Did not pass HackerRank assessment.',
    bookmarked: false,
  },
];

export function getStatusBadgeClass(status) {
  const map = {
    Applied: 'badge-applied',
    Interviewing: 'badge-interviewing',
    Offer: 'badge-offer',
    Rejected: 'badge-rejected',
  };
  return map[status] || 'badge-default';
}

export function formatSalary(value) {
  if (!value) return '—';
  const n = Number(value);
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return '—'; }
}

export function getCompanyDomain(company) {
  const domains = {
    Google: 'google.com', Meta: 'meta.com', Apple: 'apple.com',
    Microsoft: 'microsoft.com', Amazon: 'amazon.com', Netflix: 'netflix.com',
    Stripe: 'stripe.com', Vercel: 'vercel.com', Notion: 'notion.so',
    Linear: 'linear.app', Figma: 'figma.com', Shopify: 'shopify.com',
    Atlassian: 'atlassian.com', Slack: 'slack.com', Twitter: 'twitter.com',
    Airbnb: 'airbnb.com', Uber: 'uber.com', Lyft: 'lyft.com',
    Spotify: 'spotify.com', GitHub: 'github.com',
  };
  return domains[company] || `${company.toLowerCase().replace(/\s+/g, '')}.com`;
}

export function getLogoUrl(company) {
  const domain = getCompanyDomain(company);
  return `https://logo.clearbit.com/${domain}`;
}

export function sortApplications(apps, sortKey) {
  const sorted = [...apps];
  switch (sortKey) {
    case 'appliedDate_desc': return sorted.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    case 'appliedDate_asc': return sorted.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
    case 'salary_desc': return sorted.sort((a, b) => (b.salary || 0) - (a.salary || 0));
    case 'salary_asc': return sorted.sort((a, b) => (a.salary || 0) - (b.salary || 0));
    case 'company_asc': return sorted.sort((a, b) => a.company.localeCompare(b.company));
    case 'company_desc': return sorted.sort((a, b) => b.company.localeCompare(a.company));
    default: return sorted;
  }
}

export function getMonthlyData(apps) {
  const months = {};
  apps.forEach(app => {
    if (!app.appliedDate) return;
    const key = app.appliedDate.slice(0, 7);
    months[key] = (months[key] || 0) + 1;
  });
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      count
    }));
}

export function getPipelineData(apps) {
  const counts = { Applied: 0, Interviewing: 0, Offer: 0, Rejected: 0 };
  apps.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
  return [
    { name: 'Applied', value: counts.Applied, color: '#38bdf8' },
    { name: 'Interviewing', value: counts.Interviewing, color: '#f59e0b' },
    { name: 'Offer', value: counts.Offer, color: '#22d3a0' },
    { name: 'Rejected', value: counts.Rejected, color: '#f4426c' },
  ].filter(d => d.value > 0);
}
