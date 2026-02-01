import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Upload, FileVideo, FileText, CheckCircle, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config';

const VideoSummarizer = () => {
    // ... (keep existing state)
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
        setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a video file.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('video', file);

        try {
            const response = await axios.post(`${API_URL}/upload-video`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.details || err.message || "Failed to process video. Please try again.";
            setError(errorMessage + (err.response?.status ? ` (Status: ${err.response.status})` : ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-5 mb-3">Video <span className="text-danger">Summarizer</span></h1>
                    <p className="lead text-muted">Upload a video to generate a transcript and AI summary instantly.</p>
                </div>

                <Row className="justify-content-center mb-5">
                    <Col md={8} lg={6}>
                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                            <Card.Body className="p-4">
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4 text-center">
                                        <div className="border border-2 border-dashed border-secondary border-opacity-25 rounded-4 p-5 mb-3 position-relative hover-bg-light transition-all">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleFileChange}
                                                className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <div className="mb-3">
                                                <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-flex">
                                                    <Upload size={32} className="text-danger" />
                                                </div>
                                            </div>
                                            <h5 className="fw-bold">{file ? file.name : "Click or Drag Video Here"}</h5>
                                            <p className="text-muted small mb-0">Supported: MP4, MOV, AVI</p>
                                        </div>
                                    </Form.Group>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-100 py-3 rounded-pill fw-bold shadow-hover-btn btn-danger"
                                        disabled={loading || !file}
                                    >
                                        {loading ? <><Spinner animation="border" size="sm" className="me-2" /> Processing...</> : 'Generate Summary'}
                                    </Button>
                                </Form>
                                {error && <Alert variant="danger" className="mt-3 rounded-3">{error}</Alert>}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>


                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Row className="g-4">
                                <Col md={6}>
                                    <Card className="border-0 shadow-lg h-100 rounded-4 overflow-hidden">
                                        <Card.Header className="bg-body-tertiary border-0 py-3 px-4 d-flex align-items-center">
                                            <FileText className="text-danger me-2" />
                                            <h5 className="mb-0 fw-bold">Transcript</h5>
                                        </Card.Header>
                                        <Card.Body className="p-4">
                                            <div className="bg-body border rounded-3 p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                <p className="mb-0 text-muted" style={{ whiteSpace: 'pre-wrap' }}>{result.transcript}</p>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-0 shadow-lg h-100 rounded-4 overflow-hidden">
                                        <Card.Header className="bg-danger text-white border-0 py-3 px-4 d-flex align-items-center">
                                            <CheckCircle className="me-2" />
                                            <h5 className="mb-0 fw-bold">AI Summary</h5>
                                        </Card.Header>
                                        <Card.Body className="p-4">
                                            <div className="p-2">
                                                <p className="lead fs-6">{result.summary}</p>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Container >
    );
};

export default VideoSummarizer;

