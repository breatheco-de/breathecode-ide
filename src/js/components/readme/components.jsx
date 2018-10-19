import React from 'react';
import PropTypes from 'prop-types';

  //props.children[0]
export const Image = (props) => (<div className="text-center"><img src={props.src} alt={props.alt} /></div>);
Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};
  //props.children[0]
export const Anchor = (props) => (<a target="_blank" rel="noopener noreferrer" href={props.href}>{props.children[0]}</a>);
Anchor.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};