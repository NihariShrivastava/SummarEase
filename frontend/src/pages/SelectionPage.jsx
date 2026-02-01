import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Video, FileText, Table, ArrowLeft, Play } from 'lucide-react';

const SelectionPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <Container className="py-5 min-vh-100 d-flex flex-column justify-content-center">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-1"
            >
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-5 pb-4"
            >
                <h1 className="display-3 fw-bold mb-3">Choose Your <span className="text-danger">Tool</span></h1>
                <p className="lead text-muted fs-4">Select the AI power you need today.</p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Row className="g-5 justify-content-center align-items-stretch">
                    {[
                        {
                            to: "/video",
                            icon: Play,
                            title: "Video Summarizer",
                            desc: "Upload videos or paste YouTube links for instant transcripts.",
                            colorClass: "text-danger",
                            bgClass: "bg-danger"
                        },
                        {
                            to: "/text",
                            icon: FileText,
                            title: "Text Summarizer",
                            desc: "Condense articles and essays into clear, structured bullets.",
                            colorClass: "text-primary",
                            bgClass: "bg-primary"
                        },
                        {
                            to: "/data",
                            icon: Table,
                            title: "Data Organizer",
                            desc: "Convert messy unstructured text into clean Excel-ready tables.",
                            colorClass: "text-success",
                            bgClass: "bg-success"
                        }
                    ].map((item, idx) => (
                        <Col lg={4} md={6} key={idx}>
                            <motion.div variants={itemVariants} whileHover={{ y: -15 }} className="h-100">
                                <Link to={item.to} className="text-decoration-none h-100 d-block">
                                    <Card className="h-100 card-custom border-2 text-center p-4 shadow-lg transition-all " style={{ background: 'rgba(255,255,255,0.02)', borderColor:'rgba(60, 10, 10, 0.95)' }}>
                                        <div className={`icon-box mb-4 mx-auto ${item.bgClass} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`} style={{ width: 120, height: 120 }}>
                                            <item.icon size={56} className={item.colorClass} />
                                        </div>
                                        <h3 className="h3 fw-bold mb-3 text-body">{item.title}</h3>
                                        <p className="text-muted mb-0 fs-5">{item.desc}</p>
                                    </Card>
                                </Link>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </motion.div>
        </Container>
    );
};

export default SelectionPage;
