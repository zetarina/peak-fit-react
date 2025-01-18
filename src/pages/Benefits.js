import React from "react";
import {
  FaUsers,
  FaDumbbell,
  FaChartLine,
  FaLaptop,
  FaHandshake,
  FaLock,
  FaCalendar,
  FaChartBar,
} from "react-icons/fa";

const benefitsData = [
  {
    icon: <FaUsers />,
    title: "Expand Your Reach",
    description:
      "Connect with a global community of fitness enthusiasts seeking personalized, expert-led workouts and guidance.",
  },
  {
    icon: <FaDumbbell />,
    title: "Create Impactful Workouts",
    description:
      "Design dynamic, results-driven workout plans that align with users' fitness levels and objectives.",
  },
  {
    icon: <FaChartLine />,
    title: "Grow Your Business",
    description:
      "Build a loyal following through the platform’s subscription model, promotions, and partnerships.",
  },
  {
    icon: <FaLaptop />,
    title: "Leverage Cutting-Edge Technology",
    description:
      "Use PEAK FIT’s powerful tools to create, track, and refine workout programs while gaining insights into user progress and preferences.",
  },
  {
    icon: <FaHandshake />,
    title: "Engage with a Supportive Community",
    description:
      "Collaborate with other fitness professionals, receive user feedback, and improve your content based on community interaction.",
  },
  {
    icon: <FaLock />,
    title: "Access to Exclusive Content",
    description:
      "Gain access to a library of exclusive fitness resources, including workout templates, and expert insights to enhance your offerings.",
  },
  {
    icon: <FaCalendar />,
    title: "Flexible Scheduling",
    description: "Create and manage your own schedule with flexible options.",
  },
  {
    icon: <FaChartBar />,
    title: "Analytics & Insights",
    description:
      "Track performance and user engagement with detailed analytics, helping you optimize your content and grow your business.",
  },
];

function Benefits() {
  return (
    <div className="benefits-container">
      <h2>Benefits of Partnering with PEAK FIT</h2>
      <p className="intro-text">
        With PEAK FIT, you'll unlock a world of possibilities to grow your
        fitness business and make a positive impact on your audience. Explore
        the key benefits below:
      </p>

      <div className="benefits-wrapper">
        {benefitsData.map((benefit, index) => (
          <div className="benefit-card" key={index}>
            <div className="icon">{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>

      <a href="/login" className="cta-button">
        Join PEAK FIT Today!
      </a>
    </div>
  );
}

export default Benefits;
