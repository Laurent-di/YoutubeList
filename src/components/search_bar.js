import React, { Component } from 'react';

class SearchBar extends Component{
	constructor(props){
		super(props);
		this.state = {
			value: ''
		};
		this.onInputChange = this.onInputChange.bind(this);
	}

	onInputChange(value){
		this.setState({value});
		this.props.onSearchTermChange(value);
	}

	render(){
		return(
			<div className='search-bar'>
				<input
					onChange={event => this.onInputChange(event.target.value)}
					value={this.state.value}
				/>
			</div>
		)
	};
}

export default SearchBar;