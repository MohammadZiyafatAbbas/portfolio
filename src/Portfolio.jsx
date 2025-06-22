import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaLeaf,
  FaSeedling,
  FaMoon,
  FaSun,
  FaFileDownload,
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// ===== CUSTOM HOOKS =====
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeight = document.documentElement.scrollHeight - 
                       document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return progress;
};

// ===== COMPONENTS =====
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formsubmit.co/ajax/824bc1d08da3ec0d289a450af80f61fa', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: 'New message from your portfolio',
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();
      
      if (data.success === 'true') {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-xs mx-auto">
      <input type="hidden" name="_autoresponse" value="Thank you for your message. I'll get back to you soon!" />
      
      <div>
        <input
          type="text"
          placeholder="Your Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 dark:focus:ring-stone-500 text-sm placeholder-stone-400 dark:placeholder-stone-500"
        />
      </div>
      
      <div>
        <input
          type="email"
          placeholder="Your Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 dark:focus:ring-stone-500 text-sm placeholder-stone-400 dark:placeholder-stone-500"
        />
      </div>
      
      <div>
        <textarea
          placeholder="Your Message"
          name="message"
          rows="3"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 dark:focus:ring-stone-500 text-sm placeholder-stone-400 dark:placeholder-stone-500"
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-800 px-4 py-2 rounded-xl hover:bg-stone-700 dark:hover:bg-stone-300 transition flex items-center justify-center gap-2 text-sm"
      >
        {isSubmitting ? (
          <>
            <span className="inline-block h-3 w-3 border-2 border-white dark:border-stone-800 border-t-transparent rounded-full animate-spin"></span>
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
      
      {submitStatus === 'success' && (
        <div className="p-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-xl text-center">
          Message sent successfully! I'll get back to you soon.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-2 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-xl text-center">
          Failed to send message. Please try again or email me directly.
        </div>
      )}
    </form>
  );
};

const SplashScreen = ({ onComplete }) => {
  const letters = ["Z", "i", "y", "a", "f", "a", "t"];
  const lettersRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate each letter sequentially
    tl.to(lettersRef.current, {
      y: -20,
      opacity: 1,
      duration: 0.3,
      stagger: 0.1,
      ease: "back.out"
    })
    .to(lettersRef.current, {
      y: 0,
      duration: 0.5,
      delay: 1,
      ease: "bounce.out"
    })
    .to(lettersRef.current, {
      opacity: 0,
      y: -40,
      duration: 0.8,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: onComplete
    });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-stone-50 dark:bg-stone-900 flex items-center justify-center z-50">
      <div className="flex">
        {letters.map((letter, i) => (
          <span 
            key={i}
            ref={el => lettersRef.current[i] = el}
            className="text-5xl md:text-7xl font-cursive text-stone-800 dark:text-stone-200 opacity-0"
            style={{ transform: 'translateY(40px)' }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

// ===== MAIN PORTFOLIO COMPONENT =====
export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const panels = gsap.utils.toArray(".panel");
    const container = containerRef.current;

    ScrollTrigger.killAll();

    gsap.to(panels, {
      yPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => `+=${container.offsetHeight * (panels.length - 1)}`,
        anticipatePin: 1,
      },
    });

    document.body.style.overflowY = "auto";
    return () => ScrollTrigger.killAll();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const socialLinks = [
    { icon: <FaGithub />, href: "https://github.com/MohammadZiyafatAbbas", label: "GitHub" },
    { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/mohammad-ziyafat-abbas/", label: "LinkedIn" },
    { icon: <FaInstagram />, href: "https://www.instagram.com/ziyafat_here/", label: "Instagram" },
  ];

  const projects = [
    {
      title: "Library Management System",
      description: "Developed a system for tracking books, users, and transactions. Included CRUD operations and a responsive UI.",
      detailedDescription: "Built with PHP and MySQL, this system features user authentication, book categorization, and reporting. Implemented responsive design principles for cross-device compatibility.",
      tags: ["PHP", "MySQL"],
      icon: <FaLeaf className="text-stone-500" />,
    },
    {
      title: "SMS Spam Detector",
      description: "Built a model to classify SMS messages using NLP and machine learning. Included preprocessing and evaluation.",
      detailedDescription: "Utilized TF-IDF vectorization and experimented with Naive Bayes, Logistic Regression, and SVM classifiers. Achieved 98% accuracy on test data with careful feature engineering.",
      tags: ["Python", "Scikit-learn", "SpaCy NLP", "Pandas", "Streamlit"],
      icon: <FaSeedling className="text-stone-500" />,
      codeUrl: "https://github.com/MohammadZiyafatAbbas/SMS-Spam-Detector",
      demoUrl: "https://sms-spam-detector-app.streamlit.app/"
    },
    {
      title: "Face Liveness Detection",
      description: "Implemented real-time face liveness detection using CNNs. Integrated OpenCV for live input and preprocessing.",
      detailedDescription: "Developed a custom CNN architecture that distinguishes real faces from photos/videos. Implemented frame differencing and eye blink detection for additional security layers.",
      tags: ["Python", "TensorFlow", "OpenCV"],
      icon: <FaLeaf className="text-stone-500" />,
    },
  ];

  const experiences = [
    {
      role: "AI Intern — TechSaksham",
      description: "Built an SMS Spam Detection system using NLP and machine learning. Applied TF-IDF, Naive Bayes, Logistic Regression.",
      period: "Dec 2024 – Feb 2025",
      icon: "🌱",
    },
    {
      role: "Data Science Intern — Slash Mark",
      description: "Conducted real-world data analysis projects, summarized findings for decision-making, adhered to industry standards.",
      period: "Mar 2024 – May 2024",
      icon: "📈",
    },
    {
      role: "Web Development Intern — Sparks Foundation",
      description: "Created a donation site with Razorpay integration, supporting various payment methods and automated email receipts.",
      period: "Oct 2023 – Nov 2023",
      icon: "🌍",
    },
  ];

  const downloadResume = () => {
    const resumeUrl = '/Resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Mohammad_Ziyafat_Abbas_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Splash Screen - will disappear after animation completes */}
      {isLoading && <SplashScreen onComplete={() => setIsLoading(false)} />}
      
      {/* Main Portfolio Content - hidden until splash screen finishes */}
      <main
        ref={containerRef}
        className={`bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-sans h-screen overflow-hidden transition-colors duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 transition-all duration-300 hover:scale-110"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* SCROLL PROGRESS */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 h-1 w-24 bg-stone-300 dark:bg-stone-600 rounded-full overflow-hidden z-50">
          <div 
            className="h-full bg-stone-500 dark:bg-stone-400 rounded-full transition-all duration-100" 
            style={{ width: `${scrollProgress}%` }} 
          />
        </div>

        {/* ===== HERO SECTION ===== */}
        <section className="panel h-screen w-screen flex items-center justify-center px-6 relative">
          <div className="absolute bottom-8 left-8 flex-col gap-4 text-xl hidden sm:flex text-stone-500">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-700 dark:hover:text-stone-300 transition-colors hover:scale-110"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>

          <div className="text-center max-w-2xl px-4 z-10">
            <div className="flex justify-center mb-6">
              <FaLeaf className="text-3xl text-stone-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
              <span className="sr-only">Portfolio of</span> 
              Mohammad Ziyafat Abbas
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-400 mb-6">
              Harmonizing technology with nature through thoughtful development
            </p>

            <button
              onClick={downloadResume}
              className="inline-flex items-center gap-2 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-800 px-4 py-2 rounded-xl hover:bg-stone-700 dark:hover:bg-stone-300 transition mb-8 text-sm"
            >
              <FaFileDownload className="text-xs" />
              <span>Download Resume</span>
            </button>

            <div className="mt-8 animate-float">
              <div className="h-8 w-5 border border-stone-400 rounded-full mx-auto relative">
                <div className="h-1 w-1 bg-stone-400 rounded-full absolute top-1 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ABOUT SECTION ===== */}
        <section className="panel h-screen w-screen flex items-center justify-center px-6 bg-stone-100/50 dark:bg-stone-800/50">
          <div className="max-w-3xl mx-auto p-8 text-center">
            <h2 className="text-3xl font-light mb-8 pb-4 border-b border-stone-200 dark:border-stone-700 inline-block">
              Philosophy
            </h2>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              I create technology that respects both users and the environment—minimal, efficient, 
              and purposeful solutions that reduce digital clutter while solving real problems.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-md mx-auto">
              {["Sustainability", "Simplicity", "Efficiency", "Clarity"].map((value, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-stone-400 dark:bg-stone-500"></div>
                  <span className="text-stone-600 dark:text-stone-300 text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROJECTS SECTION ===== */}
        <section className="panel h-screen w-screen flex items-center justify-center px-6 bg-stone-50 dark:bg-stone-900">
          <div className="w-full max-w-4xl px-4">
            <h2 className="text-3xl font-light text-center mb-12 pb-4 border-b border-stone-200 dark:border-stone-700 inline-block">
              Work
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <div
                  key={i}
                  onClick={() => setActiveProject(project)}
                  className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-stone-700/50 transition-all duration-300 border border-stone-100 dark:border-stone-700 group hover:scale-[1.02] cursor-pointer"
                >
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                    {project.icon}
                  </div>
                  <h3 className="text-xl font-normal mb-2">{project.title}</h3>
                  <p className="text-stone-600 dark:text-stone-400 mb-4 text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Modal */}
          {activeProject && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-stone-800 max-w-2xl w-full p-8 rounded-lg relative">
                <button 
                  onClick={() => setActiveProject(null)}
                  className="absolute top-4 right-4 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                >
                  ✕
                </button>
                <div className="text-4xl mb-4">{activeProject.icon}</div>
                <h3 className="text-2xl font-light mb-2">{activeProject.title}</h3>
                <p className="text-stone-600 dark:text-stone-400 mb-6">{activeProject.detailedDescription}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {activeProject.codeUrl && (
                    <a 
                      href={activeProject.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-800 px-4 py-2 rounded hover:bg-stone-700 dark:hover:bg-stone-300 transition"
                    >
                      View Code
                    </a>
                  )}
                  {activeProject.demoUrl && (
                    <a 
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm border border-stone-300 dark:border-stone-600 px-4 py-2 rounded hover:bg-stone-100 dark:hover:bg-stone-700 transition"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ===== EXPERIENCE SECTION ===== */}
        <section className="panel h-screen w-screen flex items-center justify-center px-6 bg-stone-100/50 dark:bg-stone-800/50">
          <div className="max-w-3xl w-full px-4">
            <h2 className="text-3xl font-light text-center mb-12 pb-4 border-b border-stone-200 dark:border-stone-700 inline-block">
              Journey
            </h2>

            <div className="space-y-8 max-w-md mx-auto">
              {experiences.map((exp, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="text-2xl mt-1 text-stone-500">{exp.icon}</div>
                  <div className="border-l-2 border-stone-300 dark:border-stone-600 pl-4">
                    <h3 className="text-xl font-normal">{exp.role}</h3>
                    <p className="text-stone-500 text-sm mb-1">{exp.period}</p>
                    <p className="text-stone-700 dark:text-stone-300">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT SECTION ===== */}
        <section className="panel h-screen w-screen flex items-center justify-center px-6 bg-stone-50 dark:bg-stone-900">
          <div className="text-center w-full">
            <h2 className="text-3xl font-light mb-8 pb-4 border-b border-stone-200 dark:border-stone-700 inline-block">
              Connect
            </h2>
            <p className="text-stone-600 dark:text-stone-300 mb-8">
              Let's collaborate on meaningful projects
            </p>

            <ContactForm />

            <div className="mt-8 flex justify-center gap-6 text-xl text-stone-500">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-stone-700 dark:hover:text-stone-300 transition hover:scale-110"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>

            <div className="mt-12 text-stone-400 text-sm">
              <p>Mohammad Ziyafat Abbas © {new Date().getFullYear()}</p>
            </div>
          </div>
        </section>

        <style jsx global>{`
          body {
            transition: background-color 0.5s ease, color 0.5s ease;
            overflow: ${isLoading ? 'hidden' : 'auto'};
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          button:focus, a:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(100, 100, 100, 0.5);
          }

          .dark button:focus, .dark a:focus {
            box-shadow: 0 0 0 2px rgba(200, 200, 200, 0.5);
          }

          .font-cursive {
            font-family: 'Dancing Script', cursive;
          }
        `}</style>
      </main>
    </>
  );
}