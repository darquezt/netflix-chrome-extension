import React from 'react'
import PropTypes from 'prop-types'
import API from '../Api/Api'
import './FilteredList.css'

/* global chrome */

const Result = (props) => {
  const redirectToNetflix = (uri) => {
    console.log(uri);
    chrome.tabs.query({currentWindow: true, active: true}, (tab) => {
      chrome.tabs.update(tab.id, {url: uri});
    });
  };
  return (
    <li className='result'>
      <button
        children={props.item}
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
            return <Result item={item.name} itemId={item.id} uri={item.uri} key={item.id} />
          })
        }
      </ul>;
    } else if (this.state.loading) {
      results = <div className='loader-container'><div className='lds-ripple'><div></div><div></div></div></div>
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
    this.setState({
      currentQuery: word,
      items: this.state.items,
      loading: true
    })

    // Empty word => Message instead of results
    if (word === '') {
      this.setState({
        currentQuery: word,
        items: [],
        loading: false
      })
      return;
    }

    // Query the API and set results unless the word has changed
    const query = '?w=' + word + '&limit=10';
    const response = await API.get(query);
    if (this.state.currentQuery !== word) {
      return;
    }
    console.log(response.data);
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
