function Benefits() {
  const benefits = [
    {
      icon: "🏅",
      title: "Certified Trainers",
      description:
        "Work with highly qualified fitness professionals who guide you safely toward real, measurable results."
    },
    {
      icon: "🏋️",
      title: "Premium Equipment",
      description:
        "Access 200+ machines and tools — from cardio to strength to functional training — all maintained to the highest standard."
    },
    {
      icon: "🥗",
      title: "Nutrition Support",
      description:
        "Get personalized meal guidance from certified nutritionists to fuel your workouts and accelerate your progress."
    },
    {
      icon: "📅",
      title: "Flexible Membership",
      description:
        "Choose from monthly, quarterly, or annual plans that fit your budget, schedule, and fitness goals."
    },
    {
      icon: "👥",
      title: "Supportive Community",
      description:
        "Train alongside a motivated community that celebrates your wins and keeps you accountable every step of the way."
    },
    {
      icon: "♨️",
      title: "Recovery Facilities",
      description:
        "Steam room, foam rolling zones, and body assessment tools to help you recover faster and train smarter."
    }
  ];

  return (
    <section className="benefits-section" aria-labelledby="benefits-heading">
      <div className="section-container">
        <div className="section-header">
          <h2 id="benefits-heading" className="section-title">Why Choose FitZone?</h2>
          <p className="section-subtitle">
            We combine expert coaching, world-class facilities, and a motivating community
            to deliver a fitness experience unlike any other.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <span className="benefit-icon" aria-hidden="true">{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Benefits;
