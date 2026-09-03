export const MOCK_PAGES_DATA: Record<
  string,
  { title: string; content: string; coverImage?: string }
> = {
  about: {
    title: "About Oda Bultum University",
    content:
      "Oda Bultum University (OBU) is a public university in Chiro, West Hararghe Zone, Oromia Region, Ethiopia. It was established in 2015. The university is committed to providing quality education, conducting problem-solving research, and rendering community services.",
    coverImage:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
  },
  "president-message": {
    title: "President's Message",
    content:
      "Welcome to Oda Bultum University. As one of the youngest and fastest-growing universities in Ethiopia, we are dedicated to excellence in teaching, research, and community engagement. Our focus is on agriculture, technology, and business, aiming to solve local and national challenges.",
    coverImage:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=1200",
  },
  "mission-vision": {
    title: "Mission, Vision & Values",
    content:
      "Vision: To be one of the top ten applied universities in Africa by 2030.\n\nMission: To produce competent and innovative graduates, conduct problem-solving research, and provide demand-driven community services.",
  },
  "registrar-information": {
    title: "Registrar Information",
    content:
      "The Office of the Registrar is responsible for all matters related to student admission, registration, academic records, and graduation. We ensure the integrity of academic policies and maintain accurate student data.",
  },
};

export const MOCK_ACADEMICS = {
  colleges: {
    "college-of-agriculture": {
      name: "College of Agriculture",
      type: "College",
      description: "Dedicated to advancing agricultural sciences through research and education.",
      dean: "Dr. Aster Bekele",
      contact: { phone: "+251 25 551 1001", email: "agriculture@obu.edu.et" },
      departments: [
        { name: "Department of Plant Science", slug: "plant-science" },
        { name: "Department of Animal Science", slug: "animal-science" },
      ],
    },
    "college-of-engineering": {
      name: "College of Engineering",
      type: "College",
      description: "Fostering innovation in engineering and technology.",
      dean: "Dr. Samuel Tadesse",
      contact: { phone: "+251 25 551 1002", email: "engineering@obu.edu.et" },
      departments: [{ name: "Department of Software Engineering", slug: "software-engineering" }],
    },
  },
  departments: {
    "plant-science": {
      name: "Department of Plant Science",
      college: "College of Agriculture",
      collegeSlug: "college-of-agriculture",
      head: "Dr. Kebede Alemu",
      description: "Focuses on crop production, protection, and breeding.",
      programs: [
        { name: "BSc in Plant Science", slug: "bsc-plant-science", type: "Undergraduate" },
        { name: "MSc in Agronomy", slug: "msc-agronomy", type: "Postgraduate" },
      ],
    },
    "software-engineering": {
      name: "Department of Software Engineering",
      college: "College of Engineering",
      collegeSlug: "college-of-engineering",
      head: "Mr. Dawit Tadesse",
      description: "Prepares students for careers in software development and engineering.",
      programs: [
        {
          name: "BSc in Software Engineering",
          slug: "bsc-software-engineering",
          type: "Undergraduate",
        },
      ],
    },
  },
  programs: {
    "bsc-plant-science": {
      name: "BSc in Plant Science",
      department: "Department of Plant Science",
      departmentSlug: "plant-science",
      degree: "Undergraduate",
      duration: "4 Years",
      description: "A comprehensive undergraduate program covering all aspects of plant science.",
      requirements: "Ethiopian University Entrance Examination (EUEE) passing mark.",
    },
    "bsc-software-engineering": {
      name: "BSc in Software Engineering",
      department: "Department of Software Engineering",
      departmentSlug: "software-engineering",
      degree: "Undergraduate",
      duration: "5 Years",
      description: "Learn to design, develop, and maintain complex software systems.",
      requirements: "EUEE passing mark with a focus on Natural Sciences.",
    },
  },
};

export const MOCK_ADMINISTRATION = {
  "public-relations": {
    name: "Public Relations Office",
    category: "President Offices",
    head: "Abebe Kebede",
    contact: { email: "pr@obu.edu.et", phone: "+251 25 551 1010" },
    location: "Main Campus, Admin Block Room 201",
    description:
      "Responsible for managing the university's public image and external communications.",
  },
  "ict-executive-office": {
    name: "ICT Executive Office",
    category: "President Offices",
    head: "Tadesse Woldemariam",
    contact: { email: "ict@obu.edu.et", phone: "+251 25 551 1011" },
    location: "Main Campus, ICT Center",
    description:
      "Provides centralized IT services, infrastructure management, and technical support to the university community.",
  },
};

export const MOCK_LEADERSHIP = {
  "muktar-mohammed": {
    name: "Dr. Muktar Mohammed",
    position: "President",
    office: "Office of the President",
    email: "president@obu.edu.et",
    phone: "+251 25 551 1616",
    biography:
      "Dr. Muktar Mohammed has served as the President of Oda Bultum University since its early years...",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400",
  },
  "abebe-bekele": {
    name: "Dr. Abebe Bekele",
    position: "Vice President for Academic Affairs",
    office: "Academic, Research & Community Service VP",
    email: "vpaa@obu.edu.et",
    phone: "+251 25 551 1617",
    biography:
      "Dr. Abebe Bekele oversees all academic programs, quality assurance, and faculty development.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
  },
};

export const MOCK_REGISTRAR = {
  announcements: {
    "freshman-registration": {
      title: "Freshman Registration Opens",
      date: "2026-09-01",
      type: "Registration",
      content:
        "All incoming freshman students must complete their registration by September 10, 2026. Please bring all original transcripts.",
    },
  },
  documents: [
    { title: "Student Handbook 2026", type: "PDF", size: "2.4 MB" },
    { title: "Registration Form", type: "PDF", size: "1.1 MB" },
  ],
};

export const MOCK_RESEARCH = {
  projects: {
    "climate-resilient-agriculture": {
      title: "Climate Resilient Agriculture",
      lead: "Dr. Kebede Alemu",
      funding: "$500,000",
      description:
        "A comprehensive study on adapting local crop varieties to shifting climate patterns in the Oromia region.",
    },
  },
  facilities: {
    "research-farms": {
      title: "Oda Bultum University Farms",
      description: "Over 200 hectares of experimental farmland used for crop and animal research.",
    },
  },
};

export const MOCK_SERVICES = {
  "student-clinic": {
    title: "Student Clinic",
    category: "Health",
    description:
      "The Student Clinic provides primary healthcare services, emergency response, and wellness counseling to all active students.",
    contact: "clinic@obu.edu.et",
  },
};

export const MOCK_CAREER = {
  vacancies: {
    "assistant-professor-software": {
      title: "Assistant Professor in Software Engineering",
      department: "Software Engineering",
      type: "Full-time",
      deadline: "2026-09-10",
      description:
        "We are seeking a highly qualified Assistant Professor with a Ph.D. in Computer Science or Software Engineering to join our growing department.",
      requirements: "Ph.D. in related field. Minimum 2 years teaching experience.",
    },
  },
};

export const MOCK_NEWS = {
  "university-ranking": {
    title: "Oda Bultum University Rises in National Rankings",
    category: "Academic",
    date: "2026-08-15",
    excerpt:
      "OBU has climbed 5 spots in the latest national university rankings, citing strong research output and community engagement.",
    content:
      "The Ministry of Education released its annual university rankings today, placing Oda Bultum University (OBU) significantly higher than previous years. The administration attributes this success to the newly opened research facilities and the dedication of the academic staff...",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
  },
  "new-agricultural-research": {
    title: "New Agricultural Research Center Inaugurated",
    category: "Research",
    date: "2026-08-10",
    excerpt:
      "A state-of-the-art agricultural research center was inaugurated by the University President.",
    content:
      "Aiming to boost agricultural productivity in the region, OBU has opened a new research center equipped with modern soil and plant analysis tools. The center will serve both students and local farmers...",
    image:
      "https://images.unsplash.com/photo-1595804353723-5e927c32b500?auto=format&fit=crop&q=80&w=800",
  },
};

export const MOCK_ANNOUNCEMENTS = {
  "graduation-date-announced": {
    title: "2026 Graduation Ceremony Date Announced",
    category: "General",
    date: "2026-08-20",
    content:
      "The 2026 graduation ceremony will be held on October 15, 2026, at the main campus stadium. All graduating students are expected to attend the rehearsal on October 13.",
  },
};

export const MOCK_EVENTS = {
  "annual-research-symposium": {
    title: "Annual Research Symposium 2026",
    date: "2026-09-25",
    time: "09:00 AM - 05:00 PM",
    location: "Main Auditorium",
    organizer: "Vice President for Research",
    description:
      "Join us for the annual showcase of research projects from faculty and graduate students. Keynote speakers include renowned scholars from across the country.",
  },
};

export const MOCK_GALLERIES = {
  "campus-life": {
    title: "Campus Life",
    description: "A glimpse into the vibrant student life at Oda Bultum University.",
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1525926477800-7a3acdf36e05?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600",
    ],
  },
};
