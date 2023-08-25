import React from 'react';
import { MultiList } from '@appbaseio/reactivesearch';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { withStyles, InputLabel, FormControl } from '@material-ui/core';

const styles = theme => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: theme.spacing.unit / 4,
	},
	noLabel: {
		marginTop: theme.spacing.unit * 3,
	},
	label: {
		paddingLeft: '10px',
	},
	container: {
		margin: '20px 10px 10px',
		width: '280px',
	},
});

/*
	This component can be used inside ReactiveComponent to generate an UI for
	MultiDropdownList using Select Component of Material UI.
*/

class SelectComponent extends React.Component {
	state = {
		selectedItems: [],
	};

	myRef = React.createRef();

	static getDerivedStateFromProps(props, state) {
		const { selectedItems } = state;
		const { value } = props;
		if (value && value.length !== selectedItems.length) {
			return {
				selectedItems: value,
			};
		}
		return null;
	}

	componentDidUpdate(prevProps) {
		const { value } = prevProps;
		const { value: newValues, setQuery, dataField } = this.props;

		if (newValues !== value) {
			const query = MultiList.defaultQuery(newValues, {
				queryFormat: 'or',
				dataField,
			});
			setQuery({
				query,
				value: newValues,
			});
		}
	}

	handleChange = e => {
		const selectedItems = e.target.value;
		const { setQuery, dataField } = this.props;
		const query = MultiList.defaultQuery(selectedItems, {
			queryFormat: 'or',
			dataField,
		});
		setQuery({
			query,
			value: selectedItems,
		});
		this.setState({ selectedItems });
	};

	handleFocusRemoved = () => {
		this.myRef.current.focus();
	};

	render() {
		const { selectedItems } = this.state;
		const { dataField, key, selectComponentProps, aggregations, classes } = this.props;
		let items = [];
		if (aggregations && aggregations[dataField] && aggregations[dataField].buckets.length) {
			/* eslint-disable camelcase */
			items = aggregations[dataField].buckets.map(({ key: itemKey, doc_count }) => ({
				value: itemKey,
				count: doc_count,
			}));
			/* eslint-enable camelcase */
		}

		return (
			<FormControl className={classes.formControl}>
				<InputLabel className={classes.label} htmlFor={key}>
					Select Authors
				</InputLabel>
				<Select
					key={key}
					MenuProps={{
						onExited: this.handleFocusRemoved,
					}}
					multiple
					value={selectedItems}
					onChange={this.handleChange}
					input={<Input id={key} />}
					className={classes.container}
					renderValue={selected => (
						<div className={classes.chips}>
							{selected.map(value => (
								<Chip key={value} label={value} className={classes.chip} />
							))}
						</div>
					)}
					{...selectComponentProps}
				>
					{items.map(item => (
						<MenuItem key={item.value} value={item.value}>
							{item.value || 'N/A'}
						</MenuItem>
					))}
				</Select>
				<input
					value=""
					style={{ opacity: 0, cursor: 'none', height: 0, width: 0 }}
					ref={this.myRef}
				/>
			</FormControl>
		);
	}
}

export default withStyles(styles)(SelectComponent);
