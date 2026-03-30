import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function About() {
  const heroRef = useRef(null);

  useEffect(() => {
    const heroText = heroRef.current?.querySelectorAll('.reveal-text h1');
    if (!heroText || heroText.length === 0) return;

    document.fonts.ready.then(() => {
      gsap.fromTo(
        heroText,
        { y: 100, opacity: 0, willChange: 'transform' },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
          force3D: true,
          clearProps: 'willChange',
        }
      );
    });

    // Animate content section
    const contentSections = document.querySelectorAll('.about-content');
    if (contentSections.length > 0) {
      gsap.to(contentSections, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.8,
      });
    }
  }, []);

  return (
    <>
      <div className="noise-overlay"></div>

      <section className="page-hero" ref={heroRef}>
        <div className="page-hero-content">
          <div className="reveal-text">
            <h1>ABOUT</h1>
          </div>
          <div className="reveal-text">
            <h1>ME.</h1>
          </div>
        </div>
      </section>

      <section className="about-content">
        {/* Philosophy / Bio */}
        <div className="about-philosophy">
          <span className="section-label">01 / PHILOSOPHY</span>
          <h2 className="about-statement">
            I am a design-driven, goal-focused creator, producer, and designer who believes that the <em>details</em> make all the difference.
          </h2>
          <p className="about-bio">
            As a skilled software engineer with a passion for innovative solutions, I leverage my technical expertise to craft efficient, scalable, and user-centric software applications that drive business growth and excellence. My approach combines creative design thinking with solid technical implementation to deliver memorable digital experiences.
          </p>
        </div>

        {/* Who I Am + What I Do */}
        <div className="about-intro">
          <div className="about-col">
            <span className="section-label">02 / WHO I AM</span>
            <p>
              I'm Chinmaya Swain — a system architect, developer, and creative technologist from Cuttack, India. I build things at the intersection of design and engineering, where beautiful interfaces meet robust backend systems.
            </p>
          </div>
          <div className="about-col">
            <span className="section-label">03 / WHAT I DO</span>
            <p>
              Full-stack development with MERN, Python automation, computer vision with OpenCV, and creative coding with Three.js. I believe in systems that are both powerful and elegant.
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="about-skills">
          <span className="section-label">04 / SKILLS THAT I KNOW</span>
          <div className="skills-grid">
            {['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'Three.js', 'OpenCV', 'Java', 'Express', 'GSAP', 'Git', 'Figma', 'HTML / CSS', 'SCSS', 'REST APIs', 'UI/UX Design'].map((skill) => (
              <div key={skill} className="skill-item">{skill}</div>
            ))}
          </div>
        </div>

        {/* Education & Experience Timeline */}
        <div className="about-timeline">
          <span className="section-label">05 / EDUCATION & EXPERIENCE</span>
          <h2 className="timeline-title">My Academic Journey &<br />Professional Development</h2>

          <div className="timeline">
            {[
              {
                tag: 'Currently Pursuing',
                title: 'Bachelor of Computer Applications (BCA)',
                subtitle: 'Computer Science & Applications',
                desc: 'Pursuing a comprehensive undergraduate program focused on core principles of computer science, including programming, data structures, algorithms, and web development. Actively building foundational skills while exploring interests in modern software engineering and emerging technologies.',
              },
              {
                tag: 'Completed',
                title: 'Higher Secondary Education',
                subtitle: 'Christ Higher Secondary School, Cuttack',
                desc: 'Completed my higher secondary education with a focus on Science, specializing in Mathematics, Physics, and Chemistry. Developed strong analytical and problem-solving skills, and laid the academic groundwork for a career in computer science.',
              },
              {
                tag: 'Certification',
                title: 'Web Development Certification',
                subtitle: 'Full Stack Development',
                desc: 'Completed comprehensive certification in modern web technologies including React, Node.js, Express, MongoDB, and responsive design principles. Created several full-stack applications as part of the certification.',
              },
              {
                tag: 'Specialization',
                title: 'UI/UX Design Specialization',
                subtitle: 'User Experience Design',
                desc: 'Advanced training in user interface design, user experience principles, and creating intuitive digital experiences that engage users. Focused on design systems, prototyping, and usability testing methodologies.',
                isLast: true,
              },
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-dot"></span>
                  {!item.isLast && <span className="timeline-line"></span>}
                </div>
                <div className="timeline-content">
                  <span className="timeline-tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <h4>{item.subtitle}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
