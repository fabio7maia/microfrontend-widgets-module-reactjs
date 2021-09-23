import React from 'react';
import { useLogger } from '@hooks';
import { MicroFrontend } from '../../microfrontend';
import { Placeholder } from '@components';

interface Team {
	id: number;
	name: string;
}

interface Competition {
	id: number;
	name: string;
}

interface ScoreValue {
	awayTeam: number;
	homeTeam: number;
}

interface Score {
	fullTime: ScoreValue;
}

interface Match {
	id: string;
	awayTeam: Team;
	homeTeam: Team;
	competition: Competition;
	score: Score;
	status: 'FINISHED' | 'IN_PLAY';
}

const getTodayMatches = async (live = false) => {
	const url = live
		? 'http://api.football-data.org/v2/matches?status=LIVE'
		: 'http://api.football-data.org/v2/matches';

	const res = await fetch(url, {
		headers: {
			'X-Auth-Token': '9b6edc77dd1b4a3c98609b3dc2e3f2e9',
		},
	});

	return res.json();
};

export type FootballMatchesProps = {};

export const FootballMatches: React.FC<FootballMatchesProps> = (props) => {
	const logger = useLogger();
	const [live, setLive] = React.useState(false);
	const [matches, setMatches] = React.useState<Match[]>([]);

	React.useEffect(() => {
		getTodayMatches(live).then((res) => setMatches(res.matches));
	}, [live]);

	logger('FootballMatches > render', { matches });

	return (
		<Placeholder ready={!!matches.length} rows={10}>
			<div
				style={{
					backgroundColor: '#c7c1c1',
					padding: '10px',
					color: '#000',
					borderRadius: '5px',
				}}
			>
				<div style={{ margin: '0 0 20px 0' }}>
					<input
						type="checkbox"
						checked={live}
						onChange={(): void => {
							setLive((val) => !val);
						}}
					/>
					<label
						htmlFor="live"
						style={{ fontWeight: 900, fontSize: '20px', backgroundColor: 'yellow', padding: '0 5px' }}
					>
						Live
					</label>
				</div>
				{matches.map((match) => (
					<div
						key={match.id}
						style={{
							padding: '5px',
							fontSize: '18px',
							fontWeight: 700,
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							backgroundColor: match.status === 'IN_PLAY' ? 'yellow' : 'transparent',
						}}
					>
						<div>
							{match.score.fullTime.homeTeam} - {match.score.fullTime.homeTeam}
						</div>
						<div>
							{match.homeTeam.name} X {match.awayTeam.name}
						</div>
					</div>
				))}
			</div>
		</Placeholder>
	);
};

export default MicroFrontend.export(FootballMatches);
