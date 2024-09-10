import React, { Component } from 'react';
import Loader from "../../../components/Loader";

class FilterTableLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mounted: false
        };
        this.buttonRef = React.createRef();
    }

    componentDidMount() {
        const { initialValue } = this.props;
        this.setState({ mounted: true }, () => {
            const btn = this.buttonRef.current;
            if (btn && !initialValue) {
                btn.click();
            }
        });
    }

    componentDidUpdate(prevProps) {
        const { initialValue, callBack } = this.props;
        if (this.state.mounted && initialValue === false && prevProps.initialValue !== false) {
            callBack();
        }
    }

    render() {
        const { initialValue, callBack } = this.props;
        return (
            <>
                <button ref={this.buttonRef} style={{ display: "none" }} onClick={callBack}></button>
                {!initialValue && <Loader speed={5} customText="Calculating..." />}
            </>
        );
    }
}

export default FilterTableLoader;
