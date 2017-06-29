'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _draftJs = require('draft-js');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Placeholder = function Placeholder(props) {
  return _react2.default.createElement(
    'span',
    { className: 'TemplateBuilder-Editor-Placeholder', 'data-offset-key': props.offsetKey },
    props.children
  );
};

var propTypes = {
  fields: _propTypes2.default.arrayOf(_propTypes2.default.shape({ label: _propTypes2.default.string, value: _propTypes2.default.string })).isRequired,
  initialTemplate: _propTypes2.default.string.isRequired,
  onSave: _propTypes2.default.func
};

var defaultProps = {
  initialTemplate: '',
  fields: []
};

var TemplateBuilder = function (_Component) {
  _inherits(TemplateBuilder, _Component);

  function TemplateBuilder(props) {
    _classCallCheck(this, TemplateBuilder);

    var _this = _possibleConstructorReturn(this, (TemplateBuilder.__proto__ || Object.getPrototypeOf(TemplateBuilder)).call(this, props));

    _initialiseProps.call(_this);

    var _this$props = _this.props,
        initialTemplate = _this$props.initialTemplate,
        fields = _this$props.fields;

    var compositeDecorator = new _draftJs.CompositeDecorator([{
      strategy: _utils.findPlaceholders,
      component: Placeholder,
      editable: false
    }]);

    var content = (0, _utils.loadTemplate)(initialTemplate, fields);
    _this.state = {
      editorState: _draftJs.EditorState.createWithContent(content, compositeDecorator),
      fields: fields
    };

    return _this;
  }

  _createClass(TemplateBuilder, [{
    key: 'handleEditorChange',
    value: function handleEditorChange(editorState) {
      this.setState({ editorState: editorState });
    }
  }, {
    key: 'insertPlaceholder',
    value: function insertPlaceholder(field) {
      var _this2 = this;

      var editorState = this.state.editorState;

      var selection = editorState.getSelection();
      var currentContent = editorState.getCurrentContent();

      var newContent = _draftJs.Modifier.replaceText(currentContent, selection, '[' + field.label + ']', null, (0, _utils.createPlaceholder)(field));

      var newState = _draftJs.EditorState.push(editorState, newContent, 'insert-text');

      this.setState({ editorState: newState }, function () {
        return setTimeout(function () {
          return _this2.refs.editor.focus();
        }, 0);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var editorState = this.state.editorState;
      var onSave = this.props.onSave;

      var fields = this.state.fields.sort(function (a, b) {
        return a.label > b.label ? 1 : -1;
      });
      return _react2.default.createElement(
        'div',
        { className: 'TemplateBuilder' },
        _react2.default.createElement(
          'div',
          { className: 'TemplateBuilder-Menu' },
          _react2.default.createElement(
            'select',
            {
              value: '',
              onChange: function onChange(evt) {
                return evt.target.value && _this3.insertPlaceholder(fields[evt.target.value]);
              } },
            _react2.default.createElement(
              'option',
              { value: '' },
              'Insert Placeholder...'
            ),
            fields.map(function (f, n) {
              return _react2.default.createElement(
                'option',
                { key: n, value: n },
                f.label
              );
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'TemplateBuilder-Editor' },
          _react2.default.createElement(_draftJs.Editor, {
            ref: 'editor',
            editorState: editorState,
            onChange: function onChange(editorState) {
              return _this3.handleEditorChange(editorState);
            }
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'TemplateBuilder-Footer' },
          onSave && _react2.default.createElement(
            'button',
            { onClick: this.save },
            'Save'
          )
        )
      );
    }
  }]);

  return TemplateBuilder;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.load = function (template) {
    var _state = _this4.state,
        editorState = _state.editorState,
        fields = _state.fields;

    var content = (0, _utils.loadTemplate)(template, fields);
    var newState = _draftJs.EditorState.push(editorState, content, 'insert-text');
    _this4.setState({ editorState: newState }, function () {
      return setTimeout(function () {
        return _this4.refs.editor.focus();
      }, 0);
    });
  };

  this.save = function (evt) {
    if (evt) {
      evt.preventDefault();
    }
    var onSave = _this4.props.onSave;
    var editorState = _this4.state.editorState;

    var content = editorState.getCurrentContent();
    var template = (0, _utils.dumpTemplate)(content);
    if (onSave) {
      onSave(template);
    }
    return template;
  };
};

TemplateBuilder.propTypes = propTypes;
TemplateBuilder.defaultProps = defaultProps;

exports.default = TemplateBuilder;