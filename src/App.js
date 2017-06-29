import React, { Component } from 'react';
import TemplateBuilder from './TemplateBuilder'
import style from './TemplateBuilder/style.css'

const TEMPLATE_FIELDS = [
  {
    label: 'First Name',
    value: '{{ customer.first_name }}'
  },
  {
    label: 'Last Name',
    value: '{{ customer.last_name }}'
  },
  {
    label: 'Email',
    value: '{{ customer.emails[0].email }}'
  },
  {
    label: 'Dealership',
    value: '{{ get_dealer(opportunity.dealer_id).dealer_name }}'
  },
  {
    label: "Sales Rep",
    value: '{{ get_user(opportunity.sales_reps[0]).profile.first_name }}'
  },
  {
    label: "Current Vehicle",
    value: '{{ customer.vehicles[0].make }} {{ customer.vehicles[0].model }}'
  }
]


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      template: localStorage.getItem('test')
    }
  }
  saveTemplate = (template) => {
    console.log(template);
    localStorage.setItem('test', template);
    this.setState({
      template: template
    })
  }

  render() {
    const { template } = this.state;
    return (
      <div>
        <h2>Template Builder Demo</h2>
        <h4>Editor</h4>
        <TemplateBuilder
          fields={TEMPLATE_FIELDS}
          initialTemplate={template} 
          onSave={this.saveTemplate}
        />
        <h4>Raw Jinja Template</h4>
        <code style={{whiteSpace: "pre-wrap"}}>
          {template}
        </code>
      </div>
    );
  }
}

export default App;
