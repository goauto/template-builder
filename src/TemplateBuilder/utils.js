import {
  ContentState,
  Modifier,
  Entity,
  convertToRaw
} from 'draft-js';


const PLACEHOLDER_TYPE = 'PLACEHOLDER'


export const createPlaceholder = field => Entity.create(
  PLACEHOLDER_TYPE,
  'IMMUTABLE',
  { field: field }
)

export const findPlaceholders = (contentBlock, callback, contentState) => (
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === PLACEHOLDER_TYPE
      );
    },
    callback
  )
);

export const dumpTemplate = (contentState) => {
  const content = convertToRaw(contentState)
  const parts = [];

  content.blocks.forEach(block => {
    let from = 0;
    Object.keys(block.entityRanges).forEach(key => {
      const range = block.entityRanges[key];
      parts.push(block.text.substring(from, range.offset));
      parts.push(content.entityMap[range.key].data.field.value);
      from = range.offset + range.length
    });
    parts.push(block.text.substring(from, block.text.length));
    parts.push('\n');
  });

  return parts.join('');
}


export const loadTemplate = (template, fields) => {
  let content = ContentState.createFromText('');

  const addField = (content, field) => Modifier.insertText(
    content,
    content.getSelectionAfter(),
    `[${field.label}]`,
    null,
    createPlaceholder(field)
  )

  const addText = (content, text) => Modifier.insertText(
    content,
    content.getSelectionAfter(),
    text,
    null,
    null
  )

  let i = 0;
  while (i < template.length) {
    let field = fields.find(f => template.substring(i).startsWith(f.value));
    if (field && field.value.length > 0) {
      content = addField(content, field)
      i += field.value.length;
    } else {
      content = addText(content, template.charAt(i))
      i++;
    }
  }

  return content;
}


