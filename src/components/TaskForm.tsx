import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { Task } from '../types';


interface Props {
visible: boolean;
onCancel: () => void;
onSave: (task: Task) => Promise<void>;
initial?: Task | null;
}


export default function TaskForm({ visible, onCancel, onSave, initial }: Props) {
const [form] = Form.useForm();


React.useEffect(() => {
form.resetFields();
if (initial) form.setFieldsValue(initial);
}, [initial, form, visible]);


return (
<Modal
title={initial ? 'Edit Task' : 'Create Task'}
open={visible}
onCancel={onCancel}
footer={null}
destroyOnClose
aria-labelledby="task-form-title"
>
<Form
form={form}
layout="vertical"
onFinish={async (values) => {
await onSave(values as Task);
onCancel();
}}
>
<Form.Item name="id" label="ID" rules={[{ required: true, message: 'Please enter id' }]}>
<Input aria-label="task-id" />
</Form.Item>


<Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
<Input aria-label="task-name" />
</Form.Item>


<Form.Item name="owner" label="Owner" rules={[{ required: true }]}>
<Input aria-label="task-owner" />
</Form.Item>


<Form.Item name="command" label="Command" rules={[{ required: true }]}>
<Input.TextArea aria-label="task-command" rows={3} />
</Form.Item>


<Form.Item>
<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
<Button onClick={onCancel}>Cancel</Button>
<Button htmlType="submit" type="primary">Save</Button>
</div>
</Form.Item>
</Form>
</Modal>
);
}