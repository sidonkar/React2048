import React, {Component} from "react";
import "./Square.css"
export class NumberSquare extends Component {
    render() {
        return (
            <span className={"number n"+(this.props.value || 0)} id={this.props.id} row={this.props.row} column={this.props.column}  >
                <span className="value" >{this.props.value!==0? this.props.value : ''}</span>
            </span>
        );
    }
}