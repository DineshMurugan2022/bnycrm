import React, { useState } from 'react';
import { Button, Tabs, Tab, Modal, Form } from 'react-bootstrap';

const Tasks = () => {
  // State to manage tasks list
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Follow up with Maria about proposal', dueDate: 'Today, 3:00 PM', priority: 'high', completed: false, assignee: 'JD', related: 'Maria Garcia' },
    { id: '2', title: 'Prepare presentation for client meeting', dueDate: 'Tomorrow, 10:00 AM', priority: 'high', completed: false },
    { id: '3', title: 'Send contract to Thomas', dueDate: 'Today, 5:00 PM', priority: 'medium', completed: false, related: 'Thomas Wright' },
    { id: '4', title: 'Schedule demo with potential client', dueDate: 'Feb 12, 2:30 PM', priority: 'medium', completed: false },
    { id: '5', title: 'Update lead status for inactive leads', dueDate: 'Feb 11', priority: 'low', completed: true },
    { id: '6', title: 'Review quarterly sales targets', dueDate: 'Feb 10', priority: 'medium', completed: true, assignee: 'SJ' },
  ]);

  // Modal show/hide state
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    priority: 'medium',
    assignee: '',
    related: '',
  });

  // Filter tasks by completion
  const openTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Handlers
  const handleOpenDialog = () => setShowAddTaskDialog(true);
  const handleCloseDialog = () => {
    setShowAddTaskDialog(false);
    setNewTask({ title: '', dueDate: '', priority: 'medium', assignee: '', related: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.dueDate.trim()) {
      alert('Please fill in Title and Due Date');
      return;
    }
    const newTaskEntry = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
    };
    setTasks(prev => [...prev, newTaskEntry]);
    handleCloseDialog();
  };

  return (
    <div className="container py-4">
      {/* Simple header */}
      <header className="mb-4">
        <h1>Tasks</h1>
      </header>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5">My Tasks</h2>
        <Button variant="danger" onClick={handleOpenDialog}>
          Add Task
        </Button>
      </div>

      <Tabs defaultActiveKey="open" className="mb-3">
        <Tab eventKey="open" title={`Open (${openTasks.length})`}>
          {openTasks.length === 0 ? (
            <p>No open tasks</p>
          ) : (
            openTasks.map(task => (
              <div
                key={task.id}
                className="border rounded p-3 mb-2 d-flex justify-content-between align-items-start"
              >
                <div>
                  <h6 className="mb-1">{task.title}</h6>
                  <small className="text-muted">Due: {task.dueDate}</small><br />
                  {task.related && <small className="text-muted">Related to: {task.related}</small>}
                </div>
                <div>
                  {task.assignee && <span className="badge bg-secondary me-2">{task.assignee}</span>}
                  <Button size="sm" variant="outline-secondary" disabled>Edit</Button>
                </div>
              </div>
            ))
          )}
        </Tab>
        <Tab eventKey="completed" title={`Completed (${completedTasks.length})`}>
          {completedTasks.length === 0 ? (
            <p>No completed tasks</p>
          ) : (
            completedTasks.map(task => (
              <div
                key={task.id}
                className="border rounded p-3 mb-2 d-flex justify-content-between align-items-start bg-light"
              >
                <div>
                  <h6 className="mb-1 text-decoration-line-through">{task.title}</h6>
                  <small className="text-muted">Due: {task.dueDate}</small><br />
                  {task.related && <small className="text-muted">Related to: {task.related}</small>}
                </div>
                <div>
                  {task.assignee && <span className="badge bg-secondary me-2">{task.assignee}</span>}
                  <Button size="sm" variant="outline-secondary" disabled>Edit</Button>
                </div>
              </div>
            ))
          )}
        </Tab>
      </Tabs>

      {/* Add Task Modal */}
      <Modal show={showAddTaskDialog} onHide={handleCloseDialog} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTaskTitle">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDueDate">
              <Form.Label>Due Date *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter due date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">E.g., Today, 3:00 PM or Feb 12, 2:30 PM</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Select name="priority" value={newTask.priority} onChange={handleChange}>
                <option value="high">High</option>
                <option value="medium">Medium (default)</option>
                <option value="low">Low</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAssignee">
              <Form.Label>Assignee</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter assignee initials or name"
                name="assignee"
                value={newTask.assignee}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRelated">
              <Form.Label>Related To</Form.Label>
              <Form.Control
                type="text"
                placeholder="Related person or client"
                name="related"
                value={newTask.related}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tasks;
