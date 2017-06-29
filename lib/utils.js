'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadTemplate = exports.dumpTemplate = exports.findPlaceholders = exports.createPlaceholder = undefined;

var _draftJs = require('draft-js');

var PLACEHOLDER_TYPE = 'PLACEHOLDER';

var createPlaceholder = exports.createPlaceholder = function createPlaceholder(field) {
  return _draftJs.Entity.create(PLACEHOLDER_TYPE, 'IMMUTABLE', { field: field });
};

var findPlaceholders = exports.findPlaceholders = function findPlaceholders(contentBlock, callback, contentState) {
  return contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === PLACEHOLDER_TYPE;
  }, callback);
};

var dumpTemplate = exports.dumpTemplate = function dumpTemplate(contentState) {
  var content = (0, _draftJs.convertToRaw)(contentState);
  var parts = [];

  content.blocks.forEach(function (block) {
    var from = 0;
    Object.keys(block.entityRanges).forEach(function (key) {
      var range = block.entityRanges[key];
      parts.push(block.text.substring(from, range.offset));
      parts.push(content.entityMap[range.key].data.field.value);
      from = range.offset + range.length;
    });
    parts.push(block.text.substring(from, block.text.length));
    parts.push('\n');
  });

  return parts.join('');
};

var loadTemplate = exports.loadTemplate = function loadTemplate(template, fields) {
  var content = _draftJs.ContentState.createFromText('');

  var addField = function addField(content, field) {
    return _draftJs.Modifier.insertText(content, content.getSelectionAfter(), '[' + field.label + ']', null, createPlaceholder(field));
  };

  var addText = function addText(content, text) {
    return _draftJs.Modifier.insertText(content, content.getSelectionAfter(), text, null, null);
  };

  var i = 0;
  while (i < template.length) {
    var field = fields.find(function (f) {
      return template.substring(i).startsWith(f.value);
    });
    if (field && field.value.length > 0) {
      content = addField(content, field);
      i += field.value.length;
    } else {
      content = addText(content, template.charAt(i));
      i++;
    }
  }

  return content;
};