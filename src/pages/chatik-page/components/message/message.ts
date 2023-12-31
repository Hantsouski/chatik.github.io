import { anchor, div, i, para, span, strong } from '@thi.ng/hiccup-html';
import {
  FormattedText,
  Message,
  MessagePhoto,
  TextEntity,
  TextEntityTypeTextUrl,
  isPhotoContent,
  isTextContent,
  messagePhotoSize,
} from '../../../../state';
import { boxL, frameL, photo } from '../../../../components';

import './message.css';

interface MessageOpts {
  title: any[];
}

export const message = (message: Message, opts?: Partial<MessageOpts>) => {
  const title = opts?.title || null;

  if (isTextContent(message.content)) {
    return boxL({ borderWidth: '0', class: 'message' }, title, formattedText(message.content.text));
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
      return (text: string) => anchor({ href: 'hash' }, text);

    default:
      return (text: string) => span({}, text);
  }
};

export const formattedText = (formattedText: FormattedText) => {
  const { entities, text } = formattedText;
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
  const photoSize = messagePhotoSize(messagePhoto.photo.sizes);

  if (!photoSize) {
    return div(
      {},
    );
  }

  const ratio = `${Math.ceil((photoSize.width / photoSize.height) * 2)}:2`;

  return div(
    {},
    frameL(
      { ratio },
      photo(
        { decoding: 'async', width: photoSize.width, height: photoSize.height },
        photoSize.photo,
      ),
    ),
    messagePhoto.caption.text ? boxL({ borderWidth: '0', class: 'message' }, formattedText(messagePhoto.caption)) : ''
  );
};
