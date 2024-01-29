/**
 * Clipboard actions.
 * @module actions/clipboard/clipboard
 */

import {
  COPY_CONTENT,
  MOVE_CONTENT,
  COPY,
  CUT,
} from '@plone/volto/constants/ActionTypes';
import config from '@plone/volto/registry';

/**
 * Copy content function.
 * @function copyContent
 * @param {array} source Source urls.
 * @param {string} target Target url.
 * @returns {Object} Copy content action.
 */
export function copyContent(source, target) {
  const { settings } = config;
  let computeSource = source;
  const prefix = settings.prefixPath;
  if (prefix) {
    computeSource = source?.map((path) => path.slice(prefix.length));
  }
  return {
    type: COPY_CONTENT,
    request: {
      op: 'post',
      path: `${target}/@copy`,
      data: { source: computeSource },
    },
  };
}

/**
 * Move content function.
 * @function moveContent
 * @param {array} source Source urls.
 * @param {string} target Target url.
 * @returns {Object} Move content action.
 */
export function moveContent(source, target) {
  const { settings } = config;
  let computeSource = source;
  const prefix = settings.prefixPath;
  if (prefix) {
    computeSource = source?.map((path) => path.slice(prefix.length));
  }
  return {
    type: MOVE_CONTENT,
    request: {
      op: 'post',
      path: `${target}/@move`,
      data: { source: computeSource },
    },
  };
}

/**
 * Copy function.
 * @function copy
 * @param {array} urls Source urls.
 * @returns {Object} Copy action.
 */
export function copy(urls) {
  return {
    type: COPY,
    source: urls,
  };
}

/**
 * Cut function.
 * @function cut
 * @param {array} urls Source urls.
 * @returns {Object} Cut action.
 */
export function cut(urls) {
  return {
    type: CUT,
    source: urls,
  };
}
