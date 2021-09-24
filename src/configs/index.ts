/* eslint-disable no-console */

console.log('env', { env: process.env });

export const LoggerConfig = {
	debug: process.env.REACT_APP_LOGGER_DEBUG === 'false' ? false : true,
	error: process.env.REACT_APP_LOGGER_ERROR === 'false' ? false : true,
	log: process.env.REACT_APP_LOGGER_LOG === 'false' ? false : true,
};

export const ApiConfig = {
	keys: {
		footballMatches: process.env.REACT_APP_API_KEY_FOOTBALL_MATCHES || '',
		news: process.env.REACT_APP_API_KEY_NEWS || '',
	},
	urls: {
		footballMatches: process.env.REACT_APP_API_URL_FOOTBALL_MATCHES || '',
		news: process.env.REACT_APP_API_URL_NEWS || '',
	},
};
