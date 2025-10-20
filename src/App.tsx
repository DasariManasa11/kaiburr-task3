import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Input, Row, Col, Space, message } from 'antd';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ExecutionModal from './components/ExecutionModal';
import { Task, TaskExecution } from './types';
import { api } from './api';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [execModalOpen, setExecModalOpen] = useState(false);
  const [lastExec, setLastExec] = useState<TaskExecution | null>(null);

  // Load all tasks on mount
  const load = async () => {
    try {
      const data = await api.list();
      setTasks(data || []);
    } catch (e) {
      message.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSave = async (task: Task) => {
    try {
      await api.save(task);
      message.success('Task saved');
      setFormVisible(false);
      await load();
    } catch (e) {
      message.error('Failed to save task');
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api.delete(id);
      message.success('Deleted');
      await load();
    } catch (e) {
      message.error('Failed to delete task');
    }
  };

  const onExecute = async (id: string) => {
    try {
      const exec = await api.execute(id);
      const execObj: TaskExecution | null = exec ?? null;
      if (execObj) {
        setLastExec(execObj);
        setExecModalOpen(true);
      } else {
        message.info('Execution completed (no output returned).');
      }
      await load();
      return execObj;
    } catch (e) {
      message.error('Execution failed');
    }
  };

  const onSearch = async () => {
    if (!search.trim()) return load();
    try {
      const list = await api.searchByName(search);
      setTasks(list || []);
    } catch (e) {
      message.error('Search failed');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Task Runner UI
            </Title>
          </Col>
          <Col>
            <Space>
              <Input.Search
                placeholder="Search by name"
                enterButton
                value={search}
                onSearch={onSearch}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="search-tasks"
              />
              <Button
                type="primary"
                onClick={() => {
                  setEditing(null);
                  setFormVisible(true);
                }}
                aria-label="create-task"
              >
                Create Task
              </Button>
            </Space>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: 24 }}>
        <TaskList
          tasks={tasks}
          onEdit={(t) => {
            setEditing(t);
            setFormVisible(true);
          }}
          onDelete={onDelete}
          onExecute={onExecute}
        />

        <TaskForm
          visible={formVisible}
          onCancel={() => setFormVisible(false)}
          onSave={onSave}
          initial={editing}
        />

        <ExecutionModal
          visible={execModalOpen}
          onClose={() => setExecModalOpen(false)}
          execution={lastExec}
        />
      </Content>
    </Layout>
  );
}
