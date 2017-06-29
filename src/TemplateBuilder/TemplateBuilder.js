import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Editor,
  EditorState,
  CompositeDecorator,
  Modifier,
} from 'draft-js';

import {
  createPlaceholder,
  findPlaceholders,
  loadTemplate,
  dumpTemplate,  
} from './utils'


const Placeholder = (props) => (
  <span className="TemplateBuilder-Editor-Placeholder" data-offset-key={props.offsetKey}>
    {props.children}
  </span>
)


const propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({label: PropTypes.string, value: PropTypes.string})
  ).isRequired,
  initialTemplate: PropTypes.string.isRequired,
  onSave: PropTypes.func
};


const defaultProps = {
  initialTemplate: '',
  fields: []
}


class TemplateBuilder extends Component {
  constructor(props) {
    super(props)
    const { initialTemplate, fields } = this.props;
    const compositeDecorator = new CompositeDecorator([
      {
        strategy: findPlaceholders,
        component: Placeholder,
        editable: false
      }
    ]);

    const content = loadTemplate(initialTemplate, fields)
    this.state = {
      editorState: EditorState.createWithContent(content, compositeDecorator),
      fields: fields,
    }

  }

  load = (template) => {
    const { editorState, fields } = this.state;
    const content = loadTemplate(template, fields);
    const newState = EditorState.push(editorState, content, 'insert-text');
    this.setState({ editorState: newState }, () => setTimeout(() => this.refs.editor.focus(), 0));
  }

  save = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    const { onSave } = this.props;
    const { editorState } = this.state;
    const content = editorState.getCurrentContent();
    const template = dumpTemplate(content);
    if (onSave) {
      onSave(template)
    }
    return template;
  }

  handleEditorChange(editorState) {
    this.setState({ editorState: editorState })
  }

  insertPlaceholder(field) {
    const { editorState } = this.state;
    const selection = editorState.getSelection()
    const currentContent = editorState.getCurrentContent();

    const newContent = Modifier.replaceText(
      currentContent,
      selection,
      `[${field.label}]`,
      null,
      createPlaceholder(field)
    )

    const newState = EditorState.push(
      editorState,
      newContent,
      'insert-text'
    )

    this.setState({ editorState: newState }, () => setTimeout(() => this.refs.editor.focus(), 0));
  }

  render() {
    const { editorState } = this.state;
    const { onSave } = this.props;
    const fields = this.state.fields.sort((a, b) => a.label > b.label ? 1 : -1)
    return (
      <div className="TemplateBuilder">
        <div className="TemplateBuilder-Menu">
          <select
            value="" 
            onChange={(evt) => evt.target.value && this.insertPlaceholder(fields[evt.target.value])}>
            <option value="">Insert Placeholder...</option>
            {fields.map((f, n) => (
              <option key={n} value={n}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="TemplateBuilder-Editor">
          <Editor
            ref="editor"
            editorState={editorState}
            onChange={(editorState) => this.handleEditorChange(editorState)}
          />
        </div>
        <div className="TemplateBuilder-Footer">
          {onSave && <button onClick={this.save}>Save</button>}
        </div>
      </div>
    );
  }
}

TemplateBuilder.propTypes = propTypes;
TemplateBuilder.defaultProps = defaultProps;

export default TemplateBuilder;