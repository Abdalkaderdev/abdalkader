export interface Project {
  title: string;
  slug: string;
  category: string[];
  img: string;
  badges?: string[];
  owner: string;
  date: string;
  services: string;
  duration: string;
  budget: string;
  live?: string;
  github?: string;
  overview: string;
  objective: string;
  process: string;
  impact: string;
}

export const projects: Project[] = [
  {
    // For Post
    title: "Quantum Animation System",
    slug: "quantum-animation-system",
    category: ["Web Development", "Interactive Animation", "Physics Simulation"],
    img: "/images/quantum-animation.png",
    badges: ["Next.js 15", "TypeScript", "Three.js", "Framer Motion", "GSAP"],
    owner: "Quantum Animation Lab",
    date: "Jan 15, 2025",
    services: "Web Development, Interactive Animation, Physics Simulation",
    duration: "45 Days",
    budget: "2000$",
    live: "https://quantumanim.abdalkader.dev/",
    github: "https://github.com/Abdalkaderdev/abdalkader/tree/main/apps/quantumanim",
    overview:
      "Quantum Animation System is an innovative interactive playground that demonstrates quantum physics principles through UI animations and visualizations. Built with Next.js 15, TypeScript, Three.js, Framer Motion, and GSAP, the platform creates an engaging educational experience that makes complex quantum concepts accessible through interactive demos, particle systems, and real-time physics simulations. The system features Schrödinger's UI components, quantum entanglement visualizations, wave function collapse animations, and educational modules that bring quantum mechanics to life.",
    objective:
      "The primary goal was to create an interactive educational platform that makes quantum physics concepts accessible and engaging through modern web technologies. The platform needed to demonstrate complex quantum principles like superposition, entanglement, wave function collapse, quantum tunneling, and quantum interference through intuitive UI interactions and stunning visualizations. Special attention was given to creating accurate physics simulations while maintaining visual appeal and educational value. The design approach focused on creating an immersive experience that allows users to explore quantum concepts through hands-on interaction, making abstract physics principles tangible and understandable.",
    process:
      "The development process began with extensive research into quantum physics principles and educational methodologies. I analyzed existing physics simulation tools and identified opportunities to create a more engaging and accessible learning experience. The design phase involved creating wireframes and prototypes that focused on interactive learning, ensuring that users could explore quantum concepts through intuitive controls and visual feedback. Technical implementation utilized cutting-edge web technologies including Three.js for 3D particle systems, Framer Motion for smooth animations, and GSAP for complex physics simulations. Special attention was given to creating responsive visualizations that work across different devices while maintaining performance. The platform was built with modularity in mind, allowing for easy addition of new quantum experiments and educational content.",
    impact:
      "The Quantum Animation System has successfully created a new paradigm for physics education, making complex quantum concepts accessible to learners of all levels. The platform has received positive feedback from educators, students, and physics enthusiasts, with many noting the intuitive interface and engaging visualizations. The project has contributed to the advancement of educational technology, demonstrating how modern web development can make abstract scientific concepts tangible and interactive. The platform continues to expand its educational content and is being adopted by educational institutions for physics instruction.",
  },
  {
    // For Post
    title: "Apple TV Clone",
    slug: "apple-tv-clone",
    category: ["Frontend Development", "UI/UX Design"],
    img: "/images/apple.png",
    badges: ["React", "Next.js", "TypeScript", "GSAP"],

    // Sticky
    owner: "Apple TV Clone",
    date: "Nov 15, 2024",
    services: "Frontend Development, UI/UX Design",
    duration: "18 Days",
    budget: "400$",
    live: "https://apple-tv-clone-steel.vercel.app/",

    // Scroll
    overview:
      "Apple TV Clone is a meticulously crafted recreation of the Apple TV interface, built to showcase modern frontend development skills and responsive design principles. The project demonstrates the ability to replicate complex user interfaces with pixel-perfect accuracy while maintaining smooth animations and intuitive navigation. Built with modern web technologies and a focus on user experience, this clone captures the essence of Apple's design philosophy while showcasing advanced frontend development capabilities.",
    objective:
      "The primary goal was to create a pixel-perfect clone of the Apple TV interface that demonstrates mastery of modern frontend development techniques. The project needed to replicate the smooth animations, responsive design, and intuitive navigation that Apple is known for, while maintaining excellent performance across different devices and screen sizes. Special attention was given to creating fluid transitions, hover effects, and interactive elements that closely match the original Apple TV experience. The design approach focused on achieving visual fidelity while ensuring the interface remains accessible and user-friendly.",
    process:
      "The development process began with extensive analysis of the original Apple TV interface, studying its design patterns, animations, and user interaction flows. I conducted research into Apple's design guidelines and analyzed the specific visual elements that make the interface distinctive. The design phase involved creating detailed wireframes and prototypes that focused on achieving pixel-perfect accuracy while maintaining smooth performance. Technical implementation utilized modern CSS techniques, JavaScript animations, and responsive design principles to create a seamless user experience. Special attention was given to creating smooth transitions and hover effects that closely replicate the original interface. The project was built with a focus on code quality and maintainability, demonstrating best practices in frontend development.",
    impact:
      "The Apple TV Clone has successfully demonstrated advanced frontend development skills and attention to detail in UI/UX design. The project has received positive feedback from developers and designers, with many noting the accuracy of the recreation and the smooth performance. The project serves as an excellent showcase of modern frontend development capabilities, demonstrating proficiency in CSS animations, responsive design, and user interface replication. The clone continues to serve as a valuable learning resource and portfolio piece that highlights the ability to work with complex design systems and create polished user interfaces.",
  },
  {
    // For Post
    title: "VirtualView",
    slug: "virtualview",
    category: ["Web Development", "Virtual Reality"],
    img: "/images/virtual.png",
    badges: ["Three.js", "WebGL", "Next.js"],

    // Sticky
    owner: "VirtualView",
    date: "Nov 20, 2024",
    services: "Web Development, 3D Technology, UI/UX Design",
    duration: "35 Days",
    budget: "1200$",
    live: "https://virtualview.vercel.app/",
    github: "https://github.com/Abdalkaderdev/virtualview",

    // Scroll
    overview:
      "VirtualView is an innovative virtual reality platform that enables users to explore 3D spaces interactively and intuitively through a web interface. The platform leverages cutting-edge web technologies to create immersive virtual environments that can be accessed directly through modern web browsers, eliminating the need for specialized VR hardware. Built with a focus on accessibility and user experience, VirtualView opens up new possibilities for virtual exploration, architectural visualization, and interactive storytelling through the power of web-based VR technology.",
    objective:
      "The primary goal was to create an accessible virtual reality platform that brings immersive 3D experiences to users through standard web browsers. The platform needed to provide smooth, responsive 3D navigation while maintaining excellent performance across different devices and network conditions. Special attention was given to creating intuitive controls that allow users to navigate virtual spaces naturally, whether using mouse and keyboard or touch controls on mobile devices. The design approach focused on creating a seamless user experience that makes virtual reality accessible to everyone, regardless of their technical expertise or hardware capabilities.",
    process:
      "The development process began with extensive research into web-based VR technologies and 3D rendering techniques. I analyzed existing VR platforms and identified opportunities to create a more accessible and user-friendly experience. The design phase involved creating wireframes and prototypes that focused on 3D navigation and user interaction patterns, ensuring that users could easily explore virtual environments without feeling overwhelmed. Technical implementation utilized modern web technologies including WebGL, Three.js, and other 3D libraries for optimal performance and compatibility. Special attention was given to creating responsive 3D experiences that work well across different screen sizes and device capabilities. The platform was built with scalability in mind, allowing for easy addition of new virtual environments and features.",
    impact:
      "VirtualView has successfully democratized access to virtual reality experiences, making immersive 3D exploration available to users through standard web browsers. The platform has received positive feedback from users across different demographics, with many noting the intuitive navigation and smooth performance. The project has contributed to the advancement of web-based VR technology, demonstrating the potential for creating immersive experiences without requiring specialized hardware. The platform continues to expand its virtual environment library and is being adopted by various industries for virtual tours, architectural visualization, and interactive storytelling.",
  },
  {
    // For Post
    title: "Jegr Jalal Company",
    slug: "jegr-jalal-company",
    category: ["Web Development", "Corporate Website"],
    img: "/images/jegr.png",
    badges: ["Next.js", "TypeScript", "SCSS"],

    // Sticky
    owner: "Jegr Jalal Company",
    date: "Nov 25, 2024",
    services: "Web Development, UI/UX Design",
    duration: "20 Days",
    budget: "600$",
    live: "https://www.jegrjalalcompany.com/",

    // Scroll
    overview:
      "Jegr Jalal Company is a professional corporate website designed to showcase the company's services, projects, and corporate information with a clean and modern design approach. The platform serves as the digital face of the company, providing visitors with comprehensive information about services offered, completed projects, company history, and contact details. Built with modern web technologies and a focus on professional presentation, the website establishes a strong online presence for the company while maintaining excellent user experience across all devices.",
    objective:
      "The primary goal was to create a professional corporate website that effectively communicates the company's expertise, services, and value proposition to potential clients and partners. The website needed to present company information in a clear, organized manner while maintaining a professional appearance that builds trust and credibility. Special attention was given to creating an intuitive navigation structure that allows visitors to easily find information about services, view project portfolios, learn about the company's history and values, and establish contact. The design approach focused on creating a clean, modern aesthetic that reflects the company's professional standards while ensuring fast loading times and responsive functionality.",
    process:
      "The development process began with in-depth consultation with the company's management team to understand their business objectives, target audience, and key services. I conducted research into corporate website best practices and analyzed competitor websites to identify effective ways to present company information. The design phase involved creating wireframes and prototypes that focused on information architecture and user flow optimization, ensuring that visitors could easily navigate and find relevant information. Technical implementation utilized modern web development practices, including responsive design, optimized image loading, and efficient content management. Special attention was given to creating a mobile-responsive design that maintains professional appearance across all screen sizes. The platform was built with scalability in mind, allowing for easy content updates and future feature additions.",
    impact:
      "The Jegr Jalal Company website has successfully established a strong digital presence for the company, leading to increased online visibility and improved client engagement. The website has received positive feedback from both existing clients and potential customers, with many noting the professional presentation and ease of finding company information. The platform has contributed to the company's credibility and professional image, demonstrating the value of a well-designed corporate website in today's digital business landscape. The website continues to serve as an effective tool for lead generation and client communication.",
  },
  {
    // For Post
    title: "Doner QR Menu Magic",
    slug: "doner-qr-menu-magic",
    category: ["Web Development", "Restaurant Technology"],
    img: "/images/doner.png",
    badges: ["Next.js", "React", "SCSS"],

    // Sticky
    owner: "German Doner",
    date: "Dec 1, 2024",
    services: "Web Development, UI/UX Design",
    duration: "25 Days",
    budget: "800$",
    live: "https://german-doner.vercel.app/",
    github: "https://github.com/Abdalkaderdev/doner-qr-menu-magic",

    // Scroll
    overview:
      "Doner QR Menu Magic is an innovative digital menu system designed specifically for restaurants, particularly focusing on doner and fast-food establishments. The platform transforms traditional paper menus into interactive digital experiences through QR code technology, enabling customers to browse menus, view detailed item descriptions, and place orders directly from their mobile devices. Built with modern web technologies and a focus on user experience, the system streamlines restaurant operations while enhancing customer engagement.",
    objective:
      "The primary goal was to create a smart QR menu system that modernizes the traditional restaurant ordering experience. The platform needed to provide an intuitive interface for customers to browse menus, view high-quality food images, read detailed descriptions, and place orders seamlessly. For restaurant owners, the system needed to offer easy menu management, real-time order tracking, and operational efficiency improvements. The design approach focused on creating a mobile-first experience that works flawlessly on smartphones, with fast loading times and intuitive navigation that reduces customer wait times and improves overall satisfaction.",
    process:
      "The development process began with extensive research into restaurant operations and customer behavior patterns. I analyzed existing QR menu solutions and identified opportunities for improvement in user experience and functionality. The design phase involved creating wireframes and prototypes that focused on mobile usability, ensuring that customers could easily navigate menus and place orders with minimal friction. Technical implementation utilized modern web technologies including React and Next.js for optimal performance and user experience. Special attention was given to creating a responsive design that works perfectly on mobile devices, as this is the primary use case for QR menu systems. The platform was built with scalability in mind, allowing restaurants to easily update menus and manage content.",
    impact:
      "Doner QR Menu Magic has successfully modernized the ordering experience for participating restaurants, leading to improved customer satisfaction and operational efficiency. The platform has received positive feedback from both restaurant owners and customers, with many noting the convenience of digital menu browsing and the reduction in wait times. The system has contributed to the digital transformation of restaurant operations, demonstrating the value of technology in enhancing traditional service industries. The platform continues to expand its user base and is being adopted by additional restaurants seeking to modernize their customer experience.",
  },
  {
    // For Post
    title: "Headquarter Iraq Real Estate",
    slug: "headquarter-iraq-real-estate",
    category: ["Web Development", "Real Estate"],
    img: "/images/head.png",
    badges: ["Next.js", "TypeScript", "Performance"],

    // Sticky
    owner: "Headquarter Iraq Real Estate",
    date: "Dec 5, 2024",
    services: "Web Development, UI/UX Design",
    duration: "60 Days",
    budget: "2500$",
    live: "https://headquarteriq.co/",

    // Scroll
    overview:
      "Headquarter Iraq Real Estate is a comprehensive real estate platform designed to serve as the primary digital hub for property transactions across Iraq. The platform offers an extensive range of property listings, from residential apartments to commercial spaces, with advanced search and filtering capabilities tailored to meet diverse client needs. Built with modern web technologies and a focus on user experience, the platform provides a seamless interface for property seekers, real estate agents, and property owners to connect and facilitate successful transactions.",
    objective:
      "The primary goal was to create a comprehensive real estate platform that serves as a one-stop solution for all property-related needs in Iraq. The platform needed to accommodate various property types, user roles, and transaction processes while maintaining high performance and user satisfaction. Special attention was given to creating an intuitive search system that allows users to filter properties by location, price, property type, amenities, and other relevant criteria. The design approach focused on creating a professional, trustworthy interface that builds confidence with users while providing comprehensive property information and smooth transaction processes.",
    process:
      "The development process began with extensive market research and user interviews to understand the specific needs of the Iraqi real estate market. I analyzed existing platforms and identified gaps in user experience and functionality. The design phase involved creating detailed wireframes and prototypes that focused on user journey optimization, ensuring that users could easily find, compare, and inquire about properties. Technical implementation utilized modern web development practices, including responsive design, optimized database queries, and efficient image handling. Special attention was given to creating a mobile-first experience, as many users access real estate platforms on mobile devices. The platform was built with scalability and future growth in mind, allowing for easy addition of new features and property listings.",
    impact:
      "Headquarter Iraq Real Estate has successfully established itself as a leading real estate platform in Iraq, facilitating numerous property transactions and building a strong user community. The platform has received positive feedback from both property seekers and real estate professionals, with many noting the comprehensive property information and ease of use. The platform's success has contributed to the digital transformation of the Iraqi real estate market, demonstrating the value of modern web development practices in traditional industries. The platform continues to grow its user base and property listings, solidifying its position as a trusted real estate resource in Iraq.",
  },
  {
    // For Post
    title: "Innovations Architecture Department",
    slug: "innovations-architecture-department",
    category: ["Web Development", "Architecture"],
    img: "/images/head-quarter-international-find-your-place-to-live-google-chrome-8-3-2025-1-15-34-pm.png",
    badges: ["Next.js", "TypeScript", "Design Systems"],

    // Sticky
    owner: "Innovations Architecture Department",
    date: "Dec 10, 2024",
    services: "Web Development, UI/UX Design",
    duration: "30 Days",
    budget: "1500$",
    live: "https://innovations.headquarteriq.co/",

    // Scroll
    overview:
      "Innovations Architecture Department is the specialized architecture division of Headquarter Iraq Real Estate, showcasing cutting-edge design projects and modern architectural solutions. The platform serves as a digital portfolio for the company's architectural innovations, featuring detailed project showcases, design philosophies, and technical specifications. Built with a focus on visual storytelling and professional presentation, the website highlights the intersection of creativity and functionality in architectural design.",
    objective:
      "The primary objective was to create a sophisticated web platform that effectively communicates the architectural expertise and innovative design capabilities of Headquarter Iraq Real Estate. The website needed to showcase complex architectural projects in an accessible and visually appealing manner, while maintaining professional credibility and technical depth. Special attention was given to creating an immersive browsing experience that allows visitors to explore architectural projects through high-quality imagery, detailed specifications, and interactive elements. The design approach emphasized clean aesthetics that complement the architectural content while ensuring fast loading times and responsive functionality across all devices.",
    process:
      "The development process began with in-depth consultation with the architectural team to understand their design philosophy and project portfolio. I conducted research into architectural website best practices and analyzed competitor platforms to identify effective ways to present complex architectural information. The design phase focused on creating a layout that emphasizes visual hierarchy and allows for detailed project exploration. Technical implementation utilized modern web technologies to ensure smooth image loading and interactive features. Special attention was given to creating a mobile-responsive design that maintains the visual impact of architectural photography across all screen sizes. The platform was built with scalability in mind to accommodate future project additions and content updates.",
    impact:
      "The Innovations Architecture Department website has successfully established a strong digital presence for Headquarter Iraq Real Estate's architectural division. The platform has received positive feedback from both clients and industry professionals, with many noting the professional presentation and ease of project exploration. The website has facilitated new client inquiries and project collaborations, demonstrating the value of a well-designed digital portfolio in the architecture industry. The platform's success has contributed to the company's reputation as a leader in innovative architectural solutions in Iraq.",
  },
  {
    // For Post
    title: "Hamilton Iraq Real Estate",
    slug: "hamilton-iraq-real-estate",
    category: ["Web Development", "Real Estate"],
    img: "/images/hamilton.png",
    badges: ["Next.js", "TypeScript", "SEO"],

    // Sticky
    owner: "Hamilton Iraq Real Estate",
    date: "Dec 15, 2024",
    services: "Web Development, UI/UX Design",
    duration: "45 Days",
    budget: "1200$",
    live: "https://hamiltoniq.com/",

    // Scroll
    overview:
      "Hamilton Iraq Real Estate is a modern, comprehensive real estate platform designed to showcase properties across Iraq with an intuitive user experience. The platform serves as a bridge between property seekers and real estate professionals, offering detailed property listings, advanced search capabilities, and a seamless browsing experience. Built with modern web technologies, the platform emphasizes user-friendly navigation and responsive design to ensure accessibility across all devices.",
    objective:
      "The primary goal was to create a real estate platform that not only displays property listings but also provides an engaging user experience that makes property hunting efficient and enjoyable. The platform needed to handle diverse property types, from residential apartments to commercial spaces, while maintaining fast loading times and intuitive navigation. Special attention was given to creating a search system that allows users to filter properties by location, price range, property type, and other relevant criteria. The design approach focused on creating a clean, professional interface that builds trust with users while showcasing properties in their best light through high-quality imagery and detailed information.",
    process:
      "The development process began with extensive research into the Iraqi real estate market and user behavior patterns. I conducted user interviews and analyzed competitor platforms to understand the specific needs of property seekers in Iraq. The design phase involved creating wireframes and prototypes that focused on user flow optimization, ensuring that users could easily find and compare properties. The technical implementation utilized modern web development practices, including responsive design principles, optimized image loading, and efficient database queries. Special attention was given to creating a mobile-first experience, as many users access real estate platforms on mobile devices. The platform was built with scalability in mind, allowing for easy addition of new features and property listings.",
    impact:
      "Hamilton Iraq Real Estate has successfully established itself as a trusted platform in the Iraqi real estate market. The platform has facilitated numerous property transactions and continues to grow its user base. The modern, user-friendly interface has received positive feedback from both property seekers and real estate professionals, with many noting the platform's ease of use and comprehensive property information. The platform's success has demonstrated the importance of combining modern web development practices with deep understanding of local market needs.",
  },
];
