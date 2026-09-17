export const getInitialSeedData = (bcrypt) => {
  const passwordHash = bcrypt.hashSync('Admin@123', 10);

  const admin = {
    id: 'admin_root_01',
    _id: 'admin_root_01',
    username: 'nexiosadmin',
    email: 'admin@nexios.dev',
    passwordHash: passwordHash,
    role: 'superadmin',
    createdAt: new Date().toISOString()
  };

  const inquiries = [
    {
      id: 'inq_001',
      _id: 'inq_001',
      name: 'Sarah Jenkins',
      email: 'sarah@hyperion.ai',
      service: 'Web Development',
      budget: '$25k-$50k',
      message: 'We need a flagship 3D WebGL web platform for our generative AI developer tooling suite with interactive canvas controls.',
      status: 'New',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    },
    {
      id: 'inq_002',
      _id: 'inq_002',
      name: 'Marcus Vance',
      email: 'marcus@vancecapital.io',
      service: 'App Development',
      budget: '$50k+',
      message: 'Looking for an ultra-secure, sub-50ms trading and portfolio management app for iOS and Android with live WebSockets.',
      status: 'In Progress',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: 'inq_003',
      _id: 'inq_003',
      name: 'Elena Rostova',
      email: 'elena@lumina-studio.co',
      service: 'UI/UX Design',
      budget: '$10k-$25k',
      message: 'Full spatial UI/UX design system overhaul for our collaborative video production web app. Needs luxury dark aesthetic.',
      status: 'Completed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    },
    {
      id: 'inq_004',
      _id: 'inq_004',
      name: 'David Zhang',
      email: 'david@synthwave.tech',
      service: 'Web Development',
      budget: '$10k-$25k',
      message: 'Interactive marketing website with micro-interactions, dark mode aesthetics, dynamic portfolio showcase, and high conversion.',
      status: 'New',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
    },
    {
      id: 'inq_005',
      _id: 'inq_005',
      name: 'Chloe Martin',
      email: 'chloe@neobank.finance',
      service: 'App Development',
      budget: '$25k-$50k',
      message: 'React Native mobile banking application with biometric auth, smooth cards, and real-time transaction feeds.',
      status: 'Archived',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString()
    }
  ];

  const projects = [
    {
      id: 'proj_001',
      _id: 'proj_001',
      title: 'Hyperion AI Studio',
      category: 'Web',
      description: 'Real-time generative AI interface with WebGL nodes, canvas streaming, and sub-100ms inference controls.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      tags: ['React', 'WebGL', 'Three.js', 'TailwindCSS'],
      featured: true,
      metrics: '120k+ Daily Users',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString()
    },
    {
      id: 'proj_002',
      _id: 'proj_002',
      title: 'Vance Capital Terminal',
      category: 'Mobile App',
      description: 'Institutional crypto and equities terminal with biometrics, 60fps charts, and instant order routing.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      tags: ['React Native', 'TypeScript', 'WebSocket', 'FinTech'],
      featured: true,
      metrics: '$40M+ Weekly Volume',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 250).toISOString()
    },
    {
      id: 'proj_003',
      _id: 'proj_003',
      title: 'Aether Spatial System',
      category: 'UI/UX Design',
      description: 'A futuristic enterprise design language featuring glassmorphic depth, dark token architecture, and fluid motion.',
      imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      tags: ['Figma', 'Design Tokens', 'Design System', 'Micro-interactions'],
      featured: true,
      metrics: '400+ Component Tokens',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 300).toISOString()
    },
    {
      id: 'proj_004',
      _id: 'proj_004',
      title: 'Chronos Cloud Engine',
      category: 'Web',
      description: 'High-throughput telemetry dashboard monitoring global distributed edge clusters with live latency graphs.',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      tags: ['Next.js', 'Node.js', 'Express', 'D3.js'],
      featured: false,
      metrics: '99.999% SLA Uptime',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 350).toISOString()
    },
    {
      id: 'proj_005',
      _id: 'proj_005',
      title: 'Pulse Health Wearable',
      category: 'Mobile App',
      description: 'Wearable IoT companion app providing real-time cardiovascular telemetry and predictive health analytics.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      tags: ['Flutter', 'Bluetooth LE', 'HealthKit', 'Dart'],
      featured: false,
      metrics: '50k+ Active Syncs',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 400).toISOString()
    },
    {
      id: 'proj_006',
      _id: 'proj_006',
      title: 'Krypton Multi-Chain UX',
      category: 'UI/UX Design',
      description: 'Minimalist multi-chain asset management interface built with privacy-first ergonomics and biometric signing.',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
      tags: ['Spatial UI', 'Web3', 'UX Research', 'Figma'],
      featured: false,
      metrics: '4.9/5 User Rating',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 450).toISOString()
    }
  ];

  return { admin, inquiries, projects };
};
