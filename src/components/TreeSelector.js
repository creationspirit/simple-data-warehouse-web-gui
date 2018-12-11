import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postSelected } from '../actions';
import CheckboxTree from 'react-checkbox-tree';
import _ from 'lodash';

class TreeSelector extends Component {

  constructor() {
    super();

    this.state = {
      checkedMeasure: [],
      expandedMeasure: [],
      checkedDimension: [],
      expandedDimension: [],
    };
  }

  generateMeasureNodes() {
    let measureNodes = _.map(this.props.measures, (measure, index) => {
      return { value: index, label: measure.agrImeAtrib };
    })
    return [{
          value: 'mjere',
          label: 'Mjere',
          children: measureNodes
        }];
  }

  generateDimensionNodes() {
    let dimensionNodes = {}
    _.forEach(this.props.dimensions, (dimension, index) => {
      let tableName = dimension.nazTablica;
      if(!dimensionNodes[tableName]) {
        dimensionNodes[tableName] = {
          value: dimension.sifTablica,
          label: dimension.nazTablica,
          children: []
        }
      }
      dimensionNodes[tableName].children.push({value: index, label: dimension.imeAtrib})
    });
    
    return [{
          value: 'dimenzije',
          label: 'Dimenzije',
          children: _.values(dimensionNodes)
        }];
  }

  submitSelection() {
    const factTable = this.props.factTables[this.props.selectedFactTable];
    const dimensions = [];
    this.state.checkedDimension.forEach(item => {
      dimensions.push(this.props.dimensions[Number.parseInt(item)]);
    });
    const measures = [];
    this.state.checkedMeasure.forEach(item => {
      measures.push(this.props.measures[Number.parseInt(item)]);
    });

    this.props.postSelected(factTable, measures, dimensions);
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm">
          <CheckboxTree
              nodes={this.generateMeasureNodes()}
              checked={this.state.checkedMeasure}
              expanded={this.state.expandedMeasure}
              onCheck={checkedMeasure => this.setState({ checkedMeasure })}
              onExpand={expandedMeasure => this.setState({ expandedMeasure })}
          />
          <CheckboxTree
              nodes={this.generateDimensionNodes()}
              checked={this.state.checkedDimension}
              expanded={this.state.expandedDimension}
              onCheck={checkedDimension => this.setState({ checkedDimension })}
              onExpand={expandedDimension => this.setState({ expandedDimension })}
          />
        </div>
        <div className="col-sm">
          <button 
            type="button" 
            className="btn btn-success"
            onClick={this.submitSelection.bind(this)}>Execute</button>
      </div>
    </div>
    );
  }
}

function mapStateToProps(state) {
  return { 
    dimensions: state.dimensions,
    measures: state.measures,
    factTables: state.factTables,
    selectedFactTable: state.selectedFactTable,
  };
}

export default connect(mapStateToProps, { postSelected })(TreeSelector);
