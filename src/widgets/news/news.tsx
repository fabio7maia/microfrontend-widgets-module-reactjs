import React from 'react';
import { useLogger } from '@hooks';
import { MicroFrontend } from '../../microfrontend';
import { Placeholder } from '@components';

export interface New {
	id: string;
	description: string;
	title: string;
	author: string;
}

const getLatestNews = async () => {
	const res = await fetch(
		'https://api.currentsapi.services/v1/latest-news?language=pt&apiKey=QN0EPAz38wKForSojURnBoRHsoJO2XbGTbched4aLN4SUPYQ'
	);

	return res.json();
};

export const News: React.FC = (props) => {
	const logger = useLogger();
	const [index, setIndex] = React.useState(0);
	const [news, setNews] = React.useState<New[]>([]);

	React.useEffect(() => {
		getLatestNews().then((res) => setNews(res.news));
	}, []);

	logger('News > render', { news });

	return (
		<Placeholder ready={!!news.length} rows={9}>
			<div
				style={{
					backgroundColor: '#c7c1c1',
					padding: '10px',
					color: '#000',
					borderRadius: '5px',
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<button onClick={(): void => setIndex((index) => (index - 1 >= 0 ? --index : news.length - 1))}>
						Back
					</button>
					<button onClick={(): void => setIndex((index) => (index + 1 < news.length ? ++index : 0))}>
						Next
					</button>
				</div>
				{news.length > index && (
					<div
						style={{
							padding: '5px',
							fontSize: '18px',
							fontWeight: 700,
						}}
					>
						<h1>{news[index].title}</h1>
						<h5>{news[index].author}</h5>
						<span style={{ fontWeight: 700 }}>{news[index].description}</span>
					</div>
				)}
			</div>
		</Placeholder>
	);
};

export default MicroFrontend.export(News);
