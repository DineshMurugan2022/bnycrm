import React from 'react';
import Card from 'react-bootstrap/Card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import classNames from 'classnames';

const StatCard = ({ title, value, icon, change, className }) => {
  return (
    <Card className={classNames('overflow-hidden', className)}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <small className="text-muted">{title}</small>
            <h4 className="mt-1 fw-bold">{value}</h4>

            {change && (
              <div className="mt-1 d-flex align-items-center small">
                {change.trend === 'up' ? (
                  <ArrowUp size={14} className="me-1 text-success" />
                ) : change.trend === 'down' ? (
                  <ArrowDown size={14} className="me-1 text-danger" />
                ) : null}

                <span
                  className={classNames({
                    'text-success': change.trend === 'up',
                    'text-danger': change.trend === 'down',
                    'text-muted': change.trend === 'neutral',
                    'fw-medium': true,
                  })}
                >
                  {Math.abs(change.value)}% from last month
                </span>
              </div>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary" style={{ width: 48, height: 48 }}>
            {icon}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
import { DollarSign } from 'lucide-react';



