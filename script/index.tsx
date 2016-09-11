import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import assign = require('object-assign');

interface State {
	keyword:     string;
	offset:      number;
	r18:         boolean;
	results:     Array<string>;
	error:       boolean;
	loading:     boolean;
	resultStyle: Object;
}

class App extends React.Component<{}, State> {
	constructor(props) {
		super(props);

		this.state = {
			keyword:     '',
			offset:      0,
			r18:         false,
			results:     [],
			error:       false,
			loading:     false,
			resultStyle: {}
		};
	}

	addToResults = (data) => {
		// this.state.results.push(data.image.default.url);
		this.state.results.unshift(data.image.default.url);
	}

	reset = (e) => {
		e.preventDefault();

		var results = ReactDOM.findDOMNode(this.refs['results']);
		// this.state.results = [];
		this.state.resultStyle = {height: (window.innerHeight - results.getBoundingClientRect().top - 20) + 'px'};
		this.setState(this.state);

		this.submit();

		return false;
	}

	submit = () => {
		this.state.error = false;
		this.state.loading = true;
		this.setState(this.state);

		$.ajax({
			method: 'GET',
			url: 'http://api.gifmagazine.net/v1/gifs/search',
			data: {
				q: this.state.keyword,
				limit: 2,
				// offset: this.state.offset,
				safe: this.state.r18 ? 1 : 0
			}
		})
		.done(function(data) {
			data.data.map(this.addToResults);
			// this.state.offset += 2;
			this.state.loading = false;
			this.setState(this.state);

			// if(this.isScrolled()) {
			// 	this.submit();
			// }
		}.bind(this))
		.fail(function() {
			this.state.error = true;
			this.state.loading = false;
			this.setState(this.state);
		}.bind(this));
	}

	change = (e) => {
		this.state.keyword = e.target.value;
		this.setState(this.state);
	}

	toggleR18 = (e) => {
		if(e.target.checked) {
			this.state.r18 = true;
		} else {
			this.state.r18 = false;
		}
		this.setState(this.state);
	}

	resultElements = () => {
		var i = 0;
		return this.state.results.map(result => {
			const style = {backgroundImage: 'url('+result+')' };
			return <div key={i++} style={style} className="img"></div>;
		});
	}

	isScrolled = (): boolean => {
		var el = ReactDOM.findDOMNode(this.refs['results']) as HTMLElement;
		if(el.scrollHeight - (el.offsetHeight + el.scrollTop) < 10) {
			return true;
		}
		return false;
	}

	onScroll = () => {
		if(this.isScrolled()) {
			this.submit();
		}
	}

	errorElement = () => {
		if(this.state.loading) {
			return (
				<p className="error">
					読み込み中...
				</p>
			);
		}
		if(this.state.error) {
			return (
				<p className="error">
					読み込みに失敗しました。<br/>
					<a onClick={this.submit}>再試行</a>
				</p>
			);
		}
		return null;
	}

	render() {
		return (
			<div className="app">
				<h1>GIFアニメ検索してくれるやつ</h1>
				<form onSubmit={this.reset}>
					<div className="input">
						<input type="text" value={this.state.keyword} onChange={this.change} />
						<button type="submit"></button>
					</div>
					<input type="checkbox" id="cb" onChange={this.toggleR18} /><label htmlFor="cb">やばいやつ</label>
				</form>
				<div className="results" ref="results" style={this.state.resultStyle}>
					{this.resultElements()}
				</div>
				{this.errorElement()}
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
