import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';



class App extends Component {

  constructor(props) {
    // required, also by including 'props' w/ super, we  can use this.props in the constructor
    // otherwise we would get undefined if we used only 'super();'
    super(props);

    //set initial state of this component to the sample list of items
    //shortened from 'list: list,' to 'list,' thanks to es6 object initializer
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      // now it's bound to the whole component, ie: can be used in the render()
    
    };
    
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this); 
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

  }
  //class method

  setSearchTopStories(result) {
    this.setState({ result });
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }


  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: {...this.state.result, hits: updatedHits }
    });
  }

  render() {   
    const { searchTerm, result } = this.state  

    return (
      <div className="page">
      <div className="interactions">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
        >
          Search
        </Search>
      </div>

      { result

          ? <Table
            list={result.hits}            
            onDismiss={this.onDismiss}

            />

            :null
      }

      </div>
    );
  }
}

const Search = ({value, onChange, onSubmit, children}) => 

      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
        <button type="submit">
          {children}
        </button>
      </form>  

// Testing using variables for inline stlying of component elements. Used on Table's URL/Title element
const lrgCol = {
  width: '40%',
};

const Table = ({list, onDismiss}) =>
      
      <div className="table">
        {list.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={ lrgCol }>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '10%' }}>{item.num_comments}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span style={{ width: '10%' }}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              > 
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>


const Button = ({ onClick, className = '', children }) =>
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>



//Below is the original Button 'e6 class component' before being refactored into a stateless functional component

// class Button extends Component {
//   render() {
//     const {
//       onClick,
//       className = '',
//       children,
//     } = this.props;

//     return (
//       <button
//         onClick={onClick}
//         className={className}
//         type="button"
//       >
//         {children}
//       </button>
//     );
//   }


// }



export default App;
