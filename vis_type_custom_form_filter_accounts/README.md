Change keyword account / Account in all filenames and content. Recommended to use a single word to avoid camel case vs kebad situation

custom_form_filter_accounts_options.tsx [DONE]
	Setting Config Data UI

custom_form_filter_accounts_vis.ts [DONE]
	form attributes definitions and default values (field attributes and default values)

custom_form_filter_accounts_vis_controller.tsx
	Vis UI
	form attributes mapping in CustomFormFilterAccountsVisWrapper function

types.ts [DONE]
	form attributes definition

custom_form_filter_accounts_vis_request_handler [DONE]
	Add filters based on attributes

TODO:
- internationalization
- put one example of form class (such as mkdEditor inside a .scss file)
- nice icon in customer_form_filter_accounts_vis
- check meaning of
	customer_form_filter_accounts_vis enableAutoApply
	customer_form_filter_accounts_vis defaultSize
- when in version 7.7 add back DefaultEditorSize in customer_form_filter_accounts_vis