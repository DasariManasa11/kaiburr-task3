import React from 'react';
import { Modal, Typography } from 'antd';
import { TaskExecution } from '../types';


interface Props {
    visible: boolean;
    onClose: () => void;
    execution?: TaskExecution | null;
}


export default function ExecutionModal({ visible, onClose, execution }: Props) {
    return (
        <Modal
            open={visible}
            title="Execution Output"
            onCancel={onClose}
            footer={null}
            aria-labelledby="execution-output-title"
        >
            <Typography.Paragraph>
                <strong>Start:</strong> {execution?.startTime}
            </Typography.Paragraph>
            <Typography.Paragraph>
                <strong>End:</strong> {execution?.endTime}
            </Typography.Paragraph>
            <Typography.Paragraph>
                <strong>Output:</strong>
            </Typography.Paragraph>
            <pre tabIndex={0} style={{ whiteSpace: 'pre-wrap', outline: 'none' }}>{execution?.output}</pre>
        </Modal>
    );
}