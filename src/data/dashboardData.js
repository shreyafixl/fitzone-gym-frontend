// ─── User Dashboard Data ──────────────────────────────────────────────────────

export const userData = {
  name: "Aryan Mehta",
  email: "aryan.mehta@email.com",
  avatar: "AM",
  memberSince: "Jan 2024",
  phone: "+91 98765 43210",
  plan: "Half-Yearly",
  membershipPlan: "Half-Yearly",
  membershipExpiry: "2025-08-15",
  planExpiry: "Aug 15, 2025",
  daysLeft: 104,
  memberId: "FZ-2024-0847",
  streak: 14,
  attendanceStreak: 14,
  bmi: 22.4,
  fitnessScore: 78,
  weight: 72,
  height: 175,
  targetWeight: 70,
  totalSessions: 48,
  caloriesBurned: 24800,
  assignedTrainer: 4,
};

export const quickStats = [
  { label: "Sessions Attended", value: 48, icon: "🏋️", change: "+6 this month", color: "#f97316" },
  { label: "Calories Burned", value: "24,800", icon: "🔥", change: "+1,200 this week", color: "#ef4444" },
  { label: "Weight Progress", value: "-4.2 kg", icon: "⚖️", change: "Since joining", color: "#22c55e" },
  { label: "Active Days", value: 22, icon: "📅", change: "This month", color: "#3b82f6" },
];

export const upcomingBookings = [
  { id: 1, class: "HIIT Blast", trainer: "Rohit Verma", date: "Today", time: "6:00 PM", status: "confirmed", type: "Group Class", slot: "12/15" },
  { id: 2, class: "Personal Training", trainer: "Vikram Singh", date: "Tomorrow", time: "7:30 AM", status: "confirmed", type: "PT Session", slot: "1/1" },
  { id: 3, class: "Yoga Flow", trainer: "Anjali Sharma", date: "Wed, May 7", time: "8:00 AM", status: "pending", type: "Group Class", slot: "8/15" },
  { id: 4, class: "Strength Builder", trainer: "Vikram Singh", date: "Fri, May 9", time: "5:30 PM", status: "confirmed", type: "Group Class", slot: "10/15" },
];

export const weightLog = [
  { date: "Jan 1", weight: 76.2 },
  { date: "Jan 15", weight: 75.4 },
  { date: "Feb 1", weight: 74.8 },
  { date: "Feb 15", weight: 74.1 },
  { date: "Mar 1", weight: 73.5 },
  { date: "Mar 15", weight: 73.0 },
  { date: "Apr 1", weight: 72.6 },
  { date: "Apr 15", weight: 72.0 },
  { date: "May 1", weight: 72.0 },
];

export const measurements = [
  { part: "Chest", current: "96 cm", start: "102 cm", change: "-6 cm" },
  { part: "Waist", current: "82 cm", start: "89 cm", change: "-7 cm" },
  { part: "Hips", current: "94 cm", start: "97 cm", change: "-3 cm" },
  { part: "Arms", current: "35 cm", start: "33 cm", change: "+2 cm" },
  { part: "Thighs", current: "56 cm", start: "59 cm", change: "-3 cm" },
];

export const workoutHistory = [
  { id: 1, date: "May 3, 2025", class: "HIIT Blast", trainer: "Rohit Verma", duration: "30 min", calories: 420, rating: 5 },
  { id: 2, date: "May 1, 2025", class: "Strength Builder", trainer: "Vikram Singh", duration: "60 min", calories: 380, rating: 4 },
  { id: 3, date: "Apr 29, 2025", class: "Yoga Flow", trainer: "Anjali Sharma", duration: "45 min", calories: 210, rating: 5 },
  { id: 4, date: "Apr 27, 2025", class: "Boxing Basics", trainer: "Arjun Rao", duration: "40 min", calories: 390, rating: 4 },
  { id: 5, date: "Apr 25, 2025", class: "Cardio Burn", trainer: "Priya Mehta", duration: "35 min", calories: 310, rating: 3 },
  { id: 6, date: "Apr 23, 2025", class: "CrossFit Challenge", trainer: "Vikram Singh", duration: "60 min", calories: 510, rating: 5 },
];

export const weeklySchedule = [
  {
    day: "Mon",
    classes: [
      { time: "6:00 AM", name: "Yoga Flow", trainer: "Anjali", status: "available", spots: 8 },
      { time: "5:30 PM", name: "HIIT Blast", trainer: "Rohit", status: "live", spots: 3 },
      { time: "7:00 PM", name: "Strength Builder", trainer: "Vikram", status: "available", spots: 5 },
    ]
  },
  {
    day: "Tue",
    classes: [
      { time: "7:00 AM", name: "Cardio Burn", trainer: "Priya", status: "available", spots: 12 },
      { time: "6:00 PM", name: "Boxing Basics", trainer: "Arjun", status: "booked", spots: 0 },
    ]
  },
  {
    day: "Wed",
    classes: [
      { time: "8:00 AM", name: "Yoga Flow", trainer: "Anjali", status: "booked", spots: 0 },
      { time: "5:00 PM", name: "Zumba Dance", trainer: "Neha", status: "available", spots: 6 },
      { time: "7:00 PM", name: "Pilates Core", trainer: "Simran", status: "available", spots: 9 },
    ]
  },
  {
    day: "Thu",
    classes: [
      { time: "6:30 AM", name: "Functional Fitness", trainer: "Arjun", status: "available", spots: 7 },
      { time: "6:00 PM", name: "HIIT Blast", trainer: "Rohit", status: "full", spots: 0 },
    ]
  },
  {
    day: "Fri",
    classes: [
      { time: "7:00 AM", name: "Strength Builder", trainer: "Vikram", status: "available", spots: 4 },
      { time: "5:30 PM", name: "Strength Builder", trainer: "Vikram", status: "booked", spots: 0 },
      { time: "7:30 PM", name: "CrossFit Challenge", trainer: "Vikram", status: "available", spots: 2 },
    ]
  },
  {
    day: "Sat",
    classes: [
      { time: "9:00 AM", name: "Zumba Dance", trainer: "Neha", status: "available", spots: 10 },
      { time: "11:00 AM", name: "Yoga Flow", trainer: "Anjali", status: "available", spots: 11 },
    ]
  },
  {
    day: "Sun",
    classes: [
      { time: "10:00 AM", name: "Bodybuilding Basics", trainer: "Rohit", status: "available", spots: 8 },
    ]
  },
];

export const assignedTrainer = {
  name: "Vikram Singh",
  specialization: "Bodybuilding & CrossFit",
  experience: "9 Years",
  certification: "ISSA Certified, CrossFit Level 2",
  image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
  nextSession: "Tomorrow, 7:30 AM",
  totalSessions: 18,
  rating: 4.9,
  messages: [
    { from: "trainer", text: "Great work on the deadlifts today! Keep that form consistent.", time: "2h ago" },
    { from: "user", text: "Thanks! Should I increase the weight next session?", time: "1h ago" },
    { from: "trainer", text: "Yes, let's go up by 5kg. You're ready for it 💪", time: "45m ago" },
  ]
};

export const paymentHistory = [
  { id: "INV-2026-004", date: "May 1, 2026",  plan: "Half-Yearly Plan", amount: "$179.00", status: "paid" },
  { id: "INV-2026-003", date: "Nov 15, 2025", plan: "Half-Yearly Plan", amount: "$179.00", status: "paid" },
  { id: "INV-2026-002", date: "May 15, 2025", plan: "Quarterly Plan",   amount: "$99.00",  status: "paid" },
  { id: "INV-2026-001", date: "Jan 1, 2025",  plan: "Monthly Plan",     amount: "$39.00",  status: "paid" },
];

// ─── Goals ────────────────────────────────────────────────────────────────────
export const userGoals = [
  { id:1, title:"Lose 5kg", type:"weight_loss", target:"70 kg", current:"72 kg", deadline:"Aug 2026", progress:60, status:"in-progress" },
  { id:2, title:"Run 5K under 28 min", type:"cardio", target:"28 min", current:"31 min", deadline:"Jul 2026", progress:45, status:"in-progress" },
  { id:3, title:"Bench Press 100kg", type:"strength", target:"100 kg", current:"80 kg", deadline:"Sep 2026", progress:80, status:"in-progress" },
  { id:4, title:"Attend 20 sessions/month", type:"consistency", target:"20", current:"14", deadline:"May 2026", progress:70, status:"in-progress" },
  { id:5, title:"Reduce body fat to 15%", type:"body_comp", target:"15%", current:"18%", deadline:"Oct 2026", progress:40, status:"in-progress" },
];

// ─── Assigned Workout Plan ────────────────────────────────────────────────────
export const assignedPlan = {
  name: "Intermediate Strength Builder",
  level: "Intermediate",
  assignedBy: "Vikram Singh",
  assignedDate: "Jan 15, 2026",
  duration: "12 weeks",
  progress: 72,
  days: [
    { day:"Monday", focus:"Chest & Triceps", exercises:[
      { name:"Bench Press", sets:4, reps:"8-10", rest:"90s", weight:"70kg" },
      { name:"Incline Dumbbell Press", sets:3, reps:"10-12", rest:"60s", weight:"24kg" },
      { name:"Cable Flyes", sets:3, reps:"12-15", rest:"45s", weight:"15kg" },
      { name:"Tricep Dips", sets:3, reps:"12", rest:"60s", weight:"BW" },
      { name:"Skull Crushers", sets:3, reps:"10-12", rest:"60s", weight:"30kg" },
    ]},
    { day:"Wednesday", focus:"Back & Biceps", exercises:[
      { name:"Deadlift", sets:4, reps:"5-6", rest:"120s", weight:"100kg" },
      { name:"Pull-ups", sets:3, reps:"8-10", rest:"90s", weight:"BW" },
      { name:"Barbell Row", sets:4, reps:"8-10", rest:"90s", weight:"60kg" },
      { name:"Bicep Curl", sets:3, reps:"12-15", rest:"45s", weight:"16kg" },
      { name:"Hammer Curl", sets:3, reps:"12", rest:"45s", weight:"14kg" },
    ]},
    { day:"Friday", focus:"Legs & Shoulders", exercises:[
      { name:"Barbell Squat", sets:4, reps:"8-10", rest:"120s", weight:"80kg" },
      { name:"Leg Press", sets:3, reps:"12-15", rest:"90s", weight:"120kg" },
      { name:"Romanian Deadlift", sets:3, reps:"10-12", rest:"90s", weight:"60kg" },
      { name:"Shoulder Press", sets:4, reps:"8-10", rest:"90s", weight:"50kg" },
      { name:"Lateral Raises", sets:3, reps:"15", rest:"45s", weight:"10kg" },
    ]},
  ]
};

// ─── Gym Attendance ───────────────────────────────────────────────────────────
export const gymAttendance = [
  { id:1, date:"May 6, 2026",  checkIn:"6:02 AM", checkOut:"7:18 AM", duration:"76 min", activity:"Strength Training" },
  { id:2, date:"May 5, 2026",  checkIn:"5:58 AM", checkOut:"7:05 AM", duration:"67 min", activity:"HIIT Blast" },
  { id:3, date:"May 3, 2026",  checkIn:"6:10 AM", checkOut:"7:30 AM", duration:"80 min", activity:"Personal Training" },
  { id:4, date:"May 1, 2026",  checkIn:"5:55 AM", checkOut:"6:55 AM", duration:"60 min", activity:"Yoga Flow" },
  { id:5, date:"Apr 29, 2026", checkIn:"6:00 AM", checkOut:"7:10 AM", duration:"70 min", activity:"Strength Training" },
  { id:6, date:"Apr 27, 2026", checkIn:"6:05 AM", checkOut:"7:20 AM", duration:"75 min", activity:"Boxing Basics" },
  { id:7, date:"Apr 25, 2026", checkIn:"6:00 AM", checkOut:"6:50 AM", duration:"50 min", activity:"Cardio Burn" },
  { id:8, date:"Apr 23, 2026", checkIn:"5:50 AM", checkOut:"7:00 AM", duration:"70 min", activity:"CrossFit" },
];

// ─── Diet Plan ────────────────────────────────────────────────────────────────
export const dietPlan = {
  assignedBy: "Vikram Singh",
  goal: "Muscle Gain",
  calories: 2800,
  protein: "180g",
  carbs: "320g",
  fat: "80g",
  meals: [
    { meal:"Breakfast",    time:"7:00 AM",  foods:["Oats (80g)","Eggs x3","Banana","Whey Protein"],              calories:620, protein:"42g" },
    { meal:"Mid-Morning",  time:"10:30 AM", foods:["Greek Yogurt","Mixed Nuts (30g)","Apple"],                    calories:280, protein:"18g" },
    { meal:"Lunch",        time:"1:00 PM",  foods:["Chicken Breast (200g)","Brown Rice (150g)","Broccoli"],       calories:720, protein:"52g" },
    { meal:"Pre-Workout",  time:"4:30 PM",  foods:["Banana","Peanut Butter Toast","Black Coffee"],                calories:320, protein:"12g" },
    { meal:"Post-Workout", time:"7:30 PM",  foods:["Whey Protein Shake","Milk (300ml)","Dates x3"],               calories:380, protein:"38g" },
    { meal:"Dinner",       time:"9:00 PM",  foods:["Salmon (180g)","Sweet Potato","Spinach Salad"],               calories:480, protein:"42g" },
  ]
};

// ─── Meal Log ─────────────────────────────────────────────────────────────────
export const mealLog = [
  { id:1, date:"May 6, 2026", meal:"Breakfast", food:"Oats + Eggs + Banana",    calories:580, protein:"38g", logged:true  },
  { id:2, date:"May 6, 2026", meal:"Lunch",     food:"Chicken Rice + Salad",     calories:680, protein:"48g", logged:true  },
  { id:3, date:"May 6, 2026", meal:"Snack",     food:"Protein Shake + Almonds",  calories:320, protein:"28g", logged:true  },
  { id:4, date:"May 6, 2026", meal:"Dinner",    food:"Salmon + Sweet Potato",    calories:480, protein:"42g", logged:false },
];

// ─── Water Intake ─────────────────────────────────────────────────────────────
export const waterData = {
  target: 3.0,
  today: 2.2,
  log: [2.5, 3.0, 2.8, 3.0, 2.2, 2.9, 2.2],
  days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = [
  { id:1, type:"session",  title:"Class Reminder",       message:"HIIT Blast starts in 30 minutes at 6:00 PM",       time:"30 min ago", read:false },
  { id:2, type:"trainer",  title:"Message from Vikram",  message:"Great work today! Check your updated plan.",        time:"2 hr ago",   read:false },
  { id:3, type:"payment",  title:"Payment Due",          message:"Your Half-Yearly plan renews on Aug 15, 2026",      time:"1 day ago",  read:false },
  { id:4, type:"goal",     title:"Goal Progress",        message:"You're 80% toward your Bench Press goal!",          time:"2 days ago", read:true  },
  { id:5, type:"announce", title:"Gym Announcement",     message:"Gym will be closed May 10 for maintenance",         time:"2 days ago", read:true  },
  { id:6, type:"session",  title:"Session Completed",    message:"Personal Training with Vikram — 76 min",            time:"3 days ago", read:true  },
];

// ─── Offers & Coupons ─────────────────────────────────────────────────────────
export const offers = [
  { id:1, code:"LOYAL20",  discount:"20% OFF",   description:"Loyalty discount on annual plan renewal",  expiry:"Jun 30, 2026", valid:true  },
  { id:2, code:"REFER15",  discount:"15% OFF",   description:"Referral reward — refer a friend",          expiry:"Jul 15, 2026", valid:true  },
  { id:3, code:"SUMMER10", discount:"10% OFF",   description:"Summer special on any plan upgrade",        expiry:"Aug 31, 2026", valid:true  },
  { id:4, code:"FIRSTPT",  discount:"1 Free PT", description:"First personal training session free",      expiry:"May 31, 2026", valid:false },
];

// ─── Monthly Progress ─────────────────────────────────────────────────────────
export const monthlyProgress = {
  sessions: [8,10,9,12,11,14,13,15,12,14,16,14],
  calories: [3200,4100,3800,5200,4900,6100,5800,6400,5900,6200,7100,6800],
  weight:   [76.2,75.4,74.8,74.1,73.5,73.0,72.6,72.0,72.0,71.8,71.5,71.2],
  months:   ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"],
};

// ─── Booking History ─────────────────────────────────────────────────────────
export const bookingHistory = [
  { id:1, class:"HIIT Blast",          trainer:"Rohit Verma",   date:"May 3, 2026",  time:"6:00 PM", status:"completed", type:"Group Class" },
  { id:2, class:"Personal Training",   trainer:"Vikram Singh",  date:"May 1, 2026",  time:"7:30 AM", status:"completed", type:"PT Session"  },
  { id:3, class:"Yoga Flow",           trainer:"Anjali Sharma", date:"Apr 29, 2026", time:"8:00 AM", status:"completed", type:"Group Class" },
  { id:4, class:"Boxing Basics",       trainer:"Arjun Rao",     date:"Apr 27, 2026", time:"5:00 PM", status:"completed", type:"Group Class" },
  { id:5, class:"Strength Builder",    trainer:"Vikram Singh",  date:"Apr 25, 2026", time:"5:30 PM", status:"cancelled", type:"Group Class" },
  { id:6, class:"CrossFit Challenge",  trainer:"Vikram Singh",  date:"Apr 23, 2026", time:"6:00 PM", status:"completed", type:"Group Class" },
];

// ─── User Settings ────────────────────────────────────────────────────────────
export const userSettings = {
  emailNotif: true, smsAlerts: false, sessionReminders: true,
  trainerMessages: true, paymentAlerts: true, darkMode: false,
  language: "English", timezone: "IST (UTC+5:30)",
};
