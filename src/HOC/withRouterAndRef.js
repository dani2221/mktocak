import React from 'react';
import {withRouter} from 'react-router-dom'

const withRouterAndRef = (Wrapped) => {
    const WithRouter = withRouter(({ forwardRef, ...otherProps }) => (
      <Wrapped ref={forwardRef} {...otherProps} />
    ));
    const WithRouterAndRef = React.forwardRef((props, ref) => (
      <WithRouter {...props} forwardRef={ref} />
    ));
    const name = Wrapped.displayName || Wrapped.name;
    WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
    return WithRouterAndRef;
};
  
export default withRouterAndRef;