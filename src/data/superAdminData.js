// ─── Super Admin Data ────────────────────────────────────────────────────────

export const superAdminInfo = {
  name: "Aditya Sharma", role: "Super Admin", avatar: "AS", company: "FitZone Group",
};

export const globalStats = [
  { label:"Total Branches",   value:"4",       icon:"🏢", change:"+1 this year",      color:"#3b82f6" },
  { label:"Total Members",    value:"4,820",   icon:"👥", change:"+312 this month",   color:"#22c55e" },
  { label:"Total Revenue",    value:"$1.84M",  icon:"💰", change:"+22% YoY",          color:"#f97316" },
  { label:"Active Trainers",  value:"28",      icon:"🏋️", change:"Across all branches",color:"#8b5cf6"},
  { label:"Platform Health",  value:"99.8%",   icon:"💚", change:"Uptime this month", color:"#22c55e" },
  { label:"Churn Rate",       value:"3.2%",    icon:"📉", change:"-0.8% vs last month",color:"#ef4444"},
];

export const branches = [
  { id:1, name:"FitZone Main",  city:"Mumbai",    members:1284, revenue:"$42.8K", trainers:8, status:"active", growth:"+12%" },
  { id:2, name:"FitZone North", city:"Delhi",     members:1120, revenue:"$38.2K", trainers:7, status:"active", growth:"+8%"  },
  { id:3, name:"FitZone South", city:"Bangalore", members:980,  revenue:"$33.1K", trainers:6, status:"active", growth:"+15%" },
  { id:4, name:"FitZone West",  city:"Pune",      members:436,  revenue:"$14.6K", trainers:4, status:"new",    growth:"+42%" },
];

export const allUsers = [
  { id:1,  name:"Aryan Mehta",   email:"aryan@email.com",   role:"member",    branch:"Main",  status:"active",   lastLogin:"Today"      },
  { id:2,  name:"Vikram Singh",  email:"vikram@email.com",  role:"trainer",   branch:"Main",  status:"active",   lastLogin:"Today"      },
  { id:3,  name:"Rajesh Kumar",  email:"rajesh@email.com",  role:"admin",     branch:"Main",  status:"active",   lastLogin:"Today"      },
  { id:4,  name:"Anjali Sharma", email:"anjali@email.com",  role:"trainer",   branch:"North", status:"active",   lastLogin:"Yesterday"  },
  { id:5,  name:"Priya Sharma",  email:"priya@email.com",   role:"member",    branch:"Main",  status:"active",   lastLogin:"Today"      },
  { id:6,  name:"Suresh Iyer",   email:"suresh@email.com",  role:"member",    branch:"South", status:"active",   lastLogin:"2 days ago" },
  { id:7,  name:"Meena Patel",   email:"meena@email.com",   role:"reception", branch:"Main",  status:"active",   lastLogin:"Today"      },
  { id:8,  name:"Amit Patel",    email:"amit@email.com",    role:"member",    branch:"West",  status:"inactive", lastLogin:"1 week ago" },
];

export const membershipPlans = [
  { id:1, name:"Monthly",     price:39,  duration:"1 month",   members:284, status:"active", popular:false, features:["Gym Access","Locker","1 PT Session"]           },
  { id:2, name:"Quarterly",   price:99,  duration:"3 months",  members:412, status:"active", popular:false, features:["Gym Access","Locker","3 PT Sessions","Sauna"]   },
  { id:3, name:"Half-Yearly", price:179, duration:"6 months",  members:680, status:"active", popular:true,  features:["All Quarterly","Diet Plan","Group Classes"]     },
  { id:4, name:"Annual",      price:299, duration:"12 months", members:520, status:"active", popular:false, features:["All Half-Yearly","Unlimited PT","Priority Booking"]},
  { id:5, name:"Student",     price:29,  duration:"1 month",   members:124, status:"active", popular:false, features:["Gym Access","Student ID Required"]              },
  { id:6, name:"Corporate",   price:199, duration:"3 months",  members:89,  status:"active", popular:false, features:["Bulk Seats","Invoice Billing","Dedicated Manager"]},
];

export const auditLog = [
  { id:1, user:"Rajesh Kumar",  action:"Updated member plan",      target:"Aryan Mehta",    time:"Today 10:24 AM",    ip:"192.168.1.10", type:"update" },
  { id:2, user:"Vikram Singh",  action:"Added progress note",      target:"Priya Sharma",   time:"Today 9:15 AM",     ip:"192.168.1.22", type:"create" },
  { id:3, user:"Aditya Sharma", action:"Created new branch",       target:"FitZone West",   time:"Yesterday 3:00 PM", ip:"10.0.0.1",     type:"create" },
  { id:4, user:"Rajesh Kumar",  action:"Suspended member account", target:"Divya Singh",    time:"Yesterday 11:30 AM",ip:"192.168.1.10", type:"delete" },
  { id:5, user:"Meena Patel",   action:"Registered new member",    target:"Vikash Nair",    time:"May 3, 2:15 PM",    ip:"192.168.1.30", type:"create" },
  { id:6, user:"Aditya Sharma", action:"Changed role",             target:"Meena Patel",    time:"May 2, 4:00 PM",    ip:"10.0.0.1",     type:"update" },
  { id:7, user:"System",        action:"Automated backup",         target:"DB Snapshot",    time:"May 2, 3:00 AM",    ip:"localhost",    type:"system" },
  { id:8, user:"Rajesh Kumar",  action:"Deleted class schedule",   target:"Yoga - Monday",  time:"May 1, 1:10 PM",    ip:"192.168.1.10", type:"delete" },
];

export const loginHistory = [
  { id:1, user:"Aditya Sharma", role:"superadmin", time:"Today 8:02 AM",     device:"Chrome / Windows", location:"Mumbai, IN",    status:"success" },
  { id:2, user:"Rajesh Kumar",  role:"admin",      time:"Today 9:10 AM",     device:"Safari / macOS",   location:"Mumbai, IN",    status:"success" },
  { id:3, user:"Unknown",       role:"—",          time:"Today 7:45 AM",     device:"Firefox / Linux",  location:"Unknown",       status:"failed"  },
  { id:4, user:"Anjali Sharma", role:"trainer",    time:"Yesterday 6:30 PM", device:"Mobile / Android", location:"Delhi, IN",     status:"success" },
  { id:5, user:"Unknown",       role:"—",          time:"Yesterday 2:00 AM", device:"Bot / Unknown",    location:"Russia",        status:"blocked" },
];

export const systemLogs = [
  { id:1, level:"error",   message:"Payment gateway timeout after 30s",       service:"PaymentService", time:"Today 11:02 AM"    },
  { id:2, level:"warning", message:"High memory usage detected (87%)",         service:"AppServer",      time:"Today 10:45 AM"    },
  { id:3, level:"info",    message:"Scheduled backup completed successfully",  service:"BackupService",  time:"Today 3:00 AM"     },
  { id:4, level:"error",   message:"SMS delivery failed for 3 users",          service:"SMSGateway",     time:"Yesterday 8:30 PM" },
  { id:5, level:"info",    message:"New branch FitZone West provisioned",      service:"BranchService",  time:"Yesterday 3:05 PM" },
  { id:6, level:"warning", message:"SSL certificate expires in 14 days",       service:"WebServer",      time:"May 3, 9:00 AM"    },
];

export const financialReports = {
  monthly: [
    { month:"Jun", revenue:28400, expenses:18200, profit:10200 },
    { month:"Jul", revenue:31200, expenses:19800, profit:11400 },
    { month:"Aug", revenue:29800, expenses:18900, profit:10900 },
    { month:"Sep", revenue:33400, expenses:20100, profit:13300 },
    { month:"Oct", revenue:36100, expenses:21400, profit:14700 },
    { month:"Nov", revenue:38200, expenses:22000, profit:16200 },
    { month:"Dec", revenue:41800, expenses:23500, profit:18300 },
    { month:"Jan", revenue:39200, expenses:22800, profit:16400 },
    { month:"Feb", revenue:42100, expenses:24100, profit:18000 },
    { month:"Mar", revenue:44800, expenses:25200, profit:19600 },
    { month:"Apr", revenue:47200, expenses:26400, profit:20800 },
    { month:"May", revenue:51400, expenses:27800, profit:23600 },
  ],
  branchRevenue: [
    { branch:"Main",  revenue:42800 },
    { branch:"North", revenue:38200 },
    { branch:"South", revenue:33100 },
    { branch:"West",  revenue:14600 },
  ],
  forecast: [
    { month:"Jun", actual:51400, forecast:54000 },
    { month:"Jul", actual:null,  forecast:57200 },
    { month:"Aug", actual:null,  forecast:59800 },
    { month:"Sep", actual:null,  forecast:63400 },
  ],
};

export const transactions = [
  { id:"TXN001", user:"Aryan Mehta",   plan:"Annual",      amount:299, date:"May 6, 2026",  method:"Card",   status:"success" },
  { id:"TXN002", user:"Priya Sharma",  plan:"Half-Yearly", amount:179, date:"May 5, 2026",  method:"UPI",    status:"success" },
  { id:"TXN003", user:"Suresh Iyer",   plan:"Monthly",     amount:39,  date:"May 5, 2026",  method:"Card",   status:"failed"  },
  { id:"TXN004", user:"Meena Patel",   plan:"Quarterly",   amount:99,  date:"May 4, 2026",  method:"NetBanking",status:"success"},
  { id:"TXN005", user:"Amit Patel",    plan:"Student",     amount:29,  date:"May 3, 2026",  method:"UPI",    status:"refunded"},
  { id:"TXN006", user:"Vikash Nair",   plan:"Monthly",     amount:39,  date:"May 3, 2026",  method:"Card",   status:"success" },
  { id:"TXN007", user:"Divya Singh",   plan:"Annual",      amount:299, date:"May 2, 2026",  method:"Card",   status:"success" },
  { id:"TXN008", user:"Karan Mehta",   plan:"Quarterly",   amount:99,  date:"May 1, 2026",  method:"UPI",    status:"failed"  },
];

export const subscriptions = [
  { id:1, user:"Aryan Mehta",   plan:"Annual",      start:"Jan 1, 2026",  expiry:"Dec 31, 2026", status:"active",  daysLeft:239 },
  { id:2, user:"Priya Sharma",  plan:"Half-Yearly", start:"Feb 1, 2026",  expiry:"Jul 31, 2026", status:"active",  daysLeft:86  },
  { id:3, user:"Suresh Iyer",   plan:"Monthly",     start:"Apr 6, 2026",  expiry:"May 6, 2026",  status:"expired", daysLeft:0   },
  { id:4, user:"Meena Patel",   plan:"Quarterly",   start:"Mar 1, 2026",  expiry:"May 31, 2026", status:"active",  daysLeft:25  },
  { id:5, user:"Amit Patel",    plan:"Student",     start:"Apr 1, 2026",  expiry:"Apr 30, 2026", status:"expired", daysLeft:0   },
  { id:6, user:"Vikash Nair",   plan:"Monthly",     start:"May 3, 2026",  expiry:"Jun 3, 2026",  status:"active",  daysLeft:28  },
  { id:7, user:"Divya Singh",   plan:"Annual",      start:"Jan 15, 2026", expiry:"Jan 14, 2027", status:"active",  daysLeft:253 },
  { id:8, user:"Karan Mehta",   plan:"Quarterly",   start:"Feb 15, 2026", expiry:"May 14, 2026", status:"expiring",daysLeft:8   },
];

export const memberGrowth = [
  { month:"Jun", active:3200, inactive:280, new:180 },
  { month:"Jul", active:3380, inactive:260, new:210 },
  { month:"Aug", active:3520, inactive:290, new:195 },
  { month:"Sep", active:3680, inactive:270, new:220 },
  { month:"Oct", active:3820, inactive:310, new:240 },
  { month:"Nov", active:3940, inactive:295, new:195 },
  { month:"Dec", active:4080, inactive:280, new:210 },
  { month:"Jan", active:4150, inactive:320, new:185 },
  { month:"Feb", active:4280, inactive:300, new:215 },
  { month:"Mar", active:4390, inactive:285, new:230 },
  { month:"Apr", active:4520, inactive:270, new:245 },
  { month:"May", active:4640, inactive:260, new:260 },
];

export const notifications = [
  { id:1, type:"expiry",  title:"Subscription Expiring",  message:"8 members expire within 7 days",       time:"2 min ago",  read:false },
  { id:2, type:"payment", title:"Payment Failed",          message:"3 payment failures in last 24 hours",  time:"15 min ago", read:false },
  { id:3, type:"system",  title:"Backup Completed",        message:"Daily backup finished successfully",   time:"1 hr ago",   read:true  },
  { id:4, type:"alert",   title:"High Server Load",        message:"CPU usage at 87% on App Server",       time:"2 hr ago",   read:true  },
  { id:5, type:"info",    title:"New Branch Activated",    message:"FitZone West is now live",             time:"Yesterday",  read:true  },
];

export const campaigns = [
  { id:1, name:"Summer Fitness Drive",  type:"discount", target:"All Members",    discount:"20%", status:"active",   sent:1240, opens:680 },
  { id:2, name:"Renewal Reminder",      type:"email",    target:"Expiring Soon",  discount:"—",   status:"active",   sent:89,   opens:62  },
  { id:3, name:"New Year Offer",        type:"discount", target:"Inactive Users", discount:"30%", status:"completed",sent:420,  opens:198 },
  { id:4, name:"Corporate Outreach",    type:"sms",      target:"Corporate Leads",discount:"—",   status:"draft",    sent:0,    opens:0   },
];

export const equipment = [
  { id:1, name:"Treadmill Pro X200",   category:"Cardio",    branch:"Main",  status:"working",     lastService:"Apr 10, 2026", nextService:"Jul 10, 2026" },
  { id:2, name:"Bench Press Station",  category:"Strength",  branch:"Main",  status:"working",     lastService:"Mar 20, 2026", nextService:"Jun 20, 2026" },
  { id:3, name:"Elliptical Trainer",   category:"Cardio",    branch:"North", status:"maintenance", lastService:"May 1, 2026",  nextService:"May 15, 2026" },
  { id:4, name:"Cable Machine",        category:"Strength",  branch:"South", status:"broken",      lastService:"Feb 14, 2026", nextService:"ASAP"         },
  { id:5, name:"Rowing Machine",       category:"Cardio",    branch:"West",  status:"working",     lastService:"Apr 28, 2026", nextService:"Jul 28, 2026" },
  { id:6, name:"Leg Press Machine",    category:"Strength",  branch:"Main",  status:"working",     lastService:"Apr 5, 2026",  nextService:"Jul 5, 2026"  },
  { id:7, name:"Spin Bike",            category:"Cardio",    branch:"North", status:"working",     lastService:"Apr 18, 2026", nextService:"Jul 18, 2026" },
  { id:8, name:"Smith Machine",        category:"Strength",  branch:"South", status:"maintenance", lastService:"May 3, 2026",  nextService:"May 20, 2026" },
];

export const vendors = [
  { id:1, name:"FitEquip Supplies",  category:"Equipment",  contact:"Ravi Gupta",    phone:"+91 98001 11111", email:"ravi@fitequip.com",  status:"active",   lastOrder:"Apr 20, 2026" },
  { id:2, name:"CleanPro Services",  category:"Cleaning",   contact:"Sunita Rao",    phone:"+91 98002 22222", email:"sunita@cleanpro.com",status:"active",   lastOrder:"May 1, 2026"  },
  { id:3, name:"TechFix Solutions",  category:"Maintenance",contact:"Arun Sharma",   phone:"+91 98003 33333", email:"arun@techfix.com",   status:"active",   lastOrder:"May 3, 2026"  },
  { id:4, name:"NutriStock India",   category:"Nutrition",  contact:"Pooja Mehta",   phone:"+91 98004 44444", email:"pooja@nutristock.in",status:"inactive", lastOrder:"Mar 10, 2026" },
];

export const maintenanceLogs = [
  { id:1, equipment:"Treadmill Pro X200",  type:"Routine",   technician:"Arun Sharma",  date:"Apr 10, 2026", status:"completed", cost:"$120" },
  { id:2, equipment:"Elliptical Trainer",  type:"Repair",    technician:"TechFix Team", date:"May 1, 2026",  status:"in-progress",cost:"$280"},
  { id:3, equipment:"Cable Machine",       type:"Emergency", technician:"Pending",      date:"May 6, 2026",  status:"pending",   cost:"TBD"  },
  { id:4, equipment:"Smith Machine",       type:"Routine",   technician:"Arun Sharma",  date:"May 3, 2026",  status:"in-progress",cost:"$95" },
  { id:5, equipment:"Bench Press Station", type:"Routine",   technician:"Arun Sharma",  date:"Mar 20, 2026", status:"completed", cost:"$80"  },
];

export const integrations = [
  { id:1, name:"Razorpay",       category:"Payment",  icon:"💳", enabled:true,  description:"Primary payment gateway"         },
  { id:2, name:"Stripe",         category:"Payment",  icon:"💳", enabled:false, description:"International payments"          },
  { id:3, name:"Twilio SMS",     category:"SMS",      icon:"📱", enabled:true,  description:"SMS notifications & OTP"         },
  { id:4, name:"SendGrid Email", category:"Email",    icon:"📧", enabled:true,  description:"Transactional email service"     },
  { id:5, name:"Google Analytics",category:"Analytics",icon:"📊",enabled:true,  description:"Website & app analytics"        },
  { id:6, name:"Zoom",           category:"Video",    icon:"🎥", enabled:false, description:"Virtual training sessions"       },
  { id:7, name:"Slack",          category:"Comms",    icon:"💬", enabled:false, description:"Internal team notifications"     },
  { id:8, name:"AWS S3",         category:"Storage",  icon:"☁️", enabled:true,  description:"Media & backup storage"         },
];

export const featureFlags = [
  { id:1, name:"AI Workout Suggestions",  key:"ai_suggestions",    enabled:true,  env:"production", description:"Show AI-powered workout tips to members"    },
  { id:2, name:"Live Class Streaming",    key:"live_streaming",    enabled:false, env:"beta",       description:"Enable live class video streaming"          },
  { id:3, name:"Biometric Check-in",      key:"biometric_checkin", enabled:true,  env:"production", description:"Fingerprint/face check-in at branches"      },
  { id:4, name:"Referral Program",        key:"referral_program",  enabled:true,  env:"production", description:"Member referral rewards system"             },
  { id:5, name:"Nutrition Tracker",       key:"nutrition_tracker", enabled:false, env:"beta",       description:"In-app nutrition & diet tracking"           },
  { id:6, name:"Dark Mode",               key:"dark_mode",         enabled:true,  env:"production", description:"Dark theme for member app"                  },
  { id:7, name:"Multi-branch Membership", key:"multi_branch",      enabled:false, env:"alpha",      description:"Single membership valid at all branches"    },
];

export const supportTickets = [
  { id:"TKT001", user:"Aryan Mehta",   subject:"Payment not reflecting",    priority:"high",   status:"open",       created:"May 6, 2026",  assigned:"Support Team" },
  { id:"TKT002", user:"Priya Sharma",  subject:"Cannot book class slot",    priority:"medium", status:"in-progress",created:"May 5, 2026",  assigned:"Rajesh Kumar" },
  { id:"TKT003", user:"Suresh Iyer",   subject:"Membership renewal issue",  priority:"high",   status:"open",       created:"May 5, 2026",  assigned:"Unassigned"   },
  { id:"TKT004", user:"Meena Patel",   subject:"App login problem",         priority:"low",    status:"closed",     created:"May 3, 2026",  assigned:"Tech Team"    },
  { id:"TKT005", user:"Vikash Nair",   subject:"Trainer not available",     priority:"medium", status:"closed",     created:"May 2, 2026",  assigned:"Rajesh Kumar" },
];

export const feedbackData = [
  { id:1, user:"Aryan Mehta",   rating:5, category:"Facilities", comment:"Excellent equipment and clean environment!", date:"May 5, 2026"  },
  { id:2, user:"Priya Sharma",  rating:4, category:"Trainers",   comment:"Very helpful trainers, great guidance.",     date:"May 4, 2026"  },
  { id:3, user:"Suresh Iyer",   rating:3, category:"App",        comment:"App is a bit slow sometimes.",               date:"May 3, 2026"  },
  { id:4, user:"Meena Patel",   rating:5, category:"Classes",    comment:"Love the yoga and Zumba classes!",           date:"May 2, 2026"  },
  { id:5, user:"Vikash Nair",   rating:2, category:"Billing",    comment:"Had trouble with payment processing.",       date:"May 1, 2026"  },
];

export const liveMonitoring = {
  activeUsers: 142,
  checkInsToday: 387,
  peakHour: "7:00 AM – 9:00 AM",
  currentLoad: 68,
  branchLive: [
    { branch:"Main",  checkins:158, active:62 },
    { branch:"North", checkins:112, active:48 },
    { branch:"South", checkins:89,  active:22 },
    { branch:"West",  checkins:28,  active:10 },
  ],
};

export const aiInsights = [
  { id:1, type:"revenue",  icon:"💡", title:"Revenue Opportunity",    insight:"15 members on Monthly plan haven't upgraded in 6+ months. Targeted upgrade campaign could yield +$2,400/mo.",  action:"Create Campaign" },
  { id:2, type:"churn",    icon:"⚠️", title:"Churn Risk Detected",    insight:"23 members haven't checked in for 14+ days. Engagement nudge could recover ~60% based on historical data.",    action:"Send Nudge"      },
  { id:3, type:"equipment",icon:"🔧", title:"Maintenance Prediction",  insight:"Treadmill #3 at North branch shows usage patterns similar to units that failed. Schedule preventive service.",  action:"Schedule Service" },
  { id:4, type:"growth",   icon:"📈", title:"Peak Hour Optimization",  insight:"Tuesday 6–8 PM is 94% capacity at Main. Adding one more class slot could serve 30+ additional members.",       action:"Add Slot"        },
  { id:5, type:"finance",  icon:"💰", title:"Pricing Insight",         insight:"Annual plan conversion rate is 12% below industry average. A 10% discount trial could boost conversions.",     action:"Test Discount"   },
];

export const systemSettings = {
  gymName: "FitZone Fitness Group",
  logo: "⚡",
  email: "admin@fitzone.com",
  phone: "+91 98765 00000",
  timezone: "Asia/Kolkata",
  currency: "USD",
  emailNotifications: true,
  smsNotifications: false,
  autoBackup: true,
  backupFrequency: "Daily",
  maintenanceMode: false,
};
