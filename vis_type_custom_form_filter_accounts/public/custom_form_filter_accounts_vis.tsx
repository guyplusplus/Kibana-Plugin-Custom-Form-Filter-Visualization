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
import { KibanaContextProvider } from '../../../src/plugins/kibana_react/public';
import { DefaultEditorSize } from '../../../src/plugins/vis_default_editor/public';
import { DataPublicPluginSetup } from '../../../src/plugins/data/public';
import { ExprVis, VisParams } from '../../../src/plugins/visualizations/public';
import { CustomFormFilterAccountsVisWrapper } from './custom_form_filter_accounts_vis_controller';
import { CustomFormFilterAccountsOptions } from './custom_form_filter_accounts_options';
import { CustomFormFilterAccountsVisDependencies } from './plugin';
import { icon } from './custom_form_filter_icon';

export interface CustomFormFilterAccountsVisComponentProp {
  vis: ExprVis;
  data: DataPublicPluginSetup;
  visParams: VisParams;
}

export function getCustomFormFilterAccountsVisDefinition(dependencies: CustomFormFilterAccountsVisDependencies) {

  return {
    name: 'customFormFilterAccounts',
    title: 'Form - Accounts',
    isAccessible: true,
    icon: icon,
    description: 'This sample custom visualization plugin contains a simple UI to adjust filter for accounts test data',
    visConfig: {
      defaults: {
        filterCounter: 0, //0=no action -1=delete all filters,1=first time to add filters with clicking 'Apply filter', then 2 onward each time this button is click
        age: 20,
        minimumBalance: null,
        maximumBalance: 100000,
      },
      component:  (props: CustomFormFilterAccountsVisComponentProp) => (
        <KibanaContextProvider services={{ ...dependencies }}>
          <CustomFormFilterAccountsVisWrapper {...props} />
        </KibanaContextProvider>
      ),
    },
    editorConfig: {
      optionTabs: [
        {
          name: 'options',
          title: 'Options',
          editor: CustomFormFilterAccountsOptions,
        },
      ],
      enableAutoApply: false,
      defaultSize: DefaultEditorSize.LARGE,
    },
    options: {
      showIndexSelection: false,
      showTimePicker: true,
      showFilterBar: true,
    },
    requestHandler: 'none',
    responseHandler: 'none',
  };
}