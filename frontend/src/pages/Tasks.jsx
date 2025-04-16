import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { Button, Tabs, Tab } from 'react-bootstrap';
import AddTaskDialog from '../components/AddTaskDialog';

const Tasks = () => {
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  const tasks = [
    { id: '1', title: 'Follow up with Maria about proposal', dueDate: 'Today, 3:00 PM', priority: 'high', completed: false, assignee: 'JD', related: 'Maria Garcia' },
    { id: '2', title: 'Prepare presentation for client meeting', dueDate: 'Tomorrow, 10:00 AM', priority: 'high', completed: false },
    { id: '3', title: 'Send contract to Thomas', dueDate: 'Today, 5:00 PM', priority: 'medium', completed: false, related: 'Thomas Wright' },
    { id: '4', title: 'Schedule demo with potential client', dueDate: 'Feb 12, 2:30 PM', priority: 'medium', completed: false },
    { id: '5', title: 'Update lead status for inactive leads', dueDate: 'Feb 11', priority: 'low', completed: true },
    { id: '6', title: 'Review quarterly sales targets', dueDate: 'Feb 10', priority: 'medium', completed: true, assignee: 'SJ' },
  ];

  const openTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="container py-4">
      <Header title="Tasks" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5">My Tasks</h2>
        <Button variant="danger" onClick={() => setShowAddTaskDialog(true)}>
          Add Task
        </Button>
      </div>

      <Tabs defaultActiveKey="open" className="mb-3">
        <Tab eventKey="open" title={`Open (${openTasks.length})`}>
          {openTasks.map((task) => (
            <div key={task.id} className="border rounded p-3 mb-2 d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-1">{task.title}</h6>
                <small className="text-muted">Due: {task.dueDate}</small><br />
                {task.related && <small className="text-muted">Related to: {task.related}</small>}
              </div>
              <div>
                {task.assignee && <span className="badge bg-secondary me-2">{task.assignee}</span>}
                <Button size="sm" variant="outline-secondary">Edit</Button>
              </div>
            </div>
          ))}
        </Tab>
        <Tab eventKey="completed" title={`Completed (${completedTasks.length})`}>
          {completedTasks.map((task) => (
            <div key={task.id} className="border rounded p-3 mb-2 d-flex justify-content-between align-items-start bg-light">
              <div>
                <h6 className="mb-1 text-decoration-line-through">{task.title}</h6>
                <small className="text-muted">Due: {task.dueDate}</small><br />
                {task.related && <small className="text-muted">Related to: {task.related}</small>}
              </div>
              <div>
                {task.assignee && <span className="badge bg-secondary me-2">{task.assignee}</span>}
                <Button size="sm" variant="outline-secondary">Edit</Button>
              </div>
            </div>
          ))}
        </Tab>
      </Tabs>

      {/* Render the AddTaskDialog component as a modal */}
      {showAddTaskDialog && <AddTaskDialog onClose={() => setShowAddTaskDialog(false)} />}
    </div>
  );
};

export default Tasks;
