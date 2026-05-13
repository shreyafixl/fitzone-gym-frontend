// ── Admin Info ───────────────────────────────────────────────
export const adminInfo = {
  name: "Rajesh Kumar", role: "Branch Admin", avatar: "RK", branch: "FitZone - Main Branch",
};

// ── KPI Cards ────────────────────────────────────────────────
export const kpiData = [
  { icon:"👥", label:"Total Members",   value:1247,      change:"+23 this month",      color:"#e8622a" },
  { icon:"✅", label:"Active Members",  value:1089,      change:"87% active rate",     color:"#22c55e" },
  { icon:"🏃", label:"Today Check-ins", value:142,       change:"+12 vs yesterday",    color:"#3b82f6" },
  { icon:"💰", label:"Monthly Revenue", value:"$48,200", change:"+8.4% vs last month", color:"#8b5cf6" },
  { icon:"📊", label:"Occupancy Rate",  value:"73%",     change:"Peak: 6–8 PM",        color:"#f59e0b" },
  { icon:"🆕", label:"New Members",     value:23,        change:"This month",          color:"#ec4899" },
];

// ── Revenue (12 months) ──────────────────────────────────────
export const revenueData = [28000,31000,29500,34000,32000,38000,36000,41000,39000,44000,42000,48200];

// ── New member growth (12 months) ───────────────────────────
export const memberGrowthData = [8,12,15,10,18,22,19,25,21,28,23,23];

// ── Members ──────────────────────────────────────────────────
export const members = [
  { id:1,  name:"Aryan Mehta",   email:"aryan@email.com",   phone:"9876543210", plan:"Half-Yearly", status:"active",    expiry:"Aug 2025", joined:"Jan 2024", checkins:48,  trainer:"Vikram Singh",  gender:"Male",   age:28 },
  { id:2,  name:"Priya Sharma",  email:"priya@email.com",   phone:"9876543211", plan:"Monthly",     status:"active",    expiry:"May 2025", joined:"Apr 2025", checkins:12,  trainer:"Anjali Sharma", gender:"Female", age:24 },
  { id:3,  name:"Rahul Gupta",   email:"rahul@email.com",   phone:"9876543212", plan:"Quarterly",   status:"active",    expiry:"Jun 2025", joined:"Mar 2025", checkins:22,  trainer:"Vikram Singh",  gender:"Male",   age:31 },
  { id:4,  name:"Neha Joshi",    email:"neha@email.com",    phone:"9876543213", plan:"Annual",      status:"active",    expiry:"Nov 2025", joined:"Nov 2023", checkins:91,  trainer:"Vikram Singh",  gender:"Female", age:26 },
  { id:5,  name:"Amit Patel",    email:"amit@email.com",    phone:"9876543214", plan:"Monthly",     status:"expired",   expiry:"Apr 2025", joined:"Apr 2025", checkins:5,   trainer:"—",             gender:"Male",   age:35 },
  { id:6,  name:"Sunita Rao",    email:"sunita@email.com",  phone:"9876543215", plan:"Half-Yearly", status:"active",    expiry:"Jun 2025", joined:"Dec 2023", checkins:67,  trainer:"Anjali Sharma", gender:"Female", age:29 },
  { id:7,  name:"Karan Mehta",   email:"karan@email.com",   phone:"9876543216", plan:"Quarterly",   status:"suspended", expiry:"May 2025", joined:"Feb 2025", checkins:8,   trainer:"—",             gender:"Male",   age:22 },
  { id:8,  name:"Deepa Nair",    email:"deepa@email.com",   phone:"9876543217", plan:"Annual",      status:"active",    expiry:"Dec 2025", joined:"Dec 2023", checkins:104, trainer:"Vikram Singh",  gender:"Female", age:33 },
  { id:9,  name:"Ravi Sharma",   email:"ravi@email.com",    phone:"9876543218", plan:"Monthly",     status:"active",    expiry:"May 2025", joined:"May 2025", checkins:3,   trainer:"—",             gender:"Male",   age:27 },
  { id:10, name:"Divya Singh",   email:"divya@email.com",   phone:"9876543219", plan:"Annual",      status:"active",    expiry:"Mar 2026", joined:"Mar 2025", checkins:31,  trainer:"Anjali Sharma", gender:"Female", age:30 },
  { id:11, name:"Vikash Nair",   email:"vikash@email.com",  phone:"9876543220", plan:"Quarterly",   status:"active",    expiry:"Jul 2025", joined:"Apr 2025", checkins:18,  trainer:"Suresh Iyer",   gender:"Male",   age:25 },
  { id:12, name:"Pooja Reddy",   email:"pooja@email.com",   phone:"9876543221", plan:"Monthly",     status:"inactive",  expiry:"Mar 2025", joined:"Feb 2025", checkins:2,   trainer:"—",             gender:"Female", age:23 },
];

// ── Attendance Logs ──────────────────────────────────────────
export const attendanceLogs = [
  { id:1,  member:"Aryan Mehta",  date:"May 6, 2026",  checkIn:"6:02 AM",  checkOut:"7:45 AM",  duration:"1h 43m", class:"HIIT Blast"       },
  { id:2,  member:"Priya Sharma", date:"May 6, 2026",  checkIn:"7:30 AM",  checkOut:"8:30 AM",  duration:"1h 00m", class:"Power Yoga"        },
  { id:3,  member:"Neha Joshi",   date:"May 6, 2026",  checkIn:"6:15 AM",  checkOut:"7:30 AM",  duration:"1h 15m", class:"HIIT Blast"        },
  { id:4,  member:"Deepa Nair",   date:"May 6, 2026",  checkIn:"9:00 AM",  checkOut:"10:15 AM", duration:"1h 15m", class:"Strength Builder"  },
  { id:5,  member:"Rahul Gupta",  date:"May 6, 2026",  checkIn:"5:30 PM",  checkOut:"7:00 PM",  duration:"1h 30m", class:"CrossFit Pro"      },
  { id:6,  member:"Sunita Rao",   date:"May 5, 2026",  checkIn:"7:30 AM",  checkOut:"8:45 AM",  duration:"1h 15m", class:"Power Yoga"        },
  { id:7,  member:"Vikash Nair",  date:"May 5, 2026",  checkIn:"6:00 PM",  checkOut:"7:30 PM",  duration:"1h 30m", class:"CrossFit Pro"      },
  { id:8,  member:"Divya Singh",  date:"May 5, 2026",  checkIn:"8:00 AM",  checkOut:"9:00 AM",  duration:"1h 00m", class:"Zumba Dance"       },
  { id:9,  member:"Aryan Mehta",  date:"May 4, 2026",  checkIn:"6:05 AM",  checkOut:"7:50 AM",  duration:"1h 45m", class:"HIIT Blast"        },
  { id:10, member:"Ravi Sharma",  date:"May 4, 2026",  checkIn:"7:00 PM",  checkOut:"8:30 PM",  duration:"1h 30m", class:"Zumba Dance"       },
];

// ── Trainers / Staff ─────────────────────────────────────────
export const trainers = [
  { id:1, name:"Vikram Singh",  role:"Senior Trainer",    specialization:"Bodybuilding & CrossFit", clients:8,  sessions:62, rating:4.9, status:"active",   joined:"Jan 2022", avatar:"VS", permissions:{ members:true,  billing:true,  reports:true  } },
  { id:2, name:"Anjali Sharma", role:"Fitness Trainer",   specialization:"Yoga & Pilates",          clients:6,  sessions:48, rating:4.7, status:"active",   joined:"Mar 2022", avatar:"AS", permissions:{ members:true,  billing:false, reports:false } },
  { id:3, name:"Suresh Iyer",   role:"Cardio Specialist", specialization:"HIIT & Cardio",           clients:5,  sessions:40, rating:4.6, status:"active",   joined:"Jun 2022", avatar:"SI", permissions:{ members:true,  billing:false, reports:false } },
  { id:4, name:"Meena Patel",   role:"Reception",         specialization:"Front Desk",              clients:0,  sessions:0,  rating:4.8, status:"active",   joined:"Aug 2022", avatar:"MP", permissions:{ members:true,  billing:true,  reports:false } },
  { id:5, name:"Rohit Das",     role:"Trainer",           specialization:"Strength & Conditioning", clients:4,  sessions:31, rating:4.5, status:"on_leave", joined:"Nov 2022", avatar:"RD", permissions:{ members:false, billing:false, reports:false } },
];

// ── Classes ──────────────────────────────────────────────────
export const classes = [
  { id:1, name:"HIIT Blast",       category:"Cardio",      trainer:"Suresh Iyer",   time:"6:00 AM", days:"Mon/Wed/Fri", capacity:20, enrolled:18, status:"active"   },
  { id:2, name:"Power Yoga",       category:"Yoga",        trainer:"Anjali Sharma", time:"7:30 AM", days:"Tue/Thu/Sat", capacity:15, enrolled:12, status:"active"   },
  { id:3, name:"Strength Builder", category:"Strength",    trainer:"Vikram Singh",  time:"9:00 AM", days:"Mon–Fri",     capacity:12, enrolled:10, status:"active"   },
  { id:4, name:"Zumba Dance",      category:"Dance",       trainer:"Anjali Sharma", time:"5:30 PM", days:"Mon/Wed/Fri", capacity:25, enrolled:22, status:"active"   },
  { id:5, name:"CrossFit Pro",     category:"CrossFit",    trainer:"Vikram Singh",  time:"7:00 PM", days:"Tue/Thu",     capacity:10, enrolled:9,  status:"active"   },
  { id:6, name:"Morning Stretch",  category:"Flexibility", trainer:"Anjali Sharma", time:"6:30 AM", days:"Daily",       capacity:20, enrolled:8,  status:"inactive" },
];

// ── Class Bookings ───────────────────────────────────────────
export const classBookings = [
  { id:1,  member:"Aryan Mehta",  class:"HIIT Blast",       date:"May 6, 2026",  status:"confirmed" },
  { id:2,  member:"Priya Sharma", class:"Power Yoga",       date:"May 6, 2026",  status:"confirmed" },
  { id:3,  member:"Neha Joshi",   class:"HIIT Blast",       date:"May 6, 2026",  status:"confirmed" },
  { id:4,  member:"Deepa Nair",   class:"Strength Builder", date:"May 6, 2026",  status:"confirmed" },
  { id:5,  member:"Rahul Gupta",  class:"CrossFit Pro",     date:"May 6, 2026",  status:"waitlisted"},
  { id:6,  member:"Sunita Rao",   class:"Power Yoga",       date:"May 7, 2026",  status:"confirmed" },
  { id:7,  member:"Vikash Nair",  class:"CrossFit Pro",     date:"May 7, 2026",  status:"confirmed" },
  { id:8,  member:"Divya Singh",  class:"Zumba Dance",      date:"May 7, 2026",  status:"cancelled" },
  { id:9,  member:"Ravi Sharma",  class:"Zumba Dance",      date:"May 8, 2026",  status:"confirmed" },
  { id:10, member:"Pooja Reddy",  class:"Morning Stretch",  date:"May 8, 2026",  status:"cancelled" },
];

// ── Enquiries ────────────────────────────────────────────────
export const enquiries = [
  { id:1, name:"Deepak Singh",  email:"deepak@email.com", phone:"9876543210", interest:"Annual Plan",       date:"May 4, 2026", status:"new",           followUp:"",                  source:"Walk-in"  },
  { id:2, name:"Meera Patel",   email:"meera@email.com",  phone:"9876543211", interest:"Personal Training", date:"May 3, 2026", status:"contacted",     followUp:"Called, interested", source:"Website"  },
  { id:3, name:"Suresh Kumar",  email:"suresh@email.com", phone:"9876543212", interest:"Monthly Plan",      date:"May 2, 2026", status:"converted",     followUp:"Joined as member",   source:"Referral" },
  { id:4, name:"Anita Sharma",  email:"anita@email.com",  phone:"9876543213", interest:"Yoga Classes",      date:"May 1, 2026", status:"not_interested",followUp:"Not interested",     source:"Instagram"},
  { id:5, name:"Nikhil Verma",  email:"nikhil@email.com", phone:"9876543219", interest:"Half-Yearly Plan",  date:"May 5, 2026", status:"new",           followUp:"",                  source:"Walk-in"  },
  { id:6, name:"Pooja Reddy",   email:"pooja@email.com",  phone:"9876543220", interest:"CrossFit Classes",  date:"May 5, 2026", status:"contacted",     followUp:"Sent brochure",      source:"Facebook" },
  { id:7, name:"Arun Mishra",   email:"arun@email.com",   phone:"9876543221", interest:"Annual Plan",       date:"May 6, 2026", status:"new",           followUp:"",                  source:"Google"   },
  { id:8, name:"Kavya Nair",    email:"kavya@email.com",  phone:"9876543222", interest:"Quarterly Plan",    date:"May 6, 2026", status:"contacted",     followUp:"Demo scheduled",     source:"Referral" },
];

// ── Equipment ────────────────────────────────────────────────
export const equipmentLog = [
  { id:1, name:"Treadmill #1",      category:"Cardio",   status:"operational", lastService:"Apr 10", nextService:"Jul 10", issue:""                 },
  { id:2, name:"Treadmill #3",      category:"Cardio",   status:"maintenance", lastService:"Apr 20", nextService:"May 20", issue:"Belt worn out"    },
  { id:3, name:"Bench Press #2",    category:"Strength", status:"operational", lastService:"Mar 15", nextService:"Jun 15", issue:""                 },
  { id:4, name:"Rowing Machine #1", category:"Cardio",   status:"out_of_order",lastService:"Apr 1",  nextService:"ASAP",   issue:"Motor failure"    },
  { id:5, name:"Leg Press #1",      category:"Strength", status:"operational", lastService:"Apr 10", nextService:"Jul 10", issue:""                 },
  { id:6, name:"Spin Bike #2",      category:"Cardio",   status:"maintenance", lastService:"May 1",  nextService:"May 15", issue:"Resistance issue" },
  { id:7, name:"Cable Machine #1",  category:"Strength", status:"operational", lastService:"Mar 20", nextService:"Jun 20", issue:""                 },
];

// ── Maintenance Logs ─────────────────────────────────────────
export const maintenanceLogs = [
  { id:1, equipment:"Treadmill #3",      type:"Repair",    tech:"TechFix Co.",  date:"Apr 20, 2026", status:"in-progress", cost:"$280" },
  { id:2, equipment:"Rowing Machine #1", type:"Emergency", tech:"Pending",      date:"May 6, 2026",  status:"pending",     cost:"TBD"  },
  { id:3, equipment:"Spin Bike #2",      type:"Routine",   tech:"Arun Sharma",  date:"May 1, 2026",  status:"in-progress", cost:"$95"  },
  { id:4, equipment:"Treadmill #1",      type:"Routine",   tech:"Arun Sharma",  date:"Apr 10, 2026", status:"completed",   cost:"$120" },
  { id:5, equipment:"Bench Press #2",    type:"Routine",   tech:"Arun Sharma",  date:"Mar 15, 2026", status:"completed",   cost:"$80"  },
];

// ── Pending Payments ─────────────────────────────────────────
export const pendingPayments = [
  { member:"Amit Patel",   plan:"Monthly",     amount:"$39",  due:"Apr 30", days:5,  email:"amit@email.com"   },
  { member:"Karan Mehta",  plan:"Quarterly",   amount:"$99",  due:"May 1",  days:4,  email:"karan@email.com"  },
  { member:"Ravi Sharma",  plan:"Half-Yearly", amount:"$179", due:"May 5",  days:0,  email:"ravi@email.com"   },
  { member:"Sunita Rao",   plan:"Half-Yearly", amount:"$179", due:"May 10", days:-5, email:"sunita@email.com" },
];

// ── Completed Payments ───────────────────────────────────────
export const completedPayments = [
  { id:"PAY001", member:"Aryan Mehta",  plan:"Half-Yearly", amount:"$179", date:"Jan 1, 2026",  method:"Card",       status:"paid" },
  { id:"PAY002", member:"Neha Joshi",   plan:"Annual",      amount:"$299", date:"Nov 1, 2025",  method:"UPI",        status:"paid" },
  { id:"PAY003", member:"Deepa Nair",   plan:"Annual",      amount:"$299", date:"Dec 1, 2025",  method:"NetBanking", status:"paid" },
  { id:"PAY004", member:"Sunita Rao",   plan:"Half-Yearly", amount:"$179", date:"Dec 1, 2025",  method:"Card",       status:"paid" },
  { id:"PAY005", member:"Divya Singh",  plan:"Annual",      amount:"$299", date:"Mar 1, 2026",  method:"UPI",        status:"paid" },
  { id:"PAY006", member:"Vikash Nair",  plan:"Quarterly",   amount:"$99",  date:"Apr 1, 2026",  method:"Card",       status:"paid" },
  { id:"PAY007", member:"Rahul Gupta",  plan:"Quarterly",   amount:"$99",  date:"Mar 1, 2026",  method:"Card",       status:"paid" },
  { id:"PAY008", member:"Priya Sharma", plan:"Monthly",     amount:"$39",  date:"Apr 1, 2026",  method:"UPI",        status:"paid" },
];

// ── Due Renewals ─────────────────────────────────────────────
export const dueRenewals = [
  { member:"Priya Sharma", plan:"Monthly",   expiry:"May 31", daysLeft:26 },
  { member:"Rahul Gupta",  plan:"Quarterly", expiry:"Jun 15", daysLeft:41 },
  { member:"Ravi Sharma",  plan:"Monthly",   expiry:"May 31", daysLeft:26 },
  { member:"Amit Patel",   plan:"Monthly",   expiry:"Expired",daysLeft:0  },
  { member:"Karan Mehta",  plan:"Quarterly", expiry:"May 15", daysLeft:10 },
];

// ── Attendance (last 7 days) ─────────────────────────────────
export const attendanceData = [
  { day:"Mon", checkins:128 },
  { day:"Tue", checkins:142 },
  { day:"Wed", checkins:156 },
  { day:"Thu", checkins:138 },
  { day:"Fri", checkins:165 },
  { day:"Sat", checkins:189 },
  { day:"Sun", checkins:97  },
];

// ── Popular classes ──────────────────────────────────────────
export const popularClasses = [
  { name:"HIIT Blast",       bookings:312, fill:90 },
  { name:"Zumba Dance",      bookings:287, fill:82 },
  { name:"CrossFit Pro",     bookings:241, fill:75 },
  { name:"Power Yoga",       bookings:198, fill:60 },
  { name:"Strength Builder", bookings:176, fill:55 },
];

// ── Notifications ────────────────────────────────────────────
export const notificationsData = [
  { id:1, type:"expiry",   title:"Membership Expiring",   message:"Priya Sharma's membership expires in 3 days",    time:"2 min ago",  read:false },
  { id:2, type:"payment",  title:"Payment Failed",        message:"Karan Mehta's payment of $99 failed",            time:"15 min ago", read:false },
  { id:3, type:"class",    title:"Class Cancelled",       message:"Morning Stretch on May 7 has been cancelled",    time:"1 hr ago",   read:true  },
  { id:4, type:"checkin",  title:"New Check-in",          message:"Aryan Mehta checked in at 6:02 AM",              time:"2 hr ago",   read:true  },
  { id:5, type:"expiry",   title:"Membership Expiring",   message:"Ravi Sharma's membership expires in 26 days",    time:"Yesterday",  read:true  },
  { id:6, type:"payment",  title:"Payment Received",      message:"Divya Singh paid $299 for Annual plan",          time:"Yesterday",  read:true  },
];

// ── Coupons ──────────────────────────────────────────────────
export const coupons = [
  { id:1, code:"SUMMER20",  discount:"20%",  type:"percentage", minAmount:50,  uses:34,  maxUses:100, expiry:"Jun 30, 2026", status:"active"   },
  { id:2, code:"FLAT500",   discount:"$50",  type:"flat",       minAmount:100, uses:12,  maxUses:50,  expiry:"May 31, 2026", status:"active"   },
  { id:3, code:"NEWJOIN10", discount:"10%",  type:"percentage", minAmount:0,   uses:89,  maxUses:200, expiry:"Dec 31, 2026", status:"active"   },
  { id:4, code:"REFER25",   discount:"25%",  type:"percentage", minAmount:75,  uses:50,  maxUses:50,  expiry:"Apr 30, 2026", status:"expired"  },
  { id:5, code:"ANNUAL15",  discount:"15%",  type:"percentage", minAmount:200, uses:8,   maxUses:30,  expiry:"Jul 31, 2026", status:"active"   },
];

// ── Discounts / Offers ───────────────────────────────────────
export const discounts = [
  { id:1, name:"Summer Fitness Drive",  type:"Seasonal",   discount:"20% off all plans",    validity:"Jun 1 – Jun 30, 2026",  status:"upcoming", target:"All Members"    },
  { id:2, name:"Referral Bonus",        type:"Referral",   discount:"1 month free",         validity:"Ongoing",               status:"active",   target:"Existing Members"},
  { id:3, name:"Student Discount",      type:"Segment",    discount:"$10 off monthly plan", validity:"Ongoing",               status:"active",   target:"Students"       },
  { id:4, name:"Corporate Package",     type:"Corporate",  discount:"15% off bulk plans",   validity:"Ongoing",               status:"active",   target:"Corporate"      },
  { id:5, name:"New Year Offer",        type:"Seasonal",   discount:"30% off annual plan",  validity:"Jan 1 – Jan 15, 2026",  status:"expired",  target:"All Members"    },
];

// ── Weekly Schedule ──────────────────────────────────────────
export const weeklySchedule = {
  Mon: [
    { time:"6:00 AM", class:"HIIT Blast",       trainer:"Suresh Iyer",   capacity:20, enrolled:18 },
    { time:"9:00 AM", class:"Strength Builder", trainer:"Vikram Singh",  capacity:12, enrolled:10 },
    { time:"5:30 PM", class:"Zumba Dance",      trainer:"Anjali Sharma", capacity:25, enrolled:22 },
  ],
  Tue: [
    { time:"7:30 AM", class:"Power Yoga",       trainer:"Anjali Sharma", capacity:15, enrolled:12 },
    { time:"9:00 AM", class:"Strength Builder", trainer:"Vikram Singh",  capacity:12, enrolled:10 },
    { time:"7:00 PM", class:"CrossFit Pro",     trainer:"Vikram Singh",  capacity:10, enrolled:9  },
  ],
  Wed: [
    { time:"6:00 AM", class:"HIIT Blast",       trainer:"Suresh Iyer",   capacity:20, enrolled:18 },
    { time:"6:30 AM", class:"Morning Stretch",  trainer:"Anjali Sharma", capacity:20, enrolled:8  },
    { time:"5:30 PM", class:"Zumba Dance",      trainer:"Anjali Sharma", capacity:25, enrolled:22 },
  ],
  Thu: [
    { time:"7:30 AM", class:"Power Yoga",       trainer:"Anjali Sharma", capacity:15, enrolled:12 },
    { time:"9:00 AM", class:"Strength Builder", trainer:"Vikram Singh",  capacity:12, enrolled:10 },
    { time:"7:00 PM", class:"CrossFit Pro",     trainer:"Vikram Singh",  capacity:10, enrolled:9  },
  ],
  Fri: [
    { time:"6:00 AM", class:"HIIT Blast",       trainer:"Suresh Iyer",   capacity:20, enrolled:18 },
    { time:"9:00 AM", class:"Strength Builder", trainer:"Vikram Singh",  capacity:12, enrolled:10 },
    { time:"5:30 PM", class:"Zumba Dance",      trainer:"Anjali Sharma", capacity:25, enrolled:22 },
  ],
  Sat: [
    { time:"7:30 AM", class:"Power Yoga",       trainer:"Anjali Sharma", capacity:15, enrolled:12 },
    { time:"6:30 AM", class:"Morning Stretch",  trainer:"Anjali Sharma", capacity:20, enrolled:8  },
  ],
  Sun: [],
};
