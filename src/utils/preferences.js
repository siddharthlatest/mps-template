import defaultPreferences from './reactivesearchPreferences.json';
import appbasePrefs from './constants';
import getReactPropForComponent from './getReactPropForComponent';

/**
 *
 * @typedef {Object} Preferences
 * @property {PageSettings} pageSettings
 * @property {string} backend
 * @property {AppbaseSettings} appbaseSettings
 * @property {GlobalSettings} globalSettings
 * @property {ThemeSettings} themeSettings
 *
 * @typedef {Object} PageSettings
 * @property {Object<string, Page>} pages
 *
 * @typedef {Object} Page
 * @property {Object<string,Component>} componentSettings
 * @property {IndexSettings} indexSettings
 *
 * @typedef {Object} Component
 * @property {Fields} fields
 * @property {Object} rsConfig
 *
 * @typedef {Object} Fields
 * @property {string} title
 * @property {string} description
 * @property {string} price
 * @property {string} priceUnit
 * @property {string} handle
 * @property {Object<string, Field>} userDefinedFields
 *
 * @typedef {Object} Field
 * @property {string} dataField
 * @property {boolean} highlight
 */

function parseJSON(str) {
	let parsedObj;
	try {
		if (typeof str === 'string') parsedObj = JSON.parse(str);
		else parsedObj = str;
	} catch (e) {
		// Silence Errors
	}
	return parsedObj;
}

/**
 *
 * @param {object} preferences Preferences which have different structure than expected
 * @return {object} Preferences which have a well defined structure
 */
// eslint-disable-next-line no-unused-vars
function normalizePreferences(preferences) {
	const clonePreferences = { ...preferences };
	clonePreferences.themeSettings = Object.assign(
		{ rsConfig: { typography: {}, colors: {} }, meta: {} },
		clonePreferences.themeSettings,
	);

	Object.keys(clonePreferences.pageSettings.pages).forEach((page) => {
		const pagePreferences = clonePreferences.pageSettings.pages[page] || {};
		const { componentSettings } = pagePreferences || {};
		const { result: resultComponent, search: searchComponent } = componentSettings || {};
		if (resultComponent) {
			const hasOldStructure = typeof resultComponent.fields.title === 'string';
			if (hasOldStructure) {
				Object.keys(resultComponent.fields)
					.filter((field) => field !== 'userDefinedFields')
					.forEach((field) => {
						if (resultComponent.fields[field]) {
							resultComponent.fields[field] = {
								dataField: resultComponent.fields[field],
								highlight: false,
							};
						}
					});
				if (resultComponent.displayFields) {
					Object.keys(resultComponent.displayFields).forEach((category) => {
						const categoryFields = resultComponent.displayFields[category];
						Object.keys(categoryFields).forEach((field) => {
							if (categoryFields[field]) {
								categoryFields[field] = {
									dataField: categoryFields[field],
									highlight: false,
								};
							}
						});
					});
				}
				if (!resultComponent.fields.userDefinedFields) {
					resultComponent.fields.userDefinedFields = {};
				}
			}
		}
		if (searchComponent) {
			const hasOldStructure = typeof searchComponent.fields.title === 'string';
			if (hasOldStructure) {
				Object.keys(searchComponent.fields)
					.filter((field) => field !== 'userDefinedFields')
					.forEach((field) => {
						if (searchComponent.fields[field]) {
							searchComponent.fields[field] = {
								dataField: searchComponent.fields[field],
								highlight: false,
							};
						}
					});
				if (searchComponent.displayFields) {
					Object.keys(searchComponent.displayFields).forEach((category) => {
						const categoryFields = searchComponent.displayFields[category];
						Object.keys(categoryFields).forEach((field) => {
							if (categoryFields[field]) {
								categoryFields[field] = {
									dataField: categoryFields[field],
									highlight: false,
								};
							}
						});
					});
				}
				if (!searchComponent.fields.userDefinedFields) {
					searchComponent.fields.userDefinedFields = {};
				}
			}
		}
	});
	return clonePreferences;
}

/**
 *
 * @param {Object} preferences
 * @returns {Preferences}
 */
function transformPreferences(preferences) {
	const normalizedPreferences = normalizePreferences(preferences);
	const isFusion =
		normalizedPreferences.backend === 'fusion' ||
		(normalizedPreferences.fusionSettings && normalizedPreferences.fusionSettings.app !== '');
	const { appbaseSettings } = normalizedPreferences;
	if (normalizedPreferences.globalSettings && normalizedPreferences.globalSettings.endpoint) {
		const { endpoint } = normalizedPreferences.globalSettings;
		// We may get a url relative to cluster
		const isRelative = endpoint.url[0] === '/';

		normalizedPreferences.globalSettings.endpoint = {
			url: isRelative ? appbaseSettings.url + endpoint.url : endpoint.url,
			headers: parseJSON(endpoint.headers),
			method: endpoint.method,
		};
	}
	if (normalizedPreferences.pageSettings) {
		Object.keys(normalizedPreferences.pageSettings.pages).forEach((page) => {
			const pagePreferences = normalizedPreferences.pageSettings.pages[page];
			const { componentSettings } = pagePreferences;
			let highlightConfig = { fields: {} };
			const components = Object.keys(componentSettings).filter(
				(component) => !['search', 'result'].includes(component),
			);
			if (pagePreferences.indexSettings && pagePreferences.indexSettings.endpoint) {
				const { endpoint } = pagePreferences.indexSettings;
				// We may get a url relative to cluster
				const isRelative = endpoint.url[0] === '/';

				pagePreferences.indexSettings.endpoint = {
					url: isRelative ? appbaseSettings.url + endpoint.url : endpoint.url,
					headers: parseJSON(endpoint.headers),
					method: endpoint.method,
				};
			}
			// Build the highlight config object
			if (componentSettings.result) {
				const resultComponent = componentSettings.result;
				Object.keys(resultComponent.fields.userDefinedFields || {}).forEach((field) => {
					if (
						resultComponent.fields.userDefinedFields[field] &&
						resultComponent.fields.userDefinedFields[field].highlight &&
						resultComponent.fields.userDefinedFields[field].dataField
					) {
						const { dataField } = resultComponent.fields.userDefinedFields[field];
						highlightConfig.fields[dataField] = {};
					}
				});
				Object.keys(resultComponent.fields)
					.filter((field) => field !== 'userDefinedFields')
					.forEach((field) => {
						if (
							resultComponent.fields[field] &&
							resultComponent.fields[field].highlight &&
							resultComponent.fields[field].dataField
						) {
							const { dataField } = resultComponent.fields[field];
							highlightConfig.fields[dataField] = {};
						}
					});
				Object.keys(resultComponent.displayFields || {}).forEach((category) => {
					const categoryFields = resultComponent.displayFields[category];
					Object.keys(categoryFields).forEach((field) => {
						if (
							categoryFields[field] &&
							categoryFields[field].highlight &&
							categoryFields[field].dataField
						) {
							const { dataField } = categoryFields[field];
							highlightConfig.fields[dataField] = {};
						}
					});
				});
				highlightConfig = Object.keys(highlightConfig.fields).length
					? highlightConfig
					: undefined;
			}
			if (componentSettings.result) {
				const resultComponent = componentSettings.result;

				resultComponent.rsConfig.dataField =
					resultComponent.fields.title.dataField || 'title';
				resultComponent.rsConfig.highlight = resultComponent.resultHighlight;
				const reactProp = getReactPropForComponent(componentSettings, 'result');
				// and is used as the default conjunction
				resultComponent.rsConfig.react = { and: reactProp };
				resultComponent.rsConfig.sortOptions =
					resultComponent.sortOptionSelector && resultComponent.sortOptionSelector.length
						? resultComponent.sortOptionSelector
						: undefined;
				resultComponent.rsConfig = {
					...resultComponent.rsConfig,
					highlightConfig: componentSettings.result.resultHighlight
						? highlightConfig
						: undefined,
				};
			}
			if (componentSettings.search) {
				const searchComponent = componentSettings.search;
				const defaultFields = searchComponent.fields || {};
				const valueFields = [
					'term_s',
					defaultFields.title.dataField || defaultFields.description.dataField,
				].filter((x) => x);

				const suggestionsConfig = {
					enableIndexSuggestions: true,
					popularSuggestionsConfig: {
						size: 3,
						index: pagePreferences?.indexSettings?.index || appbaseSettings.index,
					},
					recentSuggestionsConfig: {
						size: 3,
						index: pagePreferences?.indexSettings?.index || appbaseSettings.index,
					},
					indexSuggestionsConfig: {
						size: 3,
						valueFields,
					},
					showDistinctSuggestions: true,
				};

				searchComponent.rsConfig.dataField =
					searchComponent.fields.title.dataField || 'title';
				if (isFusion) {
					searchComponent.rsConfig.dataField = undefined;
				}

				if (searchComponent.rsConfig && searchComponent.rsConfig.AIUIConfig) {
					let { AIUIConfig } = searchComponent.rsConfig;
					try {
						AIUIConfig = {
							...AIUIConfig,
							renderSourceDocument:
								AIUIConfig && AIUIConfig.sourceDocumentLabel
									? // eslint-disable-next-line no-new-func
									  new Function(
											'source',
											`return ${AIUIConfig.sourceDocumentLabel}`,
									  )
									: undefined,
						};
						delete AIUIConfig.sourceDocumentLabel;
					} catch {
						console.error('Invalid string passed to renderSourceDocument function');
					}
					searchComponent.rsConfig.AIUIConfig = AIUIConfig;
				}
				searchComponent.rsConfig = {
					...componentSettings.search.rsConfig,
					...suggestionsConfig,
					highlightConfig: componentSettings.search.highlight
						? highlightConfig
						: undefined,
				};
			}
			components.forEach((component) => {
				const { rsConfig, enabled } = componentSettings[component];
				if (enabled) {
					if (rsConfig.range && rsConfig.range.start) {
						return;
					}
					if (component) {
						const reactProp = getReactPropForComponent(componentSettings, component);
						// and is used as the default conjunction
						componentSettings[component].rsConfig.react = { and: reactProp };
					}
					if (rsConfig.startValue && rsConfig.endValue) {
						rsConfig.range = {
							start: parseInt(rsConfig.startValue, 10),
							end: parseInt(rsConfig.endValue, 10),
						};
					}
					if (
						(rsConfig.componentType === 'RANGEINPUT' ||
							rsConfig.componentType === 'DYNAMICRANGESLIDER') &&
						rsConfig.queryFormat === 'or'
					) {
						delete rsConfig.queryFormat;
					}
				} else {
					delete componentSettings[component];
				}
			});
		});
	}
	return normalizedPreferences;
}

// Use appbasePrefs if set, otherwise use default preferences
const getPreferences = () => {
	try {
		// eslint-disable-next-line eqeqeq
		if (appbasePrefs.includes('{{APPBASE_PREFERENCES}}')) {
			throw new Error('preferences not available');
		}
		if (!getPreferences._preferences) {
			getPreferences._preferences = transformPreferences(JSON.parse(appbasePrefs));
		}
	} catch (e) {
		if (!getPreferences._preferences)
			getPreferences._preferences = transformPreferences(defaultPreferences);
	}
	return getPreferences._preferences;
};

export default getPreferences;
