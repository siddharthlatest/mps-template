function getReactProp(componentSettings) {
	const reactProp = Object.keys(componentSettings)
		.filter((k) => k !== 'result')
		.filter((k) => componentSettings[k].rsConfig.componentId)
		.map((k) => componentSettings[k].rsConfig.componentId);

	if (!reactProp.includes('search')) {
		reactProp.push('search');
	}
	return reactProp;
}

export default getReactProp;
