import React, { useState, useEffect } from 'react';

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://ayushacharya.info.np/#person",
      "name": "Ayush Acharya",
      "url": "https://ayushacharya.info.np/",
      "image": "https://raw.githubusercontent.com/ayushacharya05/Ayush-Acharya/refs/heads/main/images/profile.webp",
      "jobTitle": "Web Developer & Digital Strategist",
      "worksFor": { "@type": "Organization", "name": "Freelance" },
      "sameAs": [
        "https://github.com/ayushacharya05",
        "https://www.linkedin.com/in/ayush-acharya-31a838263/",
        "https://www.instagram.com/itsayushacharya/",
        "https://www.facebook.com/itsayushacharya"
      ],
      "knowsAbout": ["Web Development", "SEO Optimization", "UI/UX Design", "WordPress Theme Development", "Android Development"]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://ayushacharya.info.np/#service",
      "name": "Ayush Acharya - Digital Services",
      "url": "https://ayushacharya.info.np/",
      "priceRange": "$$",
      "address": { "@type": "PostalAddress", "addressCountry": "NP" },
      "areaServed": "Worldwide"
    },
    {
      "@type": "WebSite",
      "@id": "https://ayushacharya.info.np/#website",
      "url": "https://ayushacharya.info.np/",
      "name": "Ayush Acharya",
      "publisher": { "@id": "https://ayushacharya.info.np/#person" }
    }
  ]
};

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogCarouselPage, setBlogCarouselPage] = useState(0);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState(false);

  const CARDS_PER_PAGE = 3;

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 600);

      const sections = ['home', 'about', 'projects', 'blog', 'services', 'contact'];
      let currentSection = 'home';
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && window.pageYOffset >= el.offsetTop - 140) {
          currentSection = sectionId;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.handleBloggerPosts = (data) => {
      setBlogLoading(false);
      const entries = data?.feed?.entry || [];
      if (entries.length === 0) return;

      const parsedPosts = entries.map(entry => {
        const title = entry.title?.$t || 'Untitled';
        const linkObj = entry.link?.find(l => l.rel === 'alternate');
        const link = linkObj ? linkObj.href : 'https://blog.ayushacharya.info.np/';
        const category = entry.category && entry.category.length > 0 ? entry.category[0].term : 'Blog';

        const publishedDate = new Date(entry.published.$t).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });

        let mediaThumbnail = 'https://raw.githubusercontent.com/itsayushacharya/Ayush-Acharya/refs/heads/main/public/profile.webp';
        if (entry.content && entry.content.$t) {
          const imgMatch = entry.content.$t.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) mediaThumbnail = imgMatch[1];
        } else if (entry.media$thumbnail && entry.media$thumbnail.url) {
          mediaThumbnail = entry.media$thumbnail.url.replace(/\/s\d+(-c)?\//, '/s1600/');
        }

        let summary = '';
        if (entry.summary) {
          summary = entry.summary.$t;
        } else if (entry.content) {
          summary = entry.content.$t.replace(/<[^>]*>/g, '');
        }
        summary = summary.replace(/\s+/g, ' ').trim().substring(0, 90) + '...';

        return { title, link, category, publishedDate, mediaThumbnail, summary };
      });

      setBlogPosts(parsedPosts);
    };

    const script = document.createElement('script');
    script.src = 'https://blog.ayushacharya.info.np/feeds/posts/default?alt=json-in-script&callback=handleBloggerPosts&max-results=9';
    script.onerror = () => {
      setBlogLoading(false);
      setBlogError(true);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete window.handleBloggerPosts;
    };
  }, []);

  const totalPages = Math.ceil(blogPosts.length / CARDS_PER_PAGE);

  const prevBlogPage = () => {
    setBlogCarouselPage(prev => Math.max(0, prev - 1));
  };

  const nextBlogPage = () => {
    setBlogCarouselPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const visibleBlogPosts = blogPosts.slice(
    blogCarouselPage * CARDS_PER_PAGE,
    (blogCarouselPage + 1) * CARDS_PER_PAGE
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header>
        <div className="nav-container">
          <nav aria-label="Main Navigation">
            <div className="logo">
              <a href="#home" onClick={(e) => scrollToSection(e, 'home')}>
                Ayush<span> Acharya</span>
              </a>
            </div>
            <div className="nav-right">
              <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`} id="navLinks">
                {['home', 'about', 'projects', 'blog', 'services', 'contact'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item}`}
                      className={`nav-item ${activeSection === item ? 'active-link' : ''}`}
                      aria-current={activeSection === item ? 'page' : undefined}
                      onClick={(e) => scrollToSection(e, item)}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="https://shop.ayushacharya.info.np/" className="nav-btn mobile-only">
                    🛒 Shop Services
                  </a>
                </li>
              </ul>
              <a href="https://shop.ayushacharya.info.np/" className="nav-btn desktop-only">
                🛒 Shop Services
              </a>
              <button
                className="menu-toggle"
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="home" aria-label="Introduction">
          <div className="container hero-wrapper">
            <div className="hero-text-block">
              <h1>
                Hi, <span className="gradient-text">It's me</span>
                <br /> Ayush Acharya
              </h1>
              <p>
                I am a Nepal-based web developer, UI/UX designer, and SEO strategist focused on creating fast, modern, and high-converting web applications for businesses worldwide.
              </p>
              <div className="hero-buttons">
                <a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="primary-btn">
                  <i className="fas fa-rocket" aria-hidden="true" /> Project Vault
                </a>
                <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="secondary-btn">
                  <i className="fas fa-paper-plane" aria-hidden="true" /> Contact Me
                </a>
              </div>
            </div>
            <div className="hero-image">
              <div className="profile-card">
                <img
                  src="https://raw.githubusercontent.com/itsayushacharya/Ayush-Acharya/refs/heads/main/public/profile.webp"
                  alt="Portrait of Ayush Acharya"
                  width="380"
                  height="380"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="about" aria-labelledby="about-heading">
  <div className="container">
    <div className="section-title reveal active">
      <span>About Me</span>
      <h2 id="about-heading">
        Nepali Developer, Tech Enthusiast &amp; Music Lover
      </h2>
      <p>
        I'm a developer from Nepal who genuinely loves building things for the web — and yes, I usually have my headphones on while doing it.
      </p>
    </div>

    <div className="about-grid">
      <div className="glass-card reveal active">
        <h3>A Bit About Me</h3>
        <p>
          I grew up curious about how things work, and that curiosity turned into a love for code. These days I spend my time crafting full-stack web apps, obsessing over clean UI, and figuring out how to make things rank on Google without gaming the system. When I'm not coding, I'm probably digging through a new playlist.
        </p>
      </div>

      <div className="glass-card reveal active">
        <h3>What I'm Working Toward</h3>
        <p>
          My goal is simple — build tech that actually solves problems for people and businesses, especially here in Nepal and beyond. I want to create fast, honest, well-designed products that help brands grow organically and give users an experience they don't hate. Long-term, I want to be part of putting Nepali tech on the map.
        </p>
      </div>
    </div>
  </div>
</section>

        <section id="projects" aria-labelledby="projects-heading">
          <div className="container">
            <div className="section-title reveal active">
              <span>Project Vault</span>
              <h2 id="projects-heading">Featured Software &amp; Web Projects</h2>
              <p>
                Explore real-world web platforms, custom WordPress themes, and Android apps engineered for speed and conversion.
              </p>
            </div>

            <div className="section-header-link">
              <a href="https://ayushacharya.info.np/projects/" className="header-link-btn" target="_blank" rel="noopener noreferrer">
                View All Projects <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" />
              </a>
            </div>

            <div className="project-grid" id="projectGrid">
              <article className="project-card reveal active" data-category="Utility">
                <div className="card-thumb">
                  <img src="https://raw.githubusercontent.com/itsayushacharya/Hydro-Habit/refs/heads/main/download/thumbnail.png" alt="Hydro Habit preview" loading="lazy" width="300" height="169" />
                </div>
                <span className="tag">Android App</span>
                <h3>Hydro Habit - Hydration Tracker</h3>
                <p>Hydro Habit is a minimalist Android application designed with clean UI elements to help users track daily hydration and build consistent habits.</p>
                <a href="https://hydrohabit.ayushacharya.info.np/" target="_blank" rel="noopener noreferrer" className="btn-link">
                  Open App <i className="fas fa-arrow-right" aria-hidden="true" />
                </a>
              </article>

              <article className="project-card reveal active" data-category="Utility">
                <div className="card-thumb">
                  <img src="https://raw.githubusercontent.com/itsayushacharya/Evokebyayush/refs/heads/main/wordpress-themes.png" alt="WordPress themes preview" loading="lazy" width="300" height="169" />
                </div>
                <span className="tag">WordPress Theme</span>
                <h3>WordPress Themes By Ayush</h3>
                <p>Clean, SEO-ready, and lightweight WordPress themes engineered specifically for digital publications, content creators, and educational institutions.</p>
                <a href="https://ayushacharya.info.np/projects/wordpress-themes/" target="_blank" rel="noopener noreferrer" className="btn-link">
                  View Themes <i className="fas fa-arrow-right" aria-hidden="true" />
                </a>
              </article>

              <article className="project-card reveal active" data-category="Utility">
                <div className="card-thumb">
                  <img src="https://raw.githubusercontent.com/itsayushacharya/instacode/refs/heads/main/Screenshot.png" alt="Insta CodE preview" loading="lazy" width="300" height="169" />
                </div>
                <span className="tag">IDE WEBSITE</span>
                <h3>Insta CodE - Web IDE</h3>
                <p>An inline browser IDE engineered for rapid front-end prototyping, allowing developers to construct UI snippets without local environment configurations.</p>
                <a href="https://instacode.ayushacharya.info.np/" target="_blank" rel="noopener noreferrer" className="btn-link">
                  Code Now <i className="fas fa-code" aria-hidden="true" />
                </a>
              </article>
            </div>
          </div>
        </section>

        <section id="blog" aria-labelledby="blog-heading">
          <div className="container">
            <div className="blog-header reveal active">
              <div className="section-title">
                <span>From The Blog</span>
                <h2 id="blog-heading">Web Development &amp; Digital Strategy Articles</h2>
                <p>Insights on front-end development, SEO best practices, artificial intelligence trends, and practical technical tutorials.</p>
              </div>
            </div>

            <div className="section-header-link">
              <a href="https://blog.ayushacharya.info.np/" className="header-link-btn" target="_blank" rel="noopener noreferrer">
                Explore All Posts <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" />
              </a>
            </div>

            <div className="blog-carousel-wrapper">
              <button
                className="blog-nav-btn"
                id="blogPrevBtn"
                onClick={prevBlogPage}
                disabled={blogCarouselPage === 0 || blogPosts.length <= CARDS_PER_PAGE}
                aria-label="Previous blog articles"
                title="Previous"
              >
                <i className="fas fa-chevron-left" aria-hidden="true" />
              </button>

              <div className="blog-grid-container">
                <div className="blog-grid">
                  {blogLoading && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)' }}>Loading posts...</p>}
                  {blogError && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)' }}>Unable to load posts right now.</p>}
                  {!blogLoading && !blogError && visibleBlogPosts.map((post, idx) => (
                    <article className="blog-card reveal active" key={idx}>
                      <div className="blog-thumb">
                        <img src={post.mediaThumbnail} alt={post.title} loading="lazy" width="300" height="187" />
                      </div>
                      <div className="blog-content">
                        <div className="blog-meta">
                          <span className="blog-category">{post.category}</span>
                          <span className="dot">•</span>
                          <span>{post.publishedDate}</span>
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.summary}</p>
                        <a href={post.link} target="_blank" rel="noopener noreferrer" className="blog-read">
                          Read Article <i className="fas fa-arrow-right" aria-hidden="true" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <button
                className="blog-nav-btn"
                id="blogNextBtn"
                onClick={nextBlogPage}
                disabled={blogCarouselPage >= totalPages - 1 || blogPosts.length <= CARDS_PER_PAGE}
                aria-label="Next blog articles"
                title="Next"
              >
                <i className="fas fa-chevron-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <section id="services" aria-labelledby="services-heading">
          <div className="container">
            <div className="section-title reveal active">
              <span>Services</span>
              <h2 id="services-heading">SEO &amp; Web Development Solutions</h2>
              <p>Full-spectrum technical solutions designed to establish your web footprint and dominate targeted keyword rankings.</p>
            </div>
            <div className="services-grid">
              <div className="service-card reveal active">
                <i className="fas fa-code" aria-hidden="true" />
                <h3>Custom Web Development</h3>
                <p>Building high-speed responsive websites and web software using clean code, optimized database structures, and dynamic rendering solutions.</p>
              </div>
              <div className="service-card reveal active">
                <i className="fas fa-bezier-curve" aria-hidden="true" />
                <h3>UI/UX &amp; Web Design</h3>
                <p>Designing modern, conversion-focused web layouts tailored to user engagement metrics and cohesive brand design visual standards.</p>
              </div>
              <div className="service-card reveal active">
                <i className="fas fa-chart-line" aria-hidden="true" />
                <h3>Search Engine Optimization (SEO)</h3>
                <p>Technical site audits, structural SEO architecture, keyword mapping, schema integrations, and strategic link building to secure top search rankings.</p>
              </div>
              <div className="service-card reveal active">
                <i className="fas fa-video" aria-hidden="true" />
                <h3>Digital Branding &amp; Content</h3>
                <p>Production of custom media content, digital strategy alignment, and dynamic visual graphics to establish brand consistency across online channels.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-heading">
          <div className="container">
            <div className="contact-box reveal active">
              <h2 id="contact-heading">Ready to boost your website ranking?</h2>
              <p>Have a project in mind or need expert web development and SEO consulting? Get in touch today and let's collaborate.</p>
              <div className="contact-buttons">
                <a href="mailto:contact@ayushacharya.info.np" className="primary-btn">
                  <i className="fas fa-envelope" aria-hidden="true" /> contact@ayushacharya.info.np
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-content">
          <p>© 2026 Ayush Acharya. All rights reserved.</p>
          <div className="socials">
            <a href="https://github.com/ayushacharya05" aria-label="Ayush Acharya GitHub Profile" rel="me noopener noreferrer" target="_blank">
              <i className="fab fa-github" aria-hidden="true" />
            </a>
            <a href="https://www.linkedin.com/in/ayush-acharya-31a838263/" aria-label="Ayush Acharya LinkedIn Profile" rel="me noopener noreferrer" target="_blank">
              <i className="fab fa-linkedin-in" aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/itsayushacharya/" aria-label="Ayush Acharya Instagram Profile" rel="me noopener noreferrer" target="_blank">
              <i className="fab fa-instagram" aria-hidden="true" />
            </a>
            <a href="https://www.facebook.com/itsayushacharya" aria-label="Ayush Acharya Facebook Profile" rel="me noopener noreferrer" target="_blank">
              <i className="fab fa-facebook-f" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>

      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        id="backToTop"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up" aria-hidden="true" />
      </button>
    </>
  );
}