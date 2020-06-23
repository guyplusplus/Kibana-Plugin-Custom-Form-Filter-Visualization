/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import {
  EuiButton,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiSpacer,
} from '@elastic/eui';
import { useKibana } from '../../../src/plugins/kibana_react/public';
import { CustomFormFilterAccountsVisDependencies } from './plugin';
import { CustomFormFilterAccountsVisParams } from './types';
import { removeFiltersByControlledBy, stringToInt, stringToFloat } from './filter_helper';

const filterControlledBy = 'accountsVis';

interface CustomFormFilterAccountsVisComponentProps extends CustomFormFilterAccountsVisParams {
  renderComplete: () => {};
}

/**
 * The CustomFormFilterAccountsVisComponent renders the form.
 */
class CustomFormFilterAccountsVisComponent extends React.Component<CustomFormFilterAccountsVisComponentProps> {

  /**
   * Will be called after the first render when the component is present in the DOM.
   *
   * We call renderComplete here, to signal, that we are done with rendering.
   */
  componentDidMount() {
    this.props.renderComplete();
  }

  /**
   * Will be called after the component has been updated and the changes has been
   * flushed into the DOM.
   *
   * We will use this to signal that we are done rendering by calling the
   * renderComplete property.
   */
  componentDidUpdate() {
    this.props.renderComplete();
  }

  constructor(props: CustomFormFilterAccountsVisComponentProps) {
    super(props);
    removeFiltersByControlledBy(this.props.filterManager, filterControlledBy);
    this.state = {
      age: "",
      minimumBalance: ""
    };
    if(props.age != null)
      this.state.age = String(props.age);
    if(props.minimumBalance != null)
      this.state.minimumBalance = String(props.minimumBalance);
  }

  onClickButtonApplyFilter = () => {
    removeFiltersByControlledBy(this.props.filterManager, filterControlledBy);

    const age = stringToInt(this.state.age);
    if(age != null) {
      const ageFilter = {
        meta: {
          controlledBy: filterControlledBy,
          alias: 'Age: ' + age,
          disabled: false,
          negate: false,
        },
        query: {
          match_phrase: {
            age: String(age)
          }
        }
      };
      this.props.filterManager.addFilters(ageFilter);  
    }

    const minimumBalance = stringToFloat(this.state.minimumBalance);
    if(minimumBalance != null) {
      const minimumBalanceFilter = {
        meta: {
          controlledBy: filterControlledBy,
          alias: 'Min. Bal.: ' + minimumBalance,
          disabled: false,
          negate: false,
        },
        "range": {
          "balance": {
            "gte": minimumBalance,
            "lt": this.props.maximumBalance,
          }
        }
      };
      this.props.filterManager.addFilters(minimumBalanceFilter); 
    }
  }

  onClickButtonDeleteFilter = () => {
    removeFiltersByControlledBy(this.props.filterManager, filterControlledBy);
  };

  onClickButtonClearForm = () => {
    this.state.age = "";
    this.state.minimumBalance = "";
    removeFiltersByControlledBy(this.props.filterManager, filterControlledBy);
    this.forceUpdate();
  };

  onClickButtonToday = () => {
    this.props.timefilter.setTime(
      {from: 'now/d', to: 'now/d'}
    );
  };
  
  onFormChange = (event) => {
    const target = event.target;
    const valueStr = target.value;
    const name = target.name;
    //there is no validation in this sample code to prevent illegal typing
    this.setState({
      [name]: valueStr
    });
  };

  /**
   * Render the actual HTML.
   */
  render() {
    const minimumBalanceHelpText = `Input account minimum balance (Maximum is ${this.props.maximumBalance})`;
    return (
      <div className="cffVis" >
        <EuiForm>
          <EuiFormRow label="Age" helpText="Input customer age">
            <EuiFieldText name="age" onChange={e => this.onFormChange(e)} value={this.state.age} />
          </EuiFormRow>
          <EuiFormRow label="Minimum balance" helpText={minimumBalanceHelpText} >
            <EuiFieldText name="minimumBalance" onChange={e => this.onFormChange(e)} value={this.state.minimumBalance} />
          </EuiFormRow>
          <EuiSpacer />
          <EuiButton onClick={this.onClickButtonApplyFilter} fill>Apply filter</EuiButton>&nbsp;
          <EuiButton onClick={this.onClickButtonDeleteFilter} >Delete filter</EuiButton>&nbsp;
          <EuiButton onClick={this.onClickButtonClearForm} >Clear form</EuiButton>&nbsp;
          <EuiButton onClick={this.onClickButtonToday} color="secondary">Time: today</EuiButton>
        </EuiForm>
      </div>
    );
  }
}

/**
 * This is a wrapper component, that is actually used as the visualization.
 * The sole purpose of this component is to extract all required parameters from
 * the properties and pass them down as separate properties to the actual component.
 * That way the actual (CustomFormFilterAccountsVisComponent) will properly trigger it's prop update
 * callback (componentWillReceiveProps) if one of these params change. It wouldn't
 * trigger otherwise (e.g. it doesn't for this wrapper), since it only triggers
 * if the reference to the prop changes (in this case the reference to vis).
 *
 * The way React works, this wrapper nearly brings no overhead, but allows us
 * to use proper lifecycle methods in the actual component.
 */
import { CustomFormFilterAccountsVisComponentProp } from './custom_form_filter_accounts_vis';

export function CustomFormFilterAccountsVisWrapper(props: CustomFormFilterAccountsVisComponentProp) {
  const kibana = useKibana<CustomFormFilterAccountsVisDependencies>();
  return (
    <CustomFormFilterAccountsVisComponent
      filterCounter={props.visParams.filterCounter}
      age={props.visParams.age}
      minimumBalance={props.visParams.minimumBalance}
      maximumBalance={props.visParams.maximumBalance}
      renderComplete={props.renderComplete}
      timefilter={kibana.services.timefilter}
      filterManager={kibana.services.filterManager}
    />
  );
}
