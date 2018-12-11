import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchFactTable, fetchDimensions, fetchMeasures, selectFactTable } from '../actions';
import _ from 'lodash';

class FactTableList extends Component {
  
  constructor(props) {
    super(props);
    this.fetchMeasuresAndDimensions = this.fetchMeasuresAndDimensions.bind(this);
  }

  componentDidMount() {
    this.props.fetchFactTable();
  }

  renderTableList() {
    return _.map(this.props.factTables, factTable => {
      const tableId = this.props.selectedFactTable
      const className = (tableId && tableId === factTable.sifTablica) ? 'list-group-item active' : 'list-group-item';
      return (
        <li className={className}
            key={factTable.sifTablica}
            value={factTable.sifTablica}
            onClick={this.fetchMeasuresAndDimensions}>
            { factTable.nazTablica }
        </li>
      );
    });
  }

  fetchMeasuresAndDimensions(event) {
    let tableId = event.target.value;
    this.props.selectFactTable(tableId)
    this.props.fetchMeasures(tableId);
    this.props.fetchDimensions(tableId);
  }

  render() {
    return (
      <div>
        <ul className="list-group">
          {this.renderTableList()}
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { 
    factTables: state.factTables,
    selectedFactTable: state.selectedFactTable
  };
}

export default connect(
  mapStateToProps, 
  { 
    fetchFactTable,
    fetchDimensions,
    fetchMeasures,
    selectFactTable
  }
)(FactTableList);
