import React from 'react';
import { Table, Button, Space, Input, Popconfirm, message, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Task, TaskExecution } from '../types';
import dayjs from 'dayjs';


interface Props {
tasks: Task[];
onEdit: (t: Task) => void;
onDelete: (id: string) => Promise<void>;
onExecute: (id: string) => Promise<TaskExecution | null>;
}


export default function TaskList({ tasks, onEdit, onDelete, onExecute }: Props) {
const [loadingId, setLoadingId] = React.useState<string | null>(null);


const columns: ColumnsType<Task> = [
{ title: 'ID', dataIndex: 'id', key: 'id', width: 140 },
{ title: 'Name', dataIndex: 'name', key: 'name', render: (v) => <strong>{v}</strong> },
{ title: 'Owner', dataIndex: 'owner', key: 'owner' },
{ title: 'Command', dataIndex: 'command', key: 'command', ellipsis: true },
{
title: 'Last Run',
key: 'lastrun',
render: (_, record) => {
const last = record.taskExecutions?.slice(-1)[0];
return last ? <span>{dayjs(last.endTime).format('YYYY-MM-DD HH:mm:ss')}</span> : <Tag>Never</Tag>;
}
},
{
title: 'Actions', key: 'actions', width: 320, render: (_, record) => (
<Space>
<Button onClick={() => onEdit(record)} aria-label={`edit-${record.id}`}>Edit</Button>
<Popconfirm title={`Delete ${record.name}?`} onConfirm={() => onDelete(record.id)}>
<Button danger aria-label={`delete-${record.id}`}>Delete</Button>
</Popconfirm>
<Button type="primary" onClick={async () => {
try {
setLoadingId(record.id);
await onExecute(record.id);
} catch (e) {
message.error(String(e));
} finally {
setLoadingId(null);
}
}} loading={loadingId === record.id} aria-label={`run-${record.id}`}>Run</Button>
</Space>
)
}
];


return <Table rowKey="id" columns={columns} dataSource={tasks} pagination={{ pageSize: 8 }} />;
}