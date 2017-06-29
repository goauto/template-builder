# template-builder

A simple editor component that allows inserting pre-defined placeholders.


## Usage

Install...

```
yarn add "git+https://github.com/Strathcom/template-builder.git#master"
```

Add some css...

```css
.TemplateBuilder {
/*This is the main div wrapping the component*/
}

.TemplateBuilder-Menu {
/*This is div wrapping the placeholder dropdown*/
}

.TemplateBuilder-Editor {
/*This is div wrapping the editor*/
}

.TemplateBuilder-Editor-Placeholder {
/*This is span wrapping placeholders*/
    background-color: #ffc;
    color: #cf5e00;
    font-style: italic;
    display: inline-block;
}

.TemplateBuilder-Footer {
/*This is the div wrapping the save button*/
}
``` 

Use the component in your app...

```javascript
import React, { Component } from 'react';
import TemplateBuilder from 'template-builder'

const TEMPLATE_FIELDS = [
  {
    label: 'First Name',
    value: '{{ customer.first_name }}'
  },
  {
    label: 'Last Name',
    value: '{{ customer.last_name }}'
  }
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      template: localStorage.getItem('myTemplate') || ''
    }
  }
  saveTemplate = (template) => {
    localStorage.setItem('myTemplate', template);
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

```

## Developing

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

A demo app (`./src/App.js`) is included for easy local development. To get started...

```
yarn install
yarn start
``` 

...then start hacking. The source for the component is in `./src/TemplateBuilder` 

## Packaging

The `prepublish` script in `package.json` will transpile `./src/TemplateBuilder` 
into `./lib` so it can be installed as a npm package. Because other projects reference 
the package via github rather than the public npm registry, the `./lib` folder 
needs to be committed to the repo.

