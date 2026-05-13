// ─── Trainer Info ─────────────────────────────────────────────────────────────
export const trainerInfo = {
  name: "Vikram Singh", role: "Senior Trainer", avatar: "VS",
  specialization: "Bodybuilding & CrossFit", experience: "9 Years",
  rating: 4.9, totalClients: 24, activeClients: 18, todayRevenue: 590,
  monthRevenue: 8400, sessionsThisMonth: 62,
  email: "vikram@fitzone.com", phone: "+91 98765 43210",
  bio: "Certified personal trainer with 9 years of experience in bodybuilding, CrossFit, and strength conditioning.",
  certifications: ["NASM-CPT", "CrossFit Level 2", "Nutrition Coach", "First Aid & CPR"],
  languages: ["English", "Hindi", "Punjabi"],
  workingHours: "Mon-Sat: 6:00 AM - 9:00 PM",
};

// ─── Today's Schedule ─────────────────────────────────────────────────────────
export const todaySchedule = [
  { id:1, time:"6:00 AM",  client:"Aryan Mehta",     type:"PT Session",   status:"completed", duration:"60 min" },
  { id:2, time:"7:30 AM",  client:"Priya Sharma",    type:"PT Session",   status:"completed", duration:"45 min" },
  { id:3, time:"9:00 AM",  client:"Group - HIIT",    type:"Group Class",  status:"ongoing",   duration:"30 min" },
  { id:4, time:"11:00 AM", client:"Rahul Gupta",     type:"PT Session",   status:"upcoming",  duration:"60 min" },
  { id:5, time:"5:30 PM",  client:"Group - Strength",type:"Group Class",  status:"upcoming",  duration:"60 min" },
  { id:6, time:"7:00 PM",  client:"Neha Joshi",      type:"PT Session",   status:"upcoming",  duration:"45 min" },
];

// ─── Pending Tasks ────────────────────────────────────────────────────────────
export const pendingTasks = [
  { id:1, task:"Mark attendance - HIIT Blast (9 AM)",  priority:"high",   done:false },
  { id:2, task:"Send progress report to Aryan Mehta",  priority:"medium", done:false },
  { id:3, task:"Update workout plan for Priya Sharma", priority:"medium", done:true  },
  { id:4, task:"Follow up with Rahul Gupta re: diet",  priority:"low",    done:false },
  { id:5, task:"Review new client intake form",        priority:"high",   done:false },
];

// ─── Clients ──────────────────────────────────────────────────────────────────
export const clients = [
  { id:1, name:"Aryan Mehta",  avatar:"AM", photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",  lastVisit:"Today",     progress:72, plan:"Strength Builder",   goal:"Muscle Gain",  status:"active",   sessions:18, weight:"72 kg", joined:"Jan 2024", age:28, phone:"9876543210", email:"aryan@email.com"  },
  { id:2, name:"Priya Sharma", avatar:"PS", photo:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",  lastVisit:"Yesterday", progress:58, plan:"Weight Loss",        goal:"Fat Loss",     status:"active",   sessions:12, weight:"61 kg", joined:"Feb 2024", age:24, phone:"9876543211", email:"priya@email.com"  },
  { id:3, name:"Rahul Gupta",  avatar:"RG", photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",  lastVisit:"3 days ago",progress:45, plan:"Beginner Fitness",   goal:"General Fit",  status:"active",   sessions:8,  weight:"85 kg", joined:"Mar 2024", age:31, phone:"9876543212", email:"rahul@email.com"  },
  { id:4, name:"Neha Joshi",   avatar:"NJ", photo:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",  lastVisit:"Today",     progress:88, plan:"Advanced CrossFit",  goal:"Performance",  status:"active",   sessions:31, weight:"58 kg", joined:"Nov 2023", age:26, phone:"9876543213", email:"neha@email.com"   },
  { id:5, name:"Amit Patel",   avatar:"AP", photo:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",  lastVisit:"1 week ago",progress:30, plan:"Beginner Fitness",   goal:"Weight Loss",  status:"inactive", sessions:5,  weight:"92 kg", joined:"Apr 2024", age:35, phone:"9876543214", email:"amit@email.com"   },
  { id:6, name:"Sunita Rao",   avatar:"SR", photo:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",     lastVisit:"2 days ago",progress:65, plan:"Yoga & Flexibility", goal:"Flexibility",  status:"active",   sessions:22, weight:"55 kg", joined:"Dec 2023", age:29, phone:"9876543215", email:"sunita@email.com" },
];

// ─── Client Progress Data ─────────────────────────────────────────────────────
export const clientProgressData = {
  1: { // Aryan Mehta
    weight:    [78, 77, 76.5, 75.8, 75, 74.2, 73.5, 72.8, 72.2, 72, 72, 72],
    bodyFat:   [22, 21.5, 21, 20.5, 20, 19.5, 19, 18.5, 18, 17.8, 17.5, 17.2],
    strength:  [60, 65, 68, 72, 75, 78, 80, 82, 84, 86, 88, 90],
    months:    ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"],
  },
  2: { // Priya Sharma
    weight:    [68, 67.5, 67, 66.5, 66, 65.5, 65, 64.5, 64, 63.5, 63, 62.5],
    bodyFat:   [28, 27.5, 27, 26.5, 26, 25.5, 25, 24.5, 24, 23.5, 23, 22.5],
    strength:  [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52],
    months:    ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"],
  },
};

// ─── Client Goals ─────────────────────────────────────────────────────────────
export const clientGoals = [
  { id:1, clientId:1, clientName:"Aryan Mehta",  goal:"Reach 70kg body weight",       type:"weight_loss",   target:"70 kg",  current:"72 kg",  deadline:"Jul 2026", status:"in-progress", progress:72 },
  { id:2, clientId:1, clientName:"Aryan Mehta",  goal:"Bench press 120kg",             type:"strength",      target:"120 kg", current:"100 kg", deadline:"Aug 2026", status:"in-progress", progress:83 },
  { id:3, clientId:2, clientName:"Priya Sharma", goal:"Lose 8kg body weight",          type:"weight_loss",   target:"60 kg",  current:"62.5 kg",deadline:"Jun 2026", status:"in-progress", progress:68 },
  { id:4, clientId:4, clientName:"Neha Joshi",   goal:"Complete 5K run under 25 min",  type:"cardio",        target:"25 min", current:"27 min", deadline:"Jun 2026", status:"in-progress", progress:85 },
  { id:5, clientId:4, clientName:"Neha Joshi",   goal:"Master muscle-up",              type:"strength",      target:"1 rep",  current:"Assisted",deadline:"Jul 2026",status:"in-progress", progress:60 },
  { id:6, clientId:3, clientName:"Rahul Gupta",  goal:"Lose 10kg",                     type:"weight_loss",   target:"75 kg",  current:"85 kg",  deadline:"Sep 2026", status:"in-progress", progress:30 },
  { id:7, clientId:6, clientName:"Sunita Rao",   goal:"Touch toes flexibility",        type:"flexibility",   target:"Full",   current:"75%",    deadline:"Jun 2026", status:"achieved",    progress:100 },
];

// ─── Client Attendance ────────────────────────────────────────────────────────
export const clientAttendance = [
  { id:1, clientId:1, clientName:"Aryan Mehta",  date:"May 6, 2026",  status:"present", session:"PT Session",   duration:"60 min" },
  { id:2, clientId:2, clientName:"Priya Sharma", date:"May 6, 2026",  status:"present", session:"PT Session",   duration:"45 min" },
  { id:3, clientId:4, clientName:"Neha Joshi",   date:"May 6, 2026",  status:"present", session:"PT Session",   duration:"45 min" },
  { id:4, clientId:3, clientName:"Rahul Gupta",  date:"May 5, 2026",  status:"absent",  session:"PT Session",   duration:"—"      },
  { id:5, clientId:1, clientName:"Aryan Mehta",  date:"May 5, 2026",  status:"present", session:"HIIT Blast",   duration:"30 min" },
  { id:6, clientId:6, clientName:"Sunita Rao",   date:"May 5, 2026",  status:"present", session:"Yoga Class",   duration:"60 min" },
  { id:7, clientId:5, clientName:"Amit Patel",   date:"May 4, 2026",  status:"absent",  session:"PT Session",   duration:"—"      },
  { id:8, clientId:2, clientName:"Priya Sharma", date:"May 4, 2026",  status:"present", session:"Zumba Dance",  duration:"45 min" },
];

// ─── Client Progress Notes ────────────────────────────────────────────────────
export const clientProgressNotes = [
  { date:"May 3",  note:"Increased deadlift to 100kg. Excellent form maintained throughout.", trainer:"Vikram" },
  { date:"Apr 26", note:"Completed 5k run in 28 mins. Cardio improving steadily.",            trainer:"Vikram" },
  { date:"Apr 19", note:"Struggling with pull-ups. Added assisted pull-up work to plan.",     trainer:"Vikram" },
];

// ─── Sessions ─────────────────────────────────────────────────────────────────
export const sessions = [
  { id:1,  client:"Aryan Mehta",  type:"PT Session",  date:"May 6, 2026",  time:"6:00 AM",  duration:"60 min", status:"completed", rating:5, notes:"Great session, hit new PR on deadlift" },
  { id:2,  client:"Priya Sharma", type:"PT Session",  date:"May 6, 2026",  time:"7:30 AM",  duration:"45 min", status:"completed", rating:4, notes:"Focused on cardio and core"             },
  { id:3,  client:"Group HIIT",   type:"Group Class", date:"May 6, 2026",  time:"9:00 AM",  duration:"30 min", status:"ongoing",   rating:0, notes:""                                       },
  { id:4,  client:"Rahul Gupta",  type:"PT Session",  date:"May 6, 2026",  time:"11:00 AM", duration:"60 min", status:"upcoming",  rating:0, notes:""                                       },
  { id:5,  client:"Neha Joshi",   type:"PT Session",  date:"May 5, 2026",  time:"7:00 PM",  duration:"45 min", status:"completed", rating:5, notes:"Excellent CrossFit performance"         },
  { id:6,  client:"Sunita Rao",   type:"PT Session",  date:"May 4, 2026",  time:"8:00 AM",  duration:"60 min", status:"completed", rating:4, notes:"Yoga flexibility improving"             },
  { id:7,  client:"Amit Patel",   type:"PT Session",  date:"May 3, 2026",  time:"10:00 AM", duration:"60 min", status:"missed",    rating:0, notes:"Client no-show"                         },
  { id:8,  client:"Rahul Gupta",  type:"PT Session",  date:"May 2, 2026",  time:"11:00 AM", duration:"60 min", status:"completed", rating:3, notes:"Needs to improve consistency"           },
];

// ─── Availability ─────────────────────────────────────────────────────────────
export const availability = [
  { day:"Monday",    slots:["6:00 AM","7:00 AM","8:00 AM","9:00 AM","5:00 PM","6:00 PM","7:00 PM"], booked:["6:00 AM","7:00 AM","9:00 AM"] },
  { day:"Tuesday",   slots:["6:00 AM","7:00 AM","8:00 AM","5:00 PM","6:00 PM","7:00 PM"],           booked:["7:00 AM","5:00 PM"]           },
  { day:"Wednesday", slots:["6:00 AM","7:00 AM","9:00 AM","5:00 PM","6:00 PM","7:00 PM"],           booked:["6:00 AM","9:00 AM","7:00 PM"] },
  { day:"Thursday",  slots:["6:00 AM","7:00 AM","8:00 AM","5:00 PM","6:00 PM"],                     booked:["8:00 AM","6:00 PM"]           },
  { day:"Friday",    slots:["6:00 AM","7:00 AM","9:00 AM","5:00 PM","6:00 PM","7:00 PM"],           booked:["6:00 AM","7:00 AM"]           },
  { day:"Saturday",  slots:["7:00 AM","8:00 AM","9:00 AM","10:00 AM"],                              booked:["7:00 AM","9:00 AM"]           },
  { day:"Sunday",    slots:[],                                                                        booked:[]                              },
];

// ─── Exercise Library ─────────────────────────────────────────────────────────
export const exerciseLibrary = [
  { id:1,  name:"Barbell Squat",    muscle:"Legs",      equipment:"Barbell",    sets:"4x8",   rest:"90s"  },
  { id:2,  name:"Bench Press",      muscle:"Chest",     equipment:"Barbell",    sets:"4x8",   rest:"90s"  },
  { id:3,  name:"Deadlift",         muscle:"Back",      equipment:"Barbell",    sets:"3x5",   rest:"120s" },
  { id:4,  name:"Pull-ups",         muscle:"Back",      equipment:"Bodyweight", sets:"3x10",  rest:"60s"  },
  { id:5,  name:"Shoulder Press",   muscle:"Shoulders", equipment:"Dumbbell",   sets:"3x12",  rest:"60s"  },
  { id:6,  name:"Plank",            muscle:"Core",      equipment:"Bodyweight", sets:"3x60s", rest:"30s"  },
  { id:7,  name:"Lunges",           muscle:"Legs",      equipment:"Dumbbell",   sets:"3x12",  rest:"60s"  },
  { id:8,  name:"Bicep Curl",       muscle:"Arms",      equipment:"Dumbbell",   sets:"3x15",  rest:"45s"  },
  { id:9,  name:"Tricep Dips",      muscle:"Arms",      equipment:"Bodyweight", sets:"3x12",  rest:"45s"  },
  { id:10, name:"Box Jumps",        muscle:"Legs",      equipment:"Box",        sets:"4x10",  rest:"60s"  },
  { id:11, name:"Cable Row",        muscle:"Back",      equipment:"Cable",      sets:"3x12",  rest:"60s"  },
  { id:12, name:"Leg Press",        muscle:"Legs",      equipment:"Machine",    sets:"4x12",  rest:"90s"  },
];

// ─── Workout Templates ────────────────────────────────────────────────────────
export const workoutTemplates = [
  { id:1, name:"Beginner Full Body",    level:"Beginner",     days:3, exercises:8,  clients:5, description:"Perfect for newcomers. Full body compound movements." },
  { id:2, name:"Intermediate Strength", level:"Intermediate", days:4, exercises:12, clients:8, description:"4-day upper/lower split for strength gains."          },
  { id:3, name:"Advanced CrossFit",     level:"Advanced",     days:5, exercises:16, clients:3, description:"High-intensity functional fitness program."           },
  { id:4, name:"Weight Loss Circuit",   level:"Beginner",     days:4, exercises:10, clients:6, description:"Cardio-focused circuit training for fat loss."        },
  { id:5, name:"Muscle Building Split", level:"Intermediate", days:5, exercises:14, clients:4, description:"5-day PPL split for hypertrophy."                    },
];

// ─── Assigned Plans ───────────────────────────────────────────────────────────
export const assignedPlans = [
  { id:1, client:"Aryan Mehta",  plan:"Intermediate Strength", assignedDate:"Jan 15, 2026", status:"active",   progress:72, nextReview:"Jun 15, 2026" },
  { id:2, client:"Priya Sharma", plan:"Weight Loss Circuit",   assignedDate:"Feb 1, 2026",  status:"active",   progress:58, nextReview:"Jun 1, 2026"  },
  { id:3, client:"Rahul Gupta",  plan:"Beginner Full Body",    assignedDate:"Mar 10, 2026", status:"active",   progress:45, nextReview:"Jun 10, 2026" },
  { id:4, client:"Neha Joshi",   plan:"Advanced CrossFit",     assignedDate:"Nov 1, 2025",  status:"active",   progress:88, nextReview:"Jun 1, 2026"  },
  { id:5, client:"Amit Patel",   plan:"Beginner Full Body",    assignedDate:"Apr 5, 2026",  status:"paused",   progress:30, nextReview:"—"            },
  { id:6, client:"Sunita Rao",   plan:"Yoga & Flexibility",    assignedDate:"Dec 1, 2025",  status:"active",   progress:65, nextReview:"Jun 1, 2026"  },
];

// ─── Diet Plans ───────────────────────────────────────────────────────────────
export const dietPlans = [
  { id:1, client:"Aryan Mehta",  goal:"Muscle Gain",  calories:2800, protein:"180g", carbs:"320g", fat:"80g",  status:"active",   lastUpdated:"May 1, 2026"  },
  { id:2, client:"Priya Sharma", goal:"Fat Loss",     calories:1600, protein:"130g", carbs:"150g", fat:"55g",  status:"active",   lastUpdated:"Apr 28, 2026" },
  { id:3, client:"Rahul Gupta",  goal:"Weight Loss",  calories:1800, protein:"140g", carbs:"180g", fat:"60g",  status:"active",   lastUpdated:"Apr 20, 2026" },
  { id:4, client:"Neha Joshi",   goal:"Performance",  calories:2400, protein:"160g", carbs:"280g", fat:"70g",  status:"active",   lastUpdated:"May 3, 2026"  },
  { id:5, client:"Sunita Rao",   goal:"Maintenance",  calories:1900, protein:"120g", carbs:"220g", fat:"65g",  status:"active",   lastUpdated:"Apr 15, 2026" },
];

// ─── Meal Tracking ────────────────────────────────────────────────────────────
export const mealTracking = [
  { id:1, client:"Aryan Mehta",  date:"May 6, 2026", meal:"Breakfast", food:"Oats + Eggs + Banana",         calories:520, protein:"32g", logged:true  },
  { id:2, client:"Aryan Mehta",  date:"May 6, 2026", meal:"Lunch",     food:"Chicken Rice + Salad",          calories:680, protein:"48g", logged:true  },
  { id:3, client:"Aryan Mehta",  date:"May 6, 2026", meal:"Snack",     food:"Protein Shake + Almonds",       calories:320, protein:"28g", logged:true  },
  { id:4, client:"Aryan Mehta",  date:"May 6, 2026", meal:"Dinner",    food:"Salmon + Sweet Potato + Broc.", calories:580, protein:"42g", logged:false },
  { id:5, client:"Priya Sharma", date:"May 6, 2026", meal:"Breakfast", food:"Greek Yogurt + Berries",        calories:280, protein:"18g", logged:true  },
  { id:6, client:"Priya Sharma", date:"May 6, 2026", meal:"Lunch",     food:"Grilled Chicken Salad",         calories:380, protein:"35g", logged:true  },
];

// ─── Water Intake ─────────────────────────────────────────────────────────────
export const waterIntake = [
  { clientId:1, clientName:"Aryan Mehta",  target:3.5, logged:[2.5, 3.0, 3.2, 3.5, 2.8, 3.1, 3.5], days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
  { clientId:2, clientName:"Priya Sharma", target:2.5, logged:[2.0, 2.2, 2.5, 1.8, 2.3, 2.5, 2.1], days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
  { clientId:4, clientName:"Neha Joshi",   target:3.0, logged:[3.0, 2.8, 3.0, 3.0, 2.5, 3.0, 2.9], days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
];

// ─── Trainer Messages ─────────────────────────────────────────────────────────
export const trainerMessages = [
  { id:1, client:"Aryan Mehta",  avatar:"AM", lastMsg:"Thanks coach! See you tomorrow 💪",      time:"2h ago",    unread:0 },
  { id:2, client:"Priya Sharma", avatar:"PS", lastMsg:"Can we reschedule Friday's session?",    time:"4h ago",    unread:2 },
  { id:3, client:"Neha Joshi",   avatar:"NJ", lastMsg:"My knee is feeling better now",          time:"Yesterday", unread:1 },
  { id:4, client:"Rahul Gupta",  avatar:"RG", lastMsg:"What should I eat before workout?",      time:"2 days ago",unread:0 },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const trainerNotifications = [
  { id:1, type:"session",  title:"Session Reminder",      message:"PT session with Rahul Gupta at 11:00 AM today",    time:"30 min ago", read:false },
  { id:2, type:"update",   title:"Client Progress Update", message:"Neha Joshi completed her weekly goal",             time:"1 hr ago",   read:false },
  { id:3, type:"payment",  title:"Payment Received",       message:"Session payment of $590 received",                 time:"2 hr ago",   read:true  },
  { id:4, type:"session",  title:"Session Missed",         message:"Amit Patel missed his 10:00 AM session",           time:"Yesterday",  read:true  },
  { id:5, type:"announce", title:"Gym Announcement",       message:"Gym will be closed on May 10 for maintenance",     time:"Yesterday",  read:true  },
];

// ─── Trainer Reports ──────────────────────────────────────────────────────────
export const trainerReports = {
  attendanceRate: 87,
  clientRetention: 92,
  avgSessionRating: 4.8,
  monthlyRevenue: [4200,5100,4800,6200,5900,7100,6800,7400,8100,7800,8400,9200],
  classAttendance: [
    { class:"HIIT Blast",       rate:94, sessions:18 },
    { class:"Strength Builder", rate:88, sessions:22 },
    { class:"CrossFit",         rate:79, sessions:14 },
    { class:"Boxing Basics",    rate:91, sessions:10 },
  ],
  sessionStats: { completed:48, missed:4, upcoming:10, total:62 },
};

// ─── Feedback / Ratings ───────────────────────────────────────────────────────
export const trainerFeedback = [
  { id:1, client:"Aryan Mehta",  rating:5, date:"May 5, 2026",  comment:"Vikram is an amazing trainer! My strength has improved dramatically in just 4 months.",  category:"Strength Training" },
  { id:2, client:"Neha Joshi",   rating:5, date:"May 4, 2026",  comment:"Best CrossFit coach I've had. Very motivating and technically precise.",                  category:"CrossFit"          },
  { id:3, client:"Priya Sharma", rating:4, date:"May 3, 2026",  comment:"Great guidance on nutrition and workouts. Would love more flexibility sessions.",         category:"Weight Loss"       },
  { id:4, client:"Sunita Rao",   rating:5, date:"Apr 28, 2026", comment:"Vikram's yoga sessions are incredibly calming and effective. Highly recommend!",          category:"Yoga"              },
  { id:5, client:"Rahul Gupta",  rating:3, date:"Apr 25, 2026", comment:"Good trainer but sessions sometimes run over time. Otherwise very knowledgeable.",        category:"General Fitness"   },
  { id:6, client:"Amit Patel",   rating:4, date:"Apr 20, 2026", comment:"Very patient with beginners. Helped me build confidence in the gym.",                    category:"Beginner Training" },
];

// ─── Calendar Events ──────────────────────────────────────────────────────────
export const calendarEvents = [
  { id:1, title:"PT - Aryan",     date:"2026-05-05", time:"6:00 AM",  type:"pt",    color:"#f97316" },
  { id:2, title:"HIIT Blast",     date:"2026-05-05", time:"9:00 AM",  type:"class", color:"#3b82f6" },
  { id:3, title:"PT - Neha",      date:"2026-05-05", time:"7:00 PM",  type:"pt",    color:"#f97316" },
  { id:4, title:"Strength Class", date:"2026-05-06", time:"5:30 PM",  type:"class", color:"#3b82f6" },
  { id:5, title:"PT - Priya",     date:"2026-05-07", time:"7:30 AM",  type:"pt",    color:"#f97316" },
  { id:6, title:"CrossFit",       date:"2026-05-08", time:"6:00 PM",  type:"class", color:"#3b82f6" },
  { id:7, title:"PT - Rahul",     date:"2026-05-09", time:"11:00 AM", type:"pt",    color:"#f97316" },
];
