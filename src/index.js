import React from 'react'
import ReactDOM from 'react-dom'
import FilteredList from './FilteredList/FilteredList'
class App extends React.Component {
  render() {
    return <FilteredList length={10} />
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
