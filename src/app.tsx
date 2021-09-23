import React from 'react';
import { FootballMatches, News } from '@widgets';

export const App: React.FC = () => {
	return (
		<>
			<div>
				<News />
			</div>
			<div style={{ margin: '30px 0 0 0' }}>
				<FootballMatches />
			</div>
		</>
	);
};
