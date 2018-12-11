import React, { Component } from 'react';
import { connect } from 'react-redux';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import _ from 'lodash';
import hash from 'object-hash';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/sql/sql.js');

class Presentation extends Component {

  renderKeyHeaders() {
    if(this.props.queryResult.result) {
      return Object.keys(this.props.queryResult.result[0]).map(key => {
          return (
            <th scope="col" key={key}>{key}</th>
          );
        }
      );
    }
    return null;
  }

  renderTableRow(row) {
    return _.map(row, (value, key)=> {
      return (
        <td key={hash(value + key)}>{value}</td>
      );
    });
  }

  renderTableRows() {
    if(this.props.queryResult.result) {
      return _.map(this.props.queryResult.result, (row, index) => {
          return (
            <tr key={index}>
              <th scope="row">{index}</th>
              {this.renderTableRow(row)}
            </tr>
          );
        }
      );
    }
  }

  renderTable() {
    return (
      <div className="table-responsive">
          <table className="table table-striped table-sm">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                {this.renderKeyHeaders()}
              </tr>
            </thead>
            <tbody>
              {this.renderTableRows()}
            </tbody>
          </table>
      </div>
    );
  }

  render() {
    const value = this.props.queryResult.queryString ? this.props.queryResult.queryString : '';
    return (
      <div>
        <CodeMirror
          value={value}
          options={{
            mode: 'sql',
            theme: 'material',
            lineNumbers: true
          }} />
          {this.renderTable()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { 
    queryResult: state.queryResult
  };
}

export default connect(mapStateToProps, null)(Presentation);
