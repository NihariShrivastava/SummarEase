import { useState } from 'react';
import { Container, Form, Button, Card, Spinner, Row, Col, Alert, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, FileText, Sparkles, Settings2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const TextSummarizer = () => {
    const [text, setText] = useState('');
    const [summaryType, setSummaryType] = useState('detailed');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSummarize = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setSummary('');
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/summarize-text', {
                text,
                type: summaryType
            });
            setSummary(response.data.summary);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.details || 'An error occurred during summarization.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (summary) navigator.clipboard.writeText(summary);
    };

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-5 mb-3">Text <span className="text-danger">Summarizer</span></h1>
                    <p className="lead text-muted">Paste your articles, essays, or notes below to get key insights instantly.</p>
                </div>

                <Row className="g-5">
                    <Col lg={6}>
                        <Card className="border-0 shadow-lg h-100 rounded-4 overflow-hidden">
                            <Card.Header className="bg-body-tertiary border-0 py-3 px-4 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <FileText className="me-2 text-danger" />
                                    <h5 className="mb-0 fw-bold">Input Content</h5>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-4 d-flex flex-column">
                                <Form onSubmit={handleSummarize} className="d-flex flex-column flex-grow-1">
                                    <Form.Group className="mb-4 flex-grow-1">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Paste your text here (min 50 chars)..."
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            className="bg-body border-secondary border-opacity-25 focus-ring focus-ring-danger p-3 rounded-3 h-100 resize-none shadow-inner"
                                            style={{ resize: 'none', minHeight: '300px' }}
                                        />
                                    </Form.Group>

                                    <div className="mb-4">
                                        <label className="fw-bold text-muted small text-uppercase mb-2 d-flex align-items-center">
                                            <Settings2 size={14} className="me-1" /> Summary Detail
                                        </label>
                                        <ButtonGroup className="w-100">
                                            {[
                                                { value: 'short', label: 'Concise Summary' },
                                                { value: 'detailed', label: 'Detailed Summary' }
                                            ].map((radio) => (
                                                <ToggleButton
                                                    key={radio.value}
                                                    id={`radio-${radio.value}`}
                                                    type="radio"
                                                    variant={summaryType === radio.value ? 'danger' : 'outline-secondary'}
                                                    name="radio"
                                                    value={radio.value}
                                                    checked={summaryType === radio.value}
                                                    onChange={(e) => setSummaryType(e.currentTarget.value)}
                                                    className="fw-semibold py-2"
                                                >
                                                    {radio.label}
                                                </ToggleButton>
                                            ))}
                                        </ButtonGroup>
                                    </div>

                                    <Button
                                        variant="danger"
                                        type="submit"
                                        disabled={loading || !text.trim()}
                                        className="w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center shadow-hover-btn"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Summarizing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="me-2" size={20} />
                                                Generate Summary
                                            </>
                                        )}
                                    </Button>
                                </Form>
                                {error && <Alert variant="danger" className="mt-3 rounded-3">{error}</Alert>}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={summary ? 'result' : 'empty'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="h-100"
                            >
                                <Card className="border-0 shadow-lg h-100 rounded-4 overflow-hidden bg-body-tertiary">
                                    <Card.Header className="bg-danger text-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 fw-bold">Summary Result</h5>
                                        {summary && (
                                            <Button variant="light" size="sm" onClick={handleCopy} className="rounded-circle p-2 d-flex align-items-center justify-content-center" title="Copy">
                                                <Copy size={16} className="text-danger" />
                                            </Button>
                                        )}
                                    </Card.Header>
                                    <Card.Body className="p-4 overflow-auto" style={{ maxHeight: '700px', minHeight: '400px' }}>
                                        {summary ? (
                                            <div className="prose">
                                                <ReactMarkdown>{summary}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="text-center text-muted h-100 d-flex flex-column align-items-center justify-content-center opacity-50 py-5">
                                                <div className="display-1 mb-3">📄</div>
                                                <p className="fs-5">Summary will appear here...</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </Col>
                </Row>
            </motion.div>
        </Container>
    );
};

export default TextSummarizer;
