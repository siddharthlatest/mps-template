function getReactPropForComponent(componentSettings, component) {
	let reactProp;
	reactProp = Object.keys(componentSettings)
		.filter((k) => componentSettings[k].rsConfig.componentId)
		.map((k) => componentSettings[k].rsConfig.componentId);

	// All components except "search" itself should react to "search"
	if (component !== 'search' && !reactProp.includes('search')) {
		reactProp.push('search');
	}
	// No component should react to "result" and itself
	reactProp = reactProp.filter((k) => k !== 'result' && k !== component);

	return reactProp;
}

export default getReactPropForComponent;
