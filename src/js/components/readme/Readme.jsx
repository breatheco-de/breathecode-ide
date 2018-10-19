import React from 'react';
import remark from 'remark';
import './readme.scss';

import 'prismjs/themes/prism-okaidia.css';

//import 'prismjs/themes/prism.css';
import PropTypes from 'prop-types';
import reactRenderer from 'remark-react';
import emoji from 'remark-emoji';
import PrismRenderer from './PrismLowLight.jsx';
import { Image, Anchor } from './components.jsx';
import Typography from 'typography';
import altonTheme from 'typography-theme-alton';
altonTheme.baseFontSize = "16px";
const typography = new Typography(altonTheme);
typography.injectStyles();


const Link = ({onClick, slug, children}) => (<a href={"#"+slug}>{children}</a>);
Link.propTypes = {
    children: PropTypes.object.isRequired,
    slug: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

const Instructions = ({children, readme, exercises, onPrevious, onNext }) => (<div className="bc-readme">
    {(onPrevious || onNext) ? 
        <div>
            <div className="prev-next-bar">
                {(onPrevious) ? <a className="prev-exercise" onClick={() => onPrevious()}>Previous</a>:''}
                {(onNext) ? <a className="next-exercise" onClick={() => onPrevious()}>Next</a>:''}
            </div>
        </div>:''
    }
    <div>
        {
            remark().use(emoji).use(reactRenderer, {
                remarkReactComponents: {
                    img: Image,
                    a: Anchor,
                    code: PrismRenderer,
                    pre: (props) => (typeof props.children[0] != 'string') ? 
                                        PrismRenderer(props.children[0].props) : PrismRenderer(props)
                },
                sanitize: false
            }).processSync(readme).contents
            
        }
        
        { (onPrevious) ? 
            <div>
                <h2>Ok, enough with the reading! :)</h2>
                <p>Click on any of the following exercises to read its instructions:</p>
                <ol>
                    {exercises.map(ex => (
                        <li key={ex.slug}>
                            <Link slug={ex.slug}>
                                {ex.title}
                            </Link>
                        </li>))
                    }
                </ol>
            </div>:''
        }
    </div>
</div>);

Instructions.propTypes = {
    children: PropTypes.object,
    readme: PropTypes.string.isRequired,
    exercises: PropTypes.array,
    onPrevious: PropTypes.func,
    onNext: PropTypes.func,
};

Instructions.defaultProps = {
    instructions: null,
    exercises: [],
    onPrevious: null,
    onNext: null,
};
export default Instructions;
