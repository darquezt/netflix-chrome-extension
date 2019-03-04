import React from 'react'
import PropTypes from 'prop-types'
import API from '../Api/Api'
import './FilteredList.css'

/* global chrome */

const Result = (props) => {
  const redirectToNetflix = (uri) => {
    chrome.tabs.query({currentWindow: true, active: true}, (tab) => {
      chrome.tabs.update(tab.id, {url: uri});
    });
  };
  return (
    <li className='result'>
      <button
        children={props.item + ' (' + props.titles_count + ')'}
        key={props.item.itemId}
        data-id={props.item.itemId}
        onClick={() => redirectToNetflix(props.uri)}
      />
    </li>
    )
}

class FilteredList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuery: '',
      items: [],
      loading: false
    }
  }

  render() {
    let results;
    if (this.state.items.length !== 0) {
      results =
      <ul className='results'>
        {
          this.state.items.map(function(item) {
            return <Result
              item={item.name}
              itemId={item.id}
              uri={item.uri}
              titles_count={item.netflix_titles_count}
              key={item.id} />
          })
        }
      </ul>;
    } else if (this.state.loading) {
      results = <div className='loader-container'><div className='lds-ripple'><div></div><div></div></div></div>
    } else if (this.state.currentQuery !== '') {
      results = <div className='empty-list circle'>No encontramos nada:c</div>;
    } else {
      results = <div className='empty-list circle'>Realiza una busqueda!</div>;
    }
    return (
      <div className="filter-list">
        <form onSubmit={(event) => this.submitHandler(event)}>
          <input
            type="text"
            placeholder="¿Qué quieres ver?"
            onChange={(event) => this.filterList(event)}
            className="search-bar"
          />
        </form>
        {results}
      </div>
    )
  }

  async filterList(event) {
    const word = event.target.value;

    // Empty word => Message instead of results
    if (word === '') {
      this.setState({
        currentQuery: word,
        items: [],
        loading: false
      })
      return;
    } else {
      this.setState({
        currentQuery: word,
        items: this.state.items,
        loading: true
      })
    }

    // Query the API and set results unless the word has changed
    const query = '?w=' + word + '&limit=' + this.props.length + '&titles_q=true&active_genres=true&sort_by=nTitles';
    const response = await API.get(query);
    if (this.state.currentQuery !== word) {
      return;
    }

    this.setState({
      items: response.data.slice(0, this.props.length),
      currentQuery: word,
      loading: false
    })
  }

  submitHandler(event) {
    event.preventDefault();
  }
}

FilteredList.propTypes = {
  length: PropTypes.number.isRequired,
}

export default FilteredList;
