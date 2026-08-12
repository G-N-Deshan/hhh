// Comprehensive 100+ Sample Dataset for Faculty of Technology, University of Ruhuna
// 10 Categories x 10 High Quality Sample Items Each = 100 Opportunities total

const generateCategoryData = () => {
  const dataset = [];

  const categories = [
    {
      name: "Scholarships",
      titles: [
        "Faculty Dean's Academic Merit Scholarship 2026",
        "Ceylon Chamber STEM Undergraduate Grant",
        "Women in ICT Leadership Fellowship",
        "Mahapola Higher Education Bursary Supplement",
        "Biosystems Research Innovation Grant 2026",
        "Dialog Axiata Digital Technology Scholarship",
        "Alumni Association Hardship Support Grant",
        "SLT-MOBITEL Cloud Engineering Bursary",
        "Green Technology Sustainable Energy Scholarship",
        "Japanese Language & Tech Exchange Fellowship",
      ],
    },
    {
      name: "Internships",
      titles: [
        "Full-Stack Software Engineering Intern - Virtusa",
        "Embedded IoT & Smart Sensors Intern - Dialog",
        "Data Science & Python ML Intern - WSO2",
        "Post-Harvest Quality Control Trainee - FoodTech",
        "QA Automation Engineering Intern - Sysco LABS",
        "CAD Modeling & Mechanical Draftsperson - DSI",
        "Cyber Security SOC Network Defense Intern - SLT",
        "Plant Tissue Culture Trainee - Agri Dept",
        "UI/UX & Mobile App Design Intern - Zone24x7",
        "Robotics & Automation PLC Trainee - Lalan",
      ],
    },
    {
      name: "Jobs",
      titles: [
        "Part-Time IT Lab Technical Assistant - FoT",
        "Freelance React & Node.js Developer (Part-Time)",
        "Equipment Maintenance Assistant - ET Department",
        "Junior WordPress Developer & Site Maintainer",
        "Soil Testing & Agri Sample Field Collector",
        "Campus Library Digital Cataloguer",
        "Graphic Designer & Social Media Creator",
        "3D Printing & Laser Cutter Operator - FoT Cell",
        "Weekend Computer Hardware Repair Technician",
        "Smart Greenhouse Operations Assistant",
      ],
    },
    {
      name: "Training",
      titles: [
        "Kubernetes & Cloud DevOps Intensive Bootcamp",
        "Ethical Hacking & Web Pen-Testing Masterclass",
        "Microcontroller PCB Design & Soldering Training",
        "Deep Learning with PyTorch & Computer Vision",
        "Food Safety HACCP Certification Course",
        "React Native Mobile App Workshop",
        "Industrial Automation & PLC Ladder Logic",
        "GIS & Satellite Remote Sensing Analysis",
        "Technical Writing & IEEE Paper Preparation",
        "Agile Scrum Master & Jira Training",
      ],
    },
    {
      name: "Financial Support",
      titles: [
        "Student Laptop Purchasing Loan Interest Subsidy",
        "Emergency Medical & Surgical Assistance Fund",
        "Final Year Prototype Component Fabrication Grant",
        "Semester Examination Fee Exemption Waiver",
        "Subsidized Canteen Meal Ticket Voucher Scheme",
        "Disability Assistive Technology Equipment Subsidy",
        "Research Conference Paper Registration Grant",
        "Temporary Hostel Fee Relief Grant",
        "Software Tool & Cloud Credits Voucher (AWS/JetBrains)",
        "Student Startup Seed Capital Micro-Grant",
      ],
    },
    {
      name: "Mental Health",
      titles: [
        "Campus Confidential Counseling & Wellness Sessions",
        "Mindfulness & Exam Stress Relief Workshop",
        "Peer Mental Health Support Group & Buddy Network",
        "24/7 Crisis Hotline & Remote Emotional Support",
        "Sleep Hygiene & Screen Fatigue Clinic",
        "Art Therapy & Creative Expression Workshop",
        "Overcoming Imposter Syndrome in Tech Panel",
        "Yoga & Physical Movement for Posture Relief",
        "Work-Life Balance & Time Management Masterclass",
        "Inclusive Group Support for Differently Abled Students",
      ],
    },
    {
      name: "Accommodation",
      titles: [
        "Subsidized On-Campus University Hostel Allocation",
        "Wheelchair Accessible Ground Floor Boarding House",
        "Shared Female Tech Student House near Campus",
        "Quiet Study Boarding for Final Year Thesis Students",
        "Matara City Shared Flat (Near Railway Station)",
        "Low-Cost Subsidized Rooms for Mahapola Students",
        "Male Engineering Tech Student Boarding Annex",
        "Short-Term Exam Season Guest Accommodation",
        "Eco-Friendly Boarding with Solar Power",
        "Emergency Temporary Shelter for Stranded Students",
      ],
    },
    {
      name: "Transport",
      titles: [
        "Campus Shuttle Bus (Matara Station <-> FoT Campus)",
        "Wheelchair Accessible Van Transport Scheme",
        "Subsidized Sri Lanka CTB Student Bus Pass",
        "Campus Bicycle Sharing & Rental Scheme",
        "Late Night Exam Carpool & Security Escort",
        "Inter-Campus Express Bus (Wellamadama <-> FoT)",
        "Student Railway Commuter Discount Concession Card",
        "Electric Scooter Charging Stations & Parking",
        "Rainy Season Golf Cart Shuttle Service",
        "Field Trip & Industrial Visit Bus Grant",
      ],
    },
    {
      name: "Events",
      titles: [
        "Technovate 2026 - Annual Technology Innovation Hackathon",
        "Robofest Ruhuna 2026 Robotics Championship",
        "FoT Annual Industrial Career Fair 2026",
        "International Research Symposium on Technology (IRST)",
        "Smart Agriculture & Agri-Tech Exhibition 2026",
        "Cyber Security CTF (Capture The Flag) Contest",
        "Faculty Cultural Night & Musical Extravaganza",
        "FoT Inter-Departmental Sports & Esports League",
        "Open Source Software Day & Linux Install-Fest",
        "Faculty Alumni Tech Talk & Panel Discussion",
      ],
    },
    {
      name: "Volunteering",
      titles: [
        "Rural School Computer Literacy Volunteer Mentor",
        "Visually Impaired Audio Book Reader & Converter",
        "Matara Coastal & Beach Plastic Clean-Up Drive",
        "Campus Green Eco-Tech Tree Planting Volunteer",
        "Blood Donation Camp Volunteer Organizer",
        "Disaster Emergency Relief Coordinator",
        "Elderly Home Tech Helper & Smartphone Coach",
        "Animal Welfare & Stray Dog Vaccination Drive",
        "Youth STEM Workshop Facilitator for School Students",
        "Campus Access Barrier Survey & ARIA Auditor",
      ],
    },
  ];

  const validDepts = [
    "Department of Information & Communication Technology",
    "Department of Engineering Technology",
    "Department of Biosystems Technology",
    "All Departments",
  ];

  categories.forEach((cat) => {
    cat.titles.forEach((title, idx) => {
      dataset.push({
        title,
        description: `Official Opportunity Bridge listing for ${title} under the ${cat.name} section for Faculty of Technology, University of Ruhuna undergraduates.`,
        category: cat.name,
        department: validDepts[idx % validDepts.length],
        location: idx % 2 === 0 ? "Kamburupitiya Tech Campus" : "Matara / Remote",
        deadline: new Date(Date.now() + (15 + idx * 3) * 24 * 60 * 60 * 1000),
        requirements: ["Registered FoT Student", "Application form submission"],
        contactEmail: "info@fot.ruh.ac.lk",
        applicationUrl: "https://fot.ruh.ac.lk/apply",
        tags: [cat.name, "FoT Ruhuna", "2026"],
        status: "Open",
        createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000),
      });
    });
  });

  return dataset;
};

module.exports = generateCategoryData;
