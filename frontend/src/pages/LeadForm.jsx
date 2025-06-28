import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Image,
} from "react-bootstrap";
import api from '../api/axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const LeadForm = ({ onFormSubmit, onLeadSaved, lead }) => {
  const [formData, setFormData] = useState({
    // Customer Details
    companyName: lead?.companyName || "",
    address: lead?.address || "",
    contactPerson: lead?.contactPerson || "",
    pinCode: lead?.pinCode || "",
    mailAddress: lead?.mailAddress || "",
    contactNo: lead?.contactNo || "",
    gstNo: lead?.gstNo || "",
    profileImage: lead?.profileImage || null,
    date: lead?.date || new Date().toISOString().slice(0, 10),

    // Project Details
    websiteSubscription: lead?.websiteSubscription || "",
    noOfPages: lead?.noOfPages || "",
    domainName: lead?.domainName || "",
    seo: lead?.seo || "",
    noOfKeywords: lead?.noOfKeywords || "",
    additionalPlans: lead?.additionalPlans || {
      aso: false,
      smo: false,
      smm: false,
      youtube: false,
      ads: false,
      mobileApp: false,
      dynamicWebsite: false,
      emailMarketing: false,
      ecommerce: false,
    },

    // Payment Details
    actualAmount: lead?.actualAmount || "",
    gst: lead?.gst || "",
    amountReceived: lead?.amountReceived || "",
    paymentThrough: lead?.paymentThrough || "By Cheque",
    balanceAmount: lead?.balanceAmount || "",
    amountInRupees: lead?.amountInRupees || "",
    bankName: lead?.bankName || "",
    chequeDate: lead?.chequeDate || "",
    chequeNo: lead?.chequeNo || "",

    // Signatures
    customerSignature: lead?.customerSignature || null,
    executiveSignature: lead?.executiveSignature || null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const formRef = React.useRef();

  React.useEffect(() => {
    if (lead) {
      setFormData({
        companyName: lead.companyName || "",
        address: lead.address || "",
        contactPerson: lead.contactPerson || "",
        pinCode: lead.pinCode || "",
        mailAddress: lead.mailAddress || "",
        contactNo: lead.contactNo || "",
        gstNo: lead.gstNo || "",
        profileImage: lead.profileImage || null,
        date: lead.date || new Date().toISOString().slice(0, 10),
        websiteSubscription: lead.websiteSubscription || "",
        noOfPages: lead.noOfPages || "",
        domainName: lead.domainName || "",
        seo: lead.seo || "",
        noOfKeywords: lead.noOfKeywords || "",
        additionalPlans: lead.additionalPlans || {
          aso: false,
          smo: false,
          smm: false,
          youtube: false,
          ads: false,
          mobileApp: false,
          dynamicWebsite: false,
          emailMarketing: false,
          ecommerce: false,
        },
        actualAmount: lead.actualAmount || "",
        gst: lead.gst || "",
        amountReceived: lead.amountReceived || "",
        paymentThrough: lead.paymentThrough || "By Cheque",
        balanceAmount: lead.balanceAmount || "",
        amountInRupees: lead.amountInRupees || "",
        bankName: lead.bankName || "",
        chequeDate: lead.chequeDate || "",
        chequeNo: lead.chequeNo || "",
        customerSignature: lead.customerSignature || null,
        executiveSignature: lead.executiveSignature || null,
      });
    }
  }, [lead]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      additionalPlans: { ...formData.additionalPlans, [name]: checked },
    });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Helper to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const base64 = await fileToBase64(files[0]);
      setFormData({
        ...formData,
        [name]: base64,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (lead && lead._id) {
        await api.put(`/leads/${lead._id}`, formData);
      } else {
        await api.post('/leads', formData);
      }
      setShowDownload(true);
      if (onLeadSaved) onLeadSaved();
      if (onFormSubmit) onFormSubmit();
    } catch (err) {
      alert('Failed to save lead: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    const input = formRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('lead-form.pdf');
  };

  return (
    <div>
      <div ref={formRef}>
        <Container className="my-5">
          <Card className="p-4">
            <Card.Body>
              {/* Header */}
              <Row className="mb-4 align-items-center">
                <Col md={2}>
                  <Image src="https://bnytechnologies.in/img/logo.png" alt="B&Y Technologies" fluid />
                </Col>
                <Col md={10} className="text-center">
                  <h4 className="mb-0">B&Y TECHNOLOGIES</h4>
                  <p className="mb-0">
                    Fourth Floor, No 624, Khivraj Building, Third Floor, Anna
                    Salai, Thousand Lights West, Chennai, Tamil Nadu 600006
                  </p>
                  <p className="mb-0">
                    www.bnytechnologies.com | info@bnytechnologies
                  </p>
                  <p>customer support - 9941070555</p>
                </Col>
              </Row>

              <Form onSubmit={handleSubmit}>
                {/* Customer Details */}
                <Card className="mb-4">
                  <Card.Header as="h5">CUSTOMER DETAILS</Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={3}>
                            Company Name
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              type="text"
                              name="companyName"
                              onChange={handleInputChange}
                            />
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={3}>
                            Address
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="address"
                              onChange={handleInputChange}
                            />
                          </Col>
                        </Form.Group>
                        <Row>
                          <Col md={6}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm={6}>
                                Contact Person
                              </Form.Label>
                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  name="contactPerson"
                                  onChange={handleInputChange}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm={4}>
                                Pin Code
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="pinCode"
                                  onChange={handleInputChange}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={3}>
                            Mail Address
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              type="email"
                              name="mailAddress"
                              onChange={handleInputChange}
                            />
                          </Col>
                        </Form.Group>
                        <Row>
                          <Col md={6}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm={6}>
                                Contact No
                              </Form.Label>
                              <Col sm={6}>
                                <Form.Control
                                  type="tel"
                                  name="contactNo"
                                  onChange={handleInputChange}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm={4}>
                                GST NO
                              </Form.Label>
                              <Col sm={8}>
                                <Form.Control
                                  type="text"
                                  name="gstNo"
                                  onChange={handleInputChange}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col
                        md={4}
                        className="d-flex flex-column align-items-center"
                      >
                        <div
                          className="border d-flex justify-content-center align-items-center mb-2"
                          style={{
                            width: "150px",
                            height: "150px",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          {formData.profileImage ? (
                            <Image
                              src={formData.profileImage}
                              alt="Profile"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span>Profile</span>
                          )}
                        </div>
                        <Form.Control
                          type="file"
                          name="profileImage"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="mb-2"
                        />
                        <Form.Control
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Project Details */}
                <Card className="mb-4">
                  <Card.Header as="h5">PROJECT DETAILS</Card.Header>
                  <Card.Body>
                    <Row className="align-items-center mb-3">
                      <Col md={1}>
                        <b>SNO</b>
                      </Col>
                      <Col md={11}>
                        <b>SUBSCRIPTION</b>
                      </Col>
                    </Row>
                    {/* Website */}
                    <Row className="align-items-center mb-3 p-2 border rounded">
                      <Col md={1}>1</Col>
                      <Col md={2}>
                        <b>WEBSITE</b>
                      </Col>
                      <Col md={5}>
                        <Form.Check
                          inline
                          label="Bronze"
                          name="websiteSubscription"
                          type="radio"
                          value="bronze"
                          onChange={handleRadioChange}
                        />
                        <Form.Check
                          inline
                          label="Silver"
                          name="websiteSubscription"
                          type="radio"
                          value="silver"
                          onChange={handleRadioChange}
                        />
                        <Form.Check
                          inline
                          label="Gold"
                          name="websiteSubscription"
                          type="radio"
                          value="gold"
                          onChange={handleRadioChange}
                        />
                        <Form.Check
                          inline
                          label="Platinum"
                          name="websiteSubscription"
                          type="radio"
                          value="platinum"
                          onChange={handleRadioChange}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          type="text"
                          placeholder="No Pages"
                          name="noOfPages"
                          onChange={handleInputChange}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Control
                          type="text"
                          placeholder="Domain Name"
                          name="domainName"
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                    {/* SEO */}
                    <Row className="align-items-center mb-3 p-2 border rounded">
                      <Col md={1}>2</Col>
                      <Col md={2}>
                        <b>Number of Keywords</b>
                      </Col>
                      <Col md={5}>
                        <Form.Check
                          inline
                          label="Limited"
                          name="seo"
                          type="radio"
                          value="limited"
                          onChange={handleRadioChange}
                        />
                        <Form.Check
                          inline
                          label="Unlimited"
                          name="seo"
                          type="radio"
                          value="unlimited"
                          onChange={handleRadioChange}
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="No Of Keywords"
                          name="noOfKeywords"
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                    {/* Additional Plans */}
                    <Row className="align-items-center p-2 border rounded">
                      <Col md={1}>3</Col>
                      <Col md={2}>
                        <b>ADDITIONAL PLANS</b>
                      </Col>
                      <Col md={9}>
                        <Row>
                          <Col md={4}>
                            <Form.Check
                              label="SEO"
                              name="aso"
                              onChange={handleCheckboxChange}
                            />
                            <Form.Check
                              label="SMO"
                              name="smo"
                              onChange={handleCheckboxChange}
                            />
                            <Form.Check
                              label="SMM"
                              name="smm"
                              onChange={handleCheckboxChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Form.Check
                              label="YouTube Promotion"
                              name="youtube"
                              onChange={handleCheckboxChange}
                            />
                            <Form.Check
                              label="E-Mail Marketing"
                              name="emailMarketing"
                              onChange={handleCheckboxChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Form.Check
                              label="Fb, Twitter, Instagram Ad's"
                              name="ads"
                              onChange={handleCheckboxChange}
                            />
                            <Form.Check
                              label="Mobile Application"
                              name="mobileApp"
                              onChange={handleCheckboxChange}
                            />
                            <Form.Check
                              label="E-Commerce Website"
                              name="ecommerce"
                              onChange={handleCheckboxChange}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <br />
                    <Row className="align-items-center mb-3 p-2 border rounded">
                      <Col md={1}>4</Col>
                      <Col md={2}>
                        <b>Number of Posts</b>
                      </Col>
                      <Col md={5}>
                        <Form.Check
                          inline
                          label="Limited"
                          name="post"
                          type="radio"
                          value="limited"
                          onChange={handleRadioChange}
                        />
                        <Form.Check
                          inline
                          label="Unlimited"
                          name="post"
                          type="radio"
                          value="unlimited"
                          onChange={handleRadioChange}
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="No Of Posts"
                          name="noOfPosts"
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Payment Details */}
                <Card className="mb-4">
                  <Card.Header as="h5">PAYMENT DETAILS</Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={4}>
                            Actual amount
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="number"
                              name="actualAmount"
                              onChange={handleInputChange}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={4}>
                            Amount in Rupees
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="text"
                              name="amountInRupees"
                              onChange={handleInputChange}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={4}>
                            GST
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="number"
                              name="gst"
                              onChange={handleInputChange}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={4}>
                            Bank Name
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="text"
                              name="bankName"
                              onChange={handleInputChange}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={4}>
                            Amount received
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="number"
                              name="amountReceived"
                              onChange={handleInputChange}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Row>
                          <Col md={6}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm={6}>
                                Cheque Date
                              </Form.Label>
                              <Col sm={6}>
                                <Form.Control
                                  type="date"
                                  name="chequeDate"
                                  onChange={handleInputChange}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group as={Row} className="mb-3">
                              <Form.Label column sm={6}>
                                Cheque No
                              </Form.Label>
                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  name="chequeNo"
                                  onChange={handleInputChange}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={4}>
                            Payment Through
                          </Form.Label>
                          <Col sm={8} className="d-flex align-items-center">
                            <Form.Check
                              inline
                              label="By Cheque"
                              name="paymentThrough"
                              type="radio"
                              value="By Cheque"
                              checked={formData.paymentThrough === "By Cheque"}
                              onChange={handleRadioChange}
                            />
                            <Form.Check
                              inline
                              label="By Gpay"
                              name="paymentThrough"
                              type="radio"
                              value="By Gpay"
                              checked={formData.paymentThrough === "By Gpay"}
                              onChange={handleRadioChange}
                            />
                            <Form.Check
                              inline
                              label="By Upi"
                              name="paymentThrough"
                              type="radio"
                              value="By Upi"
                              checked={formData.paymentThrough === "By Upi"}
                              onChange={handleRadioChange}
                            />
                            <Form.Check
                              inline
                              label="Paypal"
                              name="paymentThrough"
                              type="radio"
                              value="Paypal"
                              checked={formData.paymentThrough === "Paypal"}
                              onChange={handleRadioChange}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group as={Row} className="mb-3">
                          <Form.Label column sm={4}>
                            Balance amount
                          </Form.Label>
                          <Col sm={8}>
                            <Form.Control
                              type="number"
                              name="balanceAmount"
                              onChange={handleInputChange}
                            />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Signature Section */}
                <Row className="mt-5">
                  <Col md={6} className="text-center">
                    <div
                      className="border mx-auto mb-2"
                      style={{ width: "250px", height: "100px" }}
                    >
                      {formData.customerSignature && (
                        <Image
                          src={formData.customerSignature}
                          alt="Customer Signature"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </div>
                    <Form.Control
                      type="file"
                      name="customerSignature"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="mb-2"
                    />
                    <h5>Customer's Signature</h5>
                  </Col>
                  <Col md={6} className="text-center">
                    <div
                      className="border mx-auto mb-2"
                      style={{ width: "250px", height: "100px" }}
                    >
                      {formData.executiveSignature && (
                        <Image
                          src={formData.executiveSignature}
                          alt="Executive Signature"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </div>
                    <Form.Control
                      type="file"
                      name="executiveSignature"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="mb-2"
                    />
                    <h5>Signature Executive</h5>
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <Button variant="primary" type="submit" size="lg" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
      {showDownload && (
        <div className="text-center mt-3">
          <Button variant="success" onClick={handleDownloadPDF}>Download PDF</Button>
        </div>
      )}
    </div>
  );
};

export default LeadForm;

export const LeadFormView = ({ formData }) => (
  <div style={{ background: '#fff', color: '#000', padding: 24, width: '100%' }}>
    <div className="my-5">
      <div className="p-4">
        {/* Header */}
        <div className="mb-4 d-flex align-items-center">
          <div style={{ width: 120 }}>
            <img src="https://bnytechnologies.in/img/logo.png" alt="B&Y Technologies" style={{ width: '100%' }} />
          </div>
          <div className="flex-grow-1 text-center">
            <h4 className="mb-0">B&Y TECHNOLOGIES</h4>
            <p className="mb-0">
              Fourth Floor, No 624, Khivraj Building, Third Floor, Anna
              Salai, Thousand Lights West, Chennai, Tamil Nadu 600006
            </p>
            <p className="mb-0">
              www.bnytechnologies.com | info@bnytechnologies
            </p>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <h5>CUSTOMER DETAILS</h5>
            <div className="row">
              <div className="col-md-8">
                <p><b>Company Name:</b> {formData.companyName}</p>
                <p><b>Address:</b> {formData.address}</p>
                <p><b>Contact Person:</b> {formData.contactPerson}</p>
                <p><b>Pin Code:</b> {formData.pinCode}</p>
                <p><b>Mail Address:</b> {formData.mailAddress}</p>
                <p><b>Contact No:</b> {formData.contactNo}</p>
                <p><b>GST No:</b> {formData.gstNo}</p>
                <p><b>Date:</b> {formData.date}</p>
              </div>
              <div className="col-md-4 text-center">
                {formData.profileImage && <img src={formData.profileImage} alt="Profile" style={{ width: 120, height: 120, objectFit: 'cover', border: '1px solid #ccc' }} />}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h5>PROJECT DETAILS</h5>
            <p><b>Website Subscription:</b> {formData.websiteSubscription}</p>
            <p><b>No. of Pages:</b> {formData.noOfPages}</p>
            <p><b>Domain Name:</b> {formData.domainName}</p>
            <p><b>SEO:</b> {formData.seo}</p>
            <p><b>No. of Keywords:</b> {formData.noOfKeywords}</p>
            <p><b>Additional Plans:</b> {formData.additionalPlans && Object.entries(formData.additionalPlans).filter(([k,v])=>v).map(([k])=>k).join(', ')}</p>
          </div>
          <div className="mb-4">
            <h5>PAYMENT DETAILS</h5>
            <p><b>Actual Amount:</b> {formData.actualAmount}</p>
            <p><b>GST:</b> {formData.gst}</p>
            <p><b>Amount Received:</b> {formData.amountReceived}</p>
            <p><b>Payment Through:</b> {formData.paymentThrough}</p>
            <p><b>Balance Amount:</b> {formData.balanceAmount}</p>
            <p><b>Amount in Rupees:</b> {formData.amountInRupees}</p>
            <p><b>Bank Name:</b> {formData.bankName}</p>
            <p><b>Cheque Date:</b> {formData.chequeDate}</p>
            <p><b>Cheque No:</b> {formData.chequeNo}</p>
          </div>
          <div className="mb-4">
            <h5>SIGNATURES</h5>
            {formData.customerSignature && <div><b>Customer Signature:</b><br /><img src={formData.customerSignature} alt="Customer Signature" style={{ width: 200, height: 80, objectFit: 'contain', border: '1px solid #ccc' }} /></div>}
            {formData.executiveSignature && <div><b>Executive Signature:</b><br /><img src={formData.executiveSignature} alt="Executive Signature" style={{ width: 200, height: 80, objectFit: 'contain', border: '1px solid #ccc' }} /></div>}
          </div>
        </div>
      </div>
    </div>
  </div>
);
