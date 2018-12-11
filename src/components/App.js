import React, { Component } from 'react';

import FactTableList from './FactTableList';
import TreeSelector from './TreeSelector';
import Presentation from './Presentation';

class App extends Component {
 
  render() {
    return (
      <div className='container-fluid'>
        <div className="row">
          <div className="col-4">
            <FactTableList />
            <TreeSelector />
          </div>
          <div className="col-8">
            <Presentation />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
