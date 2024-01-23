import { isArray } from 'lodash';
import Slugger from 'github-slugger';
import config from '@plone/volto/registry';
import { serializeNodes } from '@plone/volto-slate/editor/render';
import { Link } from 'react-router-dom';
import { getBlocks } from '@plone/volto/helpers/Blocks/Blocks';
import linkSVG from '@plone/volto/icons/link.svg';

import './less/slate-anchors.less';

export const createSlateParagraph = (text) => {
  return isArray(text) ? text : config.settings.slate.defaultValue();
};

export const serializeText = (text) => {
  return isArray(text) ? serializeNodes(text) : text;
};

export const toSlug = (url) => Slugger.slug(url);

export const waitForElm = (selector) => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

export const scrollToTarget = (target, offsetHeight = 0) => {
  const bodyRect = document.body.getBoundingClientRect().top;
  const targetRect = target.getBoundingClientRect().top;
  const targetPosition = targetRect - bodyRect - offsetHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });

  return;
};

export const openAccordionIfContainsAnchors = (anchor) => {
  waitForElm(anchor).then((elm) => {
    if (elm.closest('.accordion')) {
      const comp = elm.closest('.accordion')?.querySelector('.title');
      if (!comp?.className?.includes('active')) {
        comp.click();
        setTimeout(() => scrollToTarget(elm), 300);
      }
    }
  });

  return;
};

//post order traversal of blocks content

export const visitBlocks = (content, callback) => {
  const stack = getBlocks(content);
  while (stack.length > 0) {
    const [id, blockdata] = stack.pop();
    const wantBreak = callback([id, blockdata]);
    if (wantBreak) break;
    // assumes that a block value is like: {blocks, blocks_layout} or
    // { data: {blocks, blocks_layout}}
    if (Object.keys(blockdata || {}).indexOf('blocks') > -1) {
      stack.push(...getBlocks(blockdata));
    }
    if (Object.keys(blockdata?.data || {}).indexOf('blocks') > -1) {
      stack.push(...getBlocks(blockdata.data));
    }
  }
};

export const renderLinkElement = (tagName) => {
  function LinkElement({ attributes, children, mode = 'edit', className }) {
    const Tag = tagName;
    const slug = attributes.id || '';
    const { slate = {} } = config.settings;

    return slate.useLinkedHeadings === false ? (
      <Tag className={className} {...attributes}>
        {children}
      </Tag>
    ) : (
      <Tag className={className} {...attributes}>
        {mode === 'view' && slug && (
          <Link
            className="anchor"
            aria-hidden="true"
            tabIndex={-1}
            to={`#${slug}`}
          >
            <svg
              {...linkSVG.attributes}
              dangerouslySetInnerHTML={{ __html: linkSVG.content }}
              width="2em"
              height={null}
            ></svg>
          </Link>
        )}
        {children}
      </Tag>
    );
  }
  LinkElement.displayName = `${tagName}LinkElement`;
  return LinkElement;
};
