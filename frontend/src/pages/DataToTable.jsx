import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Database, Table as TableIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config';

const DataToTable = () => {
    const [dataInput, setDataInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!dataInput.trim()) return;

        setLoading(true);
        setError(null);
        setTableData(null);

        try {
            const response = await axios.post(`${API_URL}/generate-table`, {
                data: dataInput
            });
            if (Array.isArray(response.data.table)) {
                setTableData(response.data.table);
            } else {
                setError("Invalid data format received.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.details || "Failed to generate table.");
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
                    <h1 className="fw-bold display-5 mb-3">Data to <span className="text-danger">Table</span></h1>
                    <p className="lead text-muted">Convert unstructured text data into a structured table automatically.</p>
                </div>

                <Row className="justify-content-center mb-5">
                    <Col lg={10}>
                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                            <Card.Body className="p-4 d-flex flex-column flex-lg-row gap-4">
                                <div className="flex-grow-1">
                                    <Form onSubmit={handleSubmit} className="d-flex flex-column h-100">
                                        <Form.Group className="mb-4 flex-grow-1 d-flex flex-column">
                                            <Form.Label className="fw-bold d-flex align-items-center">
                                                <Database size={18} className="text-danger me-2" />
                                                Unstructured Data
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={8}
                                                placeholder="Paste your raw data here (e.g. lists, messy text)..."
                                                value={dataInput}
                                                onChange={(e) => setDataInput(e.target.value)}
                                                className="bg-light border-0 p-3 flex-grow-1"
                                                style={{ minHeight: '250px', resize: 'none' }}
                                            />
                                        </Form.Group>
                                        <div className="d-grid pt-2">
                                            <Button
                                                type="submit"
                                                className="py-3 rounded-pill fw-bold shadow-hover-btn btn-danger"
                                                disabled={loading || !dataInput.trim()}
                                            >
                                                {loading ? <><Spinner animation="border" size="sm" className="me-2" /> Converting...</> : 'Generate Table'}
                                            </Button>
                                        </div>
                                    </Form>
                                    {error && <Alert variant="danger" className="mt-3 rounded-3">{error}</Alert>}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <AnimatePresence>
                    {tableData && tableData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Row className="justify-content-center">
                                <Col lg={10}>
                                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                                        <Card.Header className="bg-danger text-white border-0 py-3 px-4">
                                            <h5 className="mb-0 fw-bold d-flex align-items-center">
                                                <TableIcon className="me-2" />
                                                Structured Data ({tableData.length} rows)
                                            </h5>
                                        </Card.Header>
                                        <Card.Body className="p-0">
                                            <div className="table-responsive">
                                                <Table hover striped bordered className="mb-0 align-middle table-grid">
                                                    <thead className="bg-body-tertiary">
                                                        <tr>
                                                            {Object.keys(tableData[0]).map((key) => (
                                                                <th key={key} className="text-uppercase small text-muted py-3 px-4 bg-body-tertiary fw-bold">{key}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tableData.map((row, idx) => (
                                                            <tr key={idx}>
                                                                {Object.values(row).map((val, i) => (
                                                                    <td key={i} className="py-3 px-4">{val}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Container>
    );
};

export default DataToTable;

