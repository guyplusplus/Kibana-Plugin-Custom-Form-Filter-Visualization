# Kibana Plugin - Custom Form Filter Visualization 

This project is a simple tutorial for Kibana new comers trying to developer their own vizualisation plugin. The actual usecase is to create a custom form to filter data to help end-users search their data.

This plugin is a demo for the accounts data which can be downloaded from elastic web site [here](https://download.elastic.co/demos/kibana/gettingstarted/accounts.zip) then uploaded via `curl -H 'Content-Type: application/x-ndjson' -XPOST 'localhost:9200/bank/account/_bulk?pretty' --data-binary @accounts.json`.

As plugin architecture is being under heavy redesign in 7.x and documentation is rather obscure, I did my best to create something simple that works.

This repository is for Kibana v7.7 while [this repository](https://github.com/guyplusplus/Kibana-Plugin-Custom-Form-Filter-Visualization-Legacy) is for 7.6.2 legacy architecture.

This plugin is adapted from [vis_type_markdown](https://github.com/elastic/kibana/tree/7.8/src/plugins/vis_type_markdown) plugin.

## Sample Screenshots

Few screen shots which makes it very easy to understand.

![New Visualization - Step 1](./new-visualization1.png)

![New Visualization - Step 2](./new-visualization2.png)

![Dashboard](./dashboard.png)

## Creating a development environment from scratch on Ubuntu

1. Install curl and JRE

```
$ sudo apt install curl
$ sudo apt install openjdk-11-jre-headless
```

2. Install latest Kibana and ElasticSearch via apt

```
$ wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
$ echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic.list
$ sudo apt-get update
$ sudo apt-get install elasticsearch
$ sudo apt-get install kibana
```

For testing purpose, it may be required to install a specific (not latest) version of kibana or ElasticSearch.

```
$ sudo apt-get remove kibana    [for latest version]
$ sudo apt-get install kibana=7.6.2    [for a specific version]
```

3. Adjust listening IP address of kibana if network access is required

```
$ sudo vi /etc/kibana/kibana.yml
  server.host: "192.168.1.77"    [update with correct value]
```

4. Start ElasticSearch then Kibana. Then open browser http://192.168.1.77:5601

```
$ sudo systemctl start elasticsearch
$ curl -X GET "localhost:9200"
$ sudo systemctl start kibana
```

5. Now to create a development environment, download nvm, git client and yarn

```
$ curl https://raw.githubusercontent.com/creationix/nvm/v0.25.0/install.sh | bash 
$ nvm install 10.18.0
$ sudo apt-get install git
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
$ sudo apt update
$ sudo apt install yarn
```

6. Download Kibana source code and select the target version (v7.6.2, v7.0.0, etc.). `kibana` is the top directory.

```
$ git clone https://github.com/elastic/kibana.git
$ cd kibana
$ git checkout v7.6.2 
```

7. Copy the source code with modified name inside the `kibana/plugins` directory.

8. Start Kibana in development mode, ensuring only OSS (Open Source) features are used

```
$ cd kibana
$ nvm use
$ yarn kbn bootstrap
$ yarn start --oss
```

9. Kernel values adjustment for large number of file monitoring may be required

```
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
$ sudo sysctl -p
```

10. If you have problem to start Kibana 7.7.0 (from Git. For some reason it thinks it is already in version 8.0.0) with ElasticSearch 7.7.0, add this line in `config/kibana.yml` config file. When upgrading from 7.6 to 7.7 I had to delete all indexes `curl -XDELETE localhost:9200/*`.

```
elasticsearch.ignoreVersionMismatch: true
```

## Creating the actual form (step 7)

The current plugin name is based on accounts data. Simply perform a search replace in filenames and in the source code, respecting letter capitalization.

The form itself is contained in the [controller file](https://github.com/guyplusplus/Kibana-Plugin-Custom-Form-Filter-Visualization/blob/master/vis_type_custom_form_filter_accounts/public/custom_form_filter_accounts_vis_controller.tsx). An [option tab](https://github.com/guyplusplus/Kibana-Plugin-Custom-Form-Filter-Visualization/blob/master/vis_type_custom_form_filter_accounts/public/custom_form_filter_accounts_options.tsx) is also possible.

The form code looks like this and is very simple to modify, based on EUI React components.
* [Documentation](https://elastic.github.io/eui/#/)
* [Source Code](https://github.com/elastic/eui)

```
<div>
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
    <EuiButton onClick={this.onClickButtonClearForm} >Clear form</EuiButton>
  </EuiForm>
</div>
```

## Creating the plugin zip file

Simply add the plugin directory inside a kibana folder and zip the file. Do not include the `kibana/target` directory. The zip structure is

```
my-plugin_7.7.0.zip
  kibana/
    my-plugin/
      package.json
      config.js
      public/
        ...
      server/
        ...
```

## Installing the plugin

The plugin can then be installed like this for an apt installed Kibana.

```
$ sudo ./bin/kibana-plugin --allow-root install file:///home/john/downloads/kbn_tp_custom_form_filter_accounts_7.7.0_1.0.0.zip
$ sudo ./bin/kibana-plugin --allow-root install https://github.com/guyplusplus/Kibana-Plugin-Custom-Form-Filter-Visualization/releases/download/1.0.0/kbn_tp_custom_form_filter_accounts_7.7.0_1.0.0.zip
```

Deleting then installing the plugin often fails for me. I fix it by running this command.

```
$ rm -rf /usr/share/kibana/optimize/bundles
```

## Project TODO List

- [ ] Create form content (i.e. dropdown, slider) based on actual data
- [ ] Create a script to replace 'accounts' in filenames and file content
- [ ] Create own plugin icon


