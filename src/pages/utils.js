import getPreferences from '../utils/preferences';

// eslint-disable-next-line import/prefer-default-export
export const getPagePreferences = (page) => {
	const preferences = getPreferences();
	const pagePreferences = preferences.pageSettings.pages[page] || {};
	const globalSettings = preferences.globalSettings ? preferences.globalSettings : {};
	const globalEndpoint = globalSettings.endpoint;
	const pageIndexSettings = pagePreferences.indexSettings || {};
	const pageEndpoint = pageIndexSettings.endpoint;
	const endpoint = pageEndpoint || globalEndpoint;
	const fusionSettings = Object.assign(
		{},
		preferences.fusionSettings,
		pageIndexSettings.fusionSettings,
	);
	const otherComponents = Object.keys(pagePreferences.componentSettings || {})
		.filter((key) => !['search', 'result'].includes(key))
		.map((key) => ({ ...pagePreferences.componentSettings[key], key }));
	const { result: resultComponent, search: searchComponent } =
		pagePreferences.componentSettings || {};
	const globalmongoDBSettings = globalSettings?.meta?.mongoDBSettings || {};
	const mongoDBSettings = {
		...(globalmongoDBSettings || {}),
		...(pageIndexSettings?.mongoDBSettings || {}),
	};
	return {
		pagePreferences,
		otherComponents,
		resultComponent,
		searchComponent,
		endpoint,
		fusionSettings,
		mongoDBSettings,
	};
};
