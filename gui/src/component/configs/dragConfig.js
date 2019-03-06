const dargConfig = {
	component: {
		form: [
			{ ch: 'Input', data: { type: 'Input', label: '', name: '' } },
			{ ch: 'Button', data: { type: 'Button' } },
			{ ch: 'Select', data: { type: 'Select' } },
			{ ch: 'DatePicker', data: { type: 'DatePicker' } },
			{ ch: 'RangePicker', data: { type: 'RangePicker' } },
			{ ch: 'Radio', data: { type: 'Radio' } },
			{ ch: 'Checkbox', data: { type: 'Checkbox' } },
		],
		others: [
			{ ch: 'Breadcrumb', data: { type: 'Breadcrumb' } },
			{ ch: 'Text', data: { type: 'Text' } },
			{ ch: 'Tabs', data: { type: 'Tabs' } },
		]
	},
	layout: [
		{ ch: 'Form', data: { type: 'FormContainer' } },
		{ ch: 'Table', data: { type: 'TableContainer' } },
		{ ch: 'Box', data: { type: 'BoxContainer' } },
		// { ch: '网格容器', data: { type: 'GridContainer' } },
		// { ch: '占位容器', data: { type: 'EmptyContainer' } },
	],
};

export default dargConfig;