import React from 'react';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core';

const styles = {
	filterContainer: {
		width: '100%',
		display: 'flex',
		flexWrap: 'wrap',
		overflow: 'hidden',
	},
	selectedFilter: {
		background: '#f5f5f5',
		color: '#595959',
		fontSize: '14px',
		margin: '15px 10px 0 0',
	},
};

/*
	This component is use to render Tag for SelectedFilters.

	Note: if conditions are because each component have different type
	of value. Like Series is String, Authors is Array, similarily other
	values. We need to handle this value Manually.
*/

const CustomSelectedFilters = props => {
	const { selectedValues, setValue } = props;
	const clearFilter = (component, values) => {
		setValue(component, values);
	};

	const {
		classes: { selectedFilter, filterContainer },
	} = props;

	const filters = Object.keys(selectedValues).map(component => {
		const componentFilters = selectedValues[component].value;

		if (
			(component === 'Search' && componentFilters !== '') ||
			(component === 'Series' &&
				componentFilters !== '' &&
				componentFilters !== null &&
				componentFilters !== undefined)
		) {
			return (
				<Chip
					className={selectedFilter}
					key={component}
					onDelete={() => clearFilter(component, '')}
					label={`${component}: ${componentFilters}`}
				/>
			);
		}

		if (componentFilters && componentFilters.length > 0) {
			return (
				<React.Fragment key={component}>
					{component === 'Ratings' || component === 'Year' ? (
						<Chip
							className={selectedFilter}
							key={component}
							onDelete={() => clearFilter(component, null)}
							label={`${component}: ${componentFilters[0]} - ${componentFilters[1]}`}
						/>
					) : (
						componentFilters.map(tag => (
							<Chip
								className={selectedFilter}
								key={tag}
								onDelete={() =>
									clearFilter(
										component,
										componentFilters.filter(selected => selected !== tag),
									)
								}
								label={`${component}: ${tag}`}
							/>
						))
					)}
				</React.Fragment>
			);
		}
		return null;
	});

	return <div className={filterContainer}>{filters}</div>;
};

export default withStyles(styles)(CustomSelectedFilters);
