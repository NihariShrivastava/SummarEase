import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="landing-page overflow-hidden position-relative">
            {/* Hero Section */}
            <section className="min-vh-100 d-flex align-items-center position-relative py-5" style={{ zIndex: 1 }}>
                <Container>
                    <Row className="justify-content-center align-items-center text-center">
                        <Col lg={12} className="mb-5 position-relative">
                            {/* Avatar / Hero Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="mb-4"
                            >
                                <div className="avatar-glow mx-auto rounded-circle p-1">
                                    <img
                                        src="/hero-avatar.jpg"
                                        alt="AI Avatar"
                                        className="img-fluid rounded-circle shadow-lg hero-avatar"
                                        style={{ width: '180px', height: '180px', objectFit: 'cover' }}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                <h1 className="hero-title fw-black text-uppercase mb-2 tracking-tighter title-glitch">
                                    Summar<span className="text-danger">Ease</span>
                                </h1>
                                <p className="lead text-muted mb-5 fs-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
                                    Your all-in-one AI powerhouse.
                                    <br className="d-none d-md-block" />
                                    Summarize <span className="text-danger fw-bold">Everything</span> instantly.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="mt-4"
                            >
                                <Link to="/get-started">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="btn-super px-5 py-3 rounded-pill fw-bold"
                                    >
                                        Get Started <ArrowRight className="ms-2" size={20} />
                                    </Button>
                                </Link>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>

                {/* Decorative Background Elements */}
                <div className="bg-grid-lines position-absolute top-0 start-0 w-100 h-100 pe-none opacity-10"></div>
                <div className="hero-glow position-absolute top-50 start-50 translate-middle pe-none"></div>
            </section>

            {/* Features Grid Section */}
            <section className="py-5 bg-body-tertiary position-relative">
                <Container className="py-5">
                    <Row className="mb-5 text-center">
                        <Col>
                            <motion.h2
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="display-5 fw-bold text-uppercase"
                            >
                                Why <span className="text-danger position-relative d-inline-block">
                                    SummarEase?
                                    <motion.span
                                        className="position-absolute bottom-0 start-0 w-100 bg-danger"
                                        style={{ height: '4px' }}
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                    />
                                </span>
                            </motion.h2>
                            <p className="lead text-muted">Built for speed, privacy, and precision.</p>
                        </Col>
                    </Row>
                    <Row className="g-4">
                        {[
                            { title: "Local Privacy", desc: "Your data never leaves your device. All processing happens locally or via secure inference.", icon: "🔒" },
                            { title: "Multi-Modal", desc: "Video, Audio, Text, PDF, Youtube - we handle it all with a single unified interface.", icon: "⚡" },
                            { title: "Export Ready", desc: "Download summaries as Markdown, JSON, or Copy to Clipboard instantly.", icon: "📂" }
                        ].map((feature, idx) => (
                            <Col md={4} key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, y: 50, rotateX: -10 }}
                                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.4, delay: idx * 0.01 }}
                                    whileHover={{
                                        y: -15,
                                        scale: 1.05,
                                        backgroundColor: "rgba(120, 27, 36, 0.8)",
                                        boxShadow: "0 20px 40px rgba(220, 53, 69, 0.15)",
                                        borderColor: "rgba(220, 53, 69, 0.5)"
                                    }}
                                    className="p-4 h-100 rounded-4 border border-secondary border-opacity-25 bg-glass transition-all"
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    <div className="display-4 mb-3 text-danger">{feature.icon}</div>
                                    <h3 className="h4 fw-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted mb-0">{feature.desc}</p>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* How It Works Section */}
            <section className="py-5 position-relative overflow-hidden">
                <Container className="py-5">
                    <Row className="mb-5 text-center">
                        <Col>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="display-5 fw-bold text-uppercase"
                            >
                                How It <span className="text-danger">Works</span>
                            </motion.h2>
                        </Col>
                    </Row>

                    {/* Connecting Line (Desktop) */}
                    <div className="d-none d-md-block position-absolute start-0 w-100" style={{ top: '1rem', zIndex: 0 }}>
                        <div
                            className="position-absolute start-0 w-100"
                            style={{ height: '2px', background: 'rgba(220, 53, 69, 0.1)' }}
                        />
                        <motion.div
                            className="h-100 bg-danger"
                            style={{ height: '2px' }}
                            initial={{ width: '0%' }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </div>

                    <Row className="justify-content-center text-center g-5 position-relative" style={{ zIndex: 1 }}>
                        {[
                            { step: 1, title: "Upload", desc: "Drag & drop your video, audio, or paste content." },
                            { step: 2, title: "Process", desc: "AI models transcribe, analyze, and extract insights." },
                            { step: 3, title: "Result", desc: "Get structured summaries and data instantly." }
                        ].map((item, idx) => (
                            <Col md={4} key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                                    whileHover={{ y: -10 }}
                                    className="pt-5"
                                >
                                    <div className="position-relative bg-body-tertiary rounded-4 p-5 h-100 border border-secondary border-opacity-10 shadow-lg hover-glow-card transition-all" style={{ backdropFilter: "blur(10px)" }}>
                                        {/* Floating Number */}
                                        <motion.div
                                            className="position-absolute start-50 translate-middle"
                                            style={{ top: '0', width: '70px', height: '70px', zIndex: 2 }}
                                            whileHover={{ scale: 1.1, rotate: 15 }}
                                        >
                                            <div className="w-100 h-100 rounded-circle bg-black border border-4 border-danger d-flex align-items-center justify-content-center text-white fw-bold fs-3 shadow-box">
                                                {item.step}
                                            </div>
                                        </motion.div>

                                        <div className="mt-4">
                                            <h3 className="h4 fw-bold mb-3">{item.title}</h3>
                                            <p className="text-muted mb-0">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* About Section */}
            <section className="py-5 bg-body-tertiary position-relative overflow-hidden">
                <Container className="py-5">
                    <Row className="align-items-center justify-content-center text-center">
                        <Col lg={8}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="position-relative z-1"
                            >
                                <h2 className="display-4 fw-bold mb-4">One Platform.<br /><span className="text-primary">Endless Possibilities.</span></h2>
                                <p className="lead text-muted mb-5">
                                    Stop wasting hours watching long meetings or reading dense instruction manuals.
                                    SummarEase uses advanced AI to distill content into what matters most.
                                </p>
                                <div className="d-flex justify-content-center gap-4 flex-wrap">
                                    {["Free & Unlimited", "Local Privacy", "No Account Needed"].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.5, x: -20 }}
                                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.2,  stiffness: 200 }}
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(9, 51, 114, 0.1)" }}
                                            className="d-flex align-items-center fs-5 px-3 py-2 rounded-pill transition-all border border-transparent hover-border-primary"
                                        >
                                            <span className="badge bg-primary rounded-pill me-2">✓</span> {item}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
                {/* Background Decoration */}
                <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(13,110,253,0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
            </section>
        </div>
    );
};

// Simple internal component reference fix
import { Bot } from 'lucide-react';

export default LandingPage;
