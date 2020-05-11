import React from 'react';
import PropTypes from 'prop-types';
import "./menu.scss";

const Menu = ({ exercises, onClick, className }) => <div className={`left-menu ${className}`}>
    { exercises.length > 0 ? 
        <ul>
            {exercises.map(e => <li key={e.slug} onClick={() => onClick && onClick(e)}>
                {e.done ? <i className="fas fa-check text-success"></i>
                    : <i className="fas fa-circle text-dark"></i>
                }
                <span className="ml-2">{e.title}</span>
            </li>)}
        </ul>
        :
        <div>No exercises have been loaded.</div>
    }
</div>;
Menu.propTypes = {
  exercises: PropTypes.array,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
Menu.defaultProps = {
  exercises: [],
  onClick: null,
  className: ""
};
export default Menu;