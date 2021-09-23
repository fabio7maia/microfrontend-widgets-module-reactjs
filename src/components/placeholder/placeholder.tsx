import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';

interface PlaceholderProps {
	ready: boolean;
	rows?: number;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ children, ready, rows = 7 }) => {
	return (
		<ReactPlaceholder type="media" ready={ready} rows={rows}>
			{children}
		</ReactPlaceholder>
	);
};
