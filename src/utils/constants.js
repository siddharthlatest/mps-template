const appbasePrefs = {
	name: 'Search unified-reactivesearch-web-data + Multi-page Search App',
	description: '',
	pipeline: 'unified-reactivesearch-web-data',
	backend: 'elasticsearch',
	id: '',
	pageSettings: {
		currentPage: 'search',
		pages: {
			search: {
				componentSettings: {
					search: {
						componentType: 'SEARCHBOX',
						customMessages: {
							noResults: 'No suggestions found for <mark>[term]</mark>',
						},
						searchButton: {
							icon: '',
							text: 'Click here to search',
						},
						redirectUrlText: 'Open URL',
						redirectUrlIcon: '',
						showSearchAs: 'sticky',
						fields: {
							title: {
								dataField: 'title',
								highlight: true,
							},
							description: {
								dataField: 'tokens',
								highlight: true,
							},
							price: {
								dataField: '',
								highlight: false,
							},
							priceUnit: null,
							image: {
								dataField: 'img',
								highlight: false,
							},
							handle: {
								dataField: 'url',
								highlight: false,
							},
							handleViewer: 'link',
							userDefinedFields: [],
							cssSelector: '',
						},
						rsConfig: {
							autosuggest: true,
							enableAI: false,
							AIUIConfig: {},
							enablePopularSuggestions: false,
							enableRecentSearches: false,
							highlight: false,
							showVoiceSearch: true,
							componentType: 'SEARCHBOX',
						},
					},
					result: {
						componentType: 'REACTIVELIST',
						fields: {
							title: {
								dataField: 'title',
								highlight: true,
							},
							description: {
								dataField: 'tokens',
								highlight: true,
							},
							price: {
								dataField: '',
								highlight: false,
							},
							priceUnit: null,
							image: {
								dataField: 'img',
								highlight: false,
							},
							handle: {
								dataField: 'url',
								highlight: false,
							},
							handleViewer: 'link',
							userDefinedFields: [],
							cssSelector: '',
						},
						customMessages: {
							noResults: 'No Results Found!',
							resultStats: '[count] products found in [time] ms',
						},
						rsConfig: {
							componentId: 'result',
							componentType: 'REACTIVELIST',
							infiniteScroll: true,
							pagination: false,
						},
						showAIAnswer: false,
						sortOptionSelector: [],
						resultHighlight: true,
						layout: 'grid',
						viewSwitcher: true,
						displayFields: {},
					},
					authors: {
						enabled: false,
						rsConfig: {
							URLParams: true,
							componentId: 'authors',
							componentType: 'MULTILIST',
							dataField: 'authors.keyword',
							placeholder: 'Filter by authors',
							showSearch: false,
							title: 'Filter by authors',
						},
					},
					ratings: {
						enabled: false,
						rsConfig: {
							componentId: 'ratings',
							componentType: 'RATINGSFILTER',
							data: [
								{
									end: 5,
									label: '4 stars and up',
									start: 4,
								},
								{
									end: 5,
									label: '3 stars and up',
									start: 3,
								},
								{
									end: 5,
									label: '2 stars and up',
									start: 2,
								},
								{
									end: 5,
									label: '> 1 stars',
									start: 1,
								},
							],
							dataField: 'average_rating',
							title: 'RatingsFilter',
						},
					},
					releaseYear: {
						enabled: false,
						rsConfig: {
							componentId: 'releaseYear',
							componentType: 'RANGESLIDER',
							dataField: 'original_publication_year',
							range: {
								end: 2019,
								start: 1950,
							},
							title: 'Publication Year',
							tooltipTrigger: 'hover',
						},
					},
					series: {
						enabled: false,
						rsConfig: {
							componentId: 'series',
							componentType: 'SINGLELIST',
							dataField: 'original_series.keyword',
							showSearch: false,
							title: 'Select Book Series',
						},
					},
				},
				indexSettings: {
					index: 'unified-reactivesearch-web-data',
					endpoint: {
						url: '/unified-reactivesearch-web-data/_reactivesearch',
						method: 'POST',
						headers:
							'{"Authorization":"Basic YTAzYTFjYjcxMzIxOjc1YjY2MDNkLTk0NTYtNGE1YS1hZjZiLWE0ODdiMzA5ZWI2MQ=="}',
					},
				},
			},
		},
		fields: {},
	},
	themeSettings: {
		type: 'multi-page',
		customCss: '',
		rsConfig: {
			colors: {
				primaryColor: '#0B6AFF',
				primaryTextColor: '#fff',
				textColor: '#424242',
				titleColor: '#424242',
			},
			typography: {
				fontFamily: 'Open Sans',
			},
		},
		meta: {
			bodyBackgroundColor: '#fff',
			navbarBackgroundColor: '#001628',
			linkColor: '#3eb0ef',
			fontWeight: 400,
		},
	},
	globalSettings: {
		currency: 'USD',
		showSelectedFilters: true,
		meta: {
			branding: {
				logoUrl: '',
				logoWidth: 200,
				logoAlignment: 'left',
			},
			deploySettings: {
				versionId: '',
			},
			templateSettings: {
				templateVersionId: '0.3.7',
			},
			endpoint: {
				url: '/unified-reactivesearch-web-data/_reactivesearch',
				method: 'POST',
				headers:
					'{"Authorization":"Basic YTAzYTFjYjcxMzIxOjc1YjY2MDNkLTk0NTYtNGE1YS1hZjZiLWE0ODdiMzA5ZWI2MQ=="}',
			},
		},
	},
	exportSettings: {
		exportAs: 'embed',
		credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
		openAsPage: false,
		type: 'other',
	},
	chartSettings: {
		charts: [],
	},
	syncSettings: null,
	authenticationSettings: {
		enableAuth0: false,
		enableProfilePage: true,
		profileSettingsForm: {
			viewData: true,
			editData: true,
			closeAccount: true,
			editThemeSettings: true,
			editSearchPreferences: true,
		},
		clientId: 'fQ50eZkW3WlFoDEfHAPBxiOTYmzSXZC7',
	},
	appbaseSettings: {
		index: 'unified-reactivesearch-web-data',
		credentials: 'a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61',
		url: 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io',
	},
};
export default JSON.stringify(appbasePrefs);
