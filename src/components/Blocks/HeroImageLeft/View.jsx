import React from 'react';
import PropTypes from 'prop-types';

import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import LinkMore from '@plone/volto/components/manage/LinkMore/LinkMore';
import Image from '@plone/volto/components/theme/Image/Image';

const View = ({ data }) => (
  <div className="block hero">
    <div className="block-inner-wrapper">
      {data.url && (
        <Image
          src={`${flattenToAppURL(data.url)}/@@images/image`}
          alt=""
          className="hero-image"
          loading="lazy"
        />
      )}
      <div className="hero-body">
        <div className="hero-text">
          {data.title && <h1>{data.title}</h1>}
          {data.description && <p>{data.description}</p>}
        </div>
        <LinkMore data={data} />
      </div>
    </div>
  </div>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
