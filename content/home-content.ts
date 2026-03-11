export interface TemplateCardItem {
  title: string;
  detail: string;
}

export interface TemplateBenefitItem {
  title: string;
  points: string[];
}

export const homeHeroContent = {
  eyebrow: "Technology Studio",
  subline:
    "We build digital products, scalable systems, and future-facing ideas across technology, business, and innovation.",
  vision:
    "To create a modern technology company that turns bold ideas into real products, scalable systems, and meaningful impact.",
  mission:
    "WowMindz exists to involve ideas, solve real problems, and evolve them into products, platforms, and ventures that create long-term value.",
  badges: [
    "App Development",
    "Website Development",
    "Social Media Marketing",
    "Product Thinking & Automation",
  ],
};

export const homeSpecialFeatures: TemplateCardItem[] = [
  {
    title: "App & Platform Development",
    detail: "From product MVPs to operational platforms, we build applications structured for usability, speed, and scale.",
  },
  {
    title: "Website Systems That Convert",
    detail: "Web experiences designed to communicate clearly, build trust, and support measurable business outcomes.",
  },
  {
    title: "Marketing with Execution Depth",
    detail: "Social media and digital campaigns shaped with positioning, content clarity, and system-led consistency.",
  },
  {
    title: "Automation for Real Problems",
    detail: "We simplify repeated workflows, decision loops, and delivery bottlenecks through product thinking and automation.",
  },
];

export const homeKeyBenefits: TemplateBenefitItem[] = [
  {
    title: "Modern Product-First Approach",
    points: ["Build with product clarity and long-term direction."],
  },
  {
    title: "Clean Execution",
    points: ["Structured delivery with scalable architecture."],
  },
  {
    title: "Innovation-Led Mindset",
    points: ["Shape, test, and evolve ideas into working outcomes."],
  },
  {
    title: "Multi-Domain Growth Potential",
    points: ["Designed to grow across software, ventures, and new platforms."],
  },
];

export const homeAcademicExams = {
  title: "What We Build",
  olympiad: [
    "Digital products and web platforms",
    "Operational tools and internal systems",
    "Scalable MVPs and prototype accelerators",
  ],
  national: [
    "Automation and workflow systems",
    "Business-ready IT solution stacks",
    "Product strategy and execution support",
  ],
  other: [
    "Startup concept validation",
    "Innovation experiments and pilots",
    "Cross-domain product initiatives",
  ],
};

export const homeStudentLife = {
  title: "Knowledge Streams",
  subtitle:
    "The blog extends the WowMindz thinking style into practical, system-led writing.",
  sports: ["Tech insights", "Architecture notes", "Practical implementation patterns"],
  activities: ["Business observations", "Execution lessons", "Product and startup systems"],
  feeIncludes: ["Automation playbooks", "Product strategy notes", "Digital growth thinking"],
};
