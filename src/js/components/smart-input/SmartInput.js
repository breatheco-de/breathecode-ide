import React, { useState } from "react";
import PropTypes from "prop-types";

export default class SmartInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            val: props.defaultValue
        };
    }
    render(){
        return <div>
            <input type="text" className="form-control" onChange={(e) => this.setState({ val: e.target.value })} value={this.state.val} />
            <button type="button" className="btn btn-default" onClick={() => this.props.onSave(this.state.val)}>Save</button>
        </div>;
    }
}
SmartInput.propTypes = {
    onSave: PropTypes.func,
    defaultValue: PropTypes.string,
};