import React from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useUser } from "../user/UserContext";

const statusIcons = {
  "Idle": "🟡",
  "Ringing": "📞",
  "Speaking": "🗣️",
  "Break": "🍵",
  "Lunch": "🍽️",
  "Meeting": "👥",
  "Query": "❓",
  "Logged Out": "🔴",
  "Force Log Out": "🟣",
  "Press Release": "📰",
};

const Monitoring = () => {
  const { users } = useUser();

  const monitoredUsers = users.filter((user) =>
    ["user", "bdm", "teamleader"].includes(user.userGroup)
  );

  // Prepare grouped data by role
  const grouped = {
    user: [],
    bdm: [],
    teamleader: [],
  };

  monitoredUsers.forEach((user) => {
    grouped[user.userGroup].push({
      id: user.userid || user.id || "N/A",
      name: user.username || user.name || "N/A",
      time: "0:00:00",
      status: user.status || "Idle",
      group: user.userGroup,
    });
  });

  // Helper to render cards for a group
  const renderGroup = (groupKey, displayName) => {
    const agents = grouped[groupKey];
    if (agents.length === 0) return null;

    return (
      <div className="mb-5">
        <h3 className="mb-4">{displayName}</h3>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {agents.map((agent, idx) => (
            <Col key={idx}>
              <Card className="shadow border-0 text-center" style={{ borderRadius: "16px" }}>
                <Card.Body>
                  <div className="mb-3" style={{ fontSize: "2rem" }}>
                    {statusIcons[agent.status] || "❔"}
                  </div>
                  <Card.Title className="fw-semibold">{agent.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">ID: {agent.id}</Card.Subtitle>
                  {agent.group === "user" && (
                    <div className="fw-bold text-primary">{agent.time}</div>
                  )}
                  <div className="mt-2 text-muted">{agent.status}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <Container className="mt-4">
      <Card className="text-center mb-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "16px" }}>
        <Card.Body>
          <h1 className="display-4 fw-bold">Monitoring Status</h1>
          <p className="lead text-muted">
            Monitor the real-time status of your <strong>Telecallers, BDMs, and Team Leaders</strong>.
          </p>
        </Card.Body>
      </Card>

      <div className="mb-4">
        <h5 className="mb-3 fw-semibold">Status Legend</h5>
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
          {Object.entries(statusIcons).map(([label, icon], idx) => (
            <div key={idx} className="col d-flex align-items-center gap-2 bg-light p-2 rounded shadow-sm">
              <span style={{ fontSize: "1.5rem" }}>{icon}</span>
              <span className="fw-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Groups rendered in desired order */}
      {renderGroup("user", "Telecallers")}
      {renderGroup("bdm", "BDMs")}
      {renderGroup("teamleader", "Team Leaders")}
    </Container>
  );
};

export default Monitoring;
