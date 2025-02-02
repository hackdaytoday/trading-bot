import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className="flex items-center gap-2 p-4 text-accent-red bg-accent-red/10 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span>{message}</span>
        </div>
    );
};

export default ErrorMessage;
