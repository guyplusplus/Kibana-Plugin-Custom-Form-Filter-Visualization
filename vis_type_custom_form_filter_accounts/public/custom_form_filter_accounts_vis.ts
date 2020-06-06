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

import { CustomFormFilterAccountsVis } from './custom_form_filter_accounts_vis_controller';
import { CustomFormFilterAccountsOptions } from './custom_form_filter_accounts_options';
import { customFormFilterAccountsVisRequestHandler } from './custom_form_filter_accounts_vis_request_handler';
import { DefaultEditorSize } from '../../vis_default_editor/public';

export const customFormFilterAccountsVisDefinition = {
  name: 'customFormFilterAccounts',
  title: 'Form - Accounts',
  isAccessible: true,
  icon: 'visText',
  description: 'This sample custom visualization plugin contains a simple UI to adjust filter for accounts test data',
  visConfig: {
    component: CustomFormFilterAccountsVis, //CustomFormFilterAccountsVisWrapper,
    defaults: {
      filterCounter: 0, //0=no action -1=delete all filters,1=first time to add filters with clicking 'Apply filter', then 2 onward each time this button is click
      age: 20,
      minimumBalance: null,
      maximumBalance: 100000,
    },
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
  requestHandler: customFormFilterAccountsVisRequestHandler,
  //requestHandler: 'none',
  responseHandler: 'none',
};
