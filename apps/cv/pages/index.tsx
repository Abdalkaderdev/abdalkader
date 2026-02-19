import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Globe, Download, ExternalLink, Github, Linkedin, ChevronRight } from 'lucide-react';
import styles from '@/styles/Home.module.scss';

// CV Data
const experience = [
  {
    title: 'Full Stack AI Engineer',
    company: 'SoapBox Super App',
    period: '2024 - Present',
    location: 'Remote',
    description: 'Building AI-powered content creation tools and multi-channel communication platform for faith communities.',
    highlights: [
      'Developed AI content generation system using Claude API',
      'Built multi-channel messaging (email, SMS, push notifications)',
      'Implemented real-time collaboration features',
    ],
    tech: ['React', 'Node.js', 'TypeScript', 'AI/ML', 'PostgreSQL'],
  },
  {
    title: 'Full Stack Software Engineer',
    company: 'DiscipleOne Platform',
    period: '2024 - Present',
    location: 'Remote',
    description: '501(c)(3) nonprofit platform providing free discipleship tools for churches.',
    highlights: [
      'Serving 50+ partner churches with 1,000+ active users',
      'Built comprehensive spiritual growth tracking system',
      'Implemented church management dashboard',
    ],
    tech: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
  },
  {
    title: 'Full Stack Software Engineer',
    company: 'VIA Discipleship App',
    period: '2024 - Present',
    location: 'Remote',
    description: 'Cross-platform mobile application for daily devotions and spiritual growth.',
    highlights: [
      'Built iOS, Android, and Web versions from single codebase',
      'Implemented offline-first architecture',
      'Created Bible study and prayer journaling features',
    ],
    tech: ['React Native', 'Node.js', 'TypeScript', 'Firebase'],
  },
  {
    title: 'Full Stack Developer',
    company: 'ParsaLink AI CRM',
    period: '2024 - Present',
    location: 'Remote',
    description: 'AI-powered CRM with intelligent chatbot for lead capture and conversion.',
    highlights: [
      'Built AI chatbot with multi-language support',
      'Implemented automated email generation system',
      'Created analytics dashboard for conversion tracking',
    ],
    tech: ['React', 'Node.js', 'AI/ML', 'TypeScript', 'PostgreSQL'],
  },
];

const skills = [
  { name: 'React / Next.js', level: 95, category: 'Frontend' },
  { name: 'TypeScript', level: 90, category: 'Frontend' },
  { name: 'Node.js / Express', level: 92, category: 'Backend' },
  { name: 'AI/ML Integration', level: 85, category: 'AI' },
  { name: 'PostgreSQL / MongoDB', level: 88, category: 'Database' },
  { name: 'React Native', level: 82, category: 'Mobile' },
  { name: 'GSAP / Framer Motion', level: 90, category: 'Animation' },
  { name: 'AWS / Vercel', level: 85, category: 'Cloud' },
];

const projects = [
  {
    name: 'SoapBox Super App',
    description: 'Faith community platform with AI tools',
    url: 'https://abdalkader.dev/projects/soapbox-super-app',
  },
  {
    name: 'DiscipleOne Platform',
    description: 'Free discipleship tools for churches',
    url: 'https://abdalkader.dev/projects/discipleone-platform',
  },
  {
    name: 'ParsaLink AI CRM',
    description: 'AI-powered customer relationship management',
    url: 'https://abdalkader.dev/projects/parsalink-ai-crm',
  },
  {
    name: 'VIA Discipleship',
    description: 'Cross-platform spiritual growth app',
    url: 'https://abdalkader.dev/projects/via-discipleship-app',
  },
];

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
  const [activeTab, setActiveTab] = useState<'experience' | 'skills' | 'projects'>('experience');

  const handleDownloadPDF = () => {
    // In production, this would generate or link to a PDF
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
              <span>AA</span>
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
            Full Stack AI Engineer
          </motion.h2>

          <motion.p className={styles.heroDescription} variants={itemVariants}>
            I build AI-powered web applications and SaaS platforms that solve real problems.
            Passionate about creating seamless user experiences with cutting-edge technology.
          </motion.p>

          <motion.div className={styles.heroInfo} variants={itemVariants}>
            <div className={styles.infoItem}>
              <MapPin size={16} />
              <span>Iraq (Kurdistan Region)</span>
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
            <a href="https://github.com/abdalkaderdev" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
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
          {(['experience', 'skills', 'projects'] as const).map((tab) => (
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
                {['GraphQL', 'REST APIs', 'Git', 'CI/CD', 'Docker', 'Three.js', 'TDD', 'Agile', 'Firebase', 'Supabase', 'Claude API', 'OpenAI'].map((tech) => (
                  <span key={tech} className={styles.techTag}>{tech}</span>
                ))}
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
