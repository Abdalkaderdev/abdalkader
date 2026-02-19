import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, MapPin, Globe, Download, ExternalLink, Github, Linkedin, ChevronRight, Phone, GraduationCap, Award } from 'lucide-react';
import styles from '@/styles/Home.module.scss';

// CV Data from actual resume
const experience = [
  {
    title: 'Full Stack Software Engineer',
    company: 'Mount Seir Tech',
    period: 'Jan 2026 - Present',
    location: 'Remote',
    description: 'Developing full-stack features for AI-driven applications using modern frameworks.',
    highlights: [
      'Develop full-stack features using Svelte (frontend) and Django + FastAPI (backend)',
      'Architect backend systems with Docker containerization and Kubernetes deployment',
      'Integrate AI chat, LLM-powered automation, and business logic into product workflows',
      'Lead backend design for ParsaLink, an AI-powered CRM and automation platform',
    ],
    tech: ['Svelte', 'Django', 'FastAPI', 'Docker', 'Kubernetes', 'Python'],
  },
  {
    title: 'AI Engineer',
    company: 'SoapBox',
    period: 'Nov 2025 - Present',
    location: 'Remote',
    description: 'Design and implement LLM-powered systems for faith community platforms.',
    highlights: [
      'Design LLM-powered systems including prompt engineering, AI agents, and automation workflows',
      'Develop backend services and API integrations using Python and Node.js',
      'Manage deployment infrastructure with Docker, CI/CD pipelines, and cloud services (DigitalOcean, GCP)',
      'Train and fine-tune proprietary LLM models for product-specific use cases',
    ],
    tech: ['Python', 'Node.js', 'Docker', 'GCP', 'LLM', 'CI/CD'],
  },
  {
    title: 'Full Stack Software Engineer (Volunteer)',
    company: 'Disciple One / ViaApp',
    period: 'Nov 2025 - Present',
    location: 'Remote',
    description: 'Building responsive websites and mobile apps for nonprofit discipleship platform.',
    highlights: [
      'Build and deploy responsive websites and admin dashboards using React, Next.js, and Node.js',
      'Develop React Native (Expo) mobile app features with backend API integration',
      'Manage containerized application infrastructure using Docker for production deployment',
    ],
    tech: ['React', 'Next.js', 'React Native', 'Node.js', 'Docker'],
  },
  {
    title: 'IT & Contract Manager',
    company: 'Real House Company',
    period: 'Apr 2025 - Present',
    location: 'Erbil, Iraq',
    description: 'Leading IT operations and implementing scalable technical solutions.',
    highlights: [
      'Lead IT operations including internal systems, websites, email infrastructure, and technical support',
      'Implement scalable technical solutions improving system reliability and operational efficiency',
    ],
    tech: ['IT Infrastructure', 'Systems Management', 'Web Development'],
  },
  {
    title: 'E-commerce Web Developer (Freelance)',
    company: 'Minime Iraq',
    period: 'Nov 2023 - Nov 2025',
    location: 'Baghdad, Iraq',
    description: 'Built full-stack e-commerce platform with comprehensive features.',
    highlights: [
      'Built full-stack e-commerce platform with responsive design and third-party API integrations',
      'Implemented payment processing, inventory management, and customer retention features',
    ],
    tech: ['E-commerce', 'Payment Integration', 'API Development'],
  },
  {
    title: 'IT Specialist (Freelance)',
    company: 'Hamilton Iraq Real Estate',
    period: 'Nov 2023 - Nov 2025',
    location: 'Erbil, Iraq',
    description: 'Developed company website and managed IT infrastructure.',
    highlights: [
      'Developed and maintained company website and managed email infrastructure',
      'Maintained IT systems, resolved connectivity issues, and ensured optimal performance',
    ],
    tech: ['Web Development', 'IT Support', 'Email Infrastructure'],
  },
];

const skills = [
  { name: 'Python', level: 95, category: 'Programming' },
  { name: 'JavaScript / TypeScript', level: 95, category: 'Programming' },
  { name: 'React / Next.js', level: 95, category: 'Frontend' },
  { name: 'Svelte', level: 85, category: 'Frontend' },
  { name: 'Node.js', level: 92, category: 'Backend' },
  { name: 'Django / FastAPI', level: 90, category: 'Backend' },
  { name: 'LLM Integration & Fine-Tuning', level: 90, category: 'AI/ML' },
  { name: 'Docker / Kubernetes', level: 88, category: 'DevOps' },
  { name: 'PostgreSQL / MongoDB', level: 88, category: 'Database' },
  { name: 'React Native (Expo)', level: 85, category: 'Mobile' },
];

const projects = [
  {
    name: 'SoapBox Super App',
    description: 'Full-stack faith community platform with AI-assisted content generation, event management, multi-channel communication',
    url: 'https://soapboxsuperapp.com',
  },
  {
    name: 'SoapBox Website Builder',
    description: 'No-code website builder enabling churches to create custom websites with drag-and-drop functionality',
    url: 'https://builder.soapboxsuperapp.com',
  },
  {
    name: 'ViaApp',
    description: 'Cross-platform mobile app (iOS, Android, Web) with daily devotionals, Bible study tools, prayer journal',
    url: 'https://viaapp.life',
  },
  {
    name: 'Disciple One',
    description: 'Nonprofit platform with church dashboards for tracking spiritual growth and partner network management',
    url: 'https://discipleone.life',
  },
  {
    name: 'ParsaLink',
    description: 'AI-powered CRM with automated lead engagement, AI chat, and workflow automation',
    url: 'https://abdalkader.dev/projects/parsalink-ai-crm',
  },
];

const certifications = [
  {
    name: 'AWS Skill Builder — AI/ML & Generative AI Track',
    issuer: 'Amazon Web Services',
    year: '2024 - 2025',
    description: '16 courses covering ML foundations, Generative AI, Amazon Bedrock, Amazon Q, prompt engineering',
  },
  {
    name: 'Web Accessibility Training',
    issuer: 'UNICEF',
    year: '2024',
  },
  {
    name: 'Inclusive Communication',
    issuer: 'UNICEF',
    year: '2024',
  },
];

const education = {
  degree: 'Telecommunications Engineering',
  school: 'University of Aleppo, Syria',
  period: 'Sep 2015 - Jul 2017',
  coursework: 'Network Design, Wireless Communication, Telecommunication Systems',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'experience' | 'skills' | 'projects' | 'education'>('experience');

  const handleDownloadPDF = () => {
    window.open('/Abdalkader_Alhamoud_CV.pdf', '_blank');
  };

  return (
    <div className={styles.cv}>
      {/* Background Effects */}
      <div className={styles.bgGrid} />
      <div className={styles.bgGradient} />

      {/* Header */}
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>A</span>
            <span>cv.abdalkader.dev</span>
          </div>
          <motion.button
            className={styles.downloadBtn}
            onClick={handleDownloadPDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={18} />
            Download PDF
          </motion.button>
        </div>
      </motion.header>

      <main className={styles.main}>
        {/* Hero Section */}
        <motion.section
          className={styles.hero}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.heroAvatar} variants={itemVariants}>
            <div className={styles.avatarCircle}>
              <Image
                src="/abdalkader.jpg"
                alt="Abdalkader Alhamoud"
                width={100}
                height={100}
                className={styles.avatarImage}
                priority
              />
            </div>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} />
              Available for work
            </div>
          </motion.div>

          <motion.h1 className={styles.heroTitle} variants={itemVariants}>
            Abdalkader Alhamoud
          </motion.h1>

          <motion.h2 className={styles.heroSubtitle} variants={itemVariants}>
            Full Stack & AI Engineer
          </motion.h2>

          <motion.p className={styles.heroDescription} variants={itemVariants}>
            I build, train, and deploy LLM-powered systems. Experience fine-tuning models,
            designing AI agents, and shipping production applications. Proficient across the stack
            from architecture to production.
          </motion.p>

          <motion.div className={styles.heroInfo} variants={itemVariants}>
            <div className={styles.infoItem}>
              <MapPin size={16} />
              <span>Erbil, Iraq</span>
            </div>
            <div className={styles.infoItem}>
              <Phone size={16} />
              <a href="tel:+9647506913813">+964 750 691 3813</a>
            </div>
            <div className={styles.infoItem}>
              <Mail size={16} />
              <a href="mailto:hello@abdalkader.dev">hello@abdalkader.dev</a>
            </div>
            <div className={styles.infoItem}>
              <Globe size={16} />
              <a href="https://abdalkader.dev" target="_blank" rel="noopener noreferrer">abdalkader.dev</a>
            </div>
          </motion.div>

          <motion.div className={styles.heroSocial} variants={itemVariants}>
            <a href="https://github.com/Abdalkaderdev" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/abdalkaderdev" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <Linkedin size={20} />
            </a>
          </motion.div>
        </motion.section>

        {/* Tab Navigation */}
        <motion.div
          className={styles.tabs}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {(['experience', 'skills', 'projects', 'education'] as const).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Experience Section */}
        {activeTab === 'experience' && (
          <motion.section
            className={styles.experience}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.timeline}>
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  className={styles.timelineItem}
                  variants={itemVariants}
                >
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.expHeader}>
                      <div>
                        <h3 className={styles.expTitle}>{exp.title}</h3>
                        <p className={styles.expCompany}>{exp.company}</p>
                      </div>
                      <div className={styles.expMeta}>
                        <span className={styles.expPeriod}>{exp.period}</span>
                        <span className={styles.expLocation}>{exp.location}</span>
                      </div>
                    </div>
                    <p className={styles.expDescription}>{exp.description}</p>
                    <ul className={styles.expHighlights}>
                      {exp.highlights.map((highlight, i) => (
                        <li key={i}>
                          <ChevronRight size={14} />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <div className={styles.expTech}>
                      {exp.tech.map((tech) => (
                        <span key={tech} className={styles.techPill}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills Section */}
        {activeTab === 'skills' && (
          <motion.section
            className={styles.skills}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.skillsGrid}>
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className={styles.skillCard}
                  variants={itemVariants}
                >
                  <div className={styles.skillHeader}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillLevel}>{skill.level}%</span>
                  </div>
                  <div className={styles.skillBar}>
                    <motion.div
                      className={styles.skillProgress}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <span className={styles.skillCategory}>{skill.category}</span>
                </motion.div>
              ))}
            </div>

            <motion.div className={styles.techCloud} variants={itemVariants}>
              <h3>Also experienced with</h3>
              <div className={styles.techTags}>
                {['GraphQL', 'REST APIs', 'Git', 'CI/CD', 'GCP', 'DigitalOcean', 'Vercel', 'Redis', 'Tailwind', 'HTML5', 'CSS3', 'Linux', 'Nginx'].map((tech) => (
                  <span key={tech} className={styles.techTag}>{tech}</span>
                ))}
              </div>
            </motion.div>

            <motion.div className={styles.languages} variants={itemVariants}>
              <h3>Languages</h3>
              <div className={styles.languageList}>
                <span>Arabic (Native)</span>
                <span>English (Fluent)</span>
                <span>Kurdish (Basic)</span>
                <span>French & Spanish (Learning)</span>
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <motion.section
            className={styles.projects}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <motion.a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectCard}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <span className={styles.projectLink}>
                    View Project <ExternalLink size={14} />
                  </span>
                </motion.a>
              ))}
            </div>

            <motion.div className={styles.viewMore} variants={itemVariants}>
              <a href="https://abdalkader.dev/projects" target="_blank" rel="noopener noreferrer">
                View all projects on abdalkader.dev
                <ExternalLink size={16} />
              </a>
            </motion.div>
          </motion.section>
        )}

        {/* Education Section */}
        {activeTab === 'education' && (
          <motion.section
            className={styles.educationSection}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Education */}
            <motion.div className={styles.eduCard} variants={itemVariants}>
              <div className={styles.eduIcon}>
                <GraduationCap size={24} />
              </div>
              <div className={styles.eduContent}>
                <h3>{education.degree}</h3>
                <p className={styles.eduSchool}>{education.school}</p>
                <p className={styles.eduPeriod}>{education.period}</p>
                <p className={styles.eduCoursework}>Relevant Coursework: {education.coursework}</p>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.h3 className={styles.sectionSubtitle} variants={itemVariants}>
              Certifications & Training
            </motion.h3>

            <div className={styles.certGrid}>
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  className={styles.certCard}
                  variants={itemVariants}
                >
                  <Award size={20} className={styles.certIcon} />
                  <h4>{cert.name}</h4>
                  <p className={styles.certIssuer}>{cert.issuer} • {cert.year}</p>
                  {cert.description && <p className={styles.certDesc}>{cert.description}</p>}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Contact CTA */}
        <motion.section
          className={styles.contact}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2>Let&apos;s work together</h2>
          <p>I&apos;m currently available for freelance projects and full-time opportunities.</p>
          <div className={styles.contactActions}>
            <motion.a
              href="mailto:hello@abdalkader.dev"
              className={styles.primaryBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={18} />
              Get in Touch
            </motion.a>
            <motion.a
              href="https://abdalkader.dev/contact"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Page
              <ExternalLink size={16} />
            </motion.a>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Abdalkader Alhamoud. All rights reserved.</p>
        <a href="https://abdalkader.dev" target="_blank" rel="noopener noreferrer">
          abdalkader.dev
        </a>
      </footer>
    </div>
  );
}
