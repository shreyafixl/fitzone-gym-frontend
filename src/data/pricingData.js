const pricingData = [
  {
    id: 1,
    plan: "Monthly",
    price: "$39",
    period: "/ month",
    idealFor: "Beginners & Trial Members",
    popular: false,
    features: [
      "Full gym access (6 AM – 10 PM)",
      "Access to all cardio equipment",
      "Access to free weights area",
      "2 group classes per week",
      "Locker room & shower access",
      "Free fitness assessment"
    ],
    cta: "Get Started"
  },
  {
    id: 2,
    plan: "Quarterly",
    price: "$99",
    period: "/ 3 months",
    idealFor: "Committed Fitness Enthusiasts",
    popular: false,
    features: [
      "Everything in Monthly",
      "Unlimited group classes",
      "1 personal training session/month",
      "Nutrition consultation",
      "Body composition tracking",
      "Guest pass (1/month)"
    ],
    cta: "Get Started"
  },
  {
    id: 3,
    plan: "Half-Yearly",
    price: "$179",
    period: "/ 6 months",
    idealFor: "Serious Goal Chasers",
    popular: true,
    features: [
      "Everything in Quarterly",
      "2 personal training sessions/month",
      "Priority class booking",
      "Steam room access",
      "Dedicated locker",
      "Monthly progress report"
    ],
    cta: "Most Popular"
  },
  {
    id: 4,
    plan: "Annual",
    price: "$299",
    period: "/ year",
    idealFor: "Elite Members & Athletes",
    popular: false,
    features: [
      "Everything in Half-Yearly",
      "Unlimited personal training",
      "24/7 gym access",
      "Custom meal plan",
      "Free merchandise kit",
      "VIP member events"
    ],
    cta: "Best Value"
  },
  {
    id: 5,
    plan: "Personal Training",
    price: "$59",
    period: "/ session",
    idealFor: "Add-on for Any Plan",
    popular: false,
    features: [
      "1-on-1 certified trainer",
      "Custom workout program",
      "Form & technique coaching",
      "Progress tracking",
      "Flexible scheduling",
      "Nutrition tips included"
    ],
    cta: "Book Session"
  }
];

export default pricingData;
