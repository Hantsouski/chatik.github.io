import { anchor, i, para, span, strong } from '@thi.ng/hiccup-html';
import { Message, MessagePhoto, MessageText, TextEntity, TextEntityTypeTextUrl, isPhotoContent, isTextContent } from '../../../../state';
import { boxL, photo } from '../../../../components';

import './message.css';

interface MessageOpts {
  title: any[];
}

export const message = (message: Message, opts?: Partial<MessageOpts>) => {
  const title = opts?.title || null;

  if (isTextContent(message.content)) {
    return boxL({ borderWidth: '0', class: 'message' }, title, formattedText(message.content));
  }

  if (isPhotoContent(message.content)) {
    return photoContent(message.content);
  }

  return boxL({ borderWidth: '0', class: 'message' }, title, para({}, 'Unsupported content'));
};

const enrichment = (entity: TextEntity) => {
  switch (entity.type['@type']) {
    case 'textEntityTypeBold':
      return (text: string) => strong({}, text);

    case 'textEntityTypeItalic':
      return (text: string) => i({}, text);

    case 'textEntityTypeTextUrl':
      return (text: string) => anchor({ href: (entity.type as TextEntityTypeTextUrl).url }, text);

    case 'textEntityTypeUrl':
      return (text: string) => anchor({ href: text }, text);

    case 'textEntityTypeHashtag':
      return (text: string) => anchor({ href: 'hash'}, text);

    default:
      return (text: string) => span({}, text);
  }
};

const formattedText = (messageText: MessageText) => {
  const { entities, text } = messageText.text;
  if (!entities.length) {
    return para({}, text);
  }

  const slicedBeforeFirstEntity = text.slice(0, entities[0].offset);

  const slices: Array<string | Array<any>> = [slicedBeforeFirstEntity];

  for (const [entityIndex, entity] of entities.entries()) {
    const markup = enrichment(entity);

    const offsetEnds = entity.offset + entity.length;

    let slice = text.slice(entity.offset, offsetEnds);
    let newLines = '';
    let index = slice.length - 1;

    while (slice[index] === `\n`) {
      newLines += slice[index];
      index -= 1;
    }

    if (newLines.length) {
      slice = slice.slice(0, index + 1);
    }

    const enrichedSlice = newLines.length ? span({}, markup(slice), newLines) : markup(slice);

    slices.push(enrichedSlice);

    const nextEntity = entities[entityIndex + 1];

    if (!nextEntity) {
      const middleSlice = text.slice(offsetEnds);

      slices.push(middleSlice);

      continue;
    }

    const lastSlice = text.slice(offsetEnds, nextEntity.offset);
    slices.push(lastSlice);
  }

  return span({}, ...slices);
};

const photoContent = (messagePhoto: MessagePhoto) => {
  return photo(
    { decoding: 'async' },
    messagePhoto.photo.sizes.find((size) => size.type === 'x')?.photo || messagePhoto.photo.sizes.find((size) => size.type === 'm')!.photo
  );
};
