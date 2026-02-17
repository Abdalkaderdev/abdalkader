import ProjectCard from '@/components/ProjectCard';

export default function CardPreview() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px'
        }}>
            <h1 style={{
                color: '#fff',
                fontFamily: 'var(--font-pp-medium)',
                fontSize: '32px',
                marginBottom: '20px'
            }}>
                Project Cards with AI Backgrounds
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '40px' }}>
                Click any card to flip it
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 420px))',
                gap: '40px',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '1400px'
            }}>
                {/* Card 1 - Gothic Archway (Best for flagship) */}
                <ProjectCard
                    number="01"
                    title="DiscipleOne Platform"
                    type="Faith-Based Application"
                    description="A spiritual growth platform designed to help believers deepen their faith through guided devotionals, community features, and personalized learning paths."
                    techStack={['Next.js', 'Prisma', 'Tailwind', 'Vercel']}
                    features={[
                        'Daily devotional content',
                        'Prayer request community',
                        'Bible study tools',
                        'Progress tracking'
                    ]}
                    liveUrl="https://discipleone.app"
                    caseStudyUrl="/projects/discipleone"
                    customBgImage="/images/cards/card-layered-archway.jpg"
                />

                {/* Card 2 - Modern Chapel */}
                <ProjectCard
                    number="02"
                    title="SoapBox Super App"
                    type="Mobile Application"
                    description="A comprehensive mobile platform that revolutionizes how communities connect, share, and collaborate. Built with cutting-edge technology for seamless real-time experiences."
                    techStack={['React Native', 'Node.js', 'MongoDB', 'Socket.io']}
                    features={[
                        'Real-time messaging with encryption',
                        'Integrated payment processing',
                        'AI-powered content recommendations',
                        'Cross-platform synchronization'
                    ]}
                    liveUrl="https://soapbox.app"
                    caseStudyUrl="/projects/soapbox"
                    customBgImage="/images/cards/card-modern-chapel.jpg"
                />

                {/* Card 3 - Black Marble */}
                <ProjectCard
                    number="03"
                    title="ParsaLink AI CRM"
                    type="Enterprise Platform"
                    description="An intelligent CRM system powered by machine learning that predicts customer behavior and automates relationship management for enterprise clients."
                    techStack={['Python', 'TensorFlow', 'React', 'PostgreSQL']}
                    features={[
                        'Predictive analytics dashboard',
                        'Automated lead scoring',
                        'Natural language processing',
                        'Custom workflow automation'
                    ]}
                    liveUrl="https://parsalink.io"
                    caseStudyUrl="/projects/parsalink"
                    customBgImage="/images/cards/card-black-marble.jpg"
                />

                {/* Card 4 - Gothic Arch with Light */}
                <ProjectCard
                    number="04"
                    title="VIA Discipleship App"
                    type="Mobile Application"
                    description="A discipleship journey app that guides new believers through foundational Christian teachings with interactive lessons and community support."
                    techStack={['Flutter', 'Firebase', 'Node.js', 'GraphQL']}
                    features={[
                        'Interactive Bible lessons',
                        'Mentor matching system',
                        'Progress milestones',
                        'Community discussions'
                    ]}
                    liveUrl="https://viaapp.org"
                    caseStudyUrl="/projects/via"
                    customBgImage="/images/cards/card-gothic-arch.jpg"
                />

                {/* Card 5 - Sacred Geometry */}
                <ProjectCard
                    number="05"
                    title="Quantum Animation"
                    type="Interactive Experience"
                    description="A physics-based animation playground exploring particle systems, gravitational forces, and quantum-inspired visual effects for creative coding."
                    techStack={['Three.js', 'WebGL', 'GSAP', 'TypeScript']}
                    features={[
                        'Real-time particle physics',
                        'Custom shader effects',
                        'Interactive controls',
                        'Export animations'
                    ]}
                    liveUrl="https://quantum.abdalkader.dev"
                    caseStudyUrl="/projects/quantum"
                    customBgImage="/images/cards/card-sacred-geometry.jpg"
                />

                {/* Card 6 - Black Marble variant (reuse) */}
                <ProjectCard
                    number="06"
                    title="VirtualView"
                    type="3D Visualization"
                    description="An immersive 3D property viewing platform that allows real estate agents and buyers to explore properties virtually with photorealistic rendering."
                    techStack={['React Three Fiber', 'Blender', 'AWS', 'Next.js']}
                    features={[
                        '360° virtual tours',
                        'Real-time lighting',
                        'Measurement tools',
                        'VR headset support'
                    ]}
                    liveUrl="https://virtualview.io"
                    caseStudyUrl="/projects/virtualview"
                    customBgImage="/images/cards/card-black-marble.jpg"
                />
            </div>
        </div>
    );
}
